const { response }   = require("express");
const HospitalSchema = require("../models/hospital.model");

const getHospitals = async(req, res = response) => {

    try {
        const hospitals = await HospitalSchema.find();
        return res.status(200).json({
            ok  : true,
            msj : 'Hospitales consultados correctamente',
            hospitals
        });
    } catch (error) {
        return res.status(500).json({
            ok  : false,
            msj : 'Error al consultar los Hospitales',
            error
        });
    };

};

const createHospital = async(req, res = response) => {

    const uid   = req.uid;
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

        const hospital = new HospitalSchema({ user: uid, ...req.body});
        await hospital.save();

        return res.status(201).json({
            ok  : true,
            msj : 'Hospital creado correctamente',
            hospital
        });
    } catch (error) {
        return res.status(500).json({
            ok  : false,
            msj : 'Error al crear el Hospital' 
        });
    };

};

const updateHospital = async(req, res = response) => {

    const hid   = req.params.id;
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

        const hospitalExists = await HospitalSchema.findById(hid);

        if(!hospitalExists){
            return res.status(404).json({
                ok  : true,
                msj : 'No existe un hospital con ese id' 
            });
        };

        const hospital = await HospitalSchema.findByIdAndUpdate(hid, req.body, {new : true});

        return res.status(200).json({
            ok  : true,
            msj : 'Hospital Actualizado',
            hospital
        });

    } catch (error) {
        return res.status(500).json({
            ok  : false,
            msj : 'Error al actualizar el Hospital'
        });
    };
};

const deleteHospital = async(req, res = response) => {

    const hid = req.params.id;
    
    try {
        const hospitalExists = await HospitalSchema.findById(hid);

        if(!hospitalExists){
            return res.status(404).json({
                ok  : true,
                msj : 'No existe un hospital con ese id' 
            });
        };

        const hospital = await HospitalSchema.findByIdAndDelete(hid);

        return res.status(200).json({
            ok  : true,
            msj : 'Hospital Eliminado',
            hospital
        });

    } catch (error) {
        return res.status(500).json({
            ok  : false,
            msj : 'Error al actualizar el Hospital'
        });
    };
};

module.exports = {
    getHospitals,
    createHospital,
    updateHospital,
    deleteHospital
};