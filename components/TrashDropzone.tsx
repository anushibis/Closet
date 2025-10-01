import React, { useState } from 'react';
import { TrashIcon } from './icons';

interface TrashDropzoneProps {
  isDragging: boolean;
  onDrop: () => void;
}

const TrashDropzone: React.FC<TrashDropzoneProps> = ({ isDragging, onDrop }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    onDrop();
  };

  return (
    <div 
      className={`fixed inset-x-0 bottom-0 z-50 transition-all duration-300 transform ${isDragging ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="relative h-48 w-full"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/80 to-transparent"></div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className={`flex items-center justify-center w-24 h-24 bg-white/80 backdrop-blur-lg rounded-full border-2 transition-all duration-300 ${isOver ? 'bg-brand-brown/80 border-brand-dark scale-125' : 'border-brand-base'}`}>
            <TrashIcon className={`w-10 h-10 transition-colors duration-300 ${isOver ? 'text-white' : 'text-brand-text/70'}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrashDropzone;
