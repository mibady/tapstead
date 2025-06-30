import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, User, Loader2, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatWindowProps {
  agentType: 'booking' | 'support' | 'recruiting' | 'analytics'
  initialMessage: string
  className?: string
}

export function ChatWindow({ agentType, initialMessage, className }: ChatWindowProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { agentType },
    initialMessages: [
      { role: 'assistant', content: initialMessage }
    ]
  })

  return (
    <Card className={cn('w-[400px] h-[600px] flex flex-col', className)}>
      <ScrollArea className="flex-1 p-4">
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

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
        </div>
      </form>
    </Card>
  )
}
