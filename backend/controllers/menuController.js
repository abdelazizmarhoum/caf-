const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
    try {
        const items = await MenuItem.find({ deletedAt: null });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
const getMenuItemById = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get menu items (Manager view - includes inactive)
// @route   GET /api/menu/manager
// @access  Private/Manager
const getAllMenuItemsManager = async (req, res) => {
    try {
        const items = await MenuItem.find({ deletedAt: null });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private/Manager
const createMenuItem = async (req, res) => {
    const { name, description, price, category, imageUrl, availableFrom, availableTo } = req.body;

    try {
        const menuItem = new MenuItem({
            name,
            description,
            price,
            category,
            imageUrl,
            availableFrom,
            availableTo,
            availableDays: req.body.availableDays // Add this
        });

        const createdItem = await menuItem.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private/Manager
const updateMenuItem = async (req, res) => {
    const { name, description, price, category, imageUrl, availableFrom, availableTo, isAvailable, isActive } = req.body;

    try {
        const menuItem = await MenuItem.findById(req.params.id);

        if (menuItem) {
            menuItem.name = name || menuItem.name;
            menuItem.description = description || menuItem.description;
            menuItem.price = price || menuItem.price;
            menuItem.category = category || menuItem.category;
            menuItem.imageUrl = imageUrl || menuItem.imageUrl;
            menuItem.availableFrom = availableFrom !== undefined ? availableFrom : menuItem.availableFrom;
            menuItem.availableTo = availableTo !== undefined ? availableTo : menuItem.availableTo;
            menuItem.availableDays = req.body.availableDays !== undefined ? req.body.availableDays : menuItem.availableDays; // Add this
            menuItem.isAvailable = isAvailable !== undefined ? isAvailable : menuItem.isAvailable;
            menuItem.isActive = isActive !== undefined ? isActive : menuItem.isActive;

            const updatedItem = await menuItem.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a menu item (Soft delete)
// @route   DELETE /api/menu/:id
// @access  Private/Manager
const deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);

        if (menuItem) {
            menuItem.deletedAt = Date.now();
            await menuItem.save();
            res.json({ message: 'Menu item removed' });
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle availability (Kitchen staff)
// @route   PATCH /api/menu/:id/availability
// @access  Private/Kitchen
const toggleAvailability = async (req, res) => {
    const { isAvailable } = req.body;

    try {
        const menuItem = await MenuItem.findById(req.params.id);

        if (menuItem) {
            menuItem.isAvailable = isAvailable;
            const updatedItem = await menuItem.save();

            // Emit socket event for real-time updates
            // req.app.get('io').emit('menu_updated', { itemId: updatedItem._id, isAvailable });

            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


module.exports = {
    getMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
    getAllMenuItemsManager
};
