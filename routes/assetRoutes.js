const express = require('express');
//const { check } = require('express-validator');
const {getAssets, getAssetById, createAasset, updateAsset, deleteAsset} = require('../controllers/assetController');
const router = express.Router();

//obtener todos los assets
router.get('/', getAssets);

//Obtener asset por ID
router.get('/:id',getAssetById);

//Crear un nuevo asset
router.post('/create', createAasset );

//actualizar un asset
router.patch('/:id', updateAsset );

//eliminar un asset
router.delete('/:id', deleteAsset );


module.exports = router;
