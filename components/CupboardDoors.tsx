import React from 'react';

interface CupboardDoorsProps {
  isOpen: boolean;
}

const CupboardDoors: React.FC<CupboardDoorsProps> = ({ isOpen }) => {
  const doorClasses = 'fixed top-0 w-1/2 h-screen bg-brand-base z-30 transition-transform duration-1000 ease-in-out border-brand-surface';

  return (
    <>
      {/* Left Door */}
      <div 
        className={`${doorClasses} left-0 border-r-2`}
        style={{ transform: isOpen ? 'translateX(-100%)' : 'translateX(0)' }}
      ></div>
      {/* Right Door */}
      <div 
        className={`${doorClasses} right-0 border-l-2`}
        style={{ transform: isOpen ? 'translateX(100%)' : 'translateX(0)' }}
      ></div>
    </>
  );
};

export default CupboardDoors;
