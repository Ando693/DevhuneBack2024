const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = async (email, subject, text) => {
    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: process.env.SMTP,
        secure: Boolean(process.env.SECURE),
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    });

    await transporter.sendMail({
        from: process.env.USER,
        to: email,
        subject: subject,
        text: text
    });

    console.log('Email sent successfully !');
}