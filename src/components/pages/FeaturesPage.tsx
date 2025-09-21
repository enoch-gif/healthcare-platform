import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import Footer from '../Footer';
import { 
  Eye, 
  Brain, 
  Camera, 
  Upload, 
  BarChart3, 
  Shield, 
  Users, 
  Stethoscope,
  Volume2,
  Download,
  Clock,
  Target,
  ArrowLeft,
  CheckCircle,
  Zap,
  Globe,
  Award
} from 'lucide-react';

export default function FeaturesPage({ onNavigate, user }) {
  const coreFeatures = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced deep learning models with 98.45% accuracy for detecting CNV, DME, Drusen, and other retinal conditions.',
      features: ['DeiT + ResNet18 fusion architecture', 'Real-time image processing', 'Multi-condition detection', 'Confidence scoring']
    },
    {
      icon: Camera,
      title: 'Professional Imaging',
      description: 'High-quality retinal image capture with optimized controls for medical-grade diagnostics.',
      features: ['Real-time camera integration', 'Quality validation', 'Multiple format support', 'Batch processing']
    },
    {
      icon: Volume2,
      title: 'Voice Consultation',
      description: 'Automated voice consultation system that provides spoken analysis results and recommendations.',
      features: ['AI-generated explanations', 'Multiple languages', 'Customizable voice settings', 'Audio transcripts']
    },
    {
      icon: BarChart3,
      title: 'Clinical Reports',
      description: 'Comprehensive diagnostic reports with detailed analysis, recommendations, and exportable formats.',
      features: ['PDF export', 'DICOM compatibility', 'Treatment recommendations', 'Progress tracking']
    },
    {
      icon: Shield,
      title: 'Medical-Grade Security',
      description: 'HIPAA-compliant infrastructure with enterprise-level data protection and privacy controls.',
      features: ['End-to-end encryption', 'Audit trails', 'Role-based access', 'Data sovereignty']
    },
    {
      icon: Users,
      title: 'Patient Management',
      description: 'Complete EMR integration with patient tracking, appointment scheduling, and workflow optimization.',
      features: ['Patient records', 'Appointment scheduling', 'Treatment history', 'Care coordination']
    }
  ];

  const advancedFeatures = [
    {
      icon: Stethoscope,
      title: 'Retinal Doctor AI',
      description: 'Specialized AI assistant providing personalized consultations and medical guidance.',
      color: 'medical-blue'
    },
    {
      icon: Globe,
      title: 'Multi-Platform Access',
      description: 'Web, mobile, and desktop applications with seamless synchronization.',
      color: 'health-green'
    },
    {
      icon: Zap,
      title: 'Real-Time Processing',
      description: 'Instant analysis results with live collaboration between healthcare providers.',
      color: 'warning'
    },
    {
      icon: Award,
      title: 'Continuous Learning',
      description: 'AI models that improve over time with new data and clinical feedback.',
      color: 'accent-red'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50 medical-shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => onNavigate('landing')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <Eye className="h-8 w-8 text-medical-blue" />
              <span className="text-xl font-semibold text-medical-blue">Retinal-AI Features</span>
            </div>
          </div>
          {user && (
            <Badge variant="outline" className="bg-health-green-lighter text-health-green">
              Welcome, {user.name}
            </Badge>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 medical-gradient">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-medical-blue mb-6">
            Comprehensive AI Features
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Discover the advanced capabilities that make Retinal-AI the leading platform 
            for AI-powered retinal disease diagnosis and patient management.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-health-green" />
              <span>98.45% Accuracy</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-health-green" />
              <span>Real-Time Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-health-green" />
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-medical-blue mb-6">Core Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive suite of features designed to enhance diagnostic accuracy, 
              improve patient outcomes, and streamline clinical workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="border-0 medical-shadow hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-medical-blue-lighter rounded-2xl flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-medical-blue" />
                  </div>
                  <CardTitle className="text-xl text-medical-blue">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-health-green mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 px-4 bg-medical-blue-lighter/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-medical-blue mb-6">Advanced Capabilities</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Cutting-edge features that set Retinal-AI apart in the healthcare technology landscape.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {advancedFeatures.map((feature, index) => {
              const getColorClasses = (color) => {
                switch (color) {
                  case 'medical-blue':
                    return {
                      bg: 'bg-medical-blue-lighter',
                      text: 'text-medical-blue'
                    };
                  case 'health-green':
                    return {
                      bg: 'bg-health-green-lighter',
                      text: 'text-health-green'
                    };
                  case 'warning':
                    return {
                      bg: 'bg-yellow-100',
                      text: 'text-yellow-600'
                    };
                  case 'accent-red':
                    return {
                      bg: 'bg-accent-red-lighter',
                      text: 'text-accent-red'
                    };
                  default:
                    return {
                      bg: 'bg-gray-100',
                      text: 'text-gray-600'
                    };
                }
              };
              
              const colorClasses = getColorClasses(feature.color);
              
              return (
                <Card key={index} className="border-0 medical-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${colorClasses.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <feature.icon className={`h-6 w-6 ${colorClasses.text}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-medical-blue mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-medical-blue mb-6">Technical Specifications</h2>
            <p className="text-xl text-muted-foreground">
              Built on robust, scalable technology infrastructure for enterprise healthcare
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 medical-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-medical-blue">
                  <Brain className="h-6 w-6 mr-2" />
                  AI Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Model Type</span>
                  <span className="text-sm font-medium">Fusion CNN + Transformer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Accuracy</span>
                  <span className="text-sm font-medium">98.45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Processing Time</span>
                  <span className="text-sm font-medium">&lt; 3 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Conditions Detected</span>
                  <span className="text-sm font-medium">15+ diseases</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 medical-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-medical-blue">
                  <Shield className="h-6 w-6 mr-2" />
                  Security & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Encryption</span>
                  <span className="text-sm font-medium">AES-256</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Compliance</span>
                  <span className="text-sm font-medium">HIPAA, SOC 2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Authentication</span>
                  <span className="text-sm font-medium">Multi-factor</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Data Centers</span>
                  <span className="text-sm font-medium">Global redundancy</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 medical-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-medical-blue">
                  <Globe className="h-6 w-6 mr-2" />
                  Platform Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Web Browsers</span>
                  <span className="text-sm font-medium">All modern browsers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Mobile Apps</span>
                  <span className="text-sm font-medium">iOS, Android</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">API Integration</span>
                  <span className="text-sm font-medium">RESTful APIs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Languages</span>
                  <span className="text-sm font-medium">15+ supported</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Integration Options */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-medical-blue mb-6">Integration Options</h2>
            <p className="text-muted-foreground">
              Seamlessly integrate with your existing healthcare infrastructure
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-medical-blue">EMR Integration</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-health-green mr-2" />
                  Epic, Cerner, Allscripts
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-health-green mr-2" />
                  FHIR R4 compatibility
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-health-green mr-2" />
                  HL7 messaging
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-health-green mr-2" />
                  Custom API endpoints
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-medical-blue">Imaging Systems</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-health-green mr-2" />
                  DICOM compatibility
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-health-green mr-2" />
                  PACS integration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-health-green mr-2" />
                  Fundus camera connectivity
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-health-green mr-2" />
                  OCT device support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 medical-gradient">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-medical-blue mb-6">
            Ready to Experience Advanced AI Diagnostics?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of healthcare professionals using Retinal-AI for better patient outcomes
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg" 
              className="bg-medical-blue hover:bg-medical-blue-light text-white"
              onClick={() => onNavigate(user ? (user.role || 'login') : 'signup')}
            >
              <Eye className="h-5 w-5 mr-2" />
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-health-green text-health-green hover:bg-health-green hover:text-white"
              onClick={() => onNavigate('contact')}
            >
              <Users className="h-5 w-5 mr-2" />
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}