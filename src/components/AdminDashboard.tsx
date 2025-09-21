import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  FileText, 
  Settings, 
  Bell, 
  LogOut,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck,
  Brain,
  Database,
  Monitor,
  BarChart3,
  Shield,
  Zap,
  Eye,
  Heart,
  Stethoscope,
  Building2,
  Calendar,
  Mail
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import AIModelCenter from './admin/AIModelCenter';

export default function AdminDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('overview');

  // Mock data for analytics
  const systemMetrics = {
    totalUsers: 2456,
    totalDoctors: 87,
    totalScans: 15742,
    systemUptime: 99.7,
    activeUsers: 234,
    pendingApprovals: 12
  };

  const usageData = [
    { month: 'Jan', users: 1200, scans: 8500, doctors: 65 },
    { month: 'Feb', users: 1450, scans: 9200, doctors: 68 },
    { month: 'Mar', users: 1680, scans: 10100, doctors: 72 },
    { month: 'Apr', users: 1890, scans: 11300, doctors: 76 },
    { month: 'May', users: 2100, scans: 12800, doctors: 81 },
    { month: 'Jun', users: 2456, scans: 15742, doctors: 87 }
  ];

  const scanDistribution = [
    { name: 'CNV', value: 3248, color: '#E74C3C' },
    { name: 'DME', value: 2856, color: '#F39C12' },
    { name: 'Drusen', value: 4102, color: '#9B59B6' },
    { name: 'Normal', value: 5536, color: '#27AE60' }
  ];

  const aiPerformanceData = [
    { model: 'CNV Detection', accuracy: 97.8, sensitivity: 96.2, specificity: 98.4 },
    { model: 'DME Detection', accuracy: 96.2, sensitivity: 94.8, specificity: 97.1 },
    { model: 'Drusen Detection', accuracy: 94.5, sensitivity: 92.1, specificity: 95.8 },
    { model: 'Normal Classification', accuracy: 99.1, sensitivity: 98.7, specificity: 99.3 }
  ];

  const currentPath = location.pathname.split('/').pop() || 'overview';

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { id: 'ai-models', label: 'AI Models', icon: Brain, path: '/admin/ai-models' },
    { id: 'users', label: 'User Management', icon: Users, path: '/admin/users' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { id: 'system', label: 'System Health', icon: Monitor, path: '/admin/system' },
    { id: 'security', label: 'Security & Compliance', icon: Shield, path: '/admin/security' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' }
  ];

  const handleNavigation = (path, id) => {
    navigate(path);
    setActiveSection(id);
  };

  const renderSidebar = () => (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-medical-blue rounded-lg flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-medical-blue">Retinal-AI Admin</h2>
            <p className="text-xs text-muted-foreground">System Management</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-medical-blue text-white">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'AD'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium text-medical-blue">{user?.name || 'System Administrator'}</p>
            <p className="text-xs text-muted-foreground">{user?.email || 'admin@retinal-ai.com'}</p>
            <Badge variant="outline" className="text-xs mt-1">Administrator</Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.id || (item.id === 'overview' && currentPath === '');
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path, item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive 
                    ? 'bg-medical-blue text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-600 hover:text-red-600"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-medical-blue">System Overview</h1>
          <p className="text-muted-foreground">Complete platform analytics and performance monitoring</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Alerts ({systemMetrics.pendingApprovals})
          </Button>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            System Healthy
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-medical-blue">{systemMetrics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medical Professionals</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-health-green">{systemMetrics.totalDoctors}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-red">{systemMetrics.totalScans.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+23% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-medical-blue">{systemMetrics.systemUptime}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
            <CardDescription>User registration and scan volume trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#0A3D62" strokeWidth={2} name="Users" />
                  <Line type="monotone" dataKey="scans" stroke="#27AE60" strokeWidth={2} name="Scans" />
                  <Line type="monotone" dataKey="doctors" stroke="#E74C3C" strokeWidth={2} name="Doctors" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Scan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Diagnosis Distribution</CardTitle>
            <CardDescription>Breakdown of retinal conditions detected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scanDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {scanDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-medical-blue" />
            AI Model Performance Overview
          </CardTitle>
          <CardDescription>Real-time accuracy metrics for all diagnostic models</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiPerformanceData.map((model, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-white">
                <h4 className="font-medium text-medical-blue mb-3">{model.model}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy</span>
                    <span className="font-medium">{model.accuracy}%</span>
                  </div>
                  <Progress value={model.accuracy} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Sensitivity: {model.sensitivity}%</span>
                    <span>Specificity: {model.specificity}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Recent notifications and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">AI Model Training Complete</p>
                  <p className="text-xs text-muted-foreground">Fusion model achieved 98.2% accuracy</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">High Server Load Detected</p>
                  <p className="text-xs text-muted-foreground">CPU usage at 87% for 10 minutes</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Database Backup Completed</p>
                  <p className="text-xs text-muted-foreground">All user data safely backed up</p>
                  <p className="text-xs text-muted-foreground">6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card>
          <CardHeader>
            <CardTitle>Real-time Activity</CardTitle>
            <CardDescription>Current platform usage statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Users</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {systemMetrics.activeUsers} online
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Scans in Progress</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  23 processing
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Approvals</span>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                  {systemMetrics.pendingApprovals} waiting
                </Badge>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Server Capacity</span>
                  <span>67%</span>
                </div>
                <Progress value={67} />
                
                <div className="flex justify-between text-sm">
                  <span>Database Usage</span>
                  <span>43%</span>
                </div>
                <Progress value={43} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {renderSidebar()}
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Routes>
            <Route index element={renderOverview()} />
            <Route path="/" element={renderOverview()} />
            <Route path="/ai-models" element={<AIModelCenter />} />
            <Route path="/users" element={
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">User Management</h3>
                <p className="text-muted-foreground">Comprehensive user management interface coming soon</p>
              </div>
            } />
            <Route path="/analytics" element={
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground">Detailed analytics dashboard coming soon</p>
              </div>
            } />
            <Route path="/system" element={
              <div className="text-center py-12">
                <Monitor className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">System Health</h3>
                <p className="text-muted-foreground">System monitoring and health checks coming soon</p>
              </div>
            } />
            <Route path="/security" element={
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Security & Compliance</h3>
                <p className="text-muted-foreground">Security management interface coming soon</p>
              </div>
            } />
            <Route path="/settings" element={
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">System Settings</h3>
                <p className="text-muted-foreground">Configuration management interface coming soon</p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
}