import React, { useState } from 'react';
import { 
  Search, Filter, MoreHorizontal, Mail, Phone, 
  MapPin, Star, ShoppingBag, Calendar, Eye, Plus,
  Shield, AlertTriangle, Ban, CheckCircle, Clock,
  UserCheck, Settings, MessageSquare, Flag
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
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
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState('name');
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

  // Helper function to parse relative time to minutes for sorting
  const parseRelativeTime = (timeStr: string): number => {
    const now = Date.now();
    if (timeStr.includes('minute')) {
      const minutes = parseInt(timeStr);
      return now - (minutes * 60 * 1000);
    } else if (timeStr.includes('hour')) {
      const hours = parseInt(timeStr);
      return now - (hours * 60 * 60 * 1000);
    } else if (timeStr.includes('day')) {
      const days = parseInt(timeStr);
      return now - (days * 24 * 60 * 60 * 1000);
    } else if (timeStr.includes('week')) {
      const weeks = parseInt(timeStr);
      return now - (weeks * 7 * 24 * 60 * 60 * 1000);
    }
    return now; // Default to now if parsing fails
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Suspended': return 'bg-yellow-100 text-yellow-800';
      case 'Banned': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Seller': return 'bg-blue-100 text-blue-800';
      case 'Customer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSecurityColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'bg-green-100 text-green-800';
      case 'Flagged': return 'bg-yellow-100 text-yellow-800';
      case 'Under Review': return 'bg-blue-100 text-blue-800';
      case 'High Risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSecurityIcon = (status: string) => {
    switch (status) {
      case 'Normal': return <CheckCircle className="w-3 h-3" />;
      case 'Flagged': return <AlertTriangle className="w-3 h-3" />;
      case 'Under Review': return <Clock className="w-3 h-3" />;
      case 'High Risk': return <Ban className="w-3 h-3" />;
      default: return <CheckCircle className="w-3 h-3" />;
    }
  };

  const handleToggleUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === filteredAndSortedUsers.length) {
      setSelectedUsers(new Set());
    } else {
      // Only select non-admin users for bulk actions
      const selectableUsers = filteredAndSortedUsers.filter(u => u.role !== 'Admin');
      setSelectedUsers(new Set(selectableUsers.map(u => u.id)));
    }
  };

  const handleBulkSuspend = () => {
    const nonAdminSelected = Array.from(selectedUsers).filter(id => {
      const user = users.find(u => u.id === id);
      return user && user.role !== 'Admin';
    });
    
    setUsers(prev => prev.map(user => 
      nonAdminSelected.includes(user.id) 
        ? { ...user, status: 'Suspended' as const }
        : user
    ));
    setSelectedUsers(new Set());
  };

  const handleBulkReactivate = () => {
    const nonAdminSelected = Array.from(selectedUsers).filter(id => {
      const user = users.find(u => u.id === id);
      return user && user.role !== 'Admin';
    });
    
    setUsers(prev => prev.map(user => 
      nonAdminSelected.includes(user.id) 
        ? { ...user, status: 'Active' as const }
        : user
    ));
    setSelectedUsers(new Set());
  };

  const handleBulkVerify = () => {
    const nonAdminSelected = Array.from(selectedUsers).filter(id => {
      const user = users.find(u => u.id === id);
      return user && user.role !== 'Admin';
    });
    
    setUsers(prev => prev.map(user => 
      nonAdminSelected.includes(user.id) 
        ? { ...user, isVerified: true }
        : user
    ));
    setSelectedUsers(new Set());
  };

  const filteredAndSortedUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesSecurity = securityFilter === 'all' || user.securityStatus === securityFilter;
      const matchesVerification = verificationFilter === 'all' || 
        (verificationFilter === 'verified' && user.isVerified) ||
        (verificationFilter === 'unverified' && !user.isVerified);
      return matchesSearch && matchesRole && matchesStatus && matchesSecurity && matchesVerification;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'joinDate': return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        case 'lastActivity': return parseRelativeTime(b.lastActivity) - parseRelativeTime(a.lastActivity);
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

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Compact Header & Stats */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">User Management</h1>
              <p className="text-xs text-muted-foreground">Manage and moderate platform users</p>
            </div>
            <div className="flex gap-2">
              {selectedUsers.size > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <Shield className="w-4 h-4 mr-1" />
                      Bulk Actions ({selectedUsers.size})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleBulkSuspend}>
                      <Clock className="w-4 h-4 mr-2" />
                      Suspend Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBulkReactivate}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Reactivate Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBulkVerify}>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Verify Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="joinDate">Sort by Join Date</SelectItem>
                  <SelectItem value="lastActivity">Sort by Activity</SelectItem>
                  <SelectItem value="reportsCount">Sort by Reports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ultra compact stats */}
          <div className="grid grid-cols-6 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{stats.active}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-600">{stats.customers}</div>
              <div className="text-xs text-muted-foreground">Customers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">{stats.sellers}</div>
              <div className="text-xs text-muted-foreground">Sellers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{stats.flagged}</div>
              <div className="text-xs text-muted-foreground">Flagged</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">{stats.unverified}</div>
              <div className="text-xs text-muted-foreground">Unverified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Filters */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-32 h-9">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Customer">Customer</SelectItem>
              <SelectItem value="Seller">Seller</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-32 h-9">
              <SelectValue placeholder="Status" />
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
            <SelectTrigger className="w-full sm:w-36 h-9">
              <SelectValue placeholder="Security" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Security</SelectItem>
              <SelectItem value="Normal">Normal</SelectItem>
              <SelectItem value="Flagged">Flagged</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="High Risk">High Risk</SelectItem>
            </SelectContent>
          </Select>
          <Select value={verificationFilter} onValueChange={setVerificationFilter}>
            <SelectTrigger className="w-full sm:w-32 h-9">
              <SelectValue placeholder="Verified" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users List */}
      <div className="p-3">
        {filteredAndSortedUsers.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-3">
            {/* Select All Checkbox */}
            {filteredAndSortedUsers.length > 0 && (
              <Card className="p-3 mb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.size === filteredAndSortedUsers.length && filteredAndSortedUsers.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {selectedUsers.size === filteredAndSortedUsers.length && filteredAndSortedUsers.length > 0
                      ? `All ${filteredAndSortedUsers.length} users selected`
                      : selectedUsers.size > 0
                      ? `${selectedUsers.size} of ${filteredAndSortedUsers.length} selected`
                      : `Select all ${filteredAndSortedUsers.length} users`
                    }
                  </span>
                </div>
              </Card>
            )}
            {filteredAndSortedUsers.map((user) => (
              <Card key={user.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Checkbox - disabled for Admin users */}
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => handleToggleUser(user.id)}
                      disabled={user.role === 'Admin'}
                      className={`w-4 h-4 text-red-600 rounded focus:ring-red-500 ${
                        user.role === 'Admin' ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    />
                    
                    {/* Avatar and Basic Info */}
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-foreground">{user.name}</h3>
                          {user.isVerified && <CheckCircle className="w-4 h-4 text-blue-600" />}
                          <Badge variant="secondary" className={`${getRoleColor(user.role)} text-xs`}>
                            {user.role}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {user.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Joined {user.joinDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {user.lastActivity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* User Stats */}
                    <div className="hidden md:flex items-center gap-6 text-xs">
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{user.totalOrders}</div>
                        <div className="text-muted-foreground">Orders</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">${user.totalSpent.toFixed(2)}</div>
                        <div className="text-muted-foreground">Spent</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{user.reportsCount}</div>
                        <div className="text-muted-foreground">Reports</div>
                      </div>
                    </div>

                    {/* Status and Security Badges */}
                    <div className="flex flex-col gap-1">
                      <Badge variant="secondary" className={`${getStatusColor(user.status)} text-xs`}>
                        {user.status}
                      </Badge>
                      <Badge variant="secondary" className={`${getSecurityColor(user.securityStatus)} text-xs flex items-center gap-1`}>
                        {getSecurityIcon(user.securityStatus)}
                        {user.securityStatus}
                      </Badge>
                    </div>

                    {/* Actions */}
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
                        <DropdownMenuItem>
                          <Flag className="w-4 h-4 mr-2" />
                          View Reports
                        </DropdownMenuItem>
                        {user.role !== 'Admin' && (
                          <>
                            {user.status === 'Active' ? (
                              <DropdownMenuItem className="text-yellow-600">
                                <Clock className="w-4 h-4 mr-2" />
                                Suspend User
                              </DropdownMenuItem>
                            ) : user.status === 'Suspended' ? (
                              <DropdownMenuItem className="text-green-600">
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