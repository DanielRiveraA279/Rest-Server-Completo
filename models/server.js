const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

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

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios: '/api/usuarios',
            uploads: '/api/uploads'
        }

        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //rutas de mi app
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        //cors
        this.app.use(cors());

        //parseo y lectura del body que envio el front
        this.app.use(express.json());

        //publicamos directorio public esto para el index.html
        this.app.use(express.static('public'));

        //FileUpload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true //crea carpeta como le  indiquemos si es que no esta creada
        }));

    }

    routes() {
        //aqui configuramos el path de las rutas para la api
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.buscar, require('../routes/buscar'))
        this.app.use(this.paths.categorias, require('../routes/categorias'))
        this.app.use(this.paths.productos, require('../routes/productos'))
        this.app.use(this.paths.usuarios, require('../routes/usuarios'))
        this.app.use(this.paths.uploads, require('../routes/uploads'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;