// Status constants
export const STATUS = {
  PENDING: 'pending',
  OVERDUE: 'overdue',
  PAID: 'paid'
};

// Status colors and icons mapping
export const STATUS_CONFIG = {
  [STATUS.PENDING]: {
    text: 'En attente',
    color: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    icon: 'Clock'
  },
  [STATUS.OVERDUE]: {
    text: 'En retard',
    color: 'bg-red-100 text-red-700 border border-red-300',
    icon: 'AlertCircle'
  },
  [STATUS.PAID]: {
    text: 'Payé',
    color: 'bg-green-100 text-green-700 border border-green-300',
    icon: 'CheckCircle'
  }
};

// Shift options
export const SHIFTS = ['Matin', 'Soir', 'Nuit'];

// Payment methods
export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Espèces' },
  { value: 'payroll', label: 'Déduction salariale' },
  { value: 'bank', label: 'Virement bancaire' },
  { value: 'mobile', label: 'Mobile Money' }
];

// Export formats
export const EXPORT_FORMATS = [
  { value: 'csv', label: 'CSV', icon: 'FileSpreadsheet' },
  { value: 'excel', label: 'Excel', icon: 'FileSpreadsheet' },
  { value: 'pdf', label: 'PDF', icon: 'FileText' }
];

// Date range options for export
export const DATE_RANGES = [
  { value: 'all', label: 'Toutes les données' },
  { value: 'today', label: "Aujourd'hui" },
  { value: 'yesterday', label: 'Hier' },
  { value: 'last7days', label: '7 derniers jours' },
  { value: 'last30days', label: '30 derniers jours' },
  { value: 'thisMonth', label: 'Ce mois' },
  { value: 'lastMonth', label: 'Mois dernier' },
  { value: 'custom', label: 'Période personnalisée' }
];

// Default settings
export const DEFAULT_SETTINGS = {
  managerPin: '1234',
  monthlySalary: 15000.00,
  dueDateDays: 5,
  autoDeductionDays: 7,
  notifications: {
    dueDateReminder: true,
    overdueAlert: true,
    dailySummary: false
  },
  receiptPrinterSettings: {
    name: 'Default Printer',
    paperWidth: 80,
    copies: 2
  }
};

// Local storage keys
export const STORAGE_KEYS = {
  SHORTS: 'station_shorts_data',
  SETTINGS: 'station_settings',
  VENDORS: 'station_vendors'
};

// Format number helper
export const formatNumber = (num) => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  });
};

// Generate receipt number
export const generateReceiptNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `REC-${year}${month}${day}-${random}`;
};

// Calculate due date
export const calculateDueDate = (startDate, days = 5) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: 'short', 
    year: '2-digit' 
  });
};

// Filter shorts by status
export const filterShortsByStatus = (shorts, status) => {
  if (status === 'all') return shorts;
  return shorts.filter(short => short.status === status);
};

// Calculate summary statistics
export const calculateSummary = (shorts) => {
  const total = shorts.reduce((sum, short) => sum + short.shortAmount, 0);
  const pending = shorts
    .filter(short => short.status === STATUS.PENDING)
    .reduce((sum, short) => sum + short.shortAmount, 0);
  const overdue = shorts
    .filter(short => short.status === STATUS.OVERDUE)
    .reduce((sum, short) => sum + short.shortAmount, 0);
  
  return { total, pending, overdue };
};