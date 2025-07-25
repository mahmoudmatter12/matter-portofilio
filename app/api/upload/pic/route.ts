/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloudinary } from "@/lib/cloudnary";
import { NextRequest, NextResponse } from "next/server";

interface ApiResponse {
  url?: string;
  secure_url?: string;
  public_id?: string;
  error?: string;
  message?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await request.formData();
    console.log("Received form data:", formData);
    const file = formData.get("file") as File | null;

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded. Please select a file to upload." },
        { status: 400 }
      );
    }

    // File validation - same as your profilePicStorage configuration
    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Please upload a JPG, JPEG, or PNG image.",
        },
        { status: 400 }
      );
    }

    // File size validation (max 5MB for images)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique public_id
    const timestamp = Date.now();
    const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
    const publicId = `${timestamp}-${fileName.replace(/[^a-zA-Z0-9-]/g, "_")}`;

    // Upload to Cloudinary with original quality
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "profile_pictures",
            public_id: publicId,
            use_filename: true,
            unique_filename: false,
            overwrite: false,
            // Preserve original quality - no transformations
            quality: "auto:best", // Use best quality auto-optimization
            fetch_format: "auto", // Auto-detect best format
            // Optional: Add tags for better organization
            tags: ["profile", "avatar", "user"],
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(buffer);
    });

    const result = uploadResult as any;

    console.log(
      `Profile picture uploaded successfully to Cloudinary: ${result.public_id}`
    );

    return NextResponse.json({
      url: result.url,
      secure_url: result.secure_url,
      public_id: result.public_id,
      message: "Profile picture uploaded successfully to Cloudinary",
    });
  } catch (error) {
    console.error("Error processing upload:", error);

    // Handle specific Cloudinary errors
    if (error && typeof error === "object" && "http_code" in error) {
      const cloudinaryError = error as any;
      return NextResponse.json(
        {
          error: `Cloudinary error: ${
            cloudinaryError.message || "Upload failed"
          }`,
        },
        { status: cloudinaryError.http_code || 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process file upload" },
      { status: 500 }
    );
  }
}

// Optional: DELETE method to remove profile pictures from Cloudinary
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("public_id");

    if (!publicId) {
      return NextResponse.json(
        { error: "Public ID is required for deletion" },
        { status: 400 }
      );
    }

    // Delete from Cloudinary (images use default resource_type)
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      return NextResponse.json({
        message: "Profile picture deleted successfully",
        result: result.result,
      });
    } else {
      return NextResponse.json(
        { error: "Failed to delete profile picture" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error deleting profile picture:", error);
    return NextResponse.json(
      { error: "Failed to delete profile picture" },
      { status: 500 }
    );
  }
}

// Optional: GET method to retrieve profile picture with different sizes
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("public_id");
    const size = searchParams.get("size") || "medium";

    if (!publicId) {
      return NextResponse.json(
        { error: "Public ID is required" },
        { status: 400 }
      );
    }

    // Generate different sizes with high quality
    const sizeMap = {
      small: { width: 100, height: 100 },
      medium: { width: 200, height: 200 },
      large: { width: 400, height: 400 },
      original: null,
    };

    const dimensions = sizeMap[size as keyof typeof sizeMap] || sizeMap.medium;

    let url;
    if (dimensions) {
      url = cloudinary.url(publicId, {
        width: dimensions.width,
        height: dimensions.height,
        crop: "fill",
        gravity: "face",
        quality: "auto:best", // Use best quality
        fetch_format: "auto",
      });
    } else {
      // For original size, use best quality without transformations
      url = cloudinary.url(publicId, {
        quality: "auto:best",
        fetch_format: "auto",
      });
    }

    return NextResponse.json({
      url,
      size,
      public_id: publicId,
    });
  } catch (error) {
    console.error("Error generating profile picture URL:", error);
    return NextResponse.json(
      { error: "Failed to generate profile picture URL" },
      { status: 500 }
    );
  }
}
