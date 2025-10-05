// Cloudinary upload utility for profile images
export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file selected');
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select an image file');
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('Image size should be less than 5MB');
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

    return await uploadUnsigned(file, cloudName);
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error instanceof Error ? error : new Error('Upload failed');
  }
};

// Fallback unsigned upload function
const uploadUnsigned = async (file: File, cloudName: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'counsellor_unsigned'); // Use the preset you create in dashboard
  
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
      throw new Error(`Upload preset 'upload_preset' not found. Please create an unsigned preset named 'counsellor_unsigned' in your Cloudinary dashboard: Settings > Upload > Upload Presets > Add upload preset > Set Mode to 'Unsigned'`);
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