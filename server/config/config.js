//? =========== PUERTO =============
process.env.PORT = process.env.PORT || 3000;


//? =========== ENTORNO =============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; // si la variante no existe supondré que estoy en desarrollo



//? =========== BASE DE DATOS =============
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe-cursonode';
} else {
    urlDB = process.env.MONGO_URL; // ir a tips.js - VARIABLES ENTORNO MONGO para explicación de esta línea
}
process.env.URLDB = urlDB;


// Para el archivo: login.js
//? =========== FECHA EXPIRACIÓN =============
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//? =========== SEED DE AUTENTICACIÓN =============
process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'seed-desarrollo'; // la primera está declarada en heroku