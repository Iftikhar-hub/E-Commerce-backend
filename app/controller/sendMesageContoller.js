require("dotenv").config();
const nodemailer = require('nodemailer');


const sendMessage = async (req, res) => {

    const { name, email, phone, message } = req.body;

    const transporter = nodemailer.createTransport({
        // service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD

        }
    })

    const mailOptions = {
        from: email,
        to: process.env.EMAIL, 
        subject: `New message from ${name}`,
        text: message
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error in sending email", error);
            return res.status(500).send('Error Sending Email')
        }
        console.log("Email Sent", error);
        return res.status(200).send('Email sent successfully')
    })

}


const sendEmail = async (req, res) => {

    const {  email } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD

        }
    })

    const mailOptions = {
        from: email,
        to: process.env.EMAIL, 
        subject: `New subscription from ${email}`,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error in sending email", error);
            return res.status(500).send('Error Sending Email')
        }
        console.log("Email Sent", error);
        return res.status(200).send('Email sent successfully')
    })

}

module.exports = { sendMessage, sendEmail };