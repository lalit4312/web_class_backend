const path = require('path');
const productModel=require('../models/productModel')

const createProduct = async (req, res) => {
    console.log(req.body)
    console.log(req.files)
    const { productName, productPrice, productDescription, productCategory } = req.body;

    if (!productName || !productPrice || !productDescription || !productCategory) {
        return res.status(400).json({
            success: false,
            message: "All the fields required"
        })

    }

    //check product image
    if (!req.files || !req.files.productImage) {
        return res.status(400).json({
            success: false,
            message: "Image not found!"
        })
    }

    const { productImage } = req.files;

    //uploading
    //1. generate unique name for each file
    const imageName = `${Date.now()}-${productImage.name}`;
    //2. define specific path
    const imageUploadPath = path.join(__dirname, `../public/products/${imageName}`)

    //3. upload to that path(await | trycatch)
    try {
        await productImage.mv(imageUploadPath)

        //save to database
        const newProduct=new productModel({
            productName:productName,
            productPrice:productPrice,
            productDescription:productDescription,
            productCategory:productCategory,
            productImage:imageName
        })
        const product=await newProduct.save();
        res.status(201).json({
            success:true,
            message:"Product created",
            data:product
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Internal server error",
            error: error
        })
    }
}
module.exports = {
    createProduct
}