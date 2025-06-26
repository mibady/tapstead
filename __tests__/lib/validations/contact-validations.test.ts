import { ContactFormSchema, QuoteRequestSchema, sanitizeInput } from '@/lib/validations/contact-validations'

describe('Contact Validations', () => {
  describe('ContactFormSchema', () => {
    it('should validate correct contact form data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        service: 'House Cleaning',
        message: 'I need help with cleaning my house.',
      }

      const result = ContactFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('John Doe')
        expect(result.data.email).toBe('john@example.com')
      }
    })

    it('should reject invalid email addresses', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'not-an-email',
        message: 'This is a test message.',
      }

      const result = ContactFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('valid email')
      }
    })

    it('should reject names with invalid characters', () => {
      const invalidData = {
        name: 'John<script>alert("xss")</script>',
        email: 'john@example.com',
        message: 'This is a test message.',
      }

      const result = ContactFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('letters, spaces, hyphens')
      }
    })

    it('should reject short messages', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Short',
      }

      const result = ContactFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 10 characters')
      }
    })

    it('should accept optional phone number', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message that is long enough.',
      }

      const result = ContactFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate various phone number formats', () => {
      const phoneNumbers = [
        '(555) 123-4567',
        '555-123-4567',
        '555.123.4567',
        '5551234567',
        '+1 555 123 4567',
      ]

      phoneNumbers.forEach(phone => {
        const data = {
          name: 'John Doe',
          email: 'john@example.com',
          phone,
          message: 'This is a test message that is long enough.',
        }

        const result = ContactFormSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('QuoteRequestSchema', () => {
    it('should validate complete quote request data', () => {
      const validData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '555-987-6543',
        service: 'Plumbing Services',
        property_type: 'residential' as const,
        property_size: '2000 sq ft',
        urgency: 'medium' as const,
        description: 'Need to fix a leaky faucet in the kitchen.',
      }

      const result = QuoteRequestSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.service).toBe('Plumbing Services')
        expect(result.data.property_type).toBe('residential')
      }
    })

    it('should require service field', () => {
      const invalidData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        description: 'Need help with something.',
      }

      const result = QuoteRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('service') && issue.message.includes('select a service')
        )).toBe(true)
      }
    })

    it('should validate property type enum', () => {
      const invalidData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        service: 'House Cleaning',
        property_type: 'invalid-type',
        description: 'Need help with cleaning.',
      }

      const result = QuoteRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('property_type')
        )).toBe(true)
      }
    })

    it('should validate urgency enum', () => {
      const validUrgencies = ['low', 'medium', 'high', 'emergency']
      
      validUrgencies.forEach(urgency => {
        const data = {
          name: 'Jane Smith',
          email: 'jane@example.com',
          service: 'Emergency Cleanup',
          urgency,
          description: 'Need urgent help with emergency cleanup.',
        }

        const result = QuoteRequestSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('sanitizeInput', () => {
    it('should remove HTML/script tags', () => {
      const maliciousInput = 'Hello <script>alert("xss")</script> World'
      const sanitized = sanitizeInput(maliciousInput)
      
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).not.toContain('alert')
      expect(sanitized).toBe('Hello  World')
    })

    it('should remove potential SQL injection patterns', () => {
      const sqlInput = "Robert'; DROP TABLE users; --"
      const sanitized = sanitizeInput(sqlInput)
      
      expect(sanitized).not.toContain('DROP')
      expect(sanitized).not.toContain('TABLE')
      expect(sanitized).toBe('Robert')
    })

    it('should preserve safe characters', () => {
      const safeInput = 'John Doe (555) 123-4567 john@example.com'
      const sanitized = sanitizeInput(safeInput)
      
      expect(sanitized).toBe('John Doe (555) 123-4567 john@example.com')
    })

    it('should trim whitespace', () => {
      const inputWithSpaces = '  John Doe  '
      const sanitized = sanitizeInput(inputWithSpaces)
      
      expect(sanitized).toBe('John Doe')
    })

    it('should handle empty/null input', () => {
      expect(sanitizeInput('')).toBe('')
      expect(sanitizeInput(null as any)).toBe(null)
      expect(sanitizeInput(undefined as any)).toBe(undefined)
    })

    it('should remove dangerous characters', () => {
      const dangerousInput = 'John<>Doe&amp;Test'
      const sanitized = sanitizeInput(dangerousInput)
      
      expect(sanitized).not.toContain('<')
      expect(sanitized).not.toContain('>')
      expect(sanitized).not.toContain('&')
    })
  })
})