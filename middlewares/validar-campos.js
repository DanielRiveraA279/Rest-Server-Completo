const {validationResult} = require('express-validator');


const validarCampos = (req, res, next) => {
    const errors = validationResult(req);

    //si hay errores entonces muestro el error que aplique en routes en el metodo post
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    next(); // si no cae en el error  entonces sigue con el siguiente cmiddleeware
}

module.exports = {
    validarCampos
}