import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { dataStore } from '../../services/dataStore';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Calendar, DatePicker } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { toast } from 'sonner';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Plus, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Video,
  FileText,
  Send,
  MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';

export default function AppointmentManagement({ doctorId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    timeRange: 'upcoming'
  });

  const [scheduleForm, setScheduleForm] = useState({
    patientId: '',
    patientName: '',
    patientEmail: '',
    appointmentDate: '',
    appointmentTime: '',
    duration: '30',
    type: '',
    priority: 'normal',
    notes: '',
    reminderEnabled: true
  });

  useEffect(() => {
    loadAppointments();
    
    // Check URL parameters for specific actions
    const urlParams = new URLSearchParams(location.search);
    const action = urlParams.get('action');
    const view = urlParams.get('view');
    const filter = urlParams.get('filter');
    
    if (action === 'schedule') {
      setIsScheduleDialogOpen(true);
    }
    
    if (filter) {
      setFilters(prev => ({ ...prev, status: filter }));
    }
    
    if (view === 'today') {
      const today = new Date();
      setSelectedDate(today);
      setFilters(prev => ({ ...prev, timeRange: 'today' }));
    }
  }, [doctorId, location]);

  useEffect(() => {
    applyFilters();
  }, [appointments, searchTerm, filters, selectedDate]);

  const loadAppointments = () => {
    const doctorAppointments = dataStore.getAppointmentsByDoctor(doctorId);
    const appointmentsWithPatients = doctorAppointments.map(apt => {
      const patient = dataStore.getUserById(apt.patientId);
      return { 
        ...apt, 
        patientName: patient?.name || 'Unknown Patient',
        patientEmail: patient?.email || '',
        patientPhone: patient?.phone || ''
      };
    });
    setAppointments(appointmentsWithPatients);
  };

  const applyFilters = () => {
    let filtered = [...appointments];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(apt =>
        apt.patientName.toLowerCase().includes(term) ||
        apt.type.toLowerCase().includes(term) ||
        apt.notes?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(apt => apt.status === filters.status);
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(apt => apt.type === filters.type);
    }

    // Time range filter
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    switch (filters.timeRange) {
      case 'today':
        filtered = filtered.filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate.toDateString() === today.toDateString();
        });
        break;
      case 'upcoming':
        filtered = filtered.filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate >= today;
        });
        break;
      case 'past':
        filtered = filtered.filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate < today;
        });
        break;
      case 'week':
        filtered = filtered.filter(apt => {
          const aptDate = new Date(apt.appointmentDate);
          return aptDate >= today && aptDate <= weekFromNow;
        });
        break;
    }

    // Sort by date and time
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.appointmentDate} ${a.appointmentTime}`);
      const dateB = new Date(`${b.appointmentDate} ${b.appointmentTime}`);
      return dateA - dateB;
    });

    setFilteredAppointments(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-[#E8F5E8] text-[#27AE60]';
      case 'pending': return 'bg-[#FFF8E1] text-[#F39C12]';
      case 'cancelled': return 'bg-[#FADBD8] text-[#E74C3C]';
      case 'completed': return 'bg-[#E3F2FD] text-[#0A3D62]';
      case 'no-show': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-[#E74C3C] text-white';
      case 'high': return 'bg-[#F39C12] text-white';
      case 'normal': return 'bg-[#27AE60] text-white';
      case 'low': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleStatusUpdate = (appointmentId, newStatus) => {
    const updated = appointments.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, status: newStatus, updatedAt: new Date().toISOString() }
        : apt
    );
    setAppointments(updated);
    dataStore.updateAppointment(appointmentId, { status: newStatus });
    toast.success(`Appointment ${newStatus} successfully`);
  };

  const handleScheduleAppointment = (e) => {
    e.preventDefault();
    
    // Create new appointment
    const newAppointment = dataStore.createAppointment({
      doctorId,
      patientId: scheduleForm.patientId || `patient_${Date.now()}`,
      patientName: scheduleForm.patientName,
      patientEmail: scheduleForm.patientEmail,
      appointmentDate: scheduleForm.appointmentDate,
      appointmentTime: scheduleForm.appointmentTime,
      duration: parseInt(scheduleForm.duration),
      type: scheduleForm.type,
      priority: scheduleForm.priority,
      notes: scheduleForm.notes,
      status: 'confirmed'
    });

    loadAppointments();
    setIsScheduleDialogOpen(false);
    
    // Reset form
    setScheduleForm({
      patientId: '', patientName: '', patientEmail: '',
      appointmentDate: '', appointmentTime: '', duration: '30',
      type: '', priority: 'normal', notes: '', reminderEnabled: true
    });
    
    toast.success('Appointment scheduled successfully');
  };

  const appointmentTypes = [
    'Routine Checkup',
    'Diabetic Retinopathy Screening',
    'Glaucoma Assessment',
    'Follow-up Visit',
    'Emergency Consultation',
    'Second Opinion',
    'Post-Surgery Check',
    'Consultation',
    'Procedure'
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todayAppts = appointments.filter(apt => 
      new Date(apt.appointmentDate).toDateString() === today
    );
    
    return {
      total: todayAppts.length,
      confirmed: todayAppts.filter(apt => apt.status === 'confirmed').length,
      pending: todayAppts.filter(apt => apt.status === 'pending').length,
      completed: todayAppts.filter(apt => apt.status === 'completed').length
    };
  };

  const todayStats = getTodayStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0A3D62]">Appointment Management</h2>
          <p className="text-[#6C757D]">Manage patient appointments and scheduling</p>
        </div>
        <Button 
          onClick={() => setIsScheduleDialogOpen(true)}
          className="bg-[#0A3D62] hover:bg-[#1E5F8B]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Today's Total</p>
                <p className="text-2xl font-bold text-[#0A3D62]">{todayStats.total}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-[#0A3D62]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Confirmed</p>
                <p className="text-2xl font-bold text-[#27AE60]">{todayStats.confirmed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-[#27AE60]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Pending</p>
                <p className="text-2xl font-bold text-[#F39C12]">{todayStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-[#F39C12]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Completed</p>
                <p className="text-2xl font-bold text-[#9B59B6]">{todayStats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-[#9B59B6]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="medical-shadow border-0">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6C757D]" />
              <Input
                placeholder="Search appointments by patient name, type, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.timeRange} onValueChange={(value) => setFilters({...filters, timeRange: value})}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {appointmentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card className="medical-shadow border-0">
        <CardHeader>
          <CardTitle>Appointments ({filteredAppointments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-[#0A3D62]">{appointment.patientName}</p>
                      <p className="text-sm text-[#6C757D]">{appointment.patientEmail}</p>
                      {appointment.patientPhone && (
                        <p className="text-xs text-[#6C757D]">{appointment.patientPhone}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                      <p className="text-sm text-[#6C757D]">{appointment.appointmentTime}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{appointment.type}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(appointment.priority)}>
                      {appointment.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{appointment.duration} min</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {appointment.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                            className="text-[#27AE60] hover:bg-[#27AE60] hover:text-white"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                            className="text-[#E74C3C] hover:bg-[#E74C3C] hover:text-white"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      {appointment.status === 'confirmed' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                          className="text-[#9B59B6] hover:bg-[#9B59B6] hover:text-white"
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-[#6C757D] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#0A3D62] mb-2">No appointments found</h3>
              <p className="text-[#6C757D] mb-4">
                {searchTerm ? 'Try adjusting your search or filters' : 'Schedule your first appointment to get started'}
              </p>
              <Button onClick={() => setIsScheduleDialogOpen(true)} className="bg-[#0A3D62]">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule Appointment Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>
              Schedule a new appointment with patient details and preferences.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleScheduleAppointment} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  value={scheduleForm.patientName}
                  onChange={(e) => setScheduleForm({...scheduleForm, patientName: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="patientEmail">Patient Email *</Label>
                <Input
                  id="patientEmail"
                  type="email"
                  value={scheduleForm.patientEmail}
                  onChange={(e) => setScheduleForm({...scheduleForm, patientEmail: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="appointmentDate">Date *</Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  value={scheduleForm.appointmentDate}
                  onChange={(e) => setScheduleForm({...scheduleForm, appointmentDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <Label htmlFor="appointmentTime">Time *</Label>
                <Select 
                  value={scheduleForm.appointmentTime} 
                  onValueChange={(value) => setScheduleForm({...scheduleForm, appointmentTime: value})}
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
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select 
                  value={scheduleForm.duration} 
                  onValueChange={(value) => setScheduleForm({...scheduleForm, duration: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Appointment Type *</Label>
                <Select 
                  value={scheduleForm.type} 
                  onValueChange={(value) => setScheduleForm({...scheduleForm, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
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
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={scheduleForm.priority} 
                  onValueChange={(value) => setScheduleForm({...scheduleForm, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes for the appointment..."
                value={scheduleForm.notes}
                onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#0A3D62]">
                Schedule Appointment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Appointment Dialog */}
      {selectedAppointment && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>
                Complete information for this appointment
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-[#0A3D62] mb-3">Patient Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-[#6C757D]" />
                      <span>{selectedAppointment.patientName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-[#6C757D]" />
                      <span>{selectedAppointment.patientEmail}</span>
                    </div>
                    {selectedAppointment.patientPhone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-[#6C757D]" />
                        <span>{selectedAppointment.patientPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-[#0A3D62] mb-3">Appointment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-[#6C757D]" />
                      <span>{new Date(selectedAppointment.appointmentDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-[#6C757D]" />
                      <span>{selectedAppointment.appointmentTime} ({selectedAppointment.duration} min)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-[#6C757D]" />
                      <span>{selectedAppointment.type}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-[#0A3D62] mb-2">Status</h4>
                  <Badge className={getStatusColor(selectedAppointment.status)}>
                    {selectedAppointment.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium text-[#0A3D62] mb-2">Priority</h4>
                  <Badge className={getPriorityColor(selectedAppointment.priority)}>
                    {selectedAppointment.priority}
                  </Badge>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <h4 className="font-medium text-[#0A3D62] mb-2">Notes</h4>
                  <p className="text-sm text-[#6C757D] bg-gray-50 p-3 rounded-lg">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}

              {selectedAppointment.symptoms && (
                <div>
                  <h4 className="font-medium text-[#0A3D62] mb-2">Reported Symptoms</h4>
                  <p className="text-sm text-[#6C757D] bg-gray-50 p-3 rounded-lg">
                    {selectedAppointment.symptoms}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}