import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import Admin from '../models/Admin';

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const [key, ...values] = line.split('=');
        if (key && values.length > 0) {
            process.env[key.trim()] = values.join('=').trim();
        }
    });
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
}

async function createAdmin() {
    try {
        // Connect to database
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI!);
        console.log('✅ Connected to database\n');

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
            await mongoose.disconnect();
            process.exit(0);
        }

        // Create new admin
        const admin = new Admin(adminData);
        await admin.save();

        console.log('✅ Admin user created successfully!');
        console.log('-----------------------------------');
        console.log('Email:', admin.email);
        console.log('Password: Admin@123');
        console.log('Name:', admin.name);
        console.log('Role:', admin.role);
        console.log('-----------------------------------');
        console.log('⚠️  Remember to change the password after first login!');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
}

// Run the function
createAdmin();
