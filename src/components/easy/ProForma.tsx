import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  Download, Share2, User, Package, Building, Loader,
  Upload, Droplets, ChevronRight, History, Plus, Minus, X,
  FileText, CheckCircle, AlertCircle, Clock, DollarSign,
  Trash2, Edit3, Save, Eye, EyeOff, Settings, Tag,
  CreditCard, Calendar, MessageSquare, Stamp, Palette,
  RefreshCw, Copy, Search, ChevronDown, ChevronUp,
  Lock, Unlock, BarChart2, Globe, Phone, Mail, MapPin,
  Hash, Percent, Landmark, Star, Zap, Users, Archive
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const CURRENCIES = {
  HTG: { symbol: 'HTG', name: 'Gourde haïtienne', rate: 1 },
  USD: { symbol: 'USD', name: 'Dollar américain', rate: 0.0074 },
  EUR: { symbol: 'EUR', name: 'Euro', rate: 0.0068 },
};

const TAX_PRESETS = [
  { label: 'Aucune TVA', rate: 0 },
  { label: 'TVA 10%', rate: 10 },
  { label: 'TVA 15%', rate: 15 },
  { label: 'TVA 20%', rate: 20 },
];

const PAYMENT_METHODS = ['Espèces', 'Chèque', 'Virement', 'MonCash', 'Natcash', 'Carte bancaire'];

const PAYMENT_TERMS = [
  { label: 'Immédiat', days: 0 },
  { label: 'Net 7 jours', days: 7 },
  { label: 'Net 15 jours', days: 15 },
  { label: 'Net 30 jours', days: 30 },
  { label: 'Net 60 jours', days: 60 },
];

const STATUSES = {
  draft:    { label: 'Brouillon',  color: '#6b7280', bg: '#f3f4f6' },
  sent:     { label: 'Envoyé',     color: '#2563eb', bg: '#eff6ff' },
  paid:     { label: 'Payé',       color: '#16a34a', bg: '#f0fdf4' },
  overdue:  { label: 'En retard',  color: '#dc2626', bg: '#fef2f2' },
  cancelled:{ label: 'Annulé',    color: '#9ca3af', bg: '#f9fafb' },
};

const INVOICE_COLORS = [
  { name: 'Bleu',    primary: '#2563eb', secondary: '#1e40af', accent: '#eff6ff', border: '#bfdbfe' },
  { name: 'Vert',    primary: '#16a34a', secondary: '#15803d', accent: '#f0fdf4', border: '#bbf7d0' },
  { name: 'Rouge',   primary: '#dc2626', secondary: '#b91c1c', accent: '#fef2f2', border: '#fecaca' },
  { name: 'Violet',  primary: '#7c3aed', secondary: '#6d28d9', accent: '#f5f3ff', border: '#ddd6fe' },
  { name: 'Orange',  primary: '#ea580c', secondary: '#c2410c', accent: '#fff7ed', border: '#fed7aa' },
  { name: 'Ardoise', primary: '#475569', secondary: '#334155', accent: '#f8fafc', border: '#cbd5e1' },
];

const PRODUCT_CATALOG = [
  { name: 'Propane domestique', unit: 'gal', price: 450, taxRate: 0 },
  { name: 'Propane industriel', unit: 'gal', price: 520, taxRate: 0 },
  { name: 'Cylindre 20 lbs',    unit: 'pcs', price: 2800, taxRate: 0 },
  { name: 'Cylindre 40 lbs',    unit: 'pcs', price: 5200, taxRate: 0 },
  { name: 'Livraison',          unit: 'forfait', price: 500, taxRate: 0 },
  { name: 'Installation',       unit: 'h',   price: 1500, taxRate: 0 },
];

const DEFAULT_COMPANY = {
  name: 'Entreprise de Propane',
  address: 'Saint-Marc, Haïti',
  phone: '+509 1234 5678',
  email: 'contact@propane.ht',
  nif: '123-456-789-0',
  rccm: 'SA-2024-001234',
  bank: 'BNC Haiti',
  iban: 'HT00 0000 0000 0000 0000 0000',
  swift: 'BNCHHTHH',
  website: 'www.propane.ht',
};

const DEFAULT_LINE = () => ({
  id: Date.now() + Math.random(),
  description: 'Propane domestique',
  unit: 'gal',
  quantity: 100,
  unitPrice: 450,
  taxRate: 0,
  discount: 0,
  discountType: 'percent',
  note: '',
});

const generateDocNumber = (type, seq) =>
  (type === 'facture' ? 'FAC' : type === 'proforma' ? 'PRO' : 'DEV') +
  '-' + new Date().getFullYear() +
  '-' + String(seq).padStart(4, '0');

const formatDate = (d = new Date()) => d.toLocaleDateString('fr-FR');

const dueDateFromTerms = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return formatDate(d);
};

// ─── Utilities ────────────────────────────────────────────────────────────────
const fmt = (n, symbol = 'HTG') =>
  n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + symbol;

const lineSubtotal = (line) => {
  const gross = line.quantity * line.unitPrice;
  const disc = line.discountType === 'percent'
    ? gross * (line.discount / 100)
    : line.discount;
  return gross - disc;
};

const lineTax   = (line) => lineSubtotal(line) * (line.taxRate / 100);
const lineTotal = (line) => lineSubtotal(line) + lineTax(line);

const loadHtml2Canvas = () =>
  new Promise((resolve, reject) => {
    if (window.html2canvas) return resolve(window.html2canvas);
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = () => resolve(window.html2canvas);
    script.onerror = () => reject(new Error('Impossible de charger html2canvas'));
    document.head.appendChild(script);
  });

