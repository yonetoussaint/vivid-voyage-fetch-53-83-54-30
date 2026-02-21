import React, { useState } from 'react';
import { 
  Download, Share2, User, Package, Building, Loader, 
  Upload, Droplets, ChevronRight, History, Plus,
  Minus, X
} from 'lucide-react';

// Load html2canvas script
const loadHtml2Canvas = () => {
  return new Promise((resolve, reject) => {
    if (window.html2canvas) {
      resolve(window.html2canvas);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = () => resolve(window.html2canvas);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

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
  const [companyName, setCompanyName] = useState('Entreprise de Propane');
  const [companyAddress, setCompanyAddress] = useState('Saint-Marc, Haïti');
  const [companyPhone, setCompanyPhone] = useState('+509 1234 5678');
  const [companyEmail, setCompanyEmail] = useState('contact@propane.ht');
  const [companyNIF, setCompanyNIF] = useState('123-456-789-0');
  const [companyRCCM, setCompanyRCCM] = useState('SA-2024-001234');

  // Invoice history
  const [invoiceHistory, setInvoiceHistory] = useState([]);

  const totalAmount = quantity * pricePerUnit;
  const docNumber = docType === 'facture' 
    ? 'FAC-' + Date.now().toString().slice(-8)
    : 'PRO-' + Date.now().toString().slice(-8);
  
  const currentDate = new Date().toLocaleDateString('fr-FR');
  const currentTime = new Date().toLocaleTimeString('fr-FR');

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
    if (quantity <= 0) {
      alert('La quantité doit être supérieure à 0');
      return;
    }
    if (!customerName.trim()) {
      alert('Veuillez entrer le nom du client');
      return;
    }

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
      // Generate PNG image using html2canvas
      const imageBlob = await generateImageBlob({ 
        invoice: document,
        companyInfo: {
          name: companyName,
          address: companyAddress,
          phone: companyPhone,
          email: companyEmail,
          nif: companyNIF,
          rccm: companyRCCM,
          logo: logoImage
        }
      });

      if (action === 'download') {
        const link = document.createElement('a');
        link.download = `${docType}-${docNumber}.png`;
        link.href = URL.createObjectURL(imageBlob);
        link.click();
        URL.revokeObjectURL(link.href);
      } else {
        const file = new File([imageBlob], `${docType}-${docNumber}.png`, { type: 'image/png' });

        if (navigator.share) {
          await navigator.share({
            title: `${docType === 'facture' ? 'Facture' : 'Proforma'} ${docNumber}`,
            text: `${companyName} - ${customerName} - ${quantity} gallons - Total: ${totalAmount} HTG`,
            files: [file]
          });
        } else {
          alert('Le partage n\'est pas supporté sur ce navigateur. Utilisez le téléchargement à la place.');
        }
      }

      setInvoiceHistory(prev => [document, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Erreur:', error);
      alert(`Erreur lors de la génération: ${error.message}`);
    } finally {
      setIsDownloading(false);
      setIsSharing(false);
    }
  };

  // Fixed generateImageBlob function
  const generateImageBlob = async ({ invoice, companyInfo }) => {
    try {
      // Load html2canvas
      const html2canvas = await loadHtml2Canvas();

      const invoiceHTML = generateInvoiceHTML({ invoice, companyInfo });

      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '800px';
      iframe.style.height = '1100px';
      iframe.style.left = '-9999px';
      iframe.style.top = '0';
      iframe.style.border = 'none';
      iframe.style.background = 'white';

      document.body.appendChild(iframe);

      // Write content to iframe
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(invoiceHTML);
      iframeDoc.close();

      // Wait for images to load
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Capture canvas
      const canvas = await html2canvas(iframeDoc.body, { 
        scale: 1.5,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        useCORS: true,
        windowWidth: 800,
        windowHeight: 1100
      });

      // Clean up
      document.body.removeChild(iframe);

      // Convert to blob
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png', 1.0);
      });
    } catch (error) {
      console.error('Error in generateImageBlob:', error);
      throw error;
    }
  };

  // Original generateInvoiceHTML function
  const generateInvoiceHTML = ({ invoice, companyInfo }) => {
    const logoHTML = companyInfo.logo 
      ? `<img src="${companyInfo.logo}" alt="Logo" style="width: 80px; height: 80px; object-fit: contain; border-radius: 8px;" />`
      : `<div style="width: 80px; height: 80px; background: linear-gradient(135deg, #2563eb, #1e40af); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 32px; font-weight: bold;">P</span>
         </div>`;

    const documentTitle = invoice.type === 'facture' ? 'FACTURE' : 'PROFORMA';

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${documentTitle} ${invoice.number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: white;
      padding: 30px;
      line-height: 1.5;
    }
    .invoice {
      max-width: 700px;
      margin: 0 auto;
      background: white;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e5e7eb;
    }
    .company {
      display: flex;
      gap: 15px;
    }
    .company h1 {
      font-size: 24px;
      font-weight: bold;
      color: #111827;
      margin-bottom: 5px;
    }
    .company p {
      font-size: 13px;
      color: #6b7280;
      margin: 2px 0;
    }
    .title h2 {
      font-size: 36px;
      font-weight: 800;
      color: #2563eb;
      margin-bottom: 10px;
    }
    .badge {
      background: #eff6ff;
      padding: 15px 20px;
      border-radius: 8px;
      border: 1px solid #bfdbfe;
    }
    .badge p {
      font-size: 14px;
      color: #4b5563;
      margin: 5px 0;
    }
    .client {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .client h3 {
      font-size: 16px;
      color: #1f2937;
      margin-bottom: 10px;
    }
    .client .name {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th {
      background: #f3f4f6;
      padding: 12px;
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      text-align: left;
    }
    td {
      padding: 12px;
      font-size: 14px;
      color: #1f2937;
      border-bottom: 1px solid #e5e7eb;
    }
    td:last-child, th:last-child {
      text-align: right;
    }
    .totals {
      width: 400px;
      margin-left: auto;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 15px;
      border-bottom: 1px solid #e5e7eb;
    }
    .grand-total {
      background: #eff6ff;
      padding: 15px 20px;
      border-radius: 8px;
      border: 2px solid #2563eb;
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
    }
    .grand-total span {
      font-size: 20px;
      font-weight: 800;
      color: #1e40af;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 11px;
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="invoice">
    <!-- Header -->
    <div class="header">
      <div class="company">
        ${logoHTML}
        <div>
          <h1>${companyInfo.name}</h1>
          <p>📍 ${companyInfo.address}</p>
          <p>📞 ${companyInfo.phone}</p>
          <p>✉️ ${companyInfo.email}</p>
        </div>
      </div>
      <div class="title">
        <h2>${documentTitle}</h2>
        <div class="badge">
          <p><strong>N°:</strong> ${invoice.number}</p>
          <p><strong>Date:</strong> ${invoice.date}</p>
          <p><strong>Heure:</strong> ${invoice.time}</p>
        </div>
      </div>
    </div>

    <!-- Client -->
    <div class="client">
      <h3>CLIENT</h3>
      <p class="name">${invoice.customerName}</p>
      ${invoice.customerPhone ? `<p>📞 ${invoice.customerPhone}</p>` : ''}
      ${invoice.customerAddress ? `<p>📍 ${invoice.customerAddress}</p>` : ''}
    </div>

    <!-- Details -->
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Quantité</th>
          <th>Prix unitaire</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Propane domestique</td>
          <td>${invoice.quantity} gal</td>
          <td>${invoice.pricePerUnit.toLocaleString()} HTG</td>
          <td>${invoice.total.toLocaleString()} HTG</td>
        </tr>
      </tbody>
    </table>

    <!-- Totals -->
    <div class="totals">
      <div class="total-row">
        <span>Sous-total:</span>
        <span>${invoice.total.toLocaleString()} HTG</span>
      </div>
      <div class="total-row">
        <span>TVA (0%):</span>
        <span>0 HTG</span>
      </div>
      <div class="grand-total">
        <span>TOTAL À PAYER:</span>
        <span>${invoice.total.toLocaleString()} HTG</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>${companyInfo.name} - ${companyInfo.address} - ${companyInfo.phone}</p>
      <p>NIF: ${companyInfo.nif} | RCCM: ${companyInfo.rccm}</p>
      <p style="margin-top: 10px;">Merci pour votre confiance!</p>
    </div>
  </div>
</body>
</html>`;
  };

  const quickAmounts = [50, 100, 200, 300, 400, 500];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* History Panel */}
      {showHistory && invoiceHistory.length > 0 && (
        <div className="bg-white border-b border-gray-100 px-4 py-3 animate-slideDown">
          <p className="text-xs font-medium text-gray-500 mb-2">RÉCENT</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {invoiceHistory.map((inv, i) => (
              <div key={i} className="flex-none bg-gray-50 rounded-lg p-3 min-w-[160px]">
                <p className="text-xs font-medium text-gray-900">{inv.customerName}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {inv.quantity} gal • {inv.total.toLocaleString()} HTG
                </p>
                <p className="text-xs text-gray-400 mt-1">{inv.number}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 space-y-3 pb-24">
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
                className={`py-3 rounded-lg text-sm font-medium transition-colors ${
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

        {/* Company Info - Collapsible */}
        <details className="bg-white rounded-xl shadow-xs">
          <summary className="p-4 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <Building size={16} className="text-blue-500" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</span>
            </div>
            <ChevronRight size={16} className="text-gray-400 transition-transform duration-200" />
          </summary>
          
          <div className="px-4 pb-4 space-y-2 border-t border-gray-100 pt-3">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Nom entreprise"
              className="w-full p-3 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <input
              type="text"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              placeholder="Adresse"
              className="w-full p-3 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                placeholder="Téléphone"
                className="flex-1 p-3 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <input
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                placeholder="Email"
                className="flex-1 p-3 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={companyNIF}
                onChange={(e) => setCompanyNIF(e.target.value)}
                placeholder="NIF"
                className="flex-1 p-3 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <input
                type="text"
                value={companyRCCM}
                onChange={(e) => setCompanyRCCM(e.target.value)}
                placeholder="RCCM"
                className="flex-1 p-3 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            
            {/* Logo Upload */}
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg active:bg-gray-100 cursor-pointer">
                <Upload size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Logo</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
              </label>
              {logoPreview && (
                <div className="relative">
                  <img src={logoPreview} alt="Logo" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                  <button
                    onClick={() => {
                      setLogoImage(null);
                      setLogoPreview(null);
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 shadow-sm"
                  >
                    <X size={12} className="text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </details>
      </div>

      {/* Action Buttons - Fixed Bottom */}
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
        details[open] summary svg {
          transform: rotate(90deg);
        }
      `}</style>
    </div>
  );
};

export default ProForma;