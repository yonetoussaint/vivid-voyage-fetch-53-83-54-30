import React, { useState, useRef } from 'react';
import { Menu, X, ShoppingCart, Plus, Minus, Trash2, FileText, Download, Home, Package, Settings, Receipt } from 'lucide-react';

const KGPattisseriePOS = () => {
  const [activeTab, setActiveTab] = useState('vente');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);

  // Saveurs de glace disponibles
  const flavors = [
    { id: 1, name: 'Fraise' },
    { id: 2, name: 'Chocolat' },
    { id: 3, name: 'Vanille' },
    { id: 4, name: 'Rhum Raisin' },
    { id: 5, name: 'Fruit de la Passion' },
  ];

  // Types de glace (formats)
  const products = [
    { id: 1, name: '07 OZ', price: 300, size: 'small' },
    { id: 2, name: '16 OZ', price: 500, size: 'large' },
  ];

  const [selectedFlavor, setSelectedFlavor] = useState('');

  const addToCart = (product) => {
    if (!selectedFlavor) {
      alert('Veuillez sélectionner une saveur');
      return;
    }

    const flavor = flavors.find(f => f.id === parseInt(selectedFlavor));
    const cartItem = {
      id: `${product.id}-${selectedFlavor}-${Date.now()}`,
      productId: product.id,
      name: `${product.name} - ${flavor.name}`,
      price: product.price,
      flavor: flavor.name,
      quantity: 1
    };

    setCart([...cart, cartItem]);
    setSelectedFlavor('');
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const generateInvoiceHTML = (invoice) => {
    const itemsHTML = invoice.items.map((item, index) => `
      <tr style="border-bottom: 1px solid #e5e7eb; ${index % 2 === 0 ? 'background-color: #f9fafb;' : ''}">
        <td style="padding: 16px 24px; font-size: 16px; color: #1f2937; font-family: Arial, sans-serif;">${item.name}</td>
        <td style="text-align: center; padding: 16px 24px; font-size: 16px; color: #4b5563; font-family: Arial, sans-serif;">${item.price.toFixed(2)} HTG</td>
        <td style="text-align: center; padding: 16px 24px; font-size: 16px; color: #4b5563; font-family: Arial, sans-serif;">${item.quantity}</td>
        <td style="text-align: right; padding: 16px 24px; font-size: 16px; font-weight: bold; color: #1f2937; font-family: Arial, sans-serif;">${(item.price * item.quantity).toFixed(2)} HTG</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Facture ${invoice.number}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body {
              margin: 0;
              padding: 0;
              background: white;
              font-family: 'Inter', Arial, sans-serif;
            }
            .invoice-container {
              width: 1200px;
              max-width: 1200px;
              margin: 0 auto;
              background: white;
              padding: 40px;
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container" style="width: 1200px; max-width: 1200px; margin: 0 auto; background: white; padding: 40px; font-family: 'Inter', Arial, sans-serif; box-sizing: border-box;">
            <!-- En-tête avec logo et informations société -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 2px solid #e5e7eb;">
              <div>
                <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #db2777, #be185d); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <span style="color: white; font-size: 42px; font-weight: bold;">KG</span>
                </div>
                <h1 style="font-size: 42px; font-weight: 800; color: #1f2937; margin: 0 0 10px 0; letter-spacing: -0.5px;">KG Pâtisserie</h1>
                <p style="font-size: 18px; color: #4b5563; margin: 6px 0; line-height: 1.5;">Saint-Marc, Ruelle Désir</p>
                <p style="font-size: 18px; color: #4b5563; margin: 6px 0; line-height: 1.5;">Haïti</p>
                <p style="font-size: 18px; color: #4b5563; margin: 6px 0; line-height: 1.5;">kentiagede@gmail.com</p>
                <p style="font-size: 18px; color: #4b5563; margin: 6px 0; line-height: 1.5;">Tél: +509 1234 5678</p>
              </div>
              <div style="text-align: right;">
                <h2 style="font-size: 56px; font-weight: 800; color: #db2777; margin: 0 0 20px 0; letter-spacing: -1px;">FACTURE</h2>
                <div style="background: #fdf2f8; padding: 25px 30px; border-radius: 12px; border: 1px solid #fbcfe8;">
                  <p style="font-size: 18px; color: #4b5563; margin: 8px 0; display: flex; justify-content: flex-end; gap: 20px;">
                    <span style="font-weight: 700; color: #1f2937;">N° Facture:</span> 
                    <span style="font-weight: 600;">${invoice.number}</span>
                  </p>
                  <p style="font-size: 18px; color: #4b5563; margin: 8px 0; display: flex; justify-content: flex-end; gap: 20px;">
                    <span style="font-weight: 700; color: #1f2937;">Date:</span> 
                    <span style="font-weight: 600;">${invoice.date}</span>
                  </p>
                  <p style="font-size: 18px; color: #4b5563; margin: 8px 0; display: flex; justify-content: flex-end; gap: 20px;">
                    <span style="font-weight: 700; color: #1f2937;">Heure:</span> 
                    <span style="font-weight: 600;">${invoice.time}</span>
                  </p>
                </div>
              </div>
            </div>

            <!-- Informations client -->
            <div style="margin-bottom: 40px; padding: 25px 30px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
              <h3 style="font-size: 22px; font-weight: 700; color: #1f2937; margin: 0 0 15px 0;">Facturer à :</h3>
              <p style="font-size: 18px; color: #374151; margin: 8px 0; font-weight: 500;">Client</p>
              <p style="font-size: 18px; color: #374151; margin: 8px 0;">Saint-Marc, Haïti</p>
              <p style="font-size: 18px; color: #374151; margin: 8px 0;">client@email.com</p>
            </div>

            <!-- Tableau des articles -->
            <table style="width: 100%; margin-bottom: 40px; border-collapse: collapse; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <thead>
                <tr style="background: linear-gradient(135deg, #db2777, #be185d);">
                  <th style="text-align: left; padding: 18px 24px; font-size: 16px; font-weight: 600; color: white; font-family: 'Inter', Arial, sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">Description</th>
                  <th style="text-align: center; padding: 18px 24px; font-size: 16px; font-weight: 600; color: white; font-family: 'Inter', Arial, sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">Prix unitaire</th>
                  <th style="text-align: center; padding: 18px 24px; font-size: 16px; font-weight: 600; color: white; font-family: 'Inter', Arial, sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">Quantité</th>
                  <th style="text-align: right; padding: 18px 24px; font-size: 16px; font-weight: 600; color: white; font-family: 'Inter', Arial, sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>

            <!-- Totaux -->
            <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
              <div style="width: 450px;">
                <div style="display: flex; justify-content: space-between; padding: 16px 24px; border-bottom: 2px solid #e5e7eb; background: white;">
                  <span style="font-size: 18px; color: #4b5563; font-weight: 500;">Sous-total:</span>
                  <span style="font-size: 18px; font-weight: 700; color: #1f2937;">${invoice.total.toFixed(2)} HTG</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 16px 24px; border-bottom: 2px solid #e5e7eb; background: white;">
                  <span style="font-size: 18px; color: #4b5563; font-weight: 500;">Remise:</span>
                  <span style="font-size: 18px; font-weight: 700; color: #1f2937;">0.00 HTG</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 16px 24px; border-bottom: 2px solid #e5e7eb; background: white;">
                  <span style="font-size: 18px; color: #4b5563; font-weight: 500;">TVA (0%):</span>
                  <span style="font-size: 18px; font-weight: 700; color: #1f2937;">0.00 HTG</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 20px 30px; background: linear-gradient(135deg, #fdf2f8, #fce7f3); border-radius: 12px; margin-top: 16px; border: 1px solid #fbcfe8;">
                  <span style="font-size: 22px; font-weight: 800; color: #9d174d;">TOTAL À PAYER:</span>
                  <span style="font-size: 28px; font-weight: 800; color: #9d174d;">${invoice.total.toFixed(2)} HTG</span>
                </div>
              </div>
            </div>

            <!-- Mode de paiement et informations supplémentaires -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
              <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
                <h4 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0 0 15px 0;">Mode de paiement</h4>
                <p style="font-size: 18px; color: #374151; margin: 8px 0; display: flex; align-items: center; gap: 10px;">
                  <span style="display: inline-block; width: 8px; height: 8px; background: #db2777; border-radius: 50%;"></span>
                  Espèces / Carte bancaire
                </p>
                <p style="font-size: 16px; color: #6b7280; margin: 12px 0 0 0; font-style: italic;">Paiement comptant à la livraison</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
                <h4 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0 0 15px 0;">Informations supplémentaires</h4>
                <p style="font-size: 18px; color: #374151; margin: 8px 0; display: flex; align-items: center; gap: 10px;">
                  <span style="display: inline-block; width: 8px; height: 8px; background: #db2777; border-radius: 50%;"></span>
                  Marchandise livrée en l'état
                </p>
                <p style="font-size: 18px; color: #374151; margin: 8px 0; display: flex; align-items: center; gap: 10px;">
                  <span style="display: inline-block; width: 8px; height: 8px; background: #db2777; border-radius: 50%;"></span>
                  Aucun échange ou remboursement
                </p>
              </div>
            </div>

            <!-- Conditions et signature -->
            <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 30px; border-top: 2px solid #e5e7eb;">
              <div style="max-width: 600px;">
                <p style="font-size: 18px; font-weight: 700; color: #1f2937; margin: 0 0 15px 0;">Conditions générales :</p>
                <p style="font-size: 15px; color: #6b7280; line-height: 1.8; margin: 0; font-style: italic;">
                  Cette facture est payable à réception. Tout retard de paiement entraînera des pénalités 
                  conformément à la législation en vigueur. Merci de votre confiance.
                </p>
              </div>
              <div style="text-align: center;">
                <p style="font-size: 18px; color: #374151; font-weight: 600; margin: 0 0 15px 0;">Cachet et signature :</p>
                <div style="border-bottom: 3px solid #9ca3af; width: 250px; margin-bottom: 12px;"></div>
                <p style="font-size: 16px; color: #4b5563; margin: 12px 0 4px 0; font-weight: 600;">Pour KG Pâtisserie</p>
                <p style="font-size: 15px; color: #6b7280; margin: 0;">${invoice.date}</p>
              </div>
            </div>
            
            <!-- Pied de page -->
            <div style="margin-top: 50px; text-align: center; padding-top: 30px; border-top: 2px solid #e5e7eb;">
              <p style="font-size: 15px; color: #6b7280; margin: 0 0 8px 0; font-weight: 500;">KG Pâtisserie - Saint-Marc, Ruelle Désir - Tél: +509 1234 5678 - Email: kentiagede@gmail.com</p>
              <p style="font-size: 14px; color: #9ca3af; margin: 8px 0 0 0;">NIF: 123-456-789-0 | RCCM: SA-2024-001234</p>
              <p style="font-size: 13px; color: #d1d5db; margin-top: 20px;">Document généré automatiquement - Merci de votre visite !</p>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const generateAndDownloadPDF = () => {
    if (cart.length === 0) {
      alert('Panier vide');
      return;
    }

    const invoiceNumber = 'INV-' + Date.now().toString().slice(-8);
    const invoice = {
      number: invoiceNumber,
      date: new Date().toLocaleDateString('fr-FR'),
      time: new Date().toLocaleTimeString('fr-FR'),
      items: [...cart],
      total: getTotalAmount()
    };
    
    import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
      .then(() => import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'))
      .then(() => {
        const invoiceHTML = generateInvoiceHTML(invoice);
        
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
        
        setTimeout(() => {
          window.html2canvas(iframe.contentDocument.body, { 
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            allowTaint: true,
            useCORS: true,
            windowWidth: 1200,
            windowHeight: 1600
          }).then(canvas => {
            document.body.removeChild(iframe);
            
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('l', 'mm', 'a4');
            const imgWidth = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`facture-${invoice.number}.pdf`);
            
            // Vider le panier après génération
            setCart([]);
          });
        }, 500);
      });
  };

  const generateAndDownloadImage = () => {
    if (cart.length === 0) {
      alert('Panier vide');
      return;
    }

    const invoiceNumber = 'INV-' + Date.now().toString().slice(-8);
    const invoice = {
      number: invoiceNumber,
      date: new Date().toLocaleDateString('fr-FR'),
      time: new Date().toLocaleTimeString('fr-FR'),
      items: [...cart],
      total: getTotalAmount()
    };
    
    import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
      .then(() => {
        const invoiceHTML = generateInvoiceHTML(invoice);
        
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
        
        setTimeout(() => {
          window.html2canvas(iframe.contentDocument.body, { 
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            allowTaint: true,
            useCORS: true,
            windowWidth: 1200,
            windowHeight: 1600
          }).then(canvas => {
            document.body.removeChild(iframe);
            
            const link = document.createElement('a');
            link.download = `facture-${invoice.number}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
            
            // Vider le panier après génération
            setCart([]);
          });
        }, 500);
      });
  };

  const NavItem = ({ icon: Icon, label, tab }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setMenuOpen(false);
      }}
      className={`flex items-center gap-3 w-full px-4 py-3 transition-colors ${
        activeTab === tab 
          ? 'bg-pink-100 text-pink-700 border-l-4 border-pink-600' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-lg sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-pink-700 rounded-lg transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="text-center flex-1">
            <h1 className="text-xl font-bold">KG Pâtisserie</h1>
            <p className="text-xs text-pink-100">Saint-Marc, Ruelle Désir</p>
          </div>
          <div className="relative">
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className={`fixed left-0 top-0 bottom-0 w-64 bg-white shadow-2xl transform transition-transform ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-pink-600 to-pink-500 text-white p-6">
            <h2 className="text-2xl font-bold">KG Pâtisserie</h2>
            <p className="text-sm text-pink-100 mt-1">Système de Caisse</p>
          </div>
          <nav className="py-4">
            <NavItem icon={Home} label="Vente" tab="vente" />
            <NavItem icon={Package} label="Produits" tab="produits" />
            <NavItem icon={Receipt} label="Factures" tab="factures" />
            <NavItem icon={Settings} label="Paramètres" tab="parametres" />
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Products Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'vente' && (
            <>
              {/* Sélecteur de Saveur */}
              <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
                <label className="block text-lg font-bold text-gray-800 mb-3">
                  🍦 Choisir une Saveur
                </label>
                <select
                  value={selectedFlavor}
                  onChange={(e) => setSelectedFlavor(e.target.value)}
                  className="w-full p-4 text-lg border-2 border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white"
                >
                  <option value="">-- Sélectionner une saveur --</option>
                  {flavors.map(flavor => (
                    <option key={flavor.id} value={flavor.id}>
                      {flavor.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Formats de Glace */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                  <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                    Formats Disponibles
                  </span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {products.map(product => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      disabled={!selectedFlavor}
                      className={`bg-white p-4 rounded-lg shadow-md transition-all active:scale-95 border-2 ${
                        selectedFlavor 
                          ? 'hover:shadow-lg border-transparent hover:border-pink-300' 
                          : 'opacity-50 cursor-not-allowed border-gray-200'
                      }`}
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <span className="text-3xl">🍦</span>
                        </div>
                        <p className="font-semibold text-gray-800 text-sm mb-1">{product.name}</p>
                        <p className="text-pink-600 font-bold text-lg">{product.price} HTG</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {!selectedFlavor && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <p className="text-yellow-800 font-medium">
                    ⚠️ Veuillez sélectionner une saveur pour ajouter au panier
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === 'produits' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🍦 Saveurs Disponibles</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {flavors.map(flavor => (
                    <div key={flavor.id} className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg text-center border-2 border-pink-200">
                      <p className="font-semibold text-gray-800">{flavor.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📦 Formats & Prix</h2>
                <div className="space-y-2">
                  {products.map(product => (
                    <div key={product.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🍦</span>
                        <p className="font-semibold text-gray-800">{product.name}</p>
                      </div>
                      <p className="font-bold text-pink-600 text-lg">{product.price} HTG</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'factures' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Historique des Factures</h2>
              <p className="text-gray-600">Aucune facture enregistrée pour le moment</p>
            </div>
          )}

          {activeTab === 'parametres' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Paramètres</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de l'entreprise</label>
                  <input type="text" value="KG Pâtisserie" className="w-full p-3 border rounded-lg" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse</label>
                  <input type="text" value="Saint-Marc, Ruelle Désir" className="w-full p-3 border rounded-lg" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input type="email" value="kentiagede@gmail.com" className="w-full p-3 border rounded-lg" readOnly />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        {activeTab === 'vente' && (
          <div className="lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Panier</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <ShoppingCart size={48} className="mx-auto mb-3 opacity-30" />
                  <p>Panier vide</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.price} HTG</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center hover:bg-pink-200"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center hover:bg-pink-200"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <p className="font-bold text-pink-600">{item.price * item.quantity} HTG</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t bg-gray-50 space-y-3">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total</span>
                  <span className="text-pink-600">{getTotalAmount()} HTG</span>
                </div>
                
                {/* Boutons de génération de facture */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={generateAndDownloadImage}
                    className="bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
                  >
                    <Download size={18} />
                    Télécharger PNG
                  </button>
                  <button
                    onClick={generateAndDownloadPDF}
                    className="bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
                  >
                    <Download size={18} />
                    Télécharger PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KGPattisseriePOS;