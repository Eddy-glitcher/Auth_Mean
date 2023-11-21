const Router    = require('express');
const { check } = require('express-validator');
const { fieldValidator } = require('../middlewares/field-validator');
const { jwtValidator } = require('../middlewares/jwt-validator');
const { 
    getHospitals,
    createHospital,
    updateHospital,
    deleteHospital
} = require('../controllers/hospital.controller');
const { imgExtValidator } = require('../middlewares/image-validator');

const hospitalRouter = Router();

hospitalRouter.get('/', jwtValidator, getHospitals);

hospitalRouter.post('/',
    [   
        jwtValidator,
        check('name',  'The email is required').isString().notEmpty(),
        check('image', 'The hospital image is required').isString().notEmpty(),
        fieldValidator,
        imgExtValidator
    ],
    createHospital
);

hospitalRouter.put('/:id',
    [   
        jwtValidator,
        check('name',  'The email is required').isString().notEmpty(),
        check('image', 'The hospital image is required').isString().notEmpty(),
        fieldValidator,
        imgExtValidator
    ],
    updateHospital
);

hospitalRouter.delete('/:id', jwtValidator, deleteHospital);


module.exports = {
    hospitalRouter
};
