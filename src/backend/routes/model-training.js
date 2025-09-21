// Model Training API Routes for Retinal-AI Platform
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn, exec } = require('child_process');
const WebSocket = require('ws');
const router = express.Router();

// Configure multer for dataset uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/datasets');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.zip', '.tar', '.tar.gz'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only .zip, .tar, and .tar.gz files are allowed'), false);
    }
  }
});

// Training state management
let trainingState = {
  isTraining: false,
  currentEpoch: 0,
  totalEpochs: 0,
  progress: 0,
  status: 'idle',
  metrics: {
    trainLoss: 0,
    valLoss: 0,
    trainAcc: 0,
    valAcc: 0,
    bestValAcc: 0
  },
  logs: [],
  startTime: null,
  estimatedTimeRemaining: null
};

// WebSocket connections for real-time updates
const clients = new Set();

// Helper function to broadcast updates to all connected clients
function broadcastUpdate(data) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Helper function to add log
function addLog(level, message) {
  const log = {
    timestamp: new Date().toISOString(),
    level,
    message
  };
  trainingState.logs.unshift(log);
  
  // Keep only last 100 logs
  if (trainingState.logs.length > 100) {
    trainingState.logs = trainingState.logs.slice(0, 100);
  }
  
  broadcastUpdate({ type: 'log', log });
}

// GET /api/model-training/status - Get current training status
router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: trainingState
  });
});

