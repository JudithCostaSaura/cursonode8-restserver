const express = require('express');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();

const Categoria = require('../models/categoria')

const _ = require('underscore');

app.get('/categoria', verificaToken, (req, res) => {
    // muestra todas las categorías
    Categoria.find({}, 'descripcion')
        .sort('descripcion')
        .populate('usuario', 'nombre email') // populate('nombreTabla', 'campo1 campo2')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        });
});

app.get('/categoria/:id', verificaToken, (req, res) => {
    // muestra una categoría en concreto
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    mensaje: 'La categoría no existe'
                }
            });
        }

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }



        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});


app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nueva categoria
    // req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuarioData._id // esto viene del verificaToken
    });


    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});


app.put('/categoria/:id', verificaToken, (req, res) => {
    // actualiza una categoría
    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});


app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // solo admin puede borrar una categoría
    // Categoria.findByIdAndRemove

    let id = req.params.id;
    Categoria.findByIdAndRemove(id, { new: true }, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaBorrada,
            mensaje: 'Categoría borrada'
        });
    });

});



module.exports = app;