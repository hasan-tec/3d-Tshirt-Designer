import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import config from '../config/config';
import state from '../store';
import { download } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { 
  AIPicker, 
  ColorPicker, 
  CustomButton, 
  FilePicker, 
  Tab, 
  AuthModal, 
  UserProfileDropdown, 
  SaveDesignModal,
  ExportFormatSelector
} from '../components';
import { useAuth } from '../context/AuthContext';

const Customizer = () => {
  const snap = useSnapshot(state);
  const { isAuthenticated } = useAuth();

  const [file, setFile] = useState('');

  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);

  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  })
  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  // show tab content depending on the activeTab
  const generateTabContent = () => {
    // Don't show tab content if user is not authenticated
    if (!isAuthenticated) return null;
    
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />
      case "filepicker":
        return <FilePicker
          file={file}
          setFile={setFile}
          readFile={readFile}
        />
      case "aipicker":
        return <AIPicker 
          prompt={prompt}
          setPrompt={setPrompt}
          generatingImg={generatingImg}
          handleSubmit={handleSubmit}
        />
      default:
        return null;
    }
  }

  const handleSubmit = async (type) => {
    if(!prompt) return alert("Please enter a prompt");

    try {
      setGeneratingImg(true);

      const response = await fetch('http://localhost:8080/api/v1/dalle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
        })
      })

      const data = await response.json();

      handleDecals(type, `data:image/png;base64,${data.photo}`)
    } catch (error) {
      alert(error)
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  }

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;

    if(!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab)
    }
  }
  const handleActiveFilterTab = (tabName) => {
    // Don't allow filter tab changes if user is not authenticated
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    switch (tabName) {
      case "logoShirt":
          state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
          state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    // after setting the state, activeFilterTab is updated

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

  const readFile = (type) => {
    reader(file)
      .then((result) => {
        handleDecals(type, result);
        setActiveEditorTab("");
      })
  }
  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          {/* Login required overlay for 3D model area */}
          {!isAuthenticated && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-lg p-6 shadow-xl max-w-sm mx-4 pointer-events-auto"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Login Required</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Please login to customize your T-shirt design and access all features.
                  </p>
                  <CustomButton
                    type="filled"
                    title="Login Now"
                    handleClick={() => setShowAuthModal(true)}
                    customStyles="w-full"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}

          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation('left')}
          ><div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <div key={tab.name} className="relative group">
                    <Tab 
                      tab={tab}
                      handleClick={() => {
                        if (!isAuthenticated) {
                          setShowAuthModal(true);
                        } else {
                          setActiveEditorTab(tab.name);
                        }
                      }}
                      disabled={!isAuthenticated}
                    />
                    {/* Login tooltip for disabled tabs */}
                    {!isAuthenticated && (
                      <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        Please login to customize
                      </div>
                    )}
                  </div>
                ))}

                {generateTabContent()}
              </div>
            </div>
          </motion.div>          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <div className="flex items-center space-x-3">
              {/* User Authentication Section */}
              {isAuthenticated ? (
                <UserProfileDropdown />
              ) : (
                <CustomButton 
                  type="outline"
                  title="Login"
                  handleClick={() => setShowAuthModal(true)}
                  customStyles="w-fit px-4 py-2.5 font-bold text-sm"
                />
              )}

              {/* Go Back Button */}
              <CustomButton 
                type="filled"
                title="Go Back"
                handleClick={() => state.intro = true}
                customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              />
            </div>
          </motion.div>          <motion.div
            className='filtertabs-container'
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <div key={tab.name} className="relative group">
                <Tab
                  tab={tab}
                  isFilterTab
                  isActiveTab={activeFilterTab[tab.name]}
                  handleClick={() => handleActiveFilterTab(tab.name)}
                  disabled={!isAuthenticated}
                />
                {/* Login tooltip for disabled filter tabs */}
                {!isAuthenticated && (
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    Please login to customize
                  </div>
                )}
              </div>
            ))}            {/* Save Design Button - only show if authenticated */}
            {isAuthenticated && (
              <div className="filtertab">
                <CustomButton
                  type="filled"
                  title="Save Design"
                  handleClick={() => setShowSaveModal(true)}
                  customStyles="text-xs py-2 px-3"
                />
              </div>
            )}
              {/* Export Format Selector - available to all users */}
            <div className="filtertab">
              <ExportFormatSelector />
            </div>
            </motion.div>          {/* Authentication Modal */}
          <AuthModal 
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            initialMode="login"
          />

          {/* Save Design Modal */}
          <SaveDesignModal 
            isOpen={showSaveModal}
            onClose={() => setShowSaveModal(false)}
          />
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer