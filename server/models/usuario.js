//? Modelo Usuario

//! Conexión con mongo
const mongoose = require('mongoose');

// Para las validaciones
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido' // lo que hay entre llaves lo coge automáticamente de lo que se le manda
}

// para la creación de objetos
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El campo nombre es requerido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El campo email es requerido']
    },
    password: {
        type: String,
        required: [true, 'El campo password es requerido']
    },
    img: {
        type: String,
        required: false //esto se puede poner o no
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});


usuarioSchema.methods.toJSON = function() {
    //** Para no retornar la contraseña en la respuestad */ 
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


// Validaciones
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' }); // lo que hay entre llaves lo coge automáticamente de lo que se le manda

module.exports = mongoose.model('Usuario', usuarioSchema); //nombre que quiero darle al modelo, configuración que llevará