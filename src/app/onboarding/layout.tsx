// app/onboarding/layout.tsx
import { OnboardingProvider } from "./OnboardingContext";

export default function Layout({ children }: any) {
  return <OnboardingProvider>{children}</OnboardingProvider>;
}
