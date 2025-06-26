import { Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from "@react-email/components"

interface ProviderApplicationEmailProps {
  applicationData: {
    business_name: string
    contact_name: string
    email: string
    phone: string
    services: string[]
    experience_years: number
    service_area: string
    business_type: string
  }
}

export const ProviderApplicationEmail = ({ applicationData }: ProviderApplicationEmailProps) => (
  <Html>
    <Head />
    <Preview>👷 New Provider Application: {applicationData.business_name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>👷 New Provider Application</Heading>

        <Section style={businessSection}>
          <Heading as="h3" style={h3}>
            🏢 Business Information:
          </Heading>
          <table style={detailsTable}>
            <tr>
              <td style={labelCell}>Business Name:</td>
              <td style={valueCell}>
                <strong>{applicationData.business_name}</strong>
              </td>
            </tr>
            <tr>
              <td style={labelCell}>Contact Person:</td>
              <td style={valueCell}>{applicationData.contact_name}</td>
            </tr>
            <tr>
              <td style={labelCell}>Email:</td>
              <td style={valueCell}>
                <Link href={`mailto:${applicationData.email}`} style={link}>
                  {applicationData.email}
                </Link>
              </td>
            </tr>
            <tr>
              <td style={labelCell}>Phone:</td>
              <td style={valueCell}>{applicationData.phone}</td>
            </tr>
            <tr>
              <td style={labelCell}>Business Type:</td>
              <td style={valueCell}>{applicationData.business_type}</td>
            </tr>
            <tr>
              <td style={labelCell}>Experience:</td>
              <td style={valueCell}>{applicationData.experience_years} years</td>
            </tr>
            <tr>
              <td style={labelCell}>Service Area:</td>
              <td style={valueCell}>{applicationData.service_area}</td>
            </tr>
          </table>
        </Section>

        <Section style={servicesSection}>
          <Heading as="h3" style={h3}>
            🛠️ Services Offered:
          </Heading>
          <div style={servicesList}>
            {applicationData.services.map((service, index) => (
              <div key={index} style={serviceItem}>
                ✓ {service}
              </div>
            ))}
          </div>
        </Section>

        <Section style={actionRequired}>
          <Text style={actionText}>
            <strong>📋 Next Steps:</strong>
          </Text>
          <Text style={stepText}>
            1. Review application and documents
            <br />
            2. Conduct background check
            <br />
            3. Schedule phone interview
            <br />
            4. Approve or request additional information
          </Text>
        </Section>

        <Section style={urgentNote}>
          <Text style={urgentText}>
            <strong>⏰ Response Time Goal:</strong> Review and respond within 24 hours to maintain high application
            conversion rates.
          </Text>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          Access the full application in the admin panel to review documents and make approval decisions.
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
  color: "#7c3aed",
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

const businessSection = {
  backgroundColor: "#faf5ff",
  padding: "20px",
  borderRadius: "8px",
  borderLeft: "4px solid #7c3aed",
  margin: "20px 0",
}

const servicesSection = {
  backgroundColor: "#f0f9ff",
  padding: "20px",
  borderRadius: "8px",
  borderLeft: "4px solid #0ea5e9",
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

const servicesList = {
  marginTop: "10px",
}

const serviceItem = {
  color: "#059669",
  fontSize: "16px",
  margin: "5px 0",
  fontWeight: "500",
}

const actionRequired = {
  backgroundColor: "#f0fdf4",
  padding: "20px",
  borderRadius: "6px",
  borderLeft: "4px solid #059669",
  margin: "20px 0",
}

const actionText = {
  color: "#065f46",
  fontSize: "16px",
  margin: "0 0 10px 0",
}

const stepText = {
  color: "#065f46",
  fontSize: "14px",
  margin: "0",
  lineHeight: "20px",
}

const urgentNote = {
  backgroundColor: "#fef3c7",
  padding: "15px",
  borderRadius: "6px",
  margin: "20px 0",
}

const urgentText = {
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

export default ProviderApplicationEmail
