const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/authController');
const { protect, manager } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/register', protect, manager, registerUser);

module.exports = router;
