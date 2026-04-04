const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", // or another email service
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS  // your app password
  }
});

async function sendpickupemail(to, pickupId) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Your Waste Pickup Tracking ID",
    html: `
      <h3>Waste Pickup Scheduled ✅</h3>
      <p>Dear resident,</p>
      <p>Your pickup request has been successfully scheduled.</p>
      <p><b>Tracking ID:</b> ${pickupId}</p>
      <p>Use this ID to track your pickup in the portal.</p>
      <br>
      <p>Thank you,<br>Waste Management Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendpickupemail;