import {
  Container,
  Head,
  Heading,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export function VerificationCodeEmail({
  code,
  expires,
}: {
  code: string;
  expires: Date;
}) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Container className="container px-20 font-sans">
          <Heading className="text-xl font-bold mb-4">
            {/* TODO: Update with your app name */}
            Sign in to Convex SaaS
          </Heading>
          <Text className="text-sm">
            Please enter the following code on the sign in page.
          </Text>
          <Section className="text-center">
            <Text className="font-semibold">Verification code</Text>
            <Text className="font-bold text-4xl">{code}</Text>
            <Text>
              (This code is valid for{" "}
              {Math.floor((+expires - Date.now()) / (60 * 60 * 1000))} hours)
            </Text>
          </Section>
        </Container>
      </Tailwind>
    </Html>
  );
}
