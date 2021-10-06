
const { Router } = require('express');
const { check } = require('express-validator');

const {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch } = require('../controllers/usuarios');
const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();

//aqui hacemos los metodos get, post y put
router.get('/', usuariosGet);

router.put('/:id',
    [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        check('rol').custom(esRolValido),
        validarCampos
    ]
    , usuariosPut); // :id esto captura el dato enviado por parametro


router.post('/', [
    //midleware se ejecutan antes de un controlador
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), //que no debe ser vacio
    check('password', 'El password debe contener mas de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    check('rol').custom((rol) => esRolValido(rol)),

    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']), //solo deben ser roles que esten difinido en este array
    validarCampos //el middleware pasa verificando los checks entonnces recien ejecuta controlador
], usuariosPost);

router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;

