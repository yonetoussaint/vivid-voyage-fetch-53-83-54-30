import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Package, ShoppingCart, 
  DollarSign, AlertTriangle, Shield, ArrowUpRight, ArrowDownRight,
  UserCheck, Flag, Activity, Server, Bell,
  Eye, Settings, Search
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PlatformStat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<any>;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  status: string;
  date: string;
  severity: 'high' | 'medium' | 'low' | 'info';
}

interface SystemMetric {
  name: string;
  value: string;
  status: 'excellent' | 'good' | 'normal' | 'warning' | 'critical';
  trend: string;
}

interface PendingReview {
  type: string;
  count: number;
  priority: 'high' | 'medium' | 'low';
}

const AdminOverview = () => {
  const navigate = useNavigate();
  
  const stats: PlatformStat[] = [
    {
      title: 'Total Users',
      value: '45,892',
      change: '+12.8%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Active Sellers',
      value: '2,847',
      change: '+5.2%',
      trend: 'up',
      icon: UserCheck,
    },
    {
      title: 'Platform Revenue',
      value: '$2.4M',
      change: '+18.5%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Total Orders',
      value: '89,432',
      change: '+7.9%',
      trend: 'up',
      icon: ShoppingCart,
    },
  ];

  const recentActivity: Activity[] = [
    { id: 'ACT-001', type: 'report', description: 'Product report: Suspicious listing', status: 'Pending', date: '5 minutes ago', severity: 'high' },
    { id: 'ACT-002', type: 'user', description: 'New seller registration: Tech Gadgets Pro', status: 'Under Review', date: '12 minutes ago', severity: 'medium' },
    { id: 'ACT-003', type: 'violation', description: 'Content violation: Inappropriate review content', status: 'Resolved', date: '25 minutes ago', severity: 'low' },
    { id: 'ACT-004', type: 'system', description: 'Payment gateway maintenance completed', status: 'Completed', date: '1 hour ago', severity: 'info' },
    { id: 'ACT-005', type: 'security', description: 'Suspicious login attempt blocked', status: 'Auto-Blocked', date: '2 hours ago', severity: 'high' },
  ];

  const systemMetrics: SystemMetric[] = [
    { name: 'Server Uptime', value: '99.98%', status: 'excellent', trend: '+0.02%' },
    { name: 'Response Time', value: '145ms', status: 'good', trend: '-5ms' },
    { name: 'Active Sessions', value: '12,847', status: 'normal', trend: '+2.3%' },
    { name: 'Storage Usage', value: '67%', status: 'warning', trend: '+1.2%' },
    { name: 'Error Rate', value: '0.01%', status: 'excellent', trend: '-0.002%' },
  ];

  const pendingReviews: PendingReview[] = [
    { type: 'Seller Applications', count: 23, priority: 'high' },
    { type: 'Product Reports', count: 15, priority: 'medium' },
    { type: 'User Appeals', count: 8, priority: 'medium' },
    { type: 'Content Flags', count: 42, priority: 'low' },
    { type: 'Payment Disputes', count: 6, priority: 'high' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Under Review': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Auto-Blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-3 h-3 text-red-500" />;
      case 'medium': return <Bell className="w-3 h-3 text-yellow-500" />;
      case 'low': return <Eye className="w-3 h-3 text-blue-500" />;
      case 'info': return <Activity className="w-3 h-3 text-gray-500" />;
      default: return <Activity className="w-3 h-3 text-gray-500" />;
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'normal': return 'text-gray-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendColor = (metric: SystemMetric) => {
    const positiveIsGood: Record<string, boolean> = {
      'Response Time': false,  // Lower is better
      'Error Rate': false,     // Lower is better  
      'Storage Usage': false,  // Lower is better
    };
    
    const isPositive = metric.trend.includes('+') || (!metric.trend.includes('-') && !metric.trend.includes('+'));
    const isGoodTrend = positiveIsGood[metric.name] !== undefined 
      ? positiveIsGood[metric.name] === isPositive
      : isPositive; // Default: positive is good
    
    if (metric.name === 'Storage Usage' && metric.trend.includes('+')) {
      return 'text-yellow-600'; // Storage increase is warning
    }
    
    return isGoodTrend ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Compact Header & Stats */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Platform administration & monitoring</p>
            </div>
            <Button size="sm" className="bg-red-600 hover:bg-red-700">
              <Shield className="w-4 h-4 mr-1" />
              Emergency Tools
            </Button>
          </div>

          {/* Ultra compact stats */}
          <div className="grid grid-cols-4 gap-3">
            {stats.map((stat) => (
              <div key={stat.title} className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <stat.icon className="w-4 h-4 text-red-600 mr-1" />
                  <div className="text-lg font-bold">{stat.value}</div>
                </div>
                <div className="text-xs text-muted-foreground">{stat.title}</div>
                <div className={`flex items-center justify-center text-xs mt-1 ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? 
                    <ArrowUpRight className="w-3 h-3 mr-1" /> : 
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                  }
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          {/* Recent Activity */}
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => navigate('/admin-dashboard/reports')}>
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-100 rounded-md flex items-center justify-center">
                        {getSeverityIcon(activity.severity)}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-foreground line-clamp-1">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className={`${getStatusColor(activity.status)} text-xs`}>
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Metrics */}
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">System Health</h3>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => navigate('/admin-dashboard/analytics')}>
                  <Server className="w-3 h-3 mr-1" />
                  Full Report
                </Button>
              </div>
              <div className="space-y-3">
                {systemMetrics.map((metric, index) => (
                  <div key={metric.name} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                      <Activity className="w-3 h-3 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground">{metric.name}</p>
                      <p className="text-xs text-muted-foreground">{metric.status}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-semibold ${getMetricStatusColor(metric.status)}`}>{metric.value}</p>
                      <p className={`text-xs ${getTrendColor(metric)}`}>{metric.trend}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Reviews */}
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Pending Reviews</h3>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => navigate('/admin-dashboard/content')}>
                <Search className="w-3 h-3 mr-1" />
                Review Queue
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {pendingReviews.map((review) => (
                <div key={review.type} className="p-3 bg-muted/30 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-foreground">{review.type}</span>
                    <Badge variant="secondary" className={`${getPriorityColor(review.priority)} text-xs`}>
                      {review.priority}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold text-foreground">{review.count}</div>
                  <div className="text-xs text-muted-foreground">items pending</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Admin Actions */}
      <div className="p-3">
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick Admin Actions</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              <Button variant="outline" size="sm" className="h-14 flex-col gap-1 text-xs" onClick={() => navigate('/admin-dashboard/users')}>
                <Users className="w-4 h-4" />
                Manage Users
              </Button>
              <Button variant="outline" size="sm" className="h-14 flex-col gap-1 text-xs" onClick={() => navigate('/admin-dashboard/sellers')}>
                <UserCheck className="w-4 h-4" />
                Review Sellers
              </Button>
              <Button variant="outline" size="sm" className="h-14 flex-col gap-1 text-xs" onClick={() => navigate('/admin-dashboard/products')}>
                <Package className="w-4 h-4" />
                Moderate Products
              </Button>
              <Button variant="outline" size="sm" className="h-14 flex-col gap-1 text-xs" onClick={() => navigate('/admin-dashboard/reports')}>
                <Flag className="w-4 h-4" />
                Handle Reports
              </Button>
              <Button variant="outline" size="sm" className="h-14 flex-col gap-1 text-xs" onClick={() => navigate('/admin-dashboard/security')}>
                <Shield className="w-4 h-4" />
                Security Center
              </Button>
              <Button variant="outline" size="sm" className="h-14 flex-col gap-1 text-xs" onClick={() => navigate('/admin-dashboard/settings')}>
                <Settings className="w-4 h-4" />
                Platform Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;