import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { 
  TrendingUp, 
  Target, 
  Eye, 
  Brain, 
  BarChart3, 
  PieChart, 
  Activity,
  CheckCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  Calendar,
  Clock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  Cell,
  PieChart as RechartsPieChart,
  Pie
} from 'recharts';

export default function AIModelAnalytics() {
  const [selectedModel, setSelectedModel] = useState('fusion');
  const [timeRange, setTimeRange] = useState('30days');

  // Model performance data
  const modelMetrics = {
    fusion: {
      name: 'Fusion Model (DeiT + ResNet18)',
      version: 'v2.1.0',
      accuracy: 98.45,
      sensitivity: 97.82,
      specificity: 98.91,
      f1Score: 98.12,
      auc: 0.9923,
      inferenceTime: 0.032,
      status: 'active'
    },
    deit: {
      name: 'DeiT Small Standalone',
      version: 'v1.8.2',
      accuracy: 96.23,
      sensitivity: 95.67,
      specificity: 96.89,
      f1Score: 95.91,
      auc: 0.9834,
      inferenceTime: 0.018,
      status: 'backup'
    },
    resnet: {
      name: 'ResNet18 Standalone',
      version: 'v1.5.1',
      accuracy: 94.56,
      sensitivity: 93.21,
      specificity: 95.43,
      f1Score: 94.02,
      auc: 0.9756,
      inferenceTime: 0.015,
      status: 'archived'
    }
  };

  // Performance over time
  const performanceHistory = [
    { date: '2025-01-01', accuracy: 94.2, sensitivity: 93.5, specificity: 94.8, scans: 1250 },
    { date: '2025-01-02', accuracy: 94.8, sensitivity: 94.1, specificity: 95.2, scans: 1380 },
    { date: '2025-01-03', accuracy: 95.2, sensitivity: 94.6, specificity: 95.7, scans: 1420 },
    { date: '2025-01-04', accuracy: 95.9, sensitivity: 95.3, specificity: 96.1, scans: 1560 },
    { date: '2025-01-05', accuracy: 96.5, sensitivity: 95.8, specificity: 96.8, scans: 1690 },
    { date: '2025-01-06', accuracy: 97.1, sensitivity: 96.4, specificity: 97.3, scans: 1780 },
    { date: '2025-01-07', accuracy: 97.6, sensitivity: 97.0, specificity: 97.9, scans: 1850 },
    { date: '2025-01-08', accuracy: 98.0, sensitivity: 97.5, specificity: 98.2, scans: 1920 },
    { date: '2025-01-09', accuracy: 98.2, sensitivity: 97.7, specificity: 98.4, scans: 1980 },
    { date: '2025-01-10', accuracy: 98.4, sensitivity: 97.9, specificity: 98.6, scans: 2050 },
    { date: '2025-01-11', accuracy: 98.3, sensitivity: 97.8, specificity: 98.5, scans: 2120 },
    { date: '2025-01-12', accuracy: 98.5, sensitivity: 98.0, specificity: 98.7, scans: 2180 },
    { date: '2025-01-13', accuracy: 98.45, sensitivity: 97.82, specificity: 98.91, scans: 2250 }
  ];

  // Confusion matrix data
  const confusionMatrix = [
    { actual: 'CNV', predicted: 'CNV', count: 987, rate: 97.8 },
    { actual: 'CNV', predicted: 'DME', count: 12, rate: 1.2 },
    { actual: 'CNV', predicted: 'Drusen', count: 8, rate: 0.8 },
    { actual: 'CNV', predicted: 'Normal', count: 2, rate: 0.2 },
    { actual: 'DME', predicted: 'CNV', count: 15, rate: 1.8 },
    { actual: 'DME', predicted: 'DME', count: 823, rate: 96.2 },
    { actual: 'DME', predicted: 'Drusen', count: 14, rate: 1.6 },
    { actual: 'DME', predicted: 'Normal', count: 3, rate: 0.4 },
    { actual: 'Drusen', predicted: 'CNV', count: 22, rate: 2.1 },
    { actual: 'Drusen', predicted: 'DME', count: 18, rate: 1.7 },
    { actual: 'Drusen', predicted: 'Drusen', count: 987, rate: 94.5 },
    { actual: 'Drusen', predicted: 'Normal', count: 18, rate: 1.7 },
    { actual: 'Normal', predicted: 'CNV', count: 3, rate: 0.2 },
    { actual: 'Normal', predicted: 'DME', count: 5, rate: 0.3 },
    { actual: 'Normal', predicted: 'Drusen', count: 8, rate: 0.4 },
    { actual: 'Normal', predicted: 'Normal', count: 1842, rate: 99.1 }
  ];

  // Class-wise performance
  const classPerformance = [
    { 
      class: 'CNV', 
      precision: 97.2, 
      recall: 97.8, 
      f1: 97.5, 
      support: 1009,
      color: '#E74C3C'
    },
    { 
      class: 'DME', 
      precision: 95.8, 
      recall: 96.2, 
      f1: 96.0, 
      support: 855,
      color: '#F39C12'
    },
    { 
      class: 'Drusen', 
      precision: 94.1, 
      recall: 94.5, 
      f1: 94.3, 
      support: 1045,
      color: '#9B59B6'
    },
    { 
      class: 'Normal', 
      precision: 99.3, 
      recall: 99.1, 
      f1: 99.2, 
      support: 1858,
      color: '#27AE60'
    }
  ];

  // Model comparison data
  const modelComparison = [
    { metric: 'Accuracy', fusion: 98.45, deit: 96.23, resnet: 94.56 },
    { metric: 'Sensitivity', fusion: 97.82, deit: 95.67, resnet: 93.21 },
    { metric: 'Specificity', fusion: 98.91, deit: 96.89, resnet: 95.43 },
    { metric: 'F1-Score', fusion: 98.12, deit: 95.91, resnet: 94.02 },
    { metric: 'AUC', fusion: 99.23, deit: 98.34, resnet: 97.56 }
  ];

  // ROC curve data
  const rocData = [
    { fpr: 0, tpr: 0, model: 'Fusion' },
    { fpr: 0.01, tpr: 0.45, model: 'Fusion' },
    { fpr: 0.02, tpr: 0.68, model: 'Fusion' },
    { fpr: 0.03, tpr: 0.82, model: 'Fusion' },
    { fpr: 0.05, tpr: 0.91, model: 'Fusion' },
    { fpr: 0.08, tpr: 0.96, model: 'Fusion' },
    { fpr: 0.12, tpr: 0.99, model: 'Fusion' },
    { fpr: 1, tpr: 1, model: 'Fusion' }
  ];

  const currentModel = modelMetrics[selectedModel];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-medical-blue mb-2">AI Model Analytics</h1>
          <p className="text-muted-foreground">Comprehensive performance analysis and model comparison</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fusion">Fusion Model</SelectItem>
              <SelectItem value="deit">DeiT Standalone</SelectItem>
              <SelectItem value="resnet">ResNet Standalone</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 Days</SelectItem>
              <SelectItem value="30days">30 Days</SelectItem>
              <SelectItem value="90days">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Model Status Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-medical-blue rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-medical-blue">{currentModel.name}</h3>
                <p className="text-sm text-muted-foreground">Version {currentModel.version}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-health-green">{currentModel.accuracy}%</div>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-medical-blue">{currentModel.inferenceTime}s</div>
                <p className="text-xs text-muted-foreground">Inference Time</p>
              </div>
              <Badge 
                variant={currentModel.status === 'active' ? 'default' : 'secondary'}
                className={currentModel.status === 'active' ? 'bg-green-500' : ''}
              >
                {currentModel.status.charAt(0).toUpperCase() + currentModel.status.slice(1)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="confusion">Confusion Matrix</TabsTrigger>
          <TabsTrigger value="comparison">Model Comparison</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-health-green">{currentModel.accuracy}%</div>
                <Progress value={currentModel.accuracy} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sensitivity</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-medical-blue">{currentModel.sensitivity}%</div>
                <Progress value={currentModel.sensitivity} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Specificity</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent-red">{currentModel.specificity}%</div>
                <Progress value={currentModel.specificity} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AUC Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-medical-blue">{currentModel.auc}</div>
                <Progress value={currentModel.auc * 100} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Class Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Class-wise Performance</CardTitle>
              <CardDescription>Detailed metrics for each disease category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classPerformance.map((cls, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: cls.color }}
                        ></div>
                        <h4 className="font-medium">{cls.class}</h4>
                        <Badge variant="outline">{cls.support} samples</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Precision</span>
                          <span>{cls.precision}%</span>
                        </div>
                        <Progress value={cls.precision} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Recall</span>
                          <span>{cls.recall}%</span>
                        </div>
                        <Progress value={cls.recall} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>F1-Score</span>
                          <span>{cls.f1}%</span>
                        </div>
                        <Progress value={cls.f1} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ROC Curve */}
          <Card>
            <CardHeader>
              <CardTitle>ROC Curve Analysis</CardTitle>
              <CardDescription>Receiver Operating Characteristic curve for model evaluation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={rocData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      dataKey="fpr" 
                      domain={[0, 1]}
                      tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                      label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="tpr" 
                      domain={[0, 1]}
                      tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                      label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value, name) => [`${(value * 100).toFixed(1)}%`, name === 'fpr' ? 'FPR' : 'TPR']}
                    />
                    <Scatter dataKey="tpr" fill="#0A3D62" />
                    <Line 
                      type="monotone" 
                      dataKey="tpr" 
                      stroke="#0A3D62" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Confusion Matrix Tab */}
        <TabsContent value="confusion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Confusion Matrix</CardTitle>
              <CardDescription>Detailed breakdown of predictions vs actual labels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-muted text-left">Actual \ Predicted</th>
                      <th className="border p-2 bg-red-50 text-center">CNV</th>
                      <th className="border p-2 bg-yellow-50 text-center">DME</th>
                      <th className="border p-2 bg-purple-50 text-center">Drusen</th>
                      <th className="border p-2 bg-green-50 text-center">Normal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['CNV', 'DME', 'Drusen', 'Normal'].map((actual) => (
                      <tr key={actual}>
                        <td className="border p-2 bg-muted font-medium">{actual}</td>
                        {['CNV', 'DME', 'Drusen', 'Normal'].map((predicted) => {
                          const cell = confusionMatrix.find(
                            item => item.actual === actual && item.predicted === predicted
                          );
                          const isCorrect = actual === predicted;
                          return (
                            <td 
                              key={predicted}
                              className={`border p-2 text-center ${
                                isCorrect ? 'bg-green-100 font-bold' : 'bg-red-50'
                              }`}
                            >
                              <div>{cell?.count || 0}</div>
                              <div className="text-xs text-muted-foreground">
                                ({cell?.rate || 0}%)
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Model Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Performance Comparison</CardTitle>
              <CardDescription>Side-by-side comparison of all available models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modelComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis domain={[90, 100]} />
                    <Tooltip />
                    <Bar dataKey="fusion" fill="#0A3D62" name="Fusion Model" />
                    <Bar dataKey="deit" fill="#27AE60" name="DeiT Standalone" />
                    <Bar dataKey="resnet" fill="#E74C3C" name="ResNet Standalone" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Model Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Model Specifications</CardTitle>
              <CardDescription>Detailed comparison of model architectures and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Model</th>
                      <th className="text-center p-3">Version</th>
                      <th className="text-center p-3">Accuracy</th>
                      <th className="text-center p-3">F1-Score</th>
                      <th className="text-center p-3">AUC</th>
                      <th className="text-center p-3">Inference Time</th>
                      <th className="text-center p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(modelMetrics).map(([key, model]) => (
                      <tr key={key} className="border-b">
                        <td className="p-3 font-medium">{model.name}</td>
                        <td className="text-center p-3">{model.version}</td>
                        <td className="text-center p-3">
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {model.accuracy}%
                          </Badge>
                        </td>
                        <td className="text-center p-3">{model.f1Score}%</td>
                        <td className="text-center p-3">{model.auc}</td>
                        <td className="text-center p-3">{model.inferenceTime}s</td>
                        <td className="text-center p-3">
                          <Badge 
                            variant={model.status === 'active' ? 'default' : 'secondary'}
                            className={model.status === 'active' ? 'bg-green-500' : ''}
                          >
                            {model.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Model performance evolution over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis domain={[90, 100]} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#0A3D62" 
                      strokeWidth={2} 
                      name="Accuracy" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sensitivity" 
                      stroke="#27AE60" 
                      strokeWidth={2} 
                      name="Sensitivity" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="specificity" 
                      stroke="#E74C3C" 
                      strokeWidth={2} 
                      name="Specificity" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Scan Volume Correlation */}
          <Card>
            <CardHeader>
              <CardTitle>Scan Volume vs Performance</CardTitle>
              <CardDescription>Correlation between daily scan volume and model accuracy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={performanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      dataKey="scans" 
                      domain={['dataMin', 'dataMax']}
                      label={{ value: 'Daily Scans', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="accuracy" 
                      domain={[94, 99]}
                      label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'accuracy' ? `${value}%` : value,
                        name === 'accuracy' ? 'Accuracy' : 'Scans'
                      ]}
                    />
                    <Scatter dataKey="accuracy" fill="#0A3D62" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reports</CardTitle>
              <CardDescription>Generate and download detailed performance reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Download className="w-6 h-6 mb-2" />
                  <span>Daily Report</span>
                  <span className="text-xs text-muted-foreground">Last 24 hours</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Download className="w-6 h-6 mb-2" />
                  <span>Weekly Report</span>
                  <span className="text-xs text-muted-foreground">Last 7 days</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Download className="w-6 h-6 mb-2" />
                  <span>Monthly Report</span>
                  <span className="text-xs text-muted-foreground">Last 30 days</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Download className="w-6 h-6 mb-2" />
                  <span>Model Comparison</span>
                  <span className="text-xs text-muted-foreground">All models</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Download className="w-6 h-6 mb-2" />
                  <span>Audit Report</span>
                  <span className="text-xs text-muted-foreground">Compliance</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Download className="w-6 h-6 mb-2" />
                  <span>Custom Report</span>
                  <span className="text-xs text-muted-foreground">Configure</span>
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium">Recent Reports</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Weekly Performance Report</p>
                        <p className="text-xs text-muted-foreground">Generated Jan 13, 2025 at 08:00</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Model Comparison Analysis</p>
                        <p className="text-xs text-muted-foreground">Generated Jan 12, 2025 at 14:30</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Monthly Audit Report</p>
                        <p className="text-xs text-muted-foreground">Generated Jan 1, 2025 at 00:01</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}