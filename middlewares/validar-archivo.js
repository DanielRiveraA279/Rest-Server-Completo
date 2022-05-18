const { response } = require("express")

const validarArchivoSubir = (req, res = response, next) => {

    //validamos en caso que no enviemos el nombre del objeto 'archivo' que contendra el file en la request
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({ msg: 'No hay archivos que subir - validarArchivoSubir' });
    }

    next(); //si pasa continuamos con las siguientes lienas de codigo de donde se invoco
}

module.exports = {
    validarArchivoSubir
}