/**
 * Generates an HTML template for a password reset email. This function takes the user's first name and a reset password link,
 * constructs an HTML email content which is ready to be sent via an email service. The HTML content includes a personalized
 * greeting and a button to reset the password.
 *
 * @param {string} firstName - The first name of the user to whom the password reset email will be sent. 
 * @param {string} resetPasswordLink - The URL that the user will follow to reset their password. 
 * @returns {string} - Returns a string containing the full HTML content for the email. This HTML is styled and ready to be used in an email.
 *
 * @example
 * const htmlContent = createForgotPasswordHTMLTemplate('John', 'https://example.com/reset-password?token=abc123');
 * console.log(htmlContent); // Logs the full HTML content to the console.
 */

const createForgotPasswordHTMLTemplate = (firstName: string, resetPasswordLink: string) => {
    return `<!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333333;
          margin: 20px;
          padding: 0;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background: #ffffff;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          border-radius: 8px;
        }
        .button {
          display: block;
          width: 100%;
          max-width: 300px;
          margin: 20px auto;
          padding: 10px;
          text-align: center;
          background-color: #0061a8;
          color: #ffffff;
          border: none;
          border-radius: 5px;
          text-decoration: none;
        }
        .button:hover {
          background-color: #004885;
        }
        h1 {
          color: #0061a8;
        }
        p {
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Password Reset Request</h1>
        <p>Hello ${firstName},</p>
        <p>You recently requested to reset your password for your Stock Pilot account. Click the button below to reset it:</p>
        <a href="${resetPasswordLink}" class="button">Reset Your Password</a>
        <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
        <p>Thanks,<br>The Stock Pilot Team</p>
      </div>
    </body>
    </html>
    `;
}

export default createForgotPasswordHTMLTemplate;