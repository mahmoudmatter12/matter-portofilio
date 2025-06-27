// lib/storage.ts
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer, { Multer } from 'multer';
import { cloudinary } from './cloudnary'; // Adjust the import path as necessary

// Profile Picture Storage
const profilePicStorage = new CloudinaryStorage({
  cloudinary,
  params: () => ({
    folder: 'profile_pictures',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    resource_type: 'image',
  }),
});

// CV File Storage
const cvStorage = new CloudinaryStorage({
  cloudinary,
  params: () => ({
    folder: 'cv_files',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw',
  }),
});

// Create Multer uploaders
export const uploadProfilePic: Multer = multer({ storage: profilePicStorage });
export const uploadCV: Multer = multer({ storage: cvStorage });
