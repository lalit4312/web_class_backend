const router = require('express').Router()
const productController = require('..controllers/productController')
router.post('/create', productController.createProduct)

//exporting
module.exports = router;