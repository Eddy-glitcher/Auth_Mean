const { response } = require("express");
const jwt          = require("jsonwebtoken");

const jwtValidator = (req, res = response, next) => {
    try {

        const token = req.headers.token; 

        if(!token){
            return res.status(401).json({
                ok  : false,
                msj : 'Token no resivido!'
            });
        };

        const { uid } = jwt.verify(token, process.env.SEC_KEY);
        req.uid       = uid;
        next();
    } catch (error) {
        return res.status(500).json({
            ok  : false,
            msj : 'Error al verificar el token, ha vencido o es erroneo!'
        });
    };
};

module.exports = {
    jwtValidator
};