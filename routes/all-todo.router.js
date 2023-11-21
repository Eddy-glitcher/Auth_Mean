const Router = require('express');
const { jwtValidator } = require('../middlewares/jwt-validator');
const { 
    getAll,
    getAllCollection,
    uploadFile,
    getImage,
} = require('../controllers/all-todo.controller');

const allTodoRouter = Router();

allTodoRouter.get('/:search',jwtValidator, getAll);
allTodoRouter.get('/:table/:search',jwtValidator, getAllCollection);
allTodoRouter.post('/:table/uploads/:id',jwtValidator, uploadFile);
allTodoRouter.get('/uploads/:table/:image',jwtValidator, getImage);

module.exports = {
    allTodoRouter
};

