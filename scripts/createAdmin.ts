import mongoose from 'mongoose';
import Admin from '../models/Admin';
import connectDB from '../lib/mongodb';

async function createAdmin() {
    try {
        // Connect to database
        await connectDB();
        console.log('Connected to database');

        // Admin user details
        const adminData = {
            email: 'admin@whfnepal.org',
            password: 'Admin@123', // Change this to a secure password
            name: 'WHF Nepal Admin',
            role: 'super_admin',
        };

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: adminData.email });

        if (existingAdmin) {
            console.log('❌ Admin user already exists with email:', adminData.email);
            console.log('If you want to create a different admin, change the email in the script.');
            process.exit(0);
        }

        // Create new admin
        const admin = new Admin(adminData);
        await admin.save();

        console.log('✅ Admin user created successfully!');
        console.log('-----------------------------------');
        console.log('Email:', admin.email);
        console.log('Name:', admin.name);
        console.log('Role:', admin.role);
        console.log('-----------------------------------');
        console.log('⚠️  Remember to change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
}

// Run the function
createAdmin();