// ─── Invoice HTML Builder ─────────────────────────────────────────────────────
const buildInvoiceHTML = ({ invoice, company, logo, theme, options }) => {
  const { primary, secondary, accent, border } = theme;
  const docTitle = invoice.type === 'facture' ? 'FACTURE' : invoice.type === 'proforma' ? 'PROFORMA' : 'DEVIS';
  const currSym = CURRENCIES[invoice.currency]?.symbol || 'HTG';

  const logoHTML = logo
    ? `<img src="${logo}" alt="Logo" style="width:90px;height:90px;object-fit:contain;border-radius:10px;" />`
    : `<div style="width:90px;height:90px;background:linear-gradient(135deg,${primary},${secondary});border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:900;color:white;">P</div>`;

  const watermarkHTML = options.watermark && options.watermark !== 'none'
    ? `<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-35deg);font-size:90px;font-weight:900;color:${primary};opacity:0.06;letter-spacing:10px;pointer-events:none;z-index:0;white-space:nowrap;">${options.watermark.toUpperCase()}</div>`
    : '';

  const statusBadge = STATUSES[invoice.status] || STATUSES.draft;

  const linesHTML = invoice.lines.map((line, i) => {
    const sub = lineSubtotal(line);
    const tax = lineTax(line);
    const tot = lineTotal(line);
    const discStr = line.discount > 0
      ? (line.discountType === 'percent' ? `-${line.discount}%` : `-${fmt(line.discount, currSym)}`)
      : '—';
    return `
    <tr style="background:${i % 2 === 0 ? '#fff' : '#fafafa'}">
      <td style="padding:12px 14px;border-bottom:1px solid #f0f0f0;">
        <div style="font-weight:600;color:#111;">${line.description}</div>
        ${line.note ? `<div style="font-size:11px;color:#9ca3af;margin-top:2px;">${line.note}</div>` : ''}
      </td>
      <td style="padding:12px 14px;border-bottom:1px solid #f0f0f0;text-align:center;color:#555;">${line.quantity} ${line.unit}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #f0f0f0;text-align:right;color:#555;">${fmt(line.unitPrice, currSym)}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #f0f0f0;text-align:center;color:#ef4444;">${discStr}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #f0f0f0;text-align:center;color:#555;">${line.taxRate}%</td>
      <td style="padding:12px 14px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;color:#111;">${fmt(tot, currSym)}</td>
    </tr>`;
  }).join('');

  const subtotal     = invoice.lines.reduce((s, l) => s + lineSubtotal(l), 0);
  const totalTax     = invoice.lines.reduce((s, l) => s + lineTax(l), 0);
  const globalDiscAmt = invoice.globalDiscountType === 'percent'
    ? subtotal * (invoice.globalDiscount / 100)
    : invoice.globalDiscount;
  const grandTotal   = subtotal + totalTax - globalDiscAmt;
  const amountDue    = grandTotal - (invoice.amountPaid || 0);

  const bankHTML = options.showBank && company.bank ? `
    <div style="margin-top:30px;background:#fafafa;border:1px solid #e5e7eb;border-radius:10px;padding:18px;">
      <div style="font-size:12px;font-weight:700;color:#6b7280;margin-bottom:10px;letter-spacing:1px;">COORDONNÉES BANCAIRES</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:13px;">
        <div><span style="color:#9ca3af;">Banque:</span> <strong>${company.bank}</strong></div>
        <div><span style="color:#9ca3af;">SWIFT:</span> <strong>${company.swift || '—'}</strong></div>
        <div style="grid-column:span 2"><span style="color:#9ca3af;">IBAN:</span> <strong style="letter-spacing:2px;">${company.iban || '—'}</strong></div>
      </div>
    </div>` : '';

  const sigHTML = options.showSignature ? `
    <div style="display:flex;gap:40px;margin-top:40px;">
      <div style="flex:1;text-align:center;">
        <div style="height:60px;border-bottom:2px solid #e5e7eb;margin-bottom:8px;"></div>
        <div style="font-size:11px;color:#9ca3af;">Signature autorisée</div>
      </div>
      <div style="flex:1;text-align:center;">
        <div style="height:60px;border-bottom:2px solid #e5e7eb;margin-bottom:8px;"></div>
        <div style="font-size:11px;color:#9ca3af;">Cachet & signature client</div>
      </div>
    </div>` : '';

  const notesHTML = invoice.notes ? `
    <div style="margin-top:20px;background:${accent};border-left:4px solid ${primary};padding:14px 16px;border-radius:0 8px 8px 0;">
      <div style="font-size:11px;font-weight:700;color:${primary};margin-bottom:5px;letter-spacing:1px;">NOTES</div>
      <div style="font-size:13px;color:#4b5563;white-space:pre-line;">${invoice.notes}</div>
    </div>` : '';

  const termsHTML = invoice.terms ? `
    <div style="margin-top:14px;padding:14px 16px;background:#f9fafb;border-radius:8px;border:1px solid #f0f0f0;">
      <div style="font-size:11px;font-weight:700;color:#9ca3af;margin-bottom:5px;letter-spacing:1px;">CONDITIONS GÉNÉRALES</div>
      <div style="font-size:12px;color:#6b7280;white-space:pre-line;">${invoice.terms}</div>
    </div>` : '';

  const paymentMethodsHTML = invoice.paymentMethods?.length ? `
    <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;">
      ${invoice.paymentMethods.map(m => `<span style="background:${accent};border:1px solid ${border};color:${primary};font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;">${m}</span>`).join('')}
    </div>` : '';

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<title>${docTitle} ${invoice.number}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; background:#fff; color:#111; line-height:1.5; }
</style>
</head><body>
<div style="width:100%;padding:28px 28px;background:#fff;position:relative;min-height:1050px;">
  ${watermarkHTML}
  <div style="position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,${primary},${secondary});"></div>

  <!-- HEADER -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px;margin-top:14px;">
    <div style="display:flex;gap:16px;align-items:center;">
      ${logoHTML}
      <div>
        <h1 style="font-size:22px;font-weight:800;color:#111;margin-bottom:4px;">${company.name}</h1>
        ${company.address ? `<div style="font-size:12px;color:#6b7280;margin:1px 0;">📍 ${company.address}</div>` : ''}
        ${company.phone   ? `<div style="font-size:12px;color:#6b7280;margin:1px 0;">📞 ${company.phone}</div>` : ''}
        ${company.email   ? `<div style="font-size:12px;color:#6b7280;margin:1px 0;">✉️ ${company.email}</div>` : ''}
        ${company.website ? `<div style="font-size:12px;color:#6b7280;margin:1px 0;">🌐 ${company.website}</div>` : ''}
        <div style="margin-top:6px;font-size:11px;color:#9ca3af;">
          ${company.nif  ? `NIF: ${company.nif}` : ''}
          ${company.rccm ? ` | RCCM: ${company.rccm}` : ''}
        </div>
      </div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:42px;font-weight:900;color:${primary};letter-spacing:-1px;">${docTitle}</div>
      <div style="background:${accent};border:1px solid ${border};border-radius:10px;padding:14px 18px;margin-top:10px;min-width:200px;">
        <div style="display:flex;justify-content:space-between;gap:20px;margin-bottom:6px;">
          <span style="font-size:12px;color:#9ca3af;">Numéro</span>
          <span style="font-size:13px;font-weight:700;color:#111;">${invoice.number}</span>
        </div>
        <div style="display:flex;justify-content:space-between;gap:20px;margin-bottom:6px;">
          <span style="font-size:12px;color:#9ca3af;">Date</span>
          <span style="font-size:13px;color:#111;">${invoice.date}</span>
        </div>
        ${invoice.dueDate ? `<div style="display:flex;justify-content:space-between;gap:20px;margin-bottom:6px;">
          <span style="font-size:12px;color:#9ca3af;">Échéance</span>
          <span style="font-size:13px;font-weight:600;color:${invoice.status === 'overdue' ? '#dc2626' : '#111'};">${invoice.dueDate}</span>
        </div>` : ''}
        <div style="display:flex;justify-content:space-between;gap:20px;">
          <span style="font-size:12px;color:#9ca3af;">Statut</span>
          <span style="font-size:12px;font-weight:700;background:${statusBadge.bg};color:${statusBadge.color};padding:2px 8px;border-radius:20px;">${statusBadge.label}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- CLIENT + DELIVERY -->
  <div style="display:grid;grid-template-columns:1fr ${invoice.deliveryAddress ? '1fr' : ''};gap:16px;margin-bottom:30px;">
    <div style="background:#f9fafb;border-radius:10px;padding:18px;border:1px solid #f0f0f0;">
      <div style="font-size:11px;font-weight:700;color:#9ca3af;letter-spacing:1px;margin-bottom:10px;">FACTURÉ À</div>
      <div style="font-size:18px;font-weight:700;color:#111;margin-bottom:6px;">${invoice.customerName}</div>
      ${invoice.customerCompany ? `<div style="font-size:13px;color:#555;margin-bottom:2px;">🏢 ${invoice.customerCompany}</div>` : ''}
      ${invoice.customerPhone   ? `<div style="font-size:13px;color:#555;margin-bottom:2px;">📞 ${invoice.customerPhone}</div>` : ''}
      ${invoice.customerEmail   ? `<div style="font-size:13px;color:#555;margin-bottom:2px;">✉️ ${invoice.customerEmail}</div>` : ''}
      ${invoice.customerAddress ? `<div style="font-size:13px;color:#555;margin-bottom:2px;">📍 ${invoice.customerAddress}</div>` : ''}
      ${invoice.customerNIF     ? `<div style="font-size:11px;color:#9ca3af;margin-top:6px;">NIF Client: ${invoice.customerNIF}</div>` : ''}
    </div>
    ${invoice.deliveryAddress ? `
    <div style="background:#f9fafb;border-radius:10px;padding:18px;border:1px solid #f0f0f0;">
      <div style="font-size:11px;font-weight:700;color:#9ca3af;letter-spacing:1px;margin-bottom:10px;">LIVRAISON À</div>
      <div style="font-size:14px;color:#374151;white-space:pre-line;">${invoice.deliveryAddress}</div>
    </div>` : ''}
  </div>

  <!-- LINE ITEMS -->
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;border-radius:10px;overflow:hidden;border:1px solid #f0f0f0;">
    <thead>
      <tr style="background:${primary};">
        <th style="padding:12px 14px;text-align:left;font-size:12px;font-weight:700;color:white;letter-spacing:0.5px;">DESCRIPTION</th>
        <th style="padding:12px 14px;text-align:center;font-size:12px;font-weight:700;color:white;">QTÉ</th>
        <th style="padding:12px 14px;text-align:right;font-size:12px;font-weight:700;color:white;">PRIX UNIT.</th>
        <th style="padding:12px 14px;text-align:center;font-size:12px;font-weight:700;color:white;">REMISE</th>
        <th style="padding:12px 14px;text-align:center;font-size:12px;font-weight:700;color:white;">TVA</th>
        <th style="padding:12px 14px;text-align:right;font-size:12px;font-weight:700;color:white;">TOTAL</th>
      </tr>
    </thead>
    <tbody>${linesHTML}</tbody>
  </table>

  <!-- TOTALS -->
  <div style="display:flex;justify-content:flex-end;margin-bottom:24px;">
    <div style="min-width:320px;">
      <div style="display:flex;justify-content:space-between;padding:8px 14px;font-size:13px;color:#555;">
        <span>Sous-total HT</span><span style="font-weight:600;">${fmt(subtotal, currSym)}</span>
      </div>
      ${totalTax > 0 ? `<div style="display:flex;justify-content:space-between;padding:8px 14px;font-size:13px;color:#555;">
        <span>Total TVA</span><span style="font-weight:600;color:#f59e0b;">${fmt(totalTax, currSym)}</span>
      </div>` : ''}
      ${globalDiscAmt > 0 ? `<div style="display:flex;justify-content:space-between;padding:8px 14px;font-size:13px;color:#ef4444;">
        <span>Remise globale ${invoice.globalDiscountType === 'percent' ? `(${invoice.globalDiscount}%)` : ''}</span>
        <span style="font-weight:600;">-${fmt(globalDiscAmt, currSym)}</span>
      </div>` : ''}
      <div style="background:${primary};border-radius:10px;padding:16px 18px;margin-top:10px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:15px;font-weight:700;color:white;">TOTAL TTC</span>
        <span style="font-size:22px;font-weight:900;color:white;">${fmt(grandTotal, currSym)}</span>
      </div>
      ${(invoice.amountPaid || 0) > 0 ? `
      <div style="display:flex;justify-content:space-between;padding:8px 14px;font-size:13px;color:#16a34a;margin-top:4px;">
        <span>Acompte reçu</span><span style="font-weight:600;">-${fmt(invoice.amountPaid, currSym)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:10px 14px;font-size:15px;font-weight:800;color:#111;border-top:2px solid #e5e7eb;margin-top:4px;">
        <span>RESTE À PAYER</span><span style="color:${amountDue <= 0 ? '#16a34a' : '#dc2626'};">${fmt(Math.max(0, amountDue), currSym)}</span>
      </div>` : ''}
    </div>
  </div>

  ${paymentMethodsHTML}
  ${notesHTML}
  ${termsHTML}
  ${bankHTML}
  ${sigHTML}

  <!-- FOOTER -->
  <div style="margin-top:40px;padding-top:20px;border-top:2px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;">
    <div style="font-size:11px;color:#9ca3af;">
      <div>${company.name} — ${company.address}</div>
      <div style="margin-top:2px;">NIF: ${company.nif} | RCCM: ${company.rccm}</div>
    </div>
    <div style="font-size:11px;color:#9ca3af;text-align:right;">
      <div style="font-weight:700;color:${primary};">Merci pour votre confiance !</div>
      <div style="margin-top:2px;">Document généré le ${formatDate()}</div>
    </div>
  </div>
  <div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${secondary},${primary});"></div>
