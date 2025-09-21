import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

import { 
  User, 
  MapPin, 
  Phone, 
  Calendar, 
  Award, 
  Search,
  Stethoscope,
  Eye,
  Users,
  Clock,
  BookOpen,
  Shield
} from 'lucide-react';
import { mongodbService } from '../services/mongodbService';

export default function DoctorDirectory({ user, onNavigate }) {
  const [doctors, setDoctors] = useState([]);
  const [groupedDoctors, setGroupedDoctors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [categories, setCategories] = useState({ departments: [], specialties: [] });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('departments'); // 'departments' or 'specialties'

  useEffect(() => {
    loadDoctorsAndCategories();
  }, []);

  const loadDoctorsAndCategories = async () => {
    try {
      setLoading(true);
      
      // Load doctors grouped by department
      const [doctorsResponse, categoriesResponse] = await Promise.all([
        mongodbService.getDoctors({ grouped: true }),
        mongodbService.getDoctorCategories()
      ]);

      if (doctorsResponse && categoriesResponse) {
        setGroupedDoctors(doctorsResponse.groupedDoctors || {});
        setCategories(categoriesResponse);
      }
      
      // Load all doctors for search/filter
      const allDoctorsResponse = await mongodbService.getDoctors();
      setDoctors(allDoctorsResponse?.doctors || []);
      
    } catch (error) {
      console.error('Error loading doctors:', error);
      // Fallback mock data
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    const mockDoctors = [
      {
        _id: '1',
        name: 'Dr. Sarah Johnson',
        specialty: 'Retina Specialist',
        department: 'Retinal Diseases',
        hospital_affiliation: 'City Eye Hospital',
        years_experience: 15,
        education: 'Harvard Medical School',
        phone: '(555) 123-4567',
        email: 'sarah.johnson@hospital.com'
      },
      {
        _id: '2',
        name: 'Dr. Michael Chen',
        specialty: 'Glaucoma Specialist',
        department: 'Glaucoma Care',
        hospital_affiliation: 'Metropolitan Eye Center',
        years_experience: 12,
        education: 'Johns Hopkins University',
        phone: '(555) 234-5678',
        email: 'michael.chen@hospital.com'
      },
      {
        _id: '3',
        name: 'Dr. Emily Rodriguez',
        specialty: 'Pediatric Ophthalmology',
        department: 'Pediatric Eye Care',
        hospital_affiliation: 'Children\'s Eye Clinic',
        years_experience: 8,
        education: 'UCLA Medical School',
        phone: '(555) 345-6789',
        email: 'emily.rodriguez@hospital.com'
      },
      {
        _id: '4',
        name: 'Dr. James Wilson',
        specialty: 'Cataract Surgery',
        department: 'Surgical Services',
        hospital_affiliation: 'Vision Surgery Center',
        years_experience: 20,
        education: 'Stanford Medical School',
        phone: '(555) 456-7890',
        email: 'james.wilson@hospital.com'
      }
    ];

    setDoctors(mockDoctors);
    
    const grouped = mockDoctors.reduce((acc, doctor) => {
      const dept = doctor.department || 'General';
      if (!acc[dept]) {
        acc[dept] = [];
      }
      acc[dept].push(doctor);
      return acc;
    }, {});
    
    setGroupedDoctors(grouped);
    
    setCategories({
      departments: ['Retinal Diseases', 'Glaucoma Care', 'Pediatric Eye Care', 'Surgical Services'],
      specialties: ['Retina Specialist', 'Glaucoma Specialist', 'Pediatric Ophthalmology', 'Cataract Surgery']
    });
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    const matchesDepartment = !selectedDepartment || doctor.department === selectedDepartment;
    
    return matchesSearch && matchesSpecialty && matchesDepartment;
  });

  const groupFilteredDoctors = () => {
    return filteredDoctors.reduce((acc, doctor) => {
      const key = viewMode === 'departments' ? doctor.department : doctor.specialty;
      const groupKey = key || 'Other';
      
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(doctor);
      return acc;
    }, {});
  };

  const getDepartmentIcon = (department) => {
    const iconMap = {
      'Retinal Diseases': Eye,
      'Glaucoma Care': Shield,
      'Pediatric Eye Care': Users,
      'Surgical Services': Stethoscope,
      'Emergency Eye Care': Clock,
      'Research & Development': BookOpen
    };
    return iconMap[department] || Eye;
  };

  const DoctorCard = ({ doctor }) => (
    <Card className="hover:shadow-lg transition-shadow medical-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-medical-blue-lighter rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-medical-blue" />
            </div>
            <div>
              <CardTitle className="text-lg text-medical-blue">{doctor.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
            </div>
          </div>
          {doctor.years_experience && (
            <Badge variant="outline" className="bg-health-green-lighter text-health-green">
              {doctor.years_experience}+ years
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Stethoscope className="h-4 w-4 mr-2" />
            {doctor.department}
          </div>
          
          {doctor.hospital_affiliation && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              {doctor.hospital_affiliation}
            </div>
          )}
          
          {doctor.education && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Award className="h-4 w-4 mr-2" />
              {doctor.education}
            </div>
          )}
          
          {doctor.phone && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="h-4 w-4 mr-2" />
              {doctor.phone}
            </div>
          )}
        </div>
        
        <div className="pt-3 border-t">
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              className="flex-1 bg-medical-blue hover:bg-medical-blue-light text-white"
              onClick={() => console.log('Book appointment with', doctor.name)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-health-green text-health-green hover:bg-health-green hover:text-white"
              onClick={() => console.log('Contact', doctor.name)}
            >
              Contact
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-medical-blue">Doctor Directory</h1>
          <p className="text-muted-foreground">Loading specialists...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const groupedFilteredDoctors = groupFilteredDoctors();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-medical-blue mb-2">Doctor Directory</h1>
        <p className="text-muted-foreground">
          Find specialists by department and specialty in our comprehensive eye care network
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="All Specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Specialties</SelectItem>
                {categories.specialties.map(specialty => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {categories.departments.map(department => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="departments">Group by Department</SelectItem>
                <SelectItem value="specialties">Group by Specialty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Found {filteredDoctors.length} doctors across {Object.keys(groupedFilteredDoctors).length} {viewMode}
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setSearchTerm('');
            setSelectedSpecialty('');
            setSelectedDepartment('');
          }}
        >
          Clear Filters
        </Button>
      </div>

      {/* Doctor Groups */}
      <div className="space-y-8">
        {Object.entries(groupedFilteredDoctors).map(([groupName, groupDoctors]) => {
          const IconComponent = getDepartmentIcon(groupName);
          
          return (
            <div key={groupName}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-medical-blue-lighter rounded-full flex items-center justify-center">
                  <IconComponent className="h-5 w-5 text-medical-blue" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-medical-blue">{groupName}</h2>
                  <p className="text-sm text-muted-foreground">
                    {groupDoctors.length} specialist{groupDoctors.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupDoctors.map(doctor => (
                  <DoctorCard key={doctor._id} doctor={doctor} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-medical-blue mb-2">No doctors found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or clear the filters to see all doctors.
          </p>
        </div>
      )}
    </div>
  );
}