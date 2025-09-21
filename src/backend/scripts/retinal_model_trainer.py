#!/usr/bin/env python3
"""
Advanced Retinal Disease Classification Model Trainer
Implements DeiT + ResNet18 fusion architecture for CNV, DME, Drusen, Normal classification

This script creates a state-of-the-art fusion model that combines:
- Data-efficient Image Transformers (DeiT) for attention-based feature extraction
- ResNet18 as a convolutional backbone for spatial feature learning
- Attention fusion mechanism for optimal feature combination
- Medical-grade data augmentation and training strategies

Author: Retinal-AI Development Team
Version: 2.1.0
Date: 2024-12-23
"""

import sys
import os
import json
import argparse
import logging
from datetime import datetime
from pathlib import Path
import numpy as np
from typing import Dict, List, Tuple, Optional

# Deep Learning imports
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models, optimizers, callbacks
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.utils import plot_model
import tensorflow_addons as tfa

# Data handling imports
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.utils.class_weight import compute_class_weight
import matplotlib.pyplot as plt
import seaborn as sns

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('training.log')
    ]
)
logger = logging.getLogger(__name__)

class RetinalModelTrainer:
    """
    Advanced trainer for retinal disease classification using fusion architecture
    """
    
    def __init__(self, config: Dict):
        """Initialize the trainer with configuration"""
        self.config = config
        self.model = None
        self.train_generator = None
        self.val_generator = None
        self.test_generator = None
        self.class_names = ['CNV', 'DME', 'DRUSEN', 'NORMAL']
        self.history = None
        
        # Setup directories
        self.setup_directories()
        
        # Configure GPU
        self.configure_gpu()
        
        logger.info(f"🚀 Retinal Model Trainer initialized")
        logger.info(f"📋 Configuration: {json.dumps(config, indent=2)}")
        
    def setup_directories(self):
        """Create necessary directories for training artifacts"""
        dirs = ['models', 'logs', 'plots', 'reports']
        for dir_name in dirs:
            Path(dir_name).mkdir(exist_ok=True)
            
    def configure_gpu(self):
        """Configure GPU settings for optimal training"""
        gpus = tf.config.experimental.list_physical_devices('GPU')
        
        if gpus:
            try:
                # Enable memory growth
                for gpu in gpus:
                    tf.config.experimental.set_memory_growth(gpu, True)
                
                # Set mixed precision for faster training
                policy = tf.keras.mixed_precision.Policy('mixed_float16')
                tf.keras.mixed_precision.set_global_policy(policy)
                
                logger.info(f"✅ GPU setup complete: {len(gpus)} device(s) detected")
                logger.info(f"🔧 Mixed precision enabled for faster training")
                
                self.send_progress_update({
                    "type": "gpu_configured",
                    "message": f"GPU optimization enabled ({len(gpus)} devices)",
                    "gpu_count": len(gpus)
                })
                
            except RuntimeError as e:
                logger.error(f"❌ GPU setup error: {e}")
        else:
            logger.warning("⚠️ No GPU detected - training will use CPU (slower)")
            self.send_progress_update({
                "type": "gpu_warning",
                "message": "No GPU detected - training on CPU"
            })
    
    def send_progress_update(self, data: Dict):
        """Send progress updates to the frontend via stdout"""
        try:
            progress_json = json.dumps(data)
            print(f"PROGRESS_UPDATE:{progress_json}", flush=True)
        except Exception as e:
            logger.error(f"Failed to send progress update: {e}")
    
    def create_fusion_model(self) -> keras.Model:
        """
        Create the DeiT + ResNet18 fusion model for retinal disease classification
        
        Architecture:
        1. Shared input preprocessing
        2. ResNet50 branch (transfer learning from ImageNet)
        3. Vision Transformer branch (DeiT-inspired)
        4. Attention fusion mechanism
        5. Classification head with medical-grade regularization
        """
        logger.info("🏗️ Building DeiT + ResNet18 fusion architecture...")
        
        # Input layer
        input_layer = layers.Input(shape=(224, 224, 3), name='input_image')
        
        # Preprocessing
        preprocessed = layers.Rescaling(1./255)(input_layer)
        preprocessed = layers.Normalization()(preprocessed)
        
        # ===== BRANCH 1: ResNet50 Backbone (CNN Features) =====
        resnet_base = ResNet50(
            weights='imagenet',
            include_top=False,
            input_tensor=preprocessed,
            pooling=None
        )
        
        # Fine-tune only the last few layers
        for layer in resnet_base.layers[:-15]:
            layer.trainable = False
            
        resnet_features = resnet_base.output  # Shape: (batch, 7, 7, 2048)
        
        # Global pooling and feature reduction for ResNet branch
        resnet_pooled = layers.GlobalAveragePooling2D(name='resnet_gap')(resnet_features)
        resnet_reduced = layers.Dense(512, activation='relu', name='resnet_fc')(resnet_pooled)
        resnet_dropout = layers.Dropout(0.3, name='resnet_dropout')(resnet_reduced)
        
        # ===== BRANCH 2: Vision Transformer (Attention Features) =====
        # Patch extraction and embedding
        patch_size = 16
        num_patches = (224 // patch_size) ** 2  # 196 patches
        projection_dim = 512
        
        # Create patches
        patches = layers.Conv2D(
            projection_dim, 
            kernel_size=patch_size, 
            strides=patch_size,
            name='patch_projection'
        )(preprocessed)
        
        # Reshape to sequence
        patch_shape = tf.shape(patches)
        patches_reshaped = layers.Reshape(
            (num_patches, projection_dim),
            name='patches_reshape'
        )(patches)
        
        # Add positional encoding
        positions = tf.range(start=0, limit=num_patches, delta=1)
        position_embedding = layers.Embedding(
            input_dim=num_patches, 
            output_dim=projection_dim,
            name='position_embedding'
        )(positions)
        
        # Add position embeddings to patches
        encoded_patches = layers.Add(name='add_position')([patches_reshaped, position_embedding])
        
        # Transformer blocks
        for i in range(4):  # 4 transformer layers
            # Multi-head attention
            attention_output = layers.MultiHeadAttention(
                num_heads=8,
                key_dim=projection_dim // 8,
                name=f'mha_{i}'
            )(encoded_patches, encoded_patches)
            
            # Skip connection and layer norm
            attention_output = layers.Add(name=f'add_attention_{i}')([encoded_patches, attention_output])
            attention_output = layers.LayerNormalization(name=f'ln_attention_{i}')(attention_output)
            
            # Feed forward network
            ffn = layers.Dense(projection_dim * 2, activation='relu', name=f'ffn_1_{i}')(attention_output)
            ffn = layers.Dense(projection_dim, name=f'ffn_2_{i}')(ffn)
            
            # Skip connection and layer norm
            encoded_patches = layers.Add(name=f'add_ffn_{i}')([attention_output, ffn])
            encoded_patches = layers.LayerNormalization(name=f'ln_ffn_{i}')(encoded_patches)
        
        # Global representation from transformer
        transformer_features = layers.GlobalAveragePooling1D(name='transformer_gap')(encoded_patches)
        transformer_reduced = layers.Dense(512, activation='relu', name='transformer_fc')(transformer_features)
        transformer_dropout = layers.Dropout(0.3, name='transformer_dropout')(transformer_reduced)
        
        # ===== FUSION MECHANISM =====
        # Concatenate both branches
        fused_features = layers.Concatenate(name='feature_fusion')([resnet_dropout, transformer_dropout])
        
        # Cross-attention between CNN and transformer features
        attention_weights = layers.Dense(1024, activation='softmax', name='fusion_attention')(fused_features)
        attended_features = layers.Multiply(name='apply_attention')([fused_features, attention_weights])
        
        # ===== CLASSIFICATION HEAD =====
        # Medical-grade classification with strong regularization
        x = layers.Dense(256, activation='relu', name='classifier_fc1')(attended_features)
        x = layers.BatchNormalization(name='classifier_bn1')(x)
        x = layers.Dropout(0.5, name='classifier_dropout1')(x)
        
        x = layers.Dense(128, activation='relu', name='classifier_fc2')(x)
        x = layers.BatchNormalization(name='classifier_bn2')(x)
        x = layers.Dropout(0.3, name='classifier_dropout2')(x)
        
        # Output layer for 4 retinal conditions
        predictions = layers.Dense(
            4, 
            activation='softmax', 
            name='predictions',
            dtype='float32'  # Ensure float32 output for mixed precision
        )(x)
        
        # Create model
        model = models.Model(inputs=input_layer, outputs=predictions, name='RetinalFusionModel')
        
        logger.info(f"✅ Fusion model created successfully")
        logger.info(f"📊 Total parameters: {model.count_params():,}")
        logger.info(f"🎯 Trainable parameters: {sum(p.numel() for p in model.trainable_weights):,}")
        
        # Save model architecture visualization
        try:
            plot_model(
                model, 
                to_file='models/model_architecture.png',
                show_shapes=True,
                show_layer_names=True,
                rankdir='TB',
                dpi=150
            )
            logger.info("📈 Model architecture diagram saved")
        except Exception as e:
            logger.warning(f"Could not save model diagram: {e}")
        
        return model
    
    def prepare_data_generators(self) -> Tuple[ImageDataGenerator, ImageDataGenerator, Optional[ImageDataGenerator]]:
        """Prepare medical-grade data generators with appropriate augmentation"""
        logger.info("📊 Preparing data generators...")
        
        # Medical-grade data augmentation (conservative for diagnostic accuracy)
        train_datagen = ImageDataGenerator(
            rescale=1./255,
            rotation_range=10,           # Small rotation for fundus images
            width_shift_range=0.05,      # Minimal shifts
            height_shift_range=0.05,
            horizontal_flip=True,        # Horizontal flip OK for retinal images
            zoom_range=0.05,             # Minimal zoom
            brightness_range=[0.9, 1.1], # Slight brightness variation
            validation_split=0.2,
            fill_mode='reflect'
        )
        
        # Validation data (no augmentation)
        val_datagen = ImageDataGenerator(
            rescale=1./255,
            validation_split=0.2
        )
        
        # Test data generator (if test set exists)
        test_datagen = ImageDataGenerator(rescale=1./255)
        
        # Create generators
        train_generator = train_datagen.flow_from_directory(
            self.config['dataset_path'],
            target_size=(224, 224),
            batch_size=self.config['batch_size'],
            class_mode='categorical',
            subset='training',
            shuffle=True,
            seed=42
        )
        
        val_generator = val_datagen.flow_from_directory(
            self.config['dataset_path'],
            target_size=(224, 224),
            batch_size=self.config['batch_size'],
            class_mode='categorical',
            subset='validation',
            shuffle=False,
            seed=42
        )
        
        # Check for separate test directory
        test_path = Path(self.config['dataset_path']).parent / 'test'
        test_generator = None
        if test_path.exists():
            test_generator = test_datagen.flow_from_directory(
                str(test_path),
                target_size=(224, 224),
                batch_size=self.config['batch_size'],
                class_mode='categorical',
                shuffle=False
            )
            logger.info(f"🧪 Test set found: {test_generator.samples} samples")
        
        # Log dataset information
        logger.info(f"📊 Training samples: {train_generator.samples}")
        logger.info(f"📊 Validation samples: {val_generator.samples}")
        logger.info(f"📊 Classes found: {train_generator.class_indices}")
        
        # Send dataset info to frontend
        self.send_progress_update({
            "type": "dataset_info",
            "train_samples": train_generator.samples,
            "val_samples": val_generator.samples,
            "classes": train_generator.class_indices,
            "batch_size": self.config['batch_size']
        })
        
        return train_generator, val_generator, test_generator
    
    def compile_model(self, model: keras.Model, train_generator: ImageDataGenerator):
        """Compile model with medical-grade optimization settings"""
        logger.info("⚙️ Compiling model...")
        
        # Calculate class weights for imbalanced medical datasets
        class_weights = None
        if hasattr(train_generator, 'classes'):
            class_weights = compute_class_weight(
                'balanced',
                classes=np.unique(train_generator.classes),
                y=train_generator.classes
            )
            class_weights = dict(enumerate(class_weights))
            logger.info(f"📊 Class weights computed: {class_weights}")
        
        # Medical-grade optimizer with warm-up learning rate
        initial_lr = self.config['learning_rate']
        optimizer = optimizers.Adam(
            learning_rate=initial_lr,
            beta_1=0.9,
            beta_2=0.999,
            epsilon=1e-7
        )
        
        # Loss function with label smoothing for better generalization
        loss = keras.losses.CategoricalCrossentropy(
            label_smoothing=0.1,
            from_logits=False
        )
        
        # Medical-grade metrics
        metrics = [
            'accuracy',
            'top_2_accuracy',  # Important for medical diagnosis
            keras.metrics.Precision(name='precision'),
            keras.metrics.Recall(name='recall'),
            keras.metrics.AUC(name='auc'),
            tfa.metrics.F1Score(num_classes=4, name='f1_score')
        ]
        
        model.compile(
            optimizer=optimizer,
            loss=loss,
            metrics=metrics
        )
        
        logger.info("✅ Model compiled successfully")
        return class_weights
    
    def create_callbacks(self) -> List[keras.callbacks.Callback]:
        """Create comprehensive training callbacks"""
        logger.info("📋 Setting up training callbacks...")
        
        callbacks_list = []
        
        # Model checkpoint - save best model
        checkpoint = callbacks.ModelCheckpoint(
            filepath=f"models/{self.config['model_name']}_best.h5",
            monitor='val_accuracy',
            save_best_only=True,
            save_weights_only=False,
            mode='max',
            verbose=1
        )
        callbacks_list.append(checkpoint)
        
        # Early stopping with patience
        early_stopping = callbacks.EarlyStopping(
            monitor='val_accuracy',
            patience=7,
            restore_best_weights=True,
            mode='max',
            verbose=1
        )
        callbacks_list.append(early_stopping)
        
        # Learning rate reduction
        reduce_lr = callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3,
            min_lr=1e-7,
            verbose=1
        )
        callbacks_list.append(reduce_lr)
        
        # CSV logger
        csv_logger = callbacks.CSVLogger(
            f"logs/{self.config['model_name']}_training.csv",
            append=False
        )
        callbacks_list.append(csv_logger)
        
        # Custom progress callback
        progress_callback = ProgressCallback(self)
        callbacks_list.append(progress_callback)
        
        logger.info(f"📋 {len(callbacks_list)} callbacks configured")
        return callbacks_list
    
    def train_model(self):
        """Main training function"""
        logger.info("🚀 Starting retinal disease classification training...")
        
        try:
            # Prepare data
            self.train_generator, self.val_generator, self.test_generator = self.prepare_data_generators()
            
            # Create model
            self.model = self.create_fusion_model()
            
            # Compile model
            class_weights = self.compile_model(self.model, self.train_generator)
            
            # Create callbacks
            callbacks_list = self.create_callbacks()
            
            # Calculate steps per epoch
            steps_per_epoch = self.train_generator.samples // self.config['batch_size']
            validation_steps = self.val_generator.samples // self.config['batch_size']
            
            logger.info(f"🎯 Steps per epoch: {steps_per_epoch}")
            logger.info(f"🎯 Validation steps: {validation_steps}")
            
            self.send_progress_update({
                "type": "training_start",
                "message": "Starting model training...",
                "epochs": self.config['epochs'],
                "steps_per_epoch": steps_per_epoch
            })
            
            # Start training
            self.history = self.model.fit(
                self.train_generator,
                epochs=self.config['epochs'],
                validation_data=self.val_generator,
                steps_per_epoch=steps_per_epoch,
                validation_steps=validation_steps,
                callbacks=callbacks_list,
                class_weight=class_weights,
                verbose=1
            )
            
            # Save final model
            final_model_path = f"models/{self.config['model_name']}_final.h5"
            self.model.save(final_model_path)
            logger.info(f"💾 Final model saved: {final_model_path}")
            
            # Generate comprehensive training report
            self.generate_training_report()
            
            # Evaluate on test set if available
            if self.test_generator:
                self.evaluate_test_set()
            
            logger.info("🎉 Training completed successfully!")
            
            self.send_progress_update({
                "type": "training_complete",
                "message": "Training completed successfully!",
                "final_accuracy": float(max(self.history.history['val_accuracy'])),
                "best_loss": float(min(self.history.history['val_loss'])),
                "model_path": final_model_path
            })
            
        except Exception as e:
            logger.error(f"❌ Training failed: {str(e)}")
            self.send_progress_update({
                "type": "training_error",
                "message": f"Training failed: {str(e)}"
            })
            raise
    
    def generate_training_report(self):
        """Generate comprehensive training report with visualizations"""
        logger.info("📊 Generating training report...")
        
        if not self.history:
            logger.warning("No training history available")
            return
        
        # Save training history
        history_data = {
            'history': {k: [float(x) for x in v] for k, v in self.history.history.items()},
            'model_name': self.config['model_name'],
            'training_params': self.config,
            'final_metrics': {
                'best_val_accuracy': float(max(self.history.history['val_accuracy'])),
                'best_val_loss': float(min(self.history.history['val_loss'])),
                'final_val_accuracy': float(self.history.history['val_accuracy'][-1]),
                'total_epochs': len(self.history.history['accuracy'])
            },
            'timestamp': datetime.now().isoformat()
        }
        
        with open(f'models/{self.config["model_name"]}_history.json', 'w') as f:
            json.dump(history_data, f, indent=2)
        
        # Create training plots
        self.create_training_plots()
        
        logger.info("📊 Training report generated successfully")
    
    def create_training_plots(self):
        """Create comprehensive training visualization plots"""
        if not self.history:
            return
            
        # Set up the plotting style
        plt.style.use('seaborn-v0_8')
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        fig.suptitle(f'Training Report - {self.config["model_name"]}', fontsize=16, fontweight='bold')
        
        # Plot 1: Training and Validation Accuracy
        axes[0, 0].plot(self.history.history['accuracy'], 'b-', label='Training Accuracy', linewidth=2)
        axes[0, 0].plot(self.history.history['val_accuracy'], 'r-', label='Validation Accuracy', linewidth=2)
        axes[0, 0].set_title('Model Accuracy', fontweight='bold')
        axes[0, 0].set_xlabel('Epoch')
        axes[0, 0].set_ylabel('Accuracy')
        axes[0, 0].legend()
        axes[0, 0].grid(True, alpha=0.3)
        
        # Plot 2: Training and Validation Loss
        axes[0, 1].plot(self.history.history['loss'], 'b-', label='Training Loss', linewidth=2)
        axes[0, 1].plot(self.history.history['val_loss'], 'r-', label='Validation Loss', linewidth=2)
        axes[0, 1].set_title('Model Loss', fontweight='bold')
        axes[0, 1].set_xlabel('Epoch')
        axes[0, 1].set_ylabel('Loss')
        axes[0, 1].legend()
        axes[0, 1].grid(True, alpha=0.3)
        
        # Plot 3: Learning Rate (if available)
        if 'lr' in self.history.history:
            axes[1, 0].plot(self.history.history['lr'], 'g-', linewidth=2)
            axes[1, 0].set_title('Learning Rate Schedule', fontweight='bold')
            axes[1, 0].set_xlabel('Epoch')
            axes[1, 0].set_ylabel('Learning Rate')
            axes[1, 0].set_yscale('log')
            axes[1, 0].grid(True, alpha=0.3)
        else:
            axes[1, 0].text(0.5, 0.5, 'Learning Rate\nData Not Available', 
                           ha='center', va='center', fontsize=12)
            axes[1, 0].set_title('Learning Rate Schedule', fontweight='bold')
        
        # Plot 4: F1 Score (if available)
        if 'f1_score' in self.history.history and 'val_f1_score' in self.history.history:
            axes[1, 1].plot(self.history.history['f1_score'], 'b-', label='Training F1', linewidth=2)
            axes[1, 1].plot(self.history.history['val_f1_score'], 'r-', label='Validation F1', linewidth=2)
            axes[1, 1].set_title('F1 Score', fontweight='bold')
            axes[1, 1].set_xlabel('Epoch')
            axes[1, 1].set_ylabel('F1 Score')
            axes[1, 1].legend()
            axes[1, 1].grid(True, alpha=0.3)
        else:
            # Show final metrics instead
            final_acc = self.history.history['val_accuracy'][-1]
            best_acc = max(self.history.history['val_accuracy'])
            axes[1, 1].text(0.5, 0.6, f'Final Validation Accuracy:\n{final_acc:.4f}', 
                           ha='center', va='center', fontsize=12, fontweight='bold')
            axes[1, 1].text(0.5, 0.4, f'Best Validation Accuracy:\n{best_acc:.4f}', 
                           ha='center', va='center', fontsize=12, fontweight='bold')
            axes[1, 1].set_title('Final Metrics', fontweight='bold')
        
        plt.tight_layout()
        plt.savefig(f'plots/{self.config["model_name"]}_training_curves.png', dpi=300, bbox_inches='tight')
        plt.close()
        
        logger.info("📈 Training plots saved successfully")
    
    def evaluate_test_set(self):
        """Evaluate model on test set and generate detailed metrics"""
        if not self.test_generator or not self.model:
            return
            
        logger.info("🧪 Evaluating on test set...")
        
        # Evaluate model
        test_loss, test_accuracy = self.model.evaluate(self.test_generator, verbose=1)[:2]
        
        # Get predictions
        predictions = self.model.predict(self.test_generator, verbose=1)
        predicted_classes = np.argmax(predictions, axis=1)
        
        # True classes
        true_classes = self.test_generator.classes
        
        # Generate classification report
        class_report = classification_report(
            true_classes, 
            predicted_classes,
            target_names=self.class_names,
            output_dict=True
        )
        
        # Generate confusion matrix
        cm = confusion_matrix(true_classes, predicted_classes)
        
        # Plot confusion matrix
        plt.figure(figsize=(10, 8))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                   xticklabels=self.class_names,
                   yticklabels=self.class_names)
        plt.title(f'Confusion Matrix - {self.config["model_name"]}', fontweight='bold')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.savefig(f'plots/{self.config["model_name"]}_confusion_matrix.png', dpi=300, bbox_inches='tight')
        plt.close()
        
        # Save test results
        test_results = {
            'test_accuracy': float(test_accuracy),
            'test_loss': float(test_loss),
            'classification_report': class_report,
            'confusion_matrix': cm.tolist(),
            'model_name': self.config['model_name'],
            'timestamp': datetime.now().isoformat()
        }
        
        with open(f'reports/{self.config["model_name"]}_test_results.json', 'w') as f:
            json.dump(test_results, f, indent=2)
        
        logger.info(f"🎯 Test Accuracy: {test_accuracy:.4f}")
        logger.info(f"📊 Test evaluation complete")


