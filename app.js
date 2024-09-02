const express = require('express');
const mongoose = require('mongoose');

app = express();
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.q0ebaqb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
mongoose.connect(url) 
.then(() => {
    console.log('conexion correcta');
    app.listen(5000);
    
}).catch((error) => {
    console.log('falló la conexión con la BD!',error);
});
