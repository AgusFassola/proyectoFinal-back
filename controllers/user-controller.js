const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const HttpError = require('../model/http-error');
const User = require('../model/user');

//para obtener todos los usuarios(solo puede el admin)
const getUsers = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    
    let users;
    try{
        users = await User.find({}, '-password')
        .skip(( page - 1) * limit)
        .limit(Number( limit ));

        const total = await User.countDocuments();

        res.json({ users: users.map( user => 
            user.toObject({ getters:true})
            ),
            currentPage: Number(page),
            totalPages:  Math.ceil( total / limit )//ceil redondea para arriba
        });
    }catch(err){
        const error = new HttpError(
            'Error al obtener el usuario',
            500
        );
        return next(error)
    }
    
}

//Registrar un nuevo usuario(solo puede admin)
const createUser = async (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){ //hay errores
        const error = new HttpError(
            'Datos ingresados incorrectos',
            422//errores de semántica
        )
        return next(error);
    }

    const { username, email, password, role } = req.body;
    let existingUser;
    console.log("llegó usuario:", req.body)

    try{
        existingUser = await User.findOne({ email:email });//({email})
    }catch(err){
        const error = new HttpError(
            'Falló el registro',
            500//Internal server error
        )
        return next(error);
    }

    if(existingUser){
        const error = new HttpError(
            'El usuario ya existe',
            422//errores de semántica
        )
        return next(error);
    }

    //encriptar la contraseña antes de guardarla
    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password, 12);
    }catch(err){
        const error = new HttpError(
            'Error al crear el usuario',
            500//Internal server error
        )
        return next(error);
    }

    const createdUser = new User({
        username,
        email,
        password: hashedPassword,
        role//por defecto es user
    });
    try{
        await createdUser.save();
    }catch(err){
        const error = new HttpError(
            'Error al registrar el usuario',
            500//Internal server error
        )
        return next(error);
    }

    //201 solicitud con exito
    res.status(201).json({
        userId:createdUser.id,
        email: createdUser.email
    });
};

//eliminar usuario
const deleteUser = async (req, res, next) => {
    const userId = req.params.uid;

    let existingUser;

    try{
        existingUser = await User.findById(userId);
        await existingUser.deleteOne();
    }catch(err){
        const error = new HttpError(
            'Error al eliminar el usuario',
            500
        )
        console.log(err);
        return next(error);
    }
    //200 solicitud con exito
    res.status(200).json({ message: 'Usuario eliminado' });
};


// Iniciar sesión
const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Usuario incorrecto',
             403//no posee permisos
        );
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt
        .compare( password, existingUser.password );
    } catch (err) {
        const error = new HttpError(
            'No se pudo verificar las credenciales', 
            500
        );
        return next(error);
    }

    if (!isValidPassword) {
        const error = new HttpError(
            'Contraseña incorrecta', 
            403
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { 
                role: existingUser.role,
                userId: existingUser.id, 
                email: existingUser.email 
            },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Error en la autenticación',
             500
        );
        return next(error);
    }

    res.json({ 
        userId: existingUser.id, 
        email: existingUser.email, 
        token: token 
    });
};

exports.getUsers = getUsers;
exports.createUser = createUser;
exports.deleteUser = deleteUser;
exports.login = login;

