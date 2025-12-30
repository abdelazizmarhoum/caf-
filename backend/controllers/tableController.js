const Table = require('../models/Table');
const Order = require('../models/Order');

// @desc    Get table status & info
// @route   GET /api/tables/:number
// @access  Public
const getTableStatus = async (req, res) => {
    const tableNumber = req.params.number;

    try {
        let table = await Table.findOne({ tableNumber });

        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        const activeOrder = await Order.findOne({
            tableNumber,
            status: { $in: ['pending', 'preparing'] }
        }).sort({ createdAt: -1 });

        res.json({
            tableNumber: table.tableNumber,
            isAvailable: !activeOrder,
            activeOrder: activeOrder ? activeOrder._id : null,
            status: activeOrder ? activeOrder.status : 'free'
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all tables (Manager)
// @route   GET /api/tables
// @access  Private/Manager
const getTables = async (req, res) => {
    try {
        const tables = await Table.find().sort({ tableNumber: 1 });
        res.json(tables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new table
// @route   POST /api/tables
// @access  Private/Manager
const createTable = async (req, res) => {
    const { tableNumber } = req.body;
    try {
        const existingTable = await Table.findOne({ tableNumber });
        if (existingTable) {
            return res.status(400).json({ message: 'Table already exists' });
        }

        const table = await Table.create({
            tableNumber,
            qrCodeUrl: `/table/${tableNumber}`,
            isAvailable: true
        });

        res.status(201).json(table);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete table
// @route   DELETE /api/tables/:id
// @access  Private/Manager
const deleteTable = async (req, res) => {
    try {
        const table = await Table.findById(req.params.id);
        if (table) {
            await Table.findByIdAndDelete(req.params.id);
            res.json({ message: 'Table removed' });
        } else {
            res.status(404).json({ message: 'Table not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Start/Join Table Session
// @route   POST /api/tables/:number/session
// @access  Public
const startSession = async (req, res) => {
    try {
        const table = await Table.findOne({ tableNumber: req.params.number });
        if (!table) return res.status(404).json({ message: 'Table not found' });

        // If table is free, or has no active token, generate one
        // If occupied, we assume the user is joining the party? 
        // User requested: "token gets deleted and needs to be refreshed when some scan"
        // Let's generate a new token every time they scan if it's available?
        // Or if it's available, generate new. If busy, return existing?

        let token;

        // Simple logic: Always return a valid token.
        // If table has no token (fresh), generate one.
        // If table has token (busy), return it.
        // Wait, if it's busy, random people shouldn't join?
        // Let's assume for now: If available, new token. If not, error "Table Occupied"?
        // But the previous flow allowed joining. 
        // Let's stick to: Create new token only if isAvailable is true.

        if (table.isAvailable) {
            const crypto = require('crypto');
            token = crypto.randomBytes(16).toString('hex');
            table.sessionToken = token;
            table.isAvailable = false; // Mark as busy immediately on scan?
            // Actually, usually we mark busy on ORDER. 
            // But if we want to secure it, we mark busy on SCAN.
            // Let's keep isAvailable=true until order, but set sessionToken.
            // But if isAvailable=true, we can overwrite token.
            await table.save();
        } else {
            // If table is busy (order active), we might block new users or allow them if they scan.
            // If we want to allow joining, we return the existing token.
            // But we need to be careful. For now, let's REUSE existing token if busy.
            // This effectively lets anyone who scans the QR code join the table.

            // Check if token exists, if not (legacy), create one.
            if (!table.sessionToken) {
                const crypto = require('crypto');
                token = crypto.randomBytes(16).toString('hex');
                table.sessionToken = token;
                await table.save();
            } else {
                token = table.sessionToken;
            }
        }

        res.json({ sessionToken: token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Validate Session Token
// @route   POST /api/tables/validate-session
// @access  Public
const validateSession = async (req, res) => {
    const { tableNumber, sessionToken } = req.body;
    try {
        // Need to explicitly select sessionToken
        const table = await Table.findOne({ tableNumber }).select('+sessionToken');

        if (!table || !table.sessionToken) {
            return res.status(401).json({ valid: false });
        }

        if (table.sessionToken === sessionToken) {
            res.json({ valid: true });
        } else {
            res.status(401).json({ valid: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTableStatus, getTables, createTable, deleteTable, startSession, validateSession };
