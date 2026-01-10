import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, Clock, Search, Filter, Download, RefreshCw } from 'lucide-react';

export default function DeploymentErrorMonitor() {
  const [errors, setErrors] = useState([]);
  const [filteredErrors, setFilteredErrors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedError, setSelectedError] = useState(null);

  // Sample deployment errors
  useEffect(() => {
    const sampleErrors = [
      {
        id: 1,
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        severity: 'error',
        type: 'Build Failed',
        message: 'Module not found: Cannot resolve \'./components/Header\'',
        file: 'src/pages/index.js',
        line: 12,
        deploy: 'deploy-abc123',
        stack: 'Error: Module not found\n  at Resolver.resolve (/build/webpack.js:234)\n  at doResolve (/build/webpack.js:456)',
        status: 'unresolved'
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        severity: 'warning',
        type: 'Dependency Warning',
        message: 'Package \'lodash\' is deprecated. Consider using lodash-es',
        file: 'package.json',
        line: null,
        deploy: 'deploy-abc123',
        stack: null,
        status: 'unresolved'
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        severity: 'error',
        type: 'Runtime Error',
        message: 'Uncaught TypeError: Cannot read property \'map\' of undefined',
        file: 'src/components/ProductList.js',
        line: 45,
        deploy: 'deploy-def456',
        stack: 'TypeError: Cannot read property \'map\' of undefined\n  at ProductList (ProductList.js:45)\n  at renderWithHooks (react-dom.js:789)',
        status: 'resolved'
      },
      {
        id: 4,
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        severity: 'error',
        type: 'API Error',
        message: 'Failed to fetch: 500 Internal Server Error',
        file: 'src/api/users.js',
        line: 23,
        deploy: 'deploy-ghi789',
        stack: 'Error: 500 Internal Server Error\n  at fetchUsers (users.js:23)\n  at async loadUserData (app.js:67)',
        status: 'unresolved'
      },
      {
        id: 5,
        timestamp: new Date(Date.now() - 1000 * 60 * 90),
        severity: 'warning',
        type: 'Performance Warning',
        message: 'Bundle size exceeds recommended limit (2.5MB > 2MB)',
        file: 'webpack.config.js',
        line: null,
        deploy: 'deploy-ghi789',
        stack: null,
        status: 'unresolved'
      },
      {
        id: 6,
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        severity: 'info',
        type: 'Build Success',
        message: 'Build completed successfully in 45s',
        file: null,
        line: null,
        deploy: 'deploy-jkl012',
        stack: null,
        status: 'resolved'
      }
    ];
    setErrors(sampleErrors);
    setFilteredErrors(sampleErrors);
  }, []);

  useEffect(() => {
    let filtered = errors;

    if (searchTerm) {
      filtered = filtered.filter(error => 
        error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        error.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (error.file && error.file.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(error => error.severity === selectedSeverity);
    }

    setFilteredErrors(filtered);
  }, [searchTerm, selectedSeverity, errors]);

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const exportErrors = () => {
    const data = JSON.stringify(filteredErrors, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deployment-errors-${new Date().toISOString()}.json`;
    a.click();
  };

  const stats = {
    total: errors.length,
    errors: errors.filter(e => e.severity === 'error').length,
    warnings: errors.filter(e => e.severity === 'warning').length,
    resolved: errors.filter(e => e.status === 'resolved').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Deployment Error Monitor</h1>
          <p className="text-gray-600">Track and debug errors from your website deployments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Issues</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Errors</p>
                <p className="text-2xl font-bold text-red-500">{stats.errors}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Warnings</p>
                <p className="text-2xl font-bold text-yellow-500">{stats.warnings}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-500">{stats.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search errors, files, or messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Severities</option>
                <option value="error">Errors</option>
                <option value="warning">Warnings</option>
                <option value="info">Info</option>
              </select>
              <button
                onClick={exportErrors}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Error List */}
        <div className="space-y-3">
          {filteredErrors.map((error) => (
            <div
              key={error.id}
              className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                getSeverityBg(error.severity)
              } ${selectedError?.id === error.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedError(selectedError?.id === error.id ? null : error)}
            >
              <div className="flex items-start gap-3">
                {getSeverityIcon(error.severity)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{error.type}</h3>
                      <p className="text-sm text-gray-700 mt-1">{error.message}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{formatTime(error.timestamp)}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    {error.file && (
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                        {error.file}{error.line ? `:${error.line}` : ''}
                      </span>
                    )}
                    <span className="bg-gray-100 px-2 py-1 rounded">{error.deploy}</span>
                    <span className={`px-2 py-1 rounded ${
                      error.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {error.status}
                    </span>
                  </div>

                  {/* Stack Trace (expanded) */}
                  {selectedError?.id === error.id && error.stack && (
                    <div className="mt-4 p-3 bg-gray-900 rounded-lg overflow-x-auto">
                      <pre className="text-xs text-green-400 font-mono">{error.stack}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredErrors.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No errors found</h3>
              <p className="text-gray-600">All deployments are running smoothly!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}