import React from 'react';
import { ClothingItem, Outfit, Category } from '../types';
import ItemCard from './ItemCard';
import OutfitCard from './OutfitCard';
import { PlusIcon } from './icons';

interface ItemGridProps {
  items: (ClothingItem | Outfit)[];
  category: Category;
  deletedItemIds: Set<string>;
  showAddButton: boolean;
  onItemClick: (id: string) => void;
  onAddClick: () => void;
  onDragStart: (id: string, category: Category) => void;
  onDragEnd: () => void;
}

const ItemGrid: React.FC<ItemGridProps> = ({ items, category, deletedItemIds, showAddButton, onItemClick, onAddClick, onDragStart, onDragEnd }) => {
  const isOutfitCategory = category === Category.Outfits;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12 sm:gap-x-8">
        {items.map((item, index) => {
          const cardStyle = { '--card-delay': `${index * 50}ms` } as React.CSSProperties;
          const isDeleting = deletedItemIds.has(item.id);
          const animationClass = `card-animate ${isDeleting ? 'item-deleting' : ''}`;

          // Outfits should still have a card-like feel because they have backgrounds
          if (isOutfitCategory || (item as Outfit).description !== undefined) {
             return (
                 <OutfitCard 
                  key={item.id} 
                  outfit={item as Outfit} 
                  onClick={() => onItemClick(item.id)} 
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  style={cardStyle}
                  className={animationClass}
                />
             )
          }

          // Clothing items get the new transparent treatment
          return (
            <ItemCard 
              key={item.id} 
              item={item as ClothingItem} 
              onClick={() => onItemClick(item.id)}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              style={cardStyle}
              className={animationClass}
            />
          )
        })}
        {showAddButton && (
          <button
            onClick={onAddClick}
            className="flex items-center justify-center border-2 border-dashed border-brand-base rounded-xl text-brand-text/50 hover:bg-brand-base/40 hover:border-brand-brown hover:text-brand-brown transition-colors aspect-w-1 aspect-h-1 card-animate"
            style={{ '--card-delay': `${items.length * 50}ms` } as React.CSSProperties}
            aria-label={`Add new ${isOutfitCategory ? 'Outfit' : 'Item'}`}
          >
            <div className="text-center">
              <PlusIcon className="w-12 h-12 mx-auto" />
              <span className="mt-2 block text-sm font-medium">Add {isOutfitCategory ? 'Outfit' : 'Item'}</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemGrid;