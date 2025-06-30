# How to Interact with Tapstead AI Agents

## 🎯 Where to Find AI Agents

### 1. **Homepage** (http://localhost:3000/)
- **Booking Agent**: Floating blue "Book Service" button in bottom-right corner
- **Phone Numbers**: Prominently displayed in hero section
  - Main: `(360) 641-7386` - Click to call instantly
  - Emergency: `(360) 641-7386` - For urgent issues

### 2. **Book Now Page** (/book-now)
- **Booking Agent**: Floating chat assistant for booking help
- Features: Service search, quotes, availability, phone callbacks

### 3. **Support Page** (/support)
- **Support Agent**: Floating "Help & Support" chat button
- Features: Booking status, FAQ search, account help, ticket creation

### 4. **Careers Page** (/careers)
- **Recruiting Agent**: Floating "Questions?" chat button
- Features: Provider onboarding, application help, FAQ answers

### 5. **Become a Pro Page** (/become-pro)
- **Recruiting Agent**: Same as careers page
- Features: Application assistance, requirements info, onboarding guidance

### 6. **Admin Analytics** (/admin/analytics) - *Admin Only*
- **Analytics Agent**: Advanced business intelligence assistant
- Features: Revenue analysis, performance metrics, automated reports

## 🤖 How to Use the AI Agents

### Visual Indicators
- **Floating Buttons**: Look for colorful floating buttons in bottom-right corner
- **Chat Icons**: 💬 calendar, 🆘 help circle, 🤝 message circle, 📊 bar chart
- **Colors**: 
  - Blue gradient = Booking Agent
  - Red/Help = Support Agent  
  - Green = Recruiting Agent
  - Blue/Analytics = Analytics Agent

### Interaction Flow
1. **Click the floating button** - Each page has a different colored agent button
2. **Chat opens** - Professional chat interface with quick action buttons
3. **Ask questions** - Type naturally or click suggested actions
4. **Get help** - AI provides instant responses and can take actions

### Quick Actions Available
- **Booking Agent**: "Check availability", "Get quote", "Request callback", "House cleaning"
- **Support Agent**: "Check booking status", "Report an issue", "Reschedule appointment", "Account help"
- **Recruiting Agent**: "What services can I offer?", "How do I get paid?", "What are requirements?", "How do I apply?"

### Phone Integration
- **Instant Callbacks**: All agents can schedule phone calls
- **Emergency Routing**: Urgent requests get priority phone response
- **24/7 Phone Support**: Call `(360) 641-7386` anytime for AI phone assistant

## 📱 Phone Numbers Throughout Site

### Where You'll See the Numbers
- **Hero Section**: Large prominent display on homepage
- **Footer**: Bottom of every page
- **Contact Page**: Dedicated contact information
- **Support Page**: Help and emergency contact
- **Emergency Services**: Disaster hotline prominently displayed

### What the Numbers Do
- `(360) 641-7386`: Connects to AI phone assistant for booking, quotes, general help
- `(360) 641-7386`: Emergency priority line for urgent issues, disasters

## 🔧 Testing the Agents

### To Test Booking Agent:
1. Go to http://localhost:3000/
2. Look for blue "Book Service" floating button (bottom-right)
3. Click to open chat
4. Try: "I need house cleaning service" or click quick actions

### To Test Support Agent:
1. Go to http://localhost:3000/support
2. Look for red "Help & Support" floating button
3. Click to open chat
4. Try: "Check my booking status" or "I need help"

### To Test Recruiting Agent:
1. Go to http://localhost:3000/careers
2. Look for green "Questions?" floating button  
3. Click to open chat
4. Try: "How do I become a provider?" or "What services can I offer?"

### To Test Phone Features:
1. Use any agent and ask: "Can someone call me back?"
2. Provide your phone number when requested
3. Agent will initiate callback or provide phone support options

## 🎨 Visual Design

### Agent Appearance
- **Minimized**: Small floating button with icon and text
- **Open**: Professional chat window with:
  - Agent branding and colors
  - Message history
  - Quick action buttons
  - Input field for typing
  - Minimize/expand controls

### Responsive Design
- **Desktop**: Full-featured chat window
- **Mobile**: Optimized for touch interaction
- **All screen sizes**: Floating buttons scale appropriately

## 🚀 Advanced Features

### Agent Capabilities
- **Real-time responses**: Instant AI-powered conversations
- **Tool integration**: Agents can search services, check availability, generate quotes
- **Context awareness**: Remembers conversation context
- **Error handling**: Graceful fallbacks if tools fail
- **Phone integration**: Can initiate outbound calls via Retell AI

### Business Integration
- **Supabase database**: All interactions logged for analytics
- **Authentication**: Some features require login (admin agents)
- **Role-based access**: Different capabilities for different user types
- **Real-time data**: Agents access live business data

This guide shows exactly where and how users can interact with your AI agents across the Tapstead platform!