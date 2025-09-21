import React, { useState, useEffect } from 'react';
import { dataStore } from '../../services/dataStore';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { 
  Mail, 
  Send, 
  Search, 
  Plus,
  Inbox,
  Archive,
  Trash2,
  Star,
  Reply,
  Forward,
  Paperclip,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  Calendar,
  MoreHorizontal,
  Eye,
  Filter,
  Folder
} from 'lucide-react';

export default function EmailCenter({ doctorId }) {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isViewEmailOpen, setIsViewEmailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFolder, setFilterFolder] = useState('inbox');
  const [filterStatus, setFilterStatus] = useState('all');
  const [composeForm, setComposeForm] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    priority: 'normal',
    attachments: []
  });

  useEffect(() => {
    loadEmails();
  }, [doctorId, filterFolder]);

  const loadEmails = () => {
    const doctorEmails = dataStore.getEmailsByDoctor(doctorId, filterFolder);
    const emailsWithPatients = doctorEmails.map(email => {
      const sender = dataStore.getUserById(email.senderId);
      return { 
        ...email, 
        senderName: sender?.name || email.senderEmail,
        senderRole: sender?.role || 'external'
      };
    });
    
    // Sort by date (newest first)
    emailsWithPatients.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
    setEmails(emailsWithPatients);
  };

  const sendEmail = async () => {
    if (!composeForm.to || !composeForm.subject || !composeForm.body) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const email = {
        senderId: doctorId,
        senderEmail: dataStore.getUserById(doctorId)?.email,
        recipientEmail: composeForm.to,
        ccEmails: composeForm.cc ? composeForm.cc.split(',').map(e => e.trim()) : [],
        bccEmails: composeForm.bcc ? composeForm.bcc.split(',').map(e => e.trim()) : [],
        subject: composeForm.subject,
        body: composeForm.body,
        priority: composeForm.priority,
        folder: 'sent',
        isRead: true,
        isStarred: false,
        sentAt: new Date().toISOString(),
        attachments: composeForm.attachments
      };

      dataStore.createEmail(email);
      setEmails(prev => [email, ...prev]);
      setIsComposeOpen(false);
      
      // Reset form
      setComposeForm({
        to: '', cc: '', bcc: '', subject: '', body: '', 
        priority: 'normal', attachments: []
      });
      
      toast.success('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    }
  };

  const markAsRead = (emailId) => {
    dataStore.updateEmail(emailId, { isRead: true });
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, isRead: true } : email
    ));
  };

  const toggleStar = (emailId) => {
    const email = emails.find(e => e.id === emailId);
    const newStarred = !email.isStarred;
    
    dataStore.updateEmail(emailId, { isStarred: newStarred });
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, isStarred: newStarred } : email
    ));
    
    toast.success(newStarred ? 'Email starred' : 'Email unstarred');
  };

  const moveToFolder = (emailId, folder) => {
    dataStore.updateEmail(emailId, { folder });
    setEmails(prev => prev.filter(email => email.id !== emailId));
    toast.success(`Email moved to ${folder}`);
  };

  const deleteEmail = (emailId) => {
    if (window.confirm('Are you sure you want to delete this email?')) {
      moveToFolder(emailId, 'trash');
    }
  };

  const replyToEmail = (email) => {
    setComposeForm({
      to: email.senderEmail,
      cc: '',
      bcc: '',
      subject: `Re: ${email.subject}`,
      body: `\n\n--- Original Message ---\nFrom: ${email.senderName} <${email.senderEmail}>\nSent: ${new Date(email.sentAt).toLocaleString()}\nSubject: ${email.subject}\n\n${email.body}`,
      priority: 'normal',
      attachments: []
    });
    setIsComposeOpen(true);
  };

  const formatEmailTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5;
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { 
        weekday: 'short'
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-[#E74C3C]';
      case 'high': return 'text-[#F39C12]';
      case 'normal': return 'text-[#6C757D]';
      case 'low': return 'text-[#95A5A6]';
      default: return 'text-[#6C757D]';
    }
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch = !searchTerm || 
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.body.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'unread' && !email.isRead) ||
      (filterStatus === 'starred' && email.isStarred);
    
    return matchesSearch && matchesStatus;
  });

  const getEmailStats = () => {
    return {
      total: emails.length,
      unread: emails.filter(e => !e.isRead).length,
      starred: emails.filter(e => e.isStarred).length,
      urgent: emails.filter(e => e.priority === 'urgent').length
    };
  };

  const stats = getEmailStats();

  const folders = [
    { id: 'inbox', name: 'Inbox', icon: Inbox, count: stats.unread },
    { id: 'sent', name: 'Sent', icon: Send, count: 0 },
    { id: 'starred', name: 'Starred', icon: Star, count: stats.starred },
    { id: 'archive', name: 'Archive', icon: Archive, count: 0 },
    { id: 'trash', name: 'Trash', icon: Trash2, count: 0 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0A3D62]">Email Center</h2>
          <p className="text-[#6C757D]">Secure email communication with patients and colleagues</p>
        </div>
        <Button onClick={() => setIsComposeOpen(true)} className="bg-[#0A3D62] hover:bg-[#1E5F8B]">
          <Plus className="h-4 w-4 mr-2" />
          Compose
        </Button>
      </div>

      {/* Email Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Total Emails</p>
                <p className="text-2xl font-bold text-[#0A3D62]">{stats.total}</p>
              </div>
              <Mail className="h-8 w-8 text-[#0A3D62]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Unread</p>
                <p className="text-2xl font-bold text-[#F39C12]">{stats.unread}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-[#F39C12]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Starred</p>
                <p className="text-2xl font-bold text-[#9B59B6]">{stats.starred}</p>
              </div>
              <Star className="h-8 w-8 text-[#9B59B6]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Urgent</p>
                <p className="text-2xl font-bold text-[#E74C3C]">{stats.urgent}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-[#E74C3C]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Folders Sidebar */}
        <div className="lg:col-span-1">
          <Card className="medical-shadow border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Folder className="h-5 w-5 mr-2 text-[#0A3D62]" />
                Folders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {folders.map((folder) => {
                  const Icon = folder.icon;
                  return (
                    <div
                      key={folder.id}
                      onClick={() => setFilterFolder(folder.id)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        filterFolder === folder.id
                          ? 'bg-[#E3F2FD] text-[#0A3D62]'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{folder.name}</span>
                      </div>
                      {folder.count > 0 && (
                        <Badge className="bg-[#E74C3C] text-white">
                          {folder.count}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email List */}
        <div className="lg:col-span-3">
          <Card className="medical-shadow border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-[#0A3D62]" />
                  {folders.find(f => f.id === filterFolder)?.name || 'Emails'} ({filteredEmails.length})
                </CardTitle>
              </div>
              
              {/* Search and Filter */}
              <div className="flex space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6C757D]" />
                  <Input
                    placeholder="Search emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="starred">Starred</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmails.map((email) => (
                    <TableRow key={email.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleStar(email.id)}
                            className={email.isStarred ? 'text-[#F39C12]' : 'text-[#6C757D]'}
                          >
                            <Star className={`h-4 w-4 ${email.isStarred ? 'fill-current' : ''}`} />
                          </Button>
                          {!email.isRead && (
                            <div className="w-2 h-2 bg-[#0A3D62] rounded-full"></div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-[#E3F2FD] text-[#0A3D62]">
                              {email.senderName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className={`font-medium ${!email.isRead ? 'text-[#0A3D62]' : 'text-[#6C757D]'}`}>
                              {email.senderName}
                            </p>
                            <p className="text-sm text-[#6C757D]">{email.senderEmail}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className={`${!email.isRead ? 'font-semibold text-[#0A3D62]' : 'text-[#6C757D]'}`}>
                            {email.subject}
                          </p>
                          <p className="text-sm text-[#6C757D] truncate max-w-xs">
                            {email.body.substring(0, 50)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getPriorityColor(email.priority)} bg-gray-100`}>
                          {email.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-[#6C757D]">
                          {formatEmailTime(email.sentAt)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedEmail(email);
                              setIsViewEmailOpen(true);
                              if (!email.isRead) markAsRead(email.id);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => replyToEmail(email)}
                          >
                            <Reply className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteEmail(email.id)}
                            className="text-[#E74C3C] hover:bg-[#E74C3C] hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredEmails.length === 0 && (
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 text-[#6C757D] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#0A3D62] mb-2">No emails found</h3>
                  <p className="text-[#6C757D] mb-4">
                    {searchTerm ? 'Try adjusting your search terms' : 'Your emails will appear here'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Compose Email Dialog */}
      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Compose Email</DialogTitle>
            <DialogDescription>
              Send a secure email to patients or colleagues
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="to">To *</Label>
                <Input
                  id="to"
                  type="email"
                  value={composeForm.to}
                  onChange={(e) => setComposeForm({...composeForm, to: e.target.value})}
                  placeholder="recipient@example.com"
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={composeForm.priority} 
                  onValueChange={(value) => setComposeForm({...composeForm, priority: value})}
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cc">CC</Label>
                <Input
                  id="cc"
                  value={composeForm.cc}
                  onChange={(e) => setComposeForm({...composeForm, cc: e.target.value})}
                  placeholder="cc@example.com"
                />
              </div>
              <div>
                <Label htmlFor="bcc">BCC</Label>
                <Input
                  id="bcc"
                  value={composeForm.bcc}
                  onChange={(e) => setComposeForm({...composeForm, bcc: e.target.value})}
                  placeholder="bcc@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={composeForm.subject}
                onChange={(e) => setComposeForm({...composeForm, subject: e.target.value})}
                placeholder="Email subject"
              />
            </div>

            <div>
              <Label htmlFor="body">Message *</Label>
              <Textarea
                id="body"
                value={composeForm.body}
                onChange={(e) => setComposeForm({...composeForm, body: e.target.value})}
                placeholder="Type your message..."
                rows={10}
              />
            </div>

            <div className="flex items-center space-x-2 text-sm text-[#6C757D]">
              <Paperclip className="h-4 w-4" />
              <span>Attachments: {composeForm.attachments.length} files</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendEmail} className="bg-[#0A3D62]">
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Email Dialog */}
      {selectedEmail && (
        <Dialog open={isViewEmailOpen} onOpenChange={setIsViewEmailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedEmail.subject}</DialogTitle>
              <DialogDescription>
                From: {selectedEmail.senderName} &lt;{selectedEmail.senderEmail}&gt;
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-[#0A3D62] text-white">
                      {selectedEmail.senderName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-[#0A3D62]">{selectedEmail.senderName}</p>
                    <p className="text-sm text-[#6C757D]">{selectedEmail.senderEmail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#6C757D]">
                    {new Date(selectedEmail.sentAt).toLocaleString()}
                  </p>
                  <Badge className={getPriorityColor(selectedEmail.priority)}>
                    {selectedEmail.priority} priority
                  </Badge>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="whitespace-pre-wrap text-sm">
                  {selectedEmail.body}
                </div>
              </div>

              {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-[#0A3D62] mb-2">Attachments</h4>
                  <div className="space-y-2">
                    {selectedEmail.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Paperclip className="h-4 w-4 text-[#6C757D]" />
                        <span className="text-sm">{attachment.name}</span>
                        <Button size="sm" variant="outline">Download</Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => replyToEmail(selectedEmail)}>
                <Reply className="h-4 w-4 mr-2" />
                Reply
              </Button>
              <Button variant="outline">
                <Forward className="h-4 w-4 mr-2" />
                Forward
              </Button>
              <Button 
                variant="outline" 
                onClick={() => moveToFolder(selectedEmail.id, 'archive')}
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}