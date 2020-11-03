const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const Usuario = require('../models/usuario');

//? === Rutas ===

app.get('/', function(req, res) {
    res.json('Hello World');
});

app.get('/usuario', function(req, res) {

    // {estado: true}

    // Ejemplo de filtrar búsqueda
    let desde = req.query.desde || 0; // si viene el parámetro | suponemos que si no viene lo quiere desde el primer registro
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    // búsqueda de campos que queremos mostrar, los demás son excluidos
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                });
            });
        });

});

app.post('/usuario', function(req, res) {

    let body = req.body; // Obtenemos la información del POST con body parser

    // insertar usuario a DB
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        // password: body.password,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});




app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'estado']); // pick para escoger lo que quiero: del req.body se coge lo que hay en el array

    // { new: true } para que en res.json el usuario se devuelva actualizado con la nueva información
    // {runValidators: true} para que tome en cuenta las restricciones de mongoose definidas en el modelo
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    let cambiarEstado = { estado: false }

    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            // si el usuario no existe
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no encontrado'
                }
            });
        }


        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});


module.exports = app;