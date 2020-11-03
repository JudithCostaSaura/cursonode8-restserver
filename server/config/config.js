//? =========== PUERTO =============
process.env.PORT = process.env.PORT || 3000;


//? =========== ENTORNO =============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; // si la variante no existe supondré que estoy en desarrollo



//? =========== BASE DE DATOS =============
let urlDB;
/* if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe-cursonode';
} else {
    urlDB = 'mongodb+srv://judcsaura:C9uXq3ceIuvL7wXZ@cluster0.cjisb.mongodb.net/cafe';
} */
urlDB = 'mongodb+srv://judcsaura:C9uXq3ceIuvL7wXZ@cluster0.cjisb.mongodb.net/cafe';
process.env.URLDB = urlDB;