// POST /api/model-training/start - Start model training
router.post('/start', async (req, res) => {
  try {
    if (trainingState.isTraining) {
      return res.status(400).json({
        success: false,
        error: 'Training is already in progress'
      });
    }

    const {
      epochs = 10,
      batchSize = 32,
      learningRate = 0.001,
      datasetPath,
      modelName = 'retina_classifier',
      architecture = 'fusion_deit_resnet18'
    } = req.body;

    // Validate required parameters
    if (!datasetPath) {
      return res.status(400).json({
        success: false,
        error: 'Dataset path is required'
      });
    }

    // Reset training state
    trainingState = {
      ...trainingState,
      isTraining: true,
      currentEpoch: 0,
      totalEpochs: epochs,
      progress: 0,
      status: 'starting',
      startTime: new Date(),
      estimatedTimeRemaining: null,
      logs: []
    };

    addLog('info', `Starting training: ${modelName} with ${epochs} epochs`);
    addLog('info', `Architecture: ${architecture}, Batch size: ${batchSize}, Learning rate: ${learningRate}`);

    // Determine which Python script to use
    const isDemo = datasetPath.includes('demo') || !fs.existsSync(datasetPath);
    const scriptName = isDemo ? 'demo_training.py' : 'retinal_model_trainer.py';
    
    addLog('info', isDemo ? 'Using demo training mode' : 'Using real dataset training');

    // Prepare script arguments
    const scriptArgs = [
      '--epochs', epochs.toString(),
      '--batch-size', batchSize.toString(),
      '--learning-rate', learningRate.toString(),
      '--model-name', modelName,
      '--architecture', architecture
    ];

    if (isDemo) {
      scriptArgs.push('--demo-mode');
    } else {
      scriptArgs.push('--dataset-path', datasetPath);
    }

    const scriptPath = path.join(__dirname, '../scripts', scriptName);

    // Start Python training process
    const pythonProcess = spawn('python', [scriptPath, ...scriptArgs], {
      cwd: path.join(__dirname, '..'),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Create Python training script with parameters (fallback for advanced scenarios)
    const pythonScript = `
import tensorflow as tf
from tensorflow.keras import layers, models, optimizers, callbacks
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import ResNet50
import os
import json
import sys
from datetime import datetime
import numpy as np

# Enable GPU if available
gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
    try:
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
        print(f"GPU detected: {len(gpus)} device(s)")
    except RuntimeError as e:
        print(f"GPU setup error: {e}")

# Training configuration
EPOCHS = ${epochs}
BATCH_SIZE = ${batchSize}
LEARNING_RATE = ${learningRate}
MODEL_NAME = "${modelName}"
DATASET_PATH = "${datasetPath}"

class TrainingCallback(callbacks.Callback):
    def __init__(self):
        super().__init__()
        
    def on_epoch_begin(self, epoch, logs=None):
        progress_data = {
            "type": "epoch_start",
            "epoch": epoch + 1,
            "total_epochs": EPOCHS,
            "progress": ((epoch) / EPOCHS) * 100
        }
        print(f"PROGRESS_UPDATE:{json.dumps(progress_data)}")
        
    def on_epoch_end(self, epoch, logs=None):
        logs = logs or {}
        progress_data = {
            "type": "epoch_end",
            "epoch": epoch + 1,
            "total_epochs": EPOCHS,
            "progress": ((epoch + 1) / EPOCHS) * 100,
            "metrics": {
                "train_loss": float(logs.get('loss', 0)),
                "val_loss": float(logs.get('val_loss', 0)),
                "train_acc": float(logs.get('accuracy', 0)),
                "val_acc": float(logs.get('val_accuracy', 0))
            }
        }
        print(f"PROGRESS_UPDATE:{json.dumps(progress_data)}")
        
    def on_batch_end(self, batch, logs=None):
        if batch % 10 == 0:  # Update every 10 batches
            logs = logs or {}
            batch_data = {
                "type": "batch_update",
                "batch": batch,
                "metrics": {
                    "loss": float(logs.get('loss', 0)),
                    "accuracy": float(logs.get('accuracy', 0))
                }
            }
            print(f"BATCH_UPDATE:{json.dumps(batch_data)}")

def create_fusion_model():
    """Create DeiT + ResNet18 fusion model for retinal disease classification"""
    # Input layer
    input_layer = layers.Input(shape=(224, 224, 3))
    
    # ResNet backbone
    resnet_base = tf.keras.applications.ResNet50(
        weights='imagenet',
        include_top=False,
        input_tensor=input_layer
    )
    
    # Freeze early layers
    for layer in resnet_base.layers[:-10]:
        layer.trainable = False
    
    # Feature extraction
    x = resnet_base.output
    x = layers.GlobalAveragePooling2D()(x)
    
    # Attention mechanism (simplified transformer-like)
    attention = layers.Dense(512, activation='relu')(x)
    attention = layers.Dense(512, activation='softmax')(attention)
    attended_features = layers.Multiply()([x, attention])
    
    # Classification head
    x = layers.Dense(512, activation='relu')(attended_features)
    x = layers.Dropout(0.5)(x)
    x = layers.Dense(256, activation='relu')(x)
    x = layers.Dropout(0.3)(x)
    
    # Output layer for 4 classes: CNV, DME, Drusen, Normal
    output = layers.Dense(4, activation='softmax', name='classification')(x)
    
    model = models.Model(inputs=input_layer, outputs=output)
    return model

def prepare_data():
    """Prepare training and validation data"""
    datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=15,
        width_shift_range=0.1,
        height_shift_range=0.1,
        horizontal_flip=True,
        zoom_range=0.1,
        validation_split=0.2
    )
    
    train_generator = datagen.flow_from_directory(
        DATASET_PATH,
        target_size=(224, 224),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training',
        shuffle=True
    )
    
    val_generator = datagen.flow_from_directory(
        DATASET_PATH,
        target_size=(224, 224),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation',
        shuffle=False
    )
    
    return train_generator, val_generator

try:
    print("PROGRESS_UPDATE:" + json.dumps({"type": "initializing", "message": "Initializing model training..."}))
    
    # Prepare data
    train_gen, val_gen = prepare_data()
    
    print(f"PROGRESS_UPDATE:" + json.dumps({
        "type": "data_loaded", 
        "message": f"Data loaded - Training samples: {train_gen.samples}, Validation samples: {val_gen.samples}"
    }))
    
    # Create model
    model = create_fusion_model()
    
    # Compile model
    model.compile(
        optimizer=optimizers.Adam(learning_rate=LEARNING_RATE),
        loss='categorical_crossentropy',
        metrics=['accuracy', 'top_2_accuracy']
    )
    
    print("PROGRESS_UPDATE:" + json.dumps({"type": "model_compiled", "message": "Model compiled successfully"}))
    
    # Callbacks
    training_callback = TrainingCallback()
    
    early_stopping = callbacks.EarlyStopping(
        monitor='val_accuracy',
        patience=5,
        restore_best_weights=True
    )
    
    model_checkpoint = callbacks.ModelCheckpoint(
        f'models/{MODEL_NAME}_best.h5',
        monitor='val_accuracy',
        save_best_only=True,
        save_weights_only=False
    )
    
    reduce_lr = callbacks.ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=3,
        min_lr=1e-7
    )
    
    # Start training
    print("PROGRESS_UPDATE:" + json.dumps({"type": "training_start", "message": "Starting model training..."}))
    
    history = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=EPOCHS,
        callbacks=[training_callback, early_stopping, model_checkpoint, reduce_lr],
        verbose=1
    )
    
    # Save final model
    model.save(f'models/{MODEL_NAME}_final.h5')
    
    # Save training history
    history_data = {
        'history': {k: [float(x) for x in v] for k, v in history.history.items()},
        'model_name': MODEL_NAME,
        'training_params': {
            'epochs': EPOCHS,
            'batch_size': BATCH_SIZE,
            'learning_rate': LEARNING_RATE
        },
        'final_metrics': {
            'val_accuracy': float(max(history.history['val_accuracy'])),
            'val_loss': float(min(history.history['val_loss']))
        }
    }
    
    with open(f'models/{MODEL_NAME}_history.json', 'w') as f:
        json.dump(history_data, f, indent=2)
    
    print("PROGRESS_UPDATE:" + json.dumps({
        "type": "training_complete", 
        "message": "Training completed successfully!",
        "final_accuracy": float(max(history.history['val_accuracy']))
    }))

except Exception as e:
    print(f"TRAINING_ERROR:{str(e)}")
    sys.exit(1)
`;

    // Only write custom script if not using predefined scripts
    if (!isDemo && !fs.existsSync(scriptPath)) {
      // Write Python script to file (fallback)
      const fallbackScriptPath = path.join(__dirname, '../scripts/train_model.py');
      fs.writeFileSync(fallbackScriptPath, pythonScript);
    }

    // Handle stdout (progress updates)
    pythonProcess.stdout.on('data', (data) => {
      const output = data.toString();
      
      if (output.includes('PROGRESS_UPDATE:')) {
        try {
          const progressData = JSON.parse(output.split('PROGRESS_UPDATE:')[1]);
          
          if (progressData.type === 'epoch_end') {
            trainingState.currentEpoch = progressData.epoch;
            trainingState.progress = progressData.progress;
            trainingState.metrics = {
              trainLoss: progressData.metrics.train_loss,
              valLoss: progressData.metrics.val_loss,
              trainAcc: progressData.metrics.train_acc,
              valAcc: progressData.metrics.val_acc,
              bestValAcc: Math.max(trainingState.metrics.bestValAcc, progressData.metrics.val_acc)
            };
            trainingState.status = 'training';
            
            addLog('info', `Epoch ${progressData.epoch}/${progressData.total_epochs} - Val Acc: ${(progressData.metrics.val_acc * 100).toFixed(2)}%`);
          }
          
          broadcastUpdate({ type: 'progress', data: progressData });
        } catch (e) {
          console.error('Error parsing progress data:', e);
        }
      } else if (output.includes('BATCH_UPDATE:')) {
        try {
          const batchData = JSON.parse(output.split('BATCH_UPDATE:')[1]);
          broadcastUpdate({ type: 'batch', data: batchData });
        } catch (e) {
          console.error('Error parsing batch data:', e);
        }
      } else {
        addLog('info', output.trim());
      }
    });

    // Handle stderr
    pythonProcess.stderr.on('data', (data) => {
      const error = data.toString();
      if (error.includes('TRAINING_ERROR:')) {
        const errorMessage = error.split('TRAINING_ERROR:')[1];
        addLog('error', `Training error: ${errorMessage}`);
        trainingState.status = 'error';
      } else {
        addLog('warning', error.trim());
      }
    });

    // Handle process completion
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        trainingState.status = 'completed';
        trainingState.isTraining = false;
        addLog('success', 'Training completed successfully!');
      } else {
        trainingState.status = 'error';
        trainingState.isTraining = false;
        addLog('error', `Training failed with exit code ${code}`);
      }
      
      broadcastUpdate({ type: 'training_finished', status: trainingState.status });
    });

    // Store process reference for potential stopping
    req.app.locals.trainingProcess = pythonProcess;

    res.json({
      success: true,
      message: 'Training started successfully',
      data: trainingState
    });

  } catch (error) {
    console.error('Training start error:', error);
    trainingState.status = 'error';
    trainingState.isTraining = false;
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/model-training/stop - Stop training
router.post('/stop', (req, res) => {
  try {
    const trainingProcess = req.app.locals.trainingProcess;
    
    if (trainingProcess && !trainingProcess.killed) {
      trainingProcess.kill('SIGTERM');
      
      setTimeout(() => {
        if (!trainingProcess.killed) {
          trainingProcess.kill('SIGKILL');
        }
      }, 5000);
    }
    
    trainingState.status = 'stopped';
    trainingState.isTraining = false;
    addLog('warning', 'Training stopped by user');
    
    broadcastUpdate({ type: 'training_stopped' });
    
    res.json({
      success: true,
      message: 'Training stopped successfully'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/model-training/dataset/upload - Upload dataset
router.post('/dataset/upload', upload.single('dataset'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No dataset file uploaded'
      });
    }

    const { originalname, filename, path: filePath, size } = req.file;
    const extractPath = path.join(__dirname, '../uploads/datasets/extracted', path.parse(filename).name);

    // Create extraction directory
    if (!fs.existsSync(extractPath)) {
      fs.mkdirSync(extractPath, { recursive: true });
    }

    // Extract dataset based on file type
    const ext = path.extname(originalname).toLowerCase();
    let extractCommand;

    if (ext === '.zip') {
      extractCommand = `unzip -o "${filePath}" -d "${extractPath}"`;
    } else if (ext === '.tar') {
      extractCommand = `tar -xf "${filePath}" -C "${extractPath}"`;
    } else if (ext.includes('.tar.gz')) {
      extractCommand = `tar -xzf "${filePath}" -C "${extractPath}"`;
    }

    // Execute extraction
    exec(extractCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('Extraction error:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to extract dataset'
        });
      }

      // Analyze dataset structure
      const datasetInfo = analyzeDataset(extractPath);
      
      res.json({
        success: true,
        message: 'Dataset uploaded and extracted successfully',
        data: {
          filename: originalname,
          size,
          extractPath,
          datasetInfo
        }
      });
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/model-training/models - Get available models
router.get('/models', (req, res) => {
  try {
    const modelsPath = path.join(__dirname, '../models');
    
    if (!fs.existsSync(modelsPath)) {
      fs.mkdirSync(modelsPath, { recursive: true });
    }

    const modelFiles = fs.readdirSync(modelsPath)
      .filter(file => file.endsWith('.h5'))
      .map(file => {
        const filePath = path.join(modelsPath, file);
        const stats = fs.statSync(filePath);
        
        return {
          id: path.parse(file).name,
          name: file,
          path: filePath,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        };
      });

    res.json({
      success: true,
      data: modelFiles
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Helper function to analyze dataset structure
function analyzeDataset(datasetPath) {
  try {
    const classes = {};
    let totalImages = 0;

    const items = fs.readdirSync(datasetPath);
    
    items.forEach(item => {
      const itemPath = path.join(datasetPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        const images = fs.readdirSync(itemPath)
          .filter(file => /\.(jpg|jpeg|png|tiff?)$/i.test(file));
        
        classes[item] = images.length;
        totalImages += images.length;
      }
    });

    return {
      classes,
      totalImages,
      classCount: Object.keys(classes).length,
      isValid: Object.keys(classes).length >= 2 && totalImages > 0
    };

  } catch (error) {
    console.error('Dataset analysis error:', error);
    return {
      classes: {},
      totalImages: 0,
      classCount: 0,
      isValid: false,
      error: error.message
    };
  }
}

// WebSocket endpoint for real-time updates
router.ws = (wss) => {
  wss.on('connection', (ws) => {
    clients.add(ws);
    
    // Send current training state to new client
    ws.send(JSON.stringify({
      type: 'initial_state',
      data: trainingState
    }));
    
    ws.on('close', () => {
      clients.delete(ws);
    });
  });
};

module.exports = router;