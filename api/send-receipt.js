const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Configure your SMTP transport (replace with your credentials)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

router.post('/send-receipt', async (req, res) => {
  const { to, subject, text, html } = req.body;
  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@yourdomain.com',
      to,
      subject,
      text,
      html,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 