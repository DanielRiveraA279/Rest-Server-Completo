require('dotenv').config();
const Server = require('./models/server');

const server = new Server(); //instanciamos un objeto para que hagarra todas las funcionalidades de la clase

server.listen();