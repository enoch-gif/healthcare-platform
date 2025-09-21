import React, { useState, useEffect } from 'react';
import { dataStore } from '../../services/dataStore';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import { 
  Download, 
  FileText, 
  Image, 
  File, 
  Search, 
  Calendar,
  Archive,
  Share,
  FolderOpen,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

export default function DownloadCenter({ userId }) {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  useEffect(() => {
    loadDocuments();
  }, [userId]);

  useEffect(() => {
    applyFilters();
  }, [documents, searchTerm, typeFilter, dateFilter]);

  const loadDocuments = () => {
    // Get all user documents from various sources
    const reports = dataStore.getReportsByPatient(userId);
    const appointments = dataStore.getAppointmentsByPatient(userId);
    
    const documentsList = [];

    // Add medical reports
    reports.forEach(report => {
      const doctor = dataStore.getUserById(report.doctorId);
      documentsList.push({
        id: `report_${report.id}`,
        type: 'Medical Report',
        name: `${report.findings.condition} Analysis`,
        description: `Retinal analysis report from ${doctor?.name || 'Dr. Unknown'}`,
        date: report.reportDate,
        size: '2.4 MB',
        format: 'PDF',
        doctor: doctor?.name || 'Dr. Unknown',
        category: 'reports',
        downloadUrl: `/api/reports/${report.id}/download`,
        originalData: report
      });

      // Add any images associated with the report
      if (report.images && report.images.length > 0) {
        report.images.forEach((image, index) => {
          documentsList.push({
            id: `image_${report.id}_${index}`,
            type: 'Retinal Image',
            name: `Retinal Scan ${index + 1}`,
            description: `Original retinal image for ${report.findings.condition} analysis`,
            date: report.reportDate,
            size: '8.2 MB',
            format: 'JPEG',
            doctor: doctor?.name || 'Dr. Unknown',
            category: 'images',
            downloadUrl: `/api/images/${report.id}/${index}/download`,
            originalData: report
          });
        });
      }
    });

    // Add appointment summaries
    appointments.forEach(appointment => {
      const doctor = dataStore.getUserById(appointment.doctorId);
      if (appointment.status === 'completed') {
        documentsList.push({
          id: `appointment_${appointment.id}`,
          type: 'Appointment Summary',
          name: `${appointment.type} Summary`,
          description: `Summary from appointment on ${new Date(appointment.appointmentDate).toLocaleDateString()}`,
          date: appointment.appointmentDate,
          size: '156 KB',
          format: 'PDF',
          doctor: doctor?.name || 'Dr. Unknown',
          category: 'appointments',
          downloadUrl: `/api/appointments/${appointment.id}/summary`,
          originalData: appointment
        });
      }
    });

    // Add lab results (mock data)
    const mockLabResults = [
      {
        id: 'lab_1',
        type: 'Lab Results',
        name: 'Blood Sugar Analysis',
        description: 'HbA1c and glucose level results',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        size: '89 KB',
        format: 'PDF',
        doctor: 'Dr. Johnson',
        category: 'lab_results'
      },
      {
        id: 'lab_2',
        type: 'Lab Results',
        name: 'Lipid Panel',
        description: 'Cholesterol and lipid analysis',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        size: '76 KB',
        format: 'PDF',
        doctor: 'Dr. Johnson',
        category: 'lab_results'
      }
    ];

    documentsList.push(...mockLabResults);

    // Sort by date (newest first)
    documentsList.sort((a, b) => new Date(b.date) - new Date(a.date));

    setDocuments(documentsList);
  };

  const applyFilters = () => {
    let filtered = [...documents];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(term) ||
        doc.description.toLowerCase().includes(term) ||
        doc.type.toLowerCase().includes(term) ||
        doc.doctor.toLowerCase().includes(term)
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.category === typeFilter);
    }

    // Date filter
    const now = new Date();
    if (dateFilter !== 'all') {
      filtered = filtered.filter(doc => {
        const docDate = new Date(doc.date);
        const daysDiff = Math.floor((now - docDate) / (1000 * 60 * 60 * 24));
        
        switch (dateFilter) {
          case 'week': return daysDiff <= 7;
          case 'month': return daysDiff <= 30;
          case 'quarter': return daysDiff <= 90;
          case 'year': return daysDiff <= 365;
          default: return true;
        }
      });
    }

    setFilteredDocuments(filtered);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Medical Report': return <FileText className="h-4 w-4" />;
      case 'Retinal Image': return <Image className="h-4 w-4" />;
      case 'Appointment Summary': return <Calendar className="h-4 w-4" />;
      case 'Lab Results': return <File className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Medical Report': return 'bg-[#E3F2FD] text-[#0A3D62]';
      case 'Retinal Image': return 'bg-[#F4E6FF] text-[#9B59B6]';
      case 'Appointment Summary': return 'bg-[#E8F5E8] text-[#27AE60]';
      case 'Lab Results': return 'bg-[#FFF8E1] text-[#F39C12]';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleDownload = (document) => {
    // In a real application, this would initiate the actual download
    toast.success(`Downloading ${document.name}...`);
  };

  const handleBulkDownload = () => {
    if (selectedDocuments.length === 0) {
      toast.error('Please select documents to download');
      return;
    }
    
    toast.success(`Preparing ${selectedDocuments.length} documents for download...`);
    setSelectedDocuments([]);
  };

  const toggleDocumentSelection = (docId) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const selectAllDocuments = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    }
  };

  const getDocumentStats = () => {
    const totalSize = documents.reduce((acc, doc) => {
      const sizeInMB = parseFloat(doc.size.replace(/[^0-9.]/g, ''));
      return acc + (doc.size.includes('KB') ? sizeInMB / 1000 : sizeInMB);
    }, 0);

    return {
      totalDocuments: documents.length,
      totalSize: totalSize.toFixed(1),
      reportCount: documents.filter(d => d.category === 'reports').length,
      imageCount: documents.filter(d => d.category === 'images').length,
      recentCount: documents.filter(d => {
        const daysDiff = Math.floor((new Date() - new Date(d.date)) / (1000 * 60 * 60 * 24));
        return daysDiff <= 30;
      }).length
    };
  };

  const stats = getDocumentStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0A3D62]">Download Center</h2>
          <p className="text-[#6C757D]">Access and download all your medical documents and reports</p>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Total Documents</p>
                <p className="text-2xl font-bold text-[#0A3D62]">{stats.totalDocuments}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-[#0A3D62]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Total Size</p>
                <p className="text-2xl font-bold text-[#27AE60]">{stats.totalSize} MB</p>
              </div>
              <Archive className="h-8 w-8 text-[#27AE60]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Medical Reports</p>
                <p className="text-2xl font-bold text-[#9B59B6]">{stats.reportCount}</p>
              </div>
              <FileText className="h-8 w-8 text-[#9B59B6]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Recent (30 days)</p>
                <p className="text-2xl font-bold text-[#F39C12]">{stats.recentCount}</p>
              </div>
              <Clock className="h-8 w-8 text-[#F39C12]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="reports">Medical Reports</TabsTrigger>
          <TabsTrigger value="images">Retinal Images</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="lab_results">Lab Results</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Search and Filters */}
          <Card className="medical-shadow border-0">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6C757D]" />
                  <Input
                    placeholder="Search documents by name, type, or doctor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="reports">Medical Reports</SelectItem>
                      <SelectItem value="images">Retinal Images</SelectItem>
                      <SelectItem value="appointments">Appointments</SelectItem>
                      <SelectItem value="lab_results">Lab Results</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="quarter">Last 3 Months</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>

                  {selectedDocuments.length > 0 && (
                    <Button onClick={handleBulkDownload} className="bg-[#27AE60]">
                      <Download className="h-4 w-4 mr-2" />
                      Download ({selectedDocuments.length})
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Table */}
          <Card className="medical-shadow border-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Documents ({filteredDocuments.length})</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={selectAllDocuments}
                >
                  {selectedDocuments.length === filteredDocuments.length ? 'Deselect All' : 'Select All'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                        onChange={selectAllDocuments}
                      />
                    </TableHead>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((document) => (
                    <TableRow key={document.id} className="hover:bg-gray-50">
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedDocuments.includes(document.id)}
                          onChange={() => toggleDocumentSelection(document.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${getTypeColor(document.type)}`}>
                            {getTypeIcon(document.type)}
                          </div>
                          <div>
                            <p className="font-medium text-[#0A3D62]">{document.name}</p>
                            <p className="text-sm text-[#6C757D]">{document.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(document.type)}>
                          {document.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{new Date(document.date).toLocaleDateString()}</p>
                          <p className="text-sm text-[#6C757D]">
                            {Math.floor((new Date() - new Date(document.date)) / (1000 * 60 * 60 * 24))} days ago
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{document.doctor}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{document.size}</span>
                          <Badge variant="outline" className="text-xs">
                            {document.format}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownload(document)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                          >
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredDocuments.length === 0 && (
                <div className="text-center py-12">
                  <FolderOpen className="h-12 w-12 text-[#6C757D] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#0A3D62] mb-2">No documents found</h3>
                  <p className="text-[#6C757D] mb-4">
                    {searchTerm ? 'Try adjusting your search terms' : 'Your medical documents will appear here as they become available'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab content for each category */}
        {['reports', 'images', 'appointments', 'lab_results'].map(category => (
          <TabsContent key={category} value={category}>
            <Card className="medical-shadow border-0">
              <CardHeader>
                <CardTitle>
                  {category === 'reports' && 'Medical Reports'}
                  {category === 'images' && 'Retinal Images'}
                  {category === 'appointments' && 'Appointment Summaries'}
                  {category === 'lab_results' && 'Lab Results'}
                </CardTitle>
                <CardDescription>
                  {category === 'reports' && 'Your AI-generated retinal analysis reports'}
                  {category === 'images' && 'Original retinal scan images used in analysis'}
                  {category === 'appointments' && 'Summaries from your completed appointments'}
                  {category === 'lab_results' && 'Blood work and other laboratory test results'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.filter(doc => doc.category === category).map(document => (
                    <Card key={document.id} className="border hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${getTypeColor(document.type)}`}>
                            {getTypeIcon(document.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-[#0A3D62] truncate">{document.name}</h4>
                            <p className="text-sm text-[#6C757D] mb-2">{document.description}</p>
                            <div className="flex items-center justify-between text-xs text-[#6C757D]">
                              <span>{new Date(document.date).toLocaleDateString()}</span>
                              <span>{document.size}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleDownload(document)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {documents.filter(doc => doc.category === category).length === 0 && (
                  <div className="text-center py-12">
                    {getTypeIcon(category)}
                    <h3 className="text-lg font-medium text-[#0A3D62] mb-2 mt-4">
                      No {category.replace('_', ' ')} available
                    </h3>
                    <p className="text-[#6C757D]">
                      Documents in this category will appear here as they become available.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}