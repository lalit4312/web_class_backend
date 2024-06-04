const router = require('express').Router()
const productController = require('../controllers/productController')
// make a create product API
router.post('/create', productController.createProduct)

// fetch all
router.get('/get_all_products',productController.gteAllProducts)

//exporting
module.exports = router;