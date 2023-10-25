const nodemailer = require("nodemailer");
const googleApis = require("googleapis");
const REDIRECT_URI = `https://developers.google.com/oauthplayground`;
const CLIENT_ID = `enter yr client id`;
const CLIENT_SECRET = `enter yr client secret`;
const REFRESH_TOKEN = `enter yr refresh token`;
const authClient = new googleApis.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, 
REDIRECT_URI);
authClient.setCredentials({refresh_token: REFRESH_TOKEN});
async function mailer(recieve,message){
 try{
 const ACCESS_TOKEN = await authClient.getAccessToken();
 const transport = nodemailer.createTransport({
 service: "gmail",
 auth: {
 type: "OAuth2",
 user: "yr email",
 clientId: CLIENT_ID,
 clientSecret: CLIENT_SECRET,
 refreshToken: REFRESH_TOKEN,
 accessToken: ACCESS_TOKEN
 }
 })
 const details = {
 from: "yr name  <yr gmail>",
 to: recieve,
 subject: "Notification for Medication ",
 text: message,
 html: `<h2>${message}</h2>`
 }
 const result = await transport.sendMail(details);
 return result;
 }
 catch(err){
 return err;
 }
}

module.exports = mailer;
