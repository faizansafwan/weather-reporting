const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// Send mail
const sendMail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: `"Weather Updates" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text, 
        });
        console.log(`Email sent to ${to}`);
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
}

module.exports = sendMail;

  