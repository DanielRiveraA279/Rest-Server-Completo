const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;

        //obtiene las cadenas y las separa donde halla un punto, y las devuelve como array
        const nombreCortado = archivo.name.split('.');

        //selecciona ultimo elemento del array
        const extension = nombreCortado[nombreCortado.length - 1];

        //si no se cumple, hay otras extensiones
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no es permitida - ${extensionesValidas}`)
        }

        const nombreTemp = uuidv4() + '.' + extension; //generamos un id unico con uuid, mas la extension obtenida del archivo a subir

        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(nombreTemp); //salio todo bien y enviamos el path
        });

    });


}

module.exports = {
    subirArchivo
};