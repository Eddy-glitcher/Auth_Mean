const Router = require('express');
const { check }  = require('express-validator');
const { jwtValidator } = require('../middlewares/jwt-validator');
const { fieldValidator }  = require('../middlewares/field-validator');

const { 
    getDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor
} = require('../controllers/doctor.controller');
const { imgExtValidator } = require('../middlewares/image-validator');

const doctorRouter = Router();

doctorRouter.get('/', jwtValidator, getDoctors);

doctorRouter.post('/', 
    [
        jwtValidator,
        check('name',     'The name of the doctor is required').isString().notEmpty(),
        check('hospital', 'The hospital id is required').isMongoId(),
        fieldValidator,
        imgExtValidator
    ],
createDoctor);

doctorRouter.put('/:id', 
    [
        jwtValidator,
        check('name',     'The name of the doctor is required').isString().notEmpty(),
        check('hospital', 'The hospital id is required').isMongoId(),
        fieldValidator,
        imgExtValidator
    ],
    updateDoctor
);

doctorRouter.delete('/:id', jwtValidator, deleteDoctor);


module.exports = {
    doctorRouter
};
