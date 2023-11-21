
const Router    = require('express');
const { check } = require('express-validator');
const { fieldValidator } = require('../middlewares/field-validator');
const { 
    login,
    googleSingIn
} = require('../controllers/login.controller');

const loginRouter = Router();

loginRouter.get('/',
    [
        check('email',    'The email is required').isString().notEmpty(),
        check('password', 'The password is required').isString().notEmpty(),
        fieldValidator
    ],
    login
);

loginRouter.post('/google',
    [
        check('token', 'The token is required').isString().notEmpty(),
        fieldValidator
    ],
    googleSingIn
);

module.exports = {
    loginRouter
};
