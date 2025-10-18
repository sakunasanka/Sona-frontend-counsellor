import React, { useState, useEffect } from 'react';
import { makeRequest } from '../../../api/apiBase';
import { uploadPrescription } from '../../../utils/cloudinaryUpload';
import { 
  Upload,
  FileImage,
  Pill,
  Download,
  Eye,
  FileText
} from 'lucide-react';

interface Prescription {
  id: number;
  fileName: string;
  fileType: 'pdf' | 'image';
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
  description?: string;
}

interface PrescriptionManagerProps {
  clientId: string;
  onShowFlashMessage: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

const PrescriptionManager: React.FC<PrescriptionManagerProps> = ({ 
  clientId, 
  onShowFlashMessage 
}) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [uploadingPrescription, setUploadingPrescription] = useState(false);
  const [selectedPrescriptionFile, setSelectedPrescriptionFile] = useState<File | null>(null);
  const [prescriptionDescription, setPrescriptionDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Fetch prescriptions from API
  const fetchPrescriptions = async () => {
    if (!clientId) return;

    try {
      console.log('Fetching prescriptions for client:', clientId);
      
      const response = await makeRequest<{
        success: boolean;
        message: string;
        data: {
          prescriptions: Array<{
            id: number;
            psychiatristId: number;
            clientId: number;
            description: string;
            prescription: string;
            createdAt: string;
            updatedAt: string;
            client: {
              id: number;
              name: string;
              email: string;
            };
          }>;
          count: number;
        };
      }>(`/psychiatrists/prescriptions/${clientId}`, 'GET');

      console.log('Prescriptions API response:', response);

      if (response && response.data && response.data.prescriptions) {
        // Transform API data to component format
        const transformedPrescriptions: Prescription[] = response.data.prescriptions.map(apiPrescription => {
          // Extract file information from URL
          const url = apiPrescription.prescription;
          const urlParts = url.split('/');
          const fileName = urlParts[urlParts.length - 1] || 'prescription';
          
          // Determine file type from URL
          const fileType: 'pdf' | 'image' = url.toLowerCase().includes('.pdf') ? 'pdf' : 'image';
          
          return {
            id: apiPrescription.id,
            fileName: fileName.includes('.') ? fileName : `${fileName}.${fileType === 'pdf' ? 'pdf' : 'png'}`,
            fileType,
            fileUrl: apiPrescription.prescription,
            fileSize: 0, // API doesn't provide file size, we'll use 0 or could make a HEAD request
            uploadedAt: new Date(apiPrescription.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }),
            uploadedBy: "Dr. Psychiatrist", // Could be enhanced with actual psychiatrist name from API
            description: apiPrescription.description || undefined
          };
        });

        setPrescriptions(transformedPrescriptions);
        console.log('Transformed prescriptions:', transformedPrescriptions);
      } else {
        console.log('No prescriptions found for client');
        setPrescriptions([]);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      // Don't show error message to user as this might be normal (no prescriptions)
      setPrescriptions([]);
    }
  };

  // Load prescriptions on component mount
  useEffect(() => {
    fetchPrescriptions();
  }, [clientId]);

  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      onShowFlashMessage('error', 'Only PDF and image files (JPEG, PNG, GIF) are allowed.');
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      onShowFlashMessage('error', 'File size must be less than 10MB.');
      return;
    }

