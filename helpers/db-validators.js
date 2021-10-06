const Role = require('../models/role');
const Usuario = require('../models/usuario');

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

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId
}