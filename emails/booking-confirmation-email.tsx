import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface BookingConfirmationEmailProps {
  booking: {
    id: string
    service_title: string
    scheduled_date: string
    scheduled_time: string
    address: string
    estimated_price: number
  }
}

export const BookingConfirmationEmail = ({ booking }: BookingConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Booking Confirmed: {booking.service_title} - {booking.scheduled_date}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${process.env.NEXT_PUBLIC_APP_URL}/images/tapstead-logo.png`}
          width="150"
          height="50"
          alt="Tapstead"
          style={logo}
        />

        <Section style={confirmationBanner}>
          <Heading style={bannerHeading}>✅ Booking Confirmed!</Heading>
          <Text style={bannerText}>Your service has been successfully scheduled</Text>
        </Section>

        <Section style={detailsSection}>
          <Heading as="h2" style={h2}>
            📋 Booking Details:
          </Heading>

          <table style={detailsTable}>
            <tr>
              <td style={labelCell}>Service:</td>
              <td style={valueCell}>{booking.service_title}</td>
            </tr>
            <tr>
              <td style={labelCell}>Date:</td>
              <td style={valueCell}>{booking.scheduled_date}</td>
            </tr>
            <tr>
              <td style={labelCell}>Time:</td>
              <td style={valueCell}>{booking.scheduled_time}</td>
            </tr>
            <tr>
              <td style={labelCell}>Address:</td>
              <td style={valueCell}>{booking.address}</td>
            </tr>
            <tr>
              <td style={labelCell}>Estimated Price:</td>
              <td style={{ ...valueCell, fontSize: "18px", fontWeight: "bold" }}>${booking.estimated_price}</td>
            </tr>
            <tr>
              <td style={labelCell}>Booking ID:</td>
              <td style={{ ...valueCell, fontFamily: "monospace" }}>#{booking.id}</td>
            </tr>
          </table>
        </Section>

        <Section style={importantNote}>
          <Text style={noteText}>
            <strong>📞 Important:</strong> Your service provider will contact you 30 minutes before arrival.
          </Text>
        </Section>

        <Section style={buttonContainer}>
          <Button style={primaryButton} href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings/${booking.id}`}>
            Track Your Service
          </Button>
          <Button style={emergencyButton} href={`${process.env.NEXT_PUBLIC_APP_URL}/emergency`}>
            Emergency Contact
          </Button>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          Questions about your booking? Contact us at{" "}
          <Link href="mailto:bookings@tapstead.com" style={link}>
            bookings@tapstead.com
          </Link>
          <br />
          24/7 Emergency Hotline: <strong>(555) 123-HELP</strong>
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

const logo = {
  margin: "0 auto",
  display: "block",
}

const confirmationBanner = {
  backgroundColor: "#ecfdf5",
  border: "2px solid #10b981",
  borderRadius: "8px",
  padding: "20px",
  textAlign: "center" as const,
  margin: "30px 0",
}

const bannerHeading = {
  color: "#065f46",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
}

const bannerText = {
  color: "#065f46",
  fontSize: "16px",
  margin: "10px 0 0 0",
}

const h2 = {
  color: "#1e40af",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "20px 0 10px 0",
}

const detailsSection = {
  backgroundColor: "#f8fafc",
  padding: "25px",
  borderRadius: "8px",
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
  width: "140px",
}

const valueCell = {
  padding: "8px 0",
  color: "#1f2937",
}

const importantNote = {
  backgroundColor: "#fef3c7",
  borderLeft: "4px solid #f59e0b",
  padding: "15px",
  margin: "20px 0",
}

const noteText = {
  color: "#92400e",
  fontSize: "16px",
  margin: "0",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
}

const primaryButton = {
  backgroundColor: "#2563eb",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "15px 30px",
  marginRight: "10px",
}

const emergencyButton = {
  backgroundColor: "#dc2626",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "15px 30px",
}

const hr = {
  borderColor: "#e5e7eb",
  margin: "30px 0",
}

const footer = {
  color: "#6b7280",
  fontSize: "14px",
  textAlign: "center" as const,
}

const link = {
  color: "#2563eb",
  textDecoration: "underline",
}

export default BookingConfirmationEmail
