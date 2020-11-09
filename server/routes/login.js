const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // para generar tokens


const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

//* Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID, // esto no va

    });
    const payload = ticket.getPayload();

    /*     console.log('=============');
        console.log(payload.name);
        console.log(payload.email);
        console.log(payload.picture);
        console.log('============='); */

    return {
        nombre: payload.name,
        email: payload.email,
        picture: payload.picture,
        google: true
    }


}





//* sign-in con google
app.post('/google', async(req, res) => {
    let token = req.body.idtoken; // de la función onSignIn

    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            });
        });

    // Validaciones:
    // 1- Que no exista un usuario con el mismo email
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // si hay un usuario registrado con el mismo email pero no por google
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'tu google es false, no puede iniciar sesión con google'
                    }
                });
            } else {
                // renovar token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN }); // config.js

                return res.json({
                    ok: true,
                    usuarioDB,
                    token
                });

            }
        } else {
            // si el user no existe crearlo
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save(err, usuarioDB => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN }); // config.js

                return res.json({
                    ok: true,
                    usuarioDB,
                    token
                });

            });
        }

    });


});



module.exports = app;