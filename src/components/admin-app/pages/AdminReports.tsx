
import React, { useState } from 'react';
import { 
  Search, Filter, MoreHorizontal, Eye, Flag, 
  AlertTriangle, CheckCircle, Clock, Ban,
  User, Package, MessageSquare, Shield
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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

interface Report {
  id: string;
  reportNumber: string;
  reporter: string;
  reportedItem: string;
  itemType: 'User' | 'Product' | 'Review' | 'Seller';
  category: string;
  reason: string;
  description: string;
  status: 'Open' | 'Under Review' | 'Resolved' | 'Dismissed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dateReported: string;
  lastUpdated: string;
  assignedTo?: string;
}

const AdminReports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dateReported');
  
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      reportNumber: 'RPT-2024-001',
      reporter: 'Sarah Johnson',
      reportedItem: 'Fake iPhone 15 Pro Max',
      itemType: 'Product',
      category: 'Counterfeit',
      reason: 'Selling fake products',
      description: 'This product appears to be a counterfeit iPhone with misleading specifications.',
      status: 'Open',
      priority: 'High',
      dateReported: '2024-01-15',
      lastUpdated: '2024-01-15',
      assignedTo: 'Admin Team'
    },
    {
      id: '2',
      reportNumber: 'RPT-2024-002',
      reporter: 'Mike Chen',
      reportedItem: 'TechStore123',
      itemType: 'Seller',
      category: 'Fraud',
      reason: 'Seller not delivering products',
      description: 'Ordered items 3 weeks ago, seller marked as shipped but no tracking info provided.',
      status: 'Under Review',
      priority: 'Medium',
      dateReported: '2024-01-14',
      lastUpdated: '2024-01-14',
      assignedTo: 'John Admin'
    },
    {
      id: '3',
      reportNumber: 'RPT-2024-003',
      reporter: 'Emma Davis',
      reportedItem: 'Inappropriate review content',
      itemType: 'Review',
      category: 'Inappropriate Content',
      reason: 'Contains offensive language',
      description: 'Review contains profanity and inappropriate comments about other customers.',
      status: 'Resolved',
      priority: 'Low',
      dateReported: '2024-01-13',
      lastUpdated: '2024-01-13'
    },
    {
      id: '4',
      reportNumber: 'RPT-2024-004',
      reporter: 'Alex Kim',
      reportedItem: 'Spam User Account',
      itemType: 'User',
      category: 'Spam',
      reason: 'Creating multiple fake accounts',
      description: 'User appears to be creating multiple accounts to manipulate reviews and ratings.',
      status: 'Open',
      priority: 'Critical',
      dateReported: '2024-01-12',
      lastUpdated: '2024-01-12'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'User': return <User className="w-3 h-3" />;
      case 'Product': return <Package className="w-3 h-3" />;
      case 'Review': return <MessageSquare className="w-3 h-3" />;
      case 'Seller': return <Shield className="w-3 h-3" />;
      default: return <Flag className="w-3 h-3" />;
    }
  };

  const filteredAndSortedReports = reports
    .filter(report => {
      const matchesSearch = report.reportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           report.reportedItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           report.reporter.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      const matchesType = typeFilter === 'all' || report.itemType === typeFilter;
      const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesType && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dateReported': return new Date(b.dateReported).getTime() - new Date(a.dateReported).getTime();
        case 'priority': 
          const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
        case 'reporter': return a.reporter.localeCompare(b.reporter);
        default: return 0;
      }
    });

  const stats = {
    total: reports.length,
    open: reports.filter(r => r.status === 'Open').length,
    underReview: reports.filter(r => r.status === 'Under Review').length,
    resolved: reports.filter(r => r.status === 'Resolved').length,
    critical: reports.filter(r => r.priority === 'Critical').length,
    high: reports.filter(r => r.priority === 'High').length
  };

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Header & Stats */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">Reports & Moderation</h1>
              <p className="text-xs text-muted-foreground">Handle user reports and content moderation</p>
            </div>
            <Button size="sm" className="bg-red-600 hover:bg-red-700">
              <Flag className="w-4 h-4 mr-1" />
              Create Report
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-6 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{stats.open}</div>
              <div className="text-xs text-muted-foreground">Open</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">{stats.underReview}</div>
              <div className="text-xs text-muted-foreground">Under Review</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{stats.resolved}</div>
              <div className="text-xs text-muted-foreground">Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-700">{stats.critical}</div>
              <div className="text-xs text-muted-foreground">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">{stats.high}</div>
              <div className="text-xs text-muted-foreground">High Priority</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-32 h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Dismissed">Dismissed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-32 h-9">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="User">User</SelectItem>
              <SelectItem value="Product">Product</SelectItem>
              <SelectItem value="Review">Review</SelectItem>
              <SelectItem value="Seller">Seller</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-32 h-9">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dateReported">Sort by Date</SelectItem>
              <SelectItem value="priority">Sort by Priority</SelectItem>
              <SelectItem value="reporter">Sort by Reporter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reports List */}
      <div className="p-3">
        <div className="grid gap-3">
          {filteredAndSortedReports.map((report) => (
            <Card key={report.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Report Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-foreground">{report.reportNumber}</h3>
                      <Badge variant="secondary" className={`${getPriorityColor(report.priority)} text-xs`}>
                        {report.priority}
                      </Badge>
                      <Badge variant="secondary" className={`${getStatusColor(report.status)} text-xs`}>
                        {report.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        {getTypeIcon(report.itemType)}
                        {report.itemType}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-medium text-foreground">Reported Item:</span>
                        <span className="text-muted-foreground ml-1">{report.reportedItem}</span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Reporter:</span>
                        <span className="text-muted-foreground ml-1">{report.reporter}</span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Category:</span>
                        <span className="text-muted-foreground ml-1">{report.category}</span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Reason:</span>
                        <span className="text-muted-foreground ml-1">{report.reason}</span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Description:</span>
                        <p className="text-muted-foreground mt-1">{report.description}</p>
                      </div>
                      <div className="flex items-center gap-4 pt-1">
                        <span className="text-muted-foreground">Reported: {report.dateReported}</span>
                        <span className="text-muted-foreground">Updated: {report.lastUpdated}</span>
                        {report.assignedTo && (
                          <span className="text-muted-foreground">Assigned to: {report.assignedTo}</span>
                        )}
                      </div>
                    </div>
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
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Flag className="w-4 h-4 mr-2" />
                        View Reported Item
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <User className="w-4 h-4 mr-2" />
                        Contact Reporter
                      </DropdownMenuItem>
                      {report.status === 'Open' && (
                        <DropdownMenuItem className="text-yellow-600">
                          <Clock className="w-4 h-4 mr-2" />
                          Start Review
                        </DropdownMenuItem>
                      )}
                      {report.status !== 'Resolved' && (
                        <DropdownMenuItem className="text-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Resolved
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-gray-600">
                        <Ban className="w-4 h-4 mr-2" />
                        Dismiss Report
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Take Action
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
