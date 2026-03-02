// app/onboarding/context.tsx
"use client";

import { createContext, useContext, useState } from "react";

interface OnboardingContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: any) {
  const [apiKey, setApiKey] = useState<string | null>(null);

  return (
    <OnboardingContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
