// Re-export the refactored component for backward compatibility
// The original 611-line component has been split into focused, reusable pieces:
// - Custom hook for form state management (use-provider-form.ts)
// - Individual step components (form-steps/)
// - Progress indicator component (form-progress.tsx)
// - Service categories data (data/service-categories.ts)

export { ProApplicationFormRefactored as ProApplicationForm } from "./pro-application-form-refactored"