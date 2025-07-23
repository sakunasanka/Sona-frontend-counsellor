import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NavBar, SidebarForPsy } from "../../components/layout";
import {
  Calendar,
  Users,
  Plus,
  Trash2,
  Save,
  FileText,
  ChevronDown,
  Edit,
  Send,
  CheckCircle,
  Clock,
  Archive,
  Sun,
  CloudSun,
  Sunset,
  Moon,
  X,
  AlertCircle,
  CheckCheck
} from "lucide-react";

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface MedicineTemplate {
  id: string;
  name: string;
  commonDosages: string[];
  category: string;
  form: 'tablet' | 'liquid' | 'capsule' | 'injection';
  unit: string; // mg, ml, etc.
}

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

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  patientId: string;
}

interface SavedPrescription {
  id: string;
  patientId: string;
  patientName: string;
  startDate: string;
  endDate: string;
  medicines: Medicine[];
  notes: string;
  status: 'active' | 'discontinued';
  isNotified: boolean;
  createdAt: string;
  lastModified: string;
}

const CreatePrescription = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'saved'>('create');
  const [highlightedPrescriptionId, setHighlightedPrescriptionId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Notification functions
  const showNotification = (type: Notification['type'], title: string, message: string) => {
    const id = Date.now().toString();
    const newNotification: Notification = { id, type, title, message };
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Handle URL parameters to set the active tab and highlight prescription
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const prescriptionIdParam = searchParams.get('prescriptionId');
    
    if (tabParam === 'saved') {
      setActiveTab('saved');
    } else if (tabParam === 'create') {
      setActiveTab('create');
    }

    // If we have a prescription ID, highlight it and scroll to it after a short delay
    if (prescriptionIdParam) {
      setHighlightedPrescriptionId(prescriptionIdParam);
      setTimeout(() => {
        const element = document.getElementById(`prescription-${prescriptionIdParam}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
      
      // Remove highlight after 3 seconds
      setTimeout(() => {
        setHighlightedPrescriptionId(null);
      }, 3000);
    }
  }, [searchParams]);

  // Mock patient data
  const patients: Patient[] = [
    { id: "1", name: "Ronath Konara", age: 28, gender: "Male", patientId: "PT001" },
    { id: "2", name: "Hashara Edirimauni", age: 34, gender: "Female", patientId: "PT002" },
    { id: "3", name: "Shenara Fernando", age: 42, gender: "Female", patientId: "PT003" },
    { id: "4", name: "Dayasiri Mendis", age: 51, gender: "Male", patientId: "PT004" },
    { id: "5", name: "Kumari Silva", age: 29, gender: "Female", patientId: "PT005" },
    { id: "6", name: "Kamal Perera", age: 38, gender: "Male", patientId: "PT006" }
  ];

  // Mock medicine templates with auto-suggestions
  const medicineTemplates: MedicineTemplate[] = [
    { id: "1", name: "Paracetamol", commonDosages: ["500mg", "650mg", "1000mg"], category: "Analgesic", form: "tablet", unit: "mg" },
    { id: "2", name: "Amoxicillin", commonDosages: ["250mg", "500mg", "875mg"], category: "Antibiotic", form: "capsule", unit: "mg" },
    { id: "3", name: "Sertraline", commonDosages: ["25mg", "50mg", "100mg"], category: "Antidepressant", form: "tablet", unit: "mg" },
    { id: "4", name: "Lorazepam", commonDosages: ["0.5mg", "1mg", "2mg"], category: "Anxiolytic", form: "tablet", unit: "mg" },
    { id: "5", name: "Risperidone", commonDosages: ["1mg", "2mg", "3mg", "4mg"], category: "Antipsychotic", form: "tablet", unit: "mg" },
    { id: "6", name: "Lithium Carbonate", commonDosages: ["300mg", "400mg", "450mg"], category: "Mood Stabilizer", form: "tablet", unit: "mg" },
    { id: "7", name: "Fluoxetine", commonDosages: ["10mg", "20mg", "40mg"], category: "Antidepressant", form: "capsule", unit: "mg" },
    { id: "8", name: "Alprazolam", commonDosages: ["0.25mg", "0.5mg", "1mg"], category: "Anxiolytic", form: "tablet", unit: "mg" },
    { id: "9", name: "Quetiapine", commonDosages: ["25mg", "50mg", "100mg", "200mg"], category: "Antipsychotic", form: "tablet", unit: "mg" },
    { id: "10", name: "Escitalopram", commonDosages: ["5mg", "10mg", "20mg"], category: "Antidepressant", form: "tablet", unit: "mg" },
    { id: "11", name: "Cough Syrup", commonDosages: ["5ml", "10ml", "15ml"], category: "Cough Suppressant", form: "liquid", unit: "ml" },
    { id: "12", name: "Amoxicillin Suspension", commonDosages: ["125mg/5ml", "250mg/5ml"], category: "Antibiotic", form: "liquid", unit: "ml" }
  ];

  // Form state
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [addedMedicines, setAddedMedicines] = useState<Medicine[]>([]);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<'active' | 'discontinued'>('active');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  // Medicine adding state
  const [currentMedicine, setCurrentMedicine] = useState<Medicine>({
    id: "",
    name: "",
    dosage: "",
    form: "" as 'tablet' | 'liquid' | 'capsule' | 'injection',
    unit: "",
    timingDosages: [],
    frequency: "",
    mealRelation: "",
    duration: "",
    durationType: "",
    specialInstructions: ""
  });

  const [medicineSearch, setMedicineSearch] = useState("");
  const [showMedicineDropdown, setShowMedicineDropdown] = useState(false);
  const [selectedMedicineTemplate, setSelectedMedicineTemplate] = useState<MedicineTemplate | null>(null);

  // Saved prescriptions state with localStorage persistence
  const [savedPrescriptions, setSavedPrescriptions] = useState<SavedPrescription[]>(() => {
    const stored = localStorage.getItem('savedPrescriptions');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default prescriptions if none in localStorage
    return [
      {
        id: "1",
        patientId: "1",
        patientName: "Ronath Konara",
        startDate: "2025-07-13",
        endDate: "2025-08-13",
        medicines: [
          {
            id: "1",
            name: "Sertraline",
            dosage: "50mg",
            form: "tablet",
            unit: "mg",
            timingDosages: [
              { timing: "morning", amount: "1", customAmount: undefined }
            ],
            frequency: "daily",
            mealRelation: "after-meal",
            duration: "4",
            durationType: "weeks",
            specialInstructions: "Start with half dose for first week"
          }
        ],
        notes: "Patient showing signs of mild depression. Monitor closely.",
        status: "active",
        isNotified: true,
        createdAt: "2025-07-13T10:30:00Z",
        lastModified: "2025-07-13T10:30:00Z"
      },
      {
        id: "2",
        patientId: "2",
        patientName: "Hashara Edirimauni",
        startDate: "2025-07-12",
        endDate: "2025-08-12",
        medicines: [
          {
            id: "2",
            name: "Fluoxetine",
            dosage: "20mg",
            form: "tablet",
            unit: "mg",
            timingDosages: [
              { timing: "morning", amount: "1", customAmount: undefined }
            ],
            frequency: "daily",
            mealRelation: "after-meal",
            duration: "6",
            durationType: "weeks",
            specialInstructions: ""
          },
          {
            id: "3",
            name: "Lorazepam",
            dosage: "1mg",
            form: "tablet",
            unit: "mg",
            timingDosages: [
              { timing: "evening", amount: "0.5", customAmount: undefined }
            ],
            frequency: "daily",
            mealRelation: "before-meal",
            duration: "2",
            durationType: "weeks",
            specialInstructions: "Only as needed for anxiety"
          }
        ],
        notes: "Anxiety and depression symptoms. Monitor for side effects.",
        status: "active",
        isNotified: true,
        createdAt: "2025-07-12T14:20:00Z",
        lastModified: "2025-07-12T14:20:00Z"
      },
      {
        id: "3",
        patientId: "3",
        patientName: "Shenara Fernando",
        startDate: "2025-07-10",
        endDate: "2025-08-10",
        medicines: [
          {
            id: "4",
            name: "Alprazolam",
            dosage: "0.5mg",
            form: "tablet",
            unit: "mg",
            timingDosages: [
              { timing: "evening", amount: "1", customAmount: undefined }
            ],
            frequency: "daily",
            mealRelation: "after-meal",
            duration: "3",
            durationType: "weeks",
            specialInstructions: "Discontinued due to patient request"
          }
        ],
        notes: "Patient requested to discontinue medication.",
        status: "discontinued",
        isNotified: false,
        createdAt: "2025-07-10T09:15:00Z",
        lastModified: "2025-07-10T09:15:00Z"
      },
      {
        id: "4",
        patientId: "4",
        patientName: "Dayasiri Mendis",
        startDate: "2025-07-08",
        endDate: "2025-09-08",
        medicines: [
          {
            id: "5",
            name: "Quetiapine",
            dosage: "100mg",
            form: "tablet",
            unit: "mg",
            timingDosages: [
              { timing: "evening", amount: "1", customAmount: undefined }
            ],
            frequency: "daily",
            mealRelation: "after-meal",
            duration: "8",
            durationType: "weeks",
            specialInstructions: ""
          },
          {
            id: "6",
            name: "Lithium Carbonate",
            dosage: "300mg",
            form: "tablet",
            unit: "mg",
            timingDosages: [
              { timing: "morning", amount: "1", customAmount: undefined },
              { timing: "evening", amount: "1", customAmount: undefined }
            ],
            frequency: "daily",
            mealRelation: "after-meal",
            duration: "8",
            durationType: "weeks",
            specialInstructions: "Monitor blood levels monthly"
          },
          {
            id: "7",
            name: "Risperidone",
            dosage: "2mg",
            form: "tablet",
            unit: "mg",
            timingDosages: [
              { timing: "morning", amount: "1", customAmount: undefined }
            ],
            frequency: "daily",
            mealRelation: "after-meal",
            duration: "8",
            durationType: "weeks",
            specialInstructions: ""
          }
        ],
        notes: "Bipolar disorder treatment plan. Regular monitoring required.",
        status: "active",
        isNotified: true,
        createdAt: "2025-07-08T11:45:00Z",
        lastModified: "2025-07-08T11:45:00Z"
      },
      {
        id: "4",
        patientId: "4",
        patientName: "Dayasiri Mendis",
        startDate: "2025-07-10",
        endDate: "2025-08-10",
        medicines: [
          {
            id: "8",
            name: "Citalopram",
            dosage: "20mg",
            form: "tablet",
            unit: "mg",
            timingDosages: [
              { timing: "morning", amount: "1", customAmount: undefined }
            ],
            frequency: "daily",
            mealRelation: "after-meal",
            duration: "6",
            durationType: "weeks",
            specialInstructions: "May cause initial drowsiness"
          },
          {
            id: "9",
            name: "Lorazepam",
            dosage: "1mg",
            form: "tablet",
            unit: "mg",
            timingDosages: [
              { timing: "night", amount: "0.5", customAmount: "0.5" }
            ],
            frequency: "as-needed",
            mealRelation: "before-meal",
            duration: "2",
            durationType: "weeks",
            specialInstructions: "Only when experiencing severe anxiety"
          }
        ],
        notes: "Anxiety and depression treatment. Start with lower dose of Lorazepam.",
        status: "discontinued",
        isNotified: false,
        createdAt: "2025-07-10T14:20:00Z",
        lastModified: "2025-07-15T09:30:00Z"
      },
      {
        id: "5",
        patientId: "5",
        patientName: "Kumari Silva",
        startDate: "2025-07-14",
        endDate: "2025-09-14",
        medicines: [
          {
            id: "10",
            name: "Paroxetine",
            dosage: "25mg",
            form: "tablet",
            unit: "mg",
            timingDosages: [
              { timing: "morning", amount: "1", customAmount: undefined }
            ],
            frequency: "daily",
            mealRelation: "with-meal",
            duration: "8",
            durationType: "weeks",
            specialInstructions: "Take with food to reduce nausea"
          },
          {
            id: "11",
            name: "Alprazolam",
            dosage: "0.5mg",
            form: "tablet",
            unit: "mg",
            timingDosages: [
              { timing: "morning", amount: "0.5", customAmount: "0.5" },
              { timing: "evening", amount: "0.5", customAmount: "0.5" }
            ],
            frequency: "twice-daily",
            mealRelation: "before-meal",
            duration: "4",
            durationType: "weeks",
            specialInstructions: "Gradually reduce dose after 3 weeks"
          }
        ],
        notes: "Post-traumatic stress disorder treatment. Patient responding well to therapy.",
        status: "active",
        isNotified: true,
        createdAt: "2025-07-14T16:45:00Z",
        lastModified: "2025-07-14T16:45:00Z"
      },
      {
        id: "6",
        patientId: "6",
        patientName: "Chamara Perera",
        startDate: "2025-07-15",
        endDate: "2025-09-15",
        medicines: [
          {
            id: "12",
            name: "Escitalopram",
            dosage: "10mg",
            form: "tablet",
            unit: "mg",
            timingDosages: [
              { timing: "morning", amount: "1", customAmount: undefined }
            ],
            frequency: "daily",
            mealRelation: "with-meal",
            duration: "12",
            durationType: "weeks",
            specialInstructions: "Increase to 20mg after 4 weeks if well tolerated"
          },
          {
            id: "13",
            name: "Mirtazapine",
            dosage: "15mg",
            form: "tablet",
            unit: "mg",
            timingDosages: [
              { timing: "night", amount: "1", customAmount: undefined }
            ],
            frequency: "daily",
            mealRelation: "before-meal",
            duration: "12",
            durationType: "weeks",
            specialInstructions: "May cause sedation initially - take at bedtime"
          }
        ],
        notes: "Major depression with insomnia. Combination therapy for sleep and mood improvement.",
        status: "active",
        isNotified: true,
        createdAt: "2025-07-15T09:20:00Z",
        lastModified: "2025-07-15T09:20:00Z"
      },
      {
        id: "7",
        patientId: "7",
        patientName: "Nayani Wickramasinghe",
        startDate: "2025-07-16",
        endDate: "2025-08-16",
        medicines: [
          {
            id: "14",
            name: "Olanzapine",
            dosage: "5mg",
            form: "tablet",
            unit: "mg",
            timingDosages: [
              { timing: "evening", amount: "1", customAmount: undefined }
            ],
            frequency: "daily",
            mealRelation: "after-meal",
            duration: "6",
            durationType: "weeks",
            specialInstructions: "Monitor weight and blood glucose"
          },
          {
            id: "15",
            name: "Haloperidol",
            dosage: "2ml",
            form: "liquid",
            unit: "ml",
            timingDosages: [
              { timing: "morning", amount: "1", customAmount: undefined },
              { timing: "evening", amount: "1", customAmount: undefined }
            ],
            frequency: "twice-daily",
            mealRelation: "after-meal",
            duration: "4",
            durationType: "weeks",
            specialInstructions: "Liquid form for easier administration"
          },
          {
            id: "16",
            name: "Vitamin B12",
            dosage: "1ml",
            form: "injection",
            unit: "ml",
            timingDosages: [
              { timing: "morning", amount: "1", customAmount: undefined }
            ],
            frequency: "weekly",
            mealRelation: "any-time",
            duration: "4",
            durationType: "weeks",
            specialInstructions: "Intramuscular injection once weekly"
          }
        ],
        notes: "Acute psychosis episode. Multi-modal treatment with tablets, liquid, and injection forms.",
        status: "active",
        isNotified: true,
        createdAt: "2025-07-16T11:30:00Z",
        lastModified: "2025-07-16T11:30:00Z"
      }
    ];
  });

  // Function to update prescriptions in both state and localStorage
  const updateSavedPrescriptions = (newPrescriptions: SavedPrescription[]) => {
    setSavedPrescriptions(newPrescriptions);
    localStorage.setItem('savedPrescriptions', JSON.stringify(newPrescriptions));
    
    // Dispatch custom event to notify dashboard of changes
    window.dispatchEvent(new CustomEvent('prescriptionsUpdated'));
  };

  // Initialize localStorage with default data if empty
  useEffect(() => {
    const stored = localStorage.getItem('savedPrescriptions');
    if (!stored) {
      localStorage.setItem('savedPrescriptions', JSON.stringify(savedPrescriptions));
    }
  }, []);

  const [editingPrescription, setEditingPrescription] = useState<SavedPrescription | null>(null);

  // Handle clicking outside the medicine dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.medicine-dropdown-container')) {
        setShowMedicineDropdown(false);
      }
    };

    if (showMedicineDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMedicineDropdown]);

  // Filter medicines based on search
  const filteredMedicines = medicineTemplates.filter(med =>
    med.name.toLowerCase().includes(medicineSearch.toLowerCase()) ||
    med.category.toLowerCase().includes(medicineSearch.toLowerCase())
  );

  // Add medicine to the prescription
  const addMedicineToList = () => {
    if (!currentMedicine.name || !currentMedicine.form || !currentMedicine.dosage || 
        !currentMedicine.frequency || !currentMedicine.mealRelation || 
        !currentMedicine.duration || !currentMedicine.durationType ||
        currentMedicine.timingDosages.length === 0) {
      
      const missingFields = [];
      if (!currentMedicine.name) missingFields.push("Medicine name");
      if (!currentMedicine.form) missingFields.push("Medicine type");
      if (!currentMedicine.dosage) missingFields.push("Dosage");
      if (currentMedicine.timingDosages.length === 0) missingFields.push("Consumption time");
      if (!currentMedicine.frequency) missingFields.push("Frequency");
      if (!currentMedicine.mealRelation) missingFields.push("Meal relation");
      if (!currentMedicine.duration) missingFields.push("Duration");
      if (!currentMedicine.durationType) missingFields.push("Duration type");
      
      showNotification(
        'error', 
        'Missing Required Fields', 
        `Please fill in the following fields: ${missingFields.join(', ')}`
      );
      return;
    }

    const newMedicine: Medicine = {
      ...currentMedicine,
      id: Date.now().toString()
    };

    setAddedMedicines([...addedMedicines, newMedicine]);
    
    // Show success notification
    showNotification(
      'success',
      'Medicine Added Successfully',
      `${currentMedicine.name} has been added to the prescription`
    );
    
    // Reset current medicine form
    setCurrentMedicine({
      id: "",
      name: "",
      dosage: "",
      form: "" as 'tablet' | 'liquid' | 'capsule' | 'injection',
      unit: "",
      timingDosages: [],
      frequency: "",
      mealRelation: "",
      duration: "",
      durationType: "",
      specialInstructions: ""
    });
    setMedicineSearch("");
    setSelectedMedicineTemplate(null);
  };

  // Remove medicine from list
  const removeMedicineFromList = (id: string) => {
    setAddedMedicines(addedMedicines.filter(med => med.id !== id));
  };

  // Select medicine template
  const selectMedicineTemplate = (template: MedicineTemplate) => {
    setCurrentMedicine({
      ...currentMedicine,
      name: template.name,
      form: template.form,
      unit: template.unit
    });
    setSelectedMedicineTemplate(template);
    setMedicineSearch(template.name);
    setShowMedicineDropdown(false);
  };

  // Select dosage
  const selectDosage = (dosage: string) => {
    setCurrentMedicine({
      ...currentMedicine,
      dosage: dosage
    });
  };

  // Handle timing dosage changes
  const updateTimingDosage = (timing: string, amount: string, customAmount?: string) => {
    const existingIndex = currentMedicine.timingDosages.findIndex(td => td.timing === timing);
    const newTimingDosages = [...currentMedicine.timingDosages];
    
    if (existingIndex >= 0) {
      newTimingDosages[existingIndex] = { timing, amount, customAmount };
    } else {
      newTimingDosages.push({ timing, amount, customAmount });
    }
    
    setCurrentMedicine({
      ...currentMedicine,
      timingDosages: newTimingDosages
    });
  };

  // Remove timing dosage
  const removeTimingDosage = (timing: string) => {
    const newTimingDosages = currentMedicine.timingDosages.filter(td => td.timing !== timing);
    setCurrentMedicine({
      ...currentMedicine,
      timingDosages: newTimingDosages
    });
  };

  // Save prescription
  const savePrescription = () => {
    if (!selectedPatient || !startDate || !endDate || addedMedicines.length === 0) {
      const missingFields = [];
      if (!selectedPatient) missingFields.push("Patient selection");
      if (!startDate) missingFields.push("Start date");
      if (!endDate) missingFields.push("End date");
      if (addedMedicines.length === 0) missingFields.push("At least one medicine");
      
      showNotification(
        'error',
        'Cannot Save Prescription',
        `Please complete the following: ${missingFields.join(', ')}`
      );
      return;
    }

    const newPrescription: SavedPrescription = {
      id: editingPrescription ? editingPrescription.id : Date.now().toString(),
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      startDate,
      endDate,
      medicines: addedMedicines,
      notes,
      status,
      isNotified: editingPrescription ? true : false, // Auto-notify for edits, manual for new prescriptions
      createdAt: editingPrescription ? editingPrescription.createdAt : new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    if (editingPrescription) {
      updateSavedPrescriptions(savedPrescriptions.map(p => 
        p.id === editingPrescription.id ? newPrescription : p
      ));
      setEditingPrescription(null);
      showNotification(
        'success',
        'Prescription Updated',
        'Prescription updated successfully! Patient has been automatically notified of the changes.'
      );
    } else {
      updateSavedPrescriptions([...savedPrescriptions, newPrescription]);
      showNotification(
        'success',
        'Prescription Saved',
        'Prescription saved successfully! Remember to notify the patient when ready.'
      );
    }

    // Reset form
    resetForm();
    setActiveTab('saved');
  };

  // Reset form
  const resetForm = () => {
    setSelectedPatient(null);
    setStartDate("");
    setEndDate("");
    setAddedMedicines([]);
    setNotes("");
    setStatus('active');
    setCurrentMedicine({
      id: "",
      name: "",
      dosage: "",
      form: "" as 'tablet' | 'liquid' | 'capsule' | 'injection',
      unit: "",
      timingDosages: [],
      frequency: "",
      mealRelation: "",
      duration: "",
      durationType: "",
      specialInstructions: ""
    });
    setMedicineSearch("");
    setSelectedMedicineTemplate(null);
  };

  // Edit prescription
  const editPrescription = (prescription: SavedPrescription) => {
    const patient = patients.find(p => p.id === prescription.patientId);
    setSelectedPatient(patient || null);
    setStartDate(prescription.startDate);
    setEndDate(prescription.endDate);
    setAddedMedicines(prescription.medicines);
    setNotes(prescription.notes);
    setStatus(prescription.status);
    setEditingPrescription(prescription);
    setActiveTab('create');
  };

  // Notify patient
  const notifyPatient = (prescriptionId: string) => {
    updateSavedPrescriptions(savedPrescriptions.map(p => 
      p.id === prescriptionId ? { ...p, isNotified: true, lastModified: new Date().toISOString() } : p
    ));
    showNotification(
      'success',
      'Patient Notified',
      'Patient has been notified about the prescription!'
    );
  };

  // Delete prescription
  const deletePrescription = (prescriptionId: string) => {
    if (confirm("Are you sure you want to delete this prescription?")) {
      updateSavedPrescriptions(savedPrescriptions.filter(p => p.id !== prescriptionId));
      showNotification(
        'success',
        'Prescription Deleted',
        'Prescription has been deleted successfully!'
      );
    }
  };

  const timingOptions = [
    { value: "morning", label: "Morning" },
    { value: "afternoon", label: "Afternoon" },
    { value: "evening", label: "Evening" },
    { value: "night", label: "Night" }
  ];

  const mealRelationOptions = [
    { value: "before-meal", label: "Before Meal" },
    { value: "after-meal", label: "After Meal" },
    { value: "with-meal", label: "With Meal" },
    { value: "empty-stomach", label: "Empty Stomach" },
    { value: "anytime", label: "Anytime" }
  ];

  const durationTypeOptions = [
    { value: "days", label: "Days" },
    { value: "weeks", label: "Weeks" },
    { value: "months", label: "Months" }
  ];

  const frequencyOptions = [
    { value: "daily", label: "Daily" },
    { value: "twice-daily", label: "Twice Daily" },
    { value: "three-times-daily", label: "Three Times Daily" },
    { value: "every-other-day", label: "Every Other Day" },
    { value: "weekly", label: "Weekly" },
    { value: "twice-weekly", label: "Twice Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "as-needed", label: "As Needed" }
  ];

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
        
        {/* Main content */}
        <div className="flex-1 overflow-auto p-4 lg:p-6 bg-gray-50">
          {/* Page Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Prescription Manager
                </h1>
                <p className="text-gray-600">Create, manage and track patient prescriptions</p>
              </div>
              <div className="flex gap-3">
                
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('create')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'create'
                      ? 'border-secondaryDusk text-secondaryDarker'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {editingPrescription ? 'Edit Prescription' : 'Create Prescription'}
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'saved'
                      ? 'border-secondaryDusk text-secondaryDarker'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Saved Prescriptions ({savedPrescriptions.length})
                </button>
              </nav>
            </div>
          </div>

          {activeTab === 'create' ? (
            <div className="space-y-6">
              {/* Patient Selection & Basic Info - Reorganized */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-secondaryDusk to-secondaryDarker px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    Prescription Details
                  </h2>
                  <p className="text-white mt-1">Complete the form below to create a prescription</p>
                </div>

                <div className="p-6">
                  {/* First Row: Patient Selection and Dates */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                    {/* Patient Selection */}
                    <div className="lg:col-span-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-secondaryDusk" />
                        <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {editingPrescription ? 'Patient (Cannot be changed)' : 'Select Patient *'}
                          </label>
                          {editingPrescription ? (
                            <div className="w-full p-3 border-2 border-gray-300 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed">
                              <span className="font-medium">
                                {selectedPatient ? selectedPatient.name : "Unknown Patient"}
                              </span>
                              <div className="text-sm text-gray-500 mt-1">
                                Patient cannot be changed when editing prescription
                              </div>
                            </div>
                          ) : (
                            <div className="relative">
                              <button
                                onClick={() => setShowPatientDropdown(!showPatientDropdown)}
                                className="w-full p-3 border-2 border-gray-200 rounded-xl text-left bg-white hover:border-secondaryDusk transition-all duration-200 flex items-center justify-between shadow-sm"
                              >
                                <span className={selectedPatient ? "text-gray-900 font-medium" : "text-gray-500"}>
                                  {selectedPatient ? selectedPatient.name : "Choose a patient..."}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showPatientDropdown ? 'rotate-180' : ''}`} />
                              </button>
                              
                              {showPatientDropdown && (
                                <div className="absolute top-full left-0 right-0 z-20 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto animate-fade-in">
                                  {patients.map((patient) => (
                                    <button
                                      key={patient.id}
                                      onClick={() => {
                                        setSelectedPatient(patient);
                                        setShowPatientDropdown(false);
                                      }}
                                      className="w-full p-4 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-all duration-200 group"
                                    >
                                      <div className="font-semibold text-gray-900 group-hover:text-blue-700">{patient.name}</div>
                                      <div className="text-sm text-gray-600 mt-1 group-hover:text-blue-600">
                                        ID: {patient.patientId} • {patient.age} years • {patient.gender}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {selectedPatient && (
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{selectedPatient.name}</h4>
                                <p className="text-sm text-gray-600">Patient ID: {selectedPatient.patientId}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="bg-white rounded-lg p-2 text-center">
                                <div className="text-gray-500">Age</div>
                                <div className="font-semibold text-gray-900">{selectedPatient.age} years</div>
                              </div>
                              <div className="bg-white rounded-lg p-2 text-center">
                                <div className="text-gray-500">Gender</div>
                                <div className="font-semibold text-gray-900">{selectedPatient.gender}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Date Selection and Status */}
                    <div className="lg:col-span-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-secondaryDusk" />
                        <h3 className="text-lg font-semibold text-gray-900">Prescription Duration & Status</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {editingPrescription ? 'Start Date (Cannot be changed)' : 'Start Date *'}
                            </label>
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className={`w-full p-3 border-2 rounded-xl transition-all shadow-sm ${
                                editingPrescription 
                                  ? 'border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed' 
                                  : 'border-gray-200 focus:border-secondaryDusk'
                              }`}
                              readOnly={!!editingPrescription}
                              disabled={!!editingPrescription}
                              required={!editingPrescription}
                            />
                            {editingPrescription && (
                              <div className="text-xs text-gray-500 mt-1">
                                Start date cannot be modified when editing
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              End Date *
                            </label>
                            <input
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-secondaryDusk transition-all shadow-sm"
                              required
                            />
                          </div>
                        </div>
                        
                        {/* {startDate && endDate && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="text-sm text-green-700 text-center">
                              <strong>Total Duration:</strong> {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                            </div>
                          </div>
                        )} */}

                        {/* Status Selection */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle className="w-4 h-4 text-secondaryDusk" />
                            <h4 className="text-base font-semibold text-gray-900">Prescription Status</h4>
                          </div>
                          
                          <div>
                            
                            
                            {/* Toggle Switch */}
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-3">
                                <button
                                  type="button"
                                  onClick={() => setStatus(status === 'active' ? 'discontinued' : 'active')}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                    status === 'active'
                                      ? 'bg-green-600'
                                      : 'bg-red-500'
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      status === 'active' ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                                <span className={`text-sm font-medium ${
                                  status === 'active' ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  {status === 'active' ? 'Active' : 'Discontinued'}
                                </span>
                              </div>
                            </div>
                            
                            <div className={`mt-3 p-3 rounded-lg text-sm ${
                              status === 'active' 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                              {status === 'active' 
                                ? '✓ This prescription is currently active and can be dispensed'
                                : '⚠ This prescription has been discontinued and should not be dispensed'
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Second Row: Additional Notes */}
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-secondaryDusk" />
                        <h3 className="text-lg font-semibold text-gray-900">Additional Notes & Instructions</h3>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Special Instructions, Warnings, or Additional Notes
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Enter any special instructions, warnings, contraindications, or additional notes for the patient..."
                          className="w-full h-24 p-3 border-2 border-gray-200 rounded-xl focus:border-secondaryDusk resize-none transition-all shadow-sm"
                          maxLength={500}
                        />
                        <div className="flex items-center justify-between mt-1">
                          <div className="text-xs text-gray-500">
                            {notes.length}/500 characters
                          </div>
                          {editingPrescription && (
                            <div className="text-xs text-blue-600 font-medium">
                              Currently editing prescription
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medicine Management */}
              <div className="space-y-6">
                {/* Add Medicine Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-secondaryDusk" />
                    Add Medicine
                  </h2>

                  <div className="space-y-6">
                    {/* Medicine Name and Type - First Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Medicine Search */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Medicine Name *
                        </label>
                        <div className="relative medicine-dropdown-container">
                          <input
                            type="text"
                            value={medicineSearch}
                            onChange={(e) => {
                              setMedicineSearch(e.target.value);
                              setShowMedicineDropdown(true);
                              
                              // Update current medicine name for custom medicines
                              setCurrentMedicine({
                                ...currentMedicine,
                                name: e.target.value
                              });
                              
                              // Clear selected template if typing custom medicine
                              if (selectedMedicineTemplate && !filteredMedicines.some(med => med.name.toLowerCase().includes(e.target.value.toLowerCase()))) {
                                setSelectedMedicineTemplate(null);
                              }
                            }}
                            onFocus={() => setShowMedicineDropdown(true)}
                            placeholder="Search for medicine..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-secondaryDusk"
                            required
                          />
                          {showMedicineDropdown && medicineSearch && (
                            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-fade-in">
                              {filteredMedicines.length > 0 ? (
                                filteredMedicines.map((medicine) => (
                                  <button
                                    key={medicine.id}
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault(); // Prevent input blur
                                      selectMedicineTemplate(medicine);
                                    }}
                                    className="w-full p-3 text-left hover:bg-secondary border-b border-gray-100 last:border-b-0 transition-all duration-200 group"
                                  >
                                    <div className="font-medium text-gray-900 group-hover:text-gray-800">{medicine.name}</div>
                                    <div className="text-sm text-gray-600 group-hover:text-gray-800">{medicine.category}</div>
                                  </button>
                                ))
                              ) : (
                                <div className="p-3 text-center text-gray-500">
                                  <div className="text-sm">No matching medicines found</div>
                                  <div className="text-xs mt-1 text-blue-600">Continue typing to use "<span className="font-medium">{medicineSearch}</span>" as a custom medicine</div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                        {/* Medicine Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                            Medicine Type *
                            </label>
                            <select
                            value={currentMedicine.form}
                            onChange={(e) => {
                                const selectedForm = e.target.value as 'tablet' | 'liquid' | 'capsule' | 'injection';
                                // Auto-set appropriate unit based on form
                                let defaultUnit = "";
                                if (selectedForm === 'liquid') {
                                defaultUnit = "ml";
                                } else if (selectedForm === 'tablet' || selectedForm === 'capsule') {
                                defaultUnit = "mg";
                                } else if (selectedForm === 'injection') {
                                defaultUnit = "ml";
                                }
                                
                                setCurrentMedicine({
                                ...currentMedicine, 
                                form: selectedForm,
                                unit: defaultUnit
                                });
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-secondaryDusk bg-white appearance-none cursor-pointer transition-all duration-200 hover:border-gray-400"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: 'right 0.75rem center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '1.5em 1.5em',
                                paddingRight: '2.5rem'
                            }}
                            required
                            >
                            <option value="">Select type</option>
                            <option value="tablet">Tablet</option>
                            <option value="capsule">Capsule</option>
                            <option value="liquid">Liquid</option>
                            <option value="injection">Injection</option>
                            </select>
                        </div>
                    </div>

                    {/* Dosage Selection */}
                    {(selectedMedicineTemplate || (medicineSearch && currentMedicine.name)) && currentMedicine.form && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dosage *
                        </label>
                        {selectedMedicineTemplate ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {selectedMedicineTemplate.commonDosages.map((dosage) => (
                              <button
                                key={dosage}
                                type="button"
                                onClick={() => selectDosage(dosage)}
                                className={`p-2 rounded-lg border text-sm transition-colors ${
                                  currentMedicine.dosage === dosage
                                    ? 'bg-secondaryDusk text-white border-secondaryDusk'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-secondaryDusk'
                                }`}
                              >
                                {dosage}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="max-w-md">
                            <input
                              type="text"
                              value={currentMedicine.dosage}
                              onChange={(e) => setCurrentMedicine({...currentMedicine, dosage: e.target.value})}
                              placeholder={
                                currentMedicine.form === 'liquid' 
                                  ? "Type the dosage, ex: 5ml" 
                                  : currentMedicine.form === 'injection'
                                  ? "Type the dosage, ex: 1ml or 50mg"
                                  : "Type the dosage, ex: 100mg"
                              }
                              className="w-full p-3 border border-gray-300 rounded-lg focus:border-secondaryDusk"
                              required
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Consumption Time - Full Width */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Consumption Time *
                      </label>
                      <div className="space-y-4">
                        {timingOptions.map((timing) => {
                          const existingDosage = currentMedicine.timingDosages.find(td => td.timing === timing.value);
                          const isActive = !!existingDosage;
                          
                          return (
                            <div
                              key={timing.value}
                              className={`border rounded-lg p-4 transition-all ${
                                isActive 
                                  ? 'border-secondaryDusk bg-secondaryDusk/5' 
                                  : 'border-gray-200 bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  {timing.value === 'morning' && <Sun className="w-5 h-5 text-yellow-500" />}
                                  {timing.value === 'afternoon' && <CloudSun className="w-5 h-5 text-orange-500" />}
                                  {timing.value === 'evening' && <Sunset className="w-5 h-5 text-orange-600" />}
                                  {timing.value === 'night' && <Moon className="w-5 h-5 text-blue-500" />}
                                  <span className="font-medium text-gray-700">{timing.label}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isActive) {
                                      removeTimingDosage(timing.value);
                                    } else {
                                      // For liquid and injection, start with custom input
                                      if (currentMedicine.form === 'liquid' || currentMedicine.form === 'injection') {
                                        updateTimingDosage(timing.value, 'custom');
                                      } else {
                                        updateTimingDosage(timing.value, "1");
                                      }
                                    }
                                  }}
                                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                    isActive
                                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                      : 'bg-secondaryDusk text-white hover:bg-secondaryDusk/80'
                                  }`}
                                >
                                  {isActive ? 'Remove' : 'Add'}
                                </button>
                              </div>
                              
                              {isActive && (
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                      {currentMedicine.form === 'liquid' 
                                        ? 'Amount (ml)' 
                                        : currentMedicine.form === 'injection'
                                        ? 'Amount (ml or units)'
                                        : currentMedicine.form === 'tablet'
                                        ? 'Number of tablets'
                                        : currentMedicine.form === 'capsule'
                                        ? 'Number of capsules'
                                        : 'Select a medicine type'}
                                    </label>
                                    <div className="flex items-center space-x-2">
                                      {(currentMedicine.form === 'tablet' || currentMedicine.form === 'capsule') && (
                                        <>
                                          {['1/4', '1/2', '1', '2', '3'].map((amount) => (
                                            <button
                                              key={amount}
                                              type="button"
                                              onClick={() => updateTimingDosage(timing.value, amount)}
                                              className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                                                existingDosage?.amount === amount
                                                  ? 'bg-secondaryDusk text-white border-secondaryDusk'
                                                  : 'bg-white text-gray-700 border-gray-300 hover:border-secondaryDusk'
                                              }`}
                                            >
                                              {amount}
                                            </button>
                                          ))}
                                          <button
                                            type="button"
                                            onClick={() => updateTimingDosage(timing.value, 'custom')}
                                            className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                                              existingDosage?.amount === 'custom'
                                                ? 'bg-secondaryDusk text-white border-secondaryDusk'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-secondaryDusk'
                                            }`}
                                          >
                                            Custom
                                          </button>
                                        </>
                                      )}
                                      {(currentMedicine.form === 'liquid' || currentMedicine.form === 'injection' || existingDosage?.amount === 'custom') && (
                                        <input
                                          type="number"
                                          step={currentMedicine.form === 'liquid' || currentMedicine.form === 'injection' ? "0.1" : "0.25"}
                                          min={currentMedicine.form === 'liquid' || currentMedicine.form === 'injection' ? "0.1" : "0.25"}
                                          placeholder={
                                            currentMedicine.form === 'liquid' 
                                              ? "Enter ml" 
                                              : currentMedicine.form === 'injection'
                                              ? "Enter ml or units"
                                              : "Enter amount"
                                          }
                                          value={existingDosage?.customAmount || ''}
                                          onChange={(e) => updateTimingDosage(timing.value, existingDosage?.amount || 'custom', e.target.value)}
                                          className="w-24 px-2 py-2 border border-gray-300 rounded-lg focus:border-secondaryDusk text-sm"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Frequency, Meal Relation, and Duration - In a Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Frequency */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Frequency *
                        </label>
                        <select
                          value={currentMedicine.frequency}
                          onChange={(e) => setCurrentMedicine({...currentMedicine, frequency: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:border-secondaryDusk bg-white appearance-none cursor-pointer transition-all duration-200 hover:border-gray-400"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 0.75rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.5em 1.5em',
                            paddingRight: '2.5rem'
                          }}
                          required
                        >
                          <option value="">Select frequency</option>
                          {frequencyOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Meal Relation */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meal Relation *
                        </label>
                        <select
                          value={currentMedicine.mealRelation}
                          onChange={(e) => setCurrentMedicine({...currentMedicine, mealRelation: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:border-secondaryDusk bg-white appearance-none cursor-pointer transition-all duration-200 hover:border-gray-400"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 0.75rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.5em 1.5em',
                            paddingRight: '2.5rem'
                          }}
                          required
                        >
                          <option value="">Select meal relation</option>
                          {mealRelationOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration *
                        </label>
                        <div className="flex gap-1">
                          <input
                            type="number"
                            value={currentMedicine.duration}
                            onChange={(e) => setCurrentMedicine({...currentMedicine, duration: e.target.value})}
                            min="1"
                            placeholder="Enter duration"
                            className="flex-1 p-1 mr--4 border border-gray-300 rounded-lg focus:border-secondaryDusk"
                            required
                          />
                          <select
                            value={currentMedicine.durationType}
                            onChange={(e) => setCurrentMedicine({...currentMedicine, durationType: e.target.value})}
                            className="p-3 border border-gray-300 rounded-lg focus:border-secondaryDusk bg-white appearance-none cursor-pointer transition-all duration-200 hover:border-gray-400"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: 'right 0.75rem center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: '1.5em 1.5em',
                              paddingRight: '2.5rem'
                            }}
                            required
                          >
                            <option value="">Select type</option>
                            {durationTypeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Special Instructions - Full Width */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Instructions
                      </label>
                      <textarea
                        value={currentMedicine.specialInstructions}
                        onChange={(e) => setCurrentMedicine({...currentMedicine, specialInstructions: e.target.value})}
                        placeholder="Any special instructions for this medication..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-secondaryDusk resize-none"
                        rows={3}
                      />
                    </div>
                  </div>

                  <button
                    onClick={addMedicineToList}
                    className="mt-4 px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Prescription
                  </button>
                </div>

                {/* Added Medicines List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-secondaryDusk" />
                    Added Medicines ({addedMedicines.length})
                  </h2>

                  {addedMedicines.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No medicines added yet.</p>
                      <p className="text-sm">Add medicines using the form above.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addedMedicines.map((medicine, index) => (
                        <div key={medicine.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2">
                                {index + 1}. {medicine.name} - {medicine.dosage}
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                                <div><strong>Form:</strong> {medicine.form}</div>
                                <div><strong>Frequency:</strong> {frequencyOptions.find(f => f.value === medicine.frequency)?.label}</div>
                                <div>
                                  <strong>Timing & Dosage:</strong> {
                                    medicine.timingDosages.map(td => {
                                      const timingLabel = timingOptions.find(to => to.value === td.timing)?.label;
                                      const amount = td.amount === 'custom' ? td.customAmount : td.amount;
                                      const unit = medicine.form === 'liquid' ? 'ml' : (medicine.form === 'tablet' ? 'tablet(s)' : 'capsule(s)');
                                      return `${timingLabel}: ${amount} ${unit}`;
                                    }).join(', ')
                                  }
                                </div>
                                <div><strong>Meal:</strong> {mealRelationOptions.find(m => m.value === medicine.mealRelation)?.label}</div>
                                <div><strong>Duration:</strong> {medicine.duration} {medicine.durationType}</div>
                              </div>
                              {medicine.specialInstructions && (
                                <div className="mt-2 text-sm text-gray-600">
                                  <strong>Instructions:</strong> {medicine.specialInstructions}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => removeMedicineFromList(medicine.id)}
                              className="text-red-600 hover:text-red-700 p-1 ml-4"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Save Prescription Button - Moved to Bottom */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-secondaryDarker hover:bg-secondaryDusk rounded-full flex items-center justify-center">
                      <Save className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {editingPrescription ? 'Update Prescription' : 'Save Prescription'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {addedMedicines.length} medicine(s) added • {selectedPatient ? `For ${selectedPatient.name}` : 'No patient selected'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {editingPrescription && (
                      <button
                        onClick={() => {
                          setEditingPrescription(null);
                          resetForm();
                        }}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                      >
                        Cancel Edit
                      </button>
                    )}
                    
                    <button
                      onClick={savePrescription}
                      disabled={!selectedPatient || !startDate || !endDate || addedMedicines.length === 0}
                      className={`px-8 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium ${
                        selectedPatient && startDate && endDate && addedMedicines.length > 0
                          ? 'bg-secondaryDarker text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Save className="w-5 h-5" />
                      {editingPrescription ? 'Update Prescription' : 'Save Prescription'}
                    </button>
                  </div>
                </div>
                
                {(!selectedPatient || !startDate || !endDate || addedMedicines.length === 0) && (
                  <div className="mt-4 p-3 bg-secondaryDarker-50 border border-gray-800 rounded-lg">
                    <p className="text-sm text-secondaryDusk">
                      <strong>Missing required fields:</strong>
                      {!selectedPatient && ' Patient selection'}
                      {!startDate && ' Start date'}
                      {!endDate && ' End date'}
                      {addedMedicines.length === 0 && ' At least one medicine'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Saved Prescriptions Tab */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Archive className="w-5 h-5 text-secondaryDusk" />
                Saved Prescriptions
              </h2>

              {savedPrescriptions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No prescriptions saved yet.</p>
                  <p className="text-sm">Create your first prescription to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedPrescriptions.map((prescription) => (
                    <div 
                      key={prescription.id} 
                      id={`prescription-${prescription.id}`}
                      className={`border border-gray-200 rounded-lg p-6 transition-all duration-500 ${
                        highlightedPrescriptionId === prescription.id 
                          ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300' 
                          : 'hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{prescription.patientName}</h3>
                          <p className="text-sm text-gray-600">
                            {prescription.startDate} to {prescription.endDate}
                          </p>
                          <p className="text-xs text-gray-500">
                            Created: {new Date(prescription.createdAt).toLocaleDateString()}
                            {prescription.lastModified !== prescription.createdAt && (
                              <span> • Modified: {new Date(prescription.lastModified).toLocaleDateString()}</span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                            prescription.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {prescription.status === 'active' ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Active
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3" />
                                Discontinued
                              </>
                            )}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                            prescription.isNotified
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {prescription.isNotified ? (
                              <>
                                <Send className="w-3 h-3" />
                                Patient Notified
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3" />
                                Pending Notification
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Medicines ({prescription.medicines.length})</h4>
                        <div className="space-y-2">
                          {prescription.medicines.map((medicine, index) => (
                            <div key={medicine.id} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              {index + 1}. {medicine.name} {medicine.dosage} - {
                                medicine.timingDosages.map(td => {
                                  const amount = td.amount === 'custom' ? td.customAmount : td.amount;
                                  const unit = medicine.form === 'liquid' ? 'ml' : (medicine.form === 'tablet' ? 'tablet(s)' : 'capsule(s)');
                                  return `${amount} ${unit}`;
                                }).join(' + ')
                              } - {medicine.frequency}
                            </div>
                          ))}
                        </div>
                      </div>

                      {prescription.notes && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
                          <p className="text-sm text-gray-600">{prescription.notes}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => editPrescription(prescription)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        
                        {!prescription.isNotified && (
                          <button
                            onClick={() => notifyPatient(prescription.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            Notify Patient
                          </button>
                        )}
                        
                        <button
                          onClick={() => deletePrescription(prescription.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                        
                        {prescription.isNotified && new Date(prescription.lastModified) > new Date(prescription.createdAt) && (
                          <span className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs border border-green-200">
                            Auto-notified on edit
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white border-l-4 rounded-lg shadow-lg p-4 transition-all duration-300 transform ${
              notification.type === 'success'
                ? 'border-green-500'
                : notification.type === 'error'
                ? 'border-red-500'
                : notification.type === 'warning'
                ? 'border-yellow-500'
                : 'border-blue-500'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {notification.type === 'success' && (
                    <CheckCheck className="w-5 h-5 text-green-500" />
                  )}
                  {notification.type === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  {notification.type === 'warning' && (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  {notification.type === 'info' && (
                    <AlertCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-semibold ${
                    notification.type === 'success'
                      ? 'text-green-800'
                      : notification.type === 'error'
                      ? 'text-red-800'
                      : notification.type === 'warning'
                      ? 'text-yellow-800'
                      : 'text-blue-800'
                  }`}>
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatePrescription;
