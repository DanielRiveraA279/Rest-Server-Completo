const {response} = require('express');
const {Producto} = require('../models');


//obtenerCategorias - paginado - total - populate
const obtenerProductos = async(req, res = response) => {
     
     const { limite = 5, desde = 0 } = req.query;

     const query = { estado: true };
 
     const [total, productos] = await Promise.all([
         Producto.countDocuments(query), //primera promesa para totalizar
         Producto.find(query) // segunda promesa para filtrar y paginar
             .populate('usuario', 'nombre') //muestra datos de tabla relacionada con categoria
             .populate('categoria', 'nombre')
             .skip(Number(desde))
             .limit(Number(limite))
     ]);
 
 
     res.json({
         total,
         productos
     });
}

const obtenerProducto = async(req, res = response) => {
    const {id} = req.params;
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');
    res.json(producto);
}

const crearProducto = async(req, res = response) => {

    const {estado, usuario, ...body} = req.body; //grabamos en mayuscula el nombre de la categoria
    
    //busco para ver si existe una categoria con ese nombre
    const productoDB = await Producto.findOne({nombre: body.nombre});

    //si existe una categoria enviamos un error 400, si no pasamos a las siguientes lienas de codigo
    if(productoDB){
        return res.status(400).json({
            msg: `La producto ${categoriaBD.nombre}, ya existe`
        });
    }

    //generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id //asi lo guarda mongo
    }

    const producto = new Producto(data) //instanciamos el objeto tipo Categoria

    //Guardar en DB
    await producto.save();

    res.status(201).json(producto);

}

const actualizarProducto = async(req,  res = response) => {

    const {id} = req.params; //lo que manda el frontend por params
    const {estado, usuario, ...data} = req.body; //lo que manda el frontend

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    //camel case
    data.nombre = data.nombre.toUpperCase();

    //asigno el id al usuario
    data.usuario = req.usuario._id;

    //buscamos y actualizamos la categoria contra lo que realizo el frontend
    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json(producto);
}

const borrarProducto = async(req, res = response) => {

    const {id} = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json(productoBorrado);

}

//borrarProducto - estado:false

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}