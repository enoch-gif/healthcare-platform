import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Alert, AlertDescription } from '../../ui/alert';
import { 
  Play, 
  Pause, 
  Square, 
  Zap,
  AlertCircle,
  CheckCircle,
  Settings,
  Upload,
  Database,
  Brain
} from 'lucide-react';

interface TrainingControlsProps {
  trainingStatus: string;
  onStart: (config: TrainingConfig) => void;
  onPause: () => void;
  onStop: () => void;
}

interface TrainingConfig {
  epochs: number;
  batchSize: number;
  learningRate: number;
  datasetPath: string;
  modelName: string;
  architecture: string;
}

export default function TrainingControls({ 
  trainingStatus, 
  onStart, 
  onPause, 
  onStop 
}: TrainingControlsProps) {
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<TrainingConfig>({
    epochs: 20,
    batchSize: 32,
    learningRate: 0.001,
    datasetPath: '/uploads/datasets/retinal_images',
    modelName: 'retinal_classifier_v2',
    architecture: 'fusion_deit_resnet18'
  });
  const [showDatasetUpload, setShowDatasetUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'training':
        return 'bg-health-green text-white';
      case 'paused':
        return 'bg-yellow-500 text-white';
      case 'stopped':
      case 'idle':
        return 'bg-gray-500 text-white';
      case 'error':
        return 'bg-accent-red text-white';
      case 'completed':
        return 'bg-health-green text-white';
      case 'starting':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'training':
        return <Zap className="w-4 h-4 animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'starting':
        return <Brain className="w-4 h-4 animate-spin" />;
      default:
        return <Square className="w-4 h-4" />;
    }
  };

  const handleStartTraining = () => {
    onStart(config);
    setShowConfig(false);
  };

  const handleDatasetUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(0);
      const formData = new FormData();
      formData.append('dataset', file);

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            setConfig({...config, datasetPath: response.data.extractPath});
            setShowDatasetUpload(false);
            setUploadProgress(0);
          }
        }
      });

      xhr.open('POST', '/api/model-training/dataset/upload');
      xhr.send(formData);

    } catch (error) {
      console.error('Dataset upload error:', error);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <Badge className={getStatusColor(trainingStatus)}>
        {getStatusIcon(trainingStatus)}
        <span className="ml-1 capitalize">{trainingStatus}</span>
      </Badge>
      
      <div className="flex space-x-2">
        {/* Training Configuration Dialog */}
        <Dialog open={showConfig} onOpenChange={setShowConfig}>
          <DialogTrigger asChild>
            <Button
              disabled={trainingStatus === 'training' || trainingStatus === 'starting'}
              size="sm"
              className="bg-health-green hover:bg-health-green-light"
            >
              <Play className="w-4 h-4 mr-1" />
              Start Training
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-medical-blue" />
                Configure Retinal Disease Classification Training
              </DialogTitle>
              <DialogDescription>
                Set up training parameters for the DeiT + ResNet18 fusion model to classify CNV, DME, Drusen, and Normal retinal conditions
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Model Configuration */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-medical-blue flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Model Configuration
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="modelName">Model Name</Label>
                    <Input
                      id="modelName"
                      value={config.modelName}
                      onChange={(e) => setConfig({...config, modelName: e.target.value})}
                      placeholder="retinal_classifier_v2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="architecture">Architecture</Label>
                    <Select
                      value={config.architecture}
                      onValueChange={(value) => setConfig({...config, architecture: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fusion_deit_resnet18">DeiT + ResNet18 Fusion (Recommended)</SelectItem>
                        <SelectItem value="resnet50">ResNet50 (Transfer Learning)</SelectItem>
                        <SelectItem value="efficientnet_b0">EfficientNet-B0</SelectItem>
                        <SelectItem value="vision_transformer">Vision Transformer (ViT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Training Parameters */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-medical-blue flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Training Parameters
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="epochs">Epochs</Label>
                    <Input
                      id="epochs"
                      type="number"
                      min="1"
                      max="100"
                      value={config.epochs}
                      onChange={(e) => setConfig({...config, epochs: parseInt(e.target.value)})}
                    />
                    <p className="text-xs text-muted-foreground">Recommended: 15-25</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="batchSize">Batch Size</Label>
                    <Select
                      value={config.batchSize.toString()}
                      onValueChange={(value) => setConfig({...config, batchSize: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16">16 (Low Memory)</SelectItem>
                        <SelectItem value="32">32 (Recommended)</SelectItem>
                        <SelectItem value="64">64 (High Memory)</SelectItem>
                        <SelectItem value="128">128 (Very High Memory)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="learningRate">Learning Rate</Label>
                    <Select
                      value={config.learningRate.toString()}
                      onValueChange={(value) => setConfig({...config, learningRate: parseFloat(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.01">0.01 (High)</SelectItem>
                        <SelectItem value="0.001">0.001 (Recommended)</SelectItem>
                        <SelectItem value="0.0001">0.0001 (Fine-tuning)</SelectItem>
                        <SelectItem value="0.00001">0.00001 (Very Fine)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Dataset Configuration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-medical-blue flex items-center">
                    <Database className="w-4 h-4 mr-2" />
                    Dataset Configuration
                  </h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowDatasetUpload(true)}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload Dataset
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="datasetPath">Dataset Path</Label>
                  <Input
                    id="datasetPath"
                    value={config.datasetPath}
                    onChange={(e) => setConfig({...config, datasetPath: e.target.value})}
                    placeholder="/uploads/datasets/retinal_images"
                  />
                  <p className="text-xs text-muted-foreground">
                    Path should contain folders: CNV, DME, Drusen, Normal with corresponding retinal images
                  </p>
                </div>
              </div>

              {/* Expected Dataset Structure */}
              <Alert>
                <Database className="h-4 w-4" />
                <AlertDescription>
                  <strong>Expected Dataset Structure for Retinal Disease Classification:</strong><br/>
                  📁 retinal_dataset/<br/>
                  &nbsp;&nbsp;📁 CNV/ (Choroidal Neovascularization - 1000+ images)<br/>
                  &nbsp;&nbsp;📁 DME/ (Diabetic Macular Edema - 1000+ images)<br/>
                  &nbsp;&nbsp;📁 Drusen/ (Drusen deposits - 1000+ images)<br/>
                  &nbsp;&nbsp;📁 Normal/ (Normal retinal scans - 1000+ images)<br/>
                  <br/>
                  <em>Total recommended: 4000+ high-quality fundus/OCT images</em>
                </AlertDescription>
              </Alert>

              {/* Training Information */}
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  <strong>DeiT + ResNet18 Fusion Model:</strong> This architecture combines the strengths of Data-efficient Image Transformers (DeiT) with ResNet18's proven CNN capabilities, specifically optimized for medical imaging tasks with attention mechanisms for improved accuracy.
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowConfig(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleStartTraining}
                  className="bg-health-green hover:bg-health-green-light"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Start Training
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Pause Button */}
        <Button
          onClick={onPause}
          disabled={trainingStatus !== 'training'}
          variant="outline"
          size="sm"
        >
          <Pause className="w-4 h-4 mr-1" />
          Pause
        </Button>
        
        {/* Stop Button */}
        <Button
          onClick={onStop}
          disabled={trainingStatus === 'idle' || trainingStatus === 'stopped'}
          variant="destructive"
          size="sm"
        >
          <Square className="w-4 h-4 mr-1" />
          Stop
        </Button>

        {/* Configuration Button */}
        <Button
          variant="outline"
          size="sm"
          disabled={trainingStatus === 'training' || trainingStatus === 'starting'}
          onClick={() => setShowConfig(true)}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Dataset Upload Dialog */}
      <Dialog open={showDatasetUpload} onOpenChange={setShowDatasetUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Upload className="w-5 h-5 mr-2 text-medical-blue" />
              Upload Retinal Dataset
            </DialogTitle>
            <DialogDescription>
              Upload a .zip file containing the organized retinal image dataset with CNV, DME, Drusen, and Normal folders
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your retinal dataset zip file here, or click to browse
              </p>
              <input
                type="file"
                accept=".zip,.tar,.tar.gz"
                onChange={handleDatasetUpload}
                className="hidden"
                id="dataset-upload"
              />
              <Label htmlFor="dataset-upload" className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>Choose Dataset File</span>
                </Button>
              </Label>
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-medical-blue h-2 rounded-full transition-all duration-300" 
                    style={{width: `${uploadProgress}%`}}
                  ></div>
                </div>
              </div>
            )}
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Requirements:</strong><br/>
                • Maximum file size: 500MB<br/>
                • Supported formats: .zip, .tar, .tar.gz<br/>
                • Must contain CNV, DME, Drusen, Normal folders<br/>
                • Minimum 100 images per class recommended
              </AlertDescription>
            </Alert>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}