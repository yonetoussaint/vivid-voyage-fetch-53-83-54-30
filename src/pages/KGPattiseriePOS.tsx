import React, { useState } from 'react';
import { Menu, X, ShoppingCart, Plus, Minus, Trash2, FileText, Download, Home, Package, Settings, Receipt, User, Loader, Clock, RotateCcw } from 'lucide-react';

// ==================== COMPOSANT PRINCIPAL ====================
const KGPattisseriePOS = () => {
  const [activeTab, setActiveTab] = useState('vente');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceHistory, setInvoiceHistory] = useState([]);

  const flavors = [
    { id: 1, name: 'Fraise' },
    { id: 2, name: 'Chocolat' },
    { id: 3, name: 'Vanille' },
    { id: 4, name: 'Rhum Raisin' },
    { id: 5, name: 'Fruit de la Passion' },
  ];

  const products = [
    { id: 1, name: '07 OZ', price: 300, size: 'small' },
    { id: 2, name: '16 OZ', price: 500, size: 'large' },
  ];

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

  const clearCart = () => {
    setCart([]);
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
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

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Zone principale - Produits */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'vente' && (
            <VenteTab 
              flavors={flavors}
              products={products}
              selectedFlavor={selectedFlavor}
              setSelectedFlavor={setSelectedFlavor}
              addToCart={addToCart}
            />
          )}

          {activeTab === 'produits' && (
            <ProduitsTab 
              flavors={flavors}
              products={products}
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

        {/* Panier - Flux normal */}
        {activeTab === 'vente' && (
          <CartSidebar 
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
          />
        )}
      </div>
    </div>
  );
};

// ==================== COMPOSANT HEADER ====================
const Header = ({ menuOpen, setMenuOpen, cartCount }) => (
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
  );
};

