import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import NavigationSidebar from './Navigation';
import Footer from './Footer';
import UserReports from './user/UserReports';
import DownloadCenter from './user/DownloadCenter';
import ChatWithDoctor from './user/ChatWithDoctor';
import HealthEducation from './user/HealthEducation';
import { dataStore } from '../services/dataStore';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { toast } from 'sonner';
import { 
  Calendar, 
  FileText, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  MessageSquare,
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  Activity,
  CalendarPlus,
  Eye,
  Stethoscope,
  Plus,
  Search,
  Filter,
  Settings,
  Bell,
  Shield
} from 'lucide-react';

// User Dashboard Overview
const UserDashboardOverview = ({ user }) => {
  const [dashboardData, setDashboardData] = useState({
    upcomingAppointments: 0,
    totalReports: 0,
    lastReportDate: null,
    pendingAppointments: 0
  });

  useEffect(() => {
    const appointments = dataStore.getAppointmentsByPatient(user.id);
    const reports = dataStore.getReportsByPatient(user.id);
    
    const upcoming = appointments.filter(apt => {
      const appointmentDate = new Date(apt.appointmentDate);
      return appointmentDate >= new Date() && apt.status === 'confirmed';
    }).length;

    const pending = appointments.filter(apt => apt.status === 'pending').length;
    
    const lastReport = reports.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))[0];

    setDashboardData({
      upcomingAppointments: upcoming,
      totalReports: reports.length,
      lastReportDate: lastReport?.reportDate,
      pendingAppointments: pending
    });
  }, [user.id]);

  const healthStats = [
    {
      title: "Upcoming Appointments",
      value: dashboardData.upcomingAppointments,
      icon: CalendarPlus,
      color: "text-[#0A3D62]",
      bgColor: "bg-[#E3F2FD]"
    },
    {
      title: "Medical Reports",
      value: dashboardData.totalReports,
      icon: FileText,
      color: "text-[#27AE60]",
      bgColor: "bg-[#E8F5E8]"
    },
    {
      title: "Pending Requests",
      value: dashboardData.pendingAppointments,
      icon: Clock,
      color: "text-[#F39C12]",
      bgColor: "bg-[#FFF8E1]"
    },
    {
      title: "Health Score",
      value: "Good",
      icon: Heart,
      color: "text-[#27AE60]",
      bgColor: "bg-[#E8F5E8]"
    }
  ];

