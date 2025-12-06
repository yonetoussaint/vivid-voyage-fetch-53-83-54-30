import React, { useState } from 'react';
import { Search, Mail, Phone, MapPin, Calendar, ShoppingBag } from 'lucide-react';

const SellerCustomers = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [filterTier, setFilterTier] = useState('all');
  const [sortBy, setSortBy] = useState('spent');

  const customers = [
    { 
      id: 1, 
      name: 'Sophia Anderson', 
      email: 'sophia.anderson@email.com', 
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
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
      location: 'Los Angeles, CA',
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
      location: 'San Francisco, CA',
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
      location: 'Miami, FL',
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
      location: 'Chicago, IL',
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
      location: 'Boston, MA',
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
      location: 'Seattle, WA',
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
      location: 'Austin, TX',
      spent: 3890, 
      visits: 7, 
      tier: 'Regular',
      lastVisit: '2024-11-18',
      orders: 4
    },
  ];

  const filtered = customers
    .filter(c => filterTier === 'all' || c.tier === filterTier)
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'spent') return b.spent - a.spent;
      if (sortBy === 'visits') return b.visits - a.visits;
      return 0;
    });

  const getTierColor = (tier) => {
    switch(tier) {
      case 'VIP': return 'text-amber-600 bg-amber-50 border border-amber-200';
      case 'Premium': return 'text-slate-600 bg-slate-50 border border-slate-200';
      default: return 'text-slate-400 bg-slate-50 border border-slate-200';
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
    <div className="min-h-screen bg-white p-4">
      {/* Simple Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-light text-slate-900 mb-2">Customers</h1>
        <p className="text-slate-500 text-sm">{filtered.length} of {customers.length} customers</p>
      </div>

      {/* Search & Filters - Clean */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300"
          />
        </div>
        
        <div className="flex gap-3">
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300 cursor-pointer"
          >
            <option value="all">All Tiers</option>
            <option value="VIP">VIP</option>
            <option value="Premium">Premium</option>
            <option value="Regular">Regular</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300 cursor-pointer"
          >
            <option value="spent">Sort by Spent</option>
            <option value="name">Sort by Name</option>
            <option value="visits">Sort by Visits</option>
          </select>
        </div>
      </div>

      {/* Ultra Clean Customer List */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {filtered.map((customer, idx) => (
          <div key={customer.id}>
            {/* Customer Row - Click to expand */}
            <div
              onClick={() => setSelected(selected === customer.id ? null : customer.id)}
              className={`px-4 py-4 cursor-pointer transition-all ${
                idx !== 0 ? 'border-t border-slate-100' : ''
              } ${
                selected === customer.id ? 'bg-slate-50' : 'hover:bg-slate-50/50'
              }`}
            >
              {/* Mobile Layout */}
              <div className="md:hidden">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-slate-900 font-medium text-sm">{customer.name}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${getTierColor(customer.tier)}`}>
                        {customer.tier}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm">
                    <ShoppingBag size={14} className="text-slate-400" />
                    <span className="text-slate-900 font-medium">{customer.orders}</span>
                    <span className="text-slate-400 mx-1">·</span>
                    <span className="text-slate-900 font-medium">{formatCurrency(customer.spent)}</span>
                  </div>
                  <span className="text-xs text-slate-400">{formatDate(customer.lastVisit)}</span>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex items-center justify-between">
                <div className="flex-1 min-w-0 max-w-md">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-slate-900 font-medium">{customer.name}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${getTierColor(customer.tier)}`}>
                      {customer.tier}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="truncate">{customer.email}</span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {customer.location.split(',')[0]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
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

            {/* Expanded Details - Clean */}
            {selected === customer.id && (
              <div className="px-4 pb-4 bg-slate-50 border-t border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                      <Phone size={14} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Phone</p>
                      <p className="text-sm text-slate-900 font-medium">{customer.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                      <MapPin size={14} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Location</p>
                      <p className="text-sm text-slate-900 font-medium">{customer.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-white transition-colors">
                    <Mail size={14} />
                    <span>Email</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-white transition-colors">
                    <Phone size={14} />
                    <span>Call</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400 font-light">
            No customers found
          </div>
        )}
      </div>

      {/* Simple Stats Row */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 mb-1">Total Customers</p>
          <p className="text-xl font-medium text-slate-900">{customers.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 mb-1">VIP Customers</p>
          <p className="text-xl font-medium text-slate-900">
            {customers.filter(c => c.tier === 'VIP').length}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 mb-1">Total Spent</p>
          <p className="text-xl font-medium text-slate-900">
            {formatCurrency(customers.reduce((sum, c) => sum + c.spent, 0))}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 mb-1">Total Orders</p>
          <p className="text-xl font-medium text-slate-900">
            {customers.reduce((sum, c) => sum + c.orders, 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerCustomers;