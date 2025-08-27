import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
} else {
  console.warn('Cloudinary environment variables are missing')
}

export default cloudinary

export const uploadImage = async (fileBuffer: Buffer, fileName: string) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          public_id: `incidents/${Date.now()}_${fileName}`,
          folder: 'vehicle-incidents',
          transformation: [
            { width: 1000, height: 1000, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(fileBuffer)
    })

    return result
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw error
  }
}