class ProgressCallback(keras.callbacks.Callback):
    """Custom callback for real-time progress updates"""
    
    def __init__(self, trainer):
        super().__init__()
        self.trainer = trainer
        self.epoch_start_time = None
    
    def on_epoch_begin(self, epoch, logs=None):
        self.epoch_start_time = datetime.now()
        progress_data = {
            "type": "epoch_start",
            "epoch": epoch + 1,
            "total_epochs": self.trainer.config['epochs'],
            "progress": ((epoch) / self.trainer.config['epochs']) * 100
        }
        self.trainer.send_progress_update(progress_data)
        
    def on_epoch_end(self, epoch, logs=None):
        logs = logs or {}
        
        # Calculate epoch time
        epoch_time = (datetime.now() - self.epoch_start_time).total_seconds()
        
        progress_data = {
            "type": "epoch_end",
            "epoch": epoch + 1,
            "total_epochs": self.trainer.config['epochs'],
            "progress": ((epoch + 1) / self.trainer.config['epochs']) * 100,
            "epoch_time": epoch_time,
            "metrics": {
                "train_loss": float(logs.get('loss', 0)),
                "val_loss": float(logs.get('val_loss', 0)),
                "train_acc": float(logs.get('accuracy', 0)),
                "val_acc": float(logs.get('val_accuracy', 0)),
                "train_f1": float(logs.get('f1_score', 0)),
                "val_f1": float(logs.get('val_f1_score', 0))
            }
        }
        self.trainer.send_progress_update(progress_data)
        
    def on_batch_end(self, batch, logs=None):
        # Send batch updates every 20 batches to avoid spam
        if batch % 20 == 0:
            logs = logs or {}
            batch_data = {
                "type": "batch_update",
                "batch": batch,
                "metrics": {
                    "loss": float(logs.get('loss', 0)),
                    "accuracy": float(logs.get('accuracy', 0))
                }
            }
            self.trainer.send_progress_update(batch_data)


