import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { 
  BookOpen, 
  Search, 
  Filter,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Eye,
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Download,
  Share,
  Bookmark,
  Star,
  Clock,
  User,
  Video,
  FileText,
  Headphones,
  HelpCircle,
  Award,
  Target,
  TrendingUp,
  Calendar,
  Lightbulb
} from 'lucide-react';

export default function HealthEducation({ userId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedContent, setSelectedContent] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  const [bookmarkedContent, setBookmarkedContent] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadUserProgress();
  }, [userId]);

  const loadUserProgress = () => {
    // Load user's completed modules and bookmarks
    const userProgress = JSON.parse(localStorage.getItem(`education_progress_${userId}`) || '[]');
    const userBookmarks = JSON.parse(localStorage.getItem(`education_bookmarks_${userId}`) || '[]');
    setCompletedModules(userProgress);
    setBookmarkedContent(userBookmarks);
  };

  const markAsCompleted = (contentId) => {
    const newCompleted = [...completedModules, contentId];
    setCompletedModules(newCompleted);
    localStorage.setItem(`education_progress_${userId}`, JSON.stringify(newCompleted));
  };

  const toggleBookmark = (contentId) => {
    const isBookmarked = bookmarkedContent.includes(contentId);
    const newBookmarks = isBookmarked 
      ? bookmarkedContent.filter(id => id !== contentId)
      : [...bookmarkedContent, contentId];
    
    setBookmarkedContent(newBookmarks);
    localStorage.setItem(`education_bookmarks_${userId}`, JSON.stringify(newBookmarks));
  };

  const educationContent = [
    {
      id: 1,
      title: "Understanding Diabetic Retinopathy",
      description: "Learn about diabetic retinopathy, its stages, symptoms, and treatment options",
      category: "diabetes",
      type: "article",
      duration: "8 min read",
      difficulty: "beginner",
      rating: 4.8,
      views: 12543,
      content: `
        <h3>What is Diabetic Retinopathy?</h3>
        <p>Diabetic retinopathy is a diabetes complication that affects the eyes. It's caused by damage to the blood vessels of the light-sensitive tissue at the back of the eye (retina).</p>
        
        <h3>Stages of Diabetic Retinopathy</h3>
        <ul>
          <li><strong>Mild nonproliferative retinopathy:</strong> Microaneurysms occur in the retinal blood vessels</li>
          <li><strong>Moderate nonproliferative retinopathy:</strong> Blood vessels that nourish the retina become blocked</li>
          <li><strong>Severe nonproliferative retinopathy:</strong> More blood vessels become blocked, depriving several areas of the retina</li>
          <li><strong>Proliferative diabetic retinopathy:</strong> New blood vessels grow in the retina</li>
        </ul>
        
        <h3>Prevention and Management</h3>
        <p>The best way to prevent diabetic retinopathy is to maintain good blood sugar control, regular eye exams, and healthy lifestyle choices.</p>
      `,
      quiz: [
        {
          question: "What causes diabetic retinopathy?",
          options: ["High blood pressure", "Damage to retinal blood vessels", "Age", "Genetics"],
          correct: 1
        },
        {
          question: "How often should diabetics have eye exams?",
          options: ["Every 5 years", "Every 2 years", "Annually", "Only when symptoms appear"],
          correct: 2
        }
      ]
    },
    {
      id: 2,
      title: "Age-Related Macular Degeneration (AMD) Guide",
      description: "Comprehensive guide to AMD, risk factors, and lifestyle modifications",
      category: "amd",
      type: "video",
      duration: "12 min",
      difficulty: "intermediate",
      rating: 4.9,
      views: 8765,
      videoUrl: "https://example.com/amd-guide.mp4",
      content: `
        <h3>Understanding AMD</h3>
        <p>Age-related macular degeneration (AMD) is an eye disease that can blur your central vision. It happens when aging causes damage to the macula.</p>
        
        <h3>Types of AMD</h3>
        <ul>
          <li><strong>Dry AMD:</strong> The more common form, develops slowly</li>
          <li><strong>Wet AMD:</strong> Less common but more serious, can cause rapid vision loss</li>
        </ul>
        
        <h3>Risk Factors</h3>
        <ul>
          <li>Age (over 50)</li>
          <li>Smoking</li>
          <li>Family history</li>
          <li>Race (more common in Caucasians)</li>
          <li>Obesity</li>
        </ul>
      `
    },
    {
      id: 3,
      title: "Glaucoma: The Silent Thief of Sight",
      description: "Learn about glaucoma symptoms, diagnosis, and treatment options",
      category: "glaucoma",
      type: "interactive",
      duration: "15 min",
      difficulty: "beginner",
      rating: 4.7,
      views: 15234,
      content: `
        <h3>What is Glaucoma?</h3>
        <p>Glaucoma is a group of eye conditions that damage the optic nerve, which is vital to good vision. This damage is often caused by abnormally high pressure in your eye.</p>
        
        <h3>Types of Glaucoma</h3>
        <ul>
          <li><strong>Open-angle glaucoma:</strong> The most common type, develops slowly</li>
          <li><strong>Angle-closure glaucoma:</strong> Can develop suddenly and is a medical emergency</li>
          <li><strong>Normal-tension glaucoma:</strong> Optic nerve damage despite normal eye pressure</li>
        </ul>
        
        <h3>Warning Signs</h3>
        <p>Glaucoma often has no early symptoms. Regular eye exams are crucial for early detection.</p>
      `
    },
    {
      id: 4,
      title: "Nutrition for Eye Health",
      description: "Discover foods and nutrients that support healthy vision",
      category: "nutrition",
      type: "article",
      duration: "6 min read",
      difficulty: "beginner",
      rating: 4.6,
      views: 9876,
      content: `
        <h3>Key Nutrients for Eye Health</h3>
        
        <h4>Lutein and Zeaxanthin</h4>
        <p>These antioxidants help protect against age-related macular degeneration and cataracts.</p>
        <p><strong>Sources:</strong> Leafy greens, eggs, corn, orange peppers</p>
        
        <h4>Omega-3 Fatty Acids</h4>
        <p>Essential for retinal health and may help prevent dry eyes.</p>
        <p><strong>Sources:</strong> Fatty fish, flaxseeds, chia seeds, walnuts</p>
        
        <h4>Vitamin C</h4>
        <p>Antioxidant that supports blood vessels in the eye.</p>
        <p><strong>Sources:</strong> Citrus fruits, berries, bell peppers</p>
        
        <h4>Vitamin E</h4>
        <p>Protects cells from damage caused by free radicals.</p>
        <p><strong>Sources:</strong> Nuts, seeds, vegetable oils</p>
        
        <h3>Sample Eye-Healthy Meal Plan</h3>
        <p>A balanced diet rich in these nutrients can significantly support your vision health.</p>
      `
    },
    {
      id: 5,
      title: "Post-Surgery Eye Care",
      description: "Essential care instructions after retinal surgery",
      category: "surgery",
      type: "checklist",
      duration: "10 min",
      difficulty: "intermediate",
      rating: 4.9,
      views: 5432,
      content: `
        <h3>Immediate Post-Surgery Care</h3>
        
        <h4>First 24 Hours</h4>
        <ul>
          <li>Keep the eye patch on as instructed</li>
          <li>Use prescribed eye drops as directed</li>
          <li>Avoid rubbing or touching the eye</li>
          <li>Rest and avoid strenuous activities</li>
        </ul>
        
        <h4>First Week</h4>
        <ul>
          <li>Attend all follow-up appointments</li>
          <li>Continue prescribed medications</li>
          <li>Protect the eye from bright lights</li>
          <li>Sleep with head elevated</li>
        </ul>
        
        <h4>Recovery Timeline</h4>
        <p>Most patients see improvement in vision over several weeks to months. Full recovery can take 3-6 months depending on the procedure.</p>
        
        <h4>When to Call Your Doctor</h4>
        <ul>
          <li>Sudden vision changes</li>
          <li>Severe pain</li>
          <li>Signs of infection</li>
          <li>Persistent nausea or vomiting</li>
        </ul>
      `
    }
  ];

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen },
    { id: 'diabetes', name: 'Diabetic Retinopathy', icon: Activity },
    { id: 'amd', name: 'Macular Degeneration', icon: Eye },
    { id: 'glaucoma', name: 'Glaucoma', icon: Target },
    { id: 'nutrition', name: 'Eye Nutrition', icon: Heart },
    { id: 'surgery', name: 'Surgery & Recovery', icon: AlertTriangle }
  ];

  const filteredContent = educationContent.filter(content => {
    const matchesSearch = !searchTerm || 
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || content.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'interactive': return <HelpCircle className="h-4 w-4" />;
      case 'checklist': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-[#E8F5E8] text-[#27AE60]';
      case 'intermediate': return 'bg-[#FFF8E1] text-[#F39C12]';
      case 'advanced': return 'bg-[#FADBD8] text-[#E74C3C]';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const calculateOverallProgress = () => {
    return Math.round((completedModules.length / educationContent.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0A3D62]">Health Education Center</h2>
          <p className="text-[#6C757D]">Learn about eye health, conditions, and treatment options</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-[#0A3D62]">Learning Progress</p>
            <div className="flex items-center space-x-2">
              <Progress value={calculateOverallProgress()} className="w-20 h-2" />
              <span className="text-sm text-[#6C757D]">{calculateOverallProgress()}%</span>
            </div>
          </div>
          <Badge className="bg-[#27AE60] text-white">
            <Award className="h-4 w-4 mr-1" />
            {completedModules.length} Completed
          </Badge>
        </div>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Modules Completed</p>
                <p className="text-2xl font-bold text-[#27AE60]">{completedModules.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-[#27AE60]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Bookmarked</p>
                <p className="text-2xl font-bold text-[#F39C12]">{bookmarkedContent.length}</p>
              </div>
              <Bookmark className="h-8 w-8 text-[#F39C12]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Learning Streak</p>
                <p className="text-2xl font-bold text-[#9B59B6]">7 days</p>
              </div>
              <TrendingUp className="h-8 w-8 text-[#9B59B6]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Knowledge Score</p>
                <p className="text-2xl font-bold text-[#0A3D62]">85%</p>
              </div>
              <Star className="h-8 w-8 text-[#0A3D62]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="library" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="library">Learning Library</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-6">
          {/* Search and Categories */}
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card className="medical-shadow border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-[#0A3D62]" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <div
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-[#E3F2FD] text-[#0A3D62]'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content List */}
            <div className="lg:col-span-3">
              <Card className="medical-shadow border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Learning Materials ({filteredContent.length})</CardTitle>
                  </div>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6C757D]" />
                    <Input
                      placeholder="Search health topics, conditions, or treatments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {filteredContent.map((content) => (
                      <Card key={content.id} className="border hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className={`p-2 rounded-lg ${
                                content.type === 'video' ? 'bg-[#FADBD8] text-[#E74C3C]' :
                                content.type === 'interactive' ? 'bg-[#F4E6FF] text-[#9B59B6]' :
                                'bg-[#E3F2FD] text-[#0A3D62]'
                              }`}>
                                {getTypeIcon(content.type)}
                              </div>
                              <Badge className={getDifficultyColor(content.difficulty)}>
                                {content.difficulty}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleBookmark(content.id);
                                }}
                                className={bookmarkedContent.includes(content.id) ? 'text-[#F39C12]' : 'text-[#6C757D]'}
                              >
                                <Bookmark className={`h-4 w-4 ${bookmarkedContent.includes(content.id) ? 'fill-current' : ''}`} />
                              </Button>
                              {completedModules.includes(content.id) && (
                                <CheckCircle className="h-4 w-4 text-[#27AE60]" />
                              )}
                            </div>
                          </div>
                          
                          <h3 className="font-semibold text-[#0A3D62] mb-2">{content.title}</h3>
                          <p className="text-sm text-[#6C757D] mb-3">{content.description}</p>
                          
                          <div className="flex items-center justify-between text-sm text-[#6C757D]">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{content.duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4" />
                                <span>{content.rating}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span>{content.views.toLocaleString()}</span>
                              </div>
                            </div>
                            <Button 
                              size="sm"
                              onClick={() => setSelectedContent(content)}
                              className="bg-[#0A3D62]"
                            >
                              {content.type === 'video' ? 'Watch' : 'Start'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredContent.length === 0 && (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-[#6C757D] mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-[#0A3D62] mb-2">No content found</h3>
                      <p className="text-[#6C757D]">Try adjusting your search or category filter</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card className="medical-shadow border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-[#0A3D62]" />
                Your Learning Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-[#0A3D62] mb-3">Overall Progress</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Completed Modules</span>
                        <span className="font-medium">{completedModules.length}/{educationContent.length}</span>
                      </div>
                      <Progress value={calculateOverallProgress()} className="h-3" />
                      <p className="text-sm text-[#6C757D]">
                        {calculateOverallProgress()}% of all available content completed
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-[#0A3D62] mb-3">Learning Streak</h4>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#27AE60]">7</div>
                        <div className="text-sm text-[#6C757D]">Days</div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#6C757D] mb-2">Keep it up! Consistent learning improves health outcomes.</p>
                        <div className="flex space-x-1">
                          {Array.from({length: 7}).map((_, i) => (
                            <div key={i} className="w-6 h-6 bg-[#27AE60] rounded-full"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-[#0A3D62] mb-3">Completed Modules</h4>
                  <div className="space-y-3">
                    {educationContent
                      .filter(content => completedModules.includes(content.id))
                      .map(content => (
                        <div key={content.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-[#27AE60]" />
                            <div>
                              <h5 className="font-medium text-[#0A3D62]">{content.title}</h5>
                              <p className="text-sm text-[#6C757D]">{content.duration}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => setSelectedContent(content)}>
                            Review
                          </Button>
                        </div>
                      ))}
                    {completedModules.length === 0 && (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-[#6C757D] mx-auto mb-3" />
                        <p className="text-[#6C757D]">No completed modules yet</p>
                        <p className="text-sm text-[#6C757D] mt-2">Start learning to track your progress here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookmarks" className="space-y-6">
          <Card className="medical-shadow border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bookmark className="h-5 w-5 mr-2 text-[#0A3D62]" />
                Saved Content ({bookmarkedContent.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {educationContent
                  .filter(content => bookmarkedContent.includes(content.id))
                  .map(content => (
                    <Card key={content.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge className={getDifficultyColor(content.difficulty)}>
                            {content.difficulty}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleBookmark(content.id)}
                            className="text-[#F39C12]"
                          >
                            <Bookmark className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                        
                        <h3 className="font-semibold text-[#0A3D62] mb-2">{content.title}</h3>
                        <p className="text-sm text-[#6C757D] mb-3">{content.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#6C757D]">{content.duration}</span>
                          <Button size="sm" onClick={() => setSelectedContent(content)}>
                            {completedModules.includes(content.id) ? 'Review' : 'Start'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              
              {bookmarkedContent.length === 0 && (
                <div className="text-center py-12">
                  <Bookmark className="h-12 w-12 text-[#6C757D] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#0A3D62] mb-2">No bookmarked content</h3>
                  <p className="text-[#6C757D]">Save interesting articles and videos to access them quickly</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card className="medical-shadow border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-[#0A3D62]" />
                Your Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {/* Achievement badges */}
                <div className="text-center p-4 border rounded-lg">
                  <Award className="h-12 w-12 text-[#F39C12] mx-auto mb-3" />
                  <h4 className="font-medium text-[#0A3D62]">First Steps</h4>
                  <p className="text-sm text-[#6C757D]">Completed your first learning module</p>
                  {completedModules.length > 0 ? (
                    <Badge className="mt-2 bg-[#E8F5E8] text-[#27AE60]">Earned</Badge>
                  ) : (
                    <Badge className="mt-2 bg-gray-100 text-gray-600">Locked</Badge>
                  )}
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <Star className="h-12 w-12 text-[#9B59B6] mx-auto mb-3" />
                  <h4 className="font-medium text-[#0A3D62]">Knowledge Seeker</h4>
                  <p className="text-sm text-[#6C757D]">Completed 5 learning modules</p>
                  {completedModules.length >= 5 ? (
                    <Badge className="mt-2 bg-[#E8F5E8] text-[#27AE60]">Earned</Badge>
                  ) : (
                    <Badge className="mt-2 bg-gray-100 text-gray-600">
                      {completedModules.length}/5
                    </Badge>
                  )}
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <Lightbulb className="h-12 w-12 text-[#27AE60] mx-auto mb-3" />
                  <h4 className="font-medium text-[#0A3D62]">Health Expert</h4>
                  <p className="text-sm text-[#6C757D]">Completed all available modules</p>
                  {completedModules.length === educationContent.length ? (
                    <Badge className="mt-2 bg-[#E8F5E8] text-[#27AE60]">Earned</Badge>
                  ) : (
                    <Badge className="mt-2 bg-gray-100 text-gray-600">
                      {completedModules.length}/{educationContent.length}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Content Detail Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    selectedContent.type === 'video' ? 'bg-[#FADBD8] text-[#E74C3C]' :
                    'bg-[#E3F2FD] text-[#0A3D62]'
                  }`}>
                    {getTypeIcon(selectedContent.type)}
                  </div>
                  <div>
                    <CardTitle>{selectedContent.title}</CardTitle>
                    <CardDescription>{selectedContent.duration}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleBookmark(selectedContent.id)}
                    className={bookmarkedContent.includes(selectedContent.id) ? 'text-[#F39C12]' : 'text-[#6C757D]'}
                  >
                    <Bookmark className={`h-4 w-4 ${bookmarkedContent.includes(selectedContent.id) ? 'fill-current' : ''}`} />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSelectedContent(null)}>
                    ✕
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
              {selectedContent.type === 'video' && (
                <div className="mb-6 bg-gray-900 rounded-lg p-8 text-center">
                  <Video className="h-16 w-16 text-white mx-auto mb-4" />
                  <p className="text-white">Video Player Placeholder</p>
                  <p className="text-gray-400 text-sm mt-2">
                    In a real application, this would contain the actual video player
                  </p>
                </div>
              )}
              
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: selectedContent.content }} />
              </div>
              
              {selectedContent.quiz && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-[#0A3D62] mb-3">Quick Quiz</h4>
                  <div className="space-y-4">
                    {selectedContent.quiz.map((question, index) => (
                      <div key={index} className="space-y-2">
                        <p className="font-medium">{question.question}</p>
                        <div className="space-y-1">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center space-x-2">
                              <input type="radio" name={`question-${index}`} className="text-[#0A3D62]" />
                              <label className="text-sm">{option}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            
            <div className="border-t p-4">
              <div className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Save PDF
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
                <Button 
                  onClick={() => {
                    if (!completedModules.includes(selectedContent.id)) {
                      markAsCompleted(selectedContent.id);
                    }
                    setSelectedContent(null);
                  }}
                  className="bg-[#27AE60]"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {completedModules.includes(selectedContent.id) ? 'Completed' : 'Mark Complete'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}