"use client";

type Rule = {
  id: string;
  label: string;
  test: (password: string) => boolean;
};

export const PASSWORD_RULES: Rule[] = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (p) => p.length >= 8,
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    test: (p) => /[a-z]/.test(p),
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: "number",
    label: "One number",
    test: (p) => /[0-9]/.test(p),
  },
  {
    id: "special",
    label: "One special character",
    test: (p) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p),
  },
];

export function isPasswordStrong(password: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

export function PasswordStrength({ password }: { password: string }) {
  // 🔑 Hide completely until user types something
  if (!password || password.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {PASSWORD_RULES.map((rule) => {
        const checked = rule.test(password);

        return (
          <label key={rule.id} className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={checked}
              disabled
              className="h-3.5 w-3.5 pointer-events-none
                         border-neutral-700 bg-neutral-950
                         checked:bg-white checked:border-white
                         accent-white disabled:opacity-100"
            />
            <span className={checked ? "text-neutral-200" : "text-neutral-500"}>
              {rule.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}
