require('./config/config'); // archivo de configuración


const express = require('express');

//! Conexión con mongo
const mongoose = require('mongoose');
const path = require('path'); // para poder habilitar la carpeta public

const app = express();

//! START npm boy-parser -> procesar datos
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//! Habilitar la carpeta public para que se pueda acceder desde cualquier lugar

app.use(express.static(path.resolve(__dirname, './public')));
console.log(path.resolve(__dirname, './public'));

//! Requerir las rutas  ->  viene del index
app.use(require('./routes/index'));




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