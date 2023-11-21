const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_SEC);

const googleVerify = async(token) =>{
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
        const userId = payload['sub'];
        console.log(payload);
        return payload;
    } catch (error) {
        console.log("Error con SingIn: ",error);
    };
};


module.exports = {
    googleVerify
};