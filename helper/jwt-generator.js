const jwt = require('jsonwebtoken')

const jwtGenerator = async(uid) => {

    return new Promise( (resolve, reject) => {
        const payload = {
            uid
        };

        jwt.sign(payload, process.env.SEC_KEY, {expiresIn: '24h'}, function(error, token){
            if(error){
                reject('Error al generar el token');
            };

            resolve(token);
        })
    });
};

module.exports = {
    jwtGenerator
};