const express = require('express');
//const { check } = require('express-validator');
//const assetController = require('../controllers/asset-controller');
const router = express.Router();

//obtener todos los assets
router.get('/', assetController.getassets);

//Obtener asset por ID
router.get('/:id',assetController.getAssetById);

//Crear un nuevo asset
router.post('/create', assetController.createAsset );

//actualizar un asset
router.patch('/:uid', assetController.updateAsset );

//eliminar un asset
router.delete('/:uid', assetController.deleteAsset );


module.exports = router;
