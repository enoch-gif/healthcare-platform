import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { dataStore } from '../../services/dataStore';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  User,
  Printer,
  Share,
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3
} from 'lucide-react';

export default function MedicalReports({ doctorId }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    condition: 'all',
    dateRange: 'all',
    severity: 'all'
  });

  useEffect(() => {
    loadReports();
    
    // Check URL parameters for specific patient filter
    const urlParams = new URLSearchParams(location.search);
    const patientId = urlParams.get('patient');
    if (patientId) {
      setFilters(prev => ({ ...prev, patient: patientId }));
    }
  }, [doctorId, location]);

  useEffect(() => {
    applyFilters();
  }, [reports, searchTerm, filters]);

  const loadReports = () => {
    const doctorReports = dataStore.getReportsByDoctor(doctorId);
    const reportsWithPatients = doctorReports.map(report => {
      const patient = dataStore.getUserById(report.patientId);
      return { 
        ...report, 
        patientName: patient?.name || 'Unknown Patient',
        patientAge: patient?.age || 'N/A'
      };
    });
    setReports(reportsWithPatients);
  };

  const applyFilters = () => {
    let filtered = [...reports];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(report =>
        report.patientName.toLowerCase().includes(term) ||
        report.findings.condition.toLowerCase().includes(term) ||
        report.scanType.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(report => report.status === filters.status);
    }

    // Condition filter
    if (filters.condition !== 'all') {
      filtered = filtered.filter(report => 
        report.findings.condition.toLowerCase().includes(filters.condition.toLowerCase())
      );
    }

    // Severity filter
    if (filters.severity !== 'all') {
      filtered = filtered.filter(report => report.findings.severity === filters.severity);
    }

    // Date range filter
    const now = new Date();
    if (filters.dateRange !== 'all') {
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.reportDate);
        const daysDiff = Math.floor((now - reportDate) / (1000 * 60 * 60 * 24));
        
        switch (filters.dateRange) {
          case 'today': return daysDiff === 0;
          case 'week': return daysDiff <= 7;
          case 'month': return daysDiff <= 30;
          case 'quarter': return daysDiff <= 90;
          default: return true;
        }
      });
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate));

    setFilteredReports(filtered);
  };

  const getConditionColor = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('normal')) return 'bg-[#E8F5E8] text-[#27AE60]';
    if (conditionLower.includes('diabetic')) return 'bg-[#FFF8E1] text-[#F39C12]';
    if (conditionLower.includes('glaucoma')) return 'bg-[#F4E6FF] text-[#9B59B6]';
    if (conditionLower.includes('amd')) return 'bg-[#FADBD8] text-[#E74C3C]';
    return 'bg-gray-100 text-gray-600';
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'mild': return 'bg-[#FFF8E1] text-[#F39C12]';
      case 'moderate': return 'bg-[#FFE5B4] text-[#E67E22]';
      case 'severe': return 'bg-[#FADBD8] text-[#E74C3C]';
      case 'critical': return 'bg-[#E74C3C] text-white';
      default: return 'bg-[#E8F5E8] text-[#27AE60]';
    }
  };

  const downloadReport = (report) => {
    // In a real application, this would generate and download a PDF
    toast.success(`Downloading report for ${report.patientName}`);
  };

  const shareReport = (report) => {
    // In a real application, this would open sharing options
    toast.success('Report sharing options opened');
  };

  const getReportStats = () => {
    const totalReports = reports.length;
    const thisMonth = reports.filter(report => {
      const reportDate = new Date(report.reportDate);
      const now = new Date();
      return reportDate.getMonth() === now.getMonth() && 
             reportDate.getFullYear() === now.getFullYear();
    }).length;

    const abnormalFindings = reports.filter(report => 
      !report.findings.condition.toLowerCase().includes('normal')
    ).length;

    const avgConfidence = reports.length > 0 
      ? (reports.reduce((sum, report) => sum + report.findings.confidence, 0) / reports.length).toFixed(1)
      : 0;

    return { totalReports, thisMonth, abnormalFindings, avgConfidence };
  };

  const stats = getReportStats();

  const conditionDistribution = () => {
    const distribution = {};
    reports.forEach(report => {
      const condition = report.findings.condition;
      distribution[condition] = (distribution[condition] || 0) + 1;
    });
    return Object.entries(distribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0A3D62]">Medical Reports</h2>
          <p className="text-[#6C757D]">View and manage AI-generated diagnostic reports</p>
        </div>
        <Button 
          onClick={() => navigate('/doctor/analysis')}
          className="bg-[#0A3D62] hover:bg-[#1E5F8B]"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Analysis
        </Button>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Total Reports</p>
                <p className="text-2xl font-bold text-[#0A3D62]">{stats.totalReports}</p>
              </div>
              <FileText className="h-8 w-8 text-[#0A3D62]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">This Month</p>
                <p className="text-2xl font-bold text-[#27AE60]">{stats.thisMonth}</p>
              </div>
              <Calendar className="h-8 w-8 text-[#27AE60]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Abnormal Findings</p>
                <p className="text-2xl font-bold text-[#F39C12]">{stats.abnormalFindings}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-[#F39C12]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Avg Confidence</p>
                <p className="text-2xl font-bold text-[#9B59B6]">{stats.avgConfidence}%</p>
              </div>
              <Target className="h-8 w-8 text-[#9B59B6]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Reports Table */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <Card className="medical-shadow border-0">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6C757D]" />
                  <Input
                    placeholder="Search reports by patient name, condition, or scan type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Select value={filters.condition} onValueChange={(value) => setFilters({...filters, condition: value})}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Conditions</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="diabetic">Diabetic Retinopathy</SelectItem>
                      <SelectItem value="glaucoma">Glaucoma</SelectItem>
                      <SelectItem value="amd">AMD</SelectItem>
                      <SelectItem value="cnv">CNV</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.severity} onValueChange={(value) => setFilters({...filters, severity: value})}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="Mild">Mild</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Severe">Severe</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.dateRange} onValueChange={(value) => setFilters({...filters, dateRange: value})}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">Last 3 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card className="medical-shadow border-0">
            <CardHeader>
              <CardTitle>Reports ({filteredReports.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Scan Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-[#0A3D62]">{report.patientName}</p>
                          <p className="text-sm text-[#6C757D]">Age: {report.patientAge}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{new Date(report.reportDate).toLocaleDateString()}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getConditionColor(report.findings.condition)}>
                          {report.findings.condition}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(report.findings.severity)}>
                          {report.findings.severity || 'Normal'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{report.findings.confidence}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[#27AE60] h-2 rounded-full" 
                              style={{ width: `${report.findings.confidence}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{report.scanType}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedReport(report);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => downloadReport(report)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => shareReport(report)}
                          >
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredReports.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-[#6C757D] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#0A3D62] mb-2">No reports found</h3>
                  <p className="text-[#6C757D] mb-4">
                    {searchTerm ? 'Try adjusting your search or filters' : 'Start analyzing retinal images to generate reports'}
                  </p>
                  <Button onClick={() => navigate('/doctor/analysis')} className="bg-[#0A3D62]">
                    <Plus className="h-4 w-4 mr-2" />
                    Start Analysis
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Analytics */}
        <div className="space-y-6">
          {/* Condition Distribution */}
          <Card className="medical-shadow border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-[#0A3D62]" />
                Condition Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conditionDistribution().map(([condition, count]) => (
                  <div key={condition} className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{condition}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-[#6C757D]">{count}</span>
                      <div className="w-12 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#0A3D62] h-2 rounded-full" 
                          style={{ width: `${(count / reports.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="medical-shadow border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-[#0A3D62]" />
                Recent Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6C757D]">Reports this week</span>
                  <span className="font-medium text-[#27AE60]">+15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6C757D]">Average confidence</span>
                  <span className="font-medium text-[#0A3D62]">+2.1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6C757D]">Normal findings</span>
                  <span className="font-medium text-[#27AE60]">68%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6C757D]">Follow-up needed</span>
                  <span className="font-medium text-[#F39C12]">12%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Report Detail Dialog */}
      {selectedReport && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Medical Report Details</DialogTitle>
              <DialogDescription>
                Comprehensive AI analysis report for {selectedReport.patientName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Report Header */}
              <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-[#0A3D62] mb-2">Patient Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {selectedReport.patientName}</p>
                    <p><strong>Age:</strong> {selectedReport.patientAge}</p>
                    <p><strong>Report Date:</strong> {new Date(selectedReport.reportDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-[#0A3D62] mb-2">Scan Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Scan Type:</strong> {selectedReport.scanType}</p>
                    <p><strong>Eye:</strong> {selectedReport.eye || 'Both'}</p>
                    <p><strong>Model Version:</strong> Enhanced AI v2.1</p>
                  </div>
                </div>
              </div>

              {/* Primary Findings */}
              <div>
                <h4 className="font-medium text-[#0A3D62] mb-3">Primary Diagnosis</h4>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-medium">{selectedReport.findings.condition}</span>
                    <div className="flex items-center space-x-2">
                      <Badge className={getConditionColor(selectedReport.findings.condition)}>
                        {selectedReport.findings.condition}
                      </Badge>
                      <Badge className="bg-[#0A3D62] text-white">
                        {selectedReport.findings.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                  {selectedReport.findings.severity && selectedReport.findings.severity !== 'Normal' && (
                    <p className="text-sm text-[#6C757D]">
                      Severity: <Badge className={getSeverityColor(selectedReport.findings.severity)}>
                        {selectedReport.findings.severity}
                      </Badge>
                    </p>
                  )}
                </div>
              </div>

              {/* Detailed Findings */}
              <div>
                <h4 className="font-medium text-[#0A3D62] mb-3">Detailed Analysis</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Optic Disc Assessment</h5>
                      <p className="text-sm text-[#6C757D]">Normal cup-to-disc ratio. No signs of glaucomatous changes.</p>
                      <Badge className="mt-1 bg-[#E8F5E8] text-[#27AE60]">Normal</Badge>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Vascular Analysis</h5>
                      <p className="text-sm text-[#6C757D]">
                        {selectedReport.findings.condition.includes('Diabetic') 
                          ? 'Microaneurysms and hemorrhages detected consistent with diabetic retinopathy.'
                          : 'Retinal vasculature appears normal with no significant abnormalities.'
                        }
                      </p>
                      <Badge className={
                        selectedReport.findings.condition.includes('Diabetic')
                          ? 'mt-1 bg-[#FFF8E1] text-[#F39C12]'
                          : 'mt-1 bg-[#E8F5E8] text-[#27AE60]'
                      }>
                        {selectedReport.findings.condition.includes('Diabetic') ? 'Abnormal' : 'Normal'}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Macular Region</h5>
                      <p className="text-sm text-[#6C757D]">
                        {selectedReport.findings.condition.includes('AMD')
                          ? 'Drusen deposits and pigmentary changes noted in the macular region.'
                          : 'Macula appears healthy with normal foveal architecture.'
                        }
                      </p>
                      <Badge className={
                        selectedReport.findings.condition.includes('AMD')
                          ? 'mt-1 bg-[#FADBD8] text-[#E74C3C]'
                          : 'mt-1 bg-[#E8F5E8] text-[#27AE60]'
                      }>
                        {selectedReport.findings.condition.includes('AMD') ? 'Abnormal' : 'Normal'}
                      </Badge>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Peripheral Retina</h5>
                      <p className="text-sm text-[#6C757D]">No significant abnormalities detected in the peripheral retina.</p>
                      <Badge className="mt-1 bg-[#E8F5E8] text-[#27AE60]">Normal</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-medium text-[#0A3D62] mb-3">Clinical Recommendations</h4>
                <div className="p-4 bg-[#E3F2FD] rounded-lg">
                  <ul className="space-y-2 text-sm">
                    {selectedReport.findings.condition.includes('Normal') ? (
                      <>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-[#27AE60] mt-0.5" />
                          <span>Continue routine annual eye examinations</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-[#27AE60] mt-0.5" />
                          <span>Maintain good overall health and blood pressure control</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-[#27AE60] mt-0.5" />
                          <span>No immediate follow-up required unless symptoms develop</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-[#F39C12] mt-0.5" />
                          <span>Follow-up examination recommended in 3-6 months</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-[#F39C12] mt-0.5" />
                          <span>Consider referral to retinal specialist for further evaluation</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-[#F39C12] mt-0.5" />
                          <span>Monitor for changes in vision and report any new symptoms</span>
                        </li>
                        {selectedReport.findings.condition.includes('Diabetic') && (
                          <li className="flex items-start space-x-2">
                            <AlertTriangle className="h-4 w-4 text-[#F39C12] mt-0.5" />
                            <span>Optimize diabetes management and glycemic control</span>
                          </li>
                        )}
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => downloadReport(selectedReport)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" onClick={() => shareReport(selectedReport)}>
                  <Share className="h-4 w-4 mr-2" />
                  Share Report
                </Button>
                <Button variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}