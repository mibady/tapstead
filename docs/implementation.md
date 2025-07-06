# Implementation Patterns

## Next.js Patterns
### Server Components
#### Implementation
```typescript
// Server Component (page.tsx)
export default async function Page() {
  const data = await fetchData()
  return <ClientComponent data={data} />
}

// Client Component (client.tsx)
'use client'
export default function ClientComponent({ data }) {
  // Interactive logic
}
```

#### Data Fetching
```typescript
// Server-side data fetching
async function fetchData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

// Cached data fetching
export const revalidate = 3600 // 1 hour
async function fetchCachedData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 }
  })
  return res.json()
}
```

#### Route Handlers
```typescript
// app/api/data/route.ts
export async function GET() {
  const data = await fetchData()
  return Response.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  const result = await processData(body)
  return Response.json(result)
}
```

### Client Components
- Interactive UI elements
- Client-side state
- Form handling
- Real-time updates

## React Patterns
### Component Architecture
- Functional components
- Custom hooks
- Context providers
- Error boundaries

### State Management
- Local state with useState
- Complex state with useReducer
- Shared state with Context
- Server state management

## API Implementation
### Route Handlers
- RESTful endpoints
- Request validation
- Response formatting
- Error handling

### Middleware
- Authentication
- Rate limiting
- Logging
- CORS handling

## Database Integration
### Supabase Client
- Connection configuration
- Query builders
- Real-time subscriptions
- Row level security

### Data Models
- Schema design
- Relationships
- Migrations
- Indexing

## Authentication
### User Management
- Registration flow
- Login process
- Password reset
- Session handling

### OAuth Integration
- Provider setup
- Token management
- User profiles
- Role-based access

## External Services
### Stripe Integration
#### Connect Platform
```typescript
// lib/stripe/connect.ts
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function onboardProvider(providerId: string) {
  const account = await stripe.accounts.create({
    type: 'express',
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true }
    }
  })

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${process.env.HOST}/onboarding/refresh`,
    return_url: `${process.env.HOST}/onboarding/complete`,
    type: 'account_onboarding'
  })

  return accountLink.url
}
```

#### Payment Processing
```typescript
// lib/stripe/payments.ts
async function createBookingPayment(booking: Booking) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer: booking.customerId,
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: booking.serviceName
        },
        unit_amount: booking.amount
      },
      quantity: 1
    }],
    payment_intent_data: {
      application_fee_amount: calculateFee(booking.amount),
      transfer_data: {
        destination: booking.providerId
      }
    },
    success_url: `${process.env.HOST}/booking/success?id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.HOST}/booking/cancel`
  })

  return session
}
```

#### Webhook Handling
```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    switch (event.type) {
      case 'checkout.session.completed':
        await handleSuccessfulPayment(event.data.object)
        break
      case 'account.updated':
        await handleProviderUpdate(event.data.object)
        break
      case 'payment_intent.payment_failed':
        await handleFailedPayment(event.data.object)
        break
    }

    return Response.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err.message)
    return new Response('Webhook Error', { status: 400 })
  }
}
```

### Retell AI Integration
#### Conversation Flow Agent
```typescript
// lib/agents/phone/agent.ts
const agent = new RetellAgent({
  agentId: process.env.RETELL_AGENT_ID,
  apiKey: process.env.RETELL_API_KEY,
  phoneNumber: process.env.RETELL_PHONE_NUMBER,
  conversationFlow: [
    {
      type: 'greeting',
      message: 'Welcome to Tapstead. How can I help you today?'
    },
    {
      type: 'booking',
      collect: ['service', 'date', 'location'],
      actions: {
        onComplete: createBooking,
        onError: handleBookingError
      }
    },
    {
      type: 'emergency',
      priority: 'high',
      route: 'emergency_handler'
    }
  ]
})

// lib/agents/phone/handlers.ts
async function handleCall(call) {
  try {
    const transcript = await agent.transcribe(call)
    const intent = await agent.detectIntent(transcript)
    await agent.executeFlow(intent)
  } catch (error) {
    await agent.transferToHuman(call)
  }
}
```

#### Webhook Integration
```typescript
// app/api/phone/webhook/route.ts
export async function POST(request: Request) {
  const event = await request.json()
  
  switch (event.type) {
    case 'call.started':
      await handleNewCall(event.call)
      break
    case 'call.ended':
      await logCallMetrics(event.call)
      break
    case 'transcription.complete':
      await processTranscript(event.transcript)
      break
  }

  return Response.json({ success: true })
}
```

### Cal.com Integration
#### API Integration
```typescript
// lib/calendar/cal.ts
const calendarClient = new CalAPI({
  apiKey: process.env.CAL_API_KEY
})

async function createBooking(booking: Booking) {
  const event = await calendarClient.bookings.create({
    eventTypeId: getEventTypeId(booking.serviceType),
    start: booking.startTime,
    end: booking.endTime,
    name: booking.customerName,
    email: booking.customerEmail,
    notes: booking.description,
    location: booking.location,
    customInputs: {
      serviceDetails: booking.serviceDetails
    }
  })

  return event
}
```

#### Workflow Automation
```typescript
// lib/calendar/workflows.ts
const workflows = {
  booking_created: [
    {
      type: 'email',
      template: 'booking_confirmation',
      to: ['customer', 'provider']
    },
    {
      type: 'sms',
      template: 'booking_reminder',
      schedule: '24h_before'
    },
    {
      type: 'notification',
      template: 'new_booking',
      to: 'provider'
    }
  ],
  booking_cancelled: [
    {
      type: 'email',
      template: 'cancellation_notice',
      to: ['customer', 'provider']
    },
    {
      type: 'availability',
      action: 'restore'
    }
  ]
}

async function executeWorkflow(type: string, context: any) {
  const steps = workflows[type]
  for (const step of steps) {
    await processWorkflowStep(step, context)
  }
}
```

## CMS Implementation
### Content Management
- MDX processing
- Content structure
- Media handling
- SEO optimization

### Data Flow
- Content fetching
- Caching strategy
- Real-time updates
- Migration tools