import { useState, useCallback, useRef, useEffect } from 'react'
import { Message } from 'ai'

type AIState = {
  context: Record<string, any>
  messages: Message[]
  pendingFunctions: Set<string>
  error: Error | null
}

export function useAIState() {
  const [state, setState] = useState<AIState>({
    context: {},
    messages: [],
    pendingFunctions: new Set(),
    error: null
  })

  const functionTimeouts = useRef<Record<string, NodeJS.Timeout>>({})

  // Update context with new key-value pairs
  const updateContext = useCallback((newContext: Record<string, any>) => {
    setState(prev => ({
      ...prev,
      context: { ...prev.context, ...newContext }
    }))
  }, [])

  // Add a message optimistically
  const addMessage = useCallback((message: Message) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }))
  }, [])

  // Start a function call with timeout
  const startFunction = useCallback((functionName: string, timeoutMs = 10000) => {
    setState(prev => ({
      ...prev,
      pendingFunctions: new Set([...prev.pendingFunctions, functionName])
    }))

    // Set timeout for function
    functionTimeouts.current[functionName] = setTimeout(() => {
      setState(prev => ({
        ...prev,
        pendingFunctions: new Set(
          [...prev.pendingFunctions].filter(f => f !== functionName)
        ),
        error: new Error(`Function ${functionName} timed out`)
      }))
    }, timeoutMs)
  }, [])

  // Complete a function call
  const completeFunction = useCallback((functionName: string) => {
    // Clear timeout
    if (functionTimeouts.current[functionName]) {
      clearTimeout(functionTimeouts.current[functionName])
      delete functionTimeouts.current[functionName]
    }

    setState(prev => ({
      ...prev,
      pendingFunctions: new Set(
        [...prev.pendingFunctions].filter(f => f !== functionName)
      )
    }))
  }, [])

  // Set error state
  const setError = useCallback((error: Error | null) => {
    setState(prev => ({ ...prev, error }))
  }, [])

  // Clear all state
  const reset = useCallback(() => {
    // Clear all timeouts
    Object.values(functionTimeouts.current).forEach(clearTimeout)
    functionTimeouts.current = {}

    setState({
      context: {},
      messages: [],
      pendingFunctions: new Set(),
      error: null
    })
  }, [])

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(functionTimeouts.current).forEach(clearTimeout)
    }
  }, [])

  return {
    state,
    updateContext,
    addMessage,
    startFunction,
    completeFunction,
    setError,
    reset
  }
}
