import React, { useState, useRef, useEffect } from 'react';
import { downloadCanvasToImage } from '../config/helpers';

const ExportFormatSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Format options
  const formats = [
    { id: 'png', name: 'PNG Image', quality: 'Lossless', ext: '.png', type: 'image' },
    { id: 'jpeg', name: 'JPEG Image', quality: 'High Quality', ext: '.jpg', type: 'image' },
    { id: 'json', name: 'Design Data', quality: 'For importing later', ext: '.json', type: 'data' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleExport = (format) => {
    // Generate a filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const filename = `tshirt-design-${timestamp}${format.ext}`;
    
    if (format.type === 'image') {
      // Download the canvas as an image
      downloadCanvasToImage(filename, format.id);
    } else if (format.type === 'data') {
      // Export design data as JSON
      const { proxy } = require('valtio');
      const state = require('../store').default;
      const snap = proxy(state);
      
      // Create design data object
      const designData = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        color: snap.color,
        isLogoTexture: snap.isLogoTexture,
        isFullTexture: snap.isFullTexture,
        logoDecal: snap.logoDecal,
        fullDecal: snap.fullDecal
      };
      
      // Create and download JSON file
      const jsonString = JSON.stringify(designData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      URL.revokeObjectURL(url);
    }
    
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export Design
        <svg className={`w-4 h-4 ml-1 transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="origin-bottom-right absolute right-0 bottom-full mb-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            {formats.map((format) => (
              <button
                key={format.id}
                className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleExport(format)}
              >
                <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <div className="flex-1">
                  <p className="font-medium">{format.name}</p>
                  <p className="text-xs text-gray-500">{format.quality}</p>
                </div>
                <span className="text-xs text-gray-500">{format.ext}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportFormatSelector;
