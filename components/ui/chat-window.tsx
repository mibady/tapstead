import { useChat } from '@ai-sdk/react'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, User, Loader2, Send, AlertCircle, Calendar, PhoneCall, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface QuickAction {
  label: string
  action: string
}

interface ChatWindowProps {
  agentType: 'booking' | 'support' | 'recruiting' | 'analytics'
  initialMessage: string
  className?: string
}

export function ChatWindow({ agentType, initialMessage, className }: ChatWindowProps) {
  const [error, setError] = useState<string | null>(null)

  const quickActions = useMemo<QuickAction[]>(() => {
    if (agentType === 'booking') {
      return [
        { label: 'Check availability', action: 'I want to check service availability' },
        { label: 'Get quote', action: 'I need a quote for services' },
        { label: 'Request callback', action: 'Can someone call me back?' },
        { label: 'House cleaning', action: 'I want to book house cleaning service' }
      ]
    }
    return []
  }, [agentType])

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: '/api/chat',
    body: { agentType },
    initialMessages: [
      { role: 'assistant', content: initialMessage }
    ],
    onError: (error) => {
      console.error('Chat error:', error)
      setError(error.message || 'Failed to send message')
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000)
    }
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    try {
      await handleSubmit(e)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Failed to send message')
      }
    }
  }

  return (
    <Card className={cn('w-[400px] h-[600px] flex flex-col', className)}>
      <ScrollArea className="flex-1 p-4">
        {quickActions.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {quickActions.map((action, i) => (
              <Button
                key={i}
                variant="outline"
                className="h-auto py-2 px-3 flex gap-2 items-center justify-start text-sm"
                onClick={() => {
                  const event = {
                    preventDefault: () => {},
                    currentTarget: {
                      elements: new Map([
                        ['message', { value: action.action }]
                      ])
                    }
                  } as unknown as React.FormEvent<HTMLFormElement>
                  handleSubmit(event)
                }}
              >
                {i === 0 && <Calendar className="h-4 w-4" />}
                {i === 1 && <Bot className="h-4 w-4" />}
                {i === 2 && <PhoneCall className="h-4 w-4" />}
                {i === 3 && <Home className="h-4 w-4" />}
                {action.label}
              </Button>
            ))}
          </div>
        )}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {messages.map((message, i) => (
          <div
            key={i}
            className={cn(
              'flex gap-3 mb-4',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
            )}
            <div
              className={cn(
                'rounded-lg px-3 py-2 max-w-[80%]',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              {message.content}
            </div>
            {message.role === 'user' && (
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
      </ScrollArea>

      <form onSubmit={onSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </Card>
  )
}