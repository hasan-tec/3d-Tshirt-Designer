import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CustomButton, CircularProgress, DesignLoader, DesignThumbnail } from '../components';
import { fadeAnimation, slideAnimation } from '../config/motion';

const SavedDesigns = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDesign, setSelectedDesign] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Fetch saved designs
    const fetchDesigns = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/designs/my-designs');
        setDesigns(response.data.designs);
      } catch (err) {
        console.error('Error fetching designs:', err);
        setError(err.response?.data?.message || 'Failed to load designs');
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, [isAuthenticated, navigate]);
  const handleLoadDesign = (design) => {
    setSelectedDesign(design);
  };

  const handleDeleteDesign = async (designId) => {
    if (!confirm('Are you sure you want to delete this design?')) return;
    
    try {
      await axios.delete(`http://localhost:8080/api/v1/designs/${designId}`);
      // Remove the deleted design from state
      setDesigns(designs.filter(design => design.id !== designId));
    } catch (err) {
      console.error('Error deleting design:', err);
      alert(err.response?.data?.message || 'Failed to delete design');
    }
  };

  return (
    <motion.div
      className="saved-designs-page"
      {...slideAnimation('up')}
    >
      {/* Header */}
      <motion.header
        className="bg-white shadow-md p-4 flex justify-between items-center"
        {...fadeAnimation}
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">My Saved Designs</h1>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        className="container mx-auto p-4 md:p-8"
        {...fadeAnimation}
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2h4l2-3h4l2 3h4a2 2 0 012 2z" />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-700">No designs yet</h2>
            <p className="mt-2 text-gray-600">Your saved designs will appear here</p>
            <CustomButton
              type="filled"
              title="Create Your First Design"
              handleClick={() => navigate('/')}
              customStyles="mt-6"
            />
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Your Design Collection</h2>
            
            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map((design) => (
                <motion.div
                  key={design.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >                  <div 
                    className="h-64 relative cursor-pointer"
                    onClick={() => handleLoadDesign(design)}
                  >                    {/* T-shirt preview using the DesignThumbnail component */}
                    <div className="w-full h-full">
                      <DesignThumbnail design={design} size={256} />
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                      <span className="text-white font-medium bg-black bg-opacity-50 px-4 py-2 rounded">
                        Open Design
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800 truncate">{design.name}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(design.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => {
                          const canvas = document.createElement("canvas");
                          canvas.width = 1024;
                          canvas.height = 1024;
                          
                          // This is a placeholder. In a real implementation,
                          // you'd render the T-shirt to this canvas using Three.js
                          const ctx = canvas.getContext("2d");
                          ctx.fillStyle = design.design_data.color;
                          ctx.fillRect(0, 0, 1024, 1024);
                          
                          // For now we'll use a simple colored rectangle with the name as text
                          ctx.fillStyle = "#ffffff";
                          ctx.font = "48px Arial";
                          ctx.fillText(design.name, 100, 512);
                          
                          const link = document.createElement("a");
                          link.download = `${design.name}.png`;
                          link.href = canvas.toDataURL("image/png");
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export
                      </button>
                      
                      <button
                        onClick={() => handleDeleteDesign(design.id)}
                        className="text-sm text-red-500 hover:text-red-700 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}      </motion.main>
      
      {/* Design Loader Modal */}
      {selectedDesign && (
        <DesignLoader 
          design={selectedDesign}
          onClose={() => setSelectedDesign(null)}
        />
      )}
    </motion.div>
  );
};

export default SavedDesigns;
