# Environment Configuration Guide

## Required Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

### MongoDB Configuration

For **local MongoDB**:
```env
MONGODB_URI=mongodb://localhost:27017/whfnepal
```

For **MongoDB Atlas** (cloud):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whfnepal?retryWrites=true&w=majority
```

Replace `username`, `password`, and `cluster` with your actual MongoDB Atlas credentials.

### Cloudinary Configuration

1. **Sign up for Cloudinary** (free tier available):
   - Visit: https://cloudinary.com/users/register/free
   - Create an account

2. **Get your credentials**:
   - After login, go to Dashboard
   - You'll see your credentials:
     - Cloud Name
     - API Key
     - API Secret

3. **Add to `.env.local`**:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### Optional Configuration

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Complete .env.local Example

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/whfnepal

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=demo-cloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing Your Configuration

1. **Start your development server**:
   ```bash
   bun run dev
   ```

2. **Visit the test page**:
   ```
   http://localhost:3000/test
   ```

3. **Test MongoDB connection**:
   - Click "Test Connection" button
   - Should show "MongoDB connection successful!"

4. **Test Cloudinary upload**:
   - Click the upload area
   - Select an image
   - Should upload successfully

## Troubleshooting

### MongoDB Connection Failed

**Error**: "MongoDB connection failed"

**Solutions**:
- Make sure MongoDB is running locally (`mongod` command)
- Or use MongoDB Atlas cloud connection string
- Check if MONGODB_URI is correctly set in .env.local

### Cloudinary Upload Failed

**Error**: "Cloudinary credentials not configured"

**Solutions**:
- Make sure all three Cloudinary variables are set in .env.local
- Restart your development server after adding env variables
- Double-check credentials from Cloudinary dashboard

### Environment Variables Not Loading

**Solutions**:
- Restart your development server (`bun run dev`)
- Make sure `.env.local` is in the project root
- Check that variable names match exactly (including `NEXT_PUBLIC_` prefix where needed)
- Verify `.env.local` is not in `.gitignore` (it should be, but ensure it exists locally)

## Security Notes

⚠️ **Important**:
- Never commit `.env.local` to version control
- `.env.local` should be in your `.gitignore`
- Keep your API keys and secrets private
- Use different credentials for production

## Next Steps

Once configured:
1. Visit `/test` to verify all integrations work
2. Start building features that use image uploads
3. Create user authentication with MongoDB
4. Build your content management system
