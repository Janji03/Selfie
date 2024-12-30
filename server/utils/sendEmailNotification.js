import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});


const sendEmailNotification = async (to, subject, message) => {
  try {
    await transporter.sendMail({
      from: config.EMAIL_USER,
      to,
      subject,
      html: `
        <html>
          <body>
            <h1>${subject}</h1>
            <p>${message}</p>
          </body>
        </html>
      `,
    });

    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error(`Error sending email to ${to}:`, err);
  }
};

export default sendEmailNotification;
