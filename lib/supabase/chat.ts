import { createServerClient } from './client'

export async function createChatConversation(userId: string, agentType: string) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('chat_conversations')
    .insert({ user_id: userId, agent_type: agentType })
    .select()
    .single()
    
  if (error) throw error
  return data
}

export async function saveChatMessage({
  conversationId,
  role,
  content
}: {
  conversationId: string
  role: string
  content: string
}) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      conversation_id: conversationId,
      role,
      content
    })
    .select()
    .single()
    
  if (error) throw error
  return data
}

export async function saveFunctionCall({
  conversationId,
  functionName,
  args,
  result,
  error
}: {
  conversationId: string
  functionName: string
  args: any
  result?: any
  error?: string
}) {
  const supabase = createServerClient()
  
  const { data, error: dbError } = await supabase
    .from('chat_function_calls')
    .insert({
      conversation_id: conversationId,
      function_name: functionName,
      arguments: args,
      result,
      error
    })
    .select()
    .single()
    
  if (dbError) throw dbError
  return data
}

export async function getChatHistory(conversationId: string) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    
  if (error) throw error
  return data
}
