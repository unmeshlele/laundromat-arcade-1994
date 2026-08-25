import React from 'react';

interface CRTOverlayProps {
  isActive: boolean;
}

export const CRTOverlay: React.FC<CRTOverlayProps> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <>
      <div className="crt-overlay crt-flicker" />
      <div className="crt-vignette" />
    </>
  );
};
