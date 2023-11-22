
const Router    = require('express');
const { check } = require('express-validator');
const { fieldValidator } = require('../middlewares/field-validator');
const { jwtValidator } = require('../middlewares/jwt-validator');

const { 
    login,
    googleSingIn,
    renewToken
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

loginRouter.get('/renew', jwtValidator, renewToken );

module.exports = {
    loginRouter
};
