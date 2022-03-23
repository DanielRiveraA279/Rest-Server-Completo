const { response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); //si es id de mongo envia un TRUE

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : [] //si existe un usuario envio data si no un arreglo vacio
        });
    }

    const regexp = new RegExp(termino, 'i'); //Expresion Regular: Para buscar coincidencias en palabras

    //Usuairo.Count para obtener la cantidad
    const usuarios = await Usuario.find({
        //NOTA: Condicionales para obtener resultados
        $or: [{ nombre: regexp }, { correo: regexp }], //para colocar condiciones o busca por nombre o por correo electronico
        $and: [{ estado: true }]
    });  //buscamos con expresion regular regexp las coincidencias de palabras

    res.json({
        results: usuarios
    });
}

const buscarCategorias = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); //si es id de mongo envia un TRUE

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : [] //si existe un usuario envio data si no un arreglo vacio
        });
    }

    const regexp = new RegExp(termino, 'i'); //Expresion Regular: Para buscar coincidencias en palabras

    //Usuairo.Count para obtener la cantidad
    const categorias = await Categoria.find({ nombre: regexp, estado: true });

    res.json({
        results: categorias
    });
}
const buscarProductos = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino); //si es id de mongo envia un TRUE

    if (esMongoID) {
        const producto = await Producto.findById(termino)
            .populate('categoria', 'nombre');

        return res.json({
            results: (producto) ? [producto] : [] //si existe un usuario envio data si no un arreglo vacio
        });
    }

    const regexp = new RegExp(termino, 'i'); //Expresion Regular: Para buscar coincidencias en palabras

    //Usuairo.Count para obtener la cantidad
    const productos = await Producto.find({ nombre: regexp, estado: true })
        .populate('categoria', 'nombre');;

    res.json({
        results: productos
    });
}

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    //validamos si la coleccion que envia el front esta dentro de las colecciones permitidas
    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            })
            break;
    }

}

module.exports = {
    buscar
}