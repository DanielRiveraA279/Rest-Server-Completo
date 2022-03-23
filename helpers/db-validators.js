const Role = require('../models/role');
const {Usuario, Producto, Categoria} = require('../models');

const esRolValido = async (rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`)
    }

}

const emailExiste = async (correo = '') => {
    //si el correo existe
    const existeEmail = await Usuario.findOne({ correo }) //buscamos el correo que mando en la request
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya está registrado`)
    }
}

const existeUsuarioPorId = async (id) => {
    //si el correo existe
    const existeUsuario = await Usuario.findById(id) //buscamos el correo que mando en la request
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`)
    }
}


const existeCategoriaPorId = async (id) => {
    //si el correo existe
    const existeCategoria = await Categoria.findById(id) //buscamos el correo que mando en la request
    if (!existeCategoria) {
        throw new Error(`El id ${id} no existe`)
    }
}

const existeProductoPorId = async (id) => {
    //si el correo existe
    const existeProducto = await Producto.findById(id) //buscamos el correo que mando en la request
    if (!existeProducto) {
        throw new Error(`El id ${id} no existe`)
    }
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}