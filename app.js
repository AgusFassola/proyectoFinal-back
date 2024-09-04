const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const assetRoutes = require('./routes/assetRoutes');
const HttpError = require('./model/http-error');

const cors = require('cors');

app = express();

app.use(cors({ origin:'http://localhost:3000' }));

app.use(bodyParser.json());//convierte solicitudes json a un objeto javascript accesible con req.body

app.use('/api/assets', assetRoutes );

//Error para rutas no encontradas
app.use((req, res, next) => { //sin ruta especifica aplica a todas las rutas
    const error = new HttpError(
        'No se encontró la ruta',
        404//not found
    );
    throw error;
});

//Errores generales
app.use((error, req, res, next) => {
    if( req.headerSent ){ //para verificar si ya se envió una cabecera
        return next(error);
    }
    res.status( error.code || 500 );
    res.json({ 
        message: error.message || 
        'Ocurrió un error desconocido'
     });
});


const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.q0ebaqb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
mongoose.connect(url) 
.then(() => {
    console.log('conexion correcta');
    app.listen(5000);
    
}).catch((error) => {
    console.log('falló la conexión con la BD!',error);
});
