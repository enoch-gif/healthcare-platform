import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import VisionChatBot from './VisionChatBot';
import { 
  Eye, 
  Brain, 
  Shield, 
  Users, 
  Camera, 
  Upload, 
  BarChart3,
  Phone,
  Mail,
  MapPin,
  Send,
  BookOpen,
  FileText,
  Video,
  Download
} from 'lucide-react';

const About = () => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Eye className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-semibold">Retinal-AI</span>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link to="/features" className="text-gray-600 hover:text-blue-600">Features</Link>
          <Link to="/education" className="text-gray-600 hover:text-blue-600">Education</Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
          <Link to="/chatbot" className="text-gray-600 hover:text-blue-600">ChatBot</Link>
        </nav>
      </div>
    </header>

    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">About Retinal-AI</h1>
      
      <div className="prose prose-lg mx-auto space-y-8">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Retinal-AI is dedicated to revolutionizing early detection and prevention of retinal diseases 
              through cutting-edge artificial intelligence technology. We believe that everyone deserves 
              access to advanced diagnostic tools that can help preserve vision and improve quality of life.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Our Technology</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our platform leverages GPT-4.1 Vision technology and advanced deep learning algorithms 
              to analyze retinal images with 95%+ accuracy. We specialize in detecting:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Diabetic Retinopathy</li>
              <li>Choroidal Neovascularization (CNV)</li>
              <li>Diabetic Macular Edema (DME)</li>
              <li>Drusen deposits</li>
              <li>Glaucoma indicators</li>
              <li>Age-related Macular Degeneration</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Our Team</h2>
            <p className="text-gray-600 leading-relaxed">
              We are a team of ophthalmologists, AI researchers, and healthcare technology experts 
              committed to making advanced retinal diagnostics accessible to healthcare providers 
              and patients worldwide. Our interdisciplinary approach ensures that our technology 
              meets the highest standards of medical accuracy and usability.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Accuracy</h3>
                <p className="text-gray-600 text-sm">
                  We maintain the highest standards of diagnostic precision through continuous 
                  AI model improvement and validation.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Accessibility</h3>
                <p className="text-gray-600 text-sm">
                  Making advanced retinal screening available to healthcare providers regardless 
                  of location or resources.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Privacy</h3>
                <p className="text-gray-600 text-sm">
                  Protecting patient data with enterprise-grade security and HIPAA compliance.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600 text-sm">
                  Continuously advancing AI technology to improve diagnostic capabilities 
                  and patient outcomes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

const Features = () => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Eye className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-semibold">Retinal-AI</span>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
          <Link to="/education" className="text-gray-600 hover:text-blue-600">Education</Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
          <Link to="/chatbot" className="text-gray-600 hover:text-blue-600">ChatBot</Link>
        </nav>
      </div>
    </header>

    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Platform Features</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Camera className="h-12 w-12 text-blue-600 mb-4" />
            <CardTitle>Real-Time Camera Capture</CardTitle>
            <CardDescription>
              Instant retinal image capture with optimized camera controls for mobile devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Touch-friendly camera interface</li>
              <li>• Automatic image optimization</li>
              <li>• Cross-platform compatibility</li>
              <li>• High-resolution capture</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Brain className="h-12 w-12 text-green-600 mb-4" />
            <CardTitle>GPT-4.1 Vision Analysis</CardTitle>
            <CardDescription>
              Advanced AI analysis for CNV, DME, Drusen, and normal retinal conditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 95%+ diagnostic accuracy</li>
              <li>• Confidence scoring</li>
              <li>• Multiple condition detection</li>
              <li>• Real-time processing</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Upload className="h-12 w-12 text-purple-600 mb-4" />
            <CardTitle>Easy Image Upload</CardTitle>
            <CardDescription>
              Drag-and-drop interface with preview and high-quality processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Multiple file format support</li>
              <li>• Batch processing capability</li>
              <li>• Image preview and editing</li>
              <li>• Cloud storage integration</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <BarChart3 className="h-12 w-12 text-orange-600 mb-4" />
            <CardTitle>Detailed Reports</CardTitle>
            <CardDescription>
              Comprehensive analysis reports with confidence scores and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• PDF report generation</li>
              <li>• Historical trend analysis</li>
              <li>• Clinical recommendations</li>
              <li>• Shareable results</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Shield className="h-12 w-12 text-red-600 mb-4" />
            <CardTitle>Medical-Grade Security</CardTitle>
            <CardDescription>
              HIPAA-compliant data handling with appropriate medical disclaimers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• End-to-end encryption</li>
              <li>• HIPAA compliance</li>
              <li>• Secure data transmission</li>
              <li>• Privacy controls</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Users className="h-12 w-12 text-indigo-600 mb-4" />
            <CardTitle>Patient Management</CardTitle>
            <CardDescription>
              Comprehensive patient tracking and history management for healthcare providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Patient database management</li>
              <li>• Appointment scheduling</li>
              <li>• Progress tracking</li>
              <li>• Clinical workflow integration</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

