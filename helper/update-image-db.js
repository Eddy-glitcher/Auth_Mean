const fs             = require('fs');
const UserSchema     = require('../models/user.model');
const DoctorSchema   = require('../models/doctor.model');
const HospitalSchema = require('../models/hospital.model');

const deleteImage = (path)=>{
    if( fs.existsSync(path) ){
        fs.unlinkSync(path);
    };
};

const updateImageDb = async(dbTable, id, image ) => {

    let imagePath = '';

    try {
        switch (dbTable) {
            case 'users':
                const user = await UserSchema.findById(id);

                if(!user){
                    return false;
                };

                imagePath = `./uploads/users/${user.image}`;
                deleteImage(imagePath);

                user.image = image;
                user.save();
                return true;

                break;
            case 'doctors':
                const doctor = await DoctorSchema.findById(id);

                if(!doctor){
                    return false;
                };

                imagePath = `./uploads/doctors/${doctor.image}`;
                deleteImage(imagePath);

                doctor.image = image;
                doctor.save();
                return true;

                break;
            case 'hospitals':
                const hospital = await HospitalSchema.findById(id);

                if(!hospital){
                    return false;
                };

                imagePath = `./uploads/hospitals/${hospital.image}`;
                deleteImage(imagePath);

                hospital.image = image;
                hospital.save();
                return true;

                break;
        
            default:
                return false;
                break;
        }
    } catch (error) {
        return false;
    };

};

module.exports = {
    updateImageDb
};