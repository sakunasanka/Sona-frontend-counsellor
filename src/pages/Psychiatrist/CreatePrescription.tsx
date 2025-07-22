import React, { useState, useMemo, useEffect } from 'react';
import { Search, User, Calendar, Phone, Mail, MapPin, AlertTriangle, Heart, Plus, Save, FileText, Clock, CheckCircle, XCircle, Pause, Filter, Pill, Stethoscope } from 'lucide-react';
import { SidebarForPsy, NavBar } from '../../components/layout';

// Types
interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  insuranceId: string;
  allergies: string[];
  currentConditions: string[];
  lastVisit: string;
}

interface Medication {
  id: string;
  name: string;
  genericName: string;
  category: string;
  commonDosages: string[];
  contraindications: string[];
  sideEffects: string[];
}

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  medications: PrescriptionMedication[];
  prescribedBy: string;
  prescribedDate: string;
  status: 'Active' | 'Completed' | 'Cancelled' | 'Pending';
  notes: string;
}

interface PrescriptionMedication {
  medicationId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  refills: number;
  instructions: string;
}

// Mock Data
const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    dateOfBirth: '1985-03-15',
    gender: 'Female',
    phone: '(555) 123-4567',
    email: 'sarah.johnson@email.com',
    address: '123 Oak Street, Springfield, IL 62701',
    emergencyContact: 'John Johnson - (555) 123-4568',
    insuranceId: 'BC12345678',
    allergies: ['Penicillin', 'Shellfish'],
    currentConditions: ['Major Depressive Disorder', 'Generalized Anxiety Disorder'],
    lastVisit: '2024-12-15'
  },
  {
    id: '2',
    name: 'Michael Chen',
    dateOfBirth: '1978-11-22',
    gender: 'Male',
    phone: '(555) 234-5678',
    email: 'michael.chen@email.com',
    address: '456 Maple Ave, Springfield, IL 62702',
    emergencyContact: 'Lisa Chen - (555) 234-5679',
    insuranceId: 'BC87654321',
    allergies: ['Latex'],
    currentConditions: ['Bipolar Disorder Type I', 'Sleep Disorder'],
    lastVisit: '2024-12-10'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    dateOfBirth: '1992-07-08',
    gender: 'Female',
    phone: '(555) 345-6789',
    email: 'emma.rodriguez@email.com',
    address: '789 Pine Street, Springfield, IL 62703',
    emergencyContact: 'Carlos Rodriguez - (555) 345-6790',
    insuranceId: 'BC11223344',
    allergies: [],
    currentConditions: ['PTSD', 'Social Anxiety Disorder'],
    lastVisit: '2024-12-12'
  }
];

const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Sertraline',
    genericName: 'Sertraline HCl',
    category: 'SSRI Antidepressant',
    commonDosages: ['25mg', '50mg', '100mg', '150mg', '200mg'],
    contraindications: ['MAOIs', 'Pimozide', 'Linezolid'],
    sideEffects: ['Nausea', 'Diarrhea', 'Insomnia', 'Dizziness', 'Sexual dysfunction']
  },
  {
    id: '2',
    name: 'Lorazepam',
    genericName: 'Lorazepam',
    category: 'Benzodiazepine',
    commonDosages: ['0.5mg', '1mg', '2mg'],
    contraindications: ['Acute narrow-angle glaucoma', 'Sleep apnea', 'Severe respiratory insufficiency'],
    sideEffects: ['Drowsiness', 'Dizziness', 'Weakness', 'Unsteadiness', 'Depression']
  },
  {
    id: '3',
    name: 'Lithium Carbonate',
    genericName: 'Lithium Carbonate',
    category: 'Mood Stabilizer',
    commonDosages: ['150mg', '300mg', '600mg'],
    contraindications: ['Renal impairment', 'Cardiovascular disease', 'Dehydration'],
    sideEffects: ['Tremor', 'Thirst', 'Frequent urination', 'Weight gain', 'Nausea']
  },
  {
    id: '4',
    name: 'Quetiapine',
    genericName: 'Quetiapine Fumarate',
    category: 'Atypical Antipsychotic',
    commonDosages: ['25mg', '50mg', '100mg', '200mg', '300mg', '400mg'],
    contraindications: ['Coma', 'CNS depression', 'Alcohol intoxication'],
    sideEffects: ['Drowsiness', 'Dizziness', 'Dry mouth', 'Constipation', 'Weight gain']
  }
];