</div>
</body></html>`;
};

// ─── Image Generation ─────────────────────────────────────────────────────────
const generateImageBlob = async ({ invoice, company, logo, theme, options }) => {
  const html2canvas = await loadHtml2Canvas();
  const html = buildInvoiceHTML({ invoice, company, logo, theme, options });
  const iframe = document.createElement('iframe');
  Object.assign(iframe.style, {
    position: 'absolute', width: '800px', height: '1200px',
    left: '-9999px', top: '0', border: 'none', background: 'white',
  });
  document.body.appendChild(iframe);
  try {
    const iDoc = iframe.contentDocument || iframe.contentWindow.document;
    iDoc.open(); iDoc.write(html); iDoc.close();
    await new Promise(r => setTimeout(r, 1200));
    const canvas = await html2canvas(iDoc.body, {
      scale: 1.5, backgroundColor: '#fff', logging: false,
      allowTaint: true, useCORS: true, windowWidth: 800, windowHeight: 1200,
    });
    return new Promise(r => canvas.toBlob(r, 'image/png', 1.0));
  } finally {
    document.body.removeChild(iframe);
  }
};

// ─── Reusable UI ──────────────────────────────────────────────────────────────
const Field = ({ label, className = '', required, children }) => (
  <div className={className}>
    {label && (
      <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
    )}
    {children}
  </div>
);

const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300 transition-all ${className}`}
    {...props}
  />
);

