const { json } = require('body-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/autenticacion')

let app = express();


app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    // Verificar si existe
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.JPG');
        // TypeError: path must be absolute or specify root to res.sendFile
        // resolve especifica rutas absolutas -> es como si pusiera res.sendFile('D:/CURSOS/node/07-restserver/server/assets/no-image.JPG');
        res.sendFile(noImagePath);
    }

});







// let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

module.exports = app;