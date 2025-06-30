'use client'

import { useChat } from 'ai/react'
import { useAIState } from '@/lib/hooks/use-ai-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Loader2, Send } from 'lucide-react'

export function ChatDemo() {
  const {
    state: aiState,
    updateContext,
    addMessage,
    startFunction,
    completeFunction
  } = useAIState()

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      agentType: 'booking',
      context: aiState.context
    },
    onResponse(response) {
      // Handle streaming response
      const reader = response.body?.getReader()
      if (!reader) return

      // Process chunks
      return new Promise((resolve, reject) => {
        function push() {
          reader.read().then(({ done, value }) => {
            if (done) {
              resolve(undefined)
              return
            }
            // Process chunk
            const chunk = new TextDecoder().decode(value)
            console.log('Chunk:', chunk)
            push()
          }).catch(reject)
        }
        push()
      })
    },
    onFinish(message) {
      // Handle completion
      console.log('Chat finished:', message)
    }
  })

  return (
    <Card className="w-[400px] p-4">
      <div className="space-y-4">
        <div className="h-[400px] overflow-y-auto space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-lg px-3 py-2 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {/* Debug panel */}
        <div className="text-sm text-muted-foreground">
          <div>Pending functions: {[...aiState.pendingFunctions].join(', ') || 'none'}</div>
          <div>Context: {JSON.stringify(aiState.context)}</div>
          {aiState.error && (
            <div className="text-red-500">Error: {aiState.error.message}</div>
          )}
        </div>
      </div>
    </Card>
  )
}
