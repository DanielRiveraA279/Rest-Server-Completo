
//aqui reunios todos los modulos para exportarlos en un solo archivo para mejor organizacion

const Categoria = require('./categoria');
const Producto = require('./producto');
const Role = require('./role');
const Server = require('./server');
const Usuario = require('./usuario');

module.exports = {
    Categoria,
    Producto,
    Role,
    Server,
    Usuario,
}