import React from 'react';
import { ClothingItem, Outfit } from '../types';
import OutfitCard from './OutfitCard';
import { BackIcon } from './icons';

interface ItemDetailProps {
  item: ClothingItem;
  outfits: Outfit[];
  onBack: () => void;
  onOutfitClick: (outfitId: string) => void;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ item, outfits, onBack, onOutfitClick }) => {
  // Dummy handlers for drag functionality on OutfitCard, since deleting isn't needed here.
  const handleDragStart = () => {};
  const handleDragEnd = () => {};

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <button onClick={onBack} className="flex items-center text-brand-text/80 hover:text-brand-text font-medium mb-8 transition-colors">
        <BackIcon className="w-5 h-5 mr-2" />
        Back to {item.category}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border border-brand-base/50 overflow-hidden sticky top-28">
            <div className="aspect-w-1 aspect-h-1">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 text-center bg-white">
              <h2 className="text-2xl font-bold text-brand-text">{item.name}</h2>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-3xl font-serif text-brand-text mb-6 border-b border-brand-base pb-4">Worn In</h3>
          {outfits.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {outfits.map(outfit => (
                <OutfitCard 
                  key={outfit.id} 
                  outfit={outfit} 
                  onClick={() => onOutfitClick(outfit.id)}
                  onDragStart={handleDragStart} // Does nothing
                  onDragEnd={handleDragEnd} // Does nothing
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-brand-base/30 rounded-lg">
                <p className="text-brand-text/70">This item hasn't been featured in any outfits yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;