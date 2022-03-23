const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const {esAdminRole} = require('../middlewares/validar-roles');

const { 
    crearCategoria, 
    obtenerCategorias, 
    existeCategoria, 
    obtenerCategoria, 
    actualizarCategoria,
    borrarCategoria} = require('../controllers/categorias');
const {existeCategoriaPorId} = require('../helpers/db-validators');

const router = Router();

//obtener todas las categorias
router.get('/', obtenerCategorias);

//obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo valido').isMongoId(),
    validarCampos,
    check('id').custom(existeCategoriaPorId) //le asigno el id al metodo existeCategoriaPorId
    // check('id').custom(existeCategoria)
], obtenerCategoria);

//crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//actualizar - privado cualquier con token valido
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
] , actualizarCategoria );

//borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
], borrarCategoria);

module.exports = router;