// ==================== COMPOSANT ONGLET VENTE ====================
const VenteTab = ({ flavors, products, selectedFlavor, setSelectedFlavor, addToCart }) => (
  <div className="space-y-6">
    {/* Sélecteur de Saveur */}
    <div className="bg-white p-4 rounded-lg shadow-md">
      <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="text-2xl">🍦</span>
        Choisir une Saveur
      </label>
      <select
        value={selectedFlavor}
        onChange={(e) => setSelectedFlavor(e.target.value)}
        className="w-full p-4 text-lg border-2 border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white appearance-none"
      >
        <option value="">-- Sélectionner une saveur --</option>
        {flavors.map(flavor => (
          <option key={flavor.id} value={flavor.id}>
            {flavor.name}
          </option>
        ))}
      </select>
    </div>

    {/* Formats de Glace - Empilés verticalement */}
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
        <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
          Formats Disponibles
        </span>
      </h3>
      <div className="flex flex-col space-y-3">
        {products.map(product => (
          <button
            key={product.id}
            onClick={() => addToCart(product)}
            disabled={!selectedFlavor}
            className={`w-full bg-white p-6 rounded-lg shadow-md transition-all active:scale-95 border-2 ${
              selectedFlavor 
                ? 'hover:shadow-lg border-transparent hover:border-pink-300 hover:bg-pink-50' 
                : 'opacity-50 cursor-not-allowed border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🍦</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800 text-lg mb-1">{product.name}</p>
                  <p className="text-gray-600 text-sm">Format {product.size === 'small' ? 'Petit' : 'Grand'}</p>
                </div>
              </div>
              <p className="text-pink-600 font-bold text-2xl">{product.price} HTG</p>
            </div>
          </button>
        ))}
      </div>
    </div>

    {!selectedFlavor && (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
        <p className="text-yellow-800 font-medium flex items-center gap-2">
          <span>⚠️</span>
          Veuillez sélectionner une saveur pour ajouter au panier
        </p>
      </div>
    )}
  </div>
);

// ==================== COMPOSANT ONGLET PRODUITS ====================
const ProduitsTab = ({ flavors, products }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>🍦</span> Saveurs Disponibles
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {flavors.map(flavor => (
          <div key={flavor.id} className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg text-center border-2 border-pink-200">
            <p className="font-semibold text-gray-800">{flavor.name}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>📦</span> Formats & Prix
      </h2>
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
);

// ==================== COMPOSANT ONGLET FACTURES ====================
const FacturesTab = ({ invoiceHistory, onRegenerate, isLoading }) => {
  if (invoiceHistory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📋</span> Historique des Factures
        </h2>
        <div className="text-center py-12 text-gray-400">
          <Receipt size={48} className="mx-auto mb-3 opacity-30" />
          <p>Aucune facture générée pour le moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>📋</span> Historique des Factures
      </h2>
      <div className="space-y-4">
        {invoiceHistory.map((invoice, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Receipt size={18} className="text-pink-600" />
                  <span className="font-bold text-gray-800">{invoice.number}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {invoice.date} à {invoice.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {invoice.customerName || 'Client'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {invoice.items.length} article(s)
                </div>
                <div className="mt-2 text-sm text-gray-700">
                  {invoice.items.map((item, i) => (
                    <span key={i} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs mr-2 mb-2">
                      {item.name} x{item.quantity}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <span className="font-bold text-pink-600 text-xl">{invoice.total} HTG</span>
                <button
                  onClick={() => onRegenerate(invoice)}
                  disabled={isLoading}
                  className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <RotateCcw size={14} />
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
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <span>⚙️</span> Paramètres
    </h2>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de l'entreprise</label>
        <input type="text" value="KG Pâtisserie" className="w-full p-3 border rounded-lg bg-gray-50" readOnly />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse</label>
        <input type="text" value="Saint-Marc, Ruelle Désir" className="w-full p-3 border rounded-lg bg-gray-50" readOnly />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
        <input type="email" value="kentiagede@gmail.com" className="w-full p-3 border rounded-lg bg-gray-50" readOnly />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
        <input type="text" value="+509 1234 5678" className="w-full p-3 border rounded-lg bg-gray-50" readOnly />
      </div>
    </div>
  </div>
);

// ==================== COMPOSANT PANIER ====================
// ==================== COMPOSANT PANIER ====================
const CartSidebar = ({ 
  cart, 
  customerName, 
  setCustomerName, 
  updateQuantity, 
  removeFromCart, 
  getTotalAmount, 
  clearCart, 
  isLoading, 
  setIsLoading,
  addToHistory
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
    <div className="lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col h-full relative">
      {/* En-tête du panier */}
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingCart size={20} className="text-pink-600" />
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
            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
          >
            <Trash2 size={16} />
            Vider
          </button>
        )}
      </div>

      {/* Champ nom du client */}
      <div className="p-4 bg-white border-b">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <User size={16} className="text-gray-500" />
          Nom du client
        </label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Entrez le nom du client"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
      </div>

      {/* Liste des articles - Scrollable avec hauteur calculée pour laisser place au sticky */}
      <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: cart.length > 0 ? 'calc(100vh - 450px)' : 'calc(100vh - 300px)' }}>
        {cart.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <ShoppingCart size={48} className="mx-auto mb-3 opacity-30" />
            <p>Panier vide</p>
            <p className="text-sm mt-2">Ajoutez des produits</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map(item => (
              <CartItem 
                key={item.id} 
                item={item} 
                updateQuantity={updateQuantity} 
                removeFromCart={removeFromCart} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Total et bouton d'action - Sticky en bas ABSOLU */}
      {cart.length > 0 && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600 font-medium">Sous-total</span>
              <span className="font-bold text-xl text-pink-600">{getTotalAmount()} HTG</span>
            </div>
            
            <button
              onClick={handleGenerateInvoice}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white py-4 px-4 rounded-lg font-semibold hover:from-pink-700 hover:to-pink-600 transition-all shadow-lg flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Télécharger la facture
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== COMPOSANT ARTICLE DU PANIER ====================
const CartItem = ({ item, updateQuantity, removeFromCart }) => (
  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <div className="flex-1">
        <p className="font-semibold text-gray-800">{item.name}</p>
        <p className="text-sm text-gray-600 mt-1">{item.price} HTG / unité</p>
      </div>
      <button
        onClick={() => removeFromCart(item.id)}
        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.id, -1)}
          className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors"
        >
          <Minus size={16} />
        </button>
        <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, 1)}
          className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
      <p className="font-bold text-pink-600 text-lg">
        {item.price * item.quantity} HTG
      </p>
    </div>
  </div>
);

// ==================== FONCTION DE GÉNÉRATION DE FACTURE ====================
const generateInvoiceHTML = ({ invoice, customerName }) => {
  const itemsHTML = invoice.items.map((item, index) => `
    <tr style="border-bottom: 1px solid #e5e7eb; ${index % 2 === 0 ? 'background-color: #f9fafb;' : ''}">
      <td style="padding: 16px 24px; font-size: 16px; color: #1f2937; font-family: 'Inter', Arial, sans-serif;">${item.name}</td>
      <td style="text-align: center; padding: 16px 24px; font-size: 16px; color: #4b5563; font-family: 'Inter', Arial, sans-serif;">${item.price.toFixed(2)} HTG</td>
      <td style="text-align: center; padding: 16px 24px; font-size: 16px; color: #4b5563; font-family: 'Inter', Arial, sans-serif;">${item.quantity}</td>
      <td style="text-align: right; padding: 16px 24px; font-size: 16px; font-weight: bold; color: #1f2937; font-family: 'Inter', Arial, sans-serif;">${(item.price * item.quantity).toFixed(2)} HTG</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Facture ${invoice.number}</title>
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
              <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #db2777, #be185d); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <span style="color: white; font-size: 42px; font-weight: bold;">KG</span>
              </div>
              <h1 style="font-size: 42px; font-weight: 800; color: #1f2937; margin: 0 0 10px 0;">KG Pâtisserie</h1>
              <p style="font-size: 18px; color: #4b5563; margin: 6px 0;">Saint-Marc, Ruelle Désir</p>
              <p style="font-size: 18px; color: #4b5563; margin: 6px 0;">Haïti</p>
              <p style="font-size: 18px; color: #4b5563; margin: 6px 0;">kentiagede@gmail.com</p>
              <p style="font-size: 18px; color: #4b5563; margin: 6px 0;">Tél: +509 1234 5678</p>
            </div>
            <div style="text-align: right;">
              <h2 style="font-size: 56px; font-weight: 800; color: #db2777; margin: 0 0 20px 0;">FACTURE</h2>
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

          <!-- Client -->
          <div style="margin-bottom: 40px; padding: 25px 30px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
            <h3 style="font-size: 22px; font-weight: 700; color: #1f2937; margin: 0 0 15px 0;">Facturer à :</h3>
            <p style="font-size: 18px; color: #374151; margin: 8px 0; font-weight: 600;">${customerName || 'Client'}</p>
            <p style="font-size: 18px; color: #374151; margin: 8px 0;">Saint-Marc, Haïti</p>
            <p style="font-size: 18px; color: #374151; margin: 8px 0;">client@email.com</p>
          </div>

          <!-- Tableau -->
          <table style="width: 100%; margin-bottom: 40px; border-collapse: collapse; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <thead>
              <tr style="background: linear-gradient(135deg, #db2777, #be185d);">
                <th style="text-align: left; padding: 18px 24px; font-size: 16px; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 0.5px;">Description</th>
                <th style="text-align: center; padding: 18px 24px; font-size: 16px; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 0.5px;">Prix unitaire</th>
                <th style="text-align: center; padding: 18px 24px; font-size: 16px; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 0.5px;">Quantité</th>
                <th style="text-align: right; padding: 18px 24px; font-size: 16px; font-weight: 600; color: white; text-transform: uppercase; letter-spacing: 0.5px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <!-- Totaux -->
          <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
            <div style="width: 450px;">
              <div style="display: flex; justify-content: space-between; padding: 16px 24px; border-bottom: 2px solid #e5e7eb;">
                <span style="font-size: 18px; color: #4b5563; font-weight: 500;">Sous-total:</span>
                <span style="font-size: 18px; font-weight: 700; color: #1f2937;">${invoice.total.toFixed(2)} HTG</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 16px 24px; border-bottom: 2px solid #e5e7eb;">
                <span style="font-size: 18px; color: #4b5563; font-weight: 500;">Remise:</span>
                <span style="font-size: 18px; font-weight: 700; color: #1f2937;">0.00 HTG</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 16px 24px; border-bottom: 2px solid #e5e7eb;">
                <span style="font-size: 18px; color: #4b5563; font-weight: 500;">TVA (0%):</span>
                <span style="font-size: 18px; font-weight: 700; color: #1f2937;">0.00 HTG</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 20px 30px; background: linear-gradient(135deg, #fdf2f8, #fce7f3); border-radius: 12px; margin-top: 16px; border: 1px solid #fbcfe8;">
                <span style="font-size: 22px; font-weight: 800; color: #9d174d;">TOTAL À PAYER:</span>
                <span style="font-size: 28px; font-weight: 800; color: #9d174d;">${invoice.total.toFixed(2)} HTG</span>
              </div>
            </div>
          </div>

          <!-- Informations supplémentaires -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
            <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
              <h4 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0 0 15px 0;">Mode de paiement</h4>
              <p style="font-size: 18px; color: #374151; margin: 8px 0;">💳 Espèces / Carte bancaire</p>
              <p style="font-size: 16px; color: #6b7280; margin: 12px 0 0 0;">Paiement comptant à la livraison</p>
            </div>
            <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
              <h4 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0 0 15px 0;">Informations</h4>
              <p style="font-size: 18px; color: #374151; margin: 8px 0;">✓ Marchandise livrée en l'état</p>
              <p style="font-size: 18px; color: #374151; margin: 8px 0;">✓ Aucun échange ou remboursement</p>
            </div>
          </div>

          <!-- Signature -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 30px; border-top: 2px solid #e5e7eb;">
            <div style="max-width: 600px;">
              <p style="font-size: 18px; font-weight: 700; color: #1f2937; margin: 0 0 15px 0;">Conditions générales :</p>
              <p style="font-size: 15px; color: #6b7280; line-height: 1.8;">
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
            <p style="font-size: 15px; color: #6b7280; margin: 0 0 8px 0;">KG Pâtisserie - Saint-Marc, Ruelle Désir - Tél: +509 1234 5678 - Email: kentiagede@gmail.com</p>
            <p style="font-size: 14px; color: #9ca3af; margin: 8px 0 0 0;">NIF: 123-456-789-0 | RCCM: SA-2024-001234</p>
          </div>
        </div>
      </body>
    </html>
  `;
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
  
  const link = document.createElement('a');
  link.download = `facture-${invoice.number}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
};

export default KGPattisseriePOS;