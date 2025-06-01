import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSnapshot } from 'valtio';
import state from '../store';
import axios from 'axios';
import CustomButton from './CustomButton';

const SaveDesignModal = ({ isOpen, onClose }) => {
  const [designName, setDesignName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const snap = useSnapshot(state);

  const handleSave = async () => {
    if (!designName.trim()) {
      setError('Please enter a design name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const designData = {
        color: snap.color,
        logoDecal: snap.logoDecal,
        fullDecal: snap.fullDecal,
        isLogoTexture: snap.isLogoTexture,
        isFullTexture: snap.isFullTexture,
      };

      await axios.post('http://localhost:8080/api/v1/designs/save', {
        designName: designName.trim(),
        designData,
      });

      setDesignName('');
      onClose();
      // You could add a success notification here
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save design');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !isAuthenticated) return null;

  return (
    <AnimatePresence>
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
            <h2 className="text-xl font-bold text-gray-800">Save Design</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Design Name
            </label>
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a name for your design"
              maxLength={50}
            />
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
              title={loading ? 'Saving...' : 'Save Design'}
              handleClick={handleSave}
              disabled={loading}
              customStyles="flex-1 py-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SaveDesignModal;
