const express = require('express');
const router = express.Router();
const { placeOrder, getOrderById, getOrders, updateOrderStatus, getOrderHistory } = require('../controllers/orderController');
const { protect, kitchen, manager } = require('../middleware/authMiddleware');

router.route('/')
    .post(placeOrder)
    .get(protect, kitchen, getOrders);


router.route('/history').get(protect, manager, getOrderHistory);

router.route('/:id').get(getOrderById);
router.route('/:id/status').patch(protect, kitchen, updateOrderStatus);

module.exports = router;
