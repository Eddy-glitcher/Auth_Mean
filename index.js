const express = require('express');
const cors = require('cors');
// falta importar las variables de entorno
require('dotenv').config();
const fileUpload = require('express-fileupload');

const { dbConnection } = require('./database/database.config');
const { userRouter } = require('./routes/user.routes');
const { loginRouter } = require('./routes/login.router');
const { doctorRouter } = require('./routes/doctor.router');
const { hospitalRouter } = require('./routes/hospital.router');
const { allTodoRouter } = require('./routes/all-todo.router');

// Inicializamos el servidor de express
const app = express();

// Inicializamos los cors
app.use(cors());

// carpeta publica
app.use(express.static('public'));

// Habilitamos las solicitudes con datos tipo json
app.use(express.json());

// Habilitamos que la aplicación pueda recibir archivos, en este caso imágenes
app.use(fileUpload());

// Conexion a base de datos
dbConnection();

// Importamos los enrutadores
app.use('/users', userRouter);
app.use('/hospitals', hospitalRouter);
app.use('/doctors', doctorRouter);
app.use('/all', allTodoRouter);
app.use('/api/login', loginRouter);

app.listen(process.env.SER_PORT, function(){
    console.log("Servidor corriendo en el puerto: ", process.env.SER_PORT);
});