import React from 'react'
import { useSnapshot } from 'valtio'

import state from '../store';

const Tab = ({ tab, isFilterTab, isActiveTab, handleClick, disabled = false }) => {
  const snap = useSnapshot(state);

  const activeStyles = isFilterTab && isActiveTab 
    ? { backgroundColor: snap.color, opacity: 0.5 }
    : { backgroundColor: "transparent", opacity: 1 }

  const disabledStyles = disabled 
    ? { 
        backgroundColor: "#f3f4f6", 
        opacity: 0.5,
        filter: "grayscale(100%)"
      } 
    : {};

  const combinedStyles = disabled ? disabledStyles : activeStyles;

  return (
    <div
      key={tab.name}
      className={`tab-btn ${isFilterTab ? 'rounded-full glassmorphism' : 'rounded-4'} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      style={combinedStyles}
      title={disabled ? "Please login to use this feature" : ""}
    >
      <img 
        src={tab.icon}
        alt={tab.name}
        className={`${isFilterTab ? 'w-2/3 h-2/3' : 'w-11/12 h-11/12 object-contain'} ${disabled ? 'filter grayscale' : ''}`}
      />
    </div>
  )
}

export default Tab