# Communication System PRP

## Goal
Implement comprehensive communication system with Retell AI for voice, Resend for email delivery, and Cal.com for scheduling notifications.

## Why
- Enable automated voice communications
- Deliver transactional emails
- Manage booking notifications
- Track communication status
- Ensure reliable delivery

## What
1. Voice System:
   - Retell AI integration
   - Call tracking
   - Voice transcription
   - Analytics

2. Email System:
   - Resend integration
   - Template management
   - Delivery tracking
   - Analytics

### Success Criteria
- [ ] Voice calls operational
- [ ] Email delivery working
- [ ] Analytics tracking active
- [ ] Templates configured

## Implementation

### Environment Variables
```env
# Retell AI Configuration
RETELL_API_KEY="retellai_key_93f02aedd151ced59be2dd9cc34c"
RETELL_AGENT_ID="agent_b4804e847091a11f9d16cec43b"
RETELL_PHONE_NUMBER="13606417386"
TAPSTEAD_MAIN_NUMBER="(360) 641-7386"

# Resend Configuration
RESEND_API_KEY="re_EYwMGbdy_QHNDn3NNQomiDVYwjCL5TgsB"
```

### Database Schema (Supabase)
```sql
-- Communications
create table communications (
  id uuid primary key default gen_random_uuid(),
  type communication_type not null,
  status communication_status not null,
  customer_id uuid references auth.users(id),
  provider_id uuid references auth.users(id),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Voice calls
create table voice_calls (
  id uuid primary key default gen_random_uuid(),
  communication_id uuid references communications(id),
  retell_call_id text not null,
  duration interval,
  transcript text,
  recording_url text,
  status call_status not null,
  created_at timestamptz default now()
);

-- Emails
create table emails (
  id uuid primary key default gen_random_uuid(),
  communication_id uuid references communications(id),
  template_id text not null,
  recipient text not null,
  subject text not null,
  status email_status not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table communications enable row level security;
alter table voice_calls enable row level security;
alter table emails enable row level security;

-- RLS Policies
create policy "Users can view own communications"
  on communications for select
  using (
    auth.uid() = customer_id or 
    auth.uid() = provider_id
  );
```

### Retell AI Integration
```typescript
// lib/voice/client.ts
import { RetellClient } from '@retell-ai/sdk';

const retellClient = new RetellClient({
  apiKey: process.env.RETELL_API_KEY!,
  agentId: process.env.RETELL_AGENT_ID!
});

export class VoiceSystem {
  async initiateCall(
    customerId: string,
    phoneNumber: string
  ): Promise<string> {
    // Create communication record
    const { data: communication } = await supabase
      .from('communications')
      .insert({
        type: 'voice_call',
        status: 'initiating',
        customer_id: customerId
      })
      .select()
      .single();

    // Start Retell call
    const call = await retellClient.calls.create({
      phoneNumber,
      agentId: process.env.RETELL_AGENT_ID!,
      metadata: {
        communicationId: communication.id,
        customerId
      }
    });

    // Record call details
    await supabase
      .from('voice_calls')
      .insert({
        communication_id: communication.id,
        retell_call_id: call.id,
        status: 'initiated'
      });

    return communication.id;
  }

  async handleCallWebhook(
    event: RetellWebhookEvent
  ): Promise<void> {
    const { call_id, event_type, transcript } = event;

    // Update call status
    await supabase
      .from('voice_calls')
      .update({
        status: this.mapRetellStatus(event_type),
        transcript: transcript?.text,
        duration: event.duration
      })
      .eq('retell_call_id', call_id);
  }
}
```

### Resend Integration
```typescript
// lib/email/client.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailSystem {
  async sendEmail(
    template: EmailTemplate,
    recipient: string,
    data: Record<string, any>
  ): Promise<string> {
    // Create communication record
    const { data: communication } = await supabase
      .from('communications')
      .insert({
        type: 'email',
        status: 'sending',
        customer_id: data.customerId
      })
      .select()
      .single();

    // Send via Resend
    const { data: email } = await resend.emails.send({
      from: 'notifications@tapstead.com',
      to: recipient,
      subject: this.getSubject(template, data),
      react: await this.renderTemplate(template, data)
    });

    // Record email details
    await supabase
      .from('emails')
      .insert({
        communication_id: communication.id,
        template_id: template,
        recipient,
        status: 'sent',
        metadata: { resend_id: email.id }
      });

    return communication.id;
  }

  async handleEmailWebhook(
    event: ResendWebhookEvent
  ): Promise<void> {
    const { email_id, type } = event;

    // Update email status
    await supabase
      .from('emails')
      .update({
        status: this.mapResendStatus(type)
      })
      .eq('metadata->resend_id', email_id);
  }
}
```

### Email Templates
```typescript
// lib/email/templates.ts
export const emailTemplates = {
  BOOKING_CONFIRMATION: {
    subject: 'Your Tapstead Booking Confirmation',
    template: BookingConfirmationEmail
  },
  BOOKING_REMINDER: {
    subject: 'Reminder: Your Upcoming Service',
    template: BookingReminderEmail
  },
  PROVIDER_ASSIGNED: {
    subject: 'Your Service Provider Has Been Assigned',
    template: ProviderAssignedEmail
  }
};
```

### Validation Loop

#### Level 1: Syntax & Style
```bash
npm run lint
npm run typecheck
```

#### Level 2: Unit Tests
```typescript
describe('Communication System', () => {
  test('initiates voice call', async () => {
    const result = await voiceSystem.initiateCall(
      'customer_123',
      '+1234567890'
    );
    expect(result).toBeDefined();
  });

  test('sends email', async () => {
    const result = await emailSystem.sendEmail(
      'BOOKING_CONFIRMATION',
      'user@example.com',
      { bookingId: '123' }
    );
    expect(result).toBeDefined();
  });
});
```

#### Level 3: Integration Tests
```bash
# Test voice call
curl -X POST http://localhost:3000/api/communications/voice \
  -H "Content-Type: application/json" \
  -d '{"customerId": "cus_123", "phoneNumber": "+1234567890"}'

# Test email
curl -X POST http://localhost:3000/api/communications/email \
  -H "Content-Type: application/json" \
  -d '{"template": "BOOKING_CONFIRMATION", "recipient": "test@example.com"}'
```

## Final Checklist
- [ ] Retell AI integration tested
- [ ] Resend integration working
- [ ] Email templates created
- [ ] Webhooks configured
- [ ] Database schema created
- [ ] RLS policies active
- [ ] Error handling complete
- [ ] Documentation updated