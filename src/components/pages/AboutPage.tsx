import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import Footer from '../Footer';
import { 
  Eye, 
  Brain, 
  Users, 
  Award, 
  Target, 
  Heart,
  Stethoscope,
  Globe,
  Shield,
  BookOpen,
  ArrowLeft
} from 'lucide-react';

export default function AboutPage({ onNavigate, user }) {
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
              <span className="text-xl font-semibold text-medical-blue">Retinal-AI</span>
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
            About Retinal-AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Revolutionizing retinal healthcare through advanced artificial intelligence, 
            making early detection and diagnosis accessible to everyone, everywhere.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-health-green" />
              <span>FDA Guidelines</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-health-green" />
              <span>98.45% Accuracy</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-health-green" />
              <span>500+ Clinics</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-0 medical-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-medical-blue">
                  <Target className="h-8 w-8 mr-3" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">
                <p className="mb-4">
                  To democratize access to advanced retinal healthcare by providing AI-powered 
                  diagnostic tools that enable early detection of sight-threatening diseases.
                </p>
                <p>
                  We believe that everyone deserves access to cutting-edge medical technology, 
                  regardless of their location or socioeconomic status. Our platform bridges 
                  the gap between advanced medical AI and everyday healthcare delivery.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 medical-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-medical-blue">
                  <Eye className="h-8 w-8 mr-3" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">
                <p className="mb-4">
                  A world where preventable blindness is eliminated through early detection 
                  and intervention, powered by accessible AI technology.
                </p>
                <p>
                  We envision a future where every person has access to comprehensive eye 
                  health screening, enabling the prevention of diseases like diabetic 
                  retinopathy, glaucoma, and age-related macular degeneration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 bg-medical-blue-lighter/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-medical-blue mb-6">Our Story</h2>
          </div>
          
          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-medical-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-medical-blue mb-2">Research Foundation</h3>
                <p className="text-sm text-muted-foreground">
                  Founded by leading ophthalmologists and AI researchers with decades 
                  of combined experience in retinal diseases.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-health-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-medical-blue mb-2">AI Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  Developed cutting-edge fusion models combining DeiT and ResNet18 
                  architectures for superior diagnostic accuracy.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-medical-blue mb-2">Patient Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Committed to improving patient outcomes through accessible, 
                  accurate, and timely retinal disease detection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-medical-blue mb-6">Advanced Technology</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform leverages state-of-the-art artificial intelligence and machine learning 
              to deliver clinical-grade retinal analysis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-0 medical-shadow">
              <CardContent className="p-6">
                <Brain className="h-12 w-12 text-medical-blue mx-auto mb-4" />
                <h4 className="font-semibold text-medical-blue mb-2">DeiT + ResNet18</h4>
                <p className="text-sm text-muted-foreground">
                  Fusion architecture combining transformer and convolutional neural networks
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 medical-shadow">
              <CardContent className="p-6">
                <Stethoscope className="h-12 w-12 text-health-green mx-auto mb-4" />
                <h4 className="font-semibold text-medical-blue mb-2">Voice Consultation</h4>
                <p className="text-sm text-muted-foreground">
                  Integrated voice AI for personalized consultation experiences
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 medical-shadow">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-accent-red mx-auto mb-4" />
                <h4 className="font-semibold text-medical-blue mb-2">HIPAA Compliant</h4>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade security and privacy protection
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 medical-shadow">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-warning mx-auto mb-4" />
                <h4 className="font-semibold text-medical-blue mb-2">Role-Based Access</h4>
                <p className="text-sm text-muted-foreground">
                  Tailored dashboards for doctors, patients, and administrators
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-medical-blue mb-6">Expert Team</h2>
            <p className="text-muted-foreground">
              Led by world-class ophthalmologists, AI researchers, and healthcare technology experts
            </p>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-8">
              Our multidisciplinary team combines clinical expertise with cutting-edge technology 
              to deliver solutions that truly make a difference in patient care.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h4 className="font-semibold text-medical-blue mb-2">Clinical Leadership</h4>
                <p className="text-sm text-muted-foreground">
                  Board-certified ophthalmologists and retinal specialists
                </p>
              </div>
              
              <div className="text-center">
                <h4 className="font-semibold text-medical-blue mb-2">AI Research</h4>
                <p className="text-sm text-muted-foreground">
                  PhD researchers in computer vision and machine learning
                </p>
              </div>
              
              <div className="text-center">
                <h4 className="font-semibold text-medical-blue mb-2">Healthcare Technology</h4>
                <p className="text-sm text-muted-foreground">
                  Software engineers with healthcare industry expertise
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 medical-gradient">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-medical-blue mb-6">
            Join Us in Revolutionizing Eye Care
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Experience the future of retinal healthcare with our AI-powered platform
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg" 
              className="bg-medical-blue hover:bg-medical-blue-light text-white"
              onClick={() => onNavigate(user ? (user.role || 'login') : 'signup')}
            >
              Get Started Today
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-health-green text-health-green hover:bg-health-green hover:text-white"
              onClick={() => onNavigate('features')}
            >
              Explore Features
            </Button>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}