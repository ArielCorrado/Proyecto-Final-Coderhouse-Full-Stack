const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendSMS = (number, msg) => {
    client.messages
    .create({
        body: msg,
        from: process.env.TWILIO_NUMBER,
        to: number
    })
    .then(message => console.log(message.sid))
    .catch(error => console.error(error));
}

const sendWhatSapp = (number, msg) => {
    client.messages
    .create({
        body: msg,
        from: `whatsapp:${process.env.TWILIO_NUMBER}`,
        to: `whatsapp:${number}`
    })
    .then(message => console.log(message.sid))
    .catch(error => console.error(error));
}


module.exports = {sendSMS, sendWhatSapp};