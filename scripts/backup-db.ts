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

// Get MongoDB URI from command line argument or environment variable
const MONGODB_URI = process.argv[2] || process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MongoDB URI is required!');
    console.log('\nUsage:');
    console.log('  npm run db:backup <mongodb_uri>');
    console.log('\nExample:');
    console.log('  npm run db:backup "mongodb://user:pass@host:port/dbname?authSource=admin"');
    console.log('\nOr set MONGODB_URI in .env.local file');
    process.exit(1);
}

function getTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

async function backupDatabase() {
    try {
        console.log('🔄 Starting MongoDB backup...\n');
        console.log(`📡 Connecting to: ${MONGODB_URI!.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}\n`);

        // Connect to database directly
        await mongoose.connect(MONGODB_URI!);
        console.log('✅ Connected to MongoDB\n');

        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection not established');
        }

        // Create backup directory
        const timestamp = getTimestamp();
        const backupDir = path.join(process.cwd(), 'backups', `backup_${timestamp}`);
        
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
        console.log(`📁 Backup directory: ${backupDir}\n`);

        // Get all collections from the database
        const collections = await db.listCollections().toArray();
        
        let totalDocuments = 0;
        const backupSummary: { collection: string; count: number }[] = [];

        // Backup each collection using native MongoDB access
        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            
            // Skip system collections
            if (collectionName.startsWith('system.')) {
                continue;
            }

            try {
                const collection = db.collection(collectionName);
                const documents = await collection.find({}).toArray();
                const count = documents.length;
                totalDocuments += count;

                const filePath = path.join(backupDir, `${collectionName}.json`);
                fs.writeFileSync(filePath, JSON.stringify(documents, null, 2));

                backupSummary.push({ collection: collectionName, count });
                console.log(`  ✓ ${collectionName}: ${count} documents`);
            } catch (error) {
                console.error(`  ✗ Error backing up ${collectionName}:`, error);
            }
        }

        // Create backup metadata
        const metadata = {
            timestamp: new Date().toISOString(),
            database: mongoose.connection.name,
            collections: backupSummary,
            totalDocuments,
        };

        fs.writeFileSync(
            path.join(backupDir, '_metadata.json'),
            JSON.stringify(metadata, null, 2)
        );

        console.log('\n' + '='.repeat(50));
        console.log(`✅ Backup completed successfully!`);
        console.log(`📊 Total documents backed up: ${totalDocuments}`);
        console.log(`📁 Backup location: ${backupDir}`);
        console.log('='.repeat(50) + '\n');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Backup failed:', error);
        process.exit(1);
    }
}

// Run backup
backupDatabase();
