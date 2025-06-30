'use client'

import { useChat } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MessageCircle, Send, Loader2, User, Bot, HelpCircle, Phone, Mail, AlertCircle } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface SupportAgentProps {
  className?: string
}

export function SupportAgent({ className }: SupportAgentProps) {
  const { messages, input, handleSubmit, handleInputChange, isLoading } = useChat({
    api: '/api/agents/support',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hi! I'm here to help with any questions or issues you have with your Tapstead account or bookings. I can check booking status, help with account issues, or answer general questions. How can I assist you today?"
      }
    ]
  })

  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickHelp = [
    { icon: HelpCircle, text: "Check booking status", action: "Check my booking status" },
    { icon: AlertCircle, text: "Report an issue", action: "I have an issue with my service" },
    { icon: Phone, text: "Reschedule appointment", action: "I need to reschedule my appointment" },
    { icon: Mail, text: "Account help", action: "I need help with my account" }
  ]

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          size="lg"
          className="rounded-full shadow-lg"
          variant="gradient"
        >
          <HelpCircle className="h-5 w-5 mr-2" />
          Help & Support
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[700px] flex flex-col">
      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[hsl(173,58%,39%)] to-[hsl(197,37%,24%)] rounded-full flex items-center justify-center">
                <HelpCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Customer Support</CardTitle>
                <p className="text-sm text-muted-foreground">AI Assistant</p>
              </div>
            </div>
            <div className="flex gap-1">
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

        <CardContent className="flex flex-col gap-4 p-4 pt-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-3 max-h-96 pr-2">
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
                  className={`max-w-[280px] px-3 py-2 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-[hsl(173,58%,39%)] to-[hsl(197,37%,24%)] text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.content}
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

          {/* Quick Help Options */}
          {messages.length <= 1 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Common requests:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickHelp.map((help, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto p-2 justify-start flex-col gap-1"
                    onClick={() => handleInputChange({
                      target: { value: help.action }
                    } as React.ChangeEvent<HTMLInputElement>)}
                  >
                    <help.icon className="h-3 w-3" />
                    <span className="text-xs">{help.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Describe your issue or question..."
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

          {/* Emergency Contact */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Phone className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">Need immediate help?</span>
            </div>
            <p className="text-xs text-blue-700">
              Call our 24/7 AI assistant for all support needs:
              <br />
              <a href="tel:13606417386" className="font-bold text-blue-800 hover:underline">(360) 641-7386</a>
            </p>
          </div>

          {/* Footer */}
          <p className="text-xs text-center text-muted-foreground">
            📞 <a href="tel:13606417386" className="text-blue-600 hover:underline">(360) 641-7386</a> - 24/7 AI Support
          </p>
        </CardContent>
      </Card>
    </div>
  )
}