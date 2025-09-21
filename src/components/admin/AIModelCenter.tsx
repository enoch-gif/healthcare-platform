import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { 
  Clock, Target, Rocket, Zap, History, Upload, Download
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import AIModelAnalytics from './AIModelAnalytics';
import TrainingControls from './components/TrainingControls';
import TrainingProgress from './components/TrainingProgress';
import ModelArchitecture from './components/ModelArchitecture';
import { useModelTraining } from './hooks/useModelTraining';
import { getStatusColor, getLogLevelColor } from './constants/aiModelConstants';

export default function AIModelCenter() {
  const {
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
    setActiveTab,
    handleStartTraining,
    handlePauseTraining,
    handleStopTraining,
    handleDeployModel
  } = useModelTraining();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-medical-blue mb-2">AI Model Training Center</h1>
          <p className="text-muted-foreground">Manage and monitor fusion model training for retinal disease classification</p>
        </div>
        <TrainingControls
          trainingStatus={trainingStatus}
          onStart={handleStartTraining}
          onPause={handlePauseTraining}
          onStop={handleStopTraining}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="dataset">Dataset</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Epoch</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-medical-blue">{currentEpoch}/{totalEpochs}</div>
                <p className="text-xs text-muted-foreground">Training progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Validation Accuracy</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-health-green">{(modelMetrics.valAcc * 100).toFixed(2)}%</div>
                <p className="text-xs text-muted-foreground">Best: {(modelMetrics.bestValAcc * 100).toFixed(2)}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Production Model</CardTitle>
                <Rocket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-medical-blue">v2.1.0</div>
                <p className="text-xs text-muted-foreground">98.45% accuracy</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">GPU Utilization</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-medical-blue">{systemResources.gpuUtilization}%</div>
                <p className="text-xs text-muted-foreground">CUDA available</p>
              </CardContent>
            </Card>
          </div>

          <TrainingProgress
            currentEpoch={currentEpoch}
            totalEpochs={totalEpochs}
            trainingProgress={trainingProgress}
            trainingStatus={trainingStatus}
            modelConfig={modelConfig}
          />

          {/* Training History Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Training History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trainingHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="epoch" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="trainLoss" stroke="#E74C3C" strokeWidth={2} name="Train Loss" />
                    <Line type="monotone" dataKey="valLoss" stroke="#EC7063" strokeWidth={2} name="Val Loss" />
                    <Line type="monotone" dataKey="trainAcc" stroke="#27AE60" strokeWidth={2} name="Train Acc" />
                    <Line type="monotone" dataKey="valAcc" stroke="#52C882" strokeWidth={2} name="Val Acc" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ModelArchitecture />

            {/* Training Logs */}
            <Card>
              <CardHeader>
                <CardTitle>Training Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-2">
                    {trainingLogs.map((log, index) => (
                      <div key={index} className="text-sm p-2 bg-muted rounded">
                        <div className="flex justify-between items-start">
                          <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                          <Badge variant="outline" className={`text-xs ${getLogLevelColor(log.level)}`}>
                            {log.level}
                          </Badge>
                        </div>
                        <p className="mt-1">{log.message}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Current Training Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Current Training Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-medical-blue-lighter rounded-lg">
                  <div className="text-2xl font-bold text-medical-blue">{modelMetrics.trainLoss.toFixed(4)}</div>
                  <p className="text-sm text-muted-foreground">Training Loss</p>
                </div>
                <div className="text-center p-4 bg-accent-red-lighter rounded-lg">
                  <div className="text-2xl font-bold text-accent-red">{modelMetrics.valLoss.toFixed(4)}</div>
                  <p className="text-sm text-muted-foreground">Validation Loss</p>
                </div>
                <div className="text-center p-4 bg-health-green-lighter rounded-lg">
                  <div className="text-2xl font-bold text-health-green">{(modelMetrics.trainAcc * 100).toFixed(2)}%</div>
                  <p className="text-sm text-muted-foreground">Training Accuracy</p>
                </div>
                <div className="text-center p-4 bg-health-green-lighter rounded-lg">
                  <div className="text-2xl font-bold text-health-green">{(modelMetrics.valAcc * 100).toFixed(2)}%</div>
                  <p className="text-sm text-muted-foreground">Validation Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <AIModelAnalytics />
        </TabsContent>

        {/* Versions Tab */}
        <TabsContent value="versions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="w-5 h-5 mr-2 text-medical-blue" />
                Model Versions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modelVersions.map((version) => (
                  <div key={version.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium">{version.name}</h4>
                        <Badge 
                          variant={version.status === 'deployed' ? 'default' : 'secondary'}
                          className={`${getStatusColor(version.status)} text-white`}
                        >
                          {version.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {version.accuracy}% accuracy
                        </Badge>
                        {version.status !== 'deployed' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleDeployModel(version.id)}
                            className="bg-medical-blue hover:bg-medical-blue-light"
                          >
                            <Rocket className="w-4 h-4 mr-1" />
                            Deploy
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{version.description}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Created: {new Date(version.createdAt).toLocaleString()}</span>
                      {version.deployedAt && (
                        <span>Deployed: {new Date(version.deployedAt).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex justify-center">
                <Button variant="outline" className="w-full max-w-md">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Model Version
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dataset Tab */}
        <TabsContent value="dataset" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dataset Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(datasetInfo.classes).map(([name, count]) => ({ name, count }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0A3D62" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration and Monitoring tabs - simplified placeholders */}
        <TabsContent value="configuration">
          <Card>
            <CardHeader>
              <CardTitle>Training Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Configuration interface coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>System Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Monitoring interface coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}