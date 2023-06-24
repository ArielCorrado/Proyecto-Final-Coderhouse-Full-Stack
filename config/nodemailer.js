const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ehard.ecommerce@gmail.com", 
        pass: process.env.MAIL_SENDER_PASS, 
    },
});

const sendMailtoAdmin = (data, subject) => {

    const mailOptions = {
        from: 'ehard.ecommerce@gmail.com', // Reemplaza con tu cuenta de Google
        to: process.env.MAIL_ADMIN,
        subject: subject,
        text: data
       
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Correo electrónico enviado: ' + info.response);
        }
    });
}   

module.exports = sendMailtoAdmin;