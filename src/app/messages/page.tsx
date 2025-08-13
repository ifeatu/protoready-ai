'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MessageSquare,
  Send,
  Search,
  PlusCircle,
  Phone,
  Video,
  MoreHorizontal,
  Paperclip,
  Star,
  Clock,
  CheckCircle,
  Shield,
  Archive,
  Trash2,
  Calendar
} from 'lucide-react'

interface Message {
  id: string
  content: string
  timestamp: string
  sender: 'user' | 'consultant'
  type: 'text' | 'file' | 'booking_confirmation' | 'system'
  fileUrl?: string
  fileName?: string
}

interface Conversation {
  id: string
  participant: {
    name: string
    avatar: string
    title: string
    isOnline: boolean
    verified: boolean
  }
  lastMessage: string
  lastMessageTime: string
  unread: number
  projectTitle: string
  status: 'active' | 'completed' | 'archived'
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    participant: {
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40',
      title: 'Senior Full-Stack Developer',
      isOnline: true,
      verified: true
    },
    lastMessage: 'I\'ve reviewed your code and have some recommendations...',
    lastMessageTime: '2024-01-15T10:30:00Z',
    unread: 2,
    projectTitle: 'React Performance Optimization',
    status: 'active'
  },
  {
    id: '2',
    participant: {
      name: 'Marcus Chen',
      avatar: '/api/placeholder/40',
      title: 'DevOps Specialist',
      isOnline: false,
      verified: true
    },
    lastMessage: 'The deployment pipeline is now configured correctly',
    lastMessageTime: '2024-01-14T16:45:00Z',
    unread: 0,
    projectTitle: 'CI/CD Pipeline Setup',
    status: 'completed'
  },
  {
    id: '3',
    participant: {
      name: 'Elena Rodriguez',
      avatar: '/api/placeholder/40',
      title: 'Performance Engineer',
      isOnline: true,
      verified: true
    },
    lastMessage: 'When would be a good time for our follow-up call?',
    lastMessageTime: '2024-01-13T14:20:00Z',
    unread: 1,
    projectTitle: 'Database Optimization',
    status: 'active'
  }
]

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      content: 'Hi! I\'m excited to work on your React performance optimization project. I\'ve received the project details and will start by reviewing your current codebase.',
      timestamp: '2024-01-15T09:00:00Z',
      sender: 'consultant',
      type: 'text'
    },
    {
      id: '2',
      content: 'Great! I\'ve shared the repository access with you. The main performance issues we\'re seeing are on the dashboard page during peak usage.',
      timestamp: '2024-01-15T09:15:00Z',
      sender: 'user',
      type: 'text'
    },
    {
      id: '3',
      content: 'Perfect. I\'ll focus on the dashboard first. Could you also send me some example performance metrics or user reports?',
      timestamp: '2024-01-15T09:20:00Z',
      sender: 'consultant',
      type: 'text'
    },
    {
      id: '4',
      content: 'performance-report.pdf',
      timestamp: '2024-01-15T09:25:00Z',
      sender: 'user',
      type: 'file',
      fileName: 'performance-report.pdf',
      fileUrl: '/files/performance-report.pdf'
    },
    {
      id: '5',
      content: 'I\'ve reviewed your code and have some recommendations. The main bottlenecks are in the data fetching patterns and component re-renders. I\'ll prepare a detailed analysis for our call tomorrow.',
      timestamp: '2024-01-15T10:30:00Z',
      sender: 'consultant',
      type: 'text'
    }
  ]
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string>('1')
  const [messageInput, setMessageInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const currentConversation = mockConversations.find(c => c.id === selectedConversation)
  const currentMessages = mockMessages[selectedConversation] || []

  const filteredConversations = mockConversations.filter(conversation =>
    conversation.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = () => {
    if (!messageInput.trim()) return
    
    // In real app, send message via API
    console.log('Sending message:', messageInput)
    setMessageInput('')
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const diffTime = today.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar - Conversations List */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedConversation === conversation.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.participant.avatar} alt={conversation.participant.name} />
                    <AvatarFallback>
                      {conversation.participant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.participant.isOnline && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                  {conversation.participant.verified && (
                    <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5">
                      <Shield className="h-2 w-2 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.participant.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {conversation.unread > 0 && (
                        <Badge className="bg-blue-500 text-white text-xs">
                          {conversation.unread}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatDate(conversation.lastMessageTime)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-1">{conversation.participant.title}</p>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate flex-1">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 truncate">
                      {conversation.projectTitle}
                    </span>
                    <Badge className={getStatusColor(conversation.status)}>
                      {conversation.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={currentConversation.participant.avatar} alt={currentConversation.participant.name} />
                      <AvatarFallback>
                        {currentConversation.participant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {currentConversation.participant.isOnline && (
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-medium text-gray-900">
                        {currentConversation.participant.name}
                      </h2>
                      {currentConversation.participant.verified && (
                        <Shield className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-600">{currentConversation.participant.title}</p>
                      <span className="text-xs text-gray-500">•</span>
                      <p className="text-sm text-gray-600">{currentConversation.projectTitle}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4 mr-2" />
                    Video
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white border border-gray-200'
                  } rounded-lg p-3 shadow-sm`}>
                    {message.type === 'file' ? (
                      <div className="flex items-center space-x-2">
                        <Paperclip className="h-4 w-4" />
                        <span className="text-sm">{message.fileName}</span>
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                    
                    <div className={`flex items-center justify-between mt-2 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <span className="text-xs">{formatTime(message.timestamp)}</span>
                      {message.sender === 'user' && (
                        <CheckCircle className="h-3 w-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 relative">
                  <Textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    className="min-h-[40px] max-h-32 resize-none pr-12"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="absolute right-2 bottom-2"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
              <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}