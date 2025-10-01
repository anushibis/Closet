import React, { useState, useEffect } from 'react';
import { Category, ClothingItem } from '../types';
import { CloseIcon, SpinnerIcon } from './icons';
import { removeImageBackground } from '../services/imageService';

interface AddItemFormProps {
  category: Category.Tops | Category.Bottoms | Category.Extra;
  onClose: () => void;
  onAddItem: (item: Omit<ClothingItem, 'id'>) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ category, onClose, onAddItem }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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
      setPreview(null); // Clear previous preview
      setIsProcessingImage(true);

      try {
        const processedImageUrl = await removeImageBackground(file);
        setPreview(processedImageUrl);
      } catch (error) {
        console.error("Failed to process image:", error);
        // On failure, show the original image as a fallback.
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
      onAddItem({ name, imageUrl: preview, category });
    }
  };

  const transitionClasses = 'transition-all duration-300 ease-in-out';
  const inputStyles = "w-full px-3 py-2 border border-brand-base rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-brown focus:border-brand-brown";

  return (
    <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4 ${isClosing ? 'opacity-0' : 'opacity-100'} ${transitionClasses}`} onClick={handleClose}>
      <div 
        className={`bg-brand-surface rounded-lg shadow-xl w-full max-w-md relative border border-brand-base/50 ${isClosing ? 'scale-95' : 'scale-100'} ${transitionClasses}`}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-3 right-3 text-brand-text/50 hover:text-brand-text">
          <CloseIcon className="w-6 h-6" />
        </button>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-brand-text">Add New {category.slice(0,-1)}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-text mb-1">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputStyles}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">Image</label>
              <div className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-brand-base border-dashed rounded-md h-48 relative">
                <div className="space-y-1 text-center">
                  {isProcessingImage && (
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-brand-base/50 text-brand-text rounded-md">
                      <SpinnerIcon className="w-8 h-8 text-brand-dark" />
                      <p className="mt-2 text-sm font-medium">Removing background...</p>
                    </div>
                  )}
                  {preview && !isProcessingImage ? (
                    <img src={preview} alt="Preview" className="mx-auto h-40 w-40 object-contain rounded-md" />
                  ) : (
                    !isProcessingImage && (
                      <>
                        <svg className="mx-auto h-12 w-12 text-brand-text/30" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                         <div className="flex text-sm text-brand-text/80 justify-center">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-brand-surface rounded-md font-medium text-brand-brown hover:text-brand-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-brown">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" required />
                          </label>
                        </div>
                         <p className="text-xs text-brand-text/50">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isProcessingImage}
              className="w-full bg-brand-brown text-white py-2.5 px-4 rounded-md hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-brown transition-colors disabled:bg-brand-dark/50 disabled:cursor-not-allowed"
            >
              {isProcessingImage ? 'Processing Image...' : 'Add Item'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItemForm;
