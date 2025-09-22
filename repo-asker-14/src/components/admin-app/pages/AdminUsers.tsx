
import React, { useState } from 'react';
import { 
  Search, Filter, MoreVertical, Mail, Phone, 
  MapPin, Calendar, Eye, Plus, Shield, 
  AlertTriangle, Ban, CheckCircle, Clock,
  UserCheck, Settings, MessageSquare, Flag, 
  Users, Activity, UserX, ChevronDown
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
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Suspended': return 'bg-orange-100 text-orange-800';
      case 'Banned': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-800';
      case 'Seller': return 'bg-blue-100 text-blue-800';
      case 'Customer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSecurityIcon = (status: string) => {
    switch (status) {
      case 'Normal': return <CheckCircle className="w-3 h-3 text-green-600" />;
      case 'Flagged': return <AlertTriangle className="w-3 h-3 text-orange-600" />;
      case 'Under Review': return <Clock className="w-3 h-3 text-blue-600" />;
      case 'High Risk': return <Ban className="w-3 h-3 text-red-600" />;
      default: return <CheckCircle className="w-3 h-3 text-green-600" />;
    }
  };

  const filteredAndSortedUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesSecurity = securityFilter === 'all' || user.securityStatus === securityFilter;
    return matchesSearch && matchesRole && matchesStatus && matchesSecurity;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'Active').length,
    flagged: users.filter(u => u.securityStatus !== 'Normal').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Users</h1>
              <p className="text-sm text-gray-600">{stats.total} total users</p>
            </div>
            <Button size="sm" className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-1" />
              Add User
            </Button>
          </div>

          {/* Compact Stats */}
          <div className="flex space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{stats.active} Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{stats.flagged} Flagged</span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="h-8"
              >
                <Filter className="w-3 h-3 mr-1" />
                Filters
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="h-8 text-xs">
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
                  <SelectTrigger className="h-8 text-xs">
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
                  <SelectTrigger className="h-8 text-xs">
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="p-4">
        {filteredAndSortedUsers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAndSortedUsers.map((user) => (
              <Card key={user.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {/* Avatar and Basic Info */}
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      {/* Name and badges */}
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900 truncate text-sm">{user.name}</h3>
                        {user.isVerified && (
                          <CheckCircle className="w-3 h-3 text-blue-600 flex-shrink-0" />
                        )}
                        <Badge className={`${getRoleColor(user.role)} text-xs px-1.5 py-0.5`}>
                          {user.role}
                        </Badge>
                      </div>

                      {/* Email and location */}
                      <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                        <span className="truncate">{user.email}</span>
                        <span className="hidden sm:block">•</span>
                        <span className="hidden sm:block truncate">{user.location}</span>
                      </div>

                      {/* Status and metrics */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge className={`${getStatusColor(user.status)} text-xs px-2 py-0.5`}>
                            {user.status}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            {getSecurityIcon(user.securityStatus)}
                            <span className="text-xs text-gray-600">{user.securityStatus}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{user.totalOrders} orders</span>
                          <span>•</span>
                          <span>${user.totalSpent.toFixed(0)}</span>
                          {user.reportsCount > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-red-600 font-medium">{user.reportsCount} reports</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
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
