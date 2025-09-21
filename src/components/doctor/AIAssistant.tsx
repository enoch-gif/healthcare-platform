import React, { useState, useEffect, useRef } from 'react';
import { dataStore } from '../../services/dataStore';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';
import { 
  Brain, 
  Send, 
  Mic,
  Search,
  BookOpen,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Lightbulb,
  Target,
  Zap,
  Database,
  Activity,
  Stethoscope,
  Eye,
  Heart,
  User,
  Calendar,
  BarChart3,
  Settings,
  Download,
  Share,
  History,
  Star
} from 'lucide-react';

export default function AIAssistant({ doctorId }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedTool, setSelectedTool] = useState('general');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversationHistory();
  }, [doctorId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversationHistory = () => {
    const history = dataStore.getAIConversationHistory(doctorId);
    if (history.length === 0) {
      // Initialize with welcome message
      const welcomeMessage = {
        id: 'welcome',
        type: 'assistant',
        content: `Hello Dr. ${dataStore.getUserById(doctorId)?.name?.split(' ')[1] || 'Doctor'}! I'm your AI clinical assistant. I can help you with:

• Clinical decision support and diagnosis recommendations
• Literature search and evidence-based medicine
• Patient case analysis and treatment planning  
• Medical calculations and drug interactions
• Administrative tasks and documentation
• Continuing education and latest medical updates

How can I assist you today?`,
        timestamp: new Date().toISOString(),
        tools: ['general']
      };
      setMessages([welcomeMessage]);
    } else {
      setMessages(history);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      tool: selectedTool
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI processing and response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.content, selectedTool);
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.content,
        timestamp: new Date().toISOString(),
        confidence: aiResponse.confidence,
        sources: aiResponse.sources,
        actions: aiResponse.actions
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Save to conversation history
      dataStore.saveAIConversation(doctorId, [userMessage, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const generateAIResponse = (query, tool) => {
    const responses = {
      general: {
        content: `Based on your query, I can provide the following clinical insights:

**Clinical Recommendation:**
• Consider differential diagnosis including retinal vascular occlusion, diabetic retinopathy, and hypertensive retinopathy
• Recommend immediate ophthalmologic evaluation if acute vision changes present
• Review patient's cardiovascular risk factors and glycemic control

**Next Steps:**
• Order fluorescein angiography for detailed vascular assessment
• Monitor blood pressure and diabetes management
• Consider anti-VEGF therapy if neovascularization present

**Evidence Base:**
• AAO Preferred Practice Pattern for Retinal Vascular Disease (2019)
• Recent studies show 85% efficacy rate for anti-VEGF in similar cases

Would you like me to elaborate on any specific aspect or provide additional treatment protocols?`,
        confidence: 92,
        sources: ['American Academy of Ophthalmology', 'Retina Journal 2023', 'Cochrane Reviews'],
        actions: ['Schedule follow-up', 'Order tests', 'Patient education']
      },
      diagnosis: {
        content: `**Diagnostic Analysis:**

Based on the clinical presentation, here's my differential diagnosis ranking:

**Primary Diagnosis (85% likelihood):**
• Diabetic Retinopathy - Non-proliferative, moderate stage
• Supporting evidence: Patient history of T2DM, characteristic microaneurysms and dot hemorrhages

**Secondary Considerations:**
• Hypertensive Retinopathy (15% likelihood)
• Branch Retinal Vein Occlusion (10% likelihood)

**Recommended Diagnostic Workup:**
• HbA1c and fasting glucose levels
• Blood pressure monitoring
• OCT macula for macular edema assessment
• Wide-field fundus photography

**Risk Stratification:**
• Moderate risk for progression to proliferative stage
• 25% chance of developing macular edema within 2 years

Would you like specific treatment protocols or referral guidelines?`,
        confidence: 88,
        sources: ['ETDRS Classification', 'ADA Guidelines 2024', 'Retina Specialist Consensus'],
        actions: ['Generate referral letter', 'Patient counseling sheet', 'Follow-up scheduling']
      },
      treatment: {
        content: `**Treatment Protocol Recommendations:**

**Immediate Management:**
• Anti-VEGF intravitreal injection (Aflibercept 2mg)
• Expected visual improvement: 70-80% of patients gain ≥2 lines
• Treatment frequency: Monthly x 3, then q8-12 weeks based on response

**Systemic Management:**
• Optimize glycemic control (target HbA1c <7%)
• Blood pressure control (target <140/90 mmHg)
• Lipid management if indicated

**Monitoring Schedule:**
• Week 1: Safety assessment
• Month 1: First follow-up injection
• Month 3: Response evaluation with OCT
• Quarterly thereafter

**Patient Education Points:**
• Importance of diabetes control
• Signs/symptoms requiring urgent consultation
• Realistic expectations for visual improvement

**Expected Outcomes:**
• 85% chance of vision stabilization
• 65% chance of visual improvement
• Low risk of serious complications (<2%)

Need help with injection protocols or patient consent forms?`,
        confidence: 94,
        sources: ['DRCR.net Protocol T', 'NICE Guidelines', 'Retina Society Recommendations'],
        actions: ['Treatment plan template', 'Patient consent form', 'Insurance authorization']
      },
      research: {
        content: `**Latest Research Findings:**

**Recent Clinical Trials (2024):**
• PANORAMA Study: Extended-interval anti-VEGF shows non-inferiority
• KESTREL Trial: Port delivery system reduces injection burden by 75%
• Meta-analysis of 15 RCTs confirms long-term safety profile

**Emerging Therapies:**
• Biosimilar anti-VEGF agents showing equivalent efficacy
• Combination therapy with steroids in selected cases
• Gene therapy trials showing promising early results

**Clinical Practice Updates:**
• New AI-assisted OCT analysis improves detection accuracy by 15%
• Telemedicine screening programs expanding access in rural areas
• Cost-effectiveness studies favor treat-and-extend protocols

**Key Statistics:**
• Global diabetic retinopathy prevalence: 35.4% in diabetic patients
• Economic burden: $493 million annually in US
• Vision loss prevention rate: 90% with early detection and treatment

**Practice-Changing Insights:**
• Earlier intervention prevents more advanced disease
• Patient-reported outcomes equally important as visual acuity
• Multidisciplinary care improves long-term outcomes

Would you like detailed summaries of any specific studies or clinical protocols?`,
        confidence: 96,
        sources: ['PubMed Latest', 'Clinical Trials Registry', 'Cochrane Database'],
        actions: ['Save references', 'Export citations', 'Set research alerts']
      }
    };

    return responses[tool] || responses.general;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const quickActions = [
    {
      title: 'Clinical Calculator',
      description: 'Drug dosing, GFR, risk scores',
      icon: Target,
      action: () => setInputMessage('Calculate appropriate anti-VEGF dosing for elderly patient with renal impairment')
    },
    {
      title: 'Literature Search',
      description: 'Latest research and guidelines',
      icon: BookOpen,
      action: () => setInputMessage('Find recent studies on diabetic retinopathy treatment outcomes')
    },
    {
      title: 'Differential Diagnosis',
      description: 'Symptom-based analysis',
      icon: Brain,
      action: () => setInputMessage('Help me with differential diagnosis for acute vision loss in diabetic patient')
    },
    {
      title: 'Patient Education',
      description: 'Generate educational materials',
      icon: User,
      action: () => setInputMessage('Create patient education sheet for diabetic retinopathy management')
    }
  ];

  const aiTools = [
    { id: 'general', name: 'General Assistant', icon: Brain },
    { id: 'diagnosis', name: 'Diagnostic Support', icon: Stethoscope },
    { id: 'treatment', name: 'Treatment Planning', icon: Heart },
    { id: 'research', name: 'Literature Review', icon: BookOpen },
    { id: 'admin', name: 'Administrative', icon: FileText }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0A3D62]">AI Clinical Assistant</h2>
          <p className="text-[#6C757D]">Advanced AI-powered clinical decision support system</p>
        </div>
        <Badge className="bg-[#27AE60] text-white">
          <Brain className="h-4 w-4 mr-1" />
          AI-Powered
        </Badge>
      </div>

      {/* AI Capabilities Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Accuracy Rate</p>
                <p className="text-2xl font-bold text-[#27AE60]">96.2%</p>
              </div>
              <Target className="h-8 w-8 text-[#27AE60]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Knowledge Base</p>
                <p className="text-2xl font-bold text-[#0A3D62]">50K+</p>
              </div>
              <Database className="h-8 w-8 text-[#0A3D62]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Response Time</p>
                <p className="text-2xl font-bold text-[#9B59B6]">1.2s</p>
              </div>
              <Zap className="h-8 w-8 text-[#9B59B6]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Citations</p>
                <p className="text-2xl font-bold text-[#F39C12]">15K+</p>
              </div>
              <BookOpen className="h-8 w-8 text-[#F39C12]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="tools">Clinical Tools</TabsTrigger>
          <TabsTrigger value="insights">Medical Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* AI Tools Selector */}
            <div className="lg:col-span-1">
              <Card className="medical-shadow border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-[#0A3D62]" />
                    AI Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {aiTools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <div
                          key={tool.id}
                          onClick={() => setSelectedTool(tool.id)}
                          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedTool === tool.id
                              ? 'bg-[#E3F2FD] text-[#0A3D62]'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{tool.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <Card className="medical-shadow border-0 h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-[#0A3D62]" />
                    AI Clinical Assistant
                    <Badge className="ml-2 bg-[#E8F5E8] text-[#27AE60]">
                      {aiTools.find(t => t.id === selectedTool)?.name}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Advanced clinical decision support powered by medical AI
                  </CardDescription>
                </CardHeader>
                
                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                          <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className={message.type === 'user' ? 'bg-[#0A3D62] text-white' : 'bg-[#27AE60] text-white'}>
                                {message.type === 'user' ? 'DR' : 'AI'}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`rounded-lg p-4 ${
                              message.type === 'user' 
                                ? 'bg-[#0A3D62] text-white' 
                                : 'bg-gray-50 text-[#0A3D62]'
                            }`}>
                              <div className="whitespace-pre-wrap text-sm">
                                {message.content}
                              </div>
                              
                              {message.confidence && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <div className="flex items-center justify-between text-xs mb-2">
                                    <span>Confidence Level</span>
                                    <span>{message.confidence}%</span>
                                  </div>
                                  <Progress value={message.confidence} className="h-1" />
                                </div>
                              )}
                              
                              {message.sources && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <p className="text-xs font-medium mb-1">Sources:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {message.sources.map((source, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {source}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {message.actions && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <p className="text-xs font-medium mb-2">Quick Actions:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {message.actions.map((action, index) => (
                                      <Button 
                                        key={index} 
                                        size="sm" 
                                        variant="outline"
                                        className="text-xs h-6"
                                      >
                                        {action}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <p className={`text-xs mt-2 ${
                                message.type === 'user' ? 'text-blue-200' : 'text-[#6C757D]'
                              }`}>
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-[#27AE60] text-white">
                              AI
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-[#27AE60] rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-[#27AE60] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-[#27AE60] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                              </div>
                              <span className="text-sm text-[#6C757D]">AI is analyzing...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>
                
                {/* Input Area */}
                <div className="p-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Mic className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <Textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask me about clinical decisions, diagnoses, treatments, or research..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        rows={2}
                      />
                    </div>
                    <Button 
                      onClick={sendMessage} 
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-[#27AE60] hover:bg-[#229954]"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="medical-shadow border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-[#0A3D62]" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center p-4"
                      onClick={action.action}
                    >
                      <Icon className="h-6 w-6 mb-2 text-[#0A3D62]" />
                      <span className="font-medium text-sm text-center">{action.title}</span>
                      <span className="text-xs text-[#6C757D] text-center">{action.description}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Drug Interaction Checker', description: 'Check for medication conflicts', icon: AlertTriangle, color: 'text-[#F39C12]' },
              { title: 'Clinical Calculator', description: 'Medical calculations and scores', icon: Target, color: 'text-[#0A3D62]' },
              { title: 'Diagnostic Assistant', description: 'Differential diagnosis support', icon: Stethoscope, color: 'text-[#27AE60]' },
              { title: 'Treatment Protocols', description: 'Evidence-based guidelines', icon: FileText, color: 'text-[#9B59B6]' },
              { title: 'Risk Assessment', description: 'Patient risk stratification', icon: BarChart3, color: 'text-[#E74C3C]' },
              { title: 'Literature Search', description: 'Medical research database', icon: BookOpen, color: 'text-[#17A2B8]' }
            ].map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card key={index} className="medical-shadow border-0 hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <Icon className={`h-8 w-8 ${tool.color}`} />
                      <div>
                        <h3 className="font-semibold text-[#0A3D62]">{tool.title}</h3>
                        <p className="text-sm text-[#6C757D]">{tool.description}</p>
                      </div>
                    </div>
                    <Button className="w-full bg-[#0A3D62] hover:bg-[#1E5F8B]">
                      Launch Tool
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Medical Insights */}
            <Card className="medical-shadow border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-[#0A3D62]" />
                  Clinical Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: 'Diabetic Retinopathy Trends',
                    insight: 'Early detection rates increased 23% with AI-assisted screening',
                    impact: 'High Impact',
                    color: 'text-[#27AE60]'
                  },
                  {
                    title: 'Treatment Outcomes',
                    insight: 'Anti-VEGF therapy shows 85% efficacy in your patient population',
                    impact: 'Medium Impact',
                    color: 'text-[#F39C12]'
                  },
                  {
                    title: 'Risk Factors',
                    insight: 'Hypertension control significantly affects treatment success',
                    impact: 'High Impact',
                    color: 'text-[#27AE60]'
                  }
                ].map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-[#0A3D62]">{insight.title}</h4>
                      <Badge className={`${insight.color} bg-gray-100`}>
                        {insight.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#6C757D]">{insight.insight}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Research */}
            <Card className="medical-shadow border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-[#0A3D62]" />
                  Latest Research
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: 'AI-Enhanced OCT Analysis',
                    journal: 'Nature Medicine',
                    date: '2024-01-15',
                    relevance: '95%'
                  },
                  {
                    title: 'Extended Anti-VEGF Intervals',
                    journal: 'Retina Journal',
                    date: '2024-01-10',
                    relevance: '88%'
                  },
                  {
                    title: 'Telemedicine in Ophthalmology',
                    journal: 'JAMA Ophthalmology',
                    date: '2024-01-05',
                    relevance: '76%'
                  }
                ].map((paper, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-[#0A3D62]">{paper.title}</h4>
                      <Badge className="bg-[#E3F2FD] text-[#0A3D62]">
                        {paper.relevance} match
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-[#6C757D]">
                      <span>{paper.journal}</span>
                      <span>{new Date(paper.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Read
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline">
                        <Star className="h-3 w-3 mr-1" />
                        Favorite
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}