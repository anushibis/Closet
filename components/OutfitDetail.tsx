import React from 'react';
import { Outfit, ClothingItem } from '../types';
import { BackIcon } from './icons';

interface OutfitDetailProps {
  outfit: Outfit;
  clothingItems: ClothingItem[];
  onBack: () => void;
  onItemClick: (itemId: string) => void;
}

const OutfitDetail: React.FC<OutfitDetailProps> = ({ outfit, clothingItems, onBack, onItemClick }) => {
  const findItem = (id: string | null) => id ? clothingItems.find(item => item.id === id) : null;
  
  const top = findItem(outfit.topId);
  const bottom = findItem(outfit.bottomId);
  const extra = findItem(outfit.extraId);

  const linkedItems = [
    { label: 'Top', item: top },
    { label: 'Bottom', item: bottom },
    { label: 'Extra', item: extra }
  ].filter(i => i.item);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
       <div className="mb-8">
        <button onClick={onBack} className="flex items-center text-brand-text/80 hover:text-brand-text font-medium transition-colors">
          <BackIcon className="w-5 h-5 mr-2" />
          Back to Outfits
        </button>
      </div>

      <div className="bg-white rounded-xl border border-brand-base/50 overflow-hidden max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-3">
            <div className="aspect-w-4 aspect-h-5">
                <img src={outfit.imageUrl} alt={outfit.name} className="object-cover w-full h-full" />
            </div>
          </div>
          <div className="md:col-span-2 p-8 lg:p-12 flex flex-col bg-brand-surface/50">
            <h2 className="text-4xl font-serif text-brand-text mb-6">{outfit.name}</h2>
            <div className="space-y-6 flex-grow">
              {linkedItems.map(({ label, item }) => item && (
                <div key={item.id}>
                  <h4 className="text-sm font-medium text-brand-text/60 uppercase tracking-wider mb-1">{label}</h4>
                  <button 
                    onClick={() => onItemClick(item.id)}
                    className="text-lg text-brand-brown hover:underline font-medium"
                  >
                    {item.name}
                  </button>
                </div>
              ))}
            </div>
            {outfit.description && (
                <div className="mt-8 pt-6 border-t border-brand-base">
                    <h4 className="text-sm font-medium text-brand-text/60 uppercase tracking-wider mb-2">AI Notes</h4>
                    <p className="text-brand-text italic leading-relaxed">"{outfit.description}"</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitDetail;