/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloudinary } from '@/lib/cloudnary';
import { NextRequest, NextResponse } from 'next/server';

interface ApiResponse {
  url?: string;
  secure_url?: string;
  public_id?: string;
  error?: string;
  message?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded. Please select a file to upload.' },
        { status: 400 }
      );
    }

    // File validation - same as your cvStorage configuration
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a PDF, DOC, or DOCX file.' },
        { status: 400 }
      );
    }

    // File size validation (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique public_id
    const timestamp = Date.now();
    const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
    const publicId = `${timestamp}-${fileName.replace(/[^a-zA-Z0-9-]/g, '_')}`;

    // Upload to Cloudinary using your existing configuration
    // This matches your cvStorage params
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw', // Same as your cvStorage
          folder: 'cv_files', // Same as your cvStorage
          public_id: publicId,
          use_filename: true,
          unique_filename: false,
          overwrite: false,
          // Optional: Add tags for better organization
          tags: ['cv', 'portfolio'],
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    const result = uploadResult as any;

    console.log(`CV uploaded successfully to Cloudinary: ${result.public_id}`);

    return NextResponse.json({
      url: result.url,
      secure_url: result.secure_url,
      public_id: result.public_id,
      message: 'File uploaded successfully to Cloudinary'
    });

  } catch (error) {
    console.error('Error processing upload:', error);
    
    // Handle specific Cloudinary errors
    if (error && typeof error === 'object' && 'http_code' in error) {
      const cloudinaryError = error as any;
      return NextResponse.json(
        { error: `Cloudinary error: ${cloudinaryError.message || 'Upload failed'}` },
        { status: cloudinaryError.http_code || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process file upload' },
      { status: 500 }
    );
  }
}

// Optional: DELETE method to remove files from Cloudinary
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('public_id');

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required for deletion' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary (raw files need resource_type specified)
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw'
    });

    if (result.result === 'ok') {
      return NextResponse.json({
        message: 'File deleted successfully',
        result: result.result
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete file' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to upload or DELETE to remove files.' },
    { status: 405 }
  );
}