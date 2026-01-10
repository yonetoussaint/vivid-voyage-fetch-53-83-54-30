import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Minimize2, Maximize2, X, Trash2, Search } from 'lucide-react';

export default function ConsoleDevTools() {
  const [logs, setLogs] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [filters, setFilters] = useState({
    log: true,
    warn: true,
    error: true,
    info: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const logsEndRef = useRef(null);

  // Intercept console methods
  useEffect(() => {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;

    const addLog = (type, args) => {
      const message = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch (e) {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');

      setLogs(prev => [...prev, {
        id: Date.now() + Math.random(),
        type,
        message,
        timestamp: new Date(),
        stack: type === 'error' ? new Error().stack : null
      }]);
    };

    console.log = (...args) => {
      originalLog.apply(console, args);
      addLog('log', args);
    };

    console.warn = (...args) => {
      originalWarn.apply(console, args);
      addLog('warn', args);
    };

    console.error = (...args) => {
      originalError.apply(console, args);
      addLog('error', args);
    };

    console.info = (...args) => {
      originalInfo.apply(console, args);
      addLog('info', args);
    };

    // Catch unhandled errors
    const handleError = (event) => {
      addLog('error', [event.message, `at ${event.filename}:${event.lineno}:${event.colno}`]);
    };

    const handleUnhandledRejection = (event) => {
      addLog('error', ['Unhandled Promise Rejection:', event.reason]);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      console.info = originalInfo;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (!isMinimized) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isMinimized]);

  const clearLogs = () => setLogs([]);

  const toggleFilter = (type) => {
    setFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const filteredLogs = logs.filter(log => {
    if (!filters[log.type]) return false;
    if (searchTerm && !log.message.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getLogColor = (type) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-300';
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'error': return '❌';
      case 'warn': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Demo Website Content */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Website</h1>
          <p className="text-gray-600 mb-6">
            This is your website content. The console dev tools are overlaid at the bottom right.
            Try clicking the buttons below to generate different types of console messages!
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-sm text-blue-700">
              <strong>📌 Pro Tip:</strong> The console overlay captures all console.log(), console.warn(), 
              console.error(), and console.info() calls, plus any unhandled errors on your page.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Test Console Output:</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => console.log('This is a regular log message', { data: 'example' })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate Log
              </button>
              <button
                onClick={() => console.warn('Warning: Something might be wrong!')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Generate Warning
              </button>
              <button
                onClick={() => console.error('Error: Something went wrong!', new Error('Test error'))}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Generate Error
              </button>
              <button
                onClick={() => console.info('Info: Application started successfully')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Generate Info
              </button>
              <button
                onClick={() => {
                  const data = { users: [1, 2, 3], config: { debug: true } };
                  console.log('Complex object:', data);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Log Object
              </button>
              <button
                onClick={() => {
                  throw new Error('Uncaught error example!');
                }}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                Throw Error
              </button>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">How to use on your website:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Copy this component code</li>
              <li>Add it to your React application</li>
              <li>It will automatically intercept all console calls</li>
              <li>View all logs in the overlay at the bottom right</li>
              <li>Filter by type, search, clear, or minimize as needed</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Console Overlay */}
      <div 
        className={`fixed bottom-0 right-0 bg-gray-900 border-2 border-gray-700 rounded-t-lg shadow-2xl flex flex-col z-50 transition-all ${
          isMinimized ? 'h-12' : 'h-96'
        }`}
        style={{ width: '600px' }}
      >
        {/* Header */}
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700 cursor-move">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-gray-200">Console Dev Tools</span>
            <span className="text-xs text-gray-500">({filteredLogs.length} logs)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearLogs}
              className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
              title="Clear logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
              title={isMinimized ? 'Maximize' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Filters */}
            <div className="bg-gray-800 px-4 py-2 flex items-center gap-4 border-b border-gray-700">
              <div className="flex gap-2">
                {['log', 'warn', 'error', 'info'].map(type => (
                  <button
                    key={type}
                    onClick={() => toggleFilter(type)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      filters[type]
                        ? type === 'error' ? 'bg-red-600 text-white'
                          : type === 'warn' ? 'bg-yellow-600 text-white'
                          : type === 'info' ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="flex-1 relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Logs */}
            <div className="flex-1 overflow-y-auto p-2 font-mono text-xs">
              {filteredLogs.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No console logs yet...</p>
                </div>
              ) : (
                filteredLogs.map(log => (
                  <div key={log.id} className="mb-2 pb-2 border-b border-gray-800">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-600 text-xs">{formatTime(log.timestamp)}</span>
                      <span>{getLogIcon(log.type)}</span>
                      <pre className={`flex-1 whitespace-pre-wrap break-words ${getLogColor(log.type)}`}>
                        {log.message}
                      </pre>
                    </div>
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </>
        )}
      </div>
    </>
  );
}