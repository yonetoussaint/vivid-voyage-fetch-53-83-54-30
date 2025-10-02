import React, { useState, useRef } from 'react';
import { Upload, X, Eye, FileText, AlertCircle } from 'lucide-react';

const ProductDescriptionUpload = () => {
  const [htmlContent, setHtmlContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');


  const handleFileUpload = (file) => {
    setError('');

    if (!file) return;

    // Check file type
    if (!file.name.toLowerCase().endsWith('.html') && !file.name.toLowerCase().endsWith('.htm')) {
      setError('Please upload only HTML files (.html or .htm)');
      return;
    }

    // Check file size (limit to 1MB)
    if (file.size > 1024 * 1024) {
      setError('File size must be less than 1MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setHtmlContent(e.target.result);
      setFileName(file.name);
      setIsPreviewMode(true);
    };
    reader.onerror = () => {
      setError('Error reading file. Please try again.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  const clearUpload = () => {
    setHtmlContent('');
    setFileName('');
    setIsPreviewMode(false);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Description</h2>
        <p className="text-gray-600">Upload an HTML file to create a rich product description</p>
      </div>

      {!htmlContent ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload HTML File</h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your HTML file here, or click to browse
          </p>
          <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
            <FileText className="w-4 h-4 mr-2" />
            Choose File
            <input
              type="file"
              accept=".html,.htm"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
          <p className="text-sm text-gray-500 mt-2">
            Supports HTML files up to 1MB
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* File info and controls */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-900">{fileName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={togglePreview}
                className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                <Eye className="w-4 h-4 mr-1" />
                {isPreviewMode ? 'Show Code' : 'Preview'}
              </button>
              <button
                onClick={clearUpload}
                className="inline-flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </button>
            </div>
          </div>

          {/* Content display */}
          <div className="border rounded-lg overflow-hidden">
            {isPreviewMode ? (
              <div className="bg-white">
                <div className="p-3 bg-gray-100 border-b">
                  <h4 className="text-sm font-medium text-gray-700">Preview</h4>
                </div>
                <div 
                  className="p-6 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </div>
            ) : (
              <div className="bg-gray-900 text-green-400">
                <div className="p-3 bg-gray-800 border-b border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300">HTML Code</h4>
                </div>
                <pre className="p-4 text-xs overflow-auto max-h-96 leading-relaxed">
                  <code>{htmlContent}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Usage instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">HTML Upload Guidelines</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Upload clean HTML with inline CSS or external stylesheet links</li>
          <li>• Include images using absolute URLs or base64 encoding</li>
          <li>• Keep file size under 1MB for optimal performance</li>
          <li>• Test your HTML in preview mode before saving</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDescriptionUpload;


