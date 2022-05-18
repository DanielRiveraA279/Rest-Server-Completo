
const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        require: true
    },
    usuario: {
        type: Schema.Types.ObjectId, //otro objeto que vamos a tener en mongo
        ref: 'Usuario', //relacion contra Colecion de Usuario
        require: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: { //Aqui relacionamos producto con categoria
        type: Schema.Types.ObjectId,
        ref: 'Categoria', //que coleccion seria
        required: true
    },
    descripcion: { type: String },
    disponible: { type: Boolean, default: true },
    img: { type: String }
});

//Lo que va a devolver en formato JSON
ProductoSchema.methods.toJSON = function () {
    //con esto quito la version y el estado de categoria
    const { __v, estado, ...data } = this.toObject();
    return data;
}

module.exports = model('Producto', ProductoSchema);