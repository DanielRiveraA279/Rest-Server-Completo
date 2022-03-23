
const {Schema, model} = require('mongoose');

const CategoriaSchema = Schema({
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
    }
});

//Lo que va a devolver en formato JSON
CategoriaSchema.methods.toJSON = function () {
    //con esto quito la version y el estado de categoria
    const { __v, estado, ...data } = this.toObject();
    return data;
}

module.exports = model('Categoria', CategoriaSchema);