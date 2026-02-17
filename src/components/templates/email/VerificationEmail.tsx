import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailTemplateProps {
  firstName: string;
  url: string;
}

export default function VerificationEmailTemplate({
  firstName,
  url,
}: VerificationEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your InsightLoop account</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Welcome, {firstName}!</Heading>
          <Text style={text}>
            Thanks for signing up for InsightLoop. Please verify your email
            address by clicking the button below.
          </Text>
          <Section style={buttonSection}>
            <Button style={button} href={url}>
              Verify Email Address
            </Button>
          </Section>
          <Text style={text}>
            If the button doesn't work, copy and paste this link into your
            browser:
          </Text>
          <Text style={link}>{url}</Text>
          <Hr style={hr} />
          <Text style={footer}>
            If you didn't create an account, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main: React.CSSProperties = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
  borderRadius: "8px",
};

const heading: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1a1a1a",
  marginBottom: "16px",
};

const text: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#404040",
};

const buttonSection: React.CSSProperties = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button: React.CSSProperties = {
  backgroundColor: "#2563eb",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  padding: "12px 24px",
  display: "inline-block",
};

const link: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#2563eb",
  wordBreak: "break-all",
};

const hr: React.CSSProperties = {
  borderColor: "#e6ebf1",
  margin: "24px 0",
};

const footer: React.CSSProperties = {
  fontSize: "13px",
  lineHeight: "20px",
  color: "#8898aa",
};
