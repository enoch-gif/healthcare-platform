#!/bin/bash
# Make this file executable with: chmod +x setup_python_env.sh

# Retinal-AI Python Environment Setup Script
# This script sets up the Python environment for model training

echo "🐍 Setting up Python environment for Retinal-AI model training..."

# Check if Python 3.8+ is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
REQUIRED_VERSION="3.8"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Python $PYTHON_VERSION detected. Requires Python $REQUIRED_VERSION or higher."
    exit 1
fi

echo "✅ Python $PYTHON_VERSION detected"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
else
    echo "📦 Virtual environment already exists"
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️ Upgrading pip..."
python -m pip install --upgrade pip

# Install requirements
echo "📚 Installing Python dependencies..."
pip install -r requirements.txt

# Check TensorFlow installation
echo "🧪 Testing TensorFlow installation..."
python -c "import tensorflow as tf; print(f'TensorFlow version: {tf.__version__}'); print(f'GPU available: {tf.test.is_gpu_available()}'); print(f'CUDA built: {tf.test.is_built_with_cuda()}')"

# Create necessary directories
echo "📁 Creating training directories..."
mkdir -p models
mkdir -p logs
mkdir -p plots
mkdir -p reports
mkdir -p uploads/datasets

echo "✅ Python environment setup complete!"
echo ""
echo "🚀 To activate the environment manually, run:"
echo "   source venv/bin/activate"
echo ""
echo "🎯 To start training a model, run:"
echo "   python scripts/retinal_model_trainer.py --dataset_path /path/to/dataset --epochs 20"
echo ""
echo "📊 Example dataset structure:"
echo "   dataset/"
echo "   ├── CNV/"
echo "   ├── DME/"
echo "   ├── DRUSEN/"
echo "   └── NORMAL/"