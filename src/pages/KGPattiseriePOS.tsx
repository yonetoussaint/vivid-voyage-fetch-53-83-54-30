import React, { useState } from 'react';
import { Menu, X, ShoppingCart, Plus, Minus, Trash2, FileText, Download, Home, Package, Settings, Receipt, User, Loader, Clock, RotateCcw, Coffee } from 'lucide-react';

// ==================== COMPOSANT PRINCIPAL ====================
const KGPattisseriePOS = () => {
  const [activeTab, setActiveTab] = useState('vente');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceHistory, setInvoiceHistory] = useState([]);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const flavors = [
    { id: 1, name: 'Fraise' },
    { id: 2, name: 'Chocolat' },
    { id: 3, name: 'Vanille' },
    { id: 4, name: 'Rhum Raisin' },
    { id: 5, name: 'Fruit de la Passion' },
  ];

  const sizes = [
    { id: 1, name: '07 OZ', price: 300 },
    { id: 2, name: '16 OZ', price: 500 },
  ];

  const addToCart = () => {
    if (!selectedFlavor || !selectedSize) {
      alert('Veuillez sélectionner une saveur et un format');
      return;
    }

    const flavor = flavors.find(f => f.id === parseInt(selectedFlavor));
    const size = sizes.find(s => s.id === parseInt(selectedSize));
    
    const cartItem = {
      id: `${selectedSize}-${selectedFlavor}-${Date.now()}`,
      name: `${size.name} - ${flavor.name}`,
      price: size.price,
      flavor: flavor.name,
      size: size.name,
      quantity: 1
    };

    setCart([...cart, cartItem]);
    setSelectedFlavor('');
    setSelectedSize('');
    setShowAddPanel(false);
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

  const clearCart = () => {
    setCart([]);
    setShowAddPanel(false);
    setSelectedFlavor('');
    setSelectedSize('');
  };

  const addToHistory = (invoice) => {
    setInvoiceHistory(prev => [invoice, ...prev]);
  };

  const regenerateInvoice = async (invoice) => {
    setIsLoading(true);
    try {
      await generateAndDownloadImage({ 
        cart: invoice.items, 
        customerName: invoice.customerName, 
        total: invoice.total 
      });
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la régénération de la facture');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen} 
        cartCount={cart.length} 
      />
      
      <SidebarMenu 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Panier - Plein écran */}
        {activeTab === 'vente' ? (
          <CartMain 
            cart={cart}
            customerName={customerName}
            setCustomerName={setCustomerName}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            getTotalAmount={getTotalAmount}
            clearCart={clearCart}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            addToHistory={addToHistory}
            showAddPanel={showAddPanel}
            setShowAddPanel={setShowAddPanel}
            selectedFlavor={selectedFlavor}
            setSelectedFlavor={setSelectedFlavor}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            addToCart={addToCart}
            flavors={flavors}
            sizes={sizes}
          />
        ) : (
          <div className="flex-1 overflow-y-auto p-2">
            {activeTab === 'produits' && (
              <ProduitsTab 
                flavors={flavors}
                sizes={sizes}
              />
            )}
            {activeTab === 'factures' && (
              <FacturesTab 
                invoiceHistory={invoiceHistory}
                onRegenerate={regenerateInvoice}
                isLoading={isLoading}
              />
            )}
            {activeTab === 'parametres' && (
              <ParametresTab />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== COMPOSANT HEADER ====================
const Header = ({ menuOpen, setMenuOpen, cartCount }) => (
  <header className="bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-sm sticky top-0 z-40">
    <div className="flex items-center justify-between px-3 py-2">
      <button 
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-1.5 hover:bg-pink-700 rounded-lg transition-colors"
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      <div className="text-center flex-1">
        <h1 className="text-lg font-bold">KG Pâtisserie</h1>
        <p className="text-xs text-pink-100">Saint-Marc, Ruelle Désir</p>
      </div>
      <div className="relative">
        <ShoppingCart size={22} />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {cartCount}
          </span>
        )}
      </div>
    </div>
  </header>
);

// ==================== COMPOSANT SIDEBAR MENU ====================
const SidebarMenu = ({ menuOpen, setMenuOpen, activeTab, setActiveTab }) => {
  const NavItem = ({ icon: Icon, label, tab }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setMenuOpen(false);
      }}
      className={`flex items-center gap-3 w-full px-4 py-2.5 transition-colors ${
        activeTab === tab 
          ? 'bg-pink-100 text-pink-700 border-l-4 border-pink-600' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon size={18} />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity ${
        menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setMenuOpen(false)}
    >
      <div
        className={`fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl transform transition-transform ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-pink-600 to-pink-500 text-white p-5">
          <h2 className="text-xl font-bold">KG Pâtisserie</h2>
          <p className="text-xs text-pink-100 mt-1">Système de Caisse</p>
        </div>
        <nav className="py-2">
          <NavItem icon={Home} label="Vente" tab="vente" />
          <NavItem icon={Package} label="Produits" tab="produits" />
          <NavItem icon={Receipt} label="Factures" tab="factures" />
          <NavItem icon={Settings} label="Paramètres" tab="parametres" />
        </nav>
      </div>
    </div>
  );
};

// ==================== COMPOSANT ONGLET PRODUITS ====================
const ProduitsTab = ({ flavors, sizes }) => (
  <div className="space-y-3">
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="text-xl">🍦</span> Saveurs
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {flavors.map(flavor => (
          <div key={flavor.id} className="bg-pink-50 p-2 rounded-lg text-center border border-pink-200">
            <p className="font-medium text-gray-800 text-sm">{flavor.name}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="text-xl">📦</span> Formats
      </h2>
      <div className="space-y-2">
        {sizes.map(size => (
          <div key={size.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍦</span>
              <p className="font-medium text-gray-800">{size.name}</p>
            </div>
            <p className="font-bold text-pink-600">{size.price} HTG</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ==================== COMPOSANT ONGLET FACTURES ====================
const FacturesTab = ({ invoiceHistory, onRegenerate, isLoading }) => {
  if (invoiceHistory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-xl">📋</span> Factures
        </h2>
        <div className="text-center py-8 text-gray-400">
          <Receipt size={40} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Aucune facture</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="text-xl">📋</span> Factures
      </h2>
      <div className="space-y-3">
        {invoiceHistory.map((invoice, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Receipt size={16} className="text-pink-600" />
                  <span className="font-bold text-gray-800 text-sm">{invoice.number}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600 mb-1">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {invoice.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {invoice.customerName || 'Client'}
                  </span>
                </div>
                <div className="mt-1">
                  {invoice.items.map((item, i) => (
                    <span key={i} className="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs mr-1 mb-1">
                      {item.name} x{item.quantity}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <span className="font-bold text-pink-600">{invoice.total} HTG</span>
                <button
                  onClick={() => onRegenerate(invoice)}
                  disabled={isLoading}
                  className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-100 text-xs"
                >
                  <RotateCcw size={12} />
                  Régénérer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== COMPOSANT ONGLET PARAMETRES ====================
const ParametresTab = () => (
  <div className="bg-white rounded-lg shadow-sm p-4">
    <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
      <span className="text-xl">⚙️</span> Paramètres
    </h2>
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Nom</label>
        <input type="text" value="KG Pâtisserie" className="w-full p-2 text-sm border rounded-lg bg-gray-50" readOnly />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Adresse</label>
        <input type="text" value="Saint-Marc, Ruelle Désir" className="w-full p-2 text-sm border rounded-lg bg-gray-50" readOnly />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
        <input type="email" value="kentiagede@gmail.com" className="w-full p-2 text-sm border rounded-lg bg-gray-50" readOnly />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Téléphone</label>
        <input type="text" value="+509 1234 5678" className="w-full p-2 text-sm border rounded-lg bg-gray-50" readOnly />
      </div>
    </div>
  </div>
);

// ==================== COMPOSANT PANIER PRINCIPAL (PLEIN ÉCRAN, FLAT) ====================
const CartMain = ({ 
  cart,
  customerName,
  setCustomerName,
  updateQuantity,
  removeFromCart,
  getTotalAmount,
  clearCart,
  isLoading,
  setIsLoading,
  addToHistory,
  showAddPanel,
  setShowAddPanel,
  selectedFlavor,
  setSelectedFlavor,
  selectedSize,
  setSelectedSize,
  addToCart,
  flavors,
  sizes
}) => {
  const handleGenerateInvoice = async () => {
    if (cart.length === 0) {
      alert('Panier vide');
      return;
    }

    setIsLoading(true);
    
    const invoiceNumber = 'INV-' + Date.now().toString().slice(-8);
    const total = getTotalAmount();
    
    const invoice = {
      number: invoiceNumber,
      date: new Date().toLocaleDateString('fr-FR'),
      time: new Date().toLocaleTimeString('fr-FR'),
      items: [...cart],
      total: total,
      customerName: customerName || 'Client'
    };

    try {
      await generateAndDownloadImage({ cart, customerName, total });
      addToHistory(invoice);
      clearCart();
      setCustomerName('');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération de la facture');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-gray-100 overflow-y-auto p-2">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-2 px-1">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <ShoppingCart size={18} className="text-pink-600" />
          Panier
          {cart.length > 0 && (
            <span className="bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </h2>
        {cart.length > 0 && (
          <button 
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 px-2 py-1.5 hover:bg-red-50 rounded-lg"
          >
            <Trash2 size={14} />
            Vider
          </button>
        )}
      </div>

      {/* Client */}
      <div className="mb-2">
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Nom du client"
          className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500 bg-white"
        />
      </div>

      {/* Liste des articles */}
      <div className="space-y-2 mb-2">
        {cart.map(item => (
          <CartItem 
            key={item.id} 
            item={item} 
            updateQuantity={updateQuantity} 
            removeFromCart={removeFromCart} 
          />
        ))}
      </div>

      {/* Carte Ajouter - Dotted Border */}
      {!showAddPanel ? (
        <button
          onClick={() => setShowAddPanel(true)}
          className="w-full border-2 border-dashed border-pink-300 bg-pink-50/50 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 hover:bg-pink-100/50 transition-colors active:scale-95 mb-2"
        >
          <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center">
            <Plus size={24} className="text-pink-600" />
          </div>
          <span className="text-pink-700 font-medium text-sm">Ajouter un article</span>
          <span className="text-pink-500 text-xs">Glace • Format • Saveur</span>
        </button>
      ) : (
        <div className="bg-white border-2 border-pink-300 rounded-xl p-4 space-y-3 shadow-sm mb-2">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <Coffee size={16} className="text-pink-600" />
              Nouvel article
            </h3>
            <button
              onClick={() => {
                setShowAddPanel(false);
                setSelectedFlavor('');
                setSelectedSize('');
              }}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <X size={16} />
            </button>
          </div>

          {/* Format */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">Format</label>
            <div className="grid grid-cols-2 gap-2">
              {sizes.map(size => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id.toString())}
                  className={`p-2.5 rounded-lg border transition-all text-sm ${
                    selectedSize === size.id.toString()
                      ? 'border-pink-600 bg-pink-50 text-pink-700'
                      : 'border-gray-200 bg-white hover:border-pink-300'
                  }`}
                >
                  <span className="font-medium">{size.name}</span>
                  <span className="block text-xs text-gray-600 mt-0.5">{size.price} HTG</span>
                </button>
              ))}
            </div>
          </div>

          {/* Saveur */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">Saveur</label>
            <div className="grid grid-cols-2 gap-2">
              {flavors.map(flavor => (
                <button
                  key={flavor.id}
                  onClick={() => setSelectedFlavor(flavor.id.toString())}
                  className={`p-2.5 rounded-lg border transition-all text-sm ${
                    selectedFlavor === flavor.id.toString()
                      ? 'border-pink-600 bg-pink-50 text-pink-700'
                      : 'border-gray-200 bg-white hover:border-pink-300'
                  }`}
                >
                  {flavor.name}
                </button>
              ))}
            </div>
          </div>

          {/* Bouton Ajouter */}
          <button
            onClick={addToCart}
            disabled={!selectedFlavor || !selectedSize}
            className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium text-sm hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            <Plus size={18} />
            Ajouter
          </button>
        </div>
      )}

      {/* Total et bouton */}
      {cart.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-3 sticky bottom-2 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 text-sm font-medium">Total</span>
            <span className="font-bold text-lg text-pink-600">{getTotalAmount()} HTG</span>
          </div>
          
          <button
            onClick={handleGenerateInvoice}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white py-3 rounded-lg font-medium text-sm hover:from-pink-700 hover:to-pink-600 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Download size={18} />
                Télécharger la facture
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

// ==================== COMPOSANT ARTICLE DU PANIER ====================
const CartItem = ({ item, updateQuantity, removeFromCart }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-3">
    <div className="flex justify-between items-start mb-2">
      <div className="flex-1">
        <p className="font-medium text-gray-800 text-sm">{item.name}</p>
        <p className="text-xs text-gray-600 mt-0.5">{item.price} HTG / unité</p>
      </div>
      <button
        onClick={() => removeFromCart(item.id)}
        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full"
      >
        <Trash2 size={16} />
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
        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, 1)}
          className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center hover:bg-pink-200"
        >
          <Plus size={16} />
        </button>
      </div>
      <p className="font-bold text-pink-600 text-base">
        {item.price * item.quantity} HTG
      </p>
    </div>
  </div>
);

// ==================== FONCTION DE GÉNÉRATION DE FACTURE ====================
const generateInvoiceHTML = ({ invoice, customerName }) => {
  const itemsHTML = invoice.items.map((item, index) => `
    <tr style="border-bottom: 1px solid #e5e7eb; ${index % 2 === 0 ? 'background-color: #f9fafb;' : ''}">
      <td style="padding: 12px 16px; font-size: 14px; color: #1f2937; font-family: 'Inter', Arial, sans-serif;">${item.name}</td>
      <td style="text-align: center; padding: 12px 16px; font-size: 14px; color: #4b5563;">${item.price.toFixed(2)} HTG</td>
      <td style="text-align: center; padding: 12px 16px; font-size: 14px; color: #4b5563;">${item.quantity}</td>
      <td style="text-align: right; padding: 12px 16px; font-size: 14px; font-weight: bold; color: #1f2937;">${(item.price * item.quantity).toFixed(2)} HTG</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Facture ${invoice.number}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { margin: 0; padding: 20px; background: white; font-family: 'Inter', Arial, sans-serif; }
      .invoice-container { max-width: 1000px; margin: 0 auto; background: white; }
    </style>
  </head>
  <body>
    <div class="invoice-container">
      <!-- En-tête simplifiée -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb;">
        <div>
          <div style="width: 60px; height: 60px; background: #db2777; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
            <span style="color: white; font-size: 24px; font-weight: bold;">KG</span>
          </div>
          <h1 style="font-size: 24px; font-weight: 700; color: #1f2937;">KG Pâtisserie</h1>
          <p style="font-size: 14px; color: #4b5563;">Saint-Marc, Haïti</p>
        </div>
        <div style="text-align: right;">
          <h2 style="font-size: 32px; font-weight: 700; color: #db2777;">FACTURE</h2>
          <div style="background: #fdf2f8; padding: 15px; border-radius: 8px; margin-top: 10px;">
            <p style="font-size: 14px; color: #4b5563;"><span style="font-weight: 700;">N°:</span> ${invoice.number}</p>
            <p style="font-size: 14px; color: #4b5563;"><span style="font-weight: 700;">Date:</span> ${invoice.date}</p>
          </div>
        </div>
      </div>

      <!-- Client -->
      <div style="margin-bottom: 30px; padding: 15px; background: #f9fafb; border-radius: 8px;">
        <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">Client</h3>
        <p style="font-size: 14px;">${customerName || 'Client'}</p>
      </div>

      <!-- Tableau -->
      <table style="width: 100%; margin-bottom: 30px; border-collapse: collapse;">
        <thead>
          <tr style="background: #db2777; color: white;">
            <th style="text-align: left; padding: 10px 12px; font-size: 13px;">Description</th>
            <th style="text-align: center; padding: 10px 12px; font-size: 13px;">Prix</th>
            <th style="text-align: center; padding: 10px 12px; font-size: 13px;">Qté</th>
            <th style="text-align: right; padding: 10px 12px; font-size: 13px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <!-- Totaux -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
        <div style="width: 300px;">
          <div style="display: flex; justify-content: space-between; padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">
            <span style="font-size: 14px;">Total</span>
            <span style="font-size: 14px; font-weight: 700;">${invoice.total.toFixed(2)} HTG</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 12px; background: #fdf2f8; border-radius: 8px; margin-top: 8px;">
            <span style="font-size: 16px; font-weight: 700; color: #9d174d;">À PAYER</span>
            <span style="font-size: 20px; font-weight: 700; color: #9d174d;">${invoice.total.toFixed(2)} HTG</span>
          </div>
        </div>
      </div>

      <!-- Signature -->
      <div style="display: flex; justify-content: space-between; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <div style="font-size: 12px; color: #6b7280;">Merci de votre confiance</div>
        <div style="text-align: center;">
          <div style="border-bottom: 2px solid #9ca3af; width: 180px; margin-bottom: 5px;"></div>
          <p style="font-size: 12px; color: #4b5563;">KG Pâtisserie</p>
        </div>
      </div>
    </div>
  </body>
</html>`;
};

const generateAndDownloadImage = async ({ cart, customerName, total }) => {
  const invoiceNumber = 'INV-' + Date.now().toString().slice(-8);
  const invoice = {
    number: invoiceNumber,
    date: new Date().toLocaleDateString('fr-FR'),
    time: new Date().toLocaleTimeString('fr-FR'),
    items: [...cart],
    total: total
  };
  
  await import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
  
  const invoiceHTML = generateInvoiceHTML({ invoice, customerName });
  
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '1000px';
  iframe.style.height = '1200px';
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
    windowWidth: 1000
  });
  
  document.body.removeChild(iframe);
  
  const link = document.createElement('a');
  link.download = `facture-${invoice.number}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
};

export default KGPattisseriePOS;