// User Profile Component
const UserProfile = ({ userId }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-[#0A3D62]">Profile & Settings</h2>
    <Card className="medical-shadow border-0">
      <CardContent className="p-6">
        <div className="text-center py-12">
          <User className="h-16 w-16 text-[#0A3D62] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#0A3D62] mb-2">Profile Management</h3>
          <p className="text-[#6C757D] mb-6">
            Manage your personal information, preferences, and account settings.
          </p>
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="p-4 border rounded-lg">
              <Settings className="h-8 w-8 text-[#27AE60] mx-auto mb-2" />
              <h4 className="font-medium text-[#0A3D62]">Account Settings</h4>
              <p className="text-sm text-[#6C757D]">Update personal information and preferences</p>
            </div>
            <div className="p-4 border rounded-lg">
              <Bell className="h-8 w-8 text-[#9B59B6] mx-auto mb-2" />
              <h4 className="font-medium text-[#0A3D62]">Notifications</h4>
              <p className="text-sm text-[#6C757D]">Manage appointment and health reminders</p>
            </div>
            <div className="p-4 border rounded-lg">
              <Shield className="h-8 w-8 text-[#F39C12] mx-auto mb-2" />
              <h4 className="font-medium text-[#0A3D62]">Privacy & Security</h4>
              <p className="text-sm text-[#6C757D]">Control data sharing and security settings</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0A3D62] mb-2">Welcome back, {user.name?.split(' ')[0]}</h1>
        <p className="text-[#6C757D]">Manage your appointments and view your medical reports.</p>
      </div>

      {/* Health Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="medical-shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6C757D]">{stat.title}</p>
                    <p className="text-3xl font-bold text-[#0A3D62] mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="medical-shadow border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-[#0A3D62]" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/user/book-appointment">
              <Button className="w-full h-20 flex flex-col items-center justify-center bg-[#0A3D62] hover:bg-[#1E5F8B]">
                <CalendarPlus className="h-6 w-6 mb-2" />
                <span>Book Appointment</span>
              </Button>
            </Link>
            
            <Link to="/user/reports">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center border-[#27AE60] text-[#27AE60] hover:bg-[#27AE60] hover:text-white">
                <FileText className="h-6 w-6 mb-2" />
                <span>View Reports</span>
              </Button>
            </Link>
            
            <Link to="/user/downloads">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center border-[#F39C12] text-[#F39C12] hover:bg-[#F39C12] hover:text-white">
                <Download className="h-6 w-6 mb-2" />
                <span>Download Center</span>
              </Button>
            </Link>
            
            <Link to="/user/chat">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center border-[#9B59B6] text-[#9B59B6] hover:bg-[#9B59B6] hover:text-white">
                <MessageSquare className="h-6 w-6 mb-2" />
                <span>Chat with Doctor</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <UpcomingAppointments userId={user.id} />
        <RecentReports userId={user.id} />
      </div>
    </div>
  );
};

// Upcoming Appointments Component
const UpcomingAppointments = ({ userId }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const userAppointments = dataStore.getAppointmentsByPatient(userId);
    const upcoming = userAppointments
      .filter(apt => new Date(apt.appointmentDate) >= new Date())
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
      .slice(0, 5);

    // Get doctor names
    const appointmentsWithDoctors = upcoming.map(apt => {
      const doctor = dataStore.getUserById(apt.doctorId);
      return { ...apt, doctorName: doctor?.name || 'Unknown Doctor' };
    });

    setAppointments(appointmentsWithDoctors);
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-[#E8F5E8] text-[#27AE60]';
      case 'pending': return 'bg-[#FFF8E1] text-[#F39C12]';
      case 'cancelled': return 'bg-[#FADBD8] text-[#E74C3C]';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Card className="medical-shadow border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-[#0A3D62]" />
            Upcoming Appointments
          </span>
          <Link to="/user/appointments">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-[#0A3D62]">{appointment.doctorName}</p>
                <p className="text-sm text-[#6C757D]">{appointment.type}</p>
                <p className="text-xs text-[#6C757D]">
                  {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                </p>
              </div>
              <Badge className={getStatusColor(appointment.status)}>
                {appointment.status}
              </Badge>
            </div>
          ))}
          {appointments.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-[#6C757D] mx-auto mb-3" />
              <p className="text-[#6C757D]">No upcoming appointments</p>
              <Link to="/user/book-appointment">
                <Button className="mt-3 bg-[#0A3D62]">Book Your First Appointment</Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Recent Reports Component
const RecentReports = ({ userId }) => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const userReports = dataStore.getReportsByPatient(userId);
    const recent = userReports
      .sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))
      .slice(0, 5);

    // Get doctor names
    const reportsWithDoctors = recent.map(report => {
      const doctor = dataStore.getUserById(report.doctorId);
      return { ...report, doctorName: doctor?.name || 'Unknown Doctor' };
    });

    setReports(reportsWithDoctors);
  }, [userId]);

  return (
    <Card className="medical-shadow border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-[#0A3D62]" />
            Recent Reports
          </span>
          <Link to="/user/reports">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-[#0A3D62]">{report.findings.condition}</p>
                <p className="text-sm text-[#6C757D]">By {report.doctorName}</p>
                <p className="text-xs text-[#6C757D]">
                  {new Date(report.reportDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {reports.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-[#6C757D] mx-auto mb-3" />
              <p className="text-[#6C757D]">No medical reports yet</p>
              <p className="text-sm text-[#6C757D] mt-1">Your reports will appear here after appointments</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Book Appointment Component
const BookAppointment = ({ userId }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentData, setAppointmentData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    type: '',
    symptoms: '',
    notes: ''
  });

  useEffect(() => {
    const allDoctors = dataStore.getUsersByRole('doctor');
    setDoctors(allDoctors);
  }, []);

  const appointmentTypes = [
    'Routine Checkup',
    'Diabetic Retinopathy Screening',
    'Glaucoma Assessment',
    'Follow-up Visit',
    'Emergency Consultation',
    'Second Opinion'
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedDoctor) {
      toast.error('Please select a doctor');
      return;
    }

    const appointment = dataStore.createAppointment({
      patientId: userId,
      doctorId: selectedDoctor,
      ...appointmentData
    });

    toast.success('Appointment request submitted successfully!');
    
    // Reset form
    setSelectedDoctor('');
    setAppointmentData({
      appointmentDate: '',
      appointmentTime: '',
      type: '',
      symptoms: '',
      notes: ''
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0A3D62] mb-2">Book New Appointment</h2>
        <p className="text-[#6C757D]">Schedule an appointment with one of our specialists.</p>
      </div>

      <Card className="medical-shadow border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarPlus className="h-5 w-5 mr-2 text-[#0A3D62]" />
            Appointment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="doctor">Select Doctor *</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex items-center space-x-3">
                        <Stethoscope className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-[#6C757D]">{doctor.specialization}</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Preferred Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={appointmentData.appointmentDate}
                  onChange={(e) => setAppointmentData({...appointmentData, appointmentDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Preferred Time *</Label>
                <Select 
                  value={appointmentData.appointmentTime} 
                  onValueChange={(value) => setAppointmentData({...appointmentData, appointmentTime: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="type">Appointment Type *</Label>
              <Select 
                value={appointmentData.type} 
                onValueChange={(value) => setAppointmentData({...appointmentData, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="symptoms">Current Symptoms</Label>
              <Textarea
                id="symptoms"
                placeholder="Describe any symptoms you're experiencing..."
                value={appointmentData.symptoms}
                onChange={(e) => setAppointmentData({...appointmentData, symptoms: e.target.value})}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information for the doctor..."
                value={appointmentData.notes}
                onChange={(e) => setAppointmentData({...appointmentData, notes: e.target.value})}
                rows={2}
              />
            </div>

            <Button type="submit" className="w-full bg-[#0A3D62] hover:bg-[#1E5F8B]">
              Submit Appointment Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Main User Dashboard Component
export default function UserDashboard({ user, onLogout }) {
  const [notifications, setNotifications] = useState([
    { type: 'appointment', count: 1 },
    { type: 'report', count: 2 }
  ]);

  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      <NavigationSidebar user={user} onLogout={onLogout} notifications={notifications} />
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<UserDashboardOverview user={user} />} />
            <Route path="/book-appointment" element={<BookAppointment userId={user.id} />} />
            <Route path="/reports" element={<UserReports userId={user.id} />} />
            <Route path="/downloads" element={<DownloadCenter userId={user.id} />} />
            <Route path="/chat-doctor" element={<ChatWithDoctor userId={user.id} />} />
            <Route path="/health-education" element={<HealthEducation userId={user.id} />} />
            <Route path="/profile" element={<UserProfile userId={user.id} />} />
            {/* Additional routes will be implemented */}
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}