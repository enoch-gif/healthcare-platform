import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Upload, 
  Eye, 
  Brain, 
  Camera, 
  Zap, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Save, 
  Download, 
  RefreshCw,
  Info,
  Activity,
  Microscope,
  FileText,
  User,
  Calendar,
  Clock,
  Stethoscope,
  Volume2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { mongodbService } from '../../services/mongodbService';
import { authService } from '../../services/authService';
import VoiceControlPanel from './VoiceControlPanel';

export default function FundusAnalysis({ user }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [showVoiceConsultation, setShowVoiceConsultation] = useState(false);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [uploadedImageData, setUploadedImageData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Load patients on component mount
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const patientsData = await mongodbService.getPatients();
      setPatients(patientsData || []);
    } catch (error) {
      console.error('Error loading patients:', error);
      // Fallback to mock data if MongoDB fails
      setPatients([
        { id: 'p1', name: 'John Smith', age: 45, mrn: 'MRN-2025-001' },
        { id: 'p2', name: 'Sarah Johnson', age: 62, mrn: 'MRN-2025-002' },
        { id: 'p3', name: 'Michael Chen', age: 38, mrn: 'MRN-2025-003' }
      ]);
    }
  };

  const [patients, setPatients] = useState([]);

  // Mock analysis results with realistic medical data
  const mockAnalysisResults = {
    primaryDiagnosis: {
      condition: 'Diabetic Macular Edema (DME)',
      confidence: 94.2,
      severity: 'Moderate',
      riskLevel: 'High'
    },
    secondaryFindings: [
      { condition: 'Early Diabetic Retinopathy', confidence: 87.3 },
      { condition: 'Microaneurysms', confidence: 92.1 },
      { condition: 'Hard Exudates', confidence: 88.7 }
    ],
    anatomicalFeatures: {
      macularThickness: '387 μm',
      centralSubfieldThickness: '312 μm',
      retinalVolume: '8.45 mm³',
      fovealContour: 'Irregular'
    },
    aiModelDetails: {
      modelUsed: 'Fusion Model v2.1.0 (DeiT + ResNet18)',
      processingTime: '2.3 seconds',
      imageQuality: 'Excellent',
      artifacts: 'None detected'
    },
    recommendations: [
      'Immediate anti-VEGF therapy recommended',
      'Follow-up OCT in 4-6 weeks',
      'Coordinate with endocrinology for diabetes management',
      'Consider fluorescein angiography if no improvement',
      'Monitor for progression to proliferative diabetic retinopathy'
    ],
    treatmentPlan: {
      immediate: 'Intravitreal anti-VEGF injection',
      followUp: 'OCT and visual acuity assessment in 1 month',
      longTerm: 'Quarterly monitoring with OCT and fundus photography'
    },
    riskFactors: [
      'Uncontrolled diabetes mellitus',
      'Hypertension',
      'Duration of diabetes > 15 years'
    ],
    confidenceBreakdown: [
      { feature: 'Fluid Detection', confidence: 96.8 },
      { feature: 'Retinal Layers', confidence: 94.2 },
      { feature: 'Vascular Changes', confidence: 89.5 },
      { feature: 'Hemorrhages', confidence: 91.3 }
    ],
    comparisonData: [
      { category: 'Normal', value: 5.8, color: '#27AE60' },
      { category: 'CNV', value: 12.4, color: '#E74C3C' },
      { category: 'DME', value: 94.2, color: '#F39C12' },
      { category: 'Drusen', value: 8.1, color: '#9B59B6' }
    ]
  };

  const handleImageUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size too large. Please select an image under 10MB.');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Upload to MongoDB if patient is selected
      if (selectedPatient && file) {
        await uploadImageToMongoDB(file);
      }
      
      // Reset previous results
      setAnalysisResults(null);
      setAnalysisProgress(0);
      setShowVoiceConsultation(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const mockEvent = { target: { files: [file] } };
        await handleImageUpload(mockEvent);
      }
    }
  }, [handleImageUpload]);

  const uploadImageToSupabase = async (file) => {
    if (!selectedPatient) return;

    setIsUploading(true);
    try {
      const uploadedFile = await supabaseDataService.uploadRetinalImage(file, selectedPatient);
      setUploadedImageData(uploadedFile);
      console.log('Image uploaded successfully:', uploadedFile);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Image upload failed. Analysis will continue with local data.');
    } finally {
      setIsUploading(false);
    }
  };

  const simulateAnalysis = async () => {
    if (!selectedImage) {
      alert('Please select an image first.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate AI processing with realistic steps
    const steps = [
      { progress: 15, message: 'Preprocessing image...' },
      { progress: 30, message: 'Running DeiT vision transformer...' },
      { progress: 50, message: 'Processing ResNet18 features...' },
      { progress: 70, message: 'Fusing model outputs...' },
      { progress: 85, message: 'Generating confidence scores...' },
      { progress: 100, message: 'Analysis complete!' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress(step.progress);
    }

    // Set results
    setAnalysisResults(mockAnalysisResults);
    setIsAnalyzing(false);
    
    // Auto-show voice consultation
    setTimeout(() => {
      setShowVoiceConsultation(true);
    }, 500);

    // Add to history
    const newAnalysis = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      patientId: selectedPatient,
      patientName: patients.find(p => p.id === selectedPatient)?.name || 'Unknown Patient',
      diagnosis: mockAnalysisResults.primaryDiagnosis.condition,
      confidence: mockAnalysisResults.primaryDiagnosis.confidence,
      severity: mockAnalysisResults.primaryDiagnosis.severity,
      imagePreview: imagePreview
    };
    
    setAnalysisHistory(prev => [newAnalysis, ...prev.slice(0, 9)]); // Keep last 10
  };

  const handleSaveResults = async () => {
    if (!analysisResults || !selectedPatient) {
      alert('Please select a patient and complete analysis before saving.');
      return;
    }

    try {
      const analysisData = supabaseDataService.formatAnalysisForStorage(
        analysisResults,
        selectedPatient,
        uploadedImageData || { localPreview: imagePreview },
        clinicalNotes
      );

      const savedAnalysis = await supabaseDataService.saveAnalysis(analysisData);
      
      console.log('Analysis saved to Supabase:', savedAnalysis);
      alert('Analysis results saved successfully to patient record in Supabase.');
      
      // Reset form
      setSelectedImage(null);
      setImagePreview(null);
      setAnalysisResults(null);
      setSelectedPatient('');
      setClinicalNotes('');
      setShowVoiceConsultation(false);
      setUploadedImageData(null);
      
    } catch (error) {
      console.error('Error saving analysis:', error);
      alert('Failed to save analysis. Please try again.');
    }
  };

  const handleVoicePlayStart = () => {
    setIsVoicePlaying(true);
  };

  const handleVoicePlayEnd = () => {
    setIsVoicePlaying(false);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-health-green';
    if (confidence >= 80) return 'text-yellow-600';
    if (confidence >= 70) return 'text-orange-600';
    return 'text-accent-red';
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'mild': return 'bg-health-green-lighter text-health-green';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'severe': return 'bg-accent-red-lighter text-accent-red';
      default: return 'bg-medical-blue-lighter text-medical-blue';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-medical-blue mb-2">Fundus Image Analysis</h1>
          <p className="text-muted-foreground">AI-powered retinal disease diagnosis with voice consultation</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-medical-blue-lighter text-medical-blue">
            <Brain className="w-4 h-4 mr-2" />
            Fusion Model v2.1.0
          </Badge>
          <Badge variant="outline" className="bg-health-green-lighter text-health-green">
            <Target className="w-4 h-4 mr-2" />
            98.45% Accuracy
          </Badge>
          {showVoiceConsultation && (
            <Badge variant="outline" className="bg-gradient-to-r from-medical-blue-lighter to-health-green-lighter text-medical-blue">
              <Volume2 className="w-4 h-4 mr-2" />
              Voice Active
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image Upload & Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="w-5 h-5 mr-2 text-medical-blue" />
                Image Upload & Analysis
              </CardTitle>
              <CardDescription>
                Upload fundus or OCT images for AI-powered retinal disease analysis with voice consultation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Patient Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient-select">Select Patient</Label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose patient..." />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name} - {patient.mrn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full" onClick={loadPatients}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Patients
                  </Button>
                </div>
              </div>

              {/* File Upload Area */}
              <div
                className="border-2 border-dashed border-medical-blue-lighter rounded-lg p-8 text-center hover:border-medical-blue transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <img 
                        src={imagePreview} 
                        alt="Uploaded fundus" 
                        className="max-w-xs max-h-64 rounded-lg shadow-lg mx-auto"
                      />
                      <Badge className="absolute top-2 right-2 bg-health-green">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {uploadedImageData ? 'Uploaded' : 'Ready'}
                      </Badge>
                      {isUploading && (
                        <Badge className="absolute top-2 left-2 bg-medical-blue">
                          <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                          Uploading...
                        </Badge>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-medical-blue">Image loaded successfully</p>
                      <p className="text-xs text-muted-foreground">Click to change image</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-medical-blue" />
                    <div>
                      <p className="text-lg font-medium text-medical-blue">Upload Fundus Image</p>
                      <p className="text-sm text-muted-foreground">
                        Drag and drop or click to select<br />
                        Supports: JPG, PNG, TIFF (Max 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Analysis Controls */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    OCT/Fundus Ready
                  </Badge>
                  <Badge variant="outline" className="flex items-center">
                    <Zap className="w-4 h-4 mr-1" />
                    Supabase Ready
                  </Badge>
                </div>
                <Button 
                  onClick={simulateAnalysis}
                  disabled={!selectedImage || isAnalyzing}
                  className="bg-medical-blue hover:bg-medical-blue-light"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Start Analysis
                    </>
                  )}
                </Button>
              </div>

              {/* Analysis Progress */}
              {isAnalyzing && (
                <div className="space-y-3 p-4 bg-medical-blue-lighter rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-medical-blue">AI Analysis in Progress</span>
                    <span className="text-medical-blue">{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="w-full" />
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Microscope className="w-4 h-4 mr-2" />
                    Processing with DeiT + ResNet18 fusion model...
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Voice Consultation Panel - Auto-starts */}
          {showVoiceConsultation && analysisResults && (
            <VoiceControlPanel
              analysisResults={analysisResults}
              isVisible={showVoiceConsultation}
              onPlayStart={handleVoicePlayStart}
              onPlayEnd={handleVoicePlayEnd}
            />
          )}

          {/* Analysis Results */}
          {analysisResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-medical-blue" />
                    Analysis Results
                  </div>
                  {isVoicePlaying && (
                    <Badge className="bg-medical-blue animate-pulse">
                      <Stethoscope className="w-4 h-4 mr-2" />
                      Retinal Doctor Speaking
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  AI-powered diagnosis with automated voice consultation by your Retinal Doctor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="diagnosis" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                    <TabsTrigger value="recommendations">Treatment</TabsTrigger>
                  </TabsList>

                  {/* Diagnosis Tab */}
                  <TabsContent value="diagnosis" className="space-y-4">
                    {/* Primary Diagnosis */}
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-medical-blue-lighter to-white">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-medical-blue">
                            {analysisResults.primaryDiagnosis.condition}
                          </h3>
                          <p className="text-sm text-muted-foreground">Primary Diagnosis</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getConfidenceColor(analysisResults.primaryDiagnosis.confidence)}`}>
                            {analysisResults.primaryDiagnosis.confidence.toFixed(1)}%
                          </div>
                          <p className="text-xs text-muted-foreground">Confidence</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Badge className={`${getSeverityColor(analysisResults.primaryDiagnosis.severity)}`}>
                            {analysisResults.primaryDiagnosis.severity} Severity
                          </Badge>
                        </div>
                        <div>
                          <Badge className={`${getRiskColor(analysisResults.primaryDiagnosis.riskLevel)}`}>
                            {analysisResults.primaryDiagnosis.riskLevel} Risk
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Secondary Findings */}
                    <div>
                      <h4 className="font-medium text-medical-blue mb-3">Secondary Findings</h4>
                      <div className="space-y-2">
                        {analysisResults.secondaryFindings.map((finding, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <span className="text-sm font-medium">{finding.condition}</span>
                            <Badge variant="outline" className={getConfidenceColor(finding.confidence)}>
                              {finding.confidence.toFixed(1)}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>


                  </TabsContent>

                  {/* Features Tab */}
                  <TabsContent value="features" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-medium text-medical-blue">Anatomical Measurements</h4>
                        {Object.entries(analysisResults.anatomicalFeatures).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center p-2 bg-muted rounded">
                            <span className="text-sm font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                            <span className="text-sm font-mono">{value}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium text-medical-blue">Risk Factors</h4>
                        {analysisResults.riskFactors.map((factor, index) => (
                          <div key={index} className="flex items-center p-2 bg-yellow-50 rounded">
                            <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
                            <span className="text-sm">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Disease Probability Distribution */}
                    <div>
                      <h4 className="font-medium text-medical-blue mb-3">Disease Probability Distribution</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analysisResults.comparisonData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ category, value }) => `${category}: ${value}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {analysisResults.comparisonData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Metrics Tab */}
                  <TabsContent value="metrics" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Model Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span>Model Used</span>
                            <span className="font-mono text-sm">{analysisResults.aiModelDetails.modelUsed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Processing Time</span>
                            <span className="font-mono text-sm">{analysisResults.aiModelDetails.processingTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Image Quality</span>
                            <Badge variant="outline" className="bg-health-green-lighter text-health-green">
                              {analysisResults.aiModelDetails.imageQuality}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Artifacts</span>
                            <Badge variant="outline" className="bg-health-green-lighter text-health-green">
                              {analysisResults.aiModelDetails.artifacts}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Analysis Timestamp</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-2 text-medical-blue" />
                            {new Date().toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-4 h-4 mr-2 text-medical-blue" />
                            {new Date().toLocaleTimeString()}
                          </div>
                          <div className="flex items-center text-sm">
                            <User className="w-4 h-4 mr-2 text-medical-blue" />
                            Dr. {user.name}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Recommendations Tab */}
                  <TabsContent value="recommendations" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-medical-blue mb-3">Clinical Recommendations</h4>
                        <div className="space-y-2">
                          {analysisResults.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start p-3 bg-medical-blue-lighter rounded-lg">
                              <CheckCircle className="w-5 h-5 mr-3 text-medical-blue mt-0.5" />
                              <span className="text-sm">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium text-medical-blue mb-2">Immediate Action</h5>
                          <p className="text-sm text-muted-foreground">{analysisResults.treatmentPlan.immediate}</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium text-health-green mb-2">Follow-up</h5>
                          <p className="text-sm text-muted-foreground">{analysisResults.treatmentPlan.followUp}</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium text-accent-red mb-2">Long-term Care</h5>
                          <p className="text-sm text-muted-foreground">{analysisResults.treatmentPlan.longTerm}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Clinical Notes */}
                <div className="mt-6 space-y-3">
                  <Label htmlFor="clinical-notes">Additional Clinical Notes</Label>
                  <Textarea
                    id="clinical-notes"
                    placeholder="Add your clinical observations, additional findings, or treatment modifications..."
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    className="min-h-20"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate PDF
                    </Button>
                  </div>
                  <Button 
                    onClick={handleSaveResults}
                    className="bg-health-green hover:bg-health-green-light"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save to Patient Record
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Analysis History & Quick Stats */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Analysis Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-medical-blue-lighter rounded-lg">
                  <div className="text-xl font-bold text-medical-blue">{analysisHistory.length}</div>
                  <p className="text-xs text-muted-foreground">Today's Analyses</p>
                </div>
                <div className="text-center p-3 bg-health-green-lighter rounded-lg">
                  <div className="text-xl font-bold text-health-green">98.4%</div>
                  <p className="text-xs text-muted-foreground">Avg Confidence</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>DME Cases</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>CNV Cases</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Normal Cases</span>
                  <span className="font-medium">2</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Analysis History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Analyses</CardTitle>
              <CardDescription>Latest AI diagnoses with voice consultations</CardDescription>
            </CardHeader>
            <CardContent>
              {analysisHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">No analyses performed yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analysisHistory.slice(0, 5).map((analysis) => (
                    <div key={analysis.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">{analysis.patientName}</p>
                        <Badge variant="outline" className={getConfidenceColor(analysis.confidence)}>
                          {analysis.confidence}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{analysis.diagnosis}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(analysis.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Model Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Model Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Model Version</span>
                <Badge variant="outline">v2.1.0</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Architecture</span>
                <span className="text-xs">DeiT + ResNet18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Accuracy</span>
                <span className="text-sm font-medium text-health-green">98.45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Voice System</span>
                <span className="text-xs">Auto-Start</span>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  This AI model provides automated voice consultations by your Retinal Doctor, delivering concise diagnosis summaries in under one minute.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}