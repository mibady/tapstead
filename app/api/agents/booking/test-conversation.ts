import OpenAI from 'openai'
import { AGENT_CONFIGS } from '@/lib/agents/config'
import { conversationalGuidelines } from '@/lib/agents/core/prompts'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const systemPrompt = `You are a friendly booking assistant for Tapstead. ${conversationalGuidelines}

Key Functions:
• Help customers find and book services
• Provide accurate quotes
• Check provider availability
• Handle scheduling
• Answer booking questions

Your Personality:
• Friendly and approachable
• Patient and helpful
• Clear and organized
• Solution-focused
• Proactive in gathering info`

async function testBookingAgent() {
  try {
    console.log('Testing booking agent conversation...\n')
    
    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Hi, I need help booking a house cleaning service' }
      ],
      stream: true
    })

    let fullResponse = ''
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      process.stdout.write(content)
      fullResponse += content
    }

    console.log('\n\nFull response:', fullResponse)
  } catch (error) {
    console.error('Test Error:', error)
  }
}

// Run test
testBookingAgent()