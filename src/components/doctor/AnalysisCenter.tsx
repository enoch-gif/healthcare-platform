import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner';
import { 
  Upload, 
  Camera, 
  Eye, 
  Brain, 
  FileText, 
  Download, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Zap,
  Target,
  Microscope,
  Save,
  Image as ImageIcon,
  X,
  Info
} from 'lucide-react';

export default function AnalysisCenter({ doctorId }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [patientInfo, setPatientInfo] = useState({
    patientId: '',
    patientName: '',
    age: '',
    gender: '',
    medicalHistory: '',
    symptoms: ''
  });
  const [analysisSettings, setAnalysisSettings] = useState({
    scanType: 'fundus',
    aiModel: 'enhanced_v2.1',
    confidenceThreshold: 85,
    includeHeatmap: true,
    generateReport: true
  });

  const fileInputRef = useRef(null);
  const cameraRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} exceeds 50MB size limit`);
        return false;
      }
      return true;
    });

    const fileObjects = validFiles.map((file, index) => ({
      id: `file_${Date.now()}_${index}`,
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      status: 'ready',
      analysis: null
    }));

    setSelectedFiles(prev => [...prev, ...fileObjects]);
  };

  const removeFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const startAnalysis = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image for analysis');
      return;
    }

    if (!patientInfo.patientName) {
      toast.error('Please enter patient information');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate AI analysis process
    const analysisSteps = [
      'Preprocessing retinal images...',
      'Running AI model inference...',
      'Detecting anatomical structures...',
      'Analyzing pathological features...',
      'Calculating confidence scores...',
      'Generating diagnostic recommendations...',
      'Creating analysis report...',
      'Analysis complete!'
    ];

    for (let i = 0; i < analysisSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAnalysisProgress(((i + 1) / analysisSteps.length) * 100);
      
      if (i === analysisSteps.length - 1) {
        // Generate mock analysis results
        const results = selectedFiles.map(file => generateMockAnalysis(file));
        setAnalysisResults(results);
        setIsAnalyzing(false);
        toast.success('Analysis completed successfully!');
      }
    }
  };

  const generateMockAnalysis = (file) => {
    const conditions = [
      { name: 'Normal', severity: 'None', confidence: 94.2, color: '#27AE60' },
      { name: 'Diabetic Retinopathy', severity: 'Mild', confidence: 89.7, color: '#F39C12' },
      { name: 'Diabetic Retinopathy', severity: 'Moderate', confidence: 92.1, color: '#E74C3C' },
      { name: 'Glaucoma', severity: 'Early', confidence: 87.3, color: '#9B59B6' },
      { name: 'AMD', severity: 'Intermediate', confidence: 91.5, color: '#E67E22' },
      { name: 'CNV', severity: 'Active', confidence: 88.9, color: '#E74C3C' }
    ];

    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      fileId: file.id,
      fileName: file.name,
      patientInfo: { ...patientInfo },
      primaryDiagnosis: randomCondition,
      findings: [
        {
          finding: 'Optic Disc',
          status: 'Normal',
          confidence: 96.1,
          description: 'Optic disc appears normal with healthy cup-to-disc ratio'
        },
        {
          finding: 'Blood Vessels',
          status: randomCondition.name === 'Normal' ? 'Normal' : 'Abnormal',
          confidence: 93.7,
          description: randomCondition.name === 'Normal' 
            ? 'Retinal vasculature appears normal' 
            : 'Some vascular abnormalities detected'
        },
        {
          finding: 'Macula',
          status: randomCondition.name.includes('AMD') ? 'Abnormal' : 'Normal',
          confidence: 91.2,
          description: randomCondition.name.includes('AMD')
            ? 'Macular changes consistent with AMD'
            : 'Macula appears normal'
        }
      ],
      riskFactors: [
        'Age > 50 years',
        'Diabetes mellitus',
        'Hypertension',
        'Family history'
      ],
      recommendations: [
        randomCondition.name === 'Normal' 
          ? 'Continue routine annual screening'
          : 'Follow-up in 3-6 months recommended',
        'Monitor blood sugar levels if diabetic',
        'Consider additional imaging if symptoms worsen'
      ],
      analysisDate: new Date().toISOString(),
      modelVersion: analysisSettings.aiModel,
      processingTime: `${Math.random() * 5 + 2}`.substring(0, 3) + 's'
    };
  };

  const downloadReport = (result) => {
    // In a real application, this would generate and download a PDF report
    toast.success('Report download started');
  };

  const saveAnalysis = (result) => {
    // Save analysis to patient record
    toast.success('Analysis saved to patient record');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0A3D62]">AI Analysis Center</h2>
          <p className="text-[#6C757D]">Advanced retinal image analysis using deep learning</p>
        </div>
        <Badge className="bg-[#9B59B6] text-white">
          <Brain className="h-4 w-4 mr-1" />
          AI-Powered
        </Badge>
      </div>

      {/* AI Model Information */}
      <Alert className="border-[#0A3D62] bg-[#E3F2FD]">
        <Brain className="h-4 w-4 text-[#0A3D62]" />
        <AlertDescription className="text-[#0A3D62]">
          <strong>Enhanced AI Model v2.1</strong> - Trained on 50,000+ retinal images with 95.1% accuracy. 
          Detects diabetic retinopathy, glaucoma, AMD, CNV, and other retinal conditions.
        </AlertDescription>
      </Alert>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload and Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Information */}
          <Card className="medical-shadow border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-[#0A3D62]" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientName">Patient Name *</Label>
                  <Input
                    id="patientName"
                    value={patientInfo.patientName}
                    onChange={(e) => setPatientInfo({...patientInfo, patientName: e.target.value})}
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    value={patientInfo.patientId}
                    onChange={(e) => setPatientInfo({...patientInfo, patientId: e.target.value})}
                    placeholder="Optional patient ID"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={patientInfo.age}
                    onChange={(e) => setPatientInfo({...patientInfo, age: e.target.value})}
                    placeholder="Patient age"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={patientInfo.gender} 
                    onValueChange={(value) => setPatientInfo({...patientInfo, gender: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="symptoms">Current Symptoms</Label>
                <Textarea
                  id="symptoms"
                  value={patientInfo.symptoms}
                  onChange={(e) => setPatientInfo({...patientInfo, symptoms: e.target.value})}
                  placeholder="Describe any visual symptoms or concerns..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card className="medical-shadow border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2 text-[#0A3D62]" />
                Retinal Image Upload
              </CardTitle>
              <CardDescription>
                Upload fundus photographs, OCT scans, or other retinal images for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#0A3D62] hover:bg-[#1E5F8B]"
                  disabled={isAnalyzing}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setCameraActive(!cameraActive)}
                  disabled={isAnalyzing}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Camera Capture
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-[#0A3D62]">Selected Images ({selectedFiles.length})</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedFiles.map((file) => (
                      <div key={file.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <img 
                          src={file.preview} 
                          alt={file.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-[#6C757D]">{formatFileSize(file.size)}</p>
                        </div>
                        <Badge className={
                          file.status === 'ready' ? 'bg-[#FFF8E1] text-[#F39C12]' :
                          file.status === 'analyzing' ? 'bg-[#E3F2FD] text-[#0A3D62]' :
                          'bg-[#E8F5E8] text-[#27AE60]'
                        }>
                          {file.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFile(file.id)}
                          disabled={isAnalyzing}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Progress */}
          {isAnalyzing && (
            <Card className="medical-shadow border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RefreshCw className="h-5 w-5 mr-2 text-[#0A3D62] animate-spin" />
                  AI Analysis in Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={analysisProgress} className="h-3" />
                  <div className="flex items-center justify-center space-x-2 p-4 bg-[#E3F2FD] rounded-lg">
                    <Brain className="h-5 w-5 text-[#0A3D62] animate-pulse" />
                    <span className="text-sm text-[#0A3D62]">
                      Deep learning analysis: {Math.round(analysisProgress)}% complete
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Analysis Settings */}
        <div className="space-y-6">
          <Card className="medical-shadow border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-[#0A3D62]" />
                Analysis Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="scanType">Scan Type</Label>
                <Select 
                  value={analysisSettings.scanType} 
                  onValueChange={(value) => setAnalysisSettings({...analysisSettings, scanType: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fundus">Fundus Photography</SelectItem>
                    <SelectItem value="oct">OCT Scan</SelectItem>
                    <SelectItem value="angiography">Fluorescein Angiography</SelectItem>
                    <SelectItem value="auto_detect">Auto Detect</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="aiModel">AI Model</Label>
                <Select 
                  value={analysisSettings.aiModel} 
                  onValueChange={(value) => setAnalysisSettings({...analysisSettings, aiModel: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enhanced_v2.1">Enhanced v2.1 (Recommended)</SelectItem>
                    <SelectItem value="standard_v2.0">Standard v2.0</SelectItem>
                    <SelectItem value="specialized_dr">DR Specialist v1.8</SelectItem>
                    <SelectItem value="specialized_glaucoma">Glaucoma Specialist v1.5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="confidence">Confidence Threshold: {analysisSettings.confidenceThreshold}%</Label>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={analysisSettings.confidenceThreshold}
                  onChange={(e) => setAnalysisSettings({...analysisSettings, confidenceThreshold: parseInt(e.target.value)})}
                  className="w-full mt-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeHeatmap"
                    checked={analysisSettings.includeHeatmap}
                    onChange={(e) => setAnalysisSettings({...analysisSettings, includeHeatmap: e.target.checked})}
                  />
                  <Label htmlFor="includeHeatmap">Include attention heatmap</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="generateReport"
                    checked={analysisSettings.generateReport}
                    onChange={(e) => setAnalysisSettings({...analysisSettings, generateReport: e.target.checked})}
                  />
                  <Label htmlFor="generateReport">Generate PDF report</Label>
                </div>
              </div>

              <Button
                onClick={startAnalysis}
                disabled={isAnalyzing || selectedFiles.length === 0}
                className="w-full bg-[#27AE60] hover:bg-[#229954]"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Start AI Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResults.length > 0 && (
        <Card className="medical-shadow border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-[#27AE60]" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analysisResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-[#0A3D62]">{result.fileName}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className="text-white"
                        style={{ backgroundColor: result.primaryDiagnosis.color }}
                      >
                        {result.primaryDiagnosis.name}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => downloadReport(result)}>
                        <Download className="h-4 w-4 mr-1" />
                        Report
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => saveAnalysis(result)}>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-[#0A3D62] mb-3">Primary Diagnosis</h5>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{result.primaryDiagnosis.name}</span>
                          <Badge className="bg-[#0A3D62] text-white">
                            {result.primaryDiagnosis.confidence}% confidence
                          </Badge>
                        </div>
                        {result.primaryDiagnosis.severity !== 'None' && (
                          <p className="text-sm text-[#6C757D]">
                            Severity: <span className="font-medium">{result.primaryDiagnosis.severity}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-[#0A3D62] mb-3">Key Findings</h5>
                      <div className="space-y-2">
                        {result.findings.map((finding, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span>{finding.finding}</span>
                            <div className="flex items-center space-x-2">
                              <Badge className={
                                finding.status === 'Normal' 
                                  ? 'bg-[#E8F5E8] text-[#27AE60]' 
                                  : 'bg-[#FFF8E1] text-[#F39C12]'
                              }>
                                {finding.status}
                              </Badge>
                              <span className="text-xs text-[#6C757D]">{finding.confidence}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-[#0A3D62] mb-2">Recommendations</h5>
                      <ul className="text-sm text-[#6C757D] space-y-1">
                        {result.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-[#27AE60] mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-xs text-[#6C757D] space-y-1">
                      <p>Analysis Date: {new Date(result.analysisDate).toLocaleString()}</p>
                      <p>Model Version: {result.modelVersion}</p>
                      <p>Processing Time: {result.processingTime}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}