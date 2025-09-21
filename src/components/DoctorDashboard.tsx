import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Mail, 
  Brain, 
  LogOut,
  Bell,
  Search,
  Settings,
  Activity,
  TrendingUp,
  Eye,
  Stethoscope,
  ClipboardList,
  Microscope,
  Camera,
  BarChart3,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Phone,
  Video
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AnalysisCenter from './doctor/AnalysisCenter';
import PatientChat from './doctor/PatientChat';
import AppointmentManagement from './doctor/AppointmentManagement';
import MedicalReports from './doctor/MedicalReports';
import EmailCenter from './doctor/EmailCenter';
import AIAssistant from './doctor/AIAssistant';
import FundusAnalysis from './doctor/FundusAnalysis';
import { dataStore } from '../services/dataStore';

export default function DoctorDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    todayAppointments: 8,
    pendingReports: 12,
    unreadMessages: 5,
    totalPatients: 156,
    weeklyAnalyses: 23
  });

  // Mock data for charts
  const weeklyActivityData = [
    { day: 'Mon', appointments: 8, analyses: 5, reports: 3 },
    { day: 'Tue', appointments: 12, analyses: 8, reports: 6 },
    { day: 'Wed', appointments: 6, analyses: 4, reports: 2 },
    { day: 'Thu', appointments: 10, analyses: 7, reports: 5 },
    { day: 'Fri', appointments: 14, analyses: 9, reports: 8 },
    { day: 'Sat', appointments: 4, analyses: 2, reports: 1 },
    { day: 'Sun', appointments: 2, analyses: 1, reports: 0 }
  ];

  const diagnosisDistribution = [
    { name: 'Normal', value: 45, color: '#27AE60' },
    { name: 'DME', value: 25, color: '#F39C12' },
    { name: 'CNV', value: 20, color: '#E74C3C' },
    { name: 'Drusen', value: 10, color: '#9B59B6' }
  ];

  const currentPath = location.pathname.split('/').pop() || '';

  const menuItems = [
    { id: '', label: 'Overview', icon: LayoutDashboard, path: '/doctor' },
    { id: 'fundus-analysis', label: 'Fundus Analysis', icon: Camera, path: '/doctor/fundus-analysis' },
    { id: 'analysis-center', label: 'Analysis Center', icon: Microscope, path: '/doctor/analysis-center' },
    { id: 'patients', label: 'Patient Management', icon: Users, path: '/doctor/patients' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
    { id: 'reports', label: 'Medical Reports', icon: FileText, path: '/doctor/reports' },
    { id: 'messages', label: 'Patient Messages', icon: MessageSquare, path: '/doctor/messages' },
    { id: 'email', label: 'Email Center', icon: Mail, path: '/doctor/email' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Brain, path: '/doctor/ai-assistant' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    // Load notifications
    const mockNotifications = [
      { id: 1, type: 'urgent', message: 'High-risk DME case requires immediate attention', time: '5 min ago' },
      { id: 2, type: 'info', message: 'New AI model update available (v2.1.1)', time: '1 hour ago' },
      { id: 3, type: 'appointment', message: '3 appointments scheduled for tomorrow', time: '2 hours ago' }
    ];
    setNotifications(mockNotifications);
  }, []);

  const renderSidebar = () => (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-medical-blue rounded-lg flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-medical-blue">Retinal-AI</h2>
            <p className="text-xs text-muted-foreground">Doctor Portal</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-medical-blue text-white">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'DR'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium text-medical-blue">{user?.name || 'Dr. Smith'}</p>
            <p className="text-xs text-muted-foreground">{user?.specialization || 'Ophthalmologist'}</p>
            <Badge variant="outline" className="text-xs mt-1">Active</Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive 
                    ? 'bg-medical-blue text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
                {item.id === 'messages' && dashboardData.unreadMessages > 0 && (
                  <Badge variant="destructive" className="ml-auto text-xs">
                    {dashboardData.unreadMessages}
                  </Badge>
                )}
                {item.id === 'reports' && dashboardData.pendingReports > 0 && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {dashboardData.pendingReports}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-gray-600">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
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
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-medical-blue">Good morning, Dr. {user?.name?.split(' ')[0] || 'Smith'}</h1>
          <p className="text-muted-foreground">Here's your practice overview for today</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Notifications ({notifications.length})
          </Button>
          <Badge variant="outline" className="bg-health-green-lighter text-health-green">
            <Activity className="w-4 h-4 mr-2" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-medical-blue">{dashboardData.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Analyses</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-health-green">{dashboardData.weeklyAnalyses}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-red">{dashboardData.pendingReports}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-medical-blue">{dashboardData.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">From patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-medical-blue">{dashboardData.totalPatients}</div>
            <p className="text-xs text-muted-foreground">Active cases</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity Overview</CardTitle>
            <CardDescription>Appointments, analyses, and reports completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="appointments" stroke="#0A3D62" strokeWidth={2} name="Appointments" />
                  <Line type="monotone" dataKey="analyses" stroke="#27AE60" strokeWidth={2} name="AI Analyses" />
                  <Line type="monotone" dataKey="reports" stroke="#E74C3C" strokeWidth={2} name="Reports" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Diagnosis Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Diagnosis Distribution</CardTitle>
            <CardDescription>AI-analyzed cases this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diagnosisDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {diagnosisDistribution.map((entry, index) => (
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

      {/* Today's Schedule & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Upcoming appointments and tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-health-green rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Sarah Johnson - Follow-up</p>
                    <p className="text-xs text-muted-foreground">DME treatment assessment</p>
                  </div>
                </div>
                <Badge variant="outline">09:30 AM</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-medical-blue rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Michael Chen - New Consultation</p>
                    <p className="text-xs text-muted-foreground">Initial retinal screening</p>
                  </div>
                </div>
                <Badge variant="outline">11:00 AM</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent-red rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Emily Davis - Urgent Review</p>
                    <p className="text-xs text-muted-foreground">CNV progression monitoring</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-accent-red-lighter text-accent-red">02:15 PM</Badge>
              </div>

              <div className="flex justify-center pt-2">
                <Button variant="outline" size="sm" onClick={() => handleNavigation('/doctor/appointments')}>
                  View All Appointments
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>System alerts and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  {notification.type === 'urgent' && <AlertCircle className="w-5 h-5 text-accent-red mt-0.5" />}
                  {notification.type === 'info' && <Brain className="w-5 h-5 text-medical-blue mt-0.5" />}
                  {notification.type === 'appointment' && <Calendar className="w-5 h-5 text-health-green mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-center pt-2">
                <Button variant="outline" size="sm">
                  View All Notifications
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used tools and features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => handleNavigation('/doctor/fundus-analysis')}
            >
              <Camera className="w-6 h-6 text-medical-blue" />
              <span className="text-sm">New Analysis</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => handleNavigation('/doctor/patients')}
            >
              <Users className="w-6 h-6 text-health-green" />
              <span className="text-sm">Patient Records</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => handleNavigation('/doctor/reports')}
            >
              <FileText className="w-6 h-6 text-accent-red" />
              <span className="text-sm">Generate Report</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => handleNavigation('/doctor/ai-assistant')}
            >
              <Brain className="w-6 h-6 text-medical-blue" />
              <span className="text-sm">AI Assistant</span>
            </Button>
          </div>
        </CardContent>
      </Card>
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
            <Route path="/fundus-analysis" element={<FundusAnalysis user={user} />} />
            <Route path="/analysis-center" element={<AnalysisCenter user={user} />} />
            <Route path="/patients" element={
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Patient Management</h3>
                <p className="text-muted-foreground">Comprehensive patient records and history</p>
              </div>
            } />
            <Route path="/appointments" element={<AppointmentManagement user={user} />} />
            <Route path="/reports" element={<MedicalReports user={user} />} />
            <Route path="/messages" element={<PatientChat user={user} />} />
            <Route path="/email" element={<EmailCenter user={user} />} />
            <Route path="/ai-assistant" element={<AIAssistant user={user} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}