import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Target, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  TrendingUp, 
  Activity,
  FileText,
  Download,
  Share,
  Printer,
  Microscope,
  Brain,
  Zap,
  Clock,
  User
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DiagnosticResults({ 
  results, 
  imageUrl, 
  patientInfo, 
  onSave, 
  onExport, 
  className = "" 
}) {
  const [showDetailedView, setShowDetailedView] = useState(false);
  
  if (!results) return null;

  const getConfidenceColor = (confidence) => {
    if (confidence >= 95) return 'text-health-green';
    if (confidence >= 85) return 'text-medical-blue';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-accent-red';
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'mild': return 'bg-health-green-lighter text-health-green border-health-green';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'severe': return 'bg-accent-red-lighter text-accent-red border-accent-red';
      default: return 'bg-medical-blue-lighter text-medical-blue border-medical-blue';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-health-green-lighter text-health-green';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-accent-red-lighter text-accent-red';
      default: return 'bg-medical-blue-lighter text-medical-blue';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Primary Diagnosis Card */}
      <Card className="border-l-4 border-l-medical-blue">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-medical-blue" />
              Primary Diagnosis
            </CardTitle>
            <Badge variant="outline" className="bg-medical-blue text-white">
              AI Analysis
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Diagnosis Info */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-medical-blue mb-2">
                    {results.primaryDiagnosis.condition}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <Badge className={getSeverityColor(results.primaryDiagnosis.severity)}>
                      {results.primaryDiagnosis.severity} Severity
                    </Badge>
                    <Badge className={getRiskColor(results.primaryDiagnosis.riskLevel)}>
                      {results.primaryDiagnosis.riskLevel} Risk
                    </Badge>
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="p-4 bg-medical-blue-lighter rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-medical-blue">Diagnostic Confidence</span>
                    <span className={`text-lg font-bold ${getConfidenceColor(results.primaryDiagnosis.confidence)}`}>
                      {results.primaryDiagnosis.confidence.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={results.primaryDiagnosis.confidence} className="w-full" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on AI analysis with medical-grade accuracy
                  </p>
                </div>

                {/* Key Findings */}
                <div>
                  <h4 className="font-medium text-medical-blue mb-2">Key Clinical Findings</h4>
                  <div className="space-y-2">
                    {results.secondaryFindings?.slice(0, 3).map((finding, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{finding.condition}</span>
                        <Badge variant="outline" className={getConfidenceColor(finding.confidence)}>
                          {finding.confidence.toFixed(1)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            <div className="lg:col-span-1">
              {imageUrl && (
                <div className="space-y-3">
                  <h4 className="font-medium text-medical-blue">Analyzed Image</h4>
                  <div className="relative">
                    <img 
                      src={imageUrl} 
                      alt="Retinal analysis" 
                      className="w-full h-48 object-cover rounded-lg shadow-md border"
                    />
                    <Badge className="absolute top-2 right-2 bg-health-green">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Analyzed
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Quality: Excellent</span>
                      <span>Resolution: High</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Dialog open={showDetailedView} onOpenChange={setShowDetailedView}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Detailed Results
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Comprehensive Diagnostic Report</DialogTitle>
              <DialogDescription>
                Complete AI analysis results with clinical recommendations
              </DialogDescription>
            </DialogHeader>
            <DetailedAnalysisView results={results} patientInfo={patientInfo} />
          </DialogContent>
        </Dialog>

        <Button variant="outline" onClick={onExport}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
        
        <Button variant="outline">
          <Share className="w-4 h-4 mr-2" />
          Share Results
        </Button>

        <Button variant="outline">
          <Printer className="w-4 h-4 mr-2" />
          Print Report
        </Button>

        {onSave && (
          <Button onClick={onSave} className="bg-health-green hover:bg-health-green-light">
            <FileText className="w-4 h-4 mr-2" />
            Save to Record
          </Button>
        )}
      </div>

      {/* Immediate Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-health-green" />
            Immediate Clinical Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.recommendations?.slice(0, 3).map((rec, index) => (
              <Alert key={index}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{rec}</AlertDescription>
              </Alert>
            ))}
          </div>
          
          {results.recommendations?.length > 3 && (
            <Button 
              variant="link" 
              className="mt-3 p-0"
              onClick={() => setShowDetailedView(true)}
            >
              View all {results.recommendations.length} recommendations →
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Model Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Brain className="w-4 h-4 mr-2" />
            AI Model Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Microscope className="w-4 h-4 text-medical-blue" />
              <div>
                <p className="font-medium">Model</p>
                <p className="text-muted-foreground">Fusion v2.1.0</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-health-green" />
              <div>
                <p className="font-medium">Accuracy</p>
                <p className="text-muted-foreground">98.45%</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-accent-red" />
              <div>
                <p className="font-medium">Processing</p>
                <p className="text-muted-foreground">2.3 seconds</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-medical-blue" />
              <div>
                <p className="font-medium">Analyzed by</p>
                <p className="text-muted-foreground">Dr. {patientInfo?.doctor || 'Smith'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Detailed Analysis View Component
function DetailedAnalysisView({ results, patientInfo }) {
  return (
    <Tabs defaultValue="diagnosis" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
        <TabsTrigger value="anatomy">Anatomy</TabsTrigger>
        <TabsTrigger value="metrics">Metrics</TabsTrigger>
        <TabsTrigger value="treatment">Treatment</TabsTrigger>
      </TabsList>

      <TabsContent value="diagnosis" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Primary Diagnosis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-medical-blue-lighter rounded-lg">
                <h4 className="font-semibold text-medical-blue">{results.primaryDiagnosis.condition}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Confidence: {results.primaryDiagnosis.confidence.toFixed(1)}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Confidence Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.confidenceBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="feature" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="confidence" fill="#0A3D62" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Secondary Findings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.secondaryFindings?.map((finding, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{finding.condition}</span>
                  <Badge variant="outline">{finding.confidence.toFixed(1)}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="anatomy" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Anatomical Measurements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.anatomicalFeatures && Object.entries(results.anatomicalFeatures).map(([key, value]) => (
                <div key={key} className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                    <span className="text-sm font-mono font-bold">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.riskFactors?.map((factor, index) => (
                <div key={index} className="flex items-center p-3 bg-yellow-50 border rounded-lg">
                  <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
                  <span className="text-sm">{factor}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="metrics" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Disease Probability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={results.comparisonData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, value }) => `${category}: ${value}%`}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {results.comparisonData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Model Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Overall Accuracy</span>
                  <span className="text-sm font-bold text-health-green">98.45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Sensitivity</span>
                  <span className="text-sm font-bold">97.82%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Specificity</span>
                  <span className="text-sm font-bold">98.91%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Processing Time</span>
                  <span className="text-sm font-bold">{results.aiModelDetails?.processingTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="treatment" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Treatment Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.recommendations?.map((rec, index) => (
                <div key={index} className="p-3 bg-medical-blue-lighter rounded-lg">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-medical-blue mt-0.5" />
                    <span className="text-sm">{rec}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Immediate Action</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{results.treatmentPlan?.immediate}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Follow-up Care</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{results.treatmentPlan?.followUp}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Long-term Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{results.treatmentPlan?.longTerm}</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}