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
    { id: 1, name: 'Vanille' },
    { id: 2, name: 'Chocolat' },
    { id: 3, name: 'Fraise' },
    { id: 4, name: 'Mangue' },
    { id: 5, name: 'Coco' },
    { id: 6, name: 'Pistache' },
    { id: 7, name: 'Café' },
    { id: 8, name: 'Citron' },
    { id: 9, name: 'Menthe' },
    { id: 10, name: 'Caramel' },
    { id: 11, name: 'Fruits de la Passion' },
    { id: 12, name: 'Banane' },
  ];

  // Types de glace (formats)
  const products = [
    { id: 1, name: 'Petit Pot', price: 150, size: 'small' },
    { id: 2, name: 'Moyen Pot', price: 250, size: 'medium' },
    { id: 3, name: 'Grand Pot', price: 350, size: 'large' },
    { id: 4, name: 'Cornet Simple', price: 200, size: 'cone-single' },
    { id: 5, name: 'Cornet Double', price: 350, size: 'cone-double' },
    { id: 6, name: 'Coupe Glacée', price: 500, size: 'sundae' },
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
    // Utilisation de html2canvas et jsPDF pour générer le PDF
    import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
      .then(() => import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'))
      .then(() => {
        const element = invoiceRef.current;
        window.html2canvas(element, { scale: 2 }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const { jsPDF } = window.jspdf;
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgWidth = 210;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          pdf.save(`facture-${currentInvoice.number}.pdf`);
        });
      });
  };

  const downloadInvoiceAsImage = () => {
    import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
      .then(() => {
        const element = invoiceRef.current;
        window.html2canvas(element, { scale: 2 }).then(canvas => {
          const link = document.createElement('a');
          link.download = `facture-${currentInvoice.number}.png`;
          link.href = canvas.toDataURL();
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
                          <p className="text-sm text-gray-600">{item.price} HTG / {item.unit}</p>
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

      {/* Invoice Modal */}
      {showInvoice && currentInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Facture Générée</h2>
                <button
                  onClick={() => setShowInvoice(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Invoice Content */}
              <div ref={invoiceRef} className="bg-white p-8 border-2 border-gray-200 rounded-lg">
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold text-pink-600">KG Pâtisserie</h1>
                  <p className="text-sm text-gray-600 mt-1">Saint-Marc, Ruelle Désir</p>
                  <p className="text-sm text-gray-600">kentiagede@gmail.com</p>
                </div>

                <div className="border-t-2 border-b-2 border-gray-300 py-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="font-semibold">N° Facture:</p>
                      <p className="text-gray-700">{currentInvoice.number}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">Date:</p>
                      <p className="text-gray-700">{currentInvoice.date}</p>
                      <p className="text-gray-700">{currentInvoice.time}</p>
                    </div>
                  </div>
                </div>

                <table className="w-full mb-6">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-2">Article</th>
                      <th className="text-center py-2">Qté</th>
                      <th className="text-right py-2">Prix Unit.</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInvoice.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-3">{item.name}</td>
                        <td className="text-center py-3">{item.quantity}</td>
                        <td className="text-right py-3">{item.price} HTG</td>
                        <td className="text-right py-3 font-semibold">{item.price * item.quantity} HTG</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="border-t-2 border-gray-300 pt-4">
                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span>TOTAL</span>
                    <span className="text-pink-600">{currentInvoice.total} HTG</span>
                  </div>
                </div>

                <div className="text-center mt-8 text-sm text-gray-600">
                  <p>Merci pour votre visite !</p>
                  <p>À bientôt chez KG Pâtisserie</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={downloadInvoiceAsImage}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Download size={20} />
                  Image
                </button>
                <button
                  onClick={downloadInvoiceAsPDF}
                  className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  <Download size={20} />
                  PDF
                </button>
                <button
                  onClick={finalizeTransaction}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <Receipt size={20} />
                  Terminer
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
