import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Cloudinary is not configured. Please add environment variables.' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Please upload an image smaller than 5MB.' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Direct Cloudinary upload without external library
    const timestamp = Math.round(Date.now() / 1000)
    const folder = 'vehicle-incidents'
    const publicId = `${folder}/${timestamp}_${file.name.replace(/\.[^/.]+$/, '')}`

    // Create signature for Cloudinary
    const crypto = require('crypto')
    const stringToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex')

    // Upload directly to Cloudinary
    const uploadFormData = new FormData()
    uploadFormData.append('file', new Blob([buffer], { type: file.type }))
    uploadFormData.append('api_key', process.env.CLOUDINARY_API_KEY!)
    uploadFormData.append('timestamp', timestamp.toString())
    uploadFormData.append('signature', signature)
    uploadFormData.append('folder', folder)
    uploadFormData.append('public_id', publicId)

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: uploadFormData,
      }
    )

    if (!cloudinaryResponse.ok) {
      const errorText = await cloudinaryResponse.text()
      console.error('Cloudinary error:', errorText)
      throw new Error(`Cloudinary upload failed: ${cloudinaryResponse.status}`)
    }

    const result = await cloudinaryResponse.json()

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    console.error('Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
      api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing',
    })
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