const Education = () => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Eye className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-semibold">Retinal-AI</span>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
          <Link to="/features" className="text-gray-600 hover:text-blue-600">Features</Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
          <Link to="/chatbot" className="text-gray-600 hover:text-blue-600">ChatBot</Link>
        </nav>
      </div>
    </header>

    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Eye Health Education</h1>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span>Understanding Retinal Diseases</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Diabetic Retinopathy</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                A diabetes complication that affects the eyes. It's caused by damage to the blood vessels 
                of the light-sensitive tissue at the back of the eye (retina). Early detection and treatment 
                can prevent vision loss.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Age-Related Macular Degeneration (AMD)</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                A disease that blurs the sharp, central vision needed for activities like reading and driving. 
                It affects the part of the eye that allows you to see fine detail (macula).
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Glaucoma</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                A group of eye diseases that can cause vision loss and blindness by damaging the optic nerve. 
                Often called the "silent thief of sight" because it usually has no early symptoms.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Drusen</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Yellow deposits under the retina that may be an early sign of macular degeneration. 
                Regular monitoring is important for early intervention.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-green-600" />
              <span>Prevention and Care Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Regular Eye Exams</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Annual comprehensive eye exams</li>
                  <li>• Early detection saves vision</li>
                  <li>• Age-appropriate screening schedules</li>
                  <li>• Family history considerations</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Diabetes Management</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Control blood sugar levels</li>
                  <li>• Maintain healthy blood pressure</li>
                  <li>• Regular HbA1c monitoring</li>
                  <li>• Medication compliance</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Lifestyle Factors</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Quit smoking</li>
                  <li>• Maintain healthy weight</li>
                  <li>• Regular exercise</li>
                  <li>• Balanced nutrition</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">UV Protection</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Wear UV-blocking sunglasses</li>
                  <li>• Use wide-brimmed hats</li>
                  <li>• Avoid peak sun hours</li>
                  <li>• Regular UV exposure assessment</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Video className="h-6 w-6 text-purple-600" />
              <span>Educational Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                <Download className="h-6 w-6 mb-2" />
                <span className="font-medium">Retinal Health Guide</span>
                <span className="text-xs text-gray-600">PDF Download</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                <Video className="h-6 w-6 mb-2" />
                <span className="font-medium">Educational Videos</span>
                <span className="text-xs text-gray-600">Video Library</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                <FileText className="h-6 w-6 mb-2" />
                <span className="font-medium">Research Papers</span>
                <span className="text-xs text-gray-600">Scientific Literature</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

const Contact = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your message! We will get back to you soon.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Eye className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-semibold">Retinal-AI</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
            <Link to="/features" className="text-gray-600 hover:text-blue-600">Features</Link>
            <Link to="/education" className="text-gray-600 hover:text-blue-600">Education</Link>
            <Link to="/chatbot" className="text-gray-600 hover:text-blue-600">ChatBot</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>
        
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium">Phone Support</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-500">Monday - Friday, 9 AM - 6 PM EST</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium">Email Support</h3>
                  <p className="text-gray-600">support@retinal-ai.com</p>
                  <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium">Office Address</h3>
                  <p className="text-gray-600">
                    123 Healthcare Technology Blvd<br />
                    Medical District, CA 90210<br />
                    United States
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Have questions about our platform? We'd love to hear from you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Chatbot = () => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Eye className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-semibold">Retinal-AI</span>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
          <Link to="/features" className="text-gray-600 hover:text-blue-600">Features</Link>
          <Link to="/education" className="text-gray-600 hover:text-blue-600">Education</Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
        </nav>
      </div>
    </header>

    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-8">AI Vision Assistant</h1>
      <p className="text-xl text-gray-600 text-center mb-12">
        Upload retinal images for AI analysis or ask questions about eye health
      </p>
      
      <div className="flex justify-center">
        <VisionChatBot />
      </div>
    </div>
  </div>
);

const CommonPages = {
  About,
  Features,
  Education,
  Contact,
  Chatbot
};

export default CommonPages;