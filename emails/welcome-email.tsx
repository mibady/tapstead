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

interface WelcomeEmailProps {
  name: string
  isProvider?: boolean
}

export const WelcomeEmail = ({ name, isProvider = false }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Tapstead - {isProvider ? "Provider Network" : "Your Home Services Platform"}!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${process.env.NEXT_PUBLIC_APP_URL}/images/tapstead-logo.png`}
          width="150"
          height="50"
          alt="Tapstead"
          style={logo}
        />

        <Heading style={h1}>
          Welcome to Tapstead{isProvider ? " Provider Network" : ""}, {name}!
        </Heading>

        <Text style={text}>
          {isProvider
            ? "Thank you for joining the Tapstead Provider Network! We're excited to help you grow your business with professional home service opportunities."
            : "Thank you for joining Tapstead, your trusted home services platform. We're excited to help you maintain and improve your home with professional, reliable services."}
        </Text>

        <Section style={buttonContainer}>
          <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/${isProvider ? "provider" : "dashboard"}`}>
            {isProvider ? "Go to Provider Dashboard" : "Go to Your Dashboard"}
          </Button>
        </Section>

        <Section style={benefitsSection}>
          <Heading as="h2" style={h2}>
            {isProvider ? "What you can do now:" : "What you can do now:"}
          </Heading>
          <Text style={benefitItem}>
            {isProvider ? "📋 Manage your service requests" : "📅 Book professional home services instantly"}
          </Text>
          <Text style={benefitItem}>
            {isProvider ? "💰 Track your earnings and payments" : "📍 Track your service providers in real-time"}
          </Text>
          <Text style={benefitItem}>
            {isProvider ? "⭐ Build your reputation with reviews" : "💼 Manage all your bookings from your dashboard"}
          </Text>
          <Text style={benefitItem}>
            {isProvider ? "📱 Get instant job notifications" : "💰 Access exclusive member discounts"}
          </Text>
          <Text style={benefitItem}>
            {isProvider ? "🛠️ Access professional tools and resources" : "🚨 Get 24/7 emergency service support"}
          </Text>
        </Section>

        {!isProvider && (
          <Section style={proTipSection}>
            <Text style={proTip}>
              <strong>💡 Pro Tip:</strong> Book your first service within 7 days and get 15% off!
            </Text>
          </Section>
        )}

        <Hr style={hr} />

        <Text style={footer}>
          Need help? Contact us at{" "}
          <Link href="mailto:support@tapstead.com" style={link}>
            support@tapstead.com
          </Link>
          <br />
          Or call our 24/7 hotline: <strong>(555) 123-HELP</strong>
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

const h1 = {
  color: "#2563eb",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
}

const h2 = {
  color: "#1e40af",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "20px 0 10px 0",
}

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "26px",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
}

const button = {
  backgroundColor: "#2563eb",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "15px 30px",
}

const benefitsSection = {
  backgroundColor: "#f8fafc",
  padding: "25px",
  borderRadius: "8px",
  margin: "25px 0",
}

const benefitItem = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "8px 0",
}

const proTipSection = {
  backgroundColor: "#ecfdf5",
  borderLeft: "4px solid #10b981",
  padding: "15px",
  margin: "20px 0",
}

const proTip = {
  color: "#065f46",
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
}

const link = {
  color: "#2563eb",
  textDecoration: "underline",
}

export default WelcomeEmail
