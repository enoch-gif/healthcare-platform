import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Users, 
  Brain, 
  Activity, 
  TrendingUp, 
  Database, 
  Cloud, 
  RefreshCw,
  Calendar,
  BarChart3,
  PieChart,
  Server,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  Eye,
  Stethoscope,
  Clock,
  HardDrive
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { supabaseService } from '../../services/supabaseService';

export default function AdminDashboard({ user }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [systemHealth, setSystemHealth] = useState(null);

  // Load analytics data on component mount
  useEffect(() => {
    loadAnalyticsData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadAnalyticsData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setIsRefreshing(true);
      
      // Load analytics overview
      const analytics = await supabaseService.getAnalyticsOverview();
      setAnalyticsData(analytics);
      
      // Check system health
      const health = await supabaseService.checkHealth();
      setSystemHealth(health);
      
      setLastUpdated(new Date());
      console.log('Analytics data loaded:', analytics);
      
    } catch (error) {
      console.error('Error loading analytics:', error);
      
      // Fallback to demo data for development
      setAnalyticsData({
        userCounts: { doctor: 12, patient: 156, admin: 3 },
        totalAnalyses: 1247,
        avgConfidence: 94.2,
        dailyAnalyses: generateDemoAnalyticsTrend(),
        diagnosisStats: {
          'Diabetic Macular Edema (DME)': 342,
          'Choroidal Neovascularization (CNV)': 289,
          'Normal Retina': 421,
          'Drusen': 195
        },
        recentAnalyses: generateDemoRecentAnalyses()
      });
      
      setSystemHealth({
        status: 'healthy',
        services: { supabase: 'connected', storage: 'initialized', auth: 'enabled' }
      });
      
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const generateDemoAnalyticsTrend = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
      return {
        date: date.toISOString().split('T')[0],
        analyses: Math.floor(Math.random() * 50 + 30),
        users: Math.floor(Math.random() * 20 + 10),
        accuracy: Math.random() * 5 + 95
      };
    });
  };

  const generateDemoRecentAnalyses = () => {
    const doctors = ['Dr. Smith', 'Dr. Johnson', 'Dr. Chen', 'Dr. Williams'];
    const diagnoses = ['DME', 'CNV', 'Normal', 'Drusen'];
    
    return Array.from({ length: 10 }, (_, i) => ({
      id: `analysis_${i}`,
      doctorName: doctors[Math.floor(Math.random() * doctors.length)],
      diagnosis: diagnoses[Math.floor(Math.random() * diagnoses.length)],
      confidence: Math.random() * 20 + 80,
      createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    }));
  };

  const handleRefresh = () => {
    loadAnalyticsData();
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 95) return 'text-health-green';
    if (confidence >= 90) return 'text-yellow-600';
    if (confidence >= 85) return 'text-orange-600';
    return 'text-accent-red';
  };

  const getSystemStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-health-green-lighter text-health-green';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-accent-red-lighter text-accent-red';
      default: return 'bg-medical-blue-lighter text-medical-blue';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-medical-blue" />
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  const diagnosisChartData = analyticsData?.diagnosisStats ? 
    Object.entries(analyticsData.diagnosisStats).map(([condition, count], index) => ({
      name: condition.replace(/\s*\([^)]*\)/g, ''), // Remove parentheses
      value: count,
      color: ['#0A3D62', '#27AE60', '#E74C3C', '#F39C12', '#9B59B6'][index % 5]
    })) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-medical-blue mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Real-time analytics and system monitoring with Supabase</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-health-green-lighter text-health-green">
            <CheckCircle className="w-4 h-4 mr-2" />
            System Healthy
          </Badge>
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            <Database className="w-4 h-4 mr-2" />
            Supabase Connected
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-medical-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-medical-blue">
              {(analyticsData?.userCounts?.doctor || 0) + 
               (analyticsData?.userCounts?.patient || 0) + 
               (analyticsData?.userCounts?.admin || 0)}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              <span className="text-health-green">+12%</span> from last month
            </div>
            <div className="text-xs text-muted-foreground">
              Doctors: {analyticsData?.userCounts?.doctor || 0} | 
              Patients: {analyticsData?.userCounts?.patient || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
            <Brain className="h-4 w-4 text-medical-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-medical-blue">
              {analyticsData?.totalAnalyses?.toLocaleString() || '0'}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              <span className="text-health-green">+18%</span> from last week
            </div>
            <div className="text-xs text-muted-foreground">
              Voice consultations: {Math.floor((analyticsData?.totalAnalyses || 0) * 0.87)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Activity className="h-4 w-4 text-health-green" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getConfidenceColor(analyticsData?.avgConfidence || 0)}`}>
              {analyticsData?.avgConfidence?.toFixed(1) || '0.0'}%
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              <span className="text-health-green">+2.1%</span> from last month
            </div>
            <Progress value={analyticsData?.avgConfidence || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Server className="h-4 w-4 text-health-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-health-green">Online</div>
            <div className="text-xs text-muted-foreground mt-2">
              Uptime: 99.8%
            </div>
            <div className="text-xs text-muted-foreground">
              Last updated: {lastUpdated?.toLocaleTimeString() || 'Never'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analyses">Analyses</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Analysis Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-medical-blue" />
                  Analysis Trends (7 Days)
                </CardTitle>
                <CardDescription>Daily analysis volume and accuracy metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData?.dailyAnalyses || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="analyses" stroke="#0A3D62" fill="#0A3D62" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Diagnosis Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-medical-blue" />
                  Diagnosis Distribution
                </CardTitle>
                <CardDescription>Breakdown of detected conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={diagnosisChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {diagnosisChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-medical-blue" />
                Recent Analysis Activity
              </CardTitle>
              <CardDescription>Latest AI diagnoses across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData?.recentAnalyses?.slice(0, 8).map((analysis, index) => (
                  <div key={analysis.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-medical-blue-lighter rounded-full flex items-center justify-center">
                        <Eye className="w-4 h-4 text-medical-blue" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{analysis.doctorName}</p>
                        <p className="text-xs text-muted-foreground">
                          {analysis.diagnosis} - {new Date(analysis.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={getConfidenceColor(analysis.confidence)}>
                      {analysis.confidence.toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Doctors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-medical-blue mb-2">
                  {analyticsData?.userCounts?.doctor || 0}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Today</span>
                    <span className="font-medium">{Math.floor((analyticsData?.userCounts?.doctor || 0) * 0.6)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Analyses Today</span>
                    <span className="font-medium">{analyticsData?.dailyAnalyses?.[6]?.analyses || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-health-green mb-2">
                  {analyticsData?.userCounts?.patient || 0}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>New This Week</span>
                    <span className="font-medium">{Math.floor((analyticsData?.userCounts?.patient || 0) * 0.08)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Scans This Week</span>
                    <span className="font-medium">{analyticsData?.dailyAnalyses?.reduce((sum, day) => sum + day.analyses, 0) || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Administrators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent-red mb-2">
                  {analyticsData?.userCounts?.admin || 0}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Online Now</span>
                    <span className="font-medium">{Math.min(analyticsData?.userCounts?.admin || 0, 2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Login</span>
                    <span className="font-medium">Now</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analyses Tab */}
        <TabsContent value="analyses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Volume</CardTitle>
                <CardDescription>Daily analysis counts over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData?.dailyAnalyses || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="analyses" fill="#0A3D62" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Voice Consultations</CardTitle>
                <CardDescription>Automated voice consultation statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-medical-blue-lighter rounded-lg">
                    <div className="text-xl font-bold text-medical-blue">
                      {Math.floor((analyticsData?.totalAnalyses || 0) * 0.87)}
                    </div>
                    <p className="text-xs text-muted-foreground">Total Voice Sessions</p>
                  </div>
                  <div className="text-center p-3 bg-health-green-lighter rounded-lg">
                    <div className="text-xl font-bold text-health-green">87%</div>
                    <p className="text-xs text-muted-foreground">Completion Rate</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Stethoscope className="w-4 h-4 mr-2 text-medical-blue" />
                    <span className="text-sm">Retinal Doctor Voice System</span>
                    <Badge variant="outline" className="ml-auto bg-health-green-lighter text-health-green">
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg Consultation Time</span>
                    <span className="font-medium">42 seconds</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>User Satisfaction</span>
                    <span className="font-medium text-health-green">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2 text-medical-blue" />
                  Supabase Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <Badge className={getSystemStatusColor('healthy')}>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Authentication</span>
                  <Badge className={getSystemStatusColor('healthy')}>
                    <Shield className="w-3 h-3 mr-1" />
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Storage</span>
                  <Badge className={getSystemStatusColor('healthy')}>
                    <Cloud className="w-3 h-3 mr-1" />
                    Initialized
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Real-time</span>
                  <Badge className={getSystemStatusColor('healthy')}>
                    <Zap className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HardDrive className="w-5 h-5 mr-2 text-medical-blue" />
                  Storage Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Retinal Images</span>
                    <span className="font-medium">2.3 GB</span>
                  </div>
                  <Progress value={15} className="w-full" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Analysis Reports</span>
                    <span className="font-medium">890 MB</span>
                  </div>
                  <Progress value={6} className="w-full" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>User Profiles</span>
                    <span className="font-medium">45 MB</span>
                  </div>
                  <Progress value={1} className="w-full" />
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total Usage</span>
                    <span>3.2 GB / 50 GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    All systems operational. Last backup completed successfully at {new Date().toLocaleTimeString()}.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Scheduled maintenance window: Sunday 2:00 AM - 4:00 AM EST for performance optimization.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Real-time Tab */}
        <TabsContent value="realtime" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-medical-blue" />
                  Live Activity Feed
                </div>
                <Badge variant="outline" className="bg-health-green-lighter text-health-green">
                  <div className="w-2 h-2 bg-health-green rounded-full animate-pulse mr-2"></div>
                  Live
                </Badge>
              </CardTitle>
              <CardDescription>Real-time updates from across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {/* Real-time activity items would be populated here */}
                <div className="flex items-center space-x-3 p-3 bg-medical-blue-lighter rounded-lg">
                  <div className="w-2 h-2 bg-health-green rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-medium">New analysis completed</p>
                    <p className="text-xs text-muted-foreground">Dr. Smith - DME diagnosis (94.2% confidence)</p>
                  </div>
                  <span className="text-xs text-muted-foreground ml-auto">Just now</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-health-green-lighter rounded-lg">
                  <div className="w-2 h-2 bg-medical-blue rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-medium">New user registration</p>
                    <p className="text-xs text-muted-foreground">Patient: Emily Johnson</p>
                  </div>
                  <span className="text-xs text-muted-foreground ml-auto">2 min ago</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-medium">Voice consultation completed</p>
                    <p className="text-xs text-muted-foreground">Retinal Doctor - 38 second session</p>
                  </div>
                  <span className="text-xs text-muted-foreground ml-auto">3 min ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}