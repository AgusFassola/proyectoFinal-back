const { validationResult } = require('express-validator');
const Asset = require('../model/Asset');
const HttpError = require('../model/http-error');


//Agregar un asset
const createAsset = async(req, res, next ) => {

    const errors = validationResult(req);
    if (!errors.isEmpty) {
        return next(new HttpError(
            'Datos ingresados incorrectos',
             422//errores de semántica
        ));
    }

    const { description, category, assigned_employee, assigned_date } = req.body;
    
    const createdAsset = new Asset({
        description,
        category,
        assigned_employee,
        assigned_date

    });
    
    try{
        await createdAsset.save();
    }catch(err){
        const error = new HttpError(
            'Error al crear el asset',
            500
        )
        return next(error);
    }
    //201 solicitud con exito
    res.status(201).json({
        asset: createdAsset.toObject({
            getters: true
        })
    })
};

//Obtener los assets
const getAssets = async (req, res, next) => {

    const { description, assigned_employee, assigned_date, page = 1, limit = 20 } = req.query;
    let query = {};

    if (description) query.description = description

    if( assigned_employee ) query.assigned_employee = new RegExp( assigned_employee, 'i');
    if( assigned_date ) query.assigned_date = new RegExp( assigned_date, 'i');

    let assets;
    try{
        assets = await Asset.find(query)
            .skip((page -1) * limit)
            .limit(parseInt(limit));

        const total = await Asset.countDocuments(query);

        res.json({ 
            assets: assets.map( asset =>
                 asset.toObject({ getters: true })
            ),
            totalPages: Math.ceil( total / limit ),
            currentPage: parseInt(page),
        });
    }catch(err){
        const error = new HttpError(
            'No se pudo recuperar los assets',
            500
        )
        console.log("error:",err);
        return next(error);
    }
    
};

//Actualizar datos del asset
const updateAsset = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError(
            'Datos ingresados incorrectos',
             422//errores de semántica
        ));
    }
    console.log("paso al servicio")

    const { description, category, assigned_employee, assigned_date } = req.body;
    const assetId = req.params.id;
    console.log("asset id:",req.params);
    console.log("body:", req.body);

    let asset;

    try{
       asset =  await Asset.findById(assetId);

       if(!asset){
            return next(new HttpError(
                'asset no encontrado',
                404//not-found
            ));
       }

       if(description) asset.description = description;
       if(category) asset.category = category;
       if(assigned_employee) asset.assigned_employee = assigned_employee;
       if(assigned_date) asset.assigned_date = assigned_date;

       await asset.save();
    }catch(err){
        console.log("error2:",err)

        const error = new HttpError(
            'Error al actualizar el asset',
            500
        )
        console.log(err);
        return next(error);
    }
    //200 solicitud con exito
    res.status(200).json({
        asset: asset.toObject({ getters: true })
    })
};

//eliminar un asset
const deleteAsset = async (req, res, next) => {
    const assetId = req.params.id;

    let asset;
    try{
        asset = await Asset.findById(assetId);
        await asset.deleteOne();
    }catch(err){
        const error = new HttpError(
            'Error al eliminar el asset',
            500
        )
        console.log(err);
        return next(error);
    }
    //200 solicitud con exito
    res.status(200).json({ message: 'asset eliminado' });
};

//mostrar detalles de un asset
const getAssetById = async (req, res, next) => {
    const assetId = req.params.id;
    console.log(req.params)
    console.log("id:", assetId)
    let asset;
    try{
        asset = await Asset.findById(assetId)
    }catch(err){
        const error = new HttpError(
            'No se encontró al asset',
            500
        )
        console.log(err);
        return next(error);
    }
    res.json({ 
        asset: asset.toObject({ getters: true })
    });
};


exports.createAasset = createAsset;
exports.getAssets = getAssets;
exports.updateAsset = updateAsset;
exports.deleteAsset = deleteAsset;
exports.getAssetById = getAssetById;