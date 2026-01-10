import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Play, Trash2, AlertCircle, AlertTriangle, Info, FileText, ExternalLink } from 'lucide-react';

export default function WebsiteConsoleInspector() {
  const [url, setUrl] = useState('');
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
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
    setLogs(prev => [...prev, {
      id: Date.now() + Math.random(),
      type,
      message,
      details,
      timestamp: new Date()
    }]);
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
    addLog('info', `Loading: ${finalUrl}`);

    // Setup iframe with console capture
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.src = finalUrl;
    }
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIsLoading(false);
      addLog('info', `✓ Page loaded successfully`);

      try {
        // Try to inject console interceptor
        const iframeWindow = iframe.contentWindow;
        const iframeDoc = iframe.contentDocument;

        if (iframeWindow && iframeDoc) {
          // Inject script to capture console
          const script = iframeDoc.createElement('script');
          script.textContent = `
            (function() {
              const originalLog = console.log;
              const originalWarn = console.warn;
              const originalError = console.error;
              const originalInfo = console.info;

              console.log = function(...args) {
                originalLog.apply(console, args);
                window.parent.postMessage({
                  type: 'console',
                  level: 'log',
                  message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')
                }, '*');
              };

              console.warn = function(...args) {
                originalWarn.apply(console, args);
                window.parent.postMessage({
                  type: 'console',
                  level: 'warn',
                  message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')
                }, '*');
              };

              console.error = function(...args) {
                originalError.apply(console, args);
                window.parent.postMessage({
                  type: 'console',
                  level: 'error',
                  message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')
                }, '*');
              };

              console.info = function(...args) {
                originalInfo.apply(console, args);
                window.parent.postMessage({
                  type: 'console',
                  level: 'info',
                  message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')
                }, '*');
              };

              window.addEventListener('error', function(e) {
                window.parent.postMessage({
                  type: 'console',
                  level: 'error',
                  message: e.message + ' at ' + e.filename + ':' + e.lineno + ':' + e.colno
                }, '*');
              });

              window.addEventListener('unhandledrejection', function(e) {
                window.parent.postMessage({
                  type: 'console',
                  level: 'error',
                  message: 'Unhandled Promise Rejection: ' + e.reason
                }, '*');
              });
            })();
          `;
          iframeDoc.head.appendChild(script);
        }
      } catch (e) {
        addLog('error', `Cross-origin restriction: Cannot access console from ${currentUrl}`);
        addLog('warn', 'Due to CORS policy, console logs from cross-origin sites cannot be captured.');
        addLog('info', 'You can still see network errors and page load status.');
      }
    };

    const handleError = () => {
      setIsLoading(false);
      addLog('error', `Failed to load: ${currentUrl}`);
      addLog('error', 'Possible reasons: CORS policy, invalid URL, or network error');
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
      if (event.data.type === 'console') {
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
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warn': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      case 'network': return <ExternalLink className="w-4 h-4 text-purple-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'error': return 'text-red-600';
      case 'warn': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      case 'network': return 'text-purple-600';
      default: return 'text-gray-700';
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

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Terminal className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Website Console Inspector</h1>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && loadWebsite()}
              placeholder="Enter website URL (e.g., example.com or https://example.com)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={loadWebsite}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4" />
              {isLoading ? 'Loading...' : 'Load'}
            </button>
            <button
              onClick={() => setLogs([])}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Website Preview */}
        <div className="flex-1 bg-white border-r border-gray-200 relative">
          {currentUrl ? (
            <>
              <div className="absolute top-2 left-2 bg-gray-900 text-white px-3 py-1 rounded text-sm z-10">
                Preview: {currentUrl}
              </div>
              <iframe
                ref={iframeRef}
                className="w-full h-full"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                title="Website Preview"
              />
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Terminal className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Enter a URL above to inspect console logs</p>
              </div>
            </div>
          )}
        </div>

        {/* Console Logs Panel */}
        <div className="w-2/5 flex flex-col bg-gray-900">
          {/* Filters */}
          <div className="bg-gray-800 p-3 border-b border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              {['log', 'warn', 'error', 'info', 'network'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilters(prev => ({ ...prev, [type]: !prev[type] }))}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
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
              className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Logs */}
          <div className="flex-1 overflow-y-auto p-3 font-mono text-xs">
            {filteredLogs.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No console logs yet...</p>
                <p className="text-xs mt-2">Load a website to see logs</p>
              </div>
            ) : (
              filteredLogs.map(log => (
                <div key={log.id} className="mb-3 pb-3 border-b border-gray-800">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600 text-xs whitespace-nowrap">{formatTime(log.timestamp)}</span>
                    {getLogIcon(log.type)}
                    <pre className={`flex-1 whitespace-pre-wrap break-words ${getLogColor(log.type)}`}>
                      {log.message}
                    </pre>
                  </div>
                  {log.details && (
                    <div className="mt-1 ml-16 text-gray-500 text-xs">
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