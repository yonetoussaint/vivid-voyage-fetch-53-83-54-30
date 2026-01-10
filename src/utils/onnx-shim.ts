// src/utils/onnx-shim.js
// This is a shim that provides onnxruntime-web functionality
// It will use the global `ort` object from CDN at runtime

export default {
  // Provide a minimal API that Transformers.js expects
  InferenceSession: {
    create: async (modelPath, options) => {
      if (typeof window === 'undefined' || !window.ort) {
        throw new Error('ONNX Runtime Web not loaded. Please ensure the CDN script is included.');
      }
      return window.ort.InferenceSession.create(modelPath, options);
    }
  },
  
  // You can add more exports as needed by Transformers.js
  Tensor: class {
    constructor(data, dims, type) {
      if (window.ort && window.ort.Tensor) {
        return new window.ort.Tensor(data, dims, type);
      }
      throw new Error('ONNX Runtime Web not available');
    }
  }
};