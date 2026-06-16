import React from 'react';

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Background Backdrop Layer */}
      {isOpen && <div className="offcanvas-backdrop fade show" onClick={onClose}></div>}
      
      <div className={`offcanvas offcanvas-start ${isOpen ? 'show' : ''}`} tabIndex="-1" style={{ visibility: isOpen ? 'visible' : 'hidden' }}>
        <div className="offcanvas-header">
          <h5 className="brand-name">मेनु</h5>
          <button type="button" className="btn-close text-reset" onClick={onClose}></button>
        </div>
        <div className="offcanvas-body p-0">
          <a href="https://aajakosamachar.ayushacharya5.com.np/app/about.html" className="nav-link-custom mx-3">
            <i className="fas fa-info-circle"></i> हाम्रो बारेमा
          </a>
          <a href="https://aajakosamachar.ayushacharya5.com.np/app/support.html" className="nav-link-custom mx-3">
            <i className="fas fa-headset"></i> सहयोग
          </a>
        </div>
      </div>
    </>
  );
}
