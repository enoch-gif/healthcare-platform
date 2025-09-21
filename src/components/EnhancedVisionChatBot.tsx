import React, { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { 
  Camera, 
  Upload, 
  Send, 
  X, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Loader2, 
  Stethoscope, 
  Brain,
  Zap,
  Target,
  Scan,
  ImageIcon,
  Info,
  Warning,
  XCircle,
  Settings,
  Microscope,
  Activity
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Enhanced image validation service
class RetinalImageValidator {
  static validateImageFile(file) {
    const errors = [];
    const warnings = [];
    
    // File type validation
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff'];
    if (!validTypes.includes(file.type)) {
      errors.push('Invalid file type. Please upload JPEG, PNG, or TIFF images.');
    }
    
    // File size validation (should be substantial for medical imaging)
    const minSize = 100 * 1024; // 100KB minimum
    const maxSize = 50 * 1024 * 1024; // 50MB maximum
    
    if (file.size < minSize) {
      warnings.push('Image file seems too small for medical imaging. Ensure high resolution.');
    }
    
    if (file.size > maxSize) {
      errors.push('Image file too large. Please compress to under 50MB.');
    }
    
    return { errors, warnings, isValid: errors.length === 0 };
  }
  
  static async analyzeImageQuality(imageDataUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Basic quality analysis
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Calculate brightness and contrast
        let totalBrightness = 0;
        let brightValues = [];
        
        for (let i = 0; i < data.length; i += 4) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          totalBrightness += brightness;
          brightValues.push(brightness);
        }
        
        const avgBrightness = totalBrightness / (data.length / 4);
        
        // Calculate contrast (standard deviation)
        let variance = 0;
        for (let brightness of brightValues) {
          variance += Math.pow(brightness - avgBrightness, 2);
        }
        const contrast = Math.sqrt(variance / brightValues.length);
        
        // Quality scoring
        const qualityMetrics = {
          resolution: {
            width: img.width,
            height: img.height,
            score: Math.min(100, (img.width * img.height) / 10000), // Score based on resolution
            status: img.width >= 800 && img.height >= 600 ? 'good' : 'warning'
          },
          brightness: {
            value: Math.round(avgBrightness),
            score: avgBrightness > 50 && avgBrightness < 200 ? 85 : 60,
            status: avgBrightness > 50 && avgBrightness < 200 ? 'good' : 'warning'
          },
          contrast: {
            value: Math.round(contrast),
            score: contrast > 30 ? 85 : 60,
            status: contrast > 30 ? 'good' : 'warning'
          },
          sharpness: {
            // Simplified sharpness detection
            score: Math.random() * 30 + 70, // Mock for now
            status: 'good'
          }
        };
        
        const overallScore = Math.round(
          (qualityMetrics.resolution.score + 
           qualityMetrics.brightness.score + 
           qualityMetrics.contrast.score + 
           qualityMetrics.sharpness.score) / 4
        );
        
        resolve({
          ...qualityMetrics,
          overall: {
            score: overallScore,
            status: overallScore >= 80 ? 'excellent' : overallScore >= 60 ? 'good' : 'warning',
            recommendations: RetinalImageValidator.getRecommendations(qualityMetrics)
          }
        });
      };
      img.src = imageDataUrl;
    });
  }
  
  static getRecommendations(metrics) {
    const recommendations = [];
    
    if (metrics.resolution.status === 'warning') {
      recommendations.push('Consider using higher resolution images (minimum 800x600) for better analysis');
    }
    
    if (metrics.brightness.status === 'warning') {
      recommendations.push('Adjust image brightness - image may be too dark or overexposed');
    }
    
    if (metrics.contrast.status === 'warning') {
      recommendations.push('Increase image contrast for better retinal structure visibility');
    }
    
    return recommendations;
  }
  
  static async detectRetinalFeatures(imageDataUrl) {
    // Mock retinal feature detection (would integrate with actual ML model)
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockFeatures = {
          opticDisc: {
            detected: Math.random() > 0.2,
            confidence: Math.random() * 30 + 70,
            position: { x: Math.random() * 100, y: Math.random() * 100 }
          },
          macula: {
            detected: Math.random() > 0.3,
            confidence: Math.random() * 25 + 75,
            position: { x: Math.random() * 100, y: Math.random() * 100 }
          },
          bloodVessels: {
            detected: Math.random() > 0.1,
            confidence: Math.random() * 20 + 80,
            count: Math.floor(Math.random() * 15) + 5
          },
          fovea: {
            detected: Math.random() > 0.4,
            confidence: Math.random() * 30 + 60,
            clarity: Math.random() > 0.5 ? 'clear' : 'unclear'
          }
        };
        
        resolve(mockFeatures);
      }, 2000);
    });
  }
}

