// Cloudinary upload utility for images
export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export type ImageType = 'profile' | 'cover' | 'blog' | 'prescription';

export const uploadToCloudinary = async (file: File, imageType: ImageType = 'profile'): Promise<string> => {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file selected');
    }

    // Check file type based on image type
    let isValidType = false;
    if (imageType === 'prescription') {
      // Allow both images and PDFs for prescriptions
      isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
    } else {
      // Only images for other types
      isValidType = file.type.startsWith('image/');
    }

    if (!isValidType) {
      const errorMsg = imageType === 'prescription' 
        ? 'Please select an image file or PDF document'
        : 'Please select an image file';
      throw new Error(errorMsg);
    }

    // Check file size (max 10MB for prescriptions, 5MB for others)
    const maxSize = imageType === 'prescription' ? 10 * 1024 * 1024 : 5 * 1024 * 1024; // 10MB or 5MB
    if (file.size > maxSize) {
      const sizeMsg = imageType === 'prescription' ? '10MB' : '5MB';
      throw new Error(`File size should be less than ${sizeMsg}`);
    }

    // Get Cloudinary credentials from environment
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
      throw new Error('Cloudinary configuration missing');
    }

    // Use unsigned upload with ml_default preset
    console.log('Uploading to Cloudinary:', {
      cloudName,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    return await uploadUnsigned(file, cloudName, imageType);
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error instanceof Error ? error : new Error('Upload failed');
  }
};

// Unsigned upload function with support for different image types
const uploadUnsigned = async (file: File, cloudName: string, imageType: ImageType): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Use different upload presets for different image types
  let uploadPreset = 'counsellor_unsigned'; // default
  if (imageType === 'cover') {
    uploadPreset = 'cover_pic';
  } else if (imageType === 'blog') {
    uploadPreset = 'blog_posts';
  } else if (imageType === 'prescription') {
    uploadPreset = 'prescriptions';
  }
  
  formData.append('upload_preset', uploadPreset);
  
  console.log(`Uploading ${imageType} image with preset: ${uploadPreset}`);
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Cloudinary detailed error:', errorData);
    
    if (errorData.error?.message?.includes('Upload preset')) {
      throw new Error(`Upload preset '${uploadPreset}' not found. Please create unsigned presets named 'counsellor_unsigned', 'cover_pic', and 'blog_posts' in your Cloudinary dashboard: Settings > Upload > Upload Presets > Add upload preset > Set Mode to 'Unsigned'`);
    }
    
    throw new Error(errorData.error?.message || 'Upload failed');
  }

  const data: CloudinaryResponse = await response.json();
  return data.secure_url;
};

// Helper function to validate image files
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select an image file' };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size should be less than 5MB' };
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, GIF, and WebP images are allowed' };
  }

  return { valid: true };
};

// Specific functions for different image types
export const uploadProfileImage = async (file: File): Promise<string> => {
  return uploadToCloudinary(file, 'profile');
};

export const uploadCoverImage = async (file: File): Promise<string> => {
  return uploadToCloudinary(file, 'cover');
};

export const uploadBlogImage = async (file: File): Promise<string> => {
  return uploadToCloudinary(file, 'blog');
};

export const uploadPrescription = async (file: File): Promise<string> => {
  return uploadToCloudinary(file, 'prescription');
};