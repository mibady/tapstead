/**
 * HTML Sanitization utility to prevent XSS attacks
 * This is a basic implementation - for production, consider using DOMPurify
 */

// Allowed HTML tags for blog content
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'b', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'code', 'pre'
]

// Allowed attributes for specific tags
const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  'a': ['href', 'title', 'target'],
  'img': ['src', 'alt', 'title', 'width', 'height'],
  'blockquote': ['cite']
}

/**
 * Basic HTML sanitization - removes dangerous elements and attributes
 * TODO: Replace with DOMPurify for production use
 */
export function sanitizeHTML(html: string): string {
  // Create a temporary DOM element
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  
  // Remove all script tags and their content
  const scripts = doc.querySelectorAll('script')
  scripts.forEach(script => script.remove())
  
  // Remove all style tags and their content
  const styles = doc.querySelectorAll('style')
  styles.forEach(style => style.remove())
  
  // Remove dangerous attributes from all elements
  const allElements = doc.querySelectorAll('*')
  allElements.forEach(element => {
    // Remove event handlers and dangerous attributes
    const dangerousAttrs = ['onload', 'onerror', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit', 'onreset', 'onselect', 'onabort', 'onkeydown', 'onkeypress', 'onkeyup', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseup']
    
    // Get all attributes
    const attrs = Array.from(element.attributes)
    attrs.forEach(attr => {
      const attrName = attr.name.toLowerCase()
      
      // Remove dangerous attributes
      if (dangerousAttrs.includes(attrName) || attrName.startsWith('on')) {
        element.removeAttribute(attr.name)
      }
      
      // Remove javascript: URLs
      if (attr.value && attr.value.toLowerCase().includes('javascript:')) {
        element.removeAttribute(attr.name)
      }
    })
    
    // Remove elements not in allowed list
    if (!ALLOWED_TAGS.includes(element.tagName.toLowerCase())) {
      // Replace with text content instead of removing completely
      const textNode = doc.createTextNode(element.textContent || '')
      element.parentNode?.replaceChild(textNode, element)
    }
  })
  
  return doc.body.innerHTML
}

/**
 * Safe alternative - convert HTML to markdown-like plain text
 * Use this for content that doesn't need HTML formatting
 */
export function htmlToSafeText(html: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  
  // Extract text content only
  return doc.body.textContent || ''
}

/**
 * Convert HTML to safe text lines
 * Use this for content that needs line-by-line rendering
 */
export function htmlToSafeLines(html: string): string[] {
  return html.split('\n').filter(line => line.trim() !== '')
}

/**
 * Check if content appears to be safe plain text
 */
export function isSafeText(content: string): boolean {
  // Check for HTML tags, scripts, or dangerous patterns
  const dangerousPatterns = [
    /<script/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<style/i
  ]
  
  return !dangerousPatterns.some(pattern => pattern.test(content))
}