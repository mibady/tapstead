// Core agent infrastructure
export { createAgentHandler } from './core/handler'
export { createAuthenticatedAgentHandler, withAgentAuth } from './middleware'
export { AGENT_CONFIGS } from './config'
export * from './core/types'

// Agent tools
export * as RecruitingTools from './recruiting/tools'
export * as BookingTools from './booking/tools'
export * as SupportTools from './support/tools'
export * as AnalyticsTools from './analytics/tools'

// Utility functions
export { logAgentInteraction, logToolExecution } from './core/logging'
export { validateUserAccess, validateToolExecution } from './core/security'