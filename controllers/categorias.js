const {response} = require('express');
const {Categoria} = require('../models');


//obtenerCategorias - paginado - total - populate
const obtenerCategorias = async(req, res = response) => {
     
     const { limite = 5, desde = 0 } = req.query;

     const query = { estado: true };
 
     const [total, categorias] = await Promise.all([
         Categoria.countDocuments(query), //primera promesa para totalizar
         Categoria.find(query) // segunda promesa para filtrar y paginar
             .populate('usuario', 'nombre') //muestra datos de tabla relacionada con categoria
             .skip(Number(desde))
             .limit(Number(limite))
     ]);
 
 
     res.json({
         total,
         categorias
     });
}

const obtenerCategoria = async(req, res = response) => {
    const {id} = req.params;
    const categoria = await Categoria.findById(id)
        .populate('usuario', 'nombre');
    res.json(categoria);
}

const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase(); //grabamos en mayuscula el nombre de la categoria
    
    //busco para ver si existe una categoria con ese nombre
    const categoriaBD = await Categoria.findOne({nombre});

    //si existe una categoria enviamos un error 400, si no pasamos a las siguientes lienas de codigo
    if(categoriaBD){
        return res.status(400).json({
            msg: `La categoria ${categoriaBD.nombre}, ya existe`
        });
    }

    //generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id //asi lo guarda mongo
    }

    const categoria = new Categoria(data) //instanciamos el objeto tipo Categoria

    //Guardar en DB
    await categoria.save();

    res.status(201).json(categoria);

}

const actualizarCategoria = async(req,  res = response) => {

    const {id} = req.params; //lo que manda el frontend por params
    const {estado, usuario, ...data} = req.body; //lo que manda el frontend

    //camel case
    data.nombre = data.nombre.toUpperCase();

    //asigno el id al usuario
    data.usuario = req.usuario._id;

    //buscamos y actualizamos la categoria contra lo que realizo el frontend
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json(categoria);


}

const borrarCategoria = async(req, res = response) => {

    const {id} = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json(categoriaBorrada);

}

//borrarCategoria - estado:false

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}