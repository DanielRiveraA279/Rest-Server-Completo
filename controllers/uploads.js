const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL); //CONFIGURAMOS PARA HACER CONEXION A CLOUDINARY

const { response } = require('express');
const { subirArchivo } = require('../helpers');

const { Usuario, Producto } = require('../models');
const { kill } = require('process');

const cargarArchivo = async (req, res = response) => {
    try {
        //envio el archivo
        // const nombre = await subirArchivo(req.files, ['txt', 'md']);
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({ nombre });
    } catch (msg) {
        res.status(400).json({
            msg
        });
    }
}

const actualizarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id) //validamos si existe el id en la coleccion Usuario
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id) //validamos si existe el id en la coleccion Usuario
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    //Limpiar imagenes previas en caso que exista para que no se repita las imagenes
    if (modelo.img) {
        //construimos el paht
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if (fs.existsSync(pathImagen)) { //si existe el file system
            fs.unlinkSync(pathImagen); //borramos archivo
        }
    }

    //subirArchivo(file, extensiones, nombre del la carpeta)
    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre; //modelo contiene el user o producto que busque

    await modelo.save();
    res.json(modelo);
}

const actualizarImagenCloudinary = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id) //validamos si existe el id en la coleccion Usuario
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id) //validamos si existe el id en la coleccion Usuario
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    //Limpiar imagenes previas en caso que exista para que no se repita las imagenes
    if (modelo.img) {
        const nombreArr = modelo.img.split('/'); //cortamos la url de la imagen
        const nombre = nombreArr[nombreArr.length - 1]; //selecionamos el ultimo elemento cortado por split
        const [public_id] = nombre.split('.'); //cortamos solo el id sin la .extension
        cloudinary.uploader.destroy(public_id); //borramos de cloudinary
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url; //guardamos url de la imagen alojada

    await modelo.save();

    res.json(modelo);
}

const mostrarImage = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id) //validamos si existe el id en la coleccion Usuario
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id) //validamos si existe el id en la coleccion Usuario
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' })
    }

    //Limpiar imagenes previas en caso que exista para que no se repita las imagenes
    if (modelo.img) {
        //construir el path
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if (fs.existsSync(pathImagen)) { //si existe el file system
            return res.sendFile(pathImagen) //enviamos imagen, como respuesta
        }
    }

    //cuando no tiene imagen el producto o usuario, devuelve una imagen not found
    const pathImagen = path.join(__dirname, '../assets/no-image.jpeg');
    res.sendFile(pathImagen);
}



module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImage,
    actualizarImagenCloudinary
}