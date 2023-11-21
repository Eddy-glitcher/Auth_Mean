const { Schema, model } = require('mongoose');

const DoctorSchema = new Schema({
    name : {
        type    : String,
        require : true
    },
    image : {
        type : String
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : 'Users',
        required : true
    },
    hospital : {
        type : Schema.Types.ObjectId,
        ref : 'Hospitals',
        required : true
    }
});

DoctorSchema.method('toJSON', function(){
    const { __v, _id, ...object} = this.toObject();
    object.did = _id;
    return object;
});

module.exports = model('Doctors', DoctorSchema);