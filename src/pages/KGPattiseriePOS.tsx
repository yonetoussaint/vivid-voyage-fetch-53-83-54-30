import React, { useState } from 'react';
import { Menu, X, ShoppingCart, Plus, Minus, Trash2, Download, Home, Package, Settings, Receipt, User, Loader, Clock, RotateCcw, Search, Store, Check } from 'lucide-react';

// ==================== COMPOSANT PRINCIPAL ====================
const KGPattisseriePOS = () => {
  const [activeTab, setActiveTab] = useState('vente');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceHistory, setInvoiceHistory] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [addingToCart, setAddingToCart] = useState(null);

  const products = [
    { id: 1, name: '07 OZ - Fraise', price: 300, image: '🍓', category: '07 OZ', flavor: 'Fraise' },
    { id: 2, name: '07 OZ - Chocolat', price: 300, image: '🍫', category: '07 OZ', flavor: 'Chocolat' },
    { id: 3, name: '07 OZ - Vanille', price: 300, image: '🍦', category: '07 OZ', flavor: 'Vanille' },
    { id: 4, name: '07 OZ - Rhum Raisin', price: 300, image: '🍇', category: '07 OZ', flavor: 'Rhum Raisin' },
    { id: 5, name: '07 OZ - Fruit de la Passion', price: 300, image: '💛', category: '07 OZ', flavor: 'Fruit de la Passion' },
    { id: 6, name: '16 OZ - Fraise', price: 500, image: '🍓', category: '16 OZ', flavor: 'Fraise' },
    { id: 7, name: '16 OZ - Chocolat', price: 500, image: '🍫', category: '16 OZ', flavor: 'Chocolat' },
    { id: 8, name: '16 OZ - Vanille', price: 500, image: '🍦', category: '16 OZ', flavor: 'Vanille' },
    { id: 9, name: '16 OZ - Rhum Raisin', price: 500, image: '🍇', category: '16 OZ', flavor: 'Rhum Raisin' },
    { id: 10, name: '16 OZ - Fruit de la Passion', price: 500, image: '💛', category: '16 OZ', flavor: 'Fruit de la Passion' },
  ];

  const categories = ['07 OZ', '16 OZ'];

  const addToCart = async (product) => {
    setAddingToCart(product.id);
    
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (!existingItem) {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    setAddingToCart(null);
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

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
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

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.flavor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen} 
        cartCount={getTotalItems()}
        onCartClick={() => setShowCart(true)}
      />
      
      <SidebarMenu 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <div className="flex-1 overflow-hidden">
        {activeTab === 'vente' ? (
          <>
            {/* Store View - Style Uber Eats */}
            <StoreView 
              products={filteredProducts}
              categories={categories}
              addToCart={addToCart}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              cartCount={getTotalItems()}
              onCartClick={() => setShowCart(true)}
              cart={cart}
              addingToCart={addingToCart}
            />

            {/* Cart Drawer */}
            <CartDrawer 
              isOpen={showCart}
              onClose={() => setShowCart(false)}
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
          </>
        ) : (
          <div className="h-full overflow-y-auto p-3">
            {activeTab === 'produits' && (
              <ProductsTab products={products} />
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

// ==================== COMPOSANT STORE VIEW (UBER EATS STYLE) ====================
const StoreView = ({ products, categories, addToCart, searchTerm, setSearchTerm, cartCount, onCartClick, cart, addingToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredByCategory = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Store Header - sticky en haut */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center gap-2 mb-3">
          <Store size={24} className="text-pink-600" />
          <h1 className="text-xl font-bold text-gray-800">KG Pâtisserie</h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une glace..."
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories - sticky en haut aussi */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 sticky top-[88px] z-20">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                selectedCategory === category
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid - avec padding bottom pour le panier fixed */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 pb-28">
          <div className="grid grid-cols-2 gap-3">
            {filteredByCategory.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                addToCart={addToCart} 
                isInCart={isInCart(product.id)}
                isLoading={addingToCart === product.id}
              />
            ))}
          </div>
          
          {filteredByCategory.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">😢</div>
              <p className="text-gray-500 text-center">Aucun produit trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Bar - Fixed Bottom */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="p-3">
            <button
              onClick={onCartClick}
              className="w-full bg-pink-600 text-white py-4 rounded-xl font-bold flex items-center justify-between px-6 hover:bg-pink-700 transition-colors shadow-md"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={24} />
                <span className="text-lg">{cartCount} article{cartCount > 1 ? 's' : ''}</span>
              </div>
              <span className="text-lg">Voir le panier →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== COMPOSANT PRODUCT CARD ====================
// ==================== COMPOSANT PRODUCT CARD ====================
const ProductCard = ({ product, addToCart, isInCart, isLoading }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden border ${
      isInCart ? 'border-pink-400 border-2' : 'border-gray-200'
    } hover:shadow-md transition-shadow`}>
      <div className="aspect-square bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center relative">
        <span className="text-6xl">{product.image}</span>
        <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-bold text-pink-600 border border-pink-200">
          {product.category}
        </span>
        {isInCart && (
          <span className="absolute bottom-2 left-2 bg-pink-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
            <Check size={12} />
            Dans le panier
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
          {product.flavor}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-pink-600 text-lg">{product.price} HTG</span>
          {isInCart ? (
            <div className="bg-green-100 text-green-700 p-2 rounded-full w-10 h-10 flex items-center justify-center">
              <Check size={20} />
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              disabled={isLoading}
              className="bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition-colors flex items-center justify-center w-10 h-10 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                <Plus size={20} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== COMPOSANT CART DRAWER ====================
// ==================== COMPOSANT CART DRAWER ====================
const CartDrawer = ({ 
  isOpen, 
  onClose, 
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
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleGenerateInvoice = async (action = 'download') => {
    if (cart.length === 0) {
      alert('Panier vide');
      return;
    }

    if (action === 'download') {
      setIsDownloading(true);
    } else {
      setIsSharing(true);
    }

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
      const imageBlob = await generateImageBlob({ cart, customerName, total });

      if (action === 'download') {
        // Téléchargement direct
        const link = document.createElement('a');
        link.download = `facture-${invoice.number}.png`;
        link.href = URL.createObjectURL(imageBlob);
        link.click();
        URL.revokeObjectURL(link.href);
      } else {
        // Partage natif
        const file = new File([imageBlob], `facture-${invoice.number}.png`, { type: 'image/png' });

        if (navigator.share) {
          await navigator.share({
            title: `Facture ${invoice.number}`,
            text: `Facture KG Pâtisserie - ${customerName || 'Client'} - Total: ${total} HTG`,
            files: [file]
          });
        } else {
          // Fallback pour les navigateurs qui ne supportent pas le partage
          alert('Le partage n\'est pas supporté sur ce navigateur. Utilisez le téléchargement à la place.');
        }
      }

      addToHistory(invoice);
      clearCart();
      setCustomerName('');
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      alert(`Erreur lors de la ${action === 'download' ? 'génération' : 'génération et du partage'} de la facture`);
    } finally {
      setIsDownloading(false);
      setIsSharing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform flex flex-col">
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0">
          <div className="flex items-center gap-3">
            <ShoppingCart size={24} className="text-pink-600" />
            <h2 className="text-xl font-bold text-gray-800">Votre panier</h2>
            {cart.length > 0 && (
              <span className="bg-pink-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button 
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Customer Name */}
        <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <User size={16} />
            Nom du client
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Entrez le nom du client"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-base bg-white"
          />
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart size={64} className="mb-4 opacity-30" />
              <p className="text-lg font-medium">Votre panier est vide</p>
              <p className="text-sm mt-2">Ajoutez des produits depuis la boutique</p>
              <button
                onClick={onClose}
                className="mt-6 bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors"
              >
                Parcourir la boutique
              </button>
            </div>
          ) : (
            cart.map(item => (
              <CartItem 
                key={item.id} 
                item={item} 
                updateQuantity={updateQuantity} 
                removeFromCart={removeFromCart} 
              />
            ))
          )}
        </div>

        {/* Footer - Total & Action Buttons */}
        {cart.length > 0 && (
          <div className="px-4 py-4 border-t border-gray-200 bg-white sticky bottom-0">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700 font-medium">Total</span>
              <span className="font-bold text-2xl text-pink-600">{getTotalAmount()} HTG</span>
            </div>

            <div className="flex gap-3">
              {/* Bouton Téléchargement - Clean minimal style */}
              <button
                onClick={() => handleGenerateInvoice('download')}
                disabled={isDownloading || isSharing}
                className="bg-white border-2 border-pink-600 text-pink-600 p-3 rounded-lg hover:bg-pink-50 transition-all flex items-center justify-center w-12 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Télécharger la facture"
              >
                {isDownloading ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  <Download size={20} />
                )}
              </button>

              {/* Bouton Partager - Clean primary style */}
              <button
                onClick={() => handleGenerateInvoice('share')}
                disabled={isSharing || isDownloading}
                className="flex-1 bg-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSharing ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    <span>Préparation...</span>
                  </>
                ) : (
                  <>
                    <Share2 size={20} />
                    <span>Partager Facture</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};


// ==================== FONCTION DE GÉNÉRATION D'IMAGE BLOB ====================
const generateImageBlob = async ({ cart, customerName, total }) => {
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
  
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png', 1.0);
  });
};

// ==================== COMPOSANT ARTICLE DU PANIER ====================
const CartItem = ({ item, updateQuantity, removeFromCart }) => (
  <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{item.image}</span>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{item.flavor}</p>
            <p className="text-xs text-gray-500">{item.category}</p>
          </div>
        </div>
      </div>
      <button
        onClick={() => removeFromCart(item.id)}
        className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-full transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>
    <div className="flex items-center justify-between mt-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.id, -1)}
          className="w-9 h-9 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors"
        >
          <Minus size={18} />
        </button>
        <span className="w-10 text-center font-bold text-base">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, 1)}
          className="w-9 h-9 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>
      <p className="font-bold text-pink-600 text-lg">
        {item.price * item.quantity} HTG
      </p>
    </div>
  </div>
);

// ==================== COMPOSANT HEADER ====================
const Header = ({ menuOpen, setMenuOpen, cartCount, onCartClick }) => (
  <header className="bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-sm sticky top-0 z-30">
    <div className="flex items-center justify-between px-3 py-2">
      <button 
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-2 hover:bg-pink-700 rounded-lg transition-colors"
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      <div className="text-center flex-1">
        <h1 className="text-lg font-bold">KG Pâtisserie</h1>
        <p className="text-xs text-pink-100">Saint-Marc, Ruelle Désir</p>
      </div>
      <button 
        onClick={onCartClick}
        className="relative p-2 hover:bg-pink-700 rounded-lg transition-colors"
      >
        <ShoppingCart size={22} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {cartCount}
          </span>
        )}
      </button>
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
      <Icon size={18} />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
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
const ProductsTab = ({ products }) => (
  <div className="bg-white rounded-lg shadow-sm p-4">
    <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
      <span className="text-xl">🍦</span> Tous les produits
    </h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {products.map(product => (
        <div key={product.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">{product.image}</span>
            <div>
              <p className="font-medium text-gray-800 text-sm">{product.flavor}</p>
              <p className="text-xs text-gray-500">{product.category}</p>
            </div>
          </div>
          <p className="font-bold text-pink-600 text-right">{product.price} HTG</p>
        </div>
      ))}
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
                    {invoice.date} à {invoice.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {invoice.customerName || 'Client'}
                  </span>
                </div>
                <div className="mt-1">
                  {invoice.items.map((item, i) => (
                    <span key={i} className="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs mr-1 mb-1">
                      {item.flavor} x{item.quantity}
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

// ==================== FONCTION DE GÉNÉRATION DE FACTURE (VERSION ORIGINALE) ====================
const generateInvoiceHTML = ({ invoice, customerName }) => {
  const itemsHTML = invoice.items.map((item, index) => `
    <tr style="border-bottom: 1px solid #e5e7eb; ${index % 2 === 0 ? 'background-color: #f9fafb;' : ''}">
      <td style="padding: 16px 24px; font-size: 16px; color: #1f2937; font-family: 'Inter', Arial, sans-serif;">${item.name}</td>
      <td style="text-align: center; padding: 16px 24px; font-size: 16px; color: #4b5563; font-family: 'Inter', Arial, sans-serif;">${item.price.toFixed(2)} HTG</td>
      <td style="text-align: center; padding: 16px 24px; font-size: 16px; color: #4b5563; font-family: 'Inter', Arial, sans-serif;">${item.quantity}</td>
      <td style="text-align: right; padding: 16px 24px; font-size: 16px; font-weight: bold; color: #1f2937; font-family: 'Inter', Arial, sans-serif;">${(item.price * item.quantity).toFixed(2)} HTG</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
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

      <!-- Mode de paiement et informations supplémentaires -->
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

      <!-- Conditions et signature -->
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