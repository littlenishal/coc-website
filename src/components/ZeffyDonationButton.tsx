
'use client';

import { useEffect } from 'react';

interface ZeffyDonationButtonProps {
  registrationUrl?: string;
  buttonText?: string;
  buttonColor?: string;
  className?: string;
}

export function ZeffyDonationButton({ 
  registrationUrl, 
  buttonText = "Donate", 
  buttonColor = "#007bff",
  className = ""
}: ZeffyDonationButtonProps) {
  useEffect(() => {
    // Add Zeffy script to document head if not already present
    if (!document.querySelector('script[src*="zeffy.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.zeffy.com/embed/js/embed.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  if (!registrationUrl) {
    return null;
  }

  return (
    <>
      <style jsx>{`
        .zeffy-btn {
          background-color: ${buttonColor};
          border: none;
          border-radius: 5px;
          box-sizing: border-box;
          color: white;
          cursor: pointer;
          margin: 10px;
          min-height: 50px;
          min-width: 150px;
          padding: 5px 10px;
          text-transform: uppercase;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          transition: background-color 0.2s ease;
        }
        .zeffy-btn:hover {
          opacity: 0.9;
        }
      `}</style>
      <button 
        className={`zeffy-btn ${className}`}
        zeffy-form-link={registrationUrl}
      >
        {buttonText}
      </button>
    </>
  );
}
