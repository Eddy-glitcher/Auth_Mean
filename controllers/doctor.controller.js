const { response }   = require("express");
const DoctorSchema   = require("../models/doctor.model");
const HospitalSchema = require("../models/hospital.model");

const getDoctors = async(req, res = response) => {

    try {
        const doctors = await DoctorSchema.find();
        return res.status(200).json({
            ok  : true,
            msj : 'Doctores consultados correctamente',
            doctors
        });
    } catch (error) {
        return res.status(500).json({
            ok  : false,
            msj : 'Error al consultar los Doctores' 
        });
    };

};

const createDoctor = async(req, res = response) => {

    const uid   = req.uid;
    const hid   = req.body.hospital;
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
                ok  : false,
                msj : 'El id del hospital no es válido o no existe en la db'
            });
        };

        const doctor = new DoctorSchema({ user : uid, ...req.body});
        await doctor.save();
        
        return res.status(200).json({
            ok  : true,
            msj : 'Doctor creado correctamente',
            doctor 
        });
    } catch (error) {
        return res.status(500).json({
            ok  : false,
            msj : 'Error al crear el doctor' 
        });
    };

};

const updateDoctor = async(req, res = response) => {

    const did   = req.params.id;
    const hid   = req.body.hospital;
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

        const doctorExists = await DoctorSchema.findById(did);

        if(!doctorExists){
            return res.status(404).json({
                ok  : false,
                msj : 'El id del doctor no es válido o no existe en la db'
            });
        };

        const hospitalExists = await HospitalSchema.findById(hid);

        if(!hospitalExists){
            return res.status(404).json({
                ok  : false,
                msj : 'El id del hospital no es válido o no existe en la db'
            });
        };

        const doctor = await DoctorSchema.findByIdAndUpdate(did,{user : req.uid, ...req.body}, {new : true});
        
        return res.status(200).json({
            ok  : true,
            msj : 'Doctor actualizado correctamente',
            doctor 
        });
    } catch (error) {
        return res.status(500).json({
            ok  : false,
            msj : 'Error al actualizar el doctor',
            error
        });
    };

};

const deleteDoctor = async(req, res = response) => {
    
    const did = req.params.id;

    try {

        const doctorExists = await DoctorSchema.findById(did);

        if(!doctorExists){
            return res.status(404).json({
                ok  : false,
                msj : 'El id del doctor no es valido o no existe en la db!'
            });
        };

        const doctor = await DoctorSchema.findByIdAndDelete(did);
        return res.status(200).json({
            ok  : true,
            msj : 'Doctor Eliminado!',
            doctor
        });
    } catch (error) {
        return res.status(500).json({
            ok  : false,
            msj : 'Error al eliminar el doctor!' 
        });
    };
};

module.exports = {
    getDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor
};