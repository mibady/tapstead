import { Body, Container, Head, Heading, Html, Link, Preview, Section, Text } from "@react-email/components"

interface ContactNotificationEmailProps {
  contactData: {
    name: string
    email: string
    phone?: string
    service?: string
    message: string
  }
}

export const ContactNotificationEmail = ({ contactData }: ContactNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>🔔 New Contact Form: {contactData.service || "General Inquiry"}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🔔 New Contact Form Submission</Heading>

        <Section style={detailsSection}>
          <table style={detailsTable}>
            <tr>
              <td style={labelCell}>Name:</td>
              <td style={valueCell}>{contactData.name}</td>
            </tr>
            <tr>
              <td style={labelCell}>Email:</td>
              <td style={valueCell}>
                <Link href={`mailto:${contactData.email}`} style={link}>
                  {contactData.email}
                </Link>
              </td>
            </tr>
            <tr>
              <td style={labelCell}>Phone:</td>
              <td style={valueCell}>{contactData.phone || "Not provided"}</td>
            </tr>
            <tr>
              <td style={labelCell}>Service:</td>
              <td style={valueCell}>{contactData.service || "General inquiry"}</td>
            </tr>
            <tr>
              <td style={labelCell}>Submitted:</td>
              <td style={valueCell}>{new Date().toLocaleString()}</td>
            </tr>
          </table>
        </Section>

        <Section style={messageSection}>
          <Heading as="h3" style={h3}>
            💬 Message:
          </Heading>
          <div style={messageBox}>"{contactData.message}"</div>
        </Section>

        <Section style={actionRequired}>
          <Text style={actionText}>
            <strong>⏰ Action Required:</strong> Please respond within 2 hours for optimal customer experience.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
}

const h1 = {
  color: "#dc2626",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0",
}

const h3 = {
  color: "#1e40af",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "20px 0 10px 0",
}

const detailsSection = {
  backgroundColor: "#f8fafc",
  padding: "25px",
  borderRadius: "8px",
  borderLeft: "4px solid #2563eb",
  margin: "25px 0",
}

const detailsTable = {
  width: "100%",
  borderCollapse: "collapse" as const,
}

const labelCell = {
  padding: "8px 0",
  fontWeight: "bold",
  color: "#374151",
  width: "120px",
}

const valueCell = {
  padding: "8px 0",
  color: "#1f2937",
}

const messageSection = {
  margin: "25px 0",
}

const messageBox = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "6px",
  borderLeft: "4px solid #2563eb",
  fontStyle: "italic",
  color: "#374151",
}

const actionRequired = {
  backgroundColor: "#fef3c7",
  padding: "15px",
  borderRadius: "6px",
  margin: "20px 0",
}

const actionText = {
  color: "#92400e",
  fontSize: "16px",
  margin: "0",
}

const link = {
  color: "#2563eb",
  textDecoration: "underline",
}

export default ContactNotificationEmail
