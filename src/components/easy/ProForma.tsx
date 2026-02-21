import React, { useState, useCallback, useMemo } from 'react';
import {
  Download, Share2, User, Package, Building, Loader,
  Upload, Droplets, ChevronRight, History, Plus,
  Minus, X, FileText, CheckCircle
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const PRICE_PER_UNIT = 450;
const QUICK_AMOUNTS = [50, 100, 200, 300, 400, 500];
const MAX_HISTORY = 10;

const DEFAULT_COMPANY = {
  name: 'Entreprise de Propane',
  address: 'Saint-Marc, Haïti',
  phone: '+509 1234 5678',
  email: 'contact@propane.ht',
  nif: '123-456-789-0',
  rccm: 'SA-2024-001234',
};

// ─── Utilities ────────────────────────────────────────────────────────────────
const generateDocNumber = (type) =>
  (type === 'facture' ? 'FAC-' : 'PRO-') + Date.now().toString().slice(-8);

const formatDate = () => new Date().toLocaleDateString('fr-FR');
const formatTime = () => new Date().toLocaleTimeString('fr-FR');
const formatCurrency = (n) => n.toLocaleString('fr-FR') + ' HTG';

const loadHtml2Canvas = () =>
  new Promise((resolve, reject) => {
    if (window.html2canvas) return resolve(window.html2canvas);
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = () => resolve(window.html2canvas);
    script.onerror = () => reject(new Error('Impossible de charger html2canvas'));
    document.head.appendChild(script);
  });

// ─── Invoice HTML Generator ───────────────────────────────────────────────────
const buildInvoiceHTML = ({ invoice, company }) => {
  const logoHTML = company.logo
    ? `<img src="${company.logo}" alt="Logo" style="width:80px;height:80px;object-fit:contain;border-radius:8px;" />`
    : `<div style="width:80px;height:80px;background:linear-gradient(135deg,#2563eb,#1e40af);border-radius:8px;display:flex;align-items:center;justify-content:center;">
         <span style="color:white;font-size:32px;font-weight:bold;">P</span>
       </div>`;

  const title = invoice.type === 'facture' ? 'FACTURE' : 'PROFORMA';

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${title} ${invoice.number}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:white;padding:30px;line-height:1.5}
  .wrap{max-width:700px;margin:0 auto;background:white}
  .header{display:flex;justify-content:space-between;margin-bottom:30px;padding-bottom:20px;border-bottom:2px solid #e5e7eb}
  .company{display:flex;gap:15px}
  .company h1{font-size:24px;font-weight:bold;color:#111827;margin-bottom:5px}
  .company p{font-size:13px;color:#6b7280;margin:2px 0}
  .title h2{font-size:36px;font-weight:800;color:#2563eb;margin-bottom:10px}
  .badge{background:#eff6ff;padding:15px 20px;border-radius:8px;border:1px solid #bfdbfe}
  .badge p{font-size:14px;color:#4b5563;margin:5px 0}
  .client{background:#f9fafb;padding:20px;border-radius:8px;margin-bottom:30px}
  .client h3{font-size:16px;color:#1f2937;margin-bottom:10px}
  .client .name{font-size:18px;font-weight:600;color:#111827}
  table{width:100%;border-collapse:collapse;margin-bottom:30px}
  th{background:#f3f4f6;padding:12px;font-size:14px;font-weight:600;color:#374151;text-align:left}
  td{padding:12px;font-size:14px;color:#1f2937;border-bottom:1px solid #e5e7eb}
  td:last-child,th:last-child{text-align:right}
  .totals{width:400px;margin-left:auto}
  .row{display:flex;justify-content:space-between;padding:10px 15px;border-bottom:1px solid #e5e7eb}
  .grand{background:#eff6ff;padding:15px 20px;border-radius:8px;border:2px solid #2563eb;margin-top:15px;display:flex;justify-content:space-between}
  .grand span{font-size:20px;font-weight:800;color:#1e40af}
  .footer{margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb;text-align:center;font-size:11px;color:#9ca3af}
</style></head><body>
<div class="wrap">
  <div class="header">
    <div class="company">${logoHTML}
      <div>
        <h1>${company.name}</h1>
        <p>📍 ${company.address}</p>
        <p>📞 ${company.phone}</p>
        <p>✉️ ${company.email}</p>
      </div>
    </div>
    <div class="title">
      <h2>${title}</h2>
      <div class="badge">
        <p><strong>N°:</strong> ${invoice.number}</p>
        <p><strong>Date:</strong> ${invoice.date}</p>
        <p><strong>Heure:</strong> ${invoice.time}</p>
      </div>
    </div>
  </div>
  <div class="client">
    <h3>CLIENT</h3>
    <p class="name">${invoice.customerName}</p>
    ${invoice.customerPhone ? `<p>📞 ${invoice.customerPhone}</p>` : ''}
    ${invoice.customerAddress ? `<p>📍 ${invoice.customerAddress}</p>` : ''}
  </div>
  <table>
    <thead><tr><th>Description</th><th>Quantité</th><th>Prix unitaire</th><th>Total</th></tr></thead>
    <tbody>
      <tr>
        <td>Propane domestique</td>
        <td>${invoice.quantity} gal</td>
        <td>${invoice.pricePerUnit.toLocaleString()} HTG</td>
        <td>${invoice.total.toLocaleString()} HTG</td>
      </tr>
    </tbody>
  </table>
  <div class="totals">
    <div class="row"><span>Sous-total:</span><span>${invoice.total.toLocaleString()} HTG</span></div>
    <div class="row"><span>TVA (0%):</span><span>0 HTG</span></div>
    <div class="grand"><span>TOTAL À PAYER:</span><span>${invoice.total.toLocaleString()} HTG</span></div>
  </div>
  <div class="footer">
    <p>${company.name} — ${company.address} — ${company.phone}</p>
    <p>NIF: ${company.nif} | RCCM: ${company.rccm}</p>
    <p style="margin-top:10px">Merci pour votre confiance !</p>
  </div>
</div>
</body></html>`;
};

// ─── Image Generation ─────────────────────────────────────────────────────────
const generateImageBlob = async ({ invoice, company }) => {
  const html2canvas = await loadHtml2Canvas();
  const html = buildInvoiceHTML({ invoice, company });

  const iframe = document.createElement('iframe');
  Object.assign(iframe.style, {
    position: 'absolute', width: '800px', height: '1100px',
    left: '-9999px', top: '0', border: 'none', background: 'white',
  });
  document.body.appendChild(iframe);

  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();
    await new Promise(r => setTimeout(r, 1000));

    const canvas = await html2canvas(iframeDoc.body, {
      scale: 1.5, backgroundColor: '#ffffff', logging: false,
      allowTaint: true, useCORS: true, windowWidth: 800, windowHeight: 1100,
    });

    return new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
  } finally {
    document.body.removeChild(iframe);
  }
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const Field = ({ className = '', ...props }) => (
  <input
    className={`w-full p-3 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${className}`}
    {...props}
  />
);

const Toast = ({ message, type = 'success' }) => (
  <div className={`fixed top-4 left-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium
    ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
    {type === 'success' ? <CheckCircle size={16} /> : <X size={16} />}
    {message}
  </div>
);

const HistoryPanel = ({ history }) => {
  if (!history.length) return null;
  return (
    <div className="bg-white border-b border-gray-100 px-4 py-3">
      <p className="text-xs font-medium text-gray-500 mb-2">RÉCENT</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {history.map((inv, i) => (
          <div key={i} className="flex-none bg-gray-50 rounded-lg p-3 min-w-[160px]">
            <p className="text-xs font-medium text-gray-900 truncate">{inv.customerName}</p>
            <p className="text-xs text-gray-500 mt-1">
              {inv.quantity} gal • {formatCurrency(inv.total)}
            </p>
            <p className="text-xs text-gray-400 mt-1">{inv.number}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ProForma = () => {
  // Doc
  const [docType, setDocType] = useState('facture');

  // Customer
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Product
  const [quantity, setQuantity] = useState(100);

  // Company
  const [company, setCompany] = useState(DEFAULT_COMPANY);
  const [logo, setLogo] = useState(null);

  // UI state
  const [status, setStatus] = useState('idle'); // idle | downloading | sharing
  const [showHistory, setShowHistory] = useState(false);
  const [toast, setToast] = useState(null);
  const [history, setHistory] = useState([]);

  const totalAmount = useMemo(() => quantity * PRICE_PER_UNIT, [quantity]);
  const docNumber = useMemo(() => generateDocNumber(docType), [docType]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const updateCompany = useCallback((field) => (e) =>
    setCompany(prev => ({ ...prev, [field]: e.target.value })), []);

  const handleLogoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setLogo(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const adjustQuantity = useCallback((delta) =>
    setQuantity(prev => Math.max(1, prev + delta)), []);

  const validate = useCallback(() => {
    if (!customerName.trim()) return 'Veuillez entrer le nom du client';
    if (quantity <= 0) return 'La quantité doit être supérieure à 0';
    return null;
  }, [customerName, quantity]);

  const handleGenerate = useCallback(async (action) => {
    const error = validate();
    if (error) return showToast(error, 'error');

    setStatus(action === 'download' ? 'downloading' : 'sharing');

    const invoiceData = {
      number: docNumber,
      date: formatDate(),
      time: formatTime(),
      customerName,
      customerPhone,
      customerAddress,
      quantity,
      pricePerUnit: PRICE_PER_UNIT,
      total: totalAmount,
      type: docType,
    };

    try {
      const blob = await generateImageBlob({
        invoice: invoiceData,
        company: { ...company, logo },
      });

      const filename = `${docType}-${docNumber}.png`;

      if (action === 'download') {
        const link = document.createElement('a');
        link.download = filename;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
        showToast('Document téléchargé !');
      } else {
        const file = new File([blob], filename, { type: 'image/png' });
        if (navigator.share) {
          await navigator.share({
            title: `${docType === 'facture' ? 'Facture' : 'Proforma'} ${docNumber}`,
            text: `${company.name} — ${customerName} — ${quantity} gal — ${formatCurrency(totalAmount)}`,
            files: [file],
          });
          showToast('Document partagé !');
        } else {
          showToast('Partage non supporté, essayez le téléchargement.', 'error');
        }
      }

      setHistory(prev => [invoiceData, ...prev].slice(0, MAX_HISTORY));
    } catch (err) {
      console.error(err);
      showToast(`Erreur: ${err.message}`, 'error');
    } finally {
      setStatus('idle');
    }
  }, [validate, showToast, docNumber, customerName, customerPhone, customerAddress, quantity, totalAmount, docType, company, logo]);

  const isLoading = status !== 'idle';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && <Toast {...toast} />}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {logo ? (
              <img src={logo} alt="Logo" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
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
            onClick={() => setShowHistory(v => !v)}
            className="p-2 bg-gray-50 rounded-full active:bg-gray-100 transition-colors relative"
          >
            <History size={18} className="text-gray-600" />
            {history.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full text-white text-[10px] flex items-center justify-center">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {showHistory && <HistoryPanel history={history} />}

      {/* Content */}
      <div className="p-4 space-y-3 pb-28">

        {/* Doc Type */}
        <div className="bg-white rounded-xl p-1 flex shadow-sm">
          {['facture', 'proforma'].map(type => (
            <button
              key={type}
              onClick={() => setDocType(type)}
              className={`flex-1 py-3 rounded-lg text-sm font-medium capitalize transition-all ${
                docType === type ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-600 active:bg-gray-50'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Customer */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <User size={16} className="text-blue-500" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Client</span>
          </div>
          <Field
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            placeholder="Nom complet *"
            className="mb-2"
          />
          <div className="flex gap-2">
            <Field
              type="tel"
              value={customerPhone}
              onChange={e => setCustomerPhone(e.target.value)}
              placeholder="Téléphone"
            />
            <Field
              value={customerAddress}
              onChange={e => setCustomerAddress(e.target.value)}
              placeholder="Adresse"
            />
          </div>
        </div>

        {/* Quantity */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} className="text-blue-500" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Propane</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Quantité (gallons)</span>
            <span className="text-2xl font-bold text-gray-900">{quantity}</span>
          </div>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => adjustQuantity(-10)}
              className="flex-1 py-3 bg-gray-50 rounded-lg active:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Minus size={18} className="text-gray-600" />
            </button>
            <button
              onClick={() => adjustQuantity(10)}
              className="flex-1 py-3 bg-gray-50 rounded-lg active:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Plus size={18} className="text-gray-600" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_AMOUNTS.map(amount => (
              <button
                key={amount}
                onClick={() => setQuantity(amount)}
                className={`py-3 rounded-lg text-sm font-medium transition-colors ${
                  quantity === amount ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-600 active:bg-gray-100'
                }`}
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Prix unitaire</p>
              <p className="text-sm font-medium text-gray-900">{PRICE_PER_UNIT} HTG/gal</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>

        {/* Company */}
        <details className="bg-white rounded-xl shadow-sm group">
          <summary className="p-4 flex items-center justify-between cursor-pointer list-none">
            <div className="flex items-center gap-2">
              <Building size={16} className="text-blue-500" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</span>
            </div>
            <ChevronRight size={16} className="text-gray-400 transition-transform duration-200 group-open:rotate-90" />
          </summary>
          <div className="px-4 pb-4 space-y-2 border-t border-gray-100 pt-3">
            {[
              { field: 'name', placeholder: "Nom de l'entreprise" },
              { field: 'address', placeholder: 'Adresse' },
            ].map(({ field, placeholder }) => (
              <Field key={field} value={company[field]} onChange={updateCompany(field)} placeholder={placeholder} />
            ))}
            <div className="flex gap-2">
              <Field value={company.phone} onChange={updateCompany('phone')} placeholder="Téléphone" type="tel" />
              <Field value={company.email} onChange={updateCompany('email')} placeholder="Email" type="email" />
            </div>
            <div className="flex gap-2">
              <Field value={company.nif} onChange={updateCompany('nif')} placeholder="NIF" />
              <Field value={company.rccm} onChange={updateCompany('rccm')} placeholder="RCCM" />
            </div>
            {/* Logo Upload */}
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer active:bg-gray-100 border border-dashed border-gray-200 hover:border-blue-300 transition-colors">
                <Upload size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Importer un logo</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
              </label>
              {logo && (
                <div className="relative">
                  <img src={logo} alt="Logo" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                  <button
                    onClick={() => setLogo(null)}
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

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <div className="flex gap-3 max-w-md mx-auto">
          <button
            onClick={() => handleGenerate('share')}
            disabled={isLoading}
            className="flex-1 py-4 bg-gray-100 rounded-xl font-medium text-gray-700 active:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {status === 'sharing' ? <Loader size={18} className="animate-spin" /> : <Share2 size={18} />}
            <span>Partager</span>
          </button>
          <button
            onClick={() => handleGenerate('download')}
            disabled={isLoading}
            className="flex-1 py-4 bg-blue-500 rounded-xl font-medium text-white active:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            {status === 'downloading' ? <Loader size={18} className="animate-spin" /> : <Download size={18} />}
            <span>Générer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProForma;
