const Router    = require('express');
const { check } = require('express-validator');
const { 
    getUsers,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/user.controller');
const { fieldValidator } = require('../middlewares/field-validator');
const { jwtValidator } = require('../middlewares/jwt-validator');
const { imgExtValidator } = require('../middlewares/image-validator');

const userRouter = Router();

userRouter.get('/', jwtValidator, getUsers);

userRouter.post('/',
    [   
        check('name',    'The name is Required').isString().notEmpty(),
        check('email',   'The email is Required').isEmail(),
        check('password','The password is Required').isString().notEmpty(),
        fieldValidator,
        imgExtValidator
    ],
    createUser
);

userRouter.put('/:id',
    [   
        jwtValidator,
        check('name',  'The name is Required').isString().notEmpty(),
        check('email', 'The email is Required').isEmail(),
        fieldValidator,
        imgExtValidator
    ],
    updateUser
);

userRouter.delete('/:id', jwtValidator, deleteUser);


module.exports = {
    userRouter
};