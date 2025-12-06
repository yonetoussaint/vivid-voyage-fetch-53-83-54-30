import React, { useState } from 'react';
import { Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';

const SellerCustomers = () => {
  const [selected, setSelected] = useState(null);

  const customers = [
    { 
      id: 1, 
      name: 'Sophia Anderson', 
      email: 'sophia.anderson@email.com', 
      phone: '+1 (555) 123-4567',
      location: 'New York',
      spent: 12450, 
      visits: 24, 
      tier: 'VIP',
      lastVisit: '2024-12-01',
      orders: 12
    },
    { 
      id: 2, 
      name: 'Emma Richardson', 
      email: 'emma.r@email.com', 
      phone: '+1 (555) 234-5678',
      location: 'Los Angeles',
      spent: 8920, 
      visits: 18, 
      tier: 'Premium',
      lastVisit: '2024-11-28',
      orders: 8
    },
    { 
      id: 3, 
      name: 'Olivia Chen', 
      email: 'olivia.chen@email.com', 
      phone: '+1 (555) 345-6789',
      location: 'San Francisco',
      spent: 15680, 
      visits: 31, 
      tier: 'VIP',
      lastVisit: '2024-12-03',
      orders: 15
    },
    { 
      id: 4, 
      name: 'Isabella Martinez', 
      email: 'isabella.m@email.com', 
      phone: '+1 (555) 456-7890',
      location: 'Miami',
      spent: 6340, 
      visits: 12, 
      tier: 'Premium',
      lastVisit: '2024-11-25',
      orders: 6
    },
    { 
      id: 5, 
      name: 'Ava Thompson', 
      email: 'ava.thompson@email.com', 
      phone: '+1 (555) 567-8901',
      location: 'Chicago',
      spent: 4210, 
      visits: 9, 
      tier: 'Regular',
      lastVisit: '2024-11-20',
      orders: 3
    },
    { 
      id: 6, 
      name: 'Charlotte Davies', 
      email: 'charlotte.d@email.com', 
      phone: '+1 (555) 678-9012',
      location: 'Boston',
      spent: 19850, 
      visits: 42, 
      tier: 'VIP',
      lastVisit: '2024-12-04',
      orders: 20
    },
    { 
      id: 7, 
      name: 'Amelia Wilson', 
      email: 'amelia.w@email.com', 
      phone: '+1 (555) 789-0123',
      location: 'Seattle',
      spent: 7530, 
      visits: 15, 
      tier: 'Premium',
      lastVisit: '2024-11-30',
      orders: 7
    },
    { 
      id: 8, 
      name: 'Mia Johnson', 
      email: 'mia.johnson@email.com', 
      phone: '+1 (555) 890-1234',
      location: 'Austin',
      spent: 3890, 
      visits: 7, 
      tier: 'Regular',
      lastVisit: '2024-11-18',
      orders: 4
    },
  ];

  const getTierColor = (tier) => {
    switch(tier) {
      case 'VIP': return 'text-amber-600';
      case 'Premium': return 'text-slate-600';
      default: return 'text-slate-400';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    }).replace(/, (\d{4})$/, ' $1');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Ultra Clean Header */}
      <div className="px-4 py-6">
        <h1 className="text-2xl font-light text-slate-900">Customers</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your customers</p>
      </div>

      {/* Edge-to-edge Clean List */}
      <div className="px-0">
        {customers.map((customer, idx) => (
          <div key={customer.id}>
            {/* Customer Row - Click to expand */}
            <div
              onClick={() => setSelected(selected === customer.id ? null : customer.id)}
              className={`px-4 py-4 cursor-pointer transition-colors ${
                selected === customer.id ? 'bg-slate-50' : 'hover:bg-slate-50'
              }`}
            >
              {/* Mobile Layout */}
              <div className="md:hidden">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-slate-900 font-medium text-base">{customer.name}</h3>
                      <span className={`text-xs font-medium ${getTierColor(customer.tier)}`}>
                        {customer.tier}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 truncate mb-2">{customer.email}</p>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <ShoppingBag size={14} className="text-slate-400" />
                        <span className="text-slate-900 font-medium">{customer.orders}</span>
                      </div>
                      <div className="text-slate-900 font-medium">
                        {formatCurrency(customer.spent)}
                      </div>
                      <div className="text-xs text-slate-400">
                        {formatDate(customer.lastVisit)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex items-center justify-between">
                <div className="flex-1 min-w-0 max-w-md">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-slate-900 font-medium text-base">{customer.name}</h3>
                    <span className={`text-xs font-medium ${getTierColor(customer.tier)}`}>
                      {customer.tier}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="truncate">{customer.email}</span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {customer.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <ShoppingBag size={14} className="text-slate-400" />
                      <p className="text-slate-900 font-medium">{customer.orders}</p>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">orders</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-slate-900 font-medium">{formatCurrency(customer.spent)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">total</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-slate-900 font-medium">{customer.visits}</p>
                    <p className="text-xs text-slate-400 mt-0.5">visits</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-slate-900 font-medium">{formatDate(customer.lastVisit)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">last visit</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple Divider */}
            {idx < customers.length - 1 && (
              <div className="h-px bg-slate-100" />
            )}

            {/* Expanded Details - Clean */}
            {selected === customer.id && (
              <div className="px-4 py-4 bg-slate-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Phone size={16} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Phone</p>
                      <p className="text-sm text-slate-900 font-medium">{customer.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <MapPin size={16} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Location</p>
                      <p className="text-sm text-slate-900 font-medium">{customer.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors">
                    <Mail size={14} />
                    <span>Email</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors">
                    <Phone size={14} />
                    <span>Call</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Simple Footer Info */}
      <div className="px-4 py-6 mt-6">
        <div className="text-sm text-slate-500">
          Showing {customers.length} customers
        </div>
      </div>
    </div>
  );
};

export default SellerCustomers;