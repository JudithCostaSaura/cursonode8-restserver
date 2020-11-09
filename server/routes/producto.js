//? === Constantes requeridos ===
const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');
const app = express();
const Producto = require('../models/producto');
const _ = require('underscore');


//? === Rutas ===

// * Buscar Productos
app.get('/productos/buscar/:busqueda', verificaToken, (req, res) => {

    let busqueda = req.params.busqueda;

    let regex = new RegExp(busqueda, 'i'); // la i es para que no distinga mayus y minus


    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});




app.get('/productos', verificaToken, (req, res) => {
    // muestra todas las categorías
    // paginado
    let desde = req.query.desde || 0;

    desde = Number(desde);


    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                paginacion: 'de 5 en 5',
                productos
            });

        });
});

app.get('/producto/:id', verificaToken, (req, res) => {
    // muestra una categoría en concreto
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        mensaje: 'el producto no existe'
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
                producto: productoDB
            });
        });
});


app.post('/producto', verificaToken, (req, res) => {
    // crear un producto específico
    // grabar usuario y categoría

    let body = req.body; // Obtenemos la información del POST con body parser

    let produto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuarioData._id

    });


    produto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            mensaje: 'Producto creado',
            productoDB,
        });

    });



});


app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let body = req.body;

    console.log(body);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});


app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let disp = _.pick(req.body, ['disponible']);


    Producto.findById(id, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        productoBorrado.disponible = false;

        productoBorrado.save(productoBorrado)
        res.json({
            ok: true,
            productoBorrado,
            mensaje: 'Producto borrado'
        });

    });
});








module.exports = app;