const mongoose = require("mongoose");

const dbConnection = async()=>{
    try {
        const dbConnection = await mongoose.connect(process.env.DB_CNN);
        if(dbConnection){
            console.log('DB ONLINE');
        };
    } catch (error) {
        console.log("Error al conectar a la base de datos", error);
    };
};

module.exports = {
    dbConnection
};