
const { Schema, model } = require('mongoose');


//Creamos coleccion Usuario:

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true, //evitar duplicidad
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
    },
    rol: {

        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false,
    }

});

UsuarioSchema.methods.toJSON = function () {
    //1- sacamos la version y password
    //2- y todo lo demas va a ser almacenado en usuario que le puedu poner cualquier nombre a ese usuario
    const { __v, password, _id, ...usuario } = this.toObject();

    usuario.uid = _id;

    return usuario //retornamos solo usuario
}

//nombre del esquema y el esquema en si
module.exports = model('Usuario', UsuarioSchema)

