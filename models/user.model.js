const { Schema, model} = require('mongoose');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email : {
        type: String,
        unique : true,
        required: true
    },
    password: {
        type : String,
        required: true
    },
    image : {
        type : String
    },
    role : {
        type: String,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    }
});

UserSchema.method('toJSON', function(){
    // Desestructuro los datos que me llegan y luego los retorno modificados
    const { __v, _id, password, ...object} = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Users', UserSchema);