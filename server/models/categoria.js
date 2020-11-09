//? Modelo Categoría

//! Conexión con mongo
const mongoose = require('mongoose');
// para la creación de objetos
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'El campo nombre es requerido']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

/* categoriaSchema.methods.toJSON = function() {
    //** Para no retornar el id en la respuestad 
    let category = this;
    let categoryObject = category.toObject();
    delete categoryObject._id;

    return categoryObject;
} */

module.exports = mongoose.model('Categoria', categoriaSchema); //nombre que quiero darle al modelo, configuración que llevará