const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // para generar tokens
const app = express();
const Usuario = require('../models/usuario');
const { request } = require('./usuario');
const usuario = require('../models/usuario');


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: '(usuario) o contraseña no encontrado'
                }
            });
        }

        // tomar la contraseña que el usuario ha introducido y ver si es igual a la de la base de datos - regresa true o false
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'usuario o (contraseña) no encontrado'
                }
            });
        }

        /* jwt.sign({
            data: 'foobar'
        }, 'secret', {expiresIn: 60*60 }); */

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN }); // config.js

        res.json({
            ok: true,
            usuarioDB,
            token
        });

    });

});



module.exports = app;