const accountSid = 'enter accountsid';
const authToken = 'enter accounttoken';
const client = require('twilio')(accountSid, authToken);





function sendmessage (to,message) {
    client.messages
  .create({
    body: message,
    from: 'whatsapp:yr twilio number', // Use your Twilio WhatsApp phone number
    to: `whatsapp:91${to}`
  })
  .then((message) => console.log(`Message sent with SID: ${message.sid}`))
  .catch((error) => console.error(`Error sending message: ${error.message}`));

}

module.exports = sendmessage;