import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Calendar,
  FileText,
  MessageSquare,
  Download,
  BookOpen,
  Activity,
  Eye,
  Clock,
  User,
  Heart,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Camera
} from 'lucide-react';

const PatientDashboard = ({ user }) => {
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      // Mock data for demo
      setRecentAnalyses([
        {
          id: 1,
          date: '2024-01-15',
          type: 'Fundus Analysis',
          result: 'Normal',
          confidence: 98.2,
          doctor: 'Dr. Sarah Johnson'
        },
        {
          id: 2,
          date: '2024-01-08',
          type: 'OCT Scan',
          result: 'Mild Drusen Detected',
          confidence: 89.5,
          doctor: 'Dr. Michael Chen'
        }
      ]);

      setAppointments([
        {
          id: 1,
          date: '2024-01-22',
          time: '2:30 PM',
          doctor: 'Dr. Sarah Johnson',
          type: 'Follow-up Consultation',
          status: 'confirmed'
        },
        {
          id: 2,
          date: '2024-02-05',
          time: '10:00 AM',
          doctor: 'Dr. Michael Chen',
          type: 'Comprehensive Eye Exam',
          status: 'scheduled'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const getResultColor = (result) => {
    if (result.toLowerCase().includes('normal')) return 'text-health-green';
    if (result.toLowerCase().includes('mild')) return 'text-warning';
    return 'text-accent-red';
  };

  const getResultIcon = (result) => {
    if (result.toLowerCase().includes('normal')) return CheckCircle;
    return AlertCircle;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-medical-blue">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground mt-2">
          Track your eye health journey with AI-powered insights and personalized care
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Analyses</p>
                <p className="text-2xl font-semibold text-medical-blue">{recentAnalyses.length}</p>
              </div>
              <Eye className="h-8 w-8 text-medical-blue-light" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Appointments</p>
                <p className="text-2xl font-semibold text-medical-blue">{appointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-medical-blue-light" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Health Score</p>
                <p className="text-2xl font-semibold text-health-green">92%</p>
              </div>
              <Heart className="h-8 w-8 text-health-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Checkup</p>
                <p className="text-sm font-medium text-medical-blue">Jan 15, 2024</p>
              </div>
              <Activity className="h-8 w-8 text-medical-blue-light" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Analyses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Recent Eye Analyses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAnalyses.map((analysis) => {
              const ResultIcon = getResultIcon(analysis.result);
              return (
                <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <ResultIcon className={`h-8 w-8 ${getResultColor(analysis.result)}`} />
                    <div>
                      <h4 className="font-medium text-medical-blue">{analysis.type}</h4>
                      <p className="text-sm text-muted-foreground">{analysis.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${getResultColor(analysis.result)}`}>
                      {analysis.result}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {analysis.confidence}% confidence
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Report
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-medical-blue-lighter p-2 rounded-lg">
                    <Clock className="h-6 w-6 text-medical-blue" />
                  </div>
                  <div>
                    <h4 className="font-medium text-medical-blue">{appointment.type}</h4>
                    <p className="text-sm text-muted-foreground">
                      {appointment.date} at {appointment.time}
                    </p>
                    <p className="text-sm text-medical-blue">with {appointment.doctor}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="text-health-green border-health-green">
                    {appointment.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button className="h-16 bg-medical-blue hover:bg-medical-blue-light text-white">
          <Camera className="h-6 w-6 mr-2" />
          New Analysis
        </Button>
        <Button variant="outline" className="h-16 border-health-green text-health-green hover:bg-health-green-lighter">
          <Calendar className="h-6 w-6 mr-2" />
          Book Appointment
        </Button>
        <Button variant="outline" className="h-16">
          <MessageSquare className="h-6 w-6 mr-2" />
          Chat with Doctor
        </Button>
        <Button variant="outline" className="h-16">
          <Download className="h-6 w-6 mr-2" />
          Download Reports
        </Button>
      </div>

      {/* Health Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Personalized Health Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                Your recent eye health scores show improvement! Keep up the good work with regular checkups.
              </AlertDescription>
            </Alert>
            <div className="bg-medical-blue-lighter p-4 rounded-lg">
              <h4 className="font-medium text-medical-blue mb-2">Eye Care Recommendations</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Take regular breaks when using digital devices (20-20-20 rule)</li>
                <li>• Maintain a healthy diet rich in omega-3 fatty acids and antioxidants</li>
                <li>• Protect your eyes from UV radiation with quality sunglasses</li>
                <li>• Stay hydrated and get adequate sleep for optimal eye health</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;