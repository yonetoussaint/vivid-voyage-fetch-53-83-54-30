import React, { useState } from 'react';
import { Download, Share2, User, Receipt, Calendar, Package, Building, Loader, Check, Image as ImageIcon, Upload, Phone, Mail, MapPin, FileText, Droplets } from 'lucide-react';

// ==================== COMPOSANT PRINCIPAL - FACTURE PROPANE ====================
const PropaneInvoiceGenerator = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [quantity, setQuantity] = useState(400);
  const [pricePerUnit] = useState(450);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
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
  const invoiceNumber = 'PRO-' + Date.now().toString().slice(-8);
  const currentDate = new Date().toLocaleDateString('fr-FR');
  const currentTime = new Date().toLocaleTimeString('fr-FR');

  // Handle logo upload
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result);
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateInvoice = async (action = 'download') => {
    if (quantity <= 0) {
      alert('La quantité doit être supérieure à 0');
      return;
    }

    if (!customerName.trim()) {
      alert('Veuillez entrer le nom du client');
      return;
    }

    if (action === 'download') {
      setIsDownloading(true);
    } else {
      setIsSharing(true);
    }

    const invoice = {
      number: invoiceNumber,
      date: currentDate,
      time: currentTime,
      customerName: customerName,
      customerPhone: customerPhone,
      customerAddress: customerAddress,
      quantity: quantity,
      pricePerUnit: pricePerUnit,
      total: totalAmount
    };

    try {
      const imageBlob = await generateImageBlob({ 
        invoice,
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
        link.download = `facture-${invoice.number}.png`;
        link.href = URL.createObjectURL(imageBlob);
        link.click();
        URL.revokeObjectURL(link.href);
      } else {
        const file = new File([imageBlob], `facture-${invoice.number}.png`, { type: 'image/png' });

        if (navigator.share) {
          await navigator.share({
            title: `Facture ${invoice.number}`,
            text: `Facture ${companyName} - ${customerName} - ${quantity} gallons - Total: ${totalAmount} HTG`,
            files: [file]
          });
        } else {
          alert('Le partage n\'est pas supporté sur ce navigateur. Utilisez le téléchargement à la place.');
        }
      }

      setInvoiceHistory(prev => [invoice, ...prev].slice(0, 10));
      
      if (action === 'download') {
        // Optionally clear form after successful download
        // setCustomerName('');
        // setCustomerPhone('');
        // setCustomerAddress('');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert(`Erreur lors de la ${action === 'download' ? 'génération' : 'génération et du partage'} de la facture`);
    } finally {
      setIsDownloading(false);
      setIsSharing(false);
    }
  };

  const quickAmounts = [100, 200, 300, 400, 500, 1000];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-12 h-12 object-contain bg-white rounded-lg p-1" />
              ) : (
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <Droplets size={28} className="text-blue-600" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">Facture Propane</h1>
                <p className="text-sm text-blue-100">Générateur de factures professionnelles</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">{currentDate}</p>
              <p className="text-xs text-blue-200">N° Facture: {invoiceNumber}</p>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Company Info & Settings */}
          <div className="md:col-span-1 space-y-6">
            {/* Logo Upload */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ImageIcon size={18} className="text-blue-600" />
                Logo entreprise
              </h3>
              
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center overflow-hidden border-2 border-blue-300">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                  ) : (
                    <Droplets size={48} className="text-blue-600" />
                  )}
                </div>
                
                <label className="w-full flex flex-col items-center justify-center py-3 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
                  <Upload size={20} className="text-blue-600 mb-1" />
                  <p className="text-sm text-blue-600 font-medium">Télécharger logo</p>
                  <p className="text-xs text-gray-500">PNG, JPG</p>
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </label>
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building size={18} className="text-blue-600" />
                Informations entreprise
              </h3>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Nom de l'entreprise"
                  className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="Adresse"
                  className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  placeholder="Téléphone"
                  className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={companyNIF}
                  onChange={(e) => setCompanyNIF(e.target.value)}
                  placeholder="NIF"
                  className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={companyRCCM}
                  onChange={(e) => setCompanyRCCM(e.target.value)}
                  placeholder="RCCM"
                  className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Invoice Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User size={18} className="text-blue-600" />
                Informations client
              </h3>
              
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Jean Dupont"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+509 1234 5678"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Saint-Marc, Haïti"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Propane Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Package size={18} className="text-blue-600" />
                Détails de la commande
              </h3>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Prix unitaire:</span>
                  <span className="text-lg font-bold text-blue-800">{pricePerUnit} HTG / gallon</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantité (gallons)</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                  min="1"
                  className="w-full p-4 text-2xl font-bold border rounded-lg focus:ring-2 focus:ring-blue-500 text-center"
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {quickAmounts.map(amount => (
                  <button
                    key={amount}
                    onClick={() => setQuantity(amount)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      quantity === amount
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {amount} gal
                  </button>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">Total à payer:</span>
                  <span className="text-3xl font-bold text-blue-800">{totalAmount.toLocaleString()} HTG</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex gap-4">
                <button
                  onClick={() => handleGenerateInvoice('download')}
                  disabled={isDownloading || isSharing}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      <span>Génération...</span>
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      <span>Télécharger facture</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleGenerateInvoice('share')}
                  disabled={isSharing || isDownloading}
                  className="flex-1 bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSharing ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      <span>Préparation...</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={20} />
                      <span>Partager facture</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Recent Invoices */}
            {invoiceHistory.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Receipt size={18} className="text-blue-600" />
                  Factures récentes
                </h3>
                
                <div className="space-y-3">
                  {invoiceHistory.map((invoice, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-800">{invoice.customerName}</p>
                          <p className="text-sm text-gray-600">
                            {invoice.quantity} gal - {invoice.total.toLocaleString()} HTG
                          </p>
                          <p className="text-xs text-gray-400">{invoice.number}</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {invoice.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== FONCTION DE GÉNÉRATION D'IMAGE ====================
const generateImageBlob = async ({ invoice, companyInfo }) => {
  await import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');

  const invoiceHTML = generateInvoiceHTML({ invoice, companyInfo });

  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '1200px';
  iframe.style.height = '1600px';
  iframe.style.left = '-9999px';
  iframe.style.top = '0';
  iframe.style.border = 'none';

  document.body.appendChild(iframe);

  iframe.contentDocument.open();
  iframe.contentDocument.write(invoiceHTML);
  iframe.contentDocument.close();

  await new Promise(resolve => setTimeout(resolve, 500));

  const canvas = await window.html2canvas(iframe.contentDocument.body, { 
    scale: 2,
    backgroundColor: '#ffffff',
    logging: false,
    allowTaint: true,
    useCORS: true,
    windowWidth: 1200,
    windowHeight: 1600
  });

  document.body.removeChild(iframe);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png', 1.0);
  });
};

// ==================== GÉNÉRATION HTML DE LA FACTURE ====================
const generateInvoiceHTML = ({ invoice, companyInfo }) => {
  // Logo HTML
  const logoHTML = companyInfo.logo 
    ? `<img src="${companyInfo.logo}" alt="Logo" style="width: 100px; height: 100px; object-fit: contain; border-radius: 12px;" />`
    : `<div style="width: 100px; height: 100px; background: linear-gradient(135deg, #1e40af, #1e3a8a); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
        <span style="color: white; font-size: 42px; font-weight: bold;">P</span>
       </div>`;

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Facture Propane ${invoice.number}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        margin: 0; 
        padding: 0; 
        background: white; 
        font-family: 'Inter', Arial, sans-serif;
        line-height: 1.5;
      }
      .invoice-container {
        width: 1200px;
        max-width: 1200px;
        margin: 0 auto;
        background: white;
        padding: 40px;
      }
    </style>
  </head>
  <body>
    <div class="invoice-container">
      <!-- En-tête -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 2px solid #e5e7eb;">
        <div>
          ${logoHTML}
          <h1 style="font-size: 42px; font-weight: 800; color: #1f2937; margin: 20px 0 10px 0;">${companyInfo.name}</h1>
          <p style="font-size: 16px; color: #4b5563; margin: 5px 0;"><span style="font-weight: 600;">📍</span> ${companyInfo.address}</p>
          <p style="font-size: 16px; color: #4b5563; margin: 5px 0;"><span style="font-weight: 600;">📞</span> ${companyInfo.phone}</p>
          <p style="font-size: 16px; color: #4b5563; margin: 5px 0;"><span style="font-weight: 600;">✉️</span> ${companyInfo.email}</p>
        </div>
        <div style="text-align: right;">
          <h2 style="font-size: 56px; font-weight: 800; color: #1e40af; margin: 0 0 20px 0;">FACTURE</h2>
          <div style="background: #eff6ff; padding: 25px 30px; border-radius: 12px; border: 1px solid #bfdbfe;">
            <p style="font-size: 18px; color: #4b5563; margin: 8px 0;">
              <span style="font-weight: 700; color: #1f2937;">N° Facture:</span> ${invoice.number}
            </p>
            <p style="font-size: 18px; color: #4b5563; margin: 8px 0;">
              <span style="font-weight: 700; color: #1f2937;">Date:</span> ${invoice.date}
            </p>
            <p style="font-size: 18px; color: #4b5563; margin: 8px 0;">
              <span style="font-weight: 700; color: #1f2937;">Heure:</span> ${invoice.time}
            </p>
          </div>
        </div>
      </div>

      <!-- Client -->
      <div style="margin-bottom: 40px; padding: 25px 30px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
        <h3 style="font-size: 22px; font-weight: 700; color: #1f2937; margin: 0 0 15px 0;">Client</h3>
        <p style="font-size: 20px; color: #374151; margin: 8px 0; font-weight: 600;">${invoice.customerName}</p>
        ${invoice.customerPhone ? `<p style="font-size: 16px; color: #4b5563; margin: 5px 0;">📞 ${invoice.customerPhone}</p>` : ''}
        ${invoice.customerAddress ? `<p style="font-size: 16px; color: #4b5563; margin: 5px 0;">📍 ${invoice.customerAddress}</p>` : ''}
      </div>

      <!-- Détails de la commande -->
      <div style="margin-bottom: 40px;">
        <div style="background: linear-gradient(135deg, #1e40af, #1e3a8a); padding: 20px; border-radius: 12px 12px 0 0;">
          <h3 style="font-size: 22px; font-weight: 700; color: white; margin: 0;">Détails de la commande de propane</h3>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="text-align: left; padding: 16px 20px; font-size: 16px; font-weight: 600; color: #374151;">Description</th>
              <th style="text-align: center; padding: 16px 20px; font-size: 16px; font-weight: 600; color: #374151;">Quantité (gallons)</th>
              <th style="text-align: center; padding: 16px 20px; font-size: 16px; font-weight: 600; color: #374151;">Prix unitaire</th>
              <th style="text-align: right; padding: 16px 20px; font-size: 16px; font-weight: 600; color: #374151;">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 16px 20px; font-size: 16px; color: #1f2937;">Propane (gaz domestique)</td>
              <td style="text-align: center; padding: 16px 20px; font-size: 16px; color: #4b5563;">${invoice.quantity}</td>
              <td style="text-align: center; padding: 16px 20px; font-size: 16px; color: #4b5563;">${invoice.pricePerUnit.toFixed(2)} HTG</td>
              <td style="text-align: right; padding: 16px 20px; font-size: 16px; font-weight: bold; color: #1f2937;">${invoice.total.toFixed(2)} HTG</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totaux -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
        <div style="width: 500px;">
          <div style="display: flex; justify-content: space-between; padding: 16px 24px; border-bottom: 2px solid #e5e7eb;">
            <span style="font-size: 18px; color: #4b5563;">Sous-total:</span>
            <span style="font-size: 18px; font-weight: 600; color: #1f2937;">${invoice.total.toFixed(2)} HTG</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 16px 24px; border-bottom: 2px solid #e5e7eb;">
            <span style="font-size: 18px; color: #4b5563;">TVA (0%):</span>
            <span style="font-size: 18px; font-weight: 600; color: #1f2937;">0.00 HTG</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 20px 30px; background: #eff6ff; border-radius: 12px; margin-top: 16px; border: 2px solid #1e40af;">
            <span style="font-size: 24px; font-weight: 800; color: #1e3a8a;">TOTAL À PAYER:</span>
            <span style="font-size: 32px; font-weight: 800; color: #1e3a8a;">${invoice.total.toFixed(2)} HTG</span>
          </div>
        </div>
      </div>

      <!-- Informations supplémentaires -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
        <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
          <h4 style="font-size: 18px; font-weight: 700; color: #1f2937; margin: 0 0 15px 0;">Mode de paiement</h4>
          <p style="font-size: 16px; color: #374151; margin: 8px 0;">💵 Espèces</p>
          <p style="font-size: 16px; color: #374151; margin: 8px 0;">💳 Carte bancaire</p>
          <p style="font-size: 16px; color: #374151; margin: 8px 0;">📱 Mobile Money</p>
        </div>
        <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
          <h4 style="font-size: 18px; font-weight: 700; color: #1f2937; margin: 0 0 15px 0;">Informations propane</h4>
          <p style="font-size: 16px; color: #374151; margin: 8px 0;">✓ Produit: Gaz propane domestique</p>
          <p style="font-size: 16px; color: #374151; margin: 8px 0;">✓ Qualité: Premium</p>
          <p style="font-size: 16px; color: #374151; margin: 8px 0;">✓ Livraison incluse</p>
        </div>
      </div>

      <!-- Conditions -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 30px; border-top: 2px solid #e5e7eb;">
        <div>
          <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0 0 10px 0;">Conditions de vente:</p>
          <p style="font-size: 13px; color: #6b7280; max-width: 600px;">
            Paiement comptant à la livraison. Le propane est livré en l'état. 
            Aucun retour ou échange possible après livraison. 
            Merci de votre confiance.
          </p>
        </div>
        <div style="text-align: center;">
          <p style="font-size: 16px; color: #374151; font-weight: 600; margin: 0 0 10px 0;">Cachet et signature</p>
          <div style="border-bottom: 3px solid #9ca3af; width: 250px; margin-bottom: 10px;"></div>
          <p style="font-size: 14px; color: #4b5563;">Pour ${companyInfo.name}</p>
        </div>
      </div>
      
      <!-- Pied de page -->
      <div style="margin-top: 40px; text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #9ca3af; margin: 0;">
          ${companyInfo.name} - ${companyInfo.address} - ${companyInfo.phone} - ${companyInfo.email}
        </p>
        <p style="font-size: 12px; color: #9ca3af; margin: 5px 0;">
          NIF: ${companyInfo.nif} | RCCM: ${companyInfo.rccm}
        </p>
      </div>
    </div>
  </body>
</html>`;
};

export default PropaneInvoiceGenerator;