const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Sarah Johnson',
    medications: [
      {
        medicationId: '1',
        medicationName: 'Sertraline',
        dosage: '50mg',
        frequency: 'Once daily',
        duration: '90 days',
        quantity: 90,
        refills: 2,
        instructions: 'Take with food. May cause drowsiness.'
      },
      {
        medicationId: '2',
        medicationName: 'Lorazepam',
        dosage: '0.5mg',
        frequency: 'As needed',
        duration: '30 days',
        quantity: 15,
        refills: 0,
        instructions: 'Take as needed for severe anxiety. Do not exceed 2 tablets per day.'
      }
    ],
    prescribedBy: 'Dr. Smith',
    prescribedDate: '2024-10-15',
    status: 'Active',
    notes: 'Starting combination therapy for depression and anxiety. Monitor for side effects and drug interactions.'
  },
  {
    id: '2',
    patientId: '1',
    patientName: 'Sarah Johnson',
    medications: [
      {
        medicationId: '1',
        medicationName: 'Sertraline',
        dosage: '75mg',
        frequency: 'Once daily',
        duration: '90 days',
        quantity: 90,
        refills: 2,
        instructions: 'Take with food. Increased dose.'
      }
    ],
    prescribedBy: 'Dr. Smith',
    prescribedDate: '2024-11-01',
    status: 'Completed',
    notes: 'Dose adjustment - increased Sertraline to 75mg for better efficacy.'
  },
  {
    id: '3',
    patientId: '2',
    patientName: 'Michael Chen',
    medications: [
      {
        medicationId: '3',
        medicationName: 'Lithium Carbonate',
        dosage: '300mg',
        frequency: 'Twice daily',
        duration: '90 days',
        quantity: 180,
        refills: 3,
        instructions: 'Take with meals. Stay well hydrated. Regular blood tests required.'
      },
      {
        medicationId: '4',
        medicationName: 'Quetiapine',
        dosage: '50mg',
        frequency: 'At bedtime',
        duration: '90 days',
        quantity: 90,
        refills: 3,
        instructions: 'Take at bedtime for mood stabilization.'
      }
    ],
    prescribedBy: 'Dr. Smith',
    prescribedDate: '2024-09-20',
    status: 'Active',
    notes: 'Bipolar maintenance therapy. Monitor lithium levels monthly and watch for metabolic side effects from quetiapine.'
  },
  {
    id: '4',
    patientId: '3',
    patientName: 'Emma Rodriguez',
    medications: [
      {
        medicationId: '4',
        medicationName: 'Quetiapine',
        dosage: '25mg',
        frequency: 'At bedtime',
        duration: '60 days',
        quantity: 60,
        refills: 1,
        instructions: 'Take at bedtime. May cause drowsiness.'
      }
    ],
    prescribedBy: 'Dr. Smith',
    prescribedDate: '2024-11-15',
    status: 'Active',
    notes: 'Low dose for sleep aid and anxiety management.'
  }
];

