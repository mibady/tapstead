'use client'

import { useChat } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MessageCircle, Send, Loader2, User, Bot } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface RecruitingAgentProps {
  className?: string
}

export function RecruitingAgent({ className }: RecruitingAgentProps) {
  const { messages, input, handleSubmit, handleInputChange, isLoading } = useChat({
    api: '/api/agents/recruiting',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hi! I'm here to help you learn about becoming a Tapstead service provider. I can answer questions about our requirements, benefits, application process, and more. What would you like to know?"
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

  const quickQuestions = [
    "What services can I offer?",
    "How do I get paid?",
    "What are the requirements?",
    "How do I apply?"
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
          <MessageCircle className="h-5 w-5 mr-2" />
          Questions?
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[600px] flex flex-col">
      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[hsl(173,58%,39%)] to-[hsl(197,37%,24%)] rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Join Our Team</CardTitle>
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
          <div className="flex-1 overflow-y-auto space-y-3 max-h-80 pr-2">
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

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Quick questions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((question) => (
                  <Button
                    key={question}
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 justify-start"
                    onClick={() => handleInputChange({
                      target: { value: question }
                    } as React.ChangeEvent<HTMLInputElement>)}
                  >
                    {question}
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
              placeholder="Ask about becoming a provider..."
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

          {/* Footer */}
          <p className="text-xs text-center text-muted-foreground">
            Powered by AI • <span className="text-[hsl(173,58%,39%)]">Tapstead</span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}