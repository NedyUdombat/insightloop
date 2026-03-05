"use client";

import Tooltip from "@/components/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItemProps = {
  icon: React.ElementType;
  label: string;
  href: string;
  collapsed: boolean;
  disabled?: boolean;
  disabledReason?: string;
};

export function NavItem({
  icon: Icon,
  label,
  href,
  collapsed,
  disabled,
  disabledReason,
}: NavItemProps) {
  const pathname = usePathname();

  const isActive = pathname === href;

  const baseStyles =
    "relative flex items-center gap-3 px-3 py-2 rounded-md text-sm transition";

  const activeStyles = `
    bg-indigo-600/10
    text-indigo-400
    before:absolute
    before:left-0
    before:top-0
    before:h-full
    before:w-[3px]
    before:bg-indigo-500
    before:rounded-r
  `;

  const inactiveStyles =
    "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800";

  const disabledStyles = "text-neutral-600 cursor-not-allowed";

  const item = (
    <div
      className={`
        ${baseStyles}
        ${disabled ? disabledStyles : isActive ? activeStyles : inactiveStyles}
      `}
    >
      <Icon size={18} />
      {!collapsed && <span>{label}</span>}
    </div>
  );

  if (disabled) {
    return (
      <Tooltip content={disabledReason ?? ""} side="top" align="end">
        {item}
      </Tooltip>
    );
  }

  return <Link href={href}>{item}</Link>;
}