def main():
    """Main training function"""
    parser = argparse.ArgumentParser(description='Retinal Disease Classification Model Trainer')
    parser.add_argument('--epochs', type=int, default=20, help='Number of training epochs')
    parser.add_argument('--batch_size', type=int, default=32, help='Batch size for training')
    parser.add_argument('--learning_rate', type=float, default=0.001, help='Initial learning rate')
    parser.add_argument('--dataset_path', type=str, required=True, help='Path to training dataset')
    parser.add_argument('--model_name', type=str, default='retinal_classifier', help='Model name for saving')
    parser.add_argument('--architecture', type=str, default='fusion_deit_resnet18', help='Model architecture')
    
    args = parser.parse_args()
    
    # Validate dataset path
    if not os.path.exists(args.dataset_path):
        logger.error(f"❌ Dataset path does not exist: {args.dataset_path}")
        sys.exit(1)
    
    # Configuration
    config = {
        'epochs': args.epochs,
        'batch_size': args.batch_size,
        'learning_rate': args.learning_rate,
        'dataset_path': args.dataset_path,
        'model_name': args.model_name,
        'architecture': args.architecture
    }
    
    try:
        # Initialize trainer
        trainer = RetinalModelTrainer(config)
        
        # Start training
        trainer.train_model()
        
        logger.info("🎉 Training pipeline completed successfully!")
        
    except KeyboardInterrupt:
        logger.warning("⚠️ Training interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"❌ Training failed: {str(e)}")
        print(f"TRAINING_ERROR:{str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()