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

    try {

        const createHospital = {
            ...req.body,
            user : uid
        };

        const hospital = new HospitalSchema(createHospital);
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
    const uid   = req.uid;
    
    try {

        const hospitalExists = await HospitalSchema.findById(hid);

        if(!hospitalExists){
            return res.status(404).json({
                ok  : true,
                msj : 'No existe un hospital con ese id' 
            });
        };

        const updateHospital = {
            ...req.body,
            user : uid
        };

        const hospital = await HospitalSchema.findByIdAndUpdate(hid, updateHospital, {new : true});

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

        // No deberiamos eliminarlo completamente de la base de datos, deberiamos usar un propiedad de activo e inactivo en ls db
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