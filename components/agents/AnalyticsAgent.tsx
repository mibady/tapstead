'use client'

import { useChat } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MessageCircle, Send, Loader2, User, Bot, BarChart3, TrendingUp, DollarSign, Users, Star, Calendar } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface AnalyticsAgentProps {
  className?: string
}

export function AnalyticsAgent({ className }: AnalyticsAgentProps) {
  const { messages, input, handleSubmit, handleInputChange, isLoading } = useChat({
    api: '/api/agents/analytics',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I'm your business analytics assistant. I can help you analyze revenue, track KPIs, review provider performance, monitor customer trends, and generate comprehensive reports. What business insights would you like to explore?"
      }
    ]
  })

  const [isMinimized, setIsMinimized] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickAnalytics = [
    { icon: DollarSign, text: "Revenue analysis", action: "Show me this month's revenue breakdown and trends" },
    { icon: BarChart3, text: "Top services", action: "What are our top performing services this quarter?" },
    { icon: Users, text: "Provider performance", action: "Show me our top-rated providers and their metrics" },
    { icon: TrendingUp, text: "Growth metrics", action: "Generate a weekly growth report with comparisons" },
    { icon: Star, text: "Agent analytics", action: "How are our AI agents performing this week?" },
    { icon: Calendar, text: "Monthly report", action: "Generate a comprehensive monthly business report" }
  ]

  const containerClass = isExpanded 
    ? "fixed inset-4 z-50" 
    : "fixed bottom-4 right-4 z-50 w-96 max-h-[700px]"

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          size="lg"
          className="rounded-full shadow-lg"
          variant="gradient"
        >
          <BarChart3 className="h-5 w-5 mr-2" />
          Analytics
        </Button>
      </div>
    )
  }

  return (
    <div className={containerClass}>
      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur h-full flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[hsl(173,58%,39%)] to-[hsl(197,37%,24%)] rounded-full flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Business Analytics</CardTitle>
                <p className="text-sm text-muted-foreground">AI Analytics Assistant</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? "⤡" : "⤢"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsMinimized(true)}
              >
                −
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 p-4 pt-0 flex-1 overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-6 h-6 bg-gradient-to-r from-[hsl(173,58%,39%)] to-[hsl(197,37%,24%)] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                )}
                
                <div
                  className={`${isExpanded ? 'max-w-[600px]' : 'max-w-[280px]'} px-3 py-2 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-[hsl(173,58%,39%)] to-[hsl(197,37%,24%)] text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                </div>

                {message.role === 'user' && (
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-3 w-3 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-6 h-6 bg-gradient-to-r from-[hsl(173,58%,39%)] to-[hsl(197,37%,24%)] rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-3 w-3 text-white" />
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Analytics */}
          {messages.length <= 1 && (
            <div className="space-y-2 flex-shrink-0">
              <p className="text-xs text-muted-foreground">Quick analytics:</p>
              <div className={`grid ${isExpanded ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
                {quickAnalytics.map((analytic, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto p-2 justify-start flex-col gap-1"
                    onClick={() => handleInputChange({
                      target: { value: analytic.action }
                    } as React.ChangeEvent<HTMLInputElement>)}
                  >
                    <analytic.icon className="h-3 w-3" />
                    <span className="text-xs">{analytic.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2 flex-shrink-0">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask for specific metrics, reports, or analysis..."
              disabled={isLoading}
              className="flex-1 text-sm"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              size="icon"
              variant="gradient"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>

          {/* Admin Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex-shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">Admin Analytics</span>
            </div>
            <p className="text-xs text-blue-700">
              Real-time business intelligence with secure access to all platform metrics.
              All queries are logged for audit purposes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}