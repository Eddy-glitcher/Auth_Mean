const { response }     = require("express");
const UserSchema       = require("../models/user.model");
const bcrypt           = require("bcrypt");
const { jwtGenerator } = require("../helper/jwt-generator");
const { googleVerify } = require("../helper/google-verify");
const jwt          = require("jsonwebtoken");

const login = async(req, res = response) => {
    try {
        const { email, password } = req.body;
        const user = await UserSchema.findOne({email});

        if(!user){
            return res.status(400).json({
                ok: false,
                msj : 'Error al iniciar sesión, revisar entradas!'
            });
        };

        // Comparamos si las contraseñas son correctas
        const validPassword = bcrypt.compareSync(password, user.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msj : 'Error al iniciar sesión revise entradas!'
            });
        };

        const uid = user._id;
        const token = await jwtGenerator(uid);

        return res.status(200).json({
            ok: true,
            msj : 'Loggeado correctamente!',
            token
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msj : 'Error al loggear, revisar entradas!'
        });
    };

};

const googleSingIn = async(req, res = response) => {
    
    let user;
    try {

        const { name, email, picture } = await googleVerify(req.body.token);
        const userDb = await UserSchema.findOne({email});

        if(!userDb){
            user = new UserSchema({
                name,
                email,
                password : '@@@',
                image    : picture,
                google   : true
            });
        }else{
            user        = userDb;
            user.google = true;
        };

        // Guardamos el usuario
        await user.save();

        // Generamos el jwt
        const token = await jwtGenerator(user.id);

        return res.status(200).json({
            ok  :  true,
            msj : 'Sesion con google iniciada correctamente!',
            name,
            email,
            picture,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok  :  false,
            msj : 'Error al iniciar sesión con google!'
        });
    };
};

const renewToken = async(req, res = response) => {
    const uid = req.uid;

    try {
        const token = await jwtGenerator(uid);

        return res.status(200).json({
            ok  : true,
            msj : 'Token válido',
            token
        });
    } catch (error) {
        return res.status(200).json({
            ok  : false,
            msj : 'Error al verificar el token'
        });
    };

};

module.exports = {
    login,
    googleSingIn,
    renewToken
};