const path = require('path');
const productModel = require('../models/productModel');
const fs = require('fs')

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
        const newProduct = new productModel({
            productName: productName,
            productPrice: productPrice,
            productDescription: productDescription,
            productCategory: productCategory,
            productImage: imageName
        })
        const product = await newProduct.save();
        res.status(201).json({
            success: true,
            message: "Product created",
            data: product
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

// fetch all products
const gteAllProducts = async (req, res) => {
    //#. try catch
    try {
        // 1. find all the products(Await)
        const products = await productModel.find({})
        // 2. send response
        res.status(201).json({
            success: true,
            message: 'product fetched successfully',
            products: products
        })

    } catch (error) {
        console.log(e);
    }
};

// fetch single product
const getProduct = async (req, res) => {

    //rceive id from URL
    const productId = req.params.id;

    try {
        const product = await productModel.findById(productId)
        res.status(201).json({
            success: true,
            message: "Product Fetched!",
            product: product
        })


    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Server error!"
        })

    }

}


// delete product 
const deleteProduct = async (req, res) => {
    // get product id
    const productId = req.params.id;

    try {
        const existingProduct = await productModel.findById(req.params.id)
        const oldImagePath = path.join(__dirname, `../public/products/${existingProduct.productImage}`)

        // delete from file system
        fs.unlinkSync(oldImagePath)
        await productModel.findByIdAndDelete(productId)

        //fetch products

        res.status(201).json({
            success: true,
            message: "product deleted"
            // updated productlist

        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })

    }
}

// update product
// 1. get a  update id
// 2. if new image is provided
// 3. Upload(public)
// 4. Delete old image- yeslai delete product ma ne implement garney
// 5. update products

const updateProduct = async (req, res) => {
    try {

        // if there is files, upload new and delete old
        if (req.files && req.files.productImage) {

            // upload new to /public/products
            // 1. destructire file
            const { productImage } = req.files;

            //make a new image name
            const imageName = `${Date.now()}-${productImage.name}`;

            //2. define specific path
            const imageUploadPath = path.join(__dirname, `../public/products/${imageName}`)

            // move to folder
            await productImage.mv(imageUploadPath)

            // replace productImage name to new name
            req.body.productImage = imageName

            // # delete old image
            // #.1 find product imformation(we have only ID)
        }
        const existingProduct = await productModel.findById(req.params.id)
        // search that inage in directory
        if (req.body.productImage) {// if new image is uploaded, then only remove old image
            const oldImagePath = path.join(__dirname, `../public/products/${existingProduct.productImage}`)

            // delete from file system
            fs.unlinkSync(oldImagePath)

        }

        // update in database
        const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body)
        res.status(201).json({
            success: true,
            message: "Product Updated Successfully",
            updatedProduct: updatedProduct
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: true,
            message: "Internal server error",
            error: error
        })

    }

}

module.exports = {
    createProduct,
    gteAllProducts,
    getProduct,
    deleteProduct,
    updateProduct
}