function CreatePrescription() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'patients' | 'prescriptions' | 'new-prescription'>('patients');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Completed' | 'Cancelled' | 'Pending'>('All');

  // Sidebar state and handlers
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const closeSidebar = () => setSidebarOpen(false);
  
  // Form state
  const [medications, setMedications] = useState<PrescriptionMedication[]>([{
    medicationId: '',
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    quantity: 0,
    refills: 0,
    instructions: ''
  }]);
  const [prescriptionNotes, setPrescriptionNotes] = useState('');

  const filteredPatients = useMemo(() => {
    return mockPatients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const filteredPrescriptions = useMemo(() => {
    let filtered = prescriptions;
    
    if (selectedPatient) {
      filtered = filtered.filter(p => p.patientId === selectedPatient.id);
    }
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    
    return filtered.sort((a, b) => new Date(b.prescribedDate).getTime() - new Date(a.prescribedDate).getTime());
  }, [prescriptions, selectedPatient, statusFilter]);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveTab('prescriptions');
  };

  const handleNewPrescription = () => {
    if (selectedPatient) {
      setMedications([{
        medicationId: '',
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: '',
        quantity: 0,
        refills: 0,
        instructions: ''
      }]);
      setPrescriptionNotes('');
    }
    setActiveTab('new-prescription');
  };

  const addMedication = () => {
    setMedications(prev => [...prev, {
      medicationId: '',
      medicationName: '',
      dosage: '',
      frequency: '',
      duration: '',
      quantity: 0,
      refills: 0,
      instructions: ''
    }]);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateMedication = (index: number, field: keyof PrescriptionMedication, value: any) => {
    setMedications(prev => prev.map((med, i) => {
      if (i === index) {
        const updated = { ...med, [field]: value };
        if (field === 'medicationId') {
          const selectedMed = mockMedications.find(m => m.id === value);
          updated.medicationName = selectedMed?.name || '';
        }
        return updated;
      }
      return med;
    }));
  };

  const handleSubmitPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient || medications.some(med => !med.medicationId)) return;
    
    // Validate all medications have required fields
    const isValid = medications.every(med => 
      med.medicationId && med.dosage && med.frequency && med.duration && med.quantity > 0
    );
    
    if (!isValid) return;

    const newPrescription: Prescription = {
      id: Date.now().toString(),
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      medications: medications.map(med => ({
        ...med,
        medicationName: mockMedications.find(m => m.id === med.medicationId)?.name || ''
      })),
      prescribedBy: 'Dr. Smith',
      prescribedDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      notes: prescriptionNotes
    };

    setPrescriptions(prev => [newPrescription, ...prev]);
    setActiveTab('prescriptions');
    
    // Reset form
    setMedications([{
      medicationId: '',
      medicationName: '',
      dosage: '',
      frequency: '',
      duration: '',
      quantity: 0,
      refills: 0,
      instructions: ''
    }]);
    setPrescriptionNotes('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Completed': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'Cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Pending': return <Pause className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-screen">
        <NavBar onMenuClick={toggleSidebar} />
       <div className="flex flex-1 overflow-hidden">
         {/* Sidebar - Desktop */}
         <div className="w-80 bg-white border-r hidden lg:block">
           <SidebarForPsy isOpen={true} onClose={closeSidebar} />
         </div>
        
         {/* Mobile Sidebar */}
         <div className="lg:hidden">
           <SidebarForPsy isOpen={sidebarOpen} onClose={closeSidebar} />
         </div>

         {/* Main Content Area */}
         <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-auto">
           <div className="max-w-7xl mx-auto p-6 pb-12">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Psychiatrist Portal</h1>
                <p className="text-gray-600 mt-1">Prescription Management System</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Dr. Smith</p>
              <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8 border border-blue-100">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('patients')}
              className={`flex-1 px-6 py-4 text-sm font-medium rounded-tl-xl transition-colors ${
                activeTab === 'patients'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Patients
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              disabled={!selectedPatient}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'prescriptions'
                  ? 'bg-blue-600 text-white'
                  : selectedPatient 
                    ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Prescription History
            </button>
            <button
              onClick={handleNewPrescription}
              disabled={!selectedPatient}
              className={`flex-1 px-6 py-4 text-sm font-medium rounded-tr-xl transition-colors ${
                activeTab === 'new-prescription'
                  ? 'bg-blue-600 text-white'
                  : selectedPatient 
                    ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              New Prescription
            </button>
          </div>
        </div>

        {/* Selected Patient Info */}
        {selectedPatient && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-blue-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Born {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {selectedPatient.phone}
                    </span>
                    <span className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {selectedPatient.email}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            {(selectedPatient.allergies.length > 0 || selectedPatient.currentConditions.length > 0) && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedPatient.allergies.length > 0 && (
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                      <span className="font-medium text-red-800">Allergies</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.allergies.map((allergy, index) => (
                        <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedPatient.currentConditions.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <Heart className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-800">Current Conditions</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.currentConditions.map((condition, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-100">
          {activeTab === 'patients' && (
            <div className="p-6">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search patients by name, phone, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    className="p-6 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 group-hover:bg-blue-100 rounded-full transition-colors">
                          <User className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{patient.gender}</span>
                            <span>Born {new Date(patient.dateOfBirth).toLocaleDateString()}</span>
                            <span className="flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {patient.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Last visit</p>
                        <p className="text-sm font-medium">{new Date(patient.lastVisit).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {(patient.allergies.length > 0 || patient.currentConditions.length > 0) && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {patient.allergies.map((allergy, index) => (
                          <span key={`allergy-${index}`} className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                            Allergy: {allergy}
                          </span>
                        ))}
                        {patient.currentConditions.slice(0, 2).map((condition, index) => (
                          <span key={`condition-${index}`} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {condition}
                          </span>
                        ))}
                        {patient.currentConditions.length > 2 && (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                            +{patient.currentConditions.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'prescriptions' && selectedPatient && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Prescription History</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {filteredPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                          <Pill className="w-7 h-7 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Prescription #{prescription.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {prescription.medications.length} medication{prescription.medications.length > 1 ? 's' : ''} prescribed
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(prescription.status)}`}>
                          <span className="flex items-center">
                            {getStatusIcon(prescription.status)}
                            <span className="ml-1">{prescription.status}</span>
                          </span>
                        </span>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Prescribed</p>
                          <p className="text-sm font-medium">{new Date(prescription.prescribedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Medications List */}
                    <div className="space-y-4 mb-4">
                      {prescription.medications.map((medication, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">{medication.medicationName}</h4>
                              <p className="text-sm text-gray-600">{medication.dosage} • {medication.frequency}</p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              #{index + 1}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Duration</p>
                              <p className="text-sm text-gray-900">{medication.duration}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Quantity</p>
                              <p className="text-sm text-gray-900">{medication.quantity} tablets</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Refills</p>
                              <p className="text-sm text-gray-900">{medication.refills} remaining</p>
                            </div>
                          </div>
                          
                          {medication.instructions && (
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Instructions</p>
                              <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded border">{medication.instructions}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {prescription.notes && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Clinical Notes</p>
                        <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded border border-blue-200">{prescription.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
                
                {filteredPrescriptions.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No prescriptions found for the selected filters.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'new-prescription' && selectedPatient && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">New Prescription</h2>
              
              <form onSubmit={handleSubmitPrescription} className="space-y-6">
                {/* Medications Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Medications</h3>
                    <button
                      type="button"
                      onClick={addMedication}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Medication
                    </button>
                  </div>

                  {medications.map((medication, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Medication #{index + 1}</h4>
                        {medications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedication(index)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Medication *
                          </label>
                          <select
                            required
                            value={medication.medicationId}
                            onChange={(e) => updateMedication(index, 'medicationId', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select medication...</option>
                            {mockMedications.map((med) => (
                              <option key={med.id} value={med.id}>
                                {med.name} ({med.genericName})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dosage *
                          </label>
                          <select
                            required
                            value={medication.dosage}
                            onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={!medication.medicationId}
                          >
                            <option value="">Select dosage...</option>
                            {medication.medicationId && mockMedications.find(m => m.id === medication.medicationId)?.commonDosages.map((dosage) => (
                              <option key={dosage} value={dosage}>
                                {dosage}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Frequency *
                          </label>
                          <select
                            required
                            value={medication.frequency}
                            onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select frequency...</option>
                            <option value="Once daily">Once daily</option>
                            <option value="Twice daily">Twice daily</option>
                            <option value="Three times daily">Three times daily</option>
                            <option value="Four times daily">Four times daily</option>
                            <option value="As needed">As needed</option>
                            <option value="At bedtime">At bedtime</option>
                            <option value="Every other day">Every other day</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration *
                          </label>
                          <select
                            required
                            value={medication.duration}
                            onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select duration...</option>
                            <option value="7 days">7 days</option>
                            <option value="14 days">14 days</option>
                            <option value="30 days">30 days</option>
                            <option value="60 days">60 days</option>
                            <option value="90 days">90 days</option>
                            <option value="180 days">180 days</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity *
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={medication.quantity || ''}
                            onChange={(e) => updateMedication(index, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Number of tablets/capsules"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Refills
                          </label>
                          <select
                            value={medication.refills}
                            onChange={(e) => updateMedication(index, 'refills', parseInt(e.target.value))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value={0}>0 - No refills</option>
                            <option value={1}>1 refill</option>
                            <option value={2}>2 refills</option>
                            <option value={3}>3 refills</option>
                            <option value={5}>5 refills</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Instructions
                        </label>
                        <textarea
                          value={medication.instructions}
                          onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                          rows={2}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Special instructions for this medication..."
                        />
                      </div>

                      {/* Medication Information */}
                      {medication.medicationId && (
                        <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <h5 className="font-medium text-blue-900 mb-2">Medication Information</h5>
                          {(() => {
                            const med = mockMedications.find(m => m.id === medication.medicationId);
                            if (!med) return null;
                            
                            return (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div>
                                  <p className="font-medium text-blue-800 mb-1">Category</p>
                                  <p className="text-blue-700">{med.category}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-blue-800 mb-1">Common Side Effects</p>
                                  <p className="text-blue-700">{med.sideEffects.slice(0, 2).join(', ')}</p>
                                </div>
                                <div className="md:col-span-2">
                                  <p className="font-medium text-blue-800 mb-1">Contraindications</p>
                                  <p className="text-blue-700">{med.contraindications.join(', ')}</p>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Overall Prescription Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overall Clinical Notes
                  </label>
                  <textarea
                    value={prescriptionNotes}
                    onChange={(e) => setPrescriptionNotes(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Overall notes about this prescription (drug interactions, monitoring requirements, etc.)..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab('prescriptions')}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Prescription
                  </button>
                </div>
              </form>
            </div>
          )}

          {!selectedPatient && activeTab !== 'patients' && (
            <div className="p-6 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Please select a patient first to view prescriptions or create new ones.</p>
            </div>
          )}
        </div>
           </div>
         </div>
       </div>
    </div>
  );
}

export default CreatePrescription;
 