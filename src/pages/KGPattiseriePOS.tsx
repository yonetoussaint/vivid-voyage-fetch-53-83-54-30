import React, { useState, useRef } from 'react';
import { Menu, X, ShoppingCart, Plus, Minus, Trash2, FileText, Download, Share2, Home, Package, Settings, Receipt } from 'lucide-react';

const KGPattisseriePOS = () => {
  const [activeTab, setActiveTab] = useState('vente');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const invoiceRef = useRef(null);

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

  const generateInvoice = () => {
    const invoiceNumber = 'INV-' + Date.now().toString().slice(-8);
    const invoice = {
      number: invoiceNumber,
      date: new Date().toLocaleDateString('fr-FR'),
      time: new Date().toLocaleTimeString('fr-FR'),
      items: [...cart],
      total: getTotalAmount()
    };
    setCurrentInvoice(invoice);
    setShowInvoice(true);
  };

  const downloadInvoiceAsPDF = () => {
    import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
      .then(() => import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'))
      .then(() => {
        // Créer un élément temporaire pour la facture en taille réelle
        const invoiceElement = invoiceRef.current.cloneNode(true);
        invoiceElement.style.width = '1200px';
        invoiceElement.style.maxWidth = '1200px';
        invoiceElement.style.margin = '0';
        invoiceElement.style.padding = '40px';
        invoiceElement.style.backgroundColor = 'white';
        invoiceElement.style.position = 'absolute';
        invoiceElement.style.left = '-9999px';
        invoiceElement.style.top = '0';
        
        // Appliquer les styles de police en taille réelle
        const style = document.createElement('style');
        style.textContent = `
          .invoice-pc-mode {
            font-size: 16px !important;
          }
          .invoice-pc-mode h1 { font-size: 32px !important; }
          .invoice-pc-mode h2 { font-size: 28px !important; }
          .invoice-pc-mode h3 { font-size: 24px !important; }
          .invoice-pc-mode h4 { font-size: 20px !important; }
          .invoice-pc-mode table { font-size: 16px !important; }
          .invoice-pc-mode .text-sm { font-size: 14px !important; }
          .invoice-pc-mode .text-xs { font-size: 12px !important; }
          .invoice-pc-mode .text-xl { font-size: 24px !important; }
          .invoice-pc-mode .text-2xl { font-size: 28px !important; }
          .invoice-pc-mode .text-3xl { font-size: 32px !important; }
          .invoice-pc-mode .text-4xl { font-size: 36px !important; }
          .invoice-pc-mode .text-5xl { font-size: 40px !important; }
        `;
        invoiceElement.classList.add('invoice-pc-mode');
        
        document.body.appendChild(style);
        document.body.appendChild(invoiceElement);
        
        window.html2canvas(invoiceElement, { 
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          allowTaint: true,
          useCORS: true,
          windowWidth: 1200,
          windowHeight: invoiceElement.scrollHeight
        }).then(canvas => {
          // Nettoyer
          document.body.removeChild(invoiceElement);
          document.body.removeChild(style);
          
          const imgData = canvas.toDataURL('image/png');
          const { jsPDF } = window.jspdf;
          const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' pour paysage
          const imgWidth = 297; // Largeur A4 paysage
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          pdf.save(`facture-${currentInvoice.number}.pdf`);
        });
      });
  };

  const downloadInvoiceAsImage = () => {
    import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
      .then(() => {
        // Créer un élément temporaire pour la facture en taille réelle
        const invoiceElement = invoiceRef.current.cloneNode(true);
        invoiceElement.style.width = '1200px';
        invoiceElement.style.maxWidth = '1200px';
        invoiceElement.style.margin = '0';
        invoiceElement.style.padding = '40px';
        invoiceElement.style.backgroundColor = 'white';
        invoiceElement.style.position = 'absolute';
        invoiceElement.style.left = '-9999px';
        invoiceElement.style.top = '0';
        
        // Appliquer les styles de police en taille réelle
        const style = document.createElement('style');
        style.textContent = `
          .invoice-pc-mode {
            font-size: 16px !important;
          }
          .invoice-pc-mode h1 { font-size: 32px !important; }
          .invoice-pc-mode h2 { font-size: 28px !important; }
          .invoice-pc-mode h3 { font-size: 24px !important; }
          .invoice-pc-mode h4 { font-size: 20px !important; }
          .invoice-pc-mode table { font-size: 16px !important; }
          .invoice-pc-mode .text-sm { font-size: 14px !important; }
          .invoice-pc-mode .text-xs { font-size: 12px !important; }
          .invoice-pc-mode .text-xl { font-size: 24px !important; }
          .invoice-pc-mode .text-2xl { font-size: 28px !important; }
          .invoice-pc-mode .text-3xl { font-size: 32px !important; }
          .invoice-pc-mode .text-4xl { font-size: 36px !important; }
          .invoice-pc-mode .text-5xl { font-size: 40px !important; }
        `;
        invoiceElement.classList.add('invoice-pc-mode');
        
        document.body.appendChild(style);
        document.body.appendChild(invoiceElement);
        
        window.html2canvas(invoiceElement, { 
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          allowTaint: true,
          useCORS: true,
          windowWidth: 1200,
          windowHeight: invoiceElement.scrollHeight
        }).then(canvas => {
          // Nettoyer
          document.body.removeChild(invoiceElement);
          document.body.removeChild(style);
          
          const link = document.createElement('a');
          link.download = `facture-${currentInvoice.number}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        });
      });
  };

  const finalizeTransaction = () => {
    setCart([]);
    setShowInvoice(false);
    setCurrentInvoice(null);
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
                <button
                  onClick={generateInvoice}
                  className="w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white py-4 rounded-lg font-semibold hover:from-pink-700 hover:to-pink-600 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <FileText size={20} />
                  Générer Facture
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Invoice Modal - Style PC */}
      {showInvoice && currentInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-x-auto">
          <div className="bg-white rounded-lg shadow-2xl inline-block min-w-[1200px] max-w-[1400px] mx-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Facture</h2>
                <button
                  onClick={() => setShowInvoice(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Invoice Content - Taille PC fixe */}
              <div 
                ref={invoiceRef} 
                className="bg-white border border-gray-200 shadow-sm"
                style={{ 
                  width: '1200px', 
                  maxWidth: '1200px',
                  padding: '40px',
                  margin: '0 auto',
                  fontSize: '16px'
                }}
              >
                {/* En-tête avec logo et informations société */}
                <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-300">
                  <div>
                    <div className="w-24 h-24 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-3xl">KG</span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800">KG Pâtisserie</h1>
                    <p className="text-gray-600 mt-2 text-lg">Saint-Marc, Ruelle Désir</p>
                    <p className="text-gray-600 text-lg">Haïti</p>
                    <p className="text-gray-600 text-lg">kentiagede@gmail.com</p>
                    <p className="text-gray-600 text-lg">Tél: +509 1234 5678</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-5xl font-bold text-pink-600 mb-6">FACTURE</h2>
                    <div className="bg-pink-50 p-6 rounded-lg">
                      <p className="text-gray-600 mb-2 text-lg">
                        <span className="font-semibold">N° Facture:</span> {currentInvoice.number}
                      </p>
                      <p className="text-gray-600 mb-2 text-lg">
                        <span className="font-semibold">Date:</span> {currentInvoice.date}
                      </p>
                      <p className="text-gray-600 text-lg">
                        <span className="font-semibold">Heure:</span> {currentInvoice.time}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informations client */}
                <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3 text-xl">Facturer à :</h3>
                  <p className="text-gray-700 text-lg">Client</p>
                  <p className="text-gray-700 text-lg">Saint-Marc, Haïti</p>
                  <p className="text-gray-700 text-lg">client@email.com</p>
                </div>

                {/* Tableau des articles */}
                <table className="w-full mb-8 border-collapse" style={{ fontSize: '16px' }}>
                  <thead>
                    <tr className="bg-pink-600 text-white">
                      <th className="text-left py-4 px-6 font-semibold text-base">Description</th>
                      <th className="text-center py-4 px-6 font-semibold text-base">Prix unitaire</th>
                      <th className="text-center py-4 px-6 font-semibold text-base">Quantité</th>
                      <th className="text-right py-4 px-6 font-semibold text-base">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInvoice.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-4 px-6 text-base">
                          <span className="font-medium text-gray-800">{item.name}</span>
                        </td>
                        <td className="text-center py-4 px-6 text-base text-gray-700">
                          {item.price.toFixed(2)} HTG
                        </td>
                        <td className="text-center py-4 px-6 text-base text-gray-700">
                          {item.quantity}
                        </td>
                        <td className="text-right py-4 px-6 text-base font-semibold text-gray-800">
                          {(item.price * item.quantity).toFixed(2)} HTG
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totaux */}
                <div className="flex justify-end mb-8">
                  <div className="w-96">
                    <div className="space-y-3">
                      <div className="flex justify-between py-3 border-b border-gray-200">
                        <span className="font-medium text-gray-600 text-lg">Sous-total:</span>
                        <span className="font-semibold text-lg">{currentInvoice.total.toFixed(2)} HTG</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-200">
                        <span className="font-medium text-gray-600 text-lg">Remise:</span>
                        <span className="font-semibold text-lg">0.00 HTG</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-200">
                        <span className="font-medium text-gray-600 text-lg">TVA (0%):</span>
                        <span className="font-semibold text-lg">0.00 HTG</span>
                      </div>
                      <div className="flex justify-between py-4 bg-pink-50 px-6 rounded-lg">
                        <span className="font-bold text-pink-800 text-xl">TOTAL À PAYER:</span>
                        <span className="font-bold text-pink-800 text-2xl">
                          {currentInvoice.total.toFixed(2)} HTG
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mode de paiement et informations supplémentaires */}
                <div className="grid grid-cols-2 gap-8 mb-8 pt-6 border-t border-gray-300">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 text-lg">Mode de paiement</h4>
                    <p className="text-gray-700 text-base">Espèces / Carte bancaire</p>
                    <p className="text-gray-600 text-base mt-2">Paiement comptant à la livraison</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 text-lg">Informations supplémentaires</h4>
                    <p className="text-gray-700 text-base">Marchandise livrée en l'état</p>
                    <p className="text-gray-700 text-base">Aucun échange ou remboursement</p>
                  </div>
                </div>

                {/* Conditions et signature */}
                <div className="flex justify-between items-end pt-6 border-t border-gray-300">
                  <div>
                    <p className="font-semibold text-gray-800 mb-3 text-lg">Conditions générales :</p>
                    <p className="text-gray-600 text-sm max-w-lg leading-relaxed">
                      Cette facture est payable à réception. Tout retard de paiement entraînera des pénalités 
                      conformément à la législation en vigueur. Merci de votre confiance.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mb-3">
                      <p className="text-gray-700 font-medium text-base">Cachet et signature :</p>
                    </div>
                    <div className="border-b border-gray-400 w-56 mb-2"></div>
                    <p className="text-gray-500 text-sm mt-2">Pour KG Pâtisserie</p>
                    <p className="text-gray-500 text-sm">{currentInvoice.date}</p>
                  </div>
                </div>
                
                {/* Pied de page */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                  <p>KG Pâtisserie - Saint-Marc, Ruelle Désir - Tél: +509 1234 5678 - Email: kentiagede@gmail.com</p>
                  <p className="mt-2">NIF: 123-456-789-0 | RCCM: SA-2024-001234</p>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={downloadInvoiceAsImage}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-base"
                >
                  <Download size={20} />
                  Télécharger Image (PNG)
                </button>
                <button
                  onClick={downloadInvoiceAsPDF}
                  className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors text-base"
                >
                  <Download size={20} />
                  Télécharger PDF
                </button>
                <button
                  onClick={finalizeTransaction}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors text-base"
                >
                  <Receipt size={20} />
                  Terminer la vente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KGPattisseriePOS;