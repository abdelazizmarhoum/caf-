const express = require('express');
const router = express.Router();
const {
    getMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
    getAllMenuItemsManager
} = require('../controllers/menuController');
const { protect, manager, kitchen } = require('../middleware/authMiddleware');

router.route('/')
    .get(getMenuItems)
    .post(protect, manager, createMenuItem);

router.route('/manager').get(protect, manager, getAllMenuItemsManager);

router.route('/:id')
    .get(getMenuItemById)
    .put(protect, manager, updateMenuItem)
    .delete(protect, manager, deleteMenuItem);

router.route('/:id/availability').patch(protect, kitchen, toggleAvailability);

module.exports = router;
