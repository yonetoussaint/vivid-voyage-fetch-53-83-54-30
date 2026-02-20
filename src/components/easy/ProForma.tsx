import React, { useState } from 'react';
import { 
  Download, Share2, User, Package, Building, Loader, 
  Image as ImageIcon, Upload, Phone, Mail, MapPin, 
  Droplets, FileText, ChevronRight, History, Plus,
  Minus, X, Check, Settings, CreditCard, Clock
} from 'lucide-react';

const ProForma = () => {
  const [docType, setDocType] = useState('facture');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [pricePerUnit] = useState(450);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Logo state
  const [logoImage, setLogoImage] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Company info
  const [companyName, setCompanyName] = useState('Propane Express');
  const [companyAddress, setCompanyAddress] = useState('Saint-Marc');
  const [companyPhone, setCompanyPhone] = useState('+509 1234 5678');
  const [companyEmail, setCompanyEmail] = useState('contact@propane.ht');
  const [companyNIF, setCompanyNIF] = useState('123-456-789');
  const [companyRCCM, setCompanyRCCM] = useState('SA-2024-001');

  // Invoice history
  const [invoiceHistory, setInvoiceHistory] = useState([]);

  const totalAmount = quantity * pricePerUnit;
  const docNumber = docType === 'facture' 
    ? 'FAC-' + Date.now().toString().slice(-6)
    : 'PRO-' + Date.now().toString().slice(-6);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result);
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (action) => {
    if (quantity <= 0) return alert('Quantité invalide');
    if (!customerName.trim()) return alert('Nom client requis');

    action === 'download' ? setIsDownloading(true) : setIsSharing(true);

    const document = {
      number: docNumber,
      date: currentDate,
      time: currentTime,
      customerName,
      customerPhone,
      customerAddress,
      quantity,
      pricePerUnit,
      total: totalAmount,
      type: docType
    };

    try {
      // Simulate generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInvoiceHistory(prev => [document, ...prev].slice(0, 5));
      
      if (action === 'download') {
        alert('Document généré avec succès!');
      } else {
        alert('Partage simulé - ' + docNumber);
      }
    } catch (error) {
      alert('Erreur');
    } finally {
      setIsDownloading(false);
      setIsSharing(false);
    }
  };

  const quickAmounts = [50, 100, 200, 300, 400, 500];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Ultra clean */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
            ) : (
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Droplets size={16} className="text-white" />
              </div>
            )}
            <div>
              <h1 className="text-sm font-semibold text-gray-900">Propane Facture</h1>
              <p className="text-xs text-gray-500">{docNumber}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 bg-gray-50 rounded-full active:bg-gray-100 transition-colors"
          >
            <History size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* History Panel - Slide down */}
      {showHistory && invoiceHistory.length > 0 && (
        <div className="bg-white border-b border-gray-100 px-4 py-3 animate-slideDown">
          <p className="text-xs font-medium text-gray-500 mb-2">RÉCENT</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {invoiceHistory.map((inv, i) => (
              <div key={i} className="flex-none bg-gray-50 rounded-lg p-2 min-w-[140px]">
                <p className="text-xs font-medium text-gray-900">{inv.customerName}</p>
                <p className="text-xs text-gray-500">{inv.quantity} gal • {inv.total}k HTG</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 space-y-3 pb-20">
        {/* Document Type Selector */}
        <div className="bg-white rounded-xl p-1 flex shadow-xs">
          <button
            onClick={() => setDocType('facture')}
            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
              docType === 'facture' 
                ? 'bg-blue-500 text-white shadow-sm' 
                : 'text-gray-600 active:bg-gray-50'
            }`}
          >
            Facture
          </button>
          <button
            onClick={() => setDocType('proforma')}
            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
              docType === 'proforma' 
                ? 'bg-blue-500 text-white shadow-sm' 
                : 'text-gray-600 active:bg-gray-50'
            }`}
          >
            Proforma
          </button>
        </div>

        {/* Customer Card */}
        <div className="bg-white rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <User size={16} className="text-blue-500" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Client</span>
          </div>
          
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nom complet *"
            className="w-full p-3 bg-gray-50 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          
          <div className="flex gap-2">
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Téléphone"
              className="flex-1 p-3 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="Adresse"
              className="flex-1 p-3 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Quantity Card */}
        <div className="bg-white rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} className="text-blue-500" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Propane</span>
          </div>

          {/* Quantity Display */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Quantité (gallons)</span>
            <span className="text-2xl font-bold text-gray-900">{quantity}</span>
          </div>

          {/* Quantity Controls */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 10))}
              className="flex-1 py-3 bg-gray-50 rounded-lg active:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Minus size={18} className="text-gray-600" />
            </button>
            <button
              onClick={() => setQuantity(quantity + 10)}
              className="flex-1 py-3 bg-gray-50 rounded-lg active:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Plus size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Quick Amounts */}
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map(amount => (
              <button
                key={amount}
                onClick={() => setQuantity(amount)}
                className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                  quantity === amount
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-50 text-gray-600 active:bg-gray-100'
                }`}
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        {/* Total Card */}
        <div className="bg-white rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Prix unitaire</p>
              <p className="text-sm font-medium text-gray-900">{pricePerUnit} HTG/gal</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-xl font-bold text-blue-600">{totalAmount.toLocaleString()} HTG</p>
            </div>
          </div>
        </div>

        {/* Action Buttons - Large thumb-friendly */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
          <div className="flex gap-3 max-w-md mx-auto">
            <button
              onClick={() => handleGenerate('share')}
              disabled={isSharing || isDownloading}
              className="flex-1 py-4 bg-gray-100 rounded-xl font-medium text-gray-700 active:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSharing ? <Loader size={18} className="animate-spin" /> : <Share2 size={18} />}
              <span>Partager</span>
            </button>
            
            <button
              onClick={() => handleGenerate('download')}
              disabled={isDownloading || isSharing}
              className="flex-1 py-4 bg-blue-500 rounded-xl font-medium text-white active:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {isDownloading ? <Loader size={18} className="animate-spin" /> : <Download size={18} />}
              <span>Générer</span>
            </button>
          </div>
        </div>

        {/* Company Info - Collapsible */}
        <details className="bg-white rounded-xl shadow-xs">
          <summary className="p-4 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <Building size={16} className="text-blue-500" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</span>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </summary>
          
          <div className="px-4 pb-4 space-y-2 border-t border-gray-100 pt-3">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Nom entreprise"
              className="w-full p-3 bg-gray-50 rounded-lg text-sm"
            />
            <input
              type="text"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              placeholder="Adresse"
              className="w-full p-3 bg-gray-50 rounded-lg text-sm"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                placeholder="Téléphone"
                className="flex-1 p-3 bg-gray-50 rounded-lg text-sm"
              />
              <input
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                placeholder="Email"
                className="flex-1 p-3 bg-gray-50 rounded-lg text-sm"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={companyNIF}
                onChange={(e) => setCompanyNIF(e.target.value)}
                placeholder="NIF"
                className="flex-1 p-3 bg-gray-50 rounded-lg text-sm"
              />
              <input
                type="text"
                value={companyRCCM}
                onChange={(e) => setCompanyRCCM(e.target.value)}
                placeholder="RCCM"
                className="flex-1 p-3 bg-gray-50 rounded-lg text-sm"
              />
            </div>
            
            {/* Logo Upload */}
            <label className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg active:bg-gray-100 cursor-pointer">
              <Upload size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">Logo entreprise</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
            </label>
            {logoPreview && (
              <div className="relative inline-block">
                <img src={logoPreview} alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
                <button
                  onClick={() => {
                    setLogoImage(null);
                    setLogoPreview(null);
                  }}
                  className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5"
                >
                  <X size={12} className="text-white" />
                </button>
              </div>
            )}
          </div>
        </details>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProForma;