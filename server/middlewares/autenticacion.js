const jwt = require('jsonwebtoken');

//* =========== VERIFICAR TOKEN =============
let verificaToken = (req, res, next) => {

    // next lo que hace es contiuar la ejecución del programa
    // si no se llama a next, se detendrá la ejecución aquí

    let token = req.get('token'); // así se cogen los parámetros de los headers

    jwt.verify(token, process.env.SEED_TOKEN, (err, decodedInfo) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    mensaje: 'token no válido'
                }
            });
        }

        req.usuarioData = decodedInfo.usuario;

        next();
    });

}


//* =========== VERIFICAR ADMIN_ROLE =============

let verificaAdminRole = (req, res, next) => {

    let usuarioData = req.usuarioData;

    if (usuarioData.role === 'ADMIN_ROLE') {
        next();

    } else {
        return res.json({
            ok: false,
            err: {
                mensaje: 'el user no es admin'
            }
        });
    }

}

module.exports = {
    verificaToken,
    verificaAdminRole
}