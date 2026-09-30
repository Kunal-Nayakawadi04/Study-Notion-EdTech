const nodemailer = require('nodemailer');
require('dotenv').config();

const mailSender = async () => {
    try {
        console.log("Testing SMTP Connection...");
        console.log("Host:", process.env.MAIL_HOST);
        console.log("User:", process.env.MAIL_USER);
        // Do not log the password for security

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        console.log("Verifying transporter...");
        await transporter.verify();
        console.log("✅ SMTP Connection Successful! Credentials are correct.");

        console.log("Attempting to send test email...");
        const info = await transporter.sendMail({
            from: 'StudyNotion Test',
            to: process.env.MAIL_USER, // Send to self
            subject: 'SMTP Test Email',
            html: '<h1>Success</h1><p>SMTP is working correctly.</p>'
        });
        console.log("✅ Test Email Sent!", info.messageId);

    } catch (error) {
        console.error("❌ SMTP Connection Failed!");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        if (error.response) {
            console.error("SMTP Response:", error.response);
        }
        console.log("\nIf you see 'Invalid login: 535', it means the Username or App Password is incorrect.");
    }
}

mailSender();
