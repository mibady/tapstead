import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'
import { createEnhancedStream } from '../middleware/ai-stream'

type TokenUsage = {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

type StreamOptions = {
  onTokenUsage?: (usage: TokenUsage) => void
  onError?: (error: Error) => void
  maxTokens?: number
}

export class OpenAIWrapper {
  private openai: OpenAIApi
  private tokenUsage: TokenUsage

  constructor(apiKey: string) {
    const config = new Configuration({ apiKey })
    this.openai = new OpenAIApi(config)
    this.tokenUsage = {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    }
  }

  async createChatStream(
    messages: any[],
    functions?: any[],
    options: StreamOptions = {}
  ) {
    try {
      // Calculate approximate token count for messages
      const estimatedTokens = messages.reduce((acc, msg) => {
        // Rough estimation: 1 token ≈ 4 characters
        return acc + Math.ceil((msg.content?.length || 0) / 4)
      }, 0)

      // Check if we're likely to exceed token limit
      if (options.maxTokens && estimatedTokens > options.maxTokens * 0.8) {
        throw new Error('Token limit likely to be exceeded')
      }

      const response = await this.openai.createChatCompletion({
        model: 'gpt-4',
        messages,
        functions,
        stream: true,
        max_tokens: options.maxTokens
      })

      // Create enhanced stream with error handling and token tracking
      const stream = createEnhancedStream(response, {
        onToken: async (token) => {
          this.tokenUsage.completion_tokens++
          this.tokenUsage.total_tokens++
          options.onTokenUsage?.(this.tokenUsage)
        },
        onCompletion: async (completion) => {
          // Final token usage update
          options.onTokenUsage?.(this.tokenUsage)
        }
      })

      return stream
    } catch (error) {
      console.error('OpenAI stream error:', error)
      options.onError?.(error as Error)
      throw error
    }
  }

  // Get current token usage
  getTokenUsage(): TokenUsage {
    return { ...this.tokenUsage }
  }

  // Reset token usage
  resetTokenUsage() {
    this.tokenUsage = {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    }
  }
}
