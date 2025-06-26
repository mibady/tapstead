import { Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from "@react-email/components"

interface QuoteRequestEmailProps {
  quoteData: {
    name: string
    email: string
    phone?: string
    service: string
    property_type?: string
    property_size?: string
    urgency?: string
    description: string
  }
}

export const QuoteRequestEmail = ({ quoteData }: QuoteRequestEmailProps) => (
  <Html>
    <Head />
    <Preview>💰 New Quote Request: {quoteData.service}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>💰 New Quote Request</Heading>

        <Section style={detailsSection}>
          <Heading as="h3" style={h3}>
            👤 Customer Information:
          </Heading>
          <table style={detailsTable}>
            <tr>
              <td style={labelCell}>Name:</td>
              <td style={valueCell}>{quoteData.name}</td>
            </tr>
            <tr>
              <td style={labelCell}>Email:</td>
              <td style={valueCell}>
                <Link href={`mailto:${quoteData.email}`} style={link}>
                  {quoteData.email}
                </Link>
              </td>
            </tr>
            <tr>
              <td style={labelCell}>Phone:</td>
              <td style={valueCell}>{quoteData.phone || "Not provided"}</td>
            </tr>
          </table>
        </Section>

        <Section style={serviceSection}>
          <Heading as="h3" style={h3}>
            🏠 Service Details:
          </Heading>
          <table style={detailsTable}>
            <tr>
              <td style={labelCell}>Service:</td>
              <td style={valueCell}>
                <strong>{quoteData.service}</strong>
              </td>
            </tr>
            {quoteData.property_type && (
              <tr>
                <td style={labelCell}>Property Type:</td>
                <td style={valueCell}>{quoteData.property_type}</td>
              </tr>
            )}
            {quoteData.property_size && (
              <tr>
                <td style={labelCell}>Property Size:</td>
                <td style={valueCell}>{quoteData.property_size}</td>
              </tr>
            )}
            {quoteData.urgency && (
              <tr>
                <td style={labelCell}>Urgency:</td>
                <td style={valueCell}>{quoteData.urgency}</td>
              </tr>
            )}
            <tr>
              <td style={labelCell}>Submitted:</td>
              <td style={valueCell}>{new Date().toLocaleString()}</td>
            </tr>
          </table>
        </Section>

        <Section style={messageSection}>
          <Heading as="h3" style={h3}>
            📝 Project Description:
          </Heading>
          <div style={messageBox}>"{quoteData.description}"</div>
        </Section>

        <Section style={actionRequired}>
          <Text style={actionText}>
            <strong>⏰ Priority Action:</strong> Quote requests should be responded to within 4 hours for best
            conversion rates.
          </Text>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          Respond quickly to win more projects! Fast response times increase quote acceptance by 60%.
        </Text>
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
  color: "#059669",
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
  backgroundColor: "#f0fdf4",
  padding: "20px",
  borderRadius: "8px",
  borderLeft: "4px solid #059669",
  margin: "20px 0",
}

const serviceSection = {
  backgroundColor: "#f8fafc",
  padding: "20px",
  borderRadius: "8px",
  borderLeft: "4px solid #2563eb",
  margin: "20px 0",
}

const detailsTable = {
  width: "100%",
  borderCollapse: "collapse" as const,
}

const labelCell = {
  padding: "8px 0",
  fontWeight: "bold",
  color: "#374151",
  width: "140px",
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
  border: "2px solid #e5e7eb",
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

const hr = {
  borderColor: "#e5e7eb",
  margin: "30px 0",
}

const footer = {
  color: "#6b7280",
  fontSize: "14px",
  textAlign: "center" as const,
  fontStyle: "italic",
}

const link = {
  color: "#2563eb",
  textDecoration: "underline",
}

export default QuoteRequestEmail
