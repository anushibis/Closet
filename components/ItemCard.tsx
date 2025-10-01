import React from 'react';
import { ClothingItem, Category } from '../types';

interface ItemCardProps {
  item: ClothingItem;
  onClick: () => void;
  onDragStart: (id: string, category: Category) => void;
  onDragEnd: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick, onDragStart, onDragEnd, style, className = '' }) => {
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(item.id, item.category);
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
      <div className="aspect-w-1 aspect-h-1 w-full relative">
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="w-full h-full object-contain object-center transition-all duration-300 group-hover:scale-105"
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))', transition: 'filter 0.3s ease, transform 0.3s ease' }}
        />
        <div 
          className="absolute inset-0 transition-all duration-300 opacity-0 group-hover:opacity-100" 
          style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}
        ></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <h3 className="text-white text-center font-medium truncate">
                {item.name}
            </h3>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;