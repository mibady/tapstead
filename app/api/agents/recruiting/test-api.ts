// Test script for recruiting agent API
async function testRecruitingAgentAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/agents/recruiting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'I\'m interested in becoming a service provider. What are the requirements and how do I apply?'
          }
        ],
        context: {
          sessionId: 'test-session'
        }
      })
    })

    const data = await response.json()
    console.log('API Response:', data)
  } catch (error) {
    console.error('API Test Error:', error)
  }
}

// Run test
console.log('Starting API test...')
testRecruitingAgentAPI()