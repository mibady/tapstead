import { beforeAll, afterEach, vi } from "vitest"
import { cleanup } from "@testing-library/react"
import "@testing-library/jest-dom"

// Mock environment variables
beforeAll(() => {
  process.env.NODE_ENV = "test"
  process.env.CAL_COM_API_KEY = "test-cal-com-key"
  process.env.CAL_COM_API_URL = "https://api.cal.com/v1"
  process.env.CAL_COM_USERNAME = "tapstead"
  process.env.RETELL_API_KEY = "test-retell-key"
  process.env.RETELL_PHONE_NUMBER = "+1234567890"
  process.env.RETELL_AGENT_ID = "test-agent-id"
  process.env.RETELL_BOOKING_AGENT_ID = "test-booking-agent"
  process.env.RETELL_SUPPORT_AGENT_ID = "test-support-agent"
  process.env.RETELL_RECRUITING_AGENT_ID = "test-recruiting-agent"
  process.env.OPENAI_API_KEY = "test-openai-key"
  process.env.ANTHROPIC_API_KEY = "test-anthropic-key"
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co"
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key"
})

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Global mocks
global.fetch = vi.fn()

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}))

// Mock Supabase
vi.mock("@/lib/supabase/server", () => ({
  createServerClient: () => ({
    from: () => ({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    }),
  }),
}))

vi.mock("@/lib/supabase/client", () => ({
  createServerClient: () => ({
    from: () => ({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    }),
  }),
}))
