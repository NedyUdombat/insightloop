import { Resend } from "resend";
import VerificationEmailTemplate from "@/components/templates/email/VerificationEmail";
import PasswordResetTemplate from "@/components/templates/email/PasswordReset";
import React from "react";

const DEFAULT_FROM = "InsightLoop <onboarding@resend.dev>";

type SendEmailParams = {
  to: string;
  token: string;
  firstName: string;
};

let instance: EmailService | null = null;

class EmailService {
  private resend: Resend;
  private appUrl: string;

  private constructor(apiKey: string, appUrl: string) {
    this.resend = new Resend(apiKey);
    this.appUrl = appUrl;
  }

  static getInstance(): EmailService {
    if (instance) return instance;

    const apiKey = process.env.RESEND_API_KEY;
    const appUrl = process.env.APP_URL;

    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }

    if (!appUrl) {
      throw new Error("APP_URL is not set");
    }

    instance = new EmailService(apiKey, appUrl);
    return instance;
  }

  async sendVerificationEmail({
    to,
    firstName,
    token,
  }: SendEmailParams): Promise<void> {
    const verifyUrl = `${this.appUrl}/auth/verify-email?token=${token}`;

    await this.sendEmail({
      to,
      subject: "Welcome to InsightLoop - Please verify your account",
      template: VerificationEmailTemplate({
        firstName,
        url: verifyUrl,
      }),
    });
  }

  async sendPasswordResetEmail({
    to,
    firstName,
    token,
  }: SendEmailParams): Promise<void> {
    const resetUrl = `${this.appUrl}/auth/reset-password?token=${token}`;
    await this.sendEmail({
      to,
      subject: "Reset your password",
      template: PasswordResetTemplate({
        firstName,
        url: resetUrl,
      }),
    });
  }

  private async sendEmail({
    to,
    subject,
    template,
  }: {
    to: string;
    subject: string;
    template: React.ReactNode;
  }): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: DEFAULT_FROM,
      to: [to],
      subject,
      react: template,
    });

    if (error) {
      console.error(`Email send failed: ${error.message}`);
      throw new Error("Failed to send email");
    }
  }
}

export default EmailService;
