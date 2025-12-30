const express = require('express');
const router = express.Router();
const { getTableStatus, getTables, createTable, deleteTable, startSession, validateSession } = require('../controllers/tableController');
const { protect, manager } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, manager, getTables)
    .post(protect, manager, createTable);

router.route('/:number')
    .get(getTableStatus) // Public for customers
    .delete(protect, manager, deleteTable); // Using ID for delete

router.post('/:number/session', startSession);
router.post('/validate-session', validateSession);

module.exports = router;
