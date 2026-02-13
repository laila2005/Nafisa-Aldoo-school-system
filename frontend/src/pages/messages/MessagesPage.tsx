import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Inbox, Users, Search, Filter, MessageSquare, Clock } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';

interface Message {
  id: number;
  from: string;
  subject: string;
  preview: string;
  timestamp: string;
  read: boolean;
  type: 'inbox' | 'sent';
}

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [searchQuery, setSearchQuery] = useState('');

  const mockMessages: Message[] = [
    {
      id: 1,
      from: 'Sarah Williams',
      subject: 'Parent-Teacher Meeting Schedule',
      preview: 'Hello, I would like to schedule a meeting to discuss...',
      timestamp: '2 hours ago',
      read: false,
      type: 'inbox',
    },
    {
      id: 2,
      from: 'John Smith',
      subject: 'Attendance Report Question',
      preview: 'I noticed there was a discrepancy in the attendance...',
      timestamp: '5 hours ago',
      read: true,
      type: 'inbox',
    },
    {
      id: 3,
      from: 'Admin',
      subject: 'Welcome to Nafisa Aldoo School System',
      preview: 'Thank you for joining our school management system...',
      timestamp: 'Yesterday',
      read: true,
      type: 'sent',
    },
    {
      id: 4,
      from: 'Emma Johnson',
      subject: 'Grade Submission Reminder',
      preview: 'This is a reminder that final grades are due...',
      timestamp: '2 days ago',
      read: false,
      type: 'inbox',
    },
  ];

  const filteredMessages = mockMessages.filter(
    (msg) =>
      msg.type === activeTab &&
      (msg.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const unreadCount = mockMessages.filter((msg) => !msg.read && msg.type === 'inbox').length;

  return (
    <Layout user={{ firstName: 'Admin', lastName: 'User', role: 'ADMIN', email: 'admin@school.com' }}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Messages
          </h1>
          <p className="text-gray-600">Communicate with teachers, students, and parents</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <Button
                  variant="primary"
                  fullWidth
                  className="mb-4"
                  icon={<Send className="w-4 h-4" />}
                >
                  Compose Message
                </Button>

                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('inbox')}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      activeTab === 'inbox'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Inbox className="w-5 h-5" />
                    <span className="font-medium">Inbox</span>
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('sent')}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      activeTab === 'sent'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                    <span className="font-medium">Sent</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Messages List */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    {activeTab === 'inbox' ? 'Inbox' : 'Sent Messages'}
                  </CardTitle>
                  <Button variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<Search className="w-4 h-4 text-gray-400" />}
                  />
                </div>

                {/* Messages */}
                <div className="space-y-2">
                  {filteredMessages.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No messages found</p>
                    </div>
                  ) : (
                    filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg border-2 hover:shadow-md transition-all cursor-pointer ${
                          message.read
                            ? 'border-gray-200 bg-white hover:border-blue-300'
                            : 'border-blue-200 bg-blue-50 hover:border-blue-400'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                message.read ? 'bg-gray-200' : 'bg-blue-500'
                              }`}
                            >
                              <span className="text-sm font-bold text-white">
                                {message.from[0]}
                              </span>
                            </div>
                            <div>
                              <p className={`font-semibold ${message.read ? 'text-gray-700' : 'text-blue-900'}`}>
                                {message.from}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                          {!message.read && (
                            <span className="bg-blue-500 w-2 h-2 rounded-full"></span>
                          )}
                        </div>
                        <h3 className={`font-semibold mb-1 ${message.read ? 'text-gray-800' : 'text-blue-900'}`}>
                          {message.subject}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{message.preview}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MessagesPage;
