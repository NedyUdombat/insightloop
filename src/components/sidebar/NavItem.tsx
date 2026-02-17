import Link from "next/link";
import Tooltip from "@/components/tooltip";

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
  const item = (
    <div
      className={`
        flex items-center gap-3 px-3 py-2 rounded-md text-sm
        ${
          disabled
            ? "text-neutral-600 cursor-not-allowed"
            : "text-neutral-300 hover:bg-neutral-800"
        }
      `}
    >
      <Icon size={18} />
      {!collapsed && <span>{label}</span>}
    </div>
  );

  if (disabled) {
    return (
      <Tooltip content={disabledReason ?? ""} side={"top"} align={"end"}>
        {item}
      </Tooltip>
    );
  }

  return <Link href={href}>{item}</Link>;
}