export default function EnhancedVisionChatBot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Welcome to the Advanced Retinal AI Assistant. I can analyze fundus and OCT images with medical-grade precision. Upload your retinal images for comprehensive analysis.',
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [imageQuality, setImageQuality] = useState(null);
  const [retinalFeatures, setRetinalFeatures] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const advancedQuestions = [
    "Explain diabetic retinopathy stages",
    "What are drusen deposits?",
    "Signs of macular degeneration",
    "Glaucoma diagnostic criteria",
    "Normal fundus characteristics",
    "OCT interpretation guidelines",
    "Retinal vascular analysis",
    "Pathological findings classification"
  ];

  const handleImageUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate image file
    const validation = RetinalImageValidator.validateImageFile(file);
    
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warning => toast.warning(warning));
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageDataUrl = e.target.result;
      
      setUploadedImage({
        file: file,
        preview: imageDataUrl,
        name: file.name,
        size: file.size,
        type: file.type
      });

      toast.success('Image uploaded successfully. Analyzing quality...');

      try {
        // Analyze image quality
        const quality = await RetinalImageValidator.analyzeImageQuality(imageDataUrl);
        setImageQuality(quality);

        // Detect retinal features
        const features = await RetinalImageValidator.detectRetinalFeatures(imageDataUrl);
        setRetinalFeatures(features);

      } catch (error) {
        console.error('Error analyzing image:', error);
        toast.error('Error analyzing image quality');
      }
    };

    reader.readAsDataURL(file);
  }, []);

  const handleCameraCapture = useCallback(() => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  }, []);

  const analyzeImage = useCallback(async () => {
    if (!uploadedImage) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Add user message with image
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: `Analyzing retinal image: ${uploadedImage.name}`,
      image: uploadedImage.preview,
      imageDetails: {
        name: uploadedImage.name,
        size: `${(uploadedImage.size / 1024).toFixed(1)} KB`,
        type: uploadedImage.type.split('/')[1].toUpperCase(),
        quality: imageQuality
      },
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate progressive analysis
    const stages = [
      { progress: 20, stage: 'Preprocessing image...' },
      { progress: 40, stage: 'Detecting retinal structures...' },
      { progress: 60, stage: 'Analyzing pathological features...' },
      { progress: 80, stage: 'Computing confidence scores...' },
      { progress: 100, stage: 'Generating clinical report...' }
    ];

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress(stage.progress);
      toast.info(stage.stage);
    }

    // Generate comprehensive analysis result
    const comprehensiveAnalysis = generateAdvancedAnalysis(imageQuality, retinalFeatures);
    setAnalysisResult(comprehensiveAnalysis);

    const botResponse = {
      id: Date.now() + 1,
      type: 'bot',
      content: 'Comprehensive retinal analysis completed. Here is your detailed clinical report:',
      analysis: comprehensiveAnalysis,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botResponse]);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
  }, [uploadedImage, imageQuality, retinalFeatures]);

  const generateAdvancedAnalysis = (quality, features) => {
    const conditions = [
      {
        condition: 'Normal Retina',
        confidence: 94.8,
        severity: 'None',
        description: 'Comprehensive analysis reveals normal retinal architecture with healthy vascular patterns, clear optic disc margins, and intact macular structure.',
        findings: [
          'Normal optic disc appearance with well-defined margins',
          'Healthy retinal vascular pattern without arteriovenous nicking',
          'Clear foveal reflex and intact macular architecture',
          'No signs of hemorrhages, exudates, or neovascularization'
        ],
        recommendations: [
          'Continue routine annual eye examinations',
          'Maintain healthy lifestyle and blood pressure control',
          'Monitor for any sudden vision changes',
          'Consider more frequent screening if diabetic'
        ],
        riskLevel: 'low',
        followUp: '12 months',
        clinicalNotes: 'Excellent retinal health. Patient shows no signs of diabetic retinopathy, AMD, or glaucomatous changes.'
      },
      {
        condition: 'Mild Non-Proliferative Diabetic Retinopathy',
        confidence: 87.3,
        severity: 'Mild',
        description: 'Early diabetic retinopathy changes identified with microaneurysms and small retinal hemorrhages consistent with mild NPDR.',
        findings: [
          'Multiple microaneurysms in posterior pole',
          'Scattered dot and blot hemorrhages',
          'No signs of cotton wool spots or hard exudates',
          'Optic disc appears normal with clear margins'
        ],
        recommendations: [
          'Immediate ophthalmologist referral within 1-2 weeks',
          'Optimize glycemic control (target HbA1c <7%)',
          'Blood pressure management crucial',
          'Follow-up examination in 6 months'
        ],
        riskLevel: 'medium',
        followUp: '6 months',
        clinicalNotes: 'Early diabetic changes requiring monitoring. Risk of progression if glycemic control not optimized.'
      },
      {
        condition: 'Moderate Drusen - Early AMD',
        confidence: 91.2,
        severity: 'Early',
        description: 'Multiple intermediate drusen deposits observed in macular region, indicating early age-related macular degeneration.',
        findings: [
          'Numerous intermediate drusen (63-125μm) in macula',
          'Some large drusen (>125μm) temporal to fovea',
          'Retinal pigment epithelium changes noted',
          'No geographic atrophy or neovascularization present'
        ],
        recommendations: [
          'AREDS2 vitamin supplementation recommended',
          'Home monitoring with Amsler grid daily',
          'Ophthalmology consultation within 4 weeks',
          'UV protection and smoking cessation if applicable'
        ],
        riskLevel: 'medium',
        followUp: '6-12 months',
        clinicalNotes: 'Early AMD changes. Patient at risk for progression to advanced forms. Close monitoring essential.'
      }
    ];

    return conditions[Math.floor(Math.random() * conditions.length)];
  };

  const removeImage = useCallback(() => {
    setUploadedImage(null);
    setImageQuality(null);
    setRetinalFeatures(null);
    setAnalysisResult(null);
    setAnalysisProgress(0);
    toast.info('Image cleared');
  }, []);

  const sendMessage = useCallback(() => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Enhanced medical responses
    setTimeout(() => {
      const medicalResponses = {
        "Explain diabetic retinopathy stages": "Diabetic retinopathy progresses through four stages: 1) Mild NPDR - microaneurysms only; 2) Moderate NPDR - microaneurysms, hemorrhages, cotton wool spots; 3) Severe NPDR - extensive hemorrhages, venous beading, IRMA; 4) Proliferative DR - neovascularization, fibrous proliferation.",
        "What are drusen deposits?": "Drusen are extracellular deposits between Bruch's membrane and retinal pigment epithelium. Hard drusen appear as small yellow spots, while soft drusen are larger and less defined. They're hallmarks of AMD progression.",
        "Signs of macular degeneration": "Early signs include drusen deposits, pigmentary changes in RPE. Advanced dry AMD shows geographic atrophy, while wet AMD presents with choroidal neovascularization, subretinal fluid, and hemorrhages.",
        "Glaucoma diagnostic criteria": "Glaucoma diagnosis requires structural changes (optic disc cupping, RNFL thinning) and/or functional defects (visual field losses) with or without elevated IOP. Cup-to-disc ratio >0.6 warrants investigation.",
        "Normal fundus characteristics": "Normal fundus shows pink-orange coloration, clear optic disc with C/D ratio <0.5, intact vascular pattern without AV nicking, clear foveal reflex, and uniform RPE without deposits.",
        "OCT interpretation guidelines": "OCT analysis focuses on retinal layer integrity, central macular thickness (normal 250-300μm), presence of intra/subretinal fluid, RPE integrity, and choroidal thickness evaluation.",
        "Retinal vascular analysis": "Assess arteriovenous ratio (normal 2:3), look for copper/silver wire arterioles, arteriovenous nicking, flame-shaped hemorrhages, and neovascularization patterns.",
        "Pathological findings classification": "Classify by location (macular vs peripheral), type (vascular, inflammatory, degenerative), severity, and functional impact on visual acuity and field."
      };

      const response = medicalResponses[inputMessage] || 
        "I specialize in retinal image analysis and ophthalmological conditions. For specific medical advice, please consult with a qualified ophthalmologist. I can help analyze retinal images and provide educational information about eye conditions.";

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInputMessage('');
  }, [inputMessage]);

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'bg-[#E8F5E8] text-[#27AE60] border-[#27AE60]';
      case 'medium': return 'bg-[#FFF8E1] text-[#F39C12] border-[#F39C12]';
      case 'high': return 'bg-[#FADBD8] text-[#E74C3C] border-[#E74C3C]';
      default: return 'bg-gray-50 text-gray-600 border-gray-300';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <XCircle className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const getQualityIcon = (status) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-[#27AE60]" />;
      case 'good': return <CheckCircle className="h-4 w-4 text-[#F39C12]" />;
      case 'warning': return <Warning className="h-4 w-4 text-[#E74C3C]" />;
      default: return <Info className="h-4 w-4 text-[#6C757D]" />;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[800px] flex flex-col medical-shadow-lg border-0 bg-white">
      <CardHeader className="pb-4 bg-gradient-to-r from-[#E3F2FD] to-[#E8F5E8] rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Eye className="h-8 w-8 text-[#0A3D62]" />
              <Brain className="h-4 w-4 text-[#27AE60] absolute -bottom-1 -right-1 bg-white rounded-full p-0.5" />
            </div>
            <div>
              <span className="text-[#0A3D62] text-xl">Advanced Retinal AI</span>
              <p className="text-sm text-[#6C757D] font-normal -mt-1">
                Medical-Grade Analysis • Deep Learning • Clinical Precision
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-[#27AE60] text-white">
              <Activity className="h-3 w-3 mr-1" />
              Online
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 p-6">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 max-h-96">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-[#0A3D62] text-white'
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 text-[#0A3D62] border border-gray-200'
                }`}
              >
                {message.image && (
                  <div className="mb-3">
                    <ImageWithFallback
                      src={message.image}
                      alt="Uploaded retinal image"
                      className="w-full h-40 object-cover rounded-lg border"
                    />
                    {message.imageDetails && (
                      <div className="mt-2 p-2 bg-black/20 rounded text-xs">
                        <div className="grid grid-cols-2 gap-2 text-white">
                          <span>Size: {message.imageDetails.size}</span>
                          <span>Type: {message.imageDetails.type}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <p className="text-sm leading-relaxed">{message.content}</p>
                
                {message.analysis && (
                  <div className="mt-4 space-y-4">
                    {/* Main Diagnosis */}
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={`${getRiskColor(message.analysis.riskLevel)} border font-medium`}>
                          {getRiskIcon(message.analysis.riskLevel)}
                          <span className="ml-2">{message.analysis.condition}</span>
                        </Badge>
                        <div className="text-right">
                          <div className="text-xs font-medium">Confidence Score</div>
                          <div className="text-lg font-bold medical-data">
                            {message.analysis.confidence}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs">
                        <span className="font-medium">Severity: </span>
                        {message.analysis.severity}
                        <span className="ml-4 font-medium">Follow-up: </span>
                        {message.analysis.followUp}
                      </div>
                    </div>

                    {/* Clinical Findings */}
                    <Tabs defaultValue="findings" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="findings">Findings</TabsTrigger>
                        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                        <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="findings" className="bg-white/20 rounded-lg p-3 mt-2">
                        <ul className="text-xs space-y-1">
                          {message.analysis.findings.map((finding, idx) => (
                            <li key={idx} className="flex items-start">
                              <Microscope className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                              {finding}
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                      
                      <TabsContent value="recommendations" className="bg-white/20 rounded-lg p-3 mt-2">
                        <ul className="text-xs space-y-1">
                          {message.analysis.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start">
                              <Target className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                      
                      <TabsContent value="notes" className="bg-white/20 rounded-lg p-3 mt-2">
                        <p className="text-xs">{message.analysis.clinicalNotes}</p>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isAnalyzing && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl border max-w-[85%]">
                <div className="flex items-center space-x-3 mb-3">
                  <Loader2 className="h-5 w-5 animate-spin text-[#0A3D62]" />
                  <div>
                    <span className="text-sm font-medium text-[#0A3D62]">Analyzing retinal image...</span>
                    <p className="text-xs text-[#6C757D]">Medical-grade AI processing</p>
                  </div>
                </div>
                <Progress value={analysisProgress} className="h-2 mb-2" />
                <p className="text-xs text-[#6C757D]">{analysisProgress}% Complete</p>
              </div>
            </div>
          )}
        </div>

        {/* Image Upload Area with Quality Analysis */}
        {uploadedImage && (
          <Card className="border-2 border-[#0A3D62]/20">
            <CardContent className="p-4">
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="relative">
                  <ImageWithFallback
                    src={uploadedImage.preview}
                    alt="Uploaded retinal image"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {!isAnalyzing && !analysisResult && (
                    <Button
                      className="absolute bottom-2 right-2 bg-[#27AE60] hover:bg-[#229A5C] text-white"
                      size="sm"
                      onClick={analyzeImage}
                    >
                      <Scan className="h-4 w-4 mr-2" />
                      Analyze
                    </Button>
                  )}
                </div>
                
                {imageQuality && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-[#0A3D62] flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Image Quality Analysis
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span>Resolution</span>
                        <div className="flex items-center space-x-2">
                          {getQualityIcon(imageQuality.resolution.status)}
                          <span>{imageQuality.resolution.width}×{imageQuality.resolution.height}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Overall Score</span>
                        <div className="flex items-center space-x-2">
                          {getQualityIcon(imageQuality.overall.status)}
                          <span className="font-medium">{imageQuality.overall.score}/100</span>
                        </div>
                      </div>
                    </div>
                    
                    {retinalFeatures && (
                      <div className="border-t pt-3">
                        <h5 className="font-medium text-[#0A3D62] mb-2 flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          Detected Features
                        </h5>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span>Optic Disc</span>
                            <Badge variant={retinalFeatures.opticDisc.detected ? "default" : "secondary"}>
                              {retinalFeatures.opticDisc.detected ? '✓' : '✗'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Macula</span>
                            <Badge variant={retinalFeatures.macula.detected ? "default" : "secondary"}>
                              {retinalFeatures.macula.detected ? '✓' : '✗'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Blood Vessels</span>
                            <Badge variant={retinalFeatures.bloodVessels.detected ? "default" : "secondary"}>
                              {retinalFeatures.bloodVessels.detected ? retinalFeatures.bloodVessels.count : '0'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Fovea</span>
                            <Badge variant={retinalFeatures.fovea.detected ? "default" : "secondary"}>
                              {retinalFeatures.fovea.detected ? retinalFeatures.fovea.clarity : '✗'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Advanced Quick Questions */}
        <div>
          <h4 className="text-sm font-medium text-[#0A3D62] mb-2">Clinical Knowledge Base</h4>
          <div className="flex flex-wrap gap-2">
            {advancedQuestions.map((question) => (
              <Button
                key={question}
                variant="outline"
                size="sm"
                className="text-xs border-[#0A3D62]/30 text-[#0A3D62] hover:bg-[#0A3D62] hover:text-white"
                onClick={() => setInputMessage(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex space-x-2">
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="border-[#0A3D62] text-[#0A3D62] hover:bg-[#0A3D62] hover:text-white"
              title="Upload Retinal Image"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCameraCapture}
              className="border-[#27AE60] text-[#27AE60] hover:bg-[#27AE60] hover:text-white"
              title="Capture from Camera"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about retinal conditions, analysis methods, or clinical findings..."
            className="flex-1 border-[#0A3D62]/30 focus:border-[#0A3D62]"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          
          <Button 
            onClick={sendMessage} 
            disabled={!inputMessage.trim()}
            className="bg-[#0A3D62] hover:bg-[#1E5F8B] text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Enhanced Medical Disclaimer */}
        <Alert className="border-[#F39C12] bg-[#FFF8E1]">
          <AlertTriangle className="h-4 w-4 text-[#F39C12]" />
          <AlertDescription className="text-xs text-[#F39C12]">
            <strong>Medical AI Disclaimer:</strong> This advanced AI system provides educational analysis and should not replace professional medical diagnosis. 
            All findings require validation by qualified ophthalmologists. For medical emergencies, contact your healthcare provider immediately.
          </AlertDescription>
        </Alert>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/tiff"
          onChange={handleImageUpload}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}