const { response } = require("express");
const UserSchema   = require("../models/user.model");
const bcrypt       = require("bcrypt");

const getUsers = async(req, res = response)=>{
    const getUsersFrom = Number(req.query.from) || 0;
    try {

        const [ users, usersCountList] = await Promise.all([
            UserSchema.find({}, 'name email image')
            .skip(getUsersFrom)
            .limit(5),

            // Para retornar el conteo de los usuarios encontrados en la db.
            UserSchema.countDocuments()
        ]);

        
        return res.status(200).json({
            ok  : true,
            msj : 'Usuarios consultados correctamente!',
            users,
            usersCountList
        });
    } catch (error) {
        return res.status(500).json({
            ok   : true,
            msj  : 'Error al consultar los usuarios, intente de nuevo!',
            error
        });
    };
};

const createUser = async(req, res = response)=>{
    const { image, email, password } = req.body;

    try {

        // Verificamos que la imagen sea válida

        if(image){
            const isImageValid = imageValidator(image);
            
            if(!isImageValid){
                return res.status(400).json({
                    ok  : false,
                    msj : 'La imagen enviada no es válida, debe ser jpg/jpeg/png/avif'
                });
            };
        };

        // Verificamos que no exista otro usuario con el mismo email
        const userExists = await UserSchema.findOne({email: email});

        if(userExists){
            return res.status(400).json({
                ok  : false,
                msj : 'Error: El email no está disponible'
            });
        };

        const user = new UserSchema(req.body);
        
        // Encriptamos contraseña   
        const salt         = bcrypt.genSaltSync();
        const hashPassword = bcrypt.hashSync(password, salt);
        user.password      = hashPassword;

        await user.save();

        return res.status(201).json({
            ok  : true,
            msj : 'Usuario creado correctamente!',
            user
        });
    } catch (error) {
        return res.status(500).json({
            ok   : false,
            msj  : 'Error al crear el usuario, intente de nuevo!',
            error
        });
    };
};

const updateUser = async(req, res = response) => {

    const uid   = req.params.id;
    const image = req.body.image;

    try {

        if(image){
            const isImageValid = imageValidator(image);
            
            if(!isImageValid){
                return res.status(400).json({
                    ok  : false,
                    msj : 'La imagen enviada no es válida, debe ser jpg/jpeg/png/avif'
                });
            };
        };

        const userExists = await UserSchema.findById(uid);

        if(!userExists){
            return res.status(404).json({
                ok  : false,
                msj : 'El id del usuario no es válido o no existe en la db'
            });
        };

        const user = await UserSchema.findByIdAndUpdate(uid, req.body, {new : true});

        return res.status(200).json({
            ok  : true,
            msj : 'Usuario Actualizado',
            user
        });
    } catch (error) {
        return res.status(500).json({
            ok  : false,
            msj : 'Error al Actualizar el Usuario'
        });
    };
};

const deleteUser = async(req, res = response) => {

    const uid = req.params.id;

    try {
        
        const userExists = await UserSchema.findById(uid);

        if(!userExists){
            return res.status(400).json({
                ok  : false,
                msj : 'El id de Usuario recibido no existe en la db!',
            });
        };
        
        const deletedUser = await UserSchema.findByIdAndDelete(uid); 

        return res.status(200).json({
            ok  : true,
            msj : 'Usuario eliminado correctamente!',
            deletedUser
        });
    } catch (error) {
        return res.status(500).json({
            ok  : false,
            msj : 'Error al eliminar el Usuario!'
        });
    };
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};