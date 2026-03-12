"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Bell,
  CreditCard,
  Loader2,
  LogOut,
  ShieldOff,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getInitialsFromName } from "@/lib/utils";
import useLogout from "@/queries/auth/useLogout";
import useLogoutAll from "@/queries/auth/useLogoutAll";

interface UserAvatarDropdownProps {
  user: {
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  };
}

export default function UserAvatarDropdown({ user }: UserAvatarDropdownProps) {
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
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="h-8 w-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-xs font-medium hover:bg-indigo-600/50 transition-colors cursor-pointer"
        >
          {getInitialsFromName(user.email, user.firstName, user.lastName)}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-neutral-900 border border-neutral-800 rounded-md p-1 shadow-lg"
          sideOffset={5}
          align="end"
        >
          <div className="px-3 py-2 text-xs text-neutral-500 border-b border-neutral-800">
            {user.email}
          </div>

          <DropdownMenu.Item
            className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 rounded-md outline-none cursor-pointer"
            onSelect={() => router.push("/settings/profile")}
          >
            <User size={16} />
            Profile
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 rounded-md outline-none cursor-not-allowed opacity-50"
            disabled
          >
            <CreditCard size={16} />
            Billing
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 rounded-md outline-none cursor-pointer"
            onSelect={() => router.push("/settings/notifications")}
          >
            <Bell size={16} />
            Notifications
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-neutral-800 my-1" />

          <DropdownMenu.Item
            className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 rounded-md outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onSelect={handleLogout}
            disabled={isLoggingOut}
          >
            {logoutPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <LogOut size={16} />
            )}
            Logout
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 rounded-md outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onSelect={handleLogoutAll}
            disabled={isLoggingOut}
          >
            {logoutAllPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ShieldOff size={16} />
            )}
            Logout all devices
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
