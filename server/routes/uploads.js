const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');



// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

    // si no vienen archivos
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    mensaje: 'No files were uploaded.'
                }
            });
    }

    let tipo = req.params.tipo;
    let id = req.params.id;

    //* validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    mensaje: 'el tipo no es válido'
                },
                tipo,
                tiposValidos
            });
    }



    let archivo = req.files.archivo; // se envía en body > form-data (type file)
    //* validar extensiones
    let nombreCortado = archivo.name.split('.'); //* [ 'nombre archivo', 'extension' ]
    let extension = nombreCortado[nombreCortado.length - 1]; // la última posición del array

    let extensionesValidas = ['PNG', 'JPEG', 'JPG', 'GIF'];

    console.log(extension);

    if (extensionesValidas.indexOf(extension) < 0) {

        return res.status(400)
            .json({
                ok: false,
                err: {
                    mensaje: 'la extensión no es válida'
                },
                extension
            });
    }


    //* Cambiar nombre al archivo -> que sea único y prevenir caché navegador
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        // aquí la img ya está cargada
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        }
        if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);
        }
    });
});


function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios'); // aunq suceda un error, la img si se subió y se quita para q no se llene el servidor de basura

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios'); // aunq suceda un error, la img si se subió y se quita para q no se llene el servidor de basura

            return res.status(500).json({
                ok: false,
                err: {
                    mensaje: 'usuario no existe'
                }
            });
        }

        // borrar el archivo por el que updateas
        borrarArchivo(usuarioDB.img, 'usuarios');


        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuarioGuardado,
                img: nombreArchivo
            })
        });

    });
}



function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos'); // aunq suceda un error, la img si se subió y se quita para q no se llene el servidor de basura

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos'); // aunq suceda un error, la img si se subió y se quita para q no se llene el servidor de basura

            return res.status(500).json({
                ok: false,
                err: {
                    mensaje: 'producto no existe'
                }
            });
        }

        // borrar el archivo por el que updateas
        borrarArchivo(productoDB.img, 'productos');

        console.log(productoDB);

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                productoGuardado,
                img: nombreArchivo
            })
        });

    })
}


function borrarArchivo(nombreImagen, tipo) {
    // console.log(tipo);
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    // console.log(pathImagen);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen); //! llevar cuidado con esto porq se pueden borrar cosas que no quieres 
    }
}

module.exports = app;