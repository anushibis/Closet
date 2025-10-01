import React from 'react';
import { Outfit, Category } from '../types';

interface OutfitCardProps {
  outfit: Outfit;
  onClick: () => void;
  onDragStart: (id: string, category: Category) => void;
  onDragEnd: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const OutfitCard: React.FC<OutfitCardProps> = ({ outfit, onClick, onDragStart, onDragEnd, style, className = '' }) => {
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(outfit.id, Category.Outfits);
  }

  return (
    <div 
      className={`cursor-pointer group ${className}`}
      onClick={onClick}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      style={style}
    >
      <div className="aspect-w-1 aspect-h-1 w-full relative overflow-hidden rounded-xl bg-white border border-brand-base/30 shadow-sm group-hover:shadow-xl transition-shadow duration-300">
         <img 
          src={outfit.imageUrl} 
          alt={outfit.name} 
          className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105"
        />
      </div>
      <div className="pt-4 text-center">
        <h3 className="text-brand-text font-medium truncate group-hover:text-brand-dark transition-colors">
          {outfit.name}
        </h3>
      </div>
    </div>
  );
};

export default OutfitCard;