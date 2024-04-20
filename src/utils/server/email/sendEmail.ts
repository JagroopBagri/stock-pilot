import axios from "axios";

type EmailParamsBase = {
    toEmail: string;
    toName: string;
    fromEmail: string;
    fromName: string;
    params?: Record<string, any>; 
  };
  
  type EmailContentParams = EmailParamsBase & {
    htmlContent: string;
    templateId?: never;
    subject: string;
  };
  
  type EmailTemplateParams = EmailParamsBase & {
    htmlContent?: never;
    templateId: number;
    subject?: never;
  };

// Union type: EmailParams must satisfy either EmailContentParams or EmailTemplateParams
type EmailParams = EmailContentParams | EmailTemplateParams;

/**
 * Sends an email using the Brevo API. The email can be sent using either a specified HTML content or a template ID.
 * The function requires an `EmailParams` object that either includes `htmlContent` or `templateId`.
 *
 * @param {EmailParams} emailParams - The email parameters, including the recipient's information and the content/template ID.
 * @returns {Promise<void>} - A promise that resolves if the email is sent successfully, or rejects with an error.
 * @throws {Error} - Throws an error if the BREVO_API_KEY is not set in the environment or if the email sending fails.
 */

async function sendBrevoEmail(emailParams: EmailParams): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    throw new Error("No api key found. Please set BREVO_API_KEY");
  }

  const url = "https://api.brevo.com/v3/smtp/email";

  const emailData: any = {
    to: [
      {
        email: emailParams.toEmail,
        name: emailParams.toName,
      },
    ],
    subject: emailParams.subject,
    sender: {
      email: emailParams.fromEmail,
      name: emailParams.fromName,
    },
  };

  // Set templateId or htmlContent
  if (emailParams.templateId) {
    emailData.templateId = emailParams.templateId;
  } else if (emailParams.htmlContent) {
    emailData.htmlContent = emailParams.htmlContent;
  }

  // Include custom parameters if they exist
  if (emailParams.params) {
    emailData.params = emailParams.params;
  }

  // Set request headers
  const config = {
    headers: {
      "api-key": `${apiKey}`,
      "Content-Type": "application/json",
    },
  };

  try {
    await axios.post(url, emailData, config);
  } catch (error:any) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send email", error);
  }
}

export default sendBrevoEmail;