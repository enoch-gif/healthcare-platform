import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import VisionChatBot from './VisionChatBot';
import Footer from './Footer';
import { Eye, Brain, Shield, Users, Camera, Upload, BarChart3, Award, CheckCircle, Star } from 'lucide-react';

export default function LandingPage({ onNavigate, isAuthenticated, user }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50 medical-shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Eye className="h-10 w-10 text-[#0A3D62]" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#27AE60] rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <span className="text-2xl font-semibold text-[#0A3D62]">Retinal-AI</span>
              <p className="text-xs text-[#6C757D] -mt-1">Medical Grade AI Diagnostics</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => onNavigate('about')} className="text-[#6C757D] hover:text-[#0A3D62] transition-colors font-medium">About</button>
            <button onClick={() => onNavigate('features')} className="text-[#6C757D] hover:text-[#0A3D62] transition-colors font-medium">Features</button>
            <button onClick={() => onNavigate('education')} className="text-[#6C757D] hover:text-[#0A3D62] transition-colors font-medium">Education</button>
            <button onClick={() => onNavigate('contact')} className="text-[#6C757D] hover:text-[#0A3D62] transition-colors font-medium">Contact</button>
            <button onClick={() => onNavigate('chatbot')} className="text-[#6C757D] hover:text-[#0A3D62] transition-colors font-medium">AI Assistant</button>
          </nav>
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <Button 
                onClick={() => {
                  if (user?.role === 'doctor') onNavigate('doctor');
                  else if (user?.role === 'patient') onNavigate('patient');
                  else if (user?.role === 'admin') onNavigate('admin');
                  else onNavigate('login');
                }}
                className="bg-[#0A3D62] hover:bg-[#1E5F8B] text-white"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => onNavigate('login')}
                  variant="outline" 
                  className="border-[#0A3D62] text-[#0A3D62] hover:bg-[#0A3D62] hover:text-white"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => onNavigate('signup')}
                  className="bg-[#0A3D62] hover:bg-[#1E5F8B] text-white"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Vision ChatBot */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="lg:order-2">
              <div className="text-center lg:text-left mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-[#E8F5E8] text-[#27AE60] rounded-full text-sm font-medium mb-6">
                  <Award className="h-4 w-4 mr-2" />
                  Medical Grade AI • 95%+ Accuracy
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-[#0A3D62] mb-6 leading-tight">
                  AI-Powered Retinal Health at Your 
                  <span className="text-[#27AE60]"> Fingertips</span>
                </h1>
                <p className="text-xl text-[#6C757D] mb-8 leading-relaxed">
                  Advanced deep learning technology for early detection of diabetic retinopathy, 
                  glaucoma, AMD, and other retinal conditions. Trusted by healthcare professionals worldwide.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button 
                    size="lg" 
                    onClick={() => isAuthenticated ? onNavigate(user?.role || 'login') : onNavigate('login')}
                    className="bg-[#0A3D62] hover:bg-[#1E5F8B] text-white px-8 py-4 text-lg w-full sm:w-auto"
                  >
                    {isAuthenticated ? 'Go to Dashboard' : 'Start Analysis'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => onNavigate('features')}
                    className="border-[#27AE60] text-[#27AE60] hover:bg-[#27AE60] hover:text-white px-8 py-4 text-lg w-full sm:w-auto"
                  >
                    Learn More
                  </Button>
                </div>
                
                {/* Trust Indicators */}
                <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-[#6C757D]">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-[#27AE60]" />
                    <span>HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-[#27AE60]" />
                    <span>FDA Guidelines</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-[#F39C12]" />
                    <span>500+ Clinics</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Vision ChatBot - Main Interactive Component */}
            <div className="lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#0A3D62]/10 to-[#27AE60]/10 rounded-2xl blur-xl"></div>
                <div className="relative">
                  <VisionChatBot />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0A3D62] mb-6">
              Advanced Medical AI Diagnostic Features
            </h2>
            <p className="text-xl text-[#6C757D] max-w-3xl mx-auto">
              Our cutting-edge technology combines GPT-4.1 Vision with specialized medical AI 
              to deliver professional-grade retinal analysis with unparalleled accuracy.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-0 medical-shadow group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0A3D62] to-[#1E5F8B] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#0A3D62]">Real-Time Capture</h3>
              <p className="text-[#6C757D] leading-relaxed">
                Professional-grade camera integration with optimized controls for high-quality retinal imaging on any device
              </p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-0 medical-shadow group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#27AE60] to-[#52C882] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#0A3D62]">AI-Powered Analysis</h3>
              <p className="text-[#6C757D] leading-relaxed">
                Advanced deep learning models trained on thousands of cases for accurate detection of CNV, DME, Drusen, and more
              </p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-0 medical-shadow group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#9B59B6] to-[#BB77BB] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#0A3D62]">Seamless Upload</h3>
              <p className="text-[#6C757D] leading-relaxed">
                Intuitive drag-and-drop interface with instant preview, batch processing, and cloud integration
              </p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-0 medical-shadow group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#F39C12] to-[#F7C74C] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#0A3D62]">Clinical Reports</h3>
              <p className="text-[#6C757D] leading-relaxed">
                Comprehensive diagnostic reports with confidence scores, recommendations, and shareable PDF exports
              </p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-0 medical-shadow group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#E74C3C] to-[#EC7063] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#0A3D62]">Medical-Grade Security</h3>
              <p className="text-[#6C757D] leading-relaxed">
                HIPAA-compliant infrastructure with end-to-end encryption and enterprise-level data protection
              </p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300 border-0 medical-shadow group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3498DB] to-[#5DADE2] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#0A3D62]">Patient Management</h3>
              <p className="text-[#6C757D] leading-relaxed">
                Complete EMR integration with patient tracking, appointment scheduling, and clinical workflow optimization
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Performance Metrics */}
      <section className="py-20 px-4 medical-gradient">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#0A3D62] mb-6">
              Trusted by Healthcare Professionals Worldwide
            </h2>
            <p className="text-xl text-[#6C757D]">
              Our AI diagnostic platform delivers clinical-grade accuracy with measurable results
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-[#27AE60] mb-2 medical-data">95.1%</div>
              <p className="text-[#6C757D] font-medium">Diagnostic Accuracy</p>
              <p className="text-sm text-[#6C757D]">Validated across 10,000+ cases</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#0A3D62] mb-2 medical-data">2,000+</div>
              <p className="text-[#6C757D] font-medium">Cases Analyzed Monthly</p>
              <p className="text-sm text-[#6C757D]">Growing 30% each quarter</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#F39C12] mb-2 medical-data">500+</div>
              <p className="text-[#6C757D] font-medium">Healthcare Providers</p>
              <p className="text-sm text-[#6C757D]">Across 25 countries</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#9B59B6] mb-2 medical-data">98.8%</div>
              <p className="text-[#6C757D] font-medium">User Satisfaction</p>
              <p className="text-sm text-[#6C757D]">Based on physician feedback</p>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Evidence */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#0A3D62] mb-6">Clinical Evidence & Validation</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center border-0 medical-shadow">
              <div className="w-12 h-12 bg-[#27AE60] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-[#0A3D62] mb-2">Peer Reviewed</h4>
              <p className="text-sm text-[#6C757D]">Published in leading ophthalmology journals with clinical validation</p>
            </Card>
            
            <Card className="p-6 text-center border-0 medical-shadow">
              <div className="w-12 h-12 bg-[#0A3D62] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-[#0A3D62] mb-2">FDA Compliant</h4>
              <p className="text-sm text-[#6C757D]">Meets FDA guidelines for AI/ML-based medical device software</p>
            </Card>
            
            <Card className="p-6 text-center border-0 medical-shadow">
              <div className="w-12 h-12 bg-[#F39C12] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-[#0A3D62] mb-2">Award Winning</h4>
              <p className="text-sm text-[#6C757D]">Recognition from international medical AI and innovation awards</p>
            </Card>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}