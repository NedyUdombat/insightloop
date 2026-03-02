"use client";
import * as Toast from "@radix-ui/react-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  return (
    <Toast.Provider swipeDirection="right">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <Toast.Viewport className="ToastViewport fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-[320px] outline-none" />
    </Toast.Provider>
  );
}
