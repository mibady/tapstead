# Tapstead AI Agent System

## Overview

The Tapstead AI Agent System provides intelligent, conversational interfaces across your platform to enhance user experience and operational efficiency. Built with the Vercel AI SDK and OpenAI, the system includes four specialized agents designed for different user roles and use cases.

## Architecture

### Core Components

- **Agent Handler** (`lib/agents/core/handler.ts`) - Base handler for all agents
- **Authentication** (`lib/agents/middleware.ts`) - Supabase auth integration
- **Security** (`lib/agents/core/security.ts`) - Rate limiting and validation
- **Logging** (`lib/agents/core/logging.ts`) - Analytics and monitoring
- **Configuration** (`lib/agents/config.ts`) - Agent configurations

### Database Integration

- **agent_conversations** - Chat history storage
- **agent_interactions** - Usage analytics and monitoring
- **provider_applications** - Recruiting agent data

## Available Agents

### 1. Recruiting Agent 🤝
**Purpose**: Streamline contractor onboarding and recruitment
**Location**: `/careers` and `/become-pro` pages
**Access Level**: Public (no authentication required)

**Tools**:
- `search_recruiting_faq` - Answer common provider questions
- `get_available_services` - List service categories
- `start_provider_application` - Begin application process
- `check_application_status` - Track application progress
- `get_onboarding_steps` - Provide next steps

**Key Features**:
- Comprehensive FAQ database covering payments, requirements, services
- Direct application initiation through chat
- Integration with existing provider application system
- Onboarding guidance and support

### 2. Booking Agent 📅
**Purpose**: Assist customers with service discovery and booking
**Location**: `/book-now` page
**Access Level**: Public (with optional auth for enhanced features)

**Tools**:
- `search_services` - Find services by name or category
- `get_service_details` - Detailed service information
- `generate_quote` - Calculate price estimates
- `check_provider_availability` - Real-time availability checking
- `create_booking_request` - Initiate booking process
- `get_booking_help` - Booking policies and help

**Key Features**:
- Real-time service search and filtering
- Dynamic pricing based on urgency and complexity
- Provider availability checking
- Booking request creation with customer details
- Comprehensive help system

### 3. Support Agent 🆘
**Purpose**: Provide customer support and issue resolution
**Location**: `/support` page
**Access Level**: Public (with enhanced features for authenticated users)

**Tools**:
- `get_booking_status` - Check booking details and status
- `search_faq` - Search knowledge base and FAQs
- `create_support_ticket` - Escalate complex issues
- `get_service_area_info` - Check service availability by location
- `get_account_info` - Retrieve account details and history

**Key Features**:
- Booking status tracking and updates
- Comprehensive FAQ search across multiple categories
- Support ticket creation with priority levels
- Service area verification
- Account information retrieval

### 4. Analytics Agent 📊
**Purpose**: Business intelligence and data analysis for administrators
**Location**: `/admin/analytics` page
**Access Level**: Admin only (requires authentication and admin role)

**Tools**:
- `query_business_metrics` - Revenue, bookings, customers, providers
- `get_top_performing_services` - Service performance analysis
- `get_provider_performance` - Provider metrics and rankings
- `get_agent_analytics` - AI agent usage and performance
- `generate_business_report` - Comprehensive business reports

**Key Features**:
- Real-time business KPI monitoring
- Service and provider performance analysis
- Agent usage analytics and optimization insights
- Automated report generation with period comparisons
- Secure access with admin-only permissions

## Configuration

### Agent Settings (`lib/agents/config.ts`)

```typescript
{
  name: 'agent_name',
  model: 'gpt-4o-mini',           // OpenAI model
  temperature: 0.7,               // Response creativity
  maxTokens: 2000,               // Response length limit
  requiresAuth: false,           // Authentication requirement
  allowedRoles: ['admin'],       // Role-based access (optional)
  rateLimiting: {
    requests: 20,                // Max requests per window
    windowMs: 60000             // Time window in milliseconds
  }
}
```

### Environment Variables

Required environment variables:
- `OPENAI_API_KEY` - OpenAI API access key
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

## API Endpoints

- `POST /api/agents/recruiting` - Recruiting agent
- `POST /api/agents/booking` - Booking agent
- `POST /api/agents/support` - Support agent
- `POST /api/agents/analytics` - Analytics agent (admin only)

### Request Format

```typescript
{
  messages: [
    { role: 'user', content: 'User message' }
  ],
  context?: {
    sessionId: 'session_id',
    userId: 'user_id',
    // Additional context data
  }
}
```

### Response Format

Streaming response with Server-Sent Events (SSE) containing:
- Agent responses
- Tool execution results
- Error handling
- Conversation context

## Security Features

### Authentication
- Supabase integration for user verification
- JWT token validation
- Role-based access control
- Session management

### Rate Limiting
- Per-user request limits
- Time-window based throttling
- Agent-specific configurations
- Automatic request blocking

### Data Protection
- Input sanitization
- SQL injection prevention
- Sensitive data filtering
- Audit logging

## Monitoring & Analytics

### Agent Interactions Tracking
- Tool usage frequency
- Response times
- Success/failure rates
- User satisfaction metrics

### Conversation Logging
- Complete chat histories
- Context preservation
- User journey tracking
- Performance optimization data

### Business Intelligence
- Agent ROI analysis
- Customer engagement metrics
- Operational efficiency gains
- Support load reduction

## Usage Examples

### Basic Agent Integration

```typescript
import { BookingAgent } from '@/components/agents/BookingAgent'

export default function BookingPage() {
  return (
    <div>
      <BookingFlow />
      <BookingAgent />
    </div>
  )
}
```

### Custom Agent Implementation

```typescript
import { createAgentHandler, AGENT_CONFIGS } from '@/lib/agents'

const customAgent = createAgentHandler(
  AGENT_CONFIGS.custom,
  systemPrompt,
  tools
)

export const POST = customAgent
```

## Deployment Considerations

### Database Setup
1. Run database migrations for agent tables
2. Set up proper indexes for performance
3. Configure row-level security policies

### Performance Optimization
- Enable caching for frequently accessed data
- Implement connection pooling
- Monitor API rate limits
- Set up CDN for static assets

### Monitoring Setup
- Configure logging aggregation
- Set up performance alerts
- Implement health checks
- Monitor token usage and costs

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify Supabase configuration
   - Check JWT token validity
   - Validate user roles and permissions

2. **Rate Limiting**
   - Review rate limit configurations
   - Implement user feedback for limits
   - Consider premium tier options

3. **Tool Execution Failures**
   - Check database connectivity
   - Validate tool parameters
   - Review error logs and stack traces

4. **Performance Issues**
   - Monitor response times
   - Optimize database queries
   - Consider model selection

### Debug Mode

Enable debug logging by setting environment variable:
```bash
DEBUG_AGENTS=true
```

## Future Enhancements

### Planned Features
- Multi-language support
- Voice interface integration
- Advanced analytics dashboard
- Custom agent creation tools
- Integration with external services

### Scalability Considerations
- Redis for session storage
- Load balancing for high traffic
- Database sharding strategies
- Microservices architecture

## Support

For technical support and questions:
- Check logs in `agent_interactions` table
- Review error messages in console
- Contact development team with specific error details
- Reference this documentation for configuration issues