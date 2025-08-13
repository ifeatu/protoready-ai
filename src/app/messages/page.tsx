'use client'

import { useState } from 'react'
import { 
  MessageSquare,
  Send,
  Search,
  Shield,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export default function MessagesPage() {
  const [newMessage, setNewMessage] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">ProtoReady.ai</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              Dashboard
            </Link>
            <Link href="/marketplace" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
              Browse Consultants
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
            <p className="text-gray-600">Communicate with your consultants and project stakeholders</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {/* Mock Conversations */}
                  <div className="p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">SJ</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Sarah Johnson
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          I've reviewed your code and have some suggestions...
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">2h</div>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">MC</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Michael Chen
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          The deployment pipeline is ready for testing
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">5h</div>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">ER</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Emily Rodriguez
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          Mobile app optimization is complete
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">1d</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border shadow-sm h-[600px] flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">SJ</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Sarah Johnson</p>
                      <p className="text-sm text-gray-500">Senior Full-Stack Developer</p>
                    </div>
                  </div>
                  <div className="text-sm text-green-600 flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                    Online
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {/* Received Message */}
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-medium">SJ</span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                        <p className="text-gray-900">
                          Hi! I've completed the initial review of your codebase. Overall, the architecture looks solid, but I have some suggestions for improving security and performance.
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        2 hours ago
                      </p>
                    </div>
                  </div>

                  {/* Sent Message */}
                  <div className="flex items-start space-x-2 flex-row-reverse">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-medium">You</span>
                    </div>
                    <div className="flex-1 text-right">
                      <div className="bg-indigo-600 text-white rounded-lg p-3 max-w-md inline-block">
                        <p>
                          That's great! Could you send me the detailed report? I'm particularly interested in the security recommendations.
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center justify-end">
                        <Clock className="h-3 w-3 mr-1" />
                        1 hour ago
                      </p>
                    </div>
                  </div>

                  {/* Another Received Message */}
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-medium">SJ</span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                        <p className="text-gray-900">
                          Absolutely! I'll send you the complete assessment report within the next hour. The main areas for improvement are:
                          <br /><br />
                          1. Input validation and sanitization<br />
                          2. API rate limiting<br />
                          3. Database query optimization<br />
                          4. Implement proper error handling
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        30 minutes ago
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            // Handle send message
                            setNewMessage('')
                          }
                        }}
                      />
                    </div>
                    <button
                      onClick={() => setNewMessage('')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State for No Conversations */}
          {false && (
            <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start a conversation with a consultant to get help with your project. Our experts are ready to assist you!
              </p>
              <Link href="/marketplace" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                Browse Consultants
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}