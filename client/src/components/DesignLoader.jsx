import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import state from '../store';
import { CustomButton } from '../components';

const DesignLoader = ({ design, onClose }) => {
  const [loading, setLoading] = useState(false);
  const snap = useSnapshot(state);
  const navigate = useNavigate();

  const handleLoadDesign = async () => {
    setLoading(true);
    
    try {
      // Apply the design data to the current state
      state.color = design.design_data.color || '#EFBD48';
      state.isLogoTexture = design.design_data.isLogoTexture || false;
      state.isFullTexture = design.design_data.isFullTexture || false;
      state.logoDecal = design.design_data.logoDecal || './threejs.png';
      state.fullDecal = design.design_data.fullDecal || './threejs.png';
      
      // Return to the main customizer page
      navigate('/');
    } catch (error) {
      console.error('Error loading design:', error);
    } finally {
      setLoading(false);
      if (onClose) onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Load Design</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4">
            You are about to load the design "{design.name}". This will replace your current design.
          </p>
          
          <div className="bg-gray-100 rounded-lg p-4">
            <div 
              className="w-full h-32 mb-4 rounded-md" 
              style={{
                backgroundColor: design.design_data.color || '#EFBD48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img 
                src={design.design_data.isLogoTexture ? design.design_data.logoDecal : design.design_data.fullDecal}
                alt={design.name}
                className="max-h-20 max-w-20 object-contain"
                style={{
                  opacity: design.design_data.isLogoTexture || design.design_data.isFullTexture ? 1 : 0,
                }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-gray-500">Created:</div>
              <div className="font-medium text-gray-700">{new Date(design.created_at).toLocaleString()}</div>
              
              <div className="text-gray-500">Design type:</div>
              <div className="font-medium text-gray-700">
                {design.design_data.isLogoTexture ? 'Logo' : design.design_data.isFullTexture ? 'Full Texture' : 'Plain'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <CustomButton
            type="outline"
            title="Cancel"
            handleClick={onClose}
            customStyles="flex-1 py-2"
          />
          <CustomButton
            type="filled"
            title={loading ? 'Loading...' : 'Load Design'}
            handleClick={handleLoadDesign}
            disabled={loading}
            customStyles="flex-1 py-2"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DesignLoader;
