const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get all users (Manager only)
// @route   GET /api/users
// @access  Private/Manager
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ deletedAt: null }).select('-passwordHash');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new user (Kitchen/Manager)
// @route   POST /api/users
// @access  Private/Manager
const createUser = async (req, res) => {
    const { fullName, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            fullName,
            email,
            passwordHash,
            role
        });

        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Manager
const updateUser = async (req, res) => {
    const { fullName, email, password, role } = req.body;

    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.fullName = fullName || user.fullName;
            user.email = email || user.email;
            user.role = role || user.role;

            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.passwordHash = await bcrypt.hash(password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                role: updatedUser.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Manager
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            // Prevent deleting yourself
            if (user._id.toString() === req.user._id.toString()) {
                return res.status(400).json({ message: "You cannot delete yourself" });
            }

            user.deletedAt = Date.now();
            await user.save();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
