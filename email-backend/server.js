require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors()); // allow requests from your static site
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  if(!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER, // your Gmail receives the message
      subject: `New Contact Form Message from ${name}`,
      text: message,
    });
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error sending email." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
