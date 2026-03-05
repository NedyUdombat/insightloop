import { NextResponse } from "next/server";
import type { Environment } from "@/generated/prisma/enums";

/**
 * Validates that the environment from the API key matches the expected environment
 * or that it's not a misuse of production keys in development contexts
 */
export interface EnvironmentValidationOptions {
  /**
   * If true, allows both PRODUCTION and DEVELOPMENT environments
   * If false, only allows the specified environment
   */
  allowBoth?: boolean;
  /**
   * Expected environment (optional)
   */
  expectedEnvironment?: Environment;
  /**
   * If true, warns but doesn't block production API keys in development
   */
  warnOnly?: boolean;
}

export function validateEnvironment(
  apiKeyEnvironment: Environment,
  options: EnvironmentValidationOptions = {},
) {
  const { allowBoth = false, expectedEnvironment, warnOnly = false } = options;

  // If allowBoth is true, accept any environment
  if (allowBoth) {
    return { valid: true };
  }

  // If expectedEnvironment is specified, check if it matches
  if (expectedEnvironment && apiKeyEnvironment !== expectedEnvironment) {
    const message = `Environment mismatch: API key is for ${apiKeyEnvironment} but ${expectedEnvironment} was expected`;

    if (warnOnly) {
      console.warn(message);
      return { valid: true, warning: message };
    }

    return {
      valid: false,
      error: message,
      response: NextResponse.json(
        { error: "Environment mismatch" },
        { status: 403 },
      ),
    };
  }

  return { valid: true };
}

/**
 * Detects potential misuse of production API keys
 * This can be used to alert when production keys are used inappropriately
 */
export function detectProductionKeyMisuse(
  apiKeyEnvironment: Environment,
  context: {
    /**
     * The current runtime environment (from process.env.NODE_ENV)
     */
    nodeEnv?: string;
    /**
     * The request host/origin
     */
    host?: string;
    /**
     * Known development/staging domains
     */
    devDomains?: string[];
  },
): {
  isMisuse: boolean;
  warning?: string;
} {
  const {
    nodeEnv,
    host,
    devDomains = ["localhost", "127.0.0.1", "dev.", "staging."],
  } = context;

  // Check if using production API key in development environment
  if (apiKeyEnvironment === "PRODUCTION") {
    // Check NODE_ENV
    if (nodeEnv === "development") {
      return {
        isMisuse: true,
        warning: "Production API key used in NODE_ENV=development",
      };
    }

    // Check if host is a development domain
    if (host) {
      const isDevHost = devDomains.some((devDomain) =>
        host.includes(devDomain),
      );
      if (isDevHost) {
        return {
          isMisuse: true,
          warning: `Production API key used on development domain: ${host}`,
        };
      }
    }
  }

  // Check if using staging API key in production environment
  if (apiKeyEnvironment === "STAGING") {
    if (
      nodeEnv === "production" &&
      host &&
      !devDomains.some((devDomain) => host.includes(devDomain))
    ) {
      return {
        isMisuse: true,
        warning: "Staging API key used in production environment",
      };
    }
  }

  return { isMisuse: false };
}
