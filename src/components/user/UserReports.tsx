import React, { useState, useEffect } from 'react';
import { dataStore } from '../../services/dataStore';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { toast } from 'sonner';
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  Calendar,
  Filter,
  Share,
  Printer,
  AlertTriangle,
  CheckCircle,
  Info,
  Heart,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function UserReports({ userId }) {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    loadReports();
  }, [userId]);

  useEffect(() => {
    applyFilters();
  }, [reports, searchTerm, dateFilter]);

  const loadReports = () => {
    const userReports = dataStore.getReportsByPatient(userId);
    const reportsWithDoctors = userReports.map(report => {
      const doctor = dataStore.getUserById(report.doctorId);
      return { 
        ...report, 
        doctorName: doctor?.name || 'Unknown Doctor'
      };
    });
    setReports(reportsWithDoctors);
  };

  const applyFilters = () => {
    let filtered = [...reports];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(report =>
        report.findings.condition.toLowerCase().includes(term) ||
        report.doctorName.toLowerCase().includes(term) ||
        report.scanType.toLowerCase().includes(term)
      );
    }

    // Date filter
    const now = new Date();
    if (dateFilter !== 'all') {
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.reportDate);
        const daysDiff = Math.floor((now - reportDate) / (1000 * 60 * 60 * 24));
        
        switch (dateFilter) {
          case 'month': return daysDiff <= 30;
          case 'quarter': return daysDiff <= 90;
          case 'year': return daysDiff <= 365;
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
    if (!severity) return 'bg-[#E8F5E8] text-[#27AE60]';
    switch (severity.toLowerCase()) {
      case 'mild': return 'bg-[#FFF8E1] text-[#F39C12]';
      case 'moderate': return 'bg-[#FFE5B4] text-[#E67E22]';
      case 'severe': return 'bg-[#FADBD8] text-[#E74C3C]';
      default: return 'bg-[#E8F5E8] text-[#27AE60]';
    }
  };

  const downloadReport = (report) => {
    toast.success('Downloading your medical report...');
  };

  const shareReport = (report) => {
    toast.success('Report sharing options opened');
  };

  const getHealthTrend = () => {
    if (reports.length < 2) return null;
    
    const recent = reports.slice(0, 3);
    const normalCount = recent.filter(r => r.findings.condition.toLowerCase().includes('normal')).length;
    const abnormalCount = recent.length - normalCount;
    
    return {
      trend: normalCount > abnormalCount ? 'improving' : abnormalCount > normalCount ? 'concern' : 'stable',
      normalCount,
      abnormalCount
    };
  };

  const healthTrend = getHealthTrend();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0A3D62]">Your Medical Reports</h2>
          <p className="text-[#6C757D]">View your retinal health analysis reports and track your progress</p>
        </div>
      </div>

      {/* Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Total Reports</p>
                <p className="text-2xl font-bold text-[#0A3D62]">{reports.length}</p>
              </div>
              <FileText className="h-8 w-8 text-[#0A3D62]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Last Checkup</p>
                <p className="text-lg font-bold text-[#27AE60]">
                  {reports.length > 0 
                    ? new Date(reports[0].reportDate).toLocaleDateString()
                    : 'No reports'
                  }
                </p>
              </div>
              <Calendar className="h-8 w-8 text-[#27AE60]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Health Trend</p>
                <div className="flex items-center space-x-2">
                  {healthTrend ? (
                    <>
                      <span className={`text-lg font-bold ${
                        healthTrend.trend === 'improving' ? 'text-[#27AE60]' :
                        healthTrend.trend === 'concern' ? 'text-[#E74C3C]' :
                        'text-[#F39C12]'
                      }`}>
                        {healthTrend.trend === 'improving' ? 'Good' :
                         healthTrend.trend === 'concern' ? 'Monitor' : 'Stable'}
                      </span>
                      <TrendingUp className={`h-4 w-4 ${
                        healthTrend.trend === 'improving' ? 'text-[#27AE60]' :
                        healthTrend.trend === 'concern' ? 'text-[#E74C3C]' :
                        'text-[#F39C12]'
                      }`} />
                    </>
                  ) : (
                    <span className="text-lg font-bold text-[#6C757D]">N/A</span>
                  )}
                </div>
              </div>
              <Heart className="h-8 w-8 text-[#E74C3C]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Insights */}
      {healthTrend && (
        <Card className="medical-shadow border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="h-5 w-5 mr-2 text-[#0A3D62]" />
              Your Health Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#E3F2FD] rounded-lg">
                <h4 className="font-medium text-[#0A3D62] mb-2">Recent Reports Summary</h4>
                <p className="text-sm text-[#6C757D]">
                  In your last 3 reports: {healthTrend.normalCount} normal findings and {healthTrend.abnormalCount} 
                  {healthTrend.abnormalCount === 1 ? ' condition requiring monitoring' : ' conditions requiring monitoring'}.
                </p>
              </div>
              <div className="p-4 bg-[#E8F5E8] rounded-lg">
                <h4 className="font-medium text-[#0A3D62] mb-2">Recommendation</h4>
                <p className="text-sm text-[#6C757D]">
                  {healthTrend.trend === 'improving' 
                    ? 'Keep up the good work! Continue regular checkups and maintain healthy habits.'
                    : healthTrend.trend === 'concern'
                    ? 'Please follow up with your doctor for the conditions identified in your recent reports.'
                    : 'Continue monitoring your eye health with regular checkups.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="medical-shadow border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6C757D]" />
              <Input
                placeholder="Search your reports by condition or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last 3 Months</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card className="medical-shadow border-0">
        <CardHeader>
          <CardTitle>Your Reports ({filteredReports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Scan Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{new Date(report.reportDate).toLocaleDateString()}</p>
                      <p className="text-sm text-[#6C757D]">
                        {Math.floor((new Date() - new Date(report.reportDate)) / (1000 * 60 * 60 * 24))} days ago
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-[#0A3D62]">{report.doctorName}</span>
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
                {searchTerm ? 'Try adjusting your search terms' : 'Your medical reports will appear here after appointments'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Detail Dialog */}
      {selectedReport && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Your Medical Report</DialogTitle>
              <DialogDescription>
                Detailed analysis from {new Date(selectedReport.reportDate).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Report Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-[#0A3D62] mb-2">Report Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Date:</strong> {new Date(selectedReport.reportDate).toLocaleDateString()}</p>
                      <p><strong>Doctor:</strong> {selectedReport.doctorName}</p>
                      <p><strong>Scan Type:</strong> {selectedReport.scanType}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#0A3D62] mb-2">Primary Finding</h4>
                    <div className="flex items-center space-x-2">
                      <Badge className={getConditionColor(selectedReport.findings.condition)}>
                        {selectedReport.findings.condition}
                      </Badge>
                      {selectedReport.findings.severity && (
                        <Badge className={getSeverityColor(selectedReport.findings.severity)}>
                          {selectedReport.findings.severity}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Finding */}
              <div>
                <h4 className="font-medium text-[#0A3D62] mb-3">What This Means</h4>
                <div className="p-4 border rounded-lg">
                  {selectedReport.findings.condition.toLowerCase().includes('normal') ? (
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-[#27AE60] mt-1" />
                      <div>
                        <h5 className="font-medium text-[#27AE60] mb-1">Good News!</h5>
                        <p className="text-sm text-[#6C757D]">
                          Your retinal examination shows no signs of disease or abnormalities. 
                          Your eye health appears to be in good condition.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-6 w-6 text-[#F39C12] mt-1" />
                      <div>
                        <h5 className="font-medium text-[#F39C12] mb-1">Condition Detected</h5>
                        <p className="text-sm text-[#6C757D]">
                          {selectedReport.findings.condition.includes('Diabetic') &&
                            'Diabetic retinopathy has been detected. This is a complication of diabetes that affects the blood vessels in your retina.'
                          }
                          {selectedReport.findings.condition.includes('Glaucoma') &&
                            'Signs of glaucoma have been detected. This condition affects the optic nerve and can impact vision if left untreated.'
                          }
                          {selectedReport.findings.condition.includes('AMD') &&
                            'Age-related macular degeneration (AMD) has been detected. This affects the central part of your retina called the macula.'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* What You Should Do */}
              <div>
                <h4 className="font-medium text-[#0A3D62] mb-3">What You Should Do</h4>
                <div className="p-4 bg-[#E3F2FD] rounded-lg">
                  <ul className="space-y-2 text-sm">
                    {selectedReport.findings.condition.toLowerCase().includes('normal') ? (
                      <>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-[#27AE60] mt-0.5" />
                          <span>Continue with your regular eye care routine</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-[#27AE60] mt-0.5" />
                          <span>Schedule your next routine eye exam as recommended by your doctor</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-[#27AE60] mt-0.5" />
                          <span>Contact your doctor if you notice any changes in your vision</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start space-x-2">
                          <Clock className="h-4 w-4 text-[#F39C12] mt-0.5" />
                          <span>Schedule a follow-up appointment with your doctor to discuss treatment options</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Clock className="h-4 w-4 text-[#F39C12] mt-0.5" />
                          <span>Monitor your vision and report any changes immediately</span>
                        </li>
                        {selectedReport.findings.condition.includes('Diabetic') && (
                          <li className="flex items-start space-x-2">
                            <Clock className="h-4 w-4 text-[#F39C12] mt-0.5" />
                            <span>Work with your healthcare team to optimize your diabetes management</span>
                          </li>
                        )}
                        <li className="flex items-start space-x-2">
                          <Clock className="h-4 w-4 text-[#F39C12] mt-0.5" />
                          <span>Follow your doctor's recommendations for treatment and monitoring</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {/* Technical Details */}
              <div>
                <h4 className="font-medium text-[#0A3D62] mb-3">Technical Details</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-1">AI Confidence Score</h5>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{selectedReport.findings.confidence}%</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#27AE60] h-2 rounded-full" 
                          style={{ width: `${selectedReport.findings.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-1">Analysis Model</h5>
                    <p className="text-[#6C757D]">Enhanced AI v2.1</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => downloadReport(selectedReport)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={() => shareReport(selectedReport)}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
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