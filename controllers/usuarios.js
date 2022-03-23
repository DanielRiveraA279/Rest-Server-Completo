const { response, request } = require('express');
const bcryptjs = require('bcryptjs'); //dependencia para encriptacion contraseñas

const Usuario = require('../models/usuario'); //esquema

const usuariosGet = async (req = request, res = response) => {
    //extraer los params nombre: tiene valor por defecto en caso que no envien el nombre
    const { limite = 5, desde = 0 } = req.query;

    //filtra solo los usuarios con estado 'true' mediante este objeto
    const query = { estado: true };

    //ejecutar colecciones de promesas por ordenf y una por una se tiene que ejecutar si una no ejecuta la que sigue tampoco
    //desestructuracion de arreglos total(rdo de la primera promesa, etc)
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(), //primera promesa para totalizar
        Usuario.find(query) // segunda promesa para filtrar y paginar
            .skip(Number(desde))
            .limit(Number(limite))
    ]);


    res.json({
        total,
        usuarios
    });
}


const usuariosPost = async (req, res = response) => {
    const { nombre, correo, password, rol } = req.body; //viene la info que envia el front
    const usuario = new Usuario({ nombre, correo, password, rol }); //asigno un nuevo objeto a mongo y le mando el nombre, correo, pass y rol

    //encriptar la contraseña
    if (password) {
        const salt = bcryptjs.genSaltSync(); //hacer mas complicado el metodo de encriptacion por defecto tiene 10
        usuario.password = bcryptjs.hashSync(password, salt); //encriptamos y que caiga en el usuario.password
    }

    //guardar en bd
    await usuario.save();

    res.status(201).json({
        usuario
    });
}

const usuariosPut = async (req, res = response) => {
    const { id } = req.params; //id es segun el nombre que le dimos en routes en el parametro
    //_id, pass, google y coreo se excluye
    const { _id, password, google, correo, ...resto } = req.body;

    //Validar contra base de datos
    if (password) {
        //encriptar contraseña
        const salt = bcryptjs.genSaltSync(); //hacer mas complicado el metodo de encriptacion por defecto tiene 10
        resto.password = bcryptjs.hashSync(password, salt); //encriptamos y que caiga en el usuario.password
    }

    //buscamos por id y actualizamos el ...resto de campos que desestructuramos
    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json(usuario)
}

const usuariosDelete = async(req, res) => {
    const {id} = req.params;

    //cambiar estado a false del registro para que simule una eliminacion para la vista del frontend
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})
    
    res.json(usuario);
}

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'path API - controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch,
}
