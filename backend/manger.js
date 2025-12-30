const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

const seedManager = async () => {
    try {
        await connectDB();

        const managerData = {
            _id: '6951b48c2ffbeafbad09f55d',
            email: 'admin@cafe.com',
            fullName: 'Manager Admin',
            role: 'manager',
            password: '123456',
            isActive: true
        };

        console.log('🚀 Starting Manager Seeding...');

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(managerData.password, salt);

        const managerRecord = {
            email: managerData.email,
            fullName: managerData.fullName,
            role: managerData.role,
            passwordHash: passwordHash,
            isActive: managerData.isActive
        };

        // Use findOneAndUpdate with upsert to either update the existing manager or create it
        // We match by ID to ensure consistency
        await User.findOneAndUpdate(
            { _id: managerData._id },
            managerRecord,
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log('✅ Manager account seeded successfully!');
        console.log(`📧 Email: ${managerData.email}`);
        console.log(`🔑 Password: ${managerData.password}`);

        process.exit();
    } catch (error) {
        console.error('❌ Error seeding manager:', error);
        process.exit(1);
    }
};

seedManager();
