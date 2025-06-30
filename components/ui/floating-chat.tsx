import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChatWindow } from '@/components/ui/chat-window'
import { Calendar, HelpCircle, MessageCircle, BarChart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FloatingChatProps {
  agentType: 'booking' | 'support' | 'recruiting' | 'analytics'
  className?: string
}

const agentConfig = {
  booking: {
    icon: Calendar,
    text: 'Book Service',
    initialMessage: 'Hi! I can help you book any of our services. What can I help you with today?',
    buttonClass: 'bg-blue-500 hover:bg-blue-600'
  },
  support: {
    icon: HelpCircle,
    text: 'Help & Support',
    initialMessage: 'Hello! I'm here to help with any questions or issues you have.',
    buttonClass: 'bg-red-500 hover:bg-red-600'
  },
  recruiting: {
    icon: MessageCircle,
    text: 'Questions?',
    initialMessage: 'Hi! Interested in joining our team? I can help answer any questions about becoming a service provider.',
    buttonClass: 'bg-green-500 hover:bg-green-600'
  },
  analytics: {
    icon: BarChart,
    text: 'Analytics',
    initialMessage: 'Hello! I can help you analyze your business metrics and generate reports.',
    buttonClass: 'bg-blue-500 hover:bg-blue-600'
  }
}

export function FloatingChat({ agentType, className }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const config = agentConfig[agentType]
  const Icon = config.icon

  return (
    <div className={cn('fixed bottom-4 right-4 z-50', className)}>
      {isOpen ? (
        <div className="relative">
          <ChatWindow
            agentType={agentType}
            initialMessage={config.initialMessage}
            className="absolute bottom-16 right-0"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => setIsOpen(false)}
          >
            ×
          </Button>
        </div>
      ) : (
        <Button
          className={cn('flex items-center gap-2', config.buttonClass)}
          onClick={() => setIsOpen(true)}
        >
          <Icon className="h-5 w-5" />
          {config.text}
        </Button>
      )}
    </div>
  )
}
