//tecnica de importacion y exportacion de archivos

const validaCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');

module.exports = {
    //incorporamos operador de propagacion por si dentro de cada constantes vienen mas middlewares nuevos
    ...validaCampos,
    ...validarJWT,
    ...validaRoles
}