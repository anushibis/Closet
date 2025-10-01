import React, { useState, useEffect } from 'react';
import { Outfit, ClothingItem, Category } from '../types';
import { CloseIcon, SpinnerIcon } from './icons';
import { removeImageBackground } from '../services/imageService';

interface AddOutfitFormProps {
  clothingItems: ClothingItem[];
  onClose: () => void;
  onAddOutfit: (outfit: Omit<Outfit, 'id'>) => void;
}

const AddOutfitForm: React.FC<AddOutfitFormProps> = ({ clothingItems, onClose, onAddOutfit }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [topId, setTopId] = useState<string | null>(null);
  const [bottomId, setBottomId] = useState<string | null>(null);
  const [extraId, setExtraId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Match duration of closing animation
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(null);
      setIsProcessingImage(true);

      try {
        const processedImageUrl = await removeImageBackground(file);
        setPreview(processedImageUrl);
      } catch (error) {
        console.error("Failed to process image:", error);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && preview && !isProcessingImage) {
      onAddOutfit({ name, imageUrl: preview, topId, bottomId, extraId, description });
    }
  };

  const tops = clothingItems.filter(item => item.category === Category.Tops);
  const bottoms = clothingItems.filter(item => item.category === Category.Bottoms);
  const extras = clothingItems.filter(item => item.category === Category.Extra);

  const inputStyles = "w-full px-3 py-2 border border-brand-base rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-brown focus:border-brand-brown bg-white";
  const transitionClasses = 'transition-all duration-300 ease-in-out';

  return (
    <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4 ${isClosing ? 'opacity-0' : 'opacity-100'} ${transitionClasses}`} onClick={handleClose}>
      <div 
        className={`bg-brand-surface rounded-lg shadow-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto border border-brand-base/50 ${isClosing ? 'scale-95' : 'scale-100'} ${transitionClasses}`}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-3 right-3 text-brand-text/50 hover:text-brand-text z-10">
          <CloseIcon className="w-6 h-6" />
        </button>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-brand-text">Add New Outfit</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="outfit-name" className="block text-sm font-medium text-brand-text mb-1">Outfit Name</label>
              <input type="text" id="outfit-name" value={name} onChange={(e) => setName(e.target.value)} className={inputStyles} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">Outfit Image</label>
              <div className="mt-1 flex justify-center items-center p-2 border-2 border-brand-base border-dashed rounded-md min-h-[10rem] relative">
                  {isProcessingImage && (
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-brand-base/50 text-brand-text rounded-md">
                      <SpinnerIcon className="w-8 h-8 text-brand-dark" />
                      <p className="mt-2 text-sm font-medium">Removing background...</p>
                    </div>
                  )}
                  {preview && !isProcessingImage ? (
                    <img src={preview} alt="Preview" className="mx-auto h-40 w-40 object-contain rounded-md" />
                  ) : (
                     !isProcessingImage && <p className="text-sm text-brand-text/50">Image preview will appear here</p>
                  )}
              </div>
              <input type="file" onChange={handleImageChange} className="mt-2 block w-full text-sm text-brand-text/80 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-base file:text-brand-dark hover:file:bg-brand-base/80" accept="image/*" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="top" className="block text-sm font-medium text-brand-text mb-1">Top</label>
                <select id="top" value={topId || ''} onChange={(e) => setTopId(e.target.value || null)} className={inputStyles}>
                  <option value="">None</option>
                  {tops.map(top => <option key={top.id} value={top.id}>{top.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="bottom" className="block text-sm font-medium text-brand-text mb-1">Bottom</label>
                <select id="bottom" value={bottomId || ''} onChange={(e) => setBottomId(e.target.value || null)} className={inputStyles}>
                  <option value="">None</option>
                  {bottoms.map(bottom => <option key={bottom.id} value={bottom.id}>{bottom.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="extra" className="block text-sm font-medium text-brand-text mb-1">Extra</label>
                <select id="extra" value={extraId || ''} onChange={(e) => setExtraId(e.target.value || null)} className={inputStyles}>
                  <option value="">None</option>
                  {extras.map(extra => <option key={extra.id} value={extra.id}>{extra.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-brand-text mb-1">AI Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputStyles} placeholder="e.g., Cozy for a rainy day, confident for a big meeting..."></textarea>
              <p className="text-xs text-brand-text/60 mt-1">Help the AI learn when to recommend this outfit.</p>
            </div>
            
            <button 
              type="submit" 
              disabled={isProcessingImage}
              className="w-full bg-brand-brown text-white py-2.5 px-4 rounded-md hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-brown transition-colors disabled:bg-brand-dark/50 disabled:cursor-not-allowed"
            >
              {isProcessingImage ? 'Processing Image...' : 'Add Outfit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOutfitForm;
