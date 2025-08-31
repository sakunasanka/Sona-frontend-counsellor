import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavBar, SidebarForPsy } from "../../components/layout";
import {
  Users,
  Plus,
  FileText,
  Eye,
  ArrowLeft,
  Clock
} from "lucide-react";

interface TimingDosage {
  timing: string;
  amount: string;
  customAmount?: string;
}

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  form: 'tablet' | 'liquid' | 'capsule' | 'injection';
  unit: string;
  timingDosages: TimingDosage[];
  frequency: string;
  mealRelation: string;
  duration: string;
  durationType: string;
  specialInstructions: string;
}

interface SavedPrescription {
  id: string;
  patientName: string;
  patientId: string;
  startDate: string;
  endDate: string;
  medicines: Medicine[];
  notes?: string;
  createdAt: string;
  lastModified: string;
  isNotified: boolean;
}

const ViewPrescription = () => {
  const { prescriptionId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prescription, setPrescription] = useState<SavedPrescription | null>(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    // Get prescription from localStorage
    const savedPrescriptions = JSON.parse(localStorage.getItem('savedPrescriptions') || '[]');
    const foundPrescription = savedPrescriptions.find((p: SavedPrescription) => p.id === prescriptionId);
    
    if (foundPrescription) {
      setPrescription(foundPrescription);
    } else {
      // If prescription not found, redirect to create prescription page
      navigate('/psychiatrist/create-prescription');
    }
  }, [prescriptionId, navigate]);

  if (!prescription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading prescription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Let the Sidebar component handle its own positioning */}
        <div className="hidden lg:block">
          <SidebarForPsy isOpen={true} onClose={closeSidebar} />
        </div>
        
        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <SidebarForPsy isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <NavBar onMenuClick={toggleSidebar} />
          <div className="p-4 lg:p-6 bg-gray-50">
          {/* Header with Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/psychiatrist/create-prescription', { state: { tab: 'saved' } })}
              className="flex items-center gap-2 text-secondaryDusk hover:text-secondaryDarker mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Saved Prescriptions
            </button>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondaryDusk/10 rounded-full flex items-center justify-center">
                    <Eye className="w-6 h-6 text-secondaryDusk" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Viewing Prescription</h1>
                    <p className="text-gray-600">Created on {new Date(prescription.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Prescription ID</p>
                  <p className="font-mono text-sm text-gray-900">{prescription.id.substring(0, 8)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Prescription Content */}
          <div className="space-y-6">
            {/* Patient Selection & Basic Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-900 to-secondaryDusk px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Prescription Details
                </h2>
                <p className="text-blue-100 text-sm mt-1">All fields are read-only</p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Patient Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient *
                  </label>
                  <div className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-gray-900 font-medium">{prescription.patientName}</span>
                        <p className="text-sm text-gray-600">ID: {prescription.patientId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={prescription.startDate}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={prescription.endDate}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-4">
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Instructions, Warnings, or Additional Notes
                    </label>
                    <textarea
                      value={prescription.notes || ''}
                      className="w-full h-24 p-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed resize-none"
                      readOnly
                      placeholder={!prescription.notes ? "No additional notes provided" : ""}
                    />
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-gray-500">
                        {(prescription.notes || '').length}/500 characters
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prescribed Medicines List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Prescribed Medicines ({prescription.medicines.length})
              </h2>

              {prescription.medicines.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No medicines prescribed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {prescription.medicines.map((medicine, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-secondaryDusk/10 rounded-full flex items-center justify-center">
                              <Plus className="w-4 h-4 text-secondaryDusk" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{medicine.name}</h3>
                              <p className="text-sm text-gray-600">
                                {medicine.form} • {medicine.dosage} {medicine.unit}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-gray-500">Frequency:</span>
                              <p className="font-medium text-gray-900">{medicine.frequency}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Meal Relation:</span>
                              <p className="font-medium text-gray-900 capitalize">{medicine.mealRelation.replace('-', ' ')}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Duration:</span>
                              <p className="font-medium text-gray-900">{medicine.duration} {medicine.durationType}</p>
                            </div>
                          </div>

                          {medicine.timingDosages && medicine.timingDosages.length > 0 && (
                            <div className="mb-3">
                              <span className="text-gray-500 text-sm">Daily Schedule:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {medicine.timingDosages.map((timing, timingIndex) => (
                                  <span
                                    key={timingIndex}
                                    className="px-2 py-1 bg-secondaryDusk/10 text-secondaryDusk rounded-full text-xs font-medium"
                                  >
                                    {timing.timing}: {timing.amount} {medicine.unit}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {medicine.specialInstructions && (
                            <div className="bg-secondaryDark rounded-lg p-3">
                              <span className="text-gray-800 text-sm font-medium">Special Instructions:</span>
                              <p className="text-gray-700 text-sm mt-1">{medicine.specialInstructions}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Prescription Metadata */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                Prescription Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Created</div>
                  <div className="font-medium text-gray-900">
                    {new Date(prescription.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Last Modified</div>
                  <div className="font-medium text-gray-900">
                    {new Date(prescription.lastModified).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Patient Notification</div>
                  <div className={`font-medium ${prescription.isNotified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {prescription.isNotified ? 'Notified' : 'Pending'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPrescription;
