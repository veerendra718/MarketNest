const express = require('express');
const router = express.Router();

const {
    createProduct,
    updateProduct,
    deleteProduct,
    getMarketplace,
    getProductById,
    getMyProducts,
    getDashboardStats
} = require('../controllers/productController');

const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { upload } = require('../config/cloudinary');

// Customer routes
router.get('/', verifyToken, requireRole('customer'), getMarketplace);

// Brand routes
router.get('/my', verifyToken, requireRole('brand'), getMyProducts);
router.get('/dashboard', verifyToken, requireRole('brand'), getDashboardStats);
router.post('/', verifyToken, requireRole('brand'), upload.array('images', 5), createProduct);
router.put('/:id', verifyToken, requireRole('brand'), upload.array('images', 5), updateProduct);
router.delete('/:id', verifyToken, requireRole('brand'), deleteProduct);

// Customer Dynamic route
router.get('/:id', verifyToken, getProductById);

module.exports = router;