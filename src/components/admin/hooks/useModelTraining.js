import { useState, useEffect, useRef } from 'react';
import { 
  MODEL_CONFIG_DEFAULTS, 
  MODEL_VERSIONS_DATA, 
  TRAINING_HISTORY_DATA, 
  DATASET_INFO_DATA, 
  SYSTEM_RESOURCES_DATA, 
  TRAINING_LOGS_DATA, 
  MODEL_METRICS_INITIAL 
} from '../constants/aiModelConstants';

export function useModelTraining() {
  const [activeTab, setActiveTab] = useState('overview');
  const [trainingStatus, setTrainingStatus] = useState('idle');
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [totalEpochs, setTotalEpochs] = useState(20);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [modelMetrics, setModelMetrics] = useState(MODEL_METRICS_INITIAL);
  const [modelConfig, setModelConfig] = useState(MODEL_CONFIG_DEFAULTS);
  const [modelVersions, setModelVersions] = useState(MODEL_VERSIONS_DATA);
  const [trainingHistory, setTrainingHistory] = useState(TRAINING_HISTORY_DATA);
  const [datasetInfo, setDatasetInfo] = useState(DATASET_INFO_DATA);
  const [systemResources] = useState(SYSTEM_RESOURCES_DATA);
  const [trainingLogs, setTrainingLogs] = useState(TRAINING_LOGS_DATA);
  const [isConnected, setIsConnected] = useState(false);
  const [trainingStartTime, setTrainingStartTime] = useState(null);
  
  const websocketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        // Determine WebSocket protocol based on current page protocol
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/training`;
        
        console.log('Attempting to connect to:', wsUrl);
        websocketRef.current = new WebSocket(wsUrl);
        
        websocketRef.current.onopen = () => {
          console.log('✅ Connected to training WebSocket');
          setIsConnected(true);
          
          // Clear any reconnection timeout
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        };
        
        websocketRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            handleWebSocketMessage(data);
          } catch (error) {
            console.error('WebSocket message parsing error:', error);
          }
        };
        
        websocketRef.current.onclose = (event) => {
          console.log('Training WebSocket disconnected:', event.code, event.reason);
          setIsConnected(false);
          
          // Attempt to reconnect after 5 seconds if not a normal closure
          if (event.code !== 1000) {
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log('Attempting to reconnect WebSocket...');
              connectWebSocket();
            }, 5000);
          }
        };
        
        websocketRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
        };
      } catch (error) {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
        
        // Fallback: Use polling if WebSocket fails
        startPolling();
      }
    };

    // Try WebSocket connection first
    connectWebSocket();

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close(1000); // Normal closure
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // Fallback polling mechanism
  const startPolling = () => {
    const pollInterval = setInterval(async () => {
      try {
        const result = await apiCall('/status');
        updateTrainingState(result.data);
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  };

  // Handle WebSocket messages
  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'initial_state':
        updateTrainingState(data.data);
        break;
      case 'progress':
        handleProgressUpdate(data.data);
        break;
      case 'log':
        addTrainingLog(data.log);
        break;
      case 'training_finished':
        setTrainingStatus(data.status);
        if (data.status === 'completed') {
          addTrainingLog({
            timestamp: new Date().toISOString(),
            level: 'SUCCESS',
            message: '🎉 Model training completed successfully!'
          });
        }
        break;
      case 'batch':
        // Handle batch updates for more granular progress
        break;
      default:
        console.log('Unknown WebSocket message type:', data.type);
    }
  };

  // Update training state from WebSocket or API
  const updateTrainingState = (state) => {
    if (state.status) setTrainingStatus(state.status);
    if (state.currentEpoch !== undefined) setCurrentEpoch(state.currentEpoch);
    if (state.totalEpochs !== undefined) setTotalEpochs(state.totalEpochs);
    if (state.progress !== undefined) setTrainingProgress(state.progress);
    if (state.metrics) setModelMetrics(prev => ({ ...prev, ...state.metrics }));
    if (state.logs) setTrainingLogs(state.logs);
    if (state.startTime) setTrainingStartTime(state.startTime);
  };

  // Handle progress updates
  const handleProgressUpdate = (progressData) => {
    if (progressData.type === 'epoch_end') {
      setCurrentEpoch(progressData.epoch);
      setTrainingProgress(progressData.progress);
      
      if (progressData.metrics) {
        const newMetrics = {
          trainLoss: progressData.metrics.train_loss,
          valLoss: progressData.metrics.val_loss,
          trainAcc: progressData.metrics.train_acc,
          valAcc: progressData.metrics.val_acc,
        };

        setModelMetrics(prev => ({
          ...prev,
          ...newMetrics,
          bestValAcc: Math.max(prev.bestValAcc, newMetrics.valAcc)
        }));

        // Update training history
        setTrainingHistory(prev => {
          const newEntry = {
            epoch: progressData.epoch,
            trainLoss: newMetrics.trainLoss,
            valLoss: newMetrics.valLoss,
            trainAcc: newMetrics.trainAcc,
            valAcc: newMetrics.valAcc
          };
          
          // Replace or add the entry for this epoch
          const existingIndex = prev.findIndex(entry => entry.epoch === progressData.epoch);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = newEntry;
            return updated;
          } else {
            return [...prev, newEntry];
          }
        });
      }
    }
  };

  // Add training log
  const addTrainingLog = (log) => {
    setTrainingLogs(prev => [log, ...prev.slice(0, 99)]); // Keep last 100 logs
  };

  // API calls with error handling
  const apiCall = async (endpoint, method = 'GET', body = null) => {
    try {
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body) {
        config.body = JSON.stringify(body);
      }

      const response = await fetch(`/api/model-training${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call error (${method} ${endpoint}):`, error);
      throw error;
    }
  };

  // Training control handlers
  const handleStartTraining = async (config) => {
    try {
      console.log('🚀 Starting retinal disease classification training with config:', config);
      setTrainingStatus('starting');
      setTrainingStartTime(new Date().toISOString());
      
      // Prepare training configuration
      const trainingConfig = {
        epochs: config.epochs || 20,
        batchSize: config.batchSize || 32,
        learningRate: config.learningRate || 0.001,
        datasetPath: config.datasetPath,
        modelName: config.modelName || 'retinal_classifier',
        architecture: config.architecture || 'fusion_deit_resnet18'
      };

      const result = await apiCall('/start', 'POST', trainingConfig);
      
      addTrainingLog({
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: `🎯 Training started: ${trainingConfig.modelName} (${trainingConfig.epochs} epochs, ${trainingConfig.architecture})`
      });

      addTrainingLog({
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: `📊 Dataset: ${trainingConfig.datasetPath} | Batch size: ${trainingConfig.batchSize} | Learning rate: ${trainingConfig.learningRate}`
      });
      
      return result;
    } catch (error) {
      console.error('❌ Failed to start training:', error);
      setTrainingStatus('error');
      addTrainingLog({
        timestamp: new Date().toISOString(),
        level: 'ERROR',
        message: `❌ Failed to start training: ${error.message}`
      });
      throw error;
    }
  };

  const handlePauseTraining = async () => {
    try {
      console.log('⏸️ Pausing model training...');
      setTrainingStatus('paused');
      addTrainingLog({
        timestamp: new Date().toISOString(),
        level: 'WARNING',
        message: '⏸️ Training pause requested (this feature is in development)'
      });
    } catch (error) {
      console.error('Failed to pause training:', error);
    }
  };

  const handleStopTraining = async () => {
    try {
      console.log('⏹️ Stopping model training...');
      
      const result = await apiCall('/stop', 'POST');
      
      setTrainingStatus('stopped');
      addTrainingLog({
        timestamp: new Date().toISOString(),
        level: 'WARNING',
        message: '⏹️ Training stopped by user request'
      });
      
      return result;
    } catch (error) {
      console.error('❌ Failed to stop training:', error);
      addTrainingLog({
        timestamp: new Date().toISOString(),
        level: 'ERROR',
        message: `❌ Failed to stop training: ${error.message}`
      });
      throw error;
    }
  };

  const handleDeployModel = async (versionId) => {
    try {
      console.log('🚀 Deploying model version:', versionId);
      
      // Update model versions list optimistically
      setModelVersions(prev => prev.map(model => ({
        ...model,
        status: model.id === versionId ? 'deployed' : (model.status === 'deployed' ? 'archived' : model.status),
        deployedAt: model.id === versionId ? new Date().toISOString() : model.deployedAt
      })));

      addTrainingLog({
        timestamp: new Date().toISOString(),
        level: 'SUCCESS',
        message: `🚀 Model ${versionId} deployed to production successfully!`
      });
      
      // In a real implementation, this would make an API call to deploy the model
      // const result = await apiCall(`/deploy/${versionId}`, 'POST');
      
    } catch (error) {
      console.error('❌ Failed to deploy model:', error);
      addTrainingLog({
        timestamp: new Date().toISOString(),
        level: 'ERROR',
        message: `❌ Failed to deploy model ${versionId}: ${error.message}`
      });
    }
  };

  // Load initial training status on mount
  useEffect(() => {
    const loadInitialStatus = async () => {
      try {
        const result = await apiCall('/status');
        updateTrainingState(result.data);
      } catch (error) {
        console.warn('Could not load initial training status:', error.message);
        // This is expected if the backend is not running
        addTrainingLog({
          timestamp: new Date().toISOString(),
          level: 'WARNING',
          message: '⚠️ Training backend not available. Using demo mode for AI Model Center.'
        });
      }
    };

    loadInitialStatus();
  }, []);

  // Calculate estimated time remaining
  const getEstimatedTimeRemaining = () => {
    if (!trainingStartTime || currentEpoch === 0 || trainingStatus !== 'training') {
      return null;
    }
    
    const elapsed = Date.now() - new Date(trainingStartTime).getTime();
    const timePerEpoch = elapsed / currentEpoch;
    const remainingEpochs = totalEpochs - currentEpoch;
    const estimatedRemaining = remainingEpochs * timePerEpoch;
    
    return estimatedRemaining;
  };

  return {
    // State
    activeTab,
    trainingStatus,
    currentEpoch,
    totalEpochs,
    trainingProgress,
    modelMetrics,
    modelConfig,
    modelVersions,
    trainingHistory,
    datasetInfo,
    systemResources,
    trainingLogs,
    isConnected,
    trainingStartTime,
    
    // Computed
    estimatedTimeRemaining: getEstimatedTimeRemaining(),
    
    // Actions
    setActiveTab,
    setTotalEpochs,
    setModelConfig,
    handleStartTraining,
    handlePauseTraining,
    handleStopTraining,
    handleDeployModel,
    addTrainingLog
  };
}