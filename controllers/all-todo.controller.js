const { response }      = require("express");
const UserSchema        = require("../models/user.model");
const DoctorSchema      = require("../models/doctor.model");
const HospitalSchema    = require("../models/hospital.model");
const { updateImageDb } = require("../helper/update-image-db");
const { v4:uuid }       = require('uuid');
const fs                = require('fs');
const path = require('path');


const getAll = async(req, res = response) => {

    const search = req.params.search;
    const regExp = new RegExp(search, 'i');

    try {
        const [ users, doctors, hospitals ] = await Promise.all([
            UserSchema.find({name : regExp}),
            DoctorSchema.find({name : regExp}),
            HospitalSchema.find({name : regExp}),
        ]);

        return res.status(200).json({
            ok  : true,
            msj : 'Busqueda realizada con éxito!',
            search,
            users,
            doctors,
            hospitals
        });
    } catch (error) {
        return res.status(500).json({
            ok  : false,
            msj : 'Error en la busqueda, intentelo de nuevo!'
        });
    };

};

const getAllCollection = async(req, res = response) => {

    const search     = req.params.search;
    const dbTable    = req.params.table;
    const regExp     = new RegExp(search, 'i');


    const collections = {
        'users'     : await UserSchema.find({name : regExp}),
        'doctors'   : await DoctorSchema.find({name : regExp}),
        'hospitals' : await HospitalSchema.find({name : regExp})
    };

    const collectionSearch = collections[dbTable];
    
    try {
        return res.status(200).json({
            ok  : true,
            msj : 'Busqueda realizada con éxito!',
            collectionSearch
        });
    } catch (error) {
        return res.status(500).json({
            ok  : false,
            msj : 'Error en la busqueda, intentelo de nuevo!'
        });
    };

};

const uploadFile = async(req, res = response) => {
    
    const id      = req.params.id; 
    const dbTable = req.params.table;
    const image   = req.files.image;

    try {

        if(!req.files || Object.keys(req.files).length === 0){
            return res.status(404).json({
                ok  : false,
                msj : 'No se ha recibido ninguna imágen a cargar, reviselo!'
            });
        };

        const imageArr = image.name.split('.');
        const imageExt = imageArr[imageArr.length-1].toLowerCase();
        const validImageExtensions = ['jpg', 'jpeg', 'png', 'avif'];        

        if(!validImageExtensions.includes(imageExt)){
            return res.status(400).json({
                ok  : false,
                msj : 'La imagen enviada no es válida, debe ser jpg/jpeg/png/avif'
            });
        };
    
        const uuidRefImage = `${uuid()}.${imageExt}`;
        const imagePath = `./uploads/${dbTable}/${uuidRefImage}`;

        updateImageDb(dbTable, id, uuidRefImage);

        image.mv(imagePath, function(err){
            if(err){
                return res.status(200).json({
                    ok  : true,
                    msj : 'Imagen cargada correctamente!'
                });
            };
        });

        return res.status(200).json({
            ok  : true,
            msj : 'Imagen cargada correctamente!'
        });
    } catch (error) {
        return res.status(500).json({
            ok  : false,
            msj : 'Error al cargar la imagen, intentelo de nuevo!'
        });
    };
};

const getImage = (req, res = response) => {

    const dbTable = req.params.table;
    const image   = req.params.image;

    const searchPath  = `../uploads/${dbTable}/${image}`;

    const pathImage = path.join(__dirname, searchPath);

    if(fs.existsSync(pathImage)){
        res.sendFile(pathImage);
    }else{
        const imageNotFound = path.join(__dirname, '../uploads/image-not-found/no-img.jpg');
        res.sendFile(imageNotFound);
    };
};

// TODO: REALIZAR OPTIMIZACIONES EN LA MEDIDA DE LO POSIBLE, PERO ANTES SE DEBE LEER Y ESTUDIAR TODA LA APLLICACIÓN

module.exports = {
    getAll,
    getAllCollection,
    uploadFile,
    getImage
};