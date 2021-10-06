const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');

//instalamos 
    //express, 
    //dotenv, 
    //cors, 
    //mongoose(para limitar quien va acceder osea desde el frontend), 
    //bcryptjs para la encriptacion de contraseñas
    //express-validator para la validacion de request recibidas

class Server {

    constructor() {
        //creamoa app de express aqui
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Conectar a base de datos
        this.conectarDB();
        
        //Middlewares
        this.middlewares();

        //rutas de mi app
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares() {
        //cors
        this.app.use(cors());

        //parseo y lectura del body que envio el front
        this.app.use(express.json());

        //publicamos directorio public esto para el index.html
        this.app.use(express.static('public'));
    }

    routes() {
        //aqui configuramos el path de las rutas para la api
        this.app.use(this.usuariosPath, require('../routes/usuarios'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;