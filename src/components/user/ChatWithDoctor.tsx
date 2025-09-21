import React, { useState, useEffect, useRef } from 'react';
import { dataStore } from '../../services/dataStore';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from 'sonner';
import { 
  MessageSquare, 
  Send, 
  Clock,
  CheckCircle,
  AlertCircle,
  Video,
  Phone,
  Paperclip,
  Calendar,
  FileText,
  User,
  Stethoscope,
  Heart,
  Eye,
  Search,
  Filter
} from 'lucide-react';

export default function ChatWithDoctor({ userId }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
    loadAvailableDoctors();
  }, [userId]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = () => {
    const userConversations = dataStore.getConversationsByPatient(userId);
    const conversationsWithDoctors = userConversations.map(conv => {
      const doctor = dataStore.getUserById(conv.doctorId);
      const lastMessage = dataStore.getLastMessage(conv.id);
      return { 
        ...conv, 
        doctorName: doctor?.name || 'Dr. Unknown',
        doctorSpecialty: doctor?.specialty || 'Ophthalmology',
        lastMessage: lastMessage?.content || 'No messages yet',
        lastMessageTime: lastMessage?.timestamp || conv.createdAt,
        unreadCount: dataStore.getUnreadCount(conv.id, 'user')
      };
    });
    
    // Sort by last message time
    conversationsWithDoctors.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
    setConversations(conversationsWithDoctors);
    
    // Auto-select first conversation if none selected
    if (!selectedConversation && conversationsWithDoctors.length > 0) {
      setSelectedConversation(conversationsWithDoctors[0]);
    }
  };

  const loadAvailableDoctors = () => {
    const doctors = dataStore.getUsersByRole('doctor');
    setAvailableDoctors(doctors);
  };

  const loadMessages = (conversationId) => {
    const conversationMessages = dataStore.getMessagesByConversation(conversationId);
    setMessages(conversationMessages);
    
    // Mark messages as read
    dataStore.markMessagesAsRead(conversationId, 'user');
    loadConversations(); // Refresh to update unread counts
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setIsLoading(true);
    
    try {
      const message = {
        conversationId: selectedConversation.id,
        senderId: userId,
        senderType: 'user',
        content: newMessage.trim(),
        messageType: 'text',
        timestamp: new Date().toISOString(),
        readBy: [{ userId: userId, readAt: new Date().toISOString() }]
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
    if (!selectedDoctor) {
      toast.error('Please select a doctor to start a conversation');
      return;
    }

    const doctor = dataStore.getUserById(selectedDoctor);
    const newConversation = dataStore.createConversation({
      patientId: userId,
      doctorId: selectedDoctor,
      status: 'active',
      createdAt: new Date().toISOString()
    });

    const conversationWithDoctor = {
      ...newConversation,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty || 'Ophthalmology',
      lastMessage: 'Conversation started',
      lastMessageTime: newConversation.createdAt,
      unreadCount: 0
    };

    setConversations([conversationWithDoctor, ...conversations]);
    setSelectedConversation(conversationWithDoctor);
    setMessages([]);
    setSelectedDoctor('');
    toast.success(`Started conversation with ${doctor.name}`);
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
      case 'closed': return 'bg-gray-100 text-gray-600';
      case 'urgent': return 'bg-[#FADBD8] text-[#E74C3C]';
      default: return 'bg-[#E3F2FD] text-[#0A3D62]';
    }
  };

  const quickMessages = [
    "I have a question about my recent test results",
    "I'd like to schedule a follow-up appointment",
    "I'm experiencing some vision changes",
    "Can you clarify my medication instructions?",
    "I need to reschedule my upcoming appointment"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0A3D62]">Chat with Your Doctor</h2>
          <p className="text-[#6C757D]">Secure messaging with your healthcare team</p>
        </div>
      </div>

      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <p className="text-sm font-medium text-[#6C757D]">Response Time</p>
                <p className="text-2xl font-bold text-[#27AE60]">~4h</p>
              </div>
              <Clock className="h-8 w-8 text-[#27AE60]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Conversation */}
      {conversations.length === 0 && (
        <Card className="medical-shadow border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-[#0A3D62]" />
              Start a Conversation
            </CardTitle>
            <CardDescription>
              Select a doctor to begin secure messaging
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDoctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty || 'Ophthalmology'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={startNewConversation} className="bg-[#0A3D62]">
                <MessageSquare className="h-4 w-4 mr-2" />
                Start Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Chat Interface */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="medical-shadow border-0 h-[600px] flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-[#0A3D62]" />
                  Your Conversations
                </CardTitle>
                {conversations.length > 0 && (
                  <Badge className="bg-[#E3F2FD] text-[#0A3D62]">
                    {conversations.length}
                  </Badge>
                )}
              </div>
              
              {conversations.length > 0 && (
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add new doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDoctors
                          .filter(doctor => !conversations.some(conv => conv.doctorId === doctor.id))
                          .map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button size="sm" onClick={startNewConversation}>
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-2">
                {conversations.map((conversation) => (
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
                            <Stethoscope className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#0A3D62] truncate">
                            {conversation.doctorName}
                          </p>
                          <p className="text-xs text-[#6C757D]">{conversation.doctorSpecialty}</p>
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
              
              {conversations.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-[#6C757D] mx-auto mb-3" />
                  <p className="text-[#6C757D]">No conversations yet</p>
                  <p className="text-sm text-[#6C757D] mt-2">Start by selecting a doctor above</p>
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
                        <Stethoscope className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{selectedConversation.doctorName}</CardTitle>
                      <CardDescription>
                        {selectedConversation.doctorSpecialty} • 
                        Last active: {formatMessageTime(selectedConversation.lastMessageTime)}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                    <Button size="sm" variant="outline">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isUser = message.senderType === 'user';
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
                          <div className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className={isUser ? 'bg-[#0A3D62] text-white' : 'bg-[#27AE60] text-white'}>
                                {isUser ? <User className="h-4 w-4" /> : <Stethoscope className="h-4 w-4" />}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`rounded-lg p-4 ${
                              isUser
                                ? 'bg-[#0A3D62] text-white' 
                                : 'bg-gray-50 text-[#0A3D62]'
                            }`}>
                              <div className="whitespace-pre-wrap text-sm">
                                {message.content}
                              </div>
                              <p className={`text-xs mt-1 ${
                                isUser ? 'text-blue-200' : 'text-[#6C757D]'
                              }`}>
                                {formatMessageTime(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {messages.length === 0 && (
                    <div className="text-center py-12">
                      <MessageSquare className="h-16 w-16 text-[#6C757D] mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-[#0A3D62] mb-2">Start the conversation</h3>
                      <p className="text-[#6C757D] mb-4">Send your first message to {selectedConversation.doctorName}</p>
                      
                      {/* Quick Message Templates */}
                      <div className="space-y-2 max-w-md mx-auto">
                        <p className="text-sm font-medium text-[#0A3D62]">Quick messages:</p>
                        {quickMessages.slice(0, 3).map((template, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="w-full text-left justify-start text-xs"
                            onClick={() => setNewMessage(template)}
                          >
                            {template}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
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
                      placeholder="Type your message to your doctor..."
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
                
                {/* Quick Message Templates */}
                {messages.length === 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {quickMessages.slice(0, 3).map((template, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => setNewMessage(template)}
                      >
                        {template}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="medical-shadow border-0 h-[600px] flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-[#6C757D] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#0A3D62] mb-2">Select a Conversation</h3>
                <p className="text-[#6C757D]">Choose a doctor to start messaging</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Help and Guidelines */}
      <Card className="medical-shadow border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2 text-[#0A3D62]" />
            Messaging Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start space-x-3">
              <Clock className="h-6 w-6 text-[#27AE60] mt-1" />
              <div>
                <h4 className="font-medium text-[#0A3D62]">Response Time</h4>
                <p className="text-sm text-[#6C757D]">Doctors typically respond within 4-6 hours during business days</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-[#F39C12] mt-1" />
              <div>
                <h4 className="font-medium text-[#0A3D62]">Emergency Care</h4>
                <p className="text-sm text-[#6C757D]">For urgent medical issues, call emergency services immediately</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FileText className="h-6 w-6 text-[#9B59B6] mt-1" />
              <div>
                <h4 className="font-medium text-[#0A3D62]">Secure Messaging</h4>
                <p className="text-sm text-[#6C757D]">All messages are encrypted and HIPAA compliant</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Eye className="h-6 w-6 text-[#E74C3C] mt-1" />
              <div>
                <h4 className="font-medium text-[#0A3D62]">Privacy Protected</h4>
                <p className="text-sm text-[#6C757D]">Your health information is kept confidential and secure</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}