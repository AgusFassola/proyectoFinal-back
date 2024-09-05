const express = require('express');
const { check } = require('express-validator');
const {getUsers, createUser, deleteUser, login } = require('../controllers/user-controller');
const authUser = require('../middleware/auth-user');
const checkAdmin = require('../middleware/check-admin');

const router = express.Router();

//obtener todos los usuarios(solo admin)
router.get('/', getUsers);

//registrar un nuevo usuario
router.post('/create',
    [
        check('username').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 3 })
    ],
    createUser
);

//eliminar usuario
router.delete('/:uid',deleteUser);

//para iniciar sesion
router.post('/login', login);

module.exports = router;
