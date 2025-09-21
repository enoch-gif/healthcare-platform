export const MODEL_CONFIG_DEFAULTS = {
  branch1: 'deit_small_patch16_224',
  branch2: 'resnet18',
  batchSize: 4,
  accumulationSteps: 4,
  learningRate: 0.0001,
  numEpochs: 30,
  imageSize: 224,
  earlyStoppingPatience: 7,
  minDelta: 0.0005
};

export const MODEL_VERSIONS_DATA = [
  {
    id: 'v2.1.0',
    name: 'Fusion Model v2.1.0',
    status: 'deployed',
    accuracy: 98.45,
    createdAt: '2025-01-13 08:30:00',
    deployedAt: '2025-01-13 09:00:00',
    description: 'Production model with enhanced fusion architecture'
  },
  {
    id: 'v2.0.3',
    name: 'Fusion Model v2.0.3',
    status: 'archived',
    accuracy: 97.89,
    createdAt: '2025-01-10 14:20:00',
    deployedAt: null,
    description: 'Previous stable version with ResNet18 backbone'
  },
  {
    id: 'v1.9.7',
    name: 'Fusion Model v1.9.7',
    status: 'testing',
    accuracy: 96.23,
    createdAt: '2025-01-08 11:15:00',
    deployedAt: null,
    description: 'Experimental version with modified attention mechanism'
  }
];

export const TRAINING_HISTORY_DATA = [
  { epoch: 1, trainLoss: 1.2431, valLoss: 1.1892, trainAcc: 0.4521, valAcc: 0.4234 },
  { epoch: 2, trainLoss: 0.9834, valLoss: 0.9456, trainAcc: 0.5892, valAcc: 0.5645 },
  { epoch: 3, trainLoss: 0.7621, valLoss: 0.7893, trainAcc: 0.6734, valAcc: 0.6456 },
  { epoch: 4, trainLoss: 0.6234, valLoss: 0.6789, trainAcc: 0.7345, valAcc: 0.7123 },
  { epoch: 5, trainLoss: 0.5456, valLoss: 0.5892, trainAcc: 0.7834, valAcc: 0.7567 },
  { epoch: 6, trainLoss: 0.4892, valLoss: 0.5234, trainAcc: 0.8123, valAcc: 0.7789 },
  { epoch: 7, trainLoss: 0.4521, valLoss: 0.4892, trainAcc: 0.8234, valAcc: 0.7845 }
];

export const DATASET_INFO_DATA = {
  totalImages: 84495,
  trainImages: 59146,
  valImages: 12674,
  testImages: 12675,
  classes: {
    'CNV': 37205,
    'DME': 11348,
    'DRUSEN': 8616,
    'NORMAL': 26850
  }
};

export const SYSTEM_RESOURCES_DATA = {
  gpuUtilization: 85,
  memoryUsage: 78,
  cpuUsage: 45,
  diskUsage: 67,
  temperature: 72
};

export const TRAINING_LOGS_DATA = [
  { timestamp: '2025-01-13 14:30:25', level: 'INFO', message: 'Training started with fusion model (DeiT + ResNet18)' },
  { timestamp: '2025-01-13 14:30:26', level: 'INFO', message: 'Dataset loaded: 84,495 images across 4 classes' },
  { timestamp: '2025-01-13 14:30:27', level: 'INFO', message: 'Using gradient accumulation with 4 steps' },
  { timestamp: '2025-01-13 14:31:45', level: 'INFO', message: 'Epoch 1/30 - Train Loss: 1.2431, Val Loss: 1.1892' },
  { timestamp: '2025-01-13 14:33:12', level: 'INFO', message: 'Epoch 2/30 - Train Loss: 0.9834, Val Loss: 0.9456' },
  { timestamp: '2025-01-13 14:34:38', level: 'SUCCESS', message: 'Best model updated - Val Loss improved to 0.4892' }
];

export const MODEL_METRICS_INITIAL = {
  trainLoss: 0.4521,
  valLoss: 0.4892,
  trainAcc: 0.8234,
  valAcc: 0.7845,
  bestValLoss: 0.4231,
  bestValAcc: 0.8156
};

export const MODEL_SELECT_OPTIONS = {
  branch1: [
    { value: 'deit_small_patch16_224', label: 'DeiT Small 224' },
    { value: 'deit_base_patch16_224', label: 'DeiT Base 224' },
    { value: 'vit_small_patch16_224', label: 'ViT Small 224' }
  ],
  branch2: [
    { value: 'resnet18', label: 'ResNet18' },
    { value: 'resnet34', label: 'ResNet34' },
    { value: 'resnet50', label: 'ResNet50' }
  ]
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'training': return 'bg-blue-500';
    case 'completed': return 'bg-green-500';
    case 'paused': return 'bg-yellow-500';
    case 'stopped': return 'bg-red-500';
    case 'deployed': return 'bg-green-500';
    case 'testing': return 'bg-blue-500';
    case 'archived': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
};

export const getLogLevelColor = (level) => {
  switch (level) {
    case 'SUCCESS': return 'text-green-600';
    case 'WARNING': return 'text-yellow-600';
    case 'ERROR': return 'text-red-600';
    default: return 'text-blue-600';
  }
};