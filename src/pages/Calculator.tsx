import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Play, Trash2, AlertCircle, AlertTriangle, Info, FileText, ExternalLink, Monitor, Code } from 'lucide-react';

export default function WebsiteConsoleInspector() {
  const [url, setUrl] = useState('');
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [activeTab, setActiveTab] = useState('console'); // 'console' or 'preview'
  const [filters, setFilters] = useState({
    log: true,
    warn: true,
    error: true,
    info: true,
    network: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const iframeRef = useRef(null);
  const logsEndRef = useRef(null);

  const addLog = (type, message, details = null) => {
    const newLog = {
      id: Date.now() + Math.random(),
      type,
      message,
      details,
      timestamp: new Date()
    };
    setLogs(prev => [...prev, newLog]);
    console.log(`[${type.toUpperCase()}]`, message); // Also log to actual console for debugging
  };

  const loadWebsite = () => {
    if (!url.trim()) return;

    setLogs([]);
    setIsLoading(true);
    
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    
    setCurrentUrl(finalUrl);
    addLog('info', `🔄 Loading: ${finalUrl}`);
    
    // Add a test log to show the system is working
    setTimeout(() => {
      addLog('log', 'Console inspector initialized');
      addLog('warn', 'Note: Due to CORS policy, external sites may not show internal console logs');
    }, 100);
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !currentUrl) return;

    const handleLoad = () => {
      setIsLoading(false);
      addLog('info', `✅ Page loaded successfully`);
      addLog('log', `DOM loaded for: ${currentUrl}`);
      
      // Add network monitoring
      addLog('network', `Network request completed: GET ${currentUrl}`);

      try {
        const iframeWindow = iframe.contentWindow;
        const iframeDoc = iframe.contentDocument;

        if (iframeWindow && iframeDoc) {
          addLog('info', '✅ Successfully accessed iframe content');
          
          // Inject console capture script
          const script = iframeDoc.createElement('script');
          script.textContent = `
            (function() {
              try {
                const originalLog = console.log;
                const originalWarn = console.warn;
                const originalError = console.error;
                const originalInfo = console.info;

                const sendToParent = (level, args) => {
                  try {
                    window.parent.postMessage({
                      type: 'console',
                      level: level,
                      message: args.map(a => {
                        try {
                          return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a);
                        } catch (e) {
                          return String(a);
                        }
                      }).join(' ')
                    }, '*');
                  } catch (e) {
                    // Silent fail
                  }
                };

                console.log = function(...args) {
                  originalLog.apply(console, args);
                  sendToParent('log', args);
                };

                console.warn = function(...args) {
                  originalWarn.apply(console, args);
                  sendToParent('warn', args);
                };

                console.error = function(...args) {
                  originalError.apply(console, args);
                  sendToParent('error', args);
                };

                console.info = function(...args) {
                  originalInfo.apply(console, args);
                  sendToParent('info', args);
                };

                window.addEventListener('error', function(e) {
                  sendToParent('error', [e.message + ' at ' + e.filename + ':' + e.lineno + ':' + e.colno]);
                });

                window.addEventListener('unhandledrejection', function(e) {
                  sendToParent('error', ['Unhandled Promise Rejection: ' + e.reason]);
                });

                // Notify parent that script is injected
                window.parent.postMessage({ type: 'console', level: 'info', message: '✅ Console interceptor active' }, '*');
              } catch (e) {
                // Silent fail
              }
            })();
          `;
          
          try {
            iframeDoc.head.appendChild(script);
            addLog('info', '✅ Console interceptor script injected');
          } catch (e) {
            addLog('error', '❌ Failed to inject script: ' + e.message);
          }
        }
      } catch (e) {
        addLog('error', `❌ Cross-origin restriction: Cannot access console from external site`);
        addLog('warn', '⚠️ Due to CORS policy, external site console logs cannot be captured');
        addLog('info', 'ℹ️ This tool works best with your own websites or local development servers');
        addLog('info', 'ℹ️ You can still see page load events and network status');
      }
    };

    const handleError = (e) => {
      setIsLoading(false);
      addLog('error', `❌ Failed to load: ${currentUrl}`);
      addLog('error', 'Possible reasons: CORS policy, invalid URL, network error, or site blocking iframe embedding');
      addLog('network', `Network error: Failed to fetch ${currentUrl}`);
    };

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
    };
  }, [currentUrl]);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'console') {
        addLog(event.data.level, event.data.message);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const filteredLogs = logs.filter(log => {
    if (!filters[log.type]) return false;
    if (searchTerm && !log.message.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getLogIcon = (type) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
      case 'warn': return <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />;
      case 'network': return <ExternalLink className="w-4 h-4 text-purple-500 flex-shrink-0" />;
      default: return <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />;
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      case 'network': return 'text-purple-400';
      default: return 'text-gray-300';
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit'
    });
  };

  // Demo function to generate test logs
  const generateTestLogs = () => {
    addLog('log', 'This is a test log message');
    addLog('warn', 'This is a test warning');
    addLog('error', 'This is a test error');
    addLog('info', 'This is a test info message');
    addLog('network', 'Network request: GET /api/data');
    addLog('log', 'Test object: ' + JSON.stringify({ id: 1, name: 'Test', data: [1, 2, 3] }, null, 2));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-3 md:p-4">
        <div className="flex items-center gap-2 md:gap-3 mb-3">
          <Terminal className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
          <h1 className="text-base md:text-xl font-bold text-white">Console Inspector</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && loadWebsite()}
            placeholder="Enter URL (e.g., example.com)"
            className="flex-1 px-3 md:px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={loadWebsite}
              disabled={isLoading}
              className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors text-sm font-medium"
            >
              <Play className="w-4 h-4" />
              {isLoading ? 'Loading...' : 'Load'}
            </button>
            <button
              onClick={generateTestLogs}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition-colors text-sm font-medium"
            >
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">Test</span>
            </button>
            <button
              onClick={() => setLogs([])}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden bg-gray-800 border-b border-gray-700 flex">
        <button
          onClick={() => setActiveTab('console')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'console' ? 'bg-gray-900 text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span className="text-sm font-medium">Console ({logs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'preview' ? 'bg-gray-900 text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'
          }`}
        >
          <Monitor className="w-4 h-4" />
          <span className="text-sm font-medium">Preview</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Website Preview */}
        <div className={`${activeTab === 'preview' ? 'flex' : 'hidden md:flex'} flex-1 bg-gray-800 relative`}>
          {currentUrl ? (
            <>
              <div className="absolute top-2 left-2 bg-gray-900 text-white px-2 py-1 rounded text-xs z-10 max-w-[calc(100%-1rem)] truncate">
                {currentUrl}
              </div>
              <iframe
                ref={iframeRef}
                className="w-full h-full"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                title="Website Preview"
              />
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center p-4">
                <Monitor className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 opacity-50" />
                <p className="text-sm md:text-base">Enter a URL to preview</p>
              </div>
            </div>
          )}
        </div>

        {/* Console Logs Panel */}
        <div className={`${activeTab === 'console' ? 'flex' : 'hidden md:flex'} w-full md:w-2/5 md:border-l border-gray-700 flex-col bg-gray-900`}>
          {/* Filters */}
          <div className="bg-gray-800 p-2 md:p-3 border-b border-gray-700">
            <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-2">
              {['log', 'warn', 'error', 'info', 'network'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilters(prev => ({ ...prev, [type]: !prev[type] }))}
                  className={`px-2 md:px-3 py-1 rounded text-xs font-medium transition-colors ${
                    filters[type]
                      ? type === 'error' ? 'bg-red-600 text-white'
                        : type === 'warn' ? 'bg-yellow-600 text-white'
                        : type === 'info' ? 'bg-blue-600 text-white'
                        : type === 'network' ? 'bg-purple-600 text-white'
                        : 'bg-gray-600 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs..."
              className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded text-xs md:text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Logs */}
          <div className="flex-1 overflow-y-auto p-2 md:p-3 font-mono text-xs">
            {filteredLogs.length === 0 ? (
              <div className="text-center text-gray-500 mt-8 px-4">
                <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="mb-2">No console logs yet</p>
                <p className="text-xs mb-4">Click "Test" to generate sample logs</p>
                <p className="text-xs text-gray-600">Or load a website to capture logs</p>
              </div>
            ) : (
              filteredLogs.map(log => (
                <div key={log.id} className="mb-2 md:mb-3 pb-2 md:pb-3 border-b border-gray-800">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600 text-xs whitespace-nowrap">{formatTime(log.timestamp)}</span>
                    {getLogIcon(log.type)}
                    <pre className={`flex-1 whitespace-pre-wrap break-words ${getLogColor(log.type)} leading-relaxed`}>
                      {log.message}
                    </pre>
                  </div>
                  {log.details && (
                    <div className="mt-1 ml-12 md:ml-16 text-gray-500 text-xs">
                      {log.details}
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>

          {/* Stats */}
          <div className="bg-gray-800 p-2 border-t border-gray-700 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Total: {logs.length}</span>
              <span>Errors: {logs.filter(l => l.type === 'error').length}</span>
              <span>Warnings: {logs.filter(l => l.type === 'warn').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}