"use client";

import {
  Bell,
  Book,
  BookOpen,
  CreditCard,
  Loader2,
  LogOut,
  Rocket,
  Settings,
  ShieldOff,
  User,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import useLogout from "@/queries/auth/useLogout";
import useLogoutAll from "@/queries/auth/useLogoutAll";

const SidebarSection = dynamic(
  () =>
    import("./SidebarSection").then((mod) => ({ default: mod.SidebarSection })),
  { ssr: false },
);

export function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();
  const { logout, isPending: logoutPending } = useLogout();
  const { logoutAll, isPending: logoutAllPending } = useLogoutAll();

  const isLoggingOut = logoutPending || logoutAllPending;

  function handleLogout() {
    logout(undefined, {
      onSuccess: () => router.push("/auth/login"),
    });
  }

  function handleLogoutAll() {
    logoutAll(undefined, {
      onSuccess: () => router.push("/auth/login"),
    });
  }

  return (
    <div className="px-2 pb-3 space-y-2">
      <div className="mx-4 my-3 h-px bg-neutral-800" />

      <SidebarSection icon={Book} label="Resources" collapsed={collapsed}>
        <a
          href="/"
          className="p-2 rounded-md text-sm text-neutral-300 hover:bg-neutral-800 flex items-center gap-3  cursor-pointer"
        >
          <Rocket size={18} />
          Get started
        </a>
        <a
          href="/"
          className="p-2 rounded-md text-sm text-neutral-300 hover:bg-neutral-800 flex items-center gap-3  cursor-pointer"
        >
          <BookOpen size={18} />
          API docs
        </a>
      </SidebarSection>

      <SidebarSection icon={Settings} label="Settings" collapsed={collapsed}>
        <a
          href="/"
          className="p-2 rounded-md text-sm text-neutral-300 hover:bg-neutral-800 flex items-center gap-3  cursor-pointer"
        >
          <User size={18} />
          Profile
        </a>
        <span className="p-2 rounded-md text-sm text-neutral-300 hover:bg-neutral-800 flex items-center gap-3 opacity-50 cursor-not-allowed">
          <CreditCard size={18} />
          Billing
        </span>
        <a
          href="/"
          className="p-2 rounded-md text-sm text-neutral-300 hover:bg-neutral-800 flex items-center gap-3  cursor-pointer"
        >
          <Bell size={18} />
          Notification preferences
        </a>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full p-2 rounded-md text-sm text-neutral-300 hover:bg-neutral-800 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {logoutPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <LogOut size={18} />
          )}
          Logout
        </button>
        <button
          type="button"
          onClick={handleLogoutAll}
          disabled={isLoggingOut}
          className="w-full p-2 rounded-md text-sm text-neutral-300 hover:bg-neutral-800 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {logoutAllPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <ShieldOff size={18} />
          )}
          {logoutAllPending ? "Logging out all..." : "Logout all devices"}
        </button>
      </SidebarSection>
    </div>
  );
}
