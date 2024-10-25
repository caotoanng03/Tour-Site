import nodemailer from "nodemailer"

export const sendMail = async (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: html
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Send Mail Error: ')
            console.log(error)
        } else {
            console.log(`Email sent to ${email}`)
        }
    });

}

