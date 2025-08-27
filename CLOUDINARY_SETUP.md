# Cloudinary Setup Guide

## Step 1: Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Click "Sign Up for Free"
3. Create your account

## Step 2: Get Your Credentials

1. After login, go to your **Dashboard**
2. You'll see your credentials:
   - **Cloud Name**: `your-cloud-name`
   - **API Key**: `123456789012345`
   - **API Secret**: `your-secret-key`

## Step 3: Add to Environment Variables

Add these to your `.env.local` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="your-secret-key"
```

## Step 4: Test Upload

1. Start your development server: `npm run dev`
2. Go to `/fleetmanager/incidents/new`
3. Try uploading an image in the "Incident Photos" section
4. You should see the image upload and display

## Features Enabled

✅ **Image Upload**: Users can upload up to 5 photos per incident  
✅ **Image Optimization**: Automatic resizing and compression  
✅ **Image Gallery**: View uploaded images in incident details  
✅ **File Validation**: Type and size validation  
✅ **Cloud Storage**: Images stored securely on Cloudinary  

## Troubleshooting

**Upload failing?**
- Check your environment variables are correct
- Make sure you're using the correct Cloudinary credentials
- Check file size (max 5MB) and type (images only)

**Images not displaying?**
- Verify the image URLs in your database
- Check Next.js image configuration in `next.config.js`
- Ensure Cloudinary domain is whitelisted for images

## Production Notes

- Images are automatically optimized for web
- CDN delivery for fast loading
- Secure upload with validation
- Organized in folders: `vehicle-incidents/`