const Sel = ({ className = '', children, ...props }) => (
  <select
    className={`w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300 transition-all ${className}`}
    {...props}
  >
    {children}
  </select>
);

const Textarea = ({ className = '', ...props }) => (
  <textarea
    rows={3}
    className={`w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/30 resize-none transition-all ${className}`}
    {...props}
  />
);

const Toggle = ({ value, onChange, label }) => (
  <label className="flex items-center gap-2.5 cursor-pointer select-none">
    <div onClick={() => onChange(!value)}
      className={`relative w-9 h-5 rounded-full transition-colors ${value ? 'bg-blue-500' : 'bg-gray-200'}`}>
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-4' : ''}`} />
    </div>
    {label && <span className="text-xs text-gray-600">{label}</span>}
  </label>
);

const Toast = ({ message, type = 'success', onDismiss }) => (
  <div onClick={onDismiss}
    className={`fixed top-4 left-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium cursor-pointer animate-bounce-in
      ${type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
    {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
    <span className="flex-1">{message}</span>
    <X size={14} className="opacity-70" />
  </div>
);

// ─── Line Item Row ────────────────────────────────────────────────────────────
const LineItemRow = ({ line, onChange, onDelete, onDuplicate, currency, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const sym = CURRENCIES[currency]?.symbol || 'HTG';
  const total = lineTotal(line);

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <div className="p-3">
        <div className="flex items-start gap-2 mb-2">
          <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            {index + 1}
          </span>
          <div className="flex-1 relative">
            <Input
              value={line.description}
              onChange={e => onChange('description', e.target.value)}
              placeholder="Description *"
              className="pr-8"
            />
            <button
              onClick={() => setShowCatalog(v => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-400"
              title="Catalogue produits"
            >
              <Search size={13} />
            </button>
          </div>
          <button onClick={onDuplicate} className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-500 transition-colors" title="Dupliquer">
            <Copy size={13} />
          </button>
          <button onClick={onDelete} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Supprimer">
            <Trash2 size={13} />
          </button>
        </div>

        {showCatalog && (
          <div className="mb-2 bg-blue-50 rounded-xl p-2">
            <p className="text-[10px] font-bold text-blue-400 uppercase mb-1.5 px-1">Catalogue produits</p>
            <div className="grid grid-cols-2 gap-1">
              {PRODUCT_CATALOG.map((p, i) => (
                <button key={i}
                  onClick={() => {
                    onChange('description', p.name);
                    onChange('unit', p.unit);
                    onChange('unitPrice', p.price);
                    onChange('taxRate', p.taxRate);
                    setShowCatalog(false);
                  }}
                  className="text-left px-2 py-1.5 bg-white hover:bg-blue-100 rounded-lg text-xs text-gray-700 transition-colors">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-gray-400">{p.price.toLocaleString()} {sym}/{p.unit}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: 'Qté', field: 'quantity', type: 'number', min: 0, step: 'any' },
            { label: 'Unité', field: 'unit', placeholder: 'gal' },
            { label: 'Prix unit.', field: 'unitPrice', type: 'number', min: 0 },
          ].map(({ label, field, ...rest }) => (
            <div key={field}>
              <label className="text-[9px] text-gray-400 font-semibold uppercase mb-0.5 block">{label}</label>
              <Input
                value={line[field]}
                onChange={e => onChange(field, rest.type === 'number' ? Math.max(0, parseFloat(e.target.value) || 0) : e.target.value)}
                {...rest}
              />
            </div>
          ))}
          <div>
            <label className="text-[9px] text-gray-400 font-semibold uppercase mb-0.5 block">TVA %</label>
            <Sel value={line.taxRate} onChange={e => onChange('taxRate', parseFloat(e.target.value))}>
              {TAX_PRESETS.map(t => <option key={t.rate} value={t.rate}>{t.rate}%</option>)}
            </Sel>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-[10px] text-gray-400 hover:text-blue-500 flex items-center gap-1 transition-colors"
          >
            {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            {expanded ? 'Masquer remise/note' : 'Remise & note'}
          </button>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 mr-1">Total ligne:</span>
            <span className="text-sm font-bold text-blue-600">{fmt(total, sym)}</span>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-50 bg-gray-50/60 p-3 space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[9px] text-gray-400 font-semibold uppercase mb-0.5 block">Remise</label>
              <Input type="number" value={line.discount}
                onChange={e => onChange('discount', Math.max(0, parseFloat(e.target.value) || 0))}
                min="0" placeholder="0" />
            </div>
            <div className="w-32">
              <label className="text-[9px] text-gray-400 font-semibold uppercase mb-0.5 block">Type remise</label>
              <Sel value={line.discountType} onChange={e => onChange('discountType', e.target.value)}>
                <option value="percent">% Pourcent</option>
                <option value="fixed">Montant fixe</option>
              </Sel>
            </div>
          </div>
          <div>
            <label className="text-[9px] text-gray-400 font-semibold uppercase mb-0.5 block">Note de ligne</label>
            <Input value={line.note} onChange={e => onChange('note', e.target.value)} placeholder="Précision, référence..." />
          </div>
          <div className="text-[10px] text-gray-400 text-right font-mono">
            {line.quantity} × {fmt(line.unitPrice, sym)} – remise – TVA{line.taxRate}% = {fmt(total, sym)}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── History Card ─────────────────────────────────────────────────────────────
const HistoryCard = ({ inv, onRestore, onDownload }) => {
  const sym = CURRENCIES[inv.currency]?.symbol || 'HTG';
  const grandTotal = inv.lines.reduce((s, l) => s + lineTotal(l), 0);
  const st = STATUSES[inv.status] || STATUSES.draft;
  return (
    <div className="flex-none bg-white border border-gray-100 rounded-xl p-3 min-w-[200px] shadow-sm">
      <div className="flex items-start justify-between mb-1.5">
        <p className="text-xs font-bold text-gray-900 truncate flex-1">{inv.customerName || '—'}</p>
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1 flex-shrink-0"
          style={{ background: st.bg, color: st.color }}>{st.label}</span>
      </div>
      <p className="text-[10px] text-gray-400 mb-1 font-mono">{inv.number}</p>
      <p className="text-[10px] text-gray-500">{inv.lines.length} ligne(s) · {fmt(grandTotal, sym)}</p>
      <p className="text-[10px] text-gray-400 mb-2">{inv.date}</p>
      <div className="flex gap-1">
        <button onClick={() => onRestore(inv)} className="flex-1 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded-lg hover:bg-blue-100 transition-colors">Restaurer</button>
        <button onClick={() => onDownload(inv)} className="flex-1 py-1.5 bg-gray-50 text-gray-600 text-[10px] font-semibold rounded-lg hover:bg-gray-100 transition-colors">↓ PNG</button>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProForma() {
  const [docType, setDocType]               = useState('facture');
  const [status, setStatus]                 = useState('draft');
  const [invoiceSeq, setInvoiceSeq]         = useState(1);
  const [currency, setCurrency]             = useState('HTG');
  const [paymentTermsDays, setPaymentTermsDays] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [amountPaid, setAmountPaid]         = useState(0);

  const [customerName, setCustomerName]         = useState('');
  const [customerCompany, setCustomerCompany]   = useState('');
  const [customerPhone, setCustomerPhone]       = useState('');
  const [customerEmail, setCustomerEmail]       = useState('');
  const [customerAddress, setCustomerAddress]   = useState('');
  const [customerNIF, setCustomerNIF]           = useState('');
  const [deliveryAddress, setDeliveryAddress]   = useState('');
  const [showDelivery, setShowDelivery]         = useState(false);

  const [savedCustomers, setSavedCustomers]     = useState([]);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [customerSearch, setCustomerSearch]     = useState('');

  const [lines, setLines]                   = useState([DEFAULT_LINE()]);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [globalDiscountType, setGlobalDiscountType] = useState('percent');

  const [company, setCompany]   = useState(DEFAULT_COMPANY);
  const [logo, setLogo]         = useState(null);

  const [notes, setNotes]   = useState('');
  const [terms, setTerms]   = useState('');

  const [themeIndex, setThemeIndex]     = useState(0);
  const [watermark, setWatermark]       = useState('none');
  const [showBank, setShowBank]         = useState(false);
  const [showSignature, setShowSignature] = useState(false);

  const [genStatus, setGenStatus]   = useState('idle');
  const [toast, setToast]           = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory]       = useState([]);
  const [openSection, setOpenSection] = useState('lines');

  const docNumber  = useMemo(() => generateDocNumber(docType, invoiceSeq), [docType, invoiceSeq]);
  const dueDate    = useMemo(() => paymentTermsDays > 0 ? dueDateFromTerms(paymentTermsDays) : '', [paymentTermsDays]);
  const theme      = INVOICE_COLORS[themeIndex];
  const sym        = CURRENCIES[currency]?.symbol || 'HTG';

  const subtotal      = useMemo(() => lines.reduce((s, l) => s + lineSubtotal(l), 0), [lines]);
  const totalTax      = useMemo(() => lines.reduce((s, l) => s + lineTax(l), 0), [lines]);
  const globalDiscAmt = useMemo(() =>
    globalDiscountType === 'percent' ? subtotal * (globalDiscount / 100) : globalDiscount,
    [subtotal, globalDiscount, globalDiscountType]);
  const grandTotal    = useMemo(() => subtotal + totalTax - globalDiscAmt, [subtotal, totalTax, globalDiscAmt]);
  const balanceDue    = useMemo(() => Math.max(0, grandTotal - amountPaid), [grandTotal, amountPaid]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const updateLine    = useCallback((id, field, value) =>
    setLines(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l)), []);
  const addLine       = useCallback(() => setLines(prev => [...prev, DEFAULT_LINE()]), []);
  const deleteLine    = useCallback((id) =>
    setLines(prev => prev.length > 1 ? prev.filter(l => l.id !== id) : prev), []);
  const duplicateLine = useCallback((id) =>
    setLines(prev => {
      const idx = prev.findIndex(l => l.id === id);
      const copy = { ...prev[idx], id: Date.now() + Math.random() };
      const next = [...prev]; next.splice(idx + 1, 0, copy); return next;
    }), []);

  const handleLogoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setLogo(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const togglePaymentMethod = useCallback((method) =>
    setPaymentMethods(prev =>
      prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]), []);

  const saveCustomer = useCallback(() => {
    if (!customerName.trim()) return showToast('Entrez un nom client d\'abord', 'error');
    const c = { customerName, customerCompany, customerPhone, customerEmail, customerAddress, customerNIF };
    setSavedCustomers(prev => {
      const exists = prev.find(x => x.customerName === customerName);
      return exists ? prev.map(x => x.customerName === customerName ? c : x) : [c, ...prev];
    });
    showToast('Client sauvegardé !');
  }, [customerName, customerCompany, customerPhone, customerEmail, customerAddress, customerNIF, showToast]);

  const loadCustomer = useCallback((c) => {
    setCustomerName(c.customerName);
    setCustomerCompany(c.customerCompany || '');
    setCustomerPhone(c.customerPhone || '');
    setCustomerEmail(c.customerEmail || '');
    setCustomerAddress(c.customerAddress || '');
    setCustomerNIF(c.customerNIF || '');
    setShowCustomerSearch(false);
    showToast('Client chargé !');
  }, [showToast]);

  const buildInvoiceData = useCallback(() => ({
    number: docNumber, date: formatDate(), dueDate,
    type: docType, status, currency,
    customerName, customerCompany, customerPhone, customerEmail, customerAddress, customerNIF,
    deliveryAddress: showDelivery ? deliveryAddress : '',
    lines, globalDiscount, globalDiscountType, amountPaid, paymentMethods, notes, terms,
  }), [docNumber, dueDate, docType, status, currency, customerName, customerCompany,
    customerPhone, customerEmail, customerAddress, customerNIF, showDelivery, deliveryAddress,
    lines, globalDiscount, globalDiscountType, amountPaid, paymentMethods, notes, terms]);

  const validate = useCallback(() => {
    if (!customerName.trim()) return 'Veuillez entrer le nom du client';
    if (lines.some(l => !l.description.trim())) return 'Chaque ligne doit avoir une description';
    if (lines.some(l => l.quantity <= 0)) return 'Les quantités doivent être > 0';
    return null;
  }, [customerName, lines]);

  const handleGenerate = useCallback(async (action) => {
    const err = validate();
    if (err) return showToast(err, 'error');
    setGenStatus(action);
    const invoiceData = buildInvoiceData();
    try {
      const blob = await generateImageBlob({ invoice: invoiceData, company, logo, theme, options: { watermark, showBank, showSignature } });
      const filename = `${docType}-${docNumber}.png`;
      if (action === 'download') {
        const link = document.createElement('a');
        link.download = filename;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
        showToast('Document téléchargé avec succès !');
      } else {
        const file = new File([blob], filename, { type: 'image/png' });
        if (navigator.share) {
          await navigator.share({ title: `${docType} ${docNumber}`, text: `${company.name} — ${customerName} — Total: ${fmt(grandTotal, sym)}`, files: [file] });
          showToast('Document partagé !');
        } else {
          showToast('Partage non supporté. Utilisez le téléchargement.', 'error');
        }
      }
      setHistory(prev => [invoiceData, ...prev].slice(0, 20));
      setInvoiceSeq(s => s + 1);
    } catch (e) {
      console.error(e);
      showToast(`Erreur: ${e.message}`, 'error');
    } finally {
      setGenStatus('idle');
    }
  }, [validate, showToast, buildInvoiceData, company, logo, theme, watermark, showBank, showSignature, docType, docNumber, customerName, grandTotal, sym]);

  const handleRestoreHistory = useCallback((inv) => {
    setDocType(inv.type); setStatus(inv.status); setCurrency(inv.currency);
    setCustomerName(inv.customerName); setCustomerCompany(inv.customerCompany || '');
    setCustomerPhone(inv.customerPhone || ''); setCustomerEmail(inv.customerEmail || '');
    setCustomerAddress(inv.customerAddress || ''); setCustomerNIF(inv.customerNIF || '');
    setDeliveryAddress(inv.deliveryAddress || ''); setShowDelivery(!!inv.deliveryAddress);
    setLines(inv.lines); setGlobalDiscount(inv.globalDiscount);
    setGlobalDiscountType(inv.globalDiscountType); setAmountPaid(inv.amountPaid || 0);
    setPaymentMethods(inv.paymentMethods || []); setNotes(inv.notes || ''); setTerms(inv.terms || '');
    setShowHistory(false); showToast('Document restauré !');
  }, [showToast]);

  const handleRedownload = useCallback(async (inv) => {
    setGenStatus('download');
    try {
      const blob = await generateImageBlob({ invoice: inv, company, logo, theme, options: { watermark, showBank, showSignature } });
      const link = document.createElement('a');
      link.download = `${inv.type}-${inv.number}.png`;
      link.href = URL.createObjectURL(blob); link.click();
      URL.revokeObjectURL(link.href); showToast('Re-téléchargé !');
    } catch (e) { showToast(`Erreur: ${e.message}`, 'error'); }
    finally { setGenStatus('idle'); }
  }, [company, logo, theme, watermark, showBank, showSignature, showToast]);

  const isLoading = genStatus !== 'idle';
  const filteredCustomers = savedCustomers.filter(c =>
    c.customerName.toLowerCase().includes(customerSearch.toLowerCase()));

  const Section = ({ id, icon: Icon, title, badge, children }) => {
    const open = openSection === id;
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-50/80">
        <button onClick={() => setOpenSection(open ? null : id)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/60 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: theme.accent }}>
              <Icon size={14} style={{ color: theme.primary }} />
            </div>
            <span className="text-sm font-semibold text-gray-800">{title}</span>
            {badge != null && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: theme.accent, color: theme.primary }}>{badge}</span>
            )}
          </div>
          <ChevronDown size={15} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && <div className="px-4 pb-4 border-t border-gray-50 pt-3">{children}</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {logo
                ? <img src={logo} alt="Logo" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                : <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg,${theme.primary},${theme.secondary})` }}>
                    <Droplets size={14} className="text-white" />
                  </div>
              }
              <div>
                <h1 className="text-sm font-bold text-gray-900">Propane Invoice Pro</h1>
                <p className="text-[10px] text-gray-400 font-mono">{docNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sel value={status} onChange={e => setStatus(e.target.value)}
                className="!py-1 !px-2 text-[10px] font-bold !rounded-full border-0 !w-auto appearance-none cursor-pointer"
                style={{ background: STATUSES[status].bg, color: STATUSES[status].color }}>
                {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </Sel>
              <button onClick={() => setShowHistory(v => !v)}
                className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors">
                <History size={16} className="text-gray-500" />
                {history.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                    style={{ background: theme.primary }}>{history.length}</span>
                )}
              </button>
            </div>
          </div>

          {/* Doc type tabs */}
          <div className="flex gap-1 mt-3 bg-gray-100 rounded-xl p-1">
            {['facture', 'proforma', 'devis'].map(t => (
              <button key={t} onClick={() => setDocType(t)}
                className="flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all"
                style={docType === t ? { background: theme.primary, color: 'white' } : { color: '#6b7280' }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── History panel ── */}
      {showHistory && (
        <div className="bg-white border-b border-gray-100 px-4 py-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Historique ({history.length} document{history.length !== 1 ? 's' : ''})
          </p>
          {history.length === 0
            ? <p className="text-xs text-gray-400 py-2">Aucun document généré pour cette session</p>
            : <div className="flex gap-2 overflow-x-auto pb-2">
                {history.map((inv, i) => (
                  <HistoryCard key={i} inv={inv} onRestore={handleRestoreHistory} onDownload={handleRedownload} />
                ))}
              </div>
          }
        </div>
      )}

      {/* ── Live totals bar ── */}
      <div className="bg-white border-b border-gray-50 px-4 py-2.5 flex items-center justify-between">
        <div className="flex gap-3 text-xs flex-wrap">
          <span className="text-gray-400">HT: <strong className="text-gray-700">{fmt(subtotal, sym)}</strong></span>
          {totalTax > 0 && <span className="text-gray-400">TVA: <strong className="text-amber-600">{fmt(totalTax, sym)}</strong></span>}
          {globalDiscAmt > 0 && <span className="text-gray-400">Remise: <strong className="text-red-500">-{fmt(globalDiscAmt, sym)}</strong></span>}
          {amountPaid > 0 && <span className="text-gray-400">Reste: <strong className={balanceDue <= 0 ? 'text-green-600' : 'text-red-600'}>{fmt(balanceDue, sym)}</strong></span>}
        </div>
        <div className="text-right">
          <div className="text-[9px] text-gray-400 uppercase font-bold">Total TTC</div>
          <div className="text-base font-black" style={{ color: theme.primary }}>{fmt(grandTotal, sym)}</div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-3 space-y-2 pb-32">

        {/* ─ Lines ─ */}
        <Section id="lines" icon={Package} title="Articles & Services" badge={lines.length}>
          <div className="space-y-2 mt-1">
            {/* Currency row */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Devise</span>
              <Sel value={currency} onChange={e => setCurrency(e.target.value)} className="!py-1.5 !px-2 text-xs w-44">
                {Object.entries(CURRENCIES).map(([k, v]) => <option key={k} value={k}>{k} — {v.name}</option>)}
              </Sel>
            </div>

            {lines.map((line, i) => (
              <LineItemRow key={line.id} line={line} index={i} currency={currency}
                onChange={(field, value) => updateLine(line.id, field, value)}
                onDelete={() => deleteLine(line.id)}
                onDuplicate={() => duplicateLine(line.id)} />
            ))}

            <button onClick={addLine}
              className="w-full py-3 border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 rounded-xl text-xs font-semibold text-gray-400 hover:text-blue-500 flex items-center justify-center gap-1.5 transition-all">
              <Plus size={13} /> Ajouter une ligne
            </button>

            {/* Global discount + acompte */}
            <div className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ajustements globaux</p>
              <div className="flex items-center gap-2">
                <Tag size={12} className="text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-500 w-24 flex-shrink-0">Remise globale</span>
                <Input type="number" value={globalDiscount}
                  onChange={e => setGlobalDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="flex-1 !py-1.5 text-xs" min="0" placeholder="0" />
                <Sel value={globalDiscountType} onChange={e => setGlobalDiscountType(e.target.value)} className="w-28 !py-1.5 text-xs">
                  <option value="percent">%</option>
                  <option value="fixed">Montant fixe</option>
                </Sel>
                {globalDiscAmt > 0 && <span className="text-xs text-red-500 font-bold flex-shrink-0">-{fmt(globalDiscAmt, sym)}</span>}
              </div>
              <div className="flex items-center gap-2">
                <CreditCard size={12} className="text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-500 w-24 flex-shrink-0">Acompte reçu</span>
                <Input type="number" value={amountPaid}
                  onChange={e => setAmountPaid(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="flex-1 !py-1.5 text-xs" min="0" placeholder="0" />
                <span className="text-xs text-gray-400 flex-shrink-0 w-28 text-right">{sym}</span>
              </div>
            </div>

            {/* Totals summary */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl p-3 border border-gray-100 bg-white text-center">
                <p className="text-[9px] text-gray-400 uppercase font-bold mb-0.5">Total TTC</p>
                <p className="text-lg font-black" style={{ color: theme.primary }}>{fmt(grandTotal, sym)}</p>
              </div>
              <div className={`rounded-xl p-3 border text-center ${balanceDue <= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                <p className="text-[9px] text-gray-400 uppercase font-bold mb-0.5">Reste à payer</p>
                <p className={`text-lg font-black ${balanceDue <= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(balanceDue, sym)}</p>
              </div>
            </div>
          </div>
        </Section>

        {/* ─ Client ─ */}
        <Section id="customer" icon={User} title="Client" badge={customerName || undefined}>
          <div className="space-y-2 mt-1">
            {savedCustomers.length > 0 && (
              <>
                <button onClick={() => setShowCustomerSearch(v => !v)}
                  className="text-xs flex items-center gap-1.5 font-medium transition-colors"
                  style={{ color: theme.primary }}>
                  <Users size={12} /> Clients sauvegardés ({savedCustomers.length})
                </button>
                {showCustomerSearch && (
                  <div className="rounded-xl p-2 border border-gray-100" style={{ background: theme.accent }}>
                    <Input value={customerSearch} onChange={e => setCustomerSearch(e.target.value)}
                      placeholder="Rechercher un client..." className="mb-2 !bg-white" />
                    <div className="space-y-1 max-h-36 overflow-y-auto">
                      {filteredCustomers.length === 0
                        ? <p className="text-xs text-gray-400 px-2 py-1">Aucun résultat</p>
                        : filteredCustomers.map((c, i) => (
                            <button key={i} onClick={() => loadCustomer(c)}
                              className="w-full text-left px-3 py-2 bg-white hover:bg-blue-50 rounded-lg text-xs transition-colors">
                              <span className="font-semibold text-gray-800">{c.customerName}</span>
                              {c.customerCompany && <span className="text-gray-400 ml-1">· {c.customerCompany}</span>}
                            </button>
                          ))
                      }
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Field label="Nom complet" required className="col-span-2">
                <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Jean Dupont" />
              </Field>
              <Field label="Entreprise / Société">
                <Input value={customerCompany} onChange={e => setCustomerCompany(e.target.value)} placeholder="SARL XYZ" />
              </Field>
              <Field label="NIF Client">
                <Input value={customerNIF} onChange={e => setCustomerNIF(e.target.value)} placeholder="000-000-000-0" />
              </Field>
              <Field label="Téléphone">
                <Input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="+509 xxxx xxxx" />
              </Field>
              <Field label="Email">
                <Input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="email@exemple.com" />
              </Field>
              <Field label="Adresse de facturation" className="col-span-2">
                <Input value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} placeholder="Rue, Quartier, Ville" />
              </Field>
            </div>

            <Toggle value={showDelivery} onChange={setShowDelivery} label="Adresse de livraison différente" />
            {showDelivery && (
              <Field label="Adresse de livraison">
                <Textarea value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)}
                  placeholder="Adresse complète de livraison..." />
              </Field>
            )}

            <button onClick={saveCustomer}
              className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
              style={{ color: theme.primary }}>
              <Save size={12} /> Sauvegarder ce client
            </button>
          </div>
        </Section>

        {/* ─ Paiement ─ */}
        <Section id="payment" icon={CreditCard} title="Paiement & Échéance">
          <div className="space-y-3 mt-1">
            <Field label="Conditions de paiement">
              <Sel value={paymentTermsDays} onChange={e => setPaymentTermsDays(parseInt(e.target.value))}>
                {PAYMENT_TERMS.map(t => <option key={t.days} value={t.days}>{t.label}</option>)}
              </Sel>
            </Field>
            {dueDate && (
              <div className="flex items-center gap-2 rounded-lg px-3 py-2 border"
                style={{ background: theme.accent, borderColor: theme.border }}>
                <Calendar size={13} style={{ color: theme.primary }} />
                <span className="text-xs font-semibold" style={{ color: theme.primary }}>
                  Date d'échéance : {dueDate}
                </span>
              </div>
            )}
            <Field label="Modes de paiement acceptés">
              <div className="flex flex-wrap gap-1.5 mt-1">
                {PAYMENT_METHODS.map(m => (
                  <button key={m} onClick={() => togglePaymentMethod(m)}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold border transition-all"
                    style={paymentMethods.includes(m)
                      ? { background: theme.primary, color: 'white', borderColor: theme.primary }
                      : { background: 'white', color: '#6b7280', borderColor: '#e5e7eb' }}>
                    {m}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </Section>

        {/* ─ Notes & Conditions ─ */}
        <Section id="notes" icon={MessageSquare} title="Notes & Conditions">
          <div className="space-y-2 mt-1">
            <Field label="Notes (visibles sur la facture)">
              <Textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Merci pour votre commande. Livraison dans les 24h ouvrables..." />
            </Field>
            <Field label="Conditions générales de vente">
              <Textarea value={terms} onChange={e => setTerms(e.target.value)}
                placeholder="Paiement à réception de facture. Marchandise non reprise après livraison..." />
            </Field>
          </div>
        </Section>

        {/* ─ Entreprise ─ */}
        <Section id="company" icon={Building} title="Mon Entreprise">
          <div className="space-y-2 mt-1">
            <div className="grid grid-cols-2 gap-2">
              <Field label="Raison sociale" className="col-span-2">
                <Input value={company.name} onChange={e => setCompany(p => ({ ...p, name: e.target.value }))} />
              </Field>
              <Field label="Adresse" className="col-span-2">
                <Input value={company.address} onChange={e => setCompany(p => ({ ...p, address: e.target.value }))} />
              </Field>
              <Field label="Téléphone">
                <Input type="tel" value={company.phone} onChange={e => setCompany(p => ({ ...p, phone: e.target.value }))} />
              </Field>
              <Field label="Email">
                <Input type="email" value={company.email} onChange={e => setCompany(p => ({ ...p, email: e.target.value }))} />
              </Field>
              <Field label="Site web" className="col-span-2">
                <Input value={company.website} onChange={e => setCompany(p => ({ ...p, website: e.target.value }))} placeholder="www.exemple.ht" />
              </Field>
              <Field label="NIF">
                <Input value={company.nif} onChange={e => setCompany(p => ({ ...p, nif: e.target.value }))} />
              </Field>
              <Field label="RCCM">
                <Input value={company.rccm} onChange={e => setCompany(p => ({ ...p, rccm: e.target.value }))} />
              </Field>
            </div>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 rounded-xl cursor-pointer transition-all">
                <Upload size={14} className="text-gray-400" />
                <span className="text-xs text-gray-500 font-medium">Importer le logo</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
              </label>
              {logo && (
                <div className="relative">
                  <img src={logo} alt="Logo" className="w-14 h-14 rounded-xl object-cover border border-gray-200" />
                  <button onClick={() => setLogo(null)} className="absolute -top-1.5 -right-1.5 bg-red-500 rounded-full p-0.5 shadow">
                    <X size={10} className="text-white" />
                  </button>
                </div>
              )}
            </div>

            <Toggle value={showBank} onChange={setShowBank} label="Afficher les coordonnées bancaires sur la facture" />
            {showBank && (
              <div className="grid grid-cols-2 gap-2">
                <Field label="Banque">
                  <Input value={company.bank || ''} onChange={e => setCompany(p => ({ ...p, bank: e.target.value }))} />
                </Field>
                <Field label="SWIFT / BIC">
                  <Input value={company.swift || ''} onChange={e => setCompany(p => ({ ...p, swift: e.target.value }))} />
                </Field>
                <Field label="IBAN" className="col-span-2">
                  <Input value={company.iban || ''} onChange={e => setCompany(p => ({ ...p, iban: e.target.value }))} className="font-mono" />
                </Field>
              </div>
            )}
          </div>
        </Section>

        {/* ─ Apparence ─ */}
        <Section id="options" icon={Settings} title="Apparence & Options">
          <div className="space-y-4 mt-1">
            {/* Color theme */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Couleur du document</p>
              <div className="flex gap-2 flex-wrap">
                {INVOICE_COLORS.map((c, i) => (
                  <button key={i} onClick={() => setThemeIndex(i)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border-2 text-xs font-semibold transition-all"
                    style={{
                      borderColor: themeIndex === i ? c.primary : '#e5e7eb',
                      background: themeIndex === i ? c.accent : 'white',
                      color: c.primary
                    }}>
                    <span className="w-3 h-3 rounded-full" style={{ background: c.primary }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Watermark */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Filigrane</p>
              <div className="flex gap-2 flex-wrap">
                {['none', 'brouillon', 'copie', 'payé', 'annulé', 'confidentiel'].map(w => (
                  <button key={w} onClick={() => setWatermark(w)}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold border transition-all capitalize"
                    style={watermark === w
                      ? { background: theme.primary, color: 'white', borderColor: theme.primary }
                      : { background: 'white', color: '#6b7280', borderColor: '#e5e7eb' }}>
                    {w === 'none' ? 'Aucun' : w}
                  </button>
                ))}
              </div>
            </div>

            <Toggle value={showSignature} onChange={setShowSignature} label="Inclure zone de signature (recto verso)" />

            {/* Invoice sequence */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Numérotation</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 flex-shrink-0">Séquence n°</span>
                <Input type="number" value={invoiceSeq}
                  onChange={e => setInvoiceSeq(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1" className="!py-1.5 text-xs" />
              </div>
              <div className="mt-1.5 bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-500 font-mono border border-gray-100">
                Numéro généré : <strong className="text-gray-700">{docNumber}</strong>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* ── Action Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pt-3 pb-5 shadow-lg">
        <div className="flex justify-between items-center mb-2 px-0.5">
          <span className="text-[10px] text-gray-400">{lines.length} ligne(s) · {currency} · {STATUSES[status].label}</span>
          <span className="text-xs font-bold" style={{ color: theme.primary }}>
            {fmt(grandTotal, sym)}
            {balanceDue < grandTotal && ` · Reste: ${fmt(balanceDue, sym)}`}
          </span>
        </div>
        <div className="flex gap-2.5 max-w-md mx-auto">
          <button onClick={() => handleGenerate('share')} disabled={isLoading}
            className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-gray-700 text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {genStatus === 'share' ? <Loader size={16} className="animate-spin" /> : <Share2 size={16} />}
            Partager
          </button>
          <button onClick={() => handleGenerate('download')} disabled={isLoading}
            className="flex-1 py-3.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md active:scale-95"
            style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
            {genStatus === 'download' ? <Loader size={16} className="animate-spin" /> : <Download size={16} />}
            Générer PNG
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce-in {
          0%   { transform: translateY(-16px); opacity: 0; }
          60%  { transform: translateY(3px); }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-bounce-in { animation: bounce-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}
