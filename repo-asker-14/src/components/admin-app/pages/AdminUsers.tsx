
import React, { useState } from 'react';
import { 
  Search, Filter, MoreHorizontal, Mail, Phone, 
  MapPin, Star, ShoppingBag, Calendar, Eye, Plus,
  Shield, AlertTriangle, Ban, CheckCircle, Clock,
  UserCheck, Settings, MessageSquare, Flag, Users,
  TrendingUp, UserX, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  location: string;
  role: 'Customer' | 'Seller' | 'Admin';
  status: 'Active' | 'Suspended' | 'Banned' | 'Pending';
  securityStatus: 'Normal' | 'Flagged' | 'Under Review' | 'High Risk';
  totalOrders: number;
  totalSpent: number;
  lastActivity: string;
  joinDate: string;
  isVerified: boolean;
  reportsCount: number;
}

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [securityFilter, setSecurityFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 123-4567',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e1b4?w=150&h=150&fit=crop&crop=face',
      location: 'New York, NY',
      role: 'Customer',
      status: 'Active',
      securityStatus: 'Normal',
      totalOrders: 12,
      totalSpent: 1249.99,
      lastActivity: '2 hours ago',
      joinDate: '2023-06-15',
      isVerified: true,
      reportsCount: 0
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@example.com',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      location: 'Los Angeles, CA',
      role: 'Seller',
      status: 'Active',
      securityStatus: 'Normal',
      totalOrders: 0,
      totalSpent: 0,
      lastActivity: '5 minutes ago',
      joinDate: '2023-08-22',
      isVerified: true,
      reportsCount: 0
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma@example.com',
      phone: '+1 (555) 345-6789',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      location: 'Chicago, IL',
      role: 'Customer',
      status: 'Active',
      securityStatus: 'Flagged',
      totalOrders: 15,
      totalSpent: 2199.75,
      lastActivity: '1 day ago',
      joinDate: '2023-03-10',
      isVerified: true,
      reportsCount: 2
    },
    {
      id: '4',
      name: 'Alex Kim',
      email: 'alex@example.com',
      phone: '+1 (555) 456-7890',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      location: 'Houston, TX',
      role: 'Seller',
      status: 'Pending',
      securityStatus: 'Under Review',
      totalOrders: 0,
      totalSpent: 0,
      lastActivity: '3 hours ago',
      joinDate: '2024-01-05',
      isVerified: false,
      reportsCount: 0
    },
    {
      id: '5',
      name: 'Lisa Wang',
      email: 'lisa@example.com',
      phone: '+1 (555) 567-8901',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
      location: 'Miami, FL',
      role: 'Customer',
      status: 'Suspended',
      securityStatus: 'High Risk',
      totalOrders: 6,
      totalSpent: 649.94,
      lastActivity: '2 weeks ago',
      joinDate: '2023-07-08',
      isVerified: true,
      reportsCount: 5
    },
    {
      id: '6',
      name: 'John Admin',
      email: 'john@admin.com',
      phone: '+1 (555) 999-0000',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      location: 'San Francisco, CA',
      role: 'Admin',
      status: 'Active',
      securityStatus: 'Normal',
      totalOrders: 0,
      totalSpent: 0,
      lastActivity: '10 minutes ago',
      joinDate: '2022-01-01',
      isVerified: true,
      reportsCount: 0
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Suspended': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Banned': return 'bg-red-50 text-red-700 border-red-200';
      case 'Pending': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Seller': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Customer': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getSecurityColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'text-emerald-600';
      case 'Flagged': return 'text-orange-600';
      case 'Under Review': return 'text-blue-600';
      case 'High Risk': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSecurityIcon = (status: string) => {
    switch (status) {
      case 'Normal': return <CheckCircle className="w-4 h-4" />;
      case 'Flagged': return <AlertTriangle className="w-4 h-4" />;
      case 'Under Review': return <Clock className="w-4 h-4" />;
      case 'High Risk': return <Ban className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const filteredAndSortedUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesSecurity = securityFilter === 'all' || user.securityStatus === securityFilter;
      return matchesSearch && matchesRole && matchesStatus && matchesSecurity;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'joinDate': return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        case 'totalSpent': return b.totalSpent - a.totalSpent;
        case 'reportsCount': return b.reportsCount - a.reportsCount;
        default: return 0;
      }
    });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'Active').length,
    customers: users.filter(u => u.role === 'Customer').length,
    sellers: users.filter(u => u.role === 'Seller').length,
    flagged: users.filter(u => u.securityStatus !== 'Normal').length,
    unverified: users.filter(u => !u.isVerified).length
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for users:`, Array.from(selectedUsers));
    setSelectedUsers(new Set());
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage and monitor all platform users
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Total Users</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Activity className="w-8 h-8 text-emerald-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-emerald-600">Active</p>
                    <p className="text-2xl font-bold text-emerald-900">{stats.active}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <ShoppingBag className="w-8 h-8 text-gray-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.customers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Sellers</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.sellers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-orange-600">Flagged</p>
                    <p className="text-2xl font-bold text-orange-900">{stats.flagged}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <UserX className="w-8 h-8 text-yellow-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-600">Unverified</p>
                    <p className="text-2xl font-bold text-yellow-900">{stats.unverified}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:w-auto border-gray-300"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48 border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="joinDate">Sort by Join Date</SelectItem>
                <SelectItem value="totalSpent">Sort by Total Spent</SelectItem>
                <SelectItem value="reportsCount">Sort by Reports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Customer">Customers</SelectItem>
                  <SelectItem value="Seller">Sellers</SelectItem>
                  <SelectItem value="Admin">Admins</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Banned">Banned</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={securityFilter} onValueChange={setSecurityFilter}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Filter by Security" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Security Levels</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Flagged">Flagged</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="High Risk">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Bulk Actions */}
          {selectedUsers.size > 0 && (
            <div className="mt-4 flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-sm font-medium text-red-800">
                {selectedUsers.size} users selected
              </span>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkAction('suspend')}
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  Suspend
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkAction('verify')}
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  Verify
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setSelectedUsers(new Set())}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Users List */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {filteredAndSortedUsers.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <div className="flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user.id)}
                        onChange={() => {
                          const newSelected = new Set(selectedUsers);
                          if (newSelected.has(user.id)) {
                            newSelected.delete(user.id);
                          } else {
                            newSelected.add(user.id);
                          }
                          setSelectedUsers(newSelected);
                        }}
                        disabled={user.role === 'Admin'}
                        className={`w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 ${
                          user.role === 'Admin' ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>

                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-gray-200 text-gray-700">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
                        {user.isVerified && (
                          <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        )}
                        <Badge className={`${getRoleColor(user.role)} text-xs border`}>
                          {user.role}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{user.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>Joined {user.joinDate}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Badge className={`${getStatusColor(user.status)} text-xs border`}>
                            {user.status}
                          </Badge>
                        </div>
                        <div className={`flex items-center space-x-1 ${getSecurityColor(user.securityStatus)}`}>
                          {getSecurityIcon(user.securityStatus)}
                          <span className="font-medium">{user.securityStatus}</span>
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">{user.totalOrders}</span> orders
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">${user.totalSpent.toFixed(2)}</span> spent
                        </div>
                        {user.reportsCount > 0 && (
                          <div className="text-red-600">
                            <span className="font-medium">{user.reportsCount}</span> reports
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="w-4 h-4 mr-2" />
                            Edit Account
                          </DropdownMenuItem>
                          {user.reportsCount > 0 && (
                            <DropdownMenuItem>
                              <Flag className="w-4 h-4 mr-2" />
                              View Reports ({user.reportsCount})
                            </DropdownMenuItem>
                          )}
                          {user.role !== 'Admin' && (
                            <>
                              <DropdownMenuSeparator />
                              {user.status === 'Active' ? (
                                <DropdownMenuItem className="text-orange-600">
                                  <Clock className="w-4 h-4 mr-2" />
                                  Suspend User
                                </DropdownMenuItem>
                              ) : user.status === 'Suspended' ? (
                                <DropdownMenuItem className="text-emerald-600">
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Reactivate User
                                </DropdownMenuItem>
                              ) : null}
                              <DropdownMenuItem className="text-red-600">
                                <Ban className="w-4 h-4 mr-2" />
                                Ban User
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
