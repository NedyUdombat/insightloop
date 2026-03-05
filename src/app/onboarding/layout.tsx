// app/onboarding/layout.tsx
import type { ReactNode } from "react";
import { OnboardingProvider } from "./OnboardingContext";

export default function Layout({ children }: { children: ReactNode }) {
  return <OnboardingProvider>{children}</OnboardingProvider>;
}
