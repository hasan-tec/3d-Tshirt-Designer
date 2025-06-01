import React from 'react';

export const CircularProgress = ({ size = 40, color = '#6366f1', trackColor = '#e2e8f0' }) => {
  return (
    <div className="relative flex justify-center items-center">
      <div 
        className="animate-spin rounded-full border-t-2 border-b-2 border-solid"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderColor: trackColor,
          borderTopColor: color,
        }}
      />
    </div>
  );
};

export default CircularProgress;
