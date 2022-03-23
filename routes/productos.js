const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const {esAdminRole} = require('../middlewares/validar-roles');

const { 
    crearProducto, 
    obtenerProductos, 
    obtenerProducto, 
    actualizarProducto,
    borrarProducto} = require('../controllers/productos');

const {existeCategoriaPorId, existeProductoPorId} = require('../helpers/db-validators');

const router = Router();

//obtener todas las categorias
router.get('/', obtenerProductos);

//obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo valido').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoPorId) //le asigno el id al metodo existeCategoriaPorId
], obtenerProducto);

//crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

//actualizar - privado cualquier con token valido
router.put('/:id',[
    validarJWT,
    check('id').custom(existeProductoPorId),
    validarCampos
] , actualizarProducto );

//borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
], borrarProducto);

module.exports = router;