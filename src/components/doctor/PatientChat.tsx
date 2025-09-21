import React, { useState, useEffect, useRef } from 'react';
import { dataStore } from '../../services/dataStore';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from 'sonner';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Video,
  Phone,
  Paperclip,
  Filter,
  Archive,
  Star,
  MoreHorizontal,
  User,
  Calendar,
  FileText,
  Image,
  Smile
} from 'lucide-react';

export default function PatientChat({ doctorId }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, [doctorId]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = () => {
    const doctorConversations = dataStore.getConversationsByDoctor(doctorId);
    const conversationsWithPatients = doctorConversations.map(conv => {
      const patient = dataStore.getUserById(conv.patientId);
      const lastMessage = dataStore.getLastMessage(conv.id);
      return { 
        ...conv, 
        patientName: patient?.name || 'Unknown Patient',
        patientAge: patient?.age || 'N/A',
        lastMessage: lastMessage?.content || 'No messages yet',
        lastMessageTime: lastMessage?.timestamp || conv.createdAt,
        unreadCount: dataStore.getUnreadCount(conv.id, 'doctor')
      };
    });
    
    // Sort by last message time
    conversationsWithPatients.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
    setConversations(conversationsWithPatients);
    
    // Auto-select first conversation if none selected
    if (!selectedConversation && conversationsWithPatients.length > 0) {
      setSelectedConversation(conversationsWithPatients[0]);
    }
  };

  const loadMessages = (conversationId) => {
    const conversationMessages = dataStore.getMessagesByConversation(conversationId);
    setMessages(conversationMessages);
    
    // Mark messages as read
    dataStore.markMessagesAsRead(conversationId, 'doctor');
    loadConversations(); // Refresh to update unread counts
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setIsLoading(true);
    
    try {
      const message = {
        conversationId: selectedConversation.id,
        senderId: doctorId,
        senderType: 'doctor',
        content: newMessage.trim(),
        messageType: 'text',
        timestamp: new Date().toISOString(),
        readBy: [{ userId: doctorId, readAt: new Date().toISOString() }]
      };

      const savedMessage = dataStore.createMessage(message);
      setMessages(prev => [...prev, savedMessage]);
      setNewMessage('');
      
      // Update conversation last message
      dataStore.updateConversation(selectedConversation.id, {
        lastMessageTime: new Date().toISOString(),
        lastMessage: newMessage.trim()
      });
      
      loadConversations();
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    // In a real application, this would open a dialog to select a patient
    toast.info('New conversation feature - select patient from your patient list');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageTime = (timestamp) => {
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
        weekday: 'short',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-[#E8F5E8] text-[#27AE60]';
      case 'archived': return 'bg-gray-100 text-gray-600';
      case 'urgent': return 'bg-[#FADBD8] text-[#E74C3C]';
      default: return 'bg-[#E3F2FD] text-[#0A3D62]';
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = !searchTerm || 
      conv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || conv.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0A3D62]">Patient Communication</h2>
          <p className="text-[#6C757D]">Secure messaging with your patients</p>
        </div>
        <Button onClick={startNewConversation} className="bg-[#0A3D62] hover:bg-[#1E5F8B]">
          <Plus className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>

      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Active Conversations</p>
                <p className="text-2xl font-bold text-[#0A3D62]">
                  {conversations.filter(c => c.status === 'active').length}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-[#0A3D62]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Unread Messages</p>
                <p className="text-2xl font-bold text-[#F39C12]">
                  {conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0)}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-[#F39C12]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Urgent Messages</p>
                <p className="text-2xl font-bold text-[#E74C3C]">
                  {conversations.filter(c => c.status === 'urgent').length}
                </p>
              </div>
              <Star className="h-8 w-8 text-[#E74C3C]" />
            </div>
          </CardContent>
        </Card>

        <Card className="medical-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">Response Time</p>
                <p className="text-2xl font-bold text-[#27AE60]">2.4h</p>
              </div>
              <Clock className="h-8 w-8 text-[#27AE60]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Interface */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="medical-shadow border-0 h-[600px] flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-[#0A3D62]" />
                  Conversations
                </CardTitle>
                <Badge className="bg-[#E3F2FD] text-[#0A3D62]">
                  {filteredConversations.length}
                </Badge>
              </div>
              
              {/* Search and Filter */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6C757D]" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conversations</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-[#E3F2FD] border-l-4 border-[#0A3D62]'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-[#0A3D62] text-white">
                            {conversation.patientName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#0A3D62] truncate">
                            {conversation.patientName}
                          </p>
                          <p className="text-xs text-[#6C757D]">Age: {conversation.patientAge}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge className={getStatusColor(conversation.status)}>
                          {conversation.status}
                        </Badge>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-[#E74C3C] text-white text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-[#6C757D] truncate mb-1">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-[#6C757D]">
                      {formatMessageTime(conversation.lastMessageTime)}
                    </p>
                  </div>
                ))}
              </div>
              
              {filteredConversations.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-[#6C757D] mx-auto mb-3" />
                  <p className="text-[#6C757D]">No conversations found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <Card className="medical-shadow border-0 h-[600px] flex flex-col">
              <CardHeader className="pb-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-[#0A3D62] text-white">
                        {selectedConversation.patientName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{selectedConversation.patientName}</CardTitle>
                      <CardDescription>
                        Age: {selectedConversation.patientAge} • 
                        Last active: {formatMessageTime(selectedConversation.lastMessageTime)}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isDoctor = message.senderType === 'doctor';
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isDoctor ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isDoctor
                            ? 'bg-[#0A3D62] text-white'
                            : 'bg-gray-100 text-[#0A3D62]'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isDoctor ? 'text-blue-200' : 'text-[#6C757D]'
                          }`}>
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 text-[#6C757D] mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[#0A3D62] mb-2">No messages yet</h3>
                    <p className="text-[#6C757D]">Start the conversation with your patient</p>
                  </div>
                )}
              </CardContent>
              
              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      rows={2}
                    />
                  </div>
                  <Button 
                    onClick={sendMessage} 
                    disabled={!newMessage.trim() || isLoading}
                    className="bg-[#0A3D62] hover:bg-[#1E5F8B]"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="medical-shadow border-0 h-[600px] flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-[#6C757D] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#0A3D62] mb-2">Select a Conversation</h3>
                <p className="text-[#6C757D]">Choose a patient conversation to start messaging</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="medical-shadow border-0">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Calendar className="h-6 w-6 mb-2 text-[#0A3D62]" />
              <span>Schedule Follow-up</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <FileText className="h-6 w-6 mb-2 text-[#27AE60]" />
              <span>Share Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Image className="h-6 w-6 mb-2 text-[#9B59B6]" />
              <span>Send Image</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Archive className="h-6 w-6 mb-2 text-[#6C757D]" />
              <span>Archive Chat</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}