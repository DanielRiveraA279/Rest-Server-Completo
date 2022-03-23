
const { OAuth2Client } = require('google-auth-library') //npm install google-auth-library --save

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleVerify (idToken = '') {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, picture, email } = ticket.getPayload();

    return {
        nombre: name,
        img: picture,
        correo: email
    }
}

module.exports = {
    googleVerify
}
