"use client";

import React, { ReactNode } from "react";

type AuthFormProps = {
  title: string;
  description?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthForm({
  title,
  description,
  onSubmit,
  children,
  footer,
}: AuthFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-lg border border-neutral-800 bg-neutral-900 p-6"
    >
      <div className="space-y-1">
        <h2 className="text-lg font-medium">{title}</h2>
        {description && (
          <p className="text-sm text-neutral-400">{description}</p>
        )}
      </div>

      {children}

      {footer && (
        <div className="border-t border-neutral-800 pt-4 text-sm text-neutral-400">
          {footer}
        </div>
      )}
    </form>
  );
}
