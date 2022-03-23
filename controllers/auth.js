const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {

    const { correo, password } = req.body; //lo que envia el frontend

    try {
        //verificar si el email existe
        const usuario = await Usuario.findOne({ correo }); //buscamos y comparamos con lo que envia el frontend

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario /Password no son correctos - correo'
            });
        }

        //SI el user esta activo en la bd
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Estado false'
            });
        }


        //verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password); //compara la contraseña contra la contraseña que tiene la bd
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        //generar el JWT (npm install jsonwebtoken)
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;

    console.log(id_token);
    try {
        const {correo, nombre, img} = await googleVerify(id_token);
        let usuario = await Usuario.findOne({correo});
        
        if(!usuario){
            //Tengo que crearlo si no existe el usuario
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: 'USER_ROLE',
                google: true
            }  

            usuario = new Usuario(data);
            await usuario.save(); //grabamos en la BD
        }

        //si el usuario en BD
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }   

        //generar el jwt
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {

        console.log('error token', error);

        
        res.status(400).json({
            ok: false,
            msg: 'El Token no se pudo verificar'
        });
    }

    res.json({
        msg: 'Todo bien',
        id_token
    })
}

module.exports = {
    login,
    googleSignIn
}