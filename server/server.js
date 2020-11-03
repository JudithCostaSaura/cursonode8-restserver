require('./config/config'); // archivo de configuración


const express = require('express');

//! Conexión con mongo
const mongoose = require('mongoose');
// import mongoose from 'mongoose';

const app = express();

//! START npm boy-parser -> procesar datos
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//! Requerir las rutas del usuario
app.use(require('./routes/usuario'));




//! Conexión a la base de datos
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err

    console.log('base de datos online');

});


// process.env.PORT -> del archivo global requerido en la primera línea
app.listen(process.env.PORT, () => {
    console.log('escuchando puerto ', process.env.PORT);
});