    // Store the selected file
    setSelectedPrescriptionFile(file);
  };

  // Handle prescription upload
  const handlePrescriptionSubmit = async () => {
    if (!selectedPrescriptionFile) return;

    setUploadingPrescription(true);

    try {
      // Upload file to Cloudinary
      const cloudinaryUrl = await uploadPrescription(selectedPrescriptionFile);
      console.log('File uploaded to Cloudinary:', cloudinaryUrl);

      // Make API call to save prescription
      const prescriptionPayload = {
        clientId: parseInt(clientId!),
        description: prescriptionDescription.trim() || undefined,
        prescription: cloudinaryUrl
      };

      console.log('Uploading prescription with payload:', prescriptionPayload);

      const response = await makeRequest('/psychiatrists/prescription', 'POST', prescriptionPayload);

      console.log('Prescription upload API response:', response);

      // Refresh prescriptions list from API after successful upload
      await fetchPrescriptions();
      
      // Clear form
      setSelectedPrescriptionFile(null);
      setPrescriptionDescription('');
      onShowFlashMessage('success', 'Prescription uploaded successfully!');
    } catch (error) {
      console.error('Error uploading prescription:', error);
      onShowFlashMessage('error', 'Failed to upload prescription. Please try again.');
    } finally {
      setUploadingPrescription(false);
    }
  };

  // Handle viewing prescription
  const handleViewPrescription = (prescription: Prescription) => {
    // In a real app, this would open the file in a new tab or download it
    window.open(prescription.fileUrl, '_blank');
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Pill className="w-6 h-6 text-purple-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Prescription Management</h3>
              <p className="text-sm text-gray-600">Upload and manage prescription documents and therapy resources</p>
            </div>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload New Prescription
          </label>
          
          {/* Drag and Drop Area */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              selectedPrescriptionFile
                ? 'border-green-400 bg-green-50'
                : dragActive 
                  ? 'border-purple-400 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.gif"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploadingPrescription || !!selectedPrescriptionFile}
            />
            
            <div className="space-y-3">
              <div className="flex justify-center">
                <div className={`p-3 rounded-full ${
                  selectedPrescriptionFile ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  <Upload className={`w-8 h-8 ${
                    selectedPrescriptionFile ? 'text-green-600' : 'text-purple-600'
                  }`} />
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-1">
                  {selectedPrescriptionFile 
                    ? `Selected: ${selectedPrescriptionFile.name}`
                    : uploadingPrescription 
                      ? 'Uploading...' 
                      : 'Drop files here or click to browse'
                  }
                </h4>
                <p className="text-sm text-gray-500">
                  {selectedPrescriptionFile 
                    ? `${formatFileSize(selectedPrescriptionFile.size)} • ${selectedPrescriptionFile.type.includes('pdf') ? 'PDF Document' : 'Image'}`
                    : 'Support for PDF, JPEG, PNG, GIF files up to 10MB'
                  }
                </p>
              </div>
              
              {selectedPrescriptionFile && !uploadingPrescription && (
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => setSelectedPrescriptionFile(null)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              )}
              
              {uploadingPrescription && (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Description Input */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={prescriptionDescription}
              onChange={(e) => setPrescriptionDescription(e.target.value)}
              placeholder="Add a description for this prescription..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              disabled={uploadingPrescription}
            />
          </div>

          {/* Submit Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handlePrescriptionSubmit}
              disabled={!selectedPrescriptionFile || uploadingPrescription}
              className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center transition-all ${
                !selectedPrescriptionFile || uploadingPrescription
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {uploadingPrescription ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Prescription
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileImage className="w-5 h-5 text-gray-500 mr-2" />
              <h4 className="text-lg font-semibold text-gray-900">
                Uploaded Prescriptions ({prescriptions.length})
              </h4>
            </div>
          </div>
        </div>

        <div className="p-6">
          {prescriptions.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileImage className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No prescriptions uploaded</h4>
              <p className="text-gray-600 text-sm">
                Upload prescription documents, therapy guidelines, or treatment resources to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-purple-200 transition-all duration-300 overflow-hidden group"
                >
                  {/* Header with File Type Badge */}
                  <div className="relative p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                        prescription.fileType === 'pdf'
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        {prescription.fileType === 'pdf' ? (
                          <FileText className="w-3 h-3 mr-1.5" />
                        ) : (
                          <FileImage className="w-3 h-3 mr-1.5" />
                        )}
                        {prescription.fileType.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-4 pb-4">
                    {/* File Icon */}
                    <div className="flex justify-center mb-3">
                      <div className={`p-3 rounded-xl ${
                        prescription.fileType === 'pdf' 
                          ? 'bg-red-50 border border-red-100' 
                          : 'bg-blue-50 border border-blue-100'
                      }`}>
                        {prescription.fileType === 'pdf' ? (
                          <FileText className={`w-8 h-8 ${
                            prescription.fileType === 'pdf' 
                              ? 'text-red-500' 
                              : 'text-blue-500'
                          }`} />
                        ) : (
                          <FileImage className="w-8 h-8 text-blue-500" />
                        )}
                      </div>
                    </div>

                    {/* File Name */}
                    <h5 className="font-semibold text-gray-900 text-sm text-center mb-2 leading-tight" title={prescription.fileName}>
                      {prescription.fileName.length > 20 
                        ? `${prescription.fileName.substring(0, 20)}...` 
                        : prescription.fileName
                      }
                    </h5>
                    
                    {/* Description */}
                    {prescription.description && (
                      <p className="text-xs text-gray-600 text-center mb-3 leading-relaxed line-clamp-2">
                        {prescription.description.length > 60 
                          ? `${prescription.description.substring(0, 60)}...` 
                          : prescription.description
                        }
                      </p>
                    )}
                    
                    {/* Upload Date */}
                    <div className="text-center mb-4">
                      <span className="inline-flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {prescription.uploadedAt}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewPrescription(prescription)}
                        className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2.5 px-3 rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-center hover:shadow-sm border border-purple-100 hover:border-purple-200"
                      >
                        <Eye className="w-3 h-3 mr-1.5" />
                        View
                      </button>
                      <button
                        onClick={() => handleViewPrescription(prescription)}
                        className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2.5 px-3 rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-center hover:shadow-sm border border-green-100 hover:border-green-200"
                      >
                        <Download className="w-3 h-3 mr-1.5" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionManager;