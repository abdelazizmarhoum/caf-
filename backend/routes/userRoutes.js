const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, manager } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, manager, getUsers)
    .post(protect, manager, createUser);

router.route('/:id')
    .put(protect, manager, updateUser)
    .delete(protect, manager, deleteUser);

module.exports = router;
