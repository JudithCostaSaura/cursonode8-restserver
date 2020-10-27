require('./config/config'); // archivo de configuración


const express = require('express');
const app = express();

//! START npm boy-parser -> procesar datos
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//! END npm boy-parser

app.get('/', function(req, res) {
    res.json('Hello World');
});

app.get('/usuario', function(req, res) {

    res.json('get usuario');
});

app.post('/usuario', function(req, res) {

    let body = req.body; // del body parser

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: "el nombre no está"
        });
    } else {
        res.json({
            nombre: body.nombre,
            edad: body.edad
        });
    }
});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;

    res.json({
        id
    });

});

app.delete('/usuario', function(req, res) {
    res.json('delete usuario')
});


// process.env.PORT -> del archivo global requerido en la primera línea
app.listen(process.env.PORT, () => {
    console.log('escuchando puerto ', process.env.PORT);
});