/**
 * @bhavya/providers — Email Provider Interface
 *
 * Abstract interface for email sending (SMTP, SendGrid, Resend, AWS SES).
 */

export interface EmailProvider {
  id: string;
  name: string;
  type: "smtp" | "sendgrid" | "resend" | "ses" | "console";

  send(email: EmailMessage): Promise<EmailResult>;
  sendBatch(emails: EmailMessage[]): Promise<EmailResult[]>;
  health(): Promise<{ status: string; latencyMs: number }>;
}

export interface EmailMessage {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
  replyTo?: string;
  tags?: Record<string, string>;
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | Uint8Array;
  mimeType: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}
