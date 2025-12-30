const Order = require('../models/Order');
const Table = require('../models/Table');
const MenuItem = require('../models/MenuItem');

// @desc    Place a new order
// @route   POST /api/orders
// @access  Public (Customer)
const placeOrder = async (req, res) => {
    const { tableNumber, items, customerNotes } = req.body;

    try {
        // 1. Validate Table
        let table = await Table.findOne({ tableNumber });
        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        // 2. Check for active order
        const activeOrder = await Order.findOne({
            tableNumber,
            status: { $in: ['pending', 'preparing'] }
        });

        if (activeOrder) {
            return res.status(400).json({ message: 'Table has an active order. Please wait.' });
        }

        if (items && items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // 3. Calculate total and validate items
        let totalAmount = 0;
        const orderItems = [];

        // Check menu items concurrently
        // Note: In production, rely on DB prices, not frontend prices.
        for (const item of items) {
            const menuItem = await MenuItem.findById(item._id);
            if (!menuItem) {
                return res.status(404).json({ message: `Item not found: ${item.name}` });
            }
            if (!menuItem.isAvailable) {
                return res.status(400).json({ message: `Item unavailable: ${menuItem.name}` });
            }

            orderItems.push({
                menuItemId: menuItem._id,
                name: menuItem.name,
                quantity: item.quantity,
                price: menuItem.price,
                selectedOptions: item.selectedOptions || [],
                specialInstructions: item.specialInstructions || ''
            });

            totalAmount += menuItem.price * item.quantity;
        }

        // 4. Create Order
        const order = new Order({
            tableId: table._id,
            tableNumber,
            items: orderItems,
            totalAmount,
            customerNotes,
            status: 'pending'
        });

        const createdOrder = await order.save();

        // 5. Update Table (Optional, but good for quick lookup)
        table.currentOrderId = createdOrder._id;
        await table.save();

        // 6. Emit Socket Event (Notify Kitchen)
        const io = req.app.get('io');
        if (io) {
            io.emit('new_order', createdOrder);
        }

        res.status(201).json(createdOrder);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order status
// @route   GET /api/orders/:id
// @access  Public
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (Kitchen)
// @route   GET /api/orders
// @access  Private/Kitchen
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ deletedAt: null })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Kitchen
const updateOrderStatus = async (req, res) => {
    const { status } = req.body; // 'preparing' or 'ready'

    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            // If status is cancelled, delete the order completely
            if (status === 'cancelled') {
                const { _id, tableNumber } = order;
                await Order.findByIdAndDelete(req.params.id);

                // Emit cancellation event so frontend knows
                const io = req.app.get('io');
                if (io) {
                    io.emit('order_cancelled', { orderId: _id, tableNumber, status: 'cancelled' });
                }

                return res.json({ message: 'Order cancelled and removed' });
            }

            // Normal status update
            order.status = status;
            // Record who updated it (if kitchen staff)
            if (req.user) {
                order.kitchenStaffId = req.user._id;
            }

            if (status === 'preparing') order.startedAt = Date.now();
            if (status === 'ready') order.readyAt = Date.now();

            const updatedOrder = await order.save();

            // Emit socket event for customer
            const io = req.app.get('io');
            if (io) {
                if (status === 'preparing') {
                    io.emit('order_started', { orderId: order._id, tableNumber: order.tableNumber, status: 'preparing' });
                } else if (status === 'ready') {
                    io.emit('order_ready', { orderId: order._id, tableNumber: order.tableNumber, status: 'ready' });
                }
            }

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get order history (Manager)
// @route   GET /api/orders/history
// @access  Private/Manager
const getOrderHistory = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const count = await Order.countDocuments({ status: { $in: ['ready', 'cancelled'] } }); // Only finished orders? Or all? User said history. Usually means past orders.
        // Let's assume history means completed orders, or maybe all inactive ones.
        // Or just ALL orders sorted by date.
        // User said "history of all the orders". Let's show all for now, or maybe exclude pending?
        // Let's show everything but sort by newest.

        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .populate('kitchenStaffId', 'fullName') // Get staff name
            .populate('tableId', 'tableNumber'); // Just in case, though we have tableNumber field

        res.json({
            orders,
            page,
            pages: Math.ceil(count / limit),
            total: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { placeOrder, getOrderById, getOrders, updateOrderStatus, getOrderHistory };
