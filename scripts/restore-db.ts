import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

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

// Get MongoDB URI from command line argument (2nd arg) or environment variable
const MONGODB_URI = process.argv[3] || process.env.MONGODB_URI;

async function restoreDatabase() {
    try {
        // Get backup folder from command line argument
        const backupFolderArg = process.argv[2];
        
        if (!backupFolderArg) {
            console.log('❌ Please provide the backup folder name or path');
            console.log('Usage: npm run db:restore <backup_folder> [mongodb_uri]');
            console.log('Example: npm run db:restore backup_2025-12-30_10-30-00');
            console.log('Example: npm run db:restore backup_2025-12-30_10-30-00 "mongodb://user:pass@host/db?authSource=admin"');
            
            // List available backups
            const backupsDir = path.join(process.cwd(), 'backups');
            if (fs.existsSync(backupsDir)) {
                const backups = fs.readdirSync(backupsDir).filter(f => f.startsWith('backup_'));
                if (backups.length > 0) {
                    console.log('\n📁 Available backups:');
                    backups.forEach(backup => console.log(`   - ${backup}`));
                }
            }
            process.exit(1);
        }

        // Resolve backup path
        let backupDir: string;
        if (path.isAbsolute(backupFolderArg)) {
            backupDir = backupFolderArg;
        } else if (backupFolderArg.startsWith('./') || backupFolderArg.startsWith('../')) {
            backupDir = path.resolve(process.cwd(), backupFolderArg);
        } else {
            backupDir = path.join(process.cwd(), 'backups', backupFolderArg);
        }

        if (!fs.existsSync(backupDir)) {
            console.error(`❌ Backup folder not found: ${backupDir}`);
            process.exit(1);
        }

        if (!MONGODB_URI) {
            console.error('❌ MongoDB URI is required!');
            console.log('\nUsage:');
            console.log('  npm run db:restore <backup_folder> <mongodb_uri>');
            console.log('\nOr set MONGODB_URI in .env.local file');
            process.exit(1);
        }

        console.log('🔄 Starting MongoDB restore...\n');
        console.log(`📁 Restoring from: ${backupDir}\n`);
        console.log(`📡 Connecting to: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}\n`);

        // Check metadata
        const metadataPath = path.join(backupDir, '_metadata.json');
        if (fs.existsSync(metadataPath)) {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
            console.log('📋 Backup metadata:');
            console.log(`   Created: ${metadata.timestamp}`);
            console.log(`   Database: ${metadata.database}`);
            console.log(`   Total documents: ${metadata.totalDocuments}\n`);
        }

        // Connect to database directly
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection not established');
        }

        // Confirmation prompt
        console.log('⚠️  WARNING: This will replace existing data in your database!');
        console.log('   Press Ctrl+C within 5 seconds to cancel...\n');
        await new Promise(resolve => setTimeout(resolve, 5000));

        let totalRestored = 0;
        const restoreSummary: { collection: string; count: number }[] = [];

        // Get all JSON files from backup directory
        const backupFiles = fs.readdirSync(backupDir).filter(f => f.endsWith('.json') && f !== '_metadata.json');

        // Restore each collection using native MongoDB access
        for (const fileName of backupFiles) {
            const collectionName = fileName.replace('.json', '');
            const filePath = path.join(backupDir, fileName);

            try {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                const count = data.length;

                if (count > 0) {
                    const collection = db.collection(collectionName);
                    // Clear existing collection and insert backup data
                    await collection.deleteMany({});
                    await collection.insertMany(data, { ordered: false });
                    totalRestored += count;
                    restoreSummary.push({ collection: collectionName, count });
                    console.log(`  ✓ ${collectionName}: ${count} documents restored`);
                } else {
                    console.log(`  ○ ${collectionName}: Empty collection`);
                }
            } catch (error) {
                console.error(`  ✗ Error restoring ${collectionName}:`, error);
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log(`✅ Restore completed successfully!`);
        console.log(`📊 Total documents restored: ${totalRestored}`);
        console.log('='.repeat(50) + '\n');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Restore failed:', error);
        process.exit(1);
    }
}

// Run restore
restoreDatabase();
