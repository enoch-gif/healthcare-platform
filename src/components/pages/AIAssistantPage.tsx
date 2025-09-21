import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import Footer from '../Footer';
import VisionChatBot from '../VisionChatBot';
import { 
  Eye, 
  Brain, 
  Sparkles,
  ArrowLeft,
  Bot,
  Stethoscope,
  MessageSquare,
  Zap
} from 'lucide-react';

export default function AIAssistantPage({ onNavigate, user }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50 medical-shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => onNavigate('landing')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bot className="h-8 w-8 text-medical-blue" />
                <Sparkles className="h-4 w-4 text-health-green absolute -top-1 -right-1" />
              </div>
              <span className="text-xl font-semibold text-medical-blue">AI Assistant</span>
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
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="relative">
                <Eye className="h-12 w-12 text-medical-blue" />
                <Brain className="h-6 w-6 text-health-green absolute -bottom-1 -right-1 bg-white rounded-full p-0.5" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-medical-blue">AI Vision Assistant</h1>
                <p className="text-lg text-muted-foreground">Powered by Gemini AI</p>
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Get instant answers about retinal health, upload images for analysis, and receive 
              personalized medical guidance from our advanced AI assistant.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 bg-white rounded-2xl medical-shadow">
              <Sparkles className="h-10 w-10 text-health-green mx-auto mb-3" />
              <h3 className="font-semibold text-medical-blue mb-2">Powered by Gemini AI</h3>
              <p className="text-sm text-muted-foreground">
                Advanced natural language processing for accurate medical responses
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-2xl medical-shadow">
              <Eye className="h-10 w-10 text-medical-blue mx-auto mb-3" />
              <h3 className="font-semibold text-medical-blue mb-2">Image Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Upload retinal images for instant AI-powered diagnostic analysis
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-2xl medical-shadow">
              <MessageSquare className="h-10 w-10 text-accent-red mx-auto mb-3" />
              <h3 className="font-semibold text-medical-blue mb-2">Expert Consultation</h3>
              <p className="text-sm text-muted-foreground">
                Ask questions about eye health and get evidence-based answers
              </p>
            </div>
          </div>

          {/* Main ChatBot Interface */}
          <div className="flex justify-center">
            <VisionChatBot />
          </div>

          {/* Usage Guidelines */}
          <div className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-medical-blue mb-6 text-center">
              How to Use the AI Assistant
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-medical-blue flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Text Consultation
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-health-green rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Ask questions about retinal conditions like diabetic retinopathy, AMD, or glaucoma
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-health-green rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Get information about symptoms, prevention, and treatment options
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-health-green rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Learn about eye health best practices and lifestyle recommendations
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-health-green rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Use the quick question buttons for common topics
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-medical-blue flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Image Analysis
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-medical-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Upload fundus photographs or OCT images for analysis
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-medical-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Receive detailed diagnostic results with confidence scores
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-medical-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Get personalized treatment recommendations
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-medical-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Access educational explanations of findings
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sample Questions */}
          <div className="mt-12 bg-white rounded-2xl p-8 medical-shadow">
            <h3 className="text-xl font-semibold text-medical-blue mb-6 text-center">
              Sample Questions You Can Ask
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "What are the early signs of diabetic retinopathy?",
                "How can I prevent age-related macular degeneration?",
                "What do drusen deposits mean for my eye health?",
                "When should I see an ophthalmologist?",
                "What causes choroidal neovascularization?",
                "How often should I get eye exams?",
                "What are the symptoms of glaucoma?",
                "How does diabetes affect the retina?",
                "What is optical coherence tomography?"
              ].map((question, index) => (
                <div key={index} className="p-3 bg-medical-blue-lighter rounded-lg text-sm text-medical-blue">
                  "{question}"
                </div>
              ))}
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <Stethoscope className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">Important Medical Disclaimer</h4>
                <p className="text-sm text-yellow-700 leading-relaxed">
                  This AI assistant provides educational information only and is not a substitute for 
                  professional medical diagnosis or treatment. Always consult with a qualified 
                  ophthalmologist or healthcare provider for medical advice, diagnosis, and treatment 
                  decisions. In case of emergency eye conditions, seek immediate medical attention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}