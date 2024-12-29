const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const faker = require("faker");  // For generating random emails
const twilio = require("twilio");  // For sending SMS
const dotenv = require("dotenv");

dotenv.config();  // Load environment variables from .env

const app = express();
app.use(bodyParser.json());

// Set up Twilio client
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// In-memory data store for responses
let userResponses = [];

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/../frontend/index.html");
});

// Endpoint to send phishing email
app.post("/send-email", (req, res) => {
    const numberOfEmails = req.body.number || 5; // Default to 5 emails

    // Loop through and send random emails
    for (let i = 0; i < numberOfEmails; i++) {
        const userEmail = faker.internet.email(); // Generate a random email
        sendPhishingEmail(userEmail);
    }

    res.send(`${numberOfEmails} phishing emails sent successfully!`);
});

// Helper function to send phishing email
const sendPhishingEmail = (userEmail) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Account Security Alert",
        html: `
            <h2>Your Account Security Update</h2>
            <p>Your account has been flagged for suspicious activity. To prevent further unauthorized access, please confirm your identity by clicking the link below.</p>
            <a href="http://localhost:3000/track-click" target="_blank">Click here to verify your account</a>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email: ", error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};

// Endpoint to send phishing SMS
app.post("/send-sms", (req, res) => {
    const numberOfSMS = req.body.number || 5; // Default to 5 SMS
    const phoneNumbers = req.body.numbers || []; // Array of phone numbers to send SMS to

    // Loop through and send random SMS messages
    for (let i = 0; i < numberOfSMS; i++) {
        const randomPhoneNumber = phoneNumbers[i] || faker.phone.phoneNumber(); // Generate a random phone number
        sendPhishingSMS(randomPhoneNumber);
    }

    res.send(`${numberOfSMS} phishing SMS messages sent successfully!`);
});

// Helper function to send phishing SMS
const sendPhishingSMS = (phoneNumber) => {
    const message = `
        Your account has been flagged for suspicious activity. To secure your account, click the link below:
        http://localhost:3000/track-click
    `;

    client.messages.create({
        body: message,
        to: phoneNumber,  // Phone number to send to
        from: process.env.TWILIO_PHONE // Your Twilio phone number
    }).then((message) => {
        console.log(`Message sent to ${phoneNumber}: ${message.sid}`);
    }).catch((error) => {
        console.log("Error sending SMS: ", error);
    });
};

// Track user click behavior
app.post("/track-click", (req, res) => {
    const clicked = req.body.clicked;

    userResponses.push({
        clicked,
        timestamp: new Date()
    });

    res.send("User response recorded");
});

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});
