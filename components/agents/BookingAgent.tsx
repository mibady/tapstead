'use client'

import { useChat } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MessageCircle, Send, Loader2, User, Bot, Calendar, DollarSign, Phone } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface BookingAgentProps {
  className?: string
  initialService?: string
}

export function BookingAgent({ className, initialService }: BookingAgentProps) {
  const [retryTimeout, setRetryTimeout] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload
  } = useChat({
    api: '/api/agents/booking',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: initialService 
          ? `I can help you book ${initialService} services. Let me help you get a quote, check availability, and schedule your service. What do you need help with?`
          : "I can help you find services, get quotes, check availability, and schedule appointments. What type of service do you need?"
      }
    ],
    onError: (error) => {
      console.error('Chat error:', error)
      let message = 'Failed to send message'
      
      try {
        const errorData = JSON.parse(error.message)
        message = errorData.error || errorData.details || message
        
        // Handle rate limiting
        if (errorData.error === 'Too many requests') {
          message = 'Too many messages. Please wait a moment before trying again.'
          setRetryTimeout(60) // 60 seconds timeout
        }
      } catch (e) {
        message = error.message || message
      }
      
      setErrorMessage(message)
      
      // Clear error after 5 seconds unless it's a rate limit error
      if (!message.includes('Too many messages')) {
        setTimeout(() => setErrorMessage(null), 5000)
      }
    },
    onFinish: () => {
      if (errorMessage && !errorMessage.includes('Too many messages')) {
        setErrorMessage(null)
      }
    }
  })

  // Handle retry timeout countdown
  useEffect(() => {
    if (retryTimeout === null) return

    const interval = setInterval(() => {
      setRetryTimeout(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(interval)
          setErrorMessage(null)
          return null
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [retryTimeout])

  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const quickActions = [
    { icon: Calendar, text: "Check availability", action: "Check availability for this week" },
    { icon: DollarSign, text: "Get quote", action: "I need a price quote" },
    { icon: Phone, text: "Request callback", action: "I'd like someone to call me back" },
    { icon: MessageCircle, text: "House cleaning", action: "I need house cleaning service" }
  ]

  const handleQuickAction = async (action: string) => {
    if (retryTimeout !== null) return
    
    try {
      await handleInputChange({ target: { value: action } } as React.ChangeEvent<HTMLInputElement>)
      await handleSubmit({
        preventDefault: () => {},
        currentTarget: { elements: [{ value: action }] }
      } as unknown as React.FormEvent<HTMLFormElement>)
    } catch (error) {
      console.error('Quick action error:', error)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (retryTimeout !== null) return
    
    try {
      await handleSubmit(e)
    } catch (error) {
      console.error('Submit error:', error)
    }
  }

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
          Book Service
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
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Book Service</CardTitle>
                <p className="text-sm text-muted-foreground">24/7 Support</p>
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
          {errorMessage && (
            <Alert variant="destructive" className="mb-2">
              <AlertDescription>
                {errorMessage}
                {retryTimeout !== null && (
                  <span className="ml-1">({retryTimeout}s)</span>
                )}
              </AlertDescription>
            </Alert>
          )}

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

          {messages.length <= 1 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Quick actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto p-2 justify-start flex-col gap-1"
                    onClick={() => handleQuickAction(action.action)}
                    disabled={isLoading || retryTimeout !== null}
                  >
                    <action.icon className="h-3 w-3" />
                    <span className="text-xs">{action.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder={retryTimeout !== null ? `Please wait ${retryTimeout}s...` : "Describe what service you need..."}
              disabled={isLoading || retryTimeout !== null}
              className="flex-1 text-sm"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim() || retryTimeout !== null}
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

          <div className="text-xs text-center text-muted-foreground space-y-1">
            <p>📞 <a href="tel:13606417386" className="text-blue-600 hover:underline">(360) 641-7386</a> - 24/7 Support</p>
            <p className="text-[hsl(173,58%,39%)]">Licensed • Insured • Background Checked</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}