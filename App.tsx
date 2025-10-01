import React, { useState, useMemo, useEffect, useRef } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { Category, ClothingItem, Outfit } from './types';

import Header from './components/Header';
import ItemGrid from './components/ItemGrid';
import AddItemForm from './components/AddItemForm';
import AddOutfitForm from './components/AddOutfitForm';
import ItemDetail from './components/ItemDetail';
import OutfitDetail from './components/OutfitDetail';
import AIAssistant from './components/AIAssistant';
import TrashDropzone from './components/TrashDropzone';
import HomeScreen from './components/HomeScreen';
import CupboardDoors from './components/CupboardDoors';

const App: React.FC = () => {
    // Local storage for data persistence
    const [clothingItems, setClothingItems] = useLocalStorage<ClothingItem[]>('clothingItems', []);
    const [outfits, setOutfits] = useLocalStorage<Outfit[]>('outfits', []);

    // UI State
    const [hasEntered, setHasEntered] = useState(false);
    const [activeTab, setActiveTab] = useState<Category>(Category.Outfits);
    const [view, setView] = useState<'grid' | 'itemDetail' | 'outfitDetail'>('grid');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [draggingItem, setDraggingItem] = useState<{id: string; category: Category} | null>(null);
    const [deletedItemIds, setDeletedItemIds] = useState(new Set<string>());
    const [searchQuery, setSearchQuery] = useState('');

    // Derived state / Data filtering
    const searchResults = useMemo(() => {
        if (!searchQuery) return null; // null indicates no active search
        return clothingItems.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, clothingItems]);

    const itemsForGrid = useMemo(() => {
        if (searchResults !== null) {
            return searchResults;
        }
        if (activeTab === Category.Outfits) {
            return outfits;
        }
        return clothingItems.filter(item => item.category === activeTab);
    }, [activeTab, clothingItems, outfits, searchResults]);
    
    const selectedItem = useMemo(() => {
        if (view !== 'itemDetail' || !selectedId) return null;
        return clothingItems.find(item => item.id === selectedId) || null;
    }, [view, selectedId, clothingItems]);

    const selectedOutfit = useMemo(() => {
        if (view !== 'outfitDetail' || !selectedId) return null;
        return outfits.find(outfit => outfit.id === selectedId) || null;
    }, [view, selectedId, outfits]);
    
    const outfitsForItem = useMemo(() => {
        if (!selectedItem) return [];
        return outfits.filter(outfit => 
            outfit.topId === selectedItem.id ||
            outfit.bottomId === selectedItem.id ||
            outfit.extraId === selectedItem.id
        );
    }, [selectedItem, outfits]);

    // Event Handlers
    const handleAddClick = () => setShowAddForm(true);
    const handleFormClose = () => setShowAddForm(false);

    const handleAddItem = (newItemData: Omit<ClothingItem, 'id'>) => {
        const newItem: ClothingItem = {
            ...newItemData,
            id: Date.now().toString() + Math.random().toString(36).substring(2),
        };
        setClothingItems(prev => [...prev, newItem]);
        handleFormClose();
    };

    const handleAddOutfit = (newOutfitData: Omit<Outfit, 'id'>) => {
        const newOutfit: Outfit = {
            ...newOutfitData,
            id: Date.now().toString() + Math.random().toString(36).substring(2),
        };
        setOutfits(prev => [...prev, newOutfit]);
        handleFormClose();
    };

    const handleItemClick = (id: string) => {
        setSelectedId(id);
        const item = clothingItems.find(i => i.id === id);
        // If it's a clothing item (not an outfit), go to item detail
        if (item) {
             setView('itemDetail');
        } else {
             setView('outfitDetail');
        }
    };

    const handleBack = () => {
        setView('grid');
        setSelectedId(null);
    };

    const handleSwitchToItem = (itemId: string) => {
        const item = clothingItems.find(i => i.id === itemId);
        if (item) {
            setActiveTab(item.category);
            setSelectedId(item.id);
            setView('itemDetail');
        }
    };
    
    const handleOutfitRecommendation = (outfitName: string) => {
        const recommendedOutfit = outfits.find(o => o.name.toLowerCase() === outfitName.toLowerCase().trim());
        if (recommendedOutfit) {
            setActiveTab(Category.Outfits);
            setSearchQuery('');
            setSelectedId(recommendedOutfit.id);
            setView('outfitDetail');
        }
    };
    
    const changeTab = (tab: Category) => {
        if (activeTab !== tab || searchQuery) {
          setSearchQuery('');
          setActiveTab(tab);
          handleBack();
        }
    };

    // Drag and Drop Handlers
    const handleDragStart = (id: string, category: Category) => {
        setDraggingItem({ id, category });
    };

    const handleDragEnd = () => {
        setDraggingItem(null);
    };

    const handleTrashDrop = () => {
        if (!draggingItem) return;

        const { id, category } = draggingItem;
        
        setDeletedItemIds(prev => new Set(prev).add(id));

        setTimeout(() => {
            if (category === Category.Outfits) {
                setOutfits(currentOutfits => currentOutfits.filter(outfit => outfit.id !== id));
            } else {
                setClothingItems(currentItems => currentItems.filter(item => item.id !== id));
                setOutfits(currentOutfits => currentOutfits.map(outfit => {
                    const newOutfit = { ...outfit };
                    if (newOutfit.topId === id) newOutfit.topId = null;
                    if (newOutfit.bottomId === id) newOutfit.bottomId = null;
                    if (newOutfit.extraId === id) newOutfit.extraId = null;
                    return newOutfit;
                }));
            }

            if (selectedId === id) {
                handleBack();
            }
            
            setDeletedItemIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }, 300);
    };


    // Render logic
    const renderContent = () => {
        if (view === 'itemDetail' && selectedItem) {
            return <ItemDetail item={selectedItem} outfits={outfitsForItem} onBack={handleBack} onOutfitClick={handleItemClick} />;
        }
        if (view === 'outfitDetail' && selectedOutfit) {
            return <OutfitDetail outfit={selectedOutfit} clothingItems={clothingItems} onBack={handleBack} onItemClick={handleSwitchToItem} />;
        }
        // When searching, we show results but don't tie it to a specific category for adding items.
        // We also show search results if searchResults is an empty array (no results found).
        const categoryForGrid = searchResults !== null ? Category.Tops : activeTab;
        return <ItemGrid items={itemsForGrid} category={categoryForGrid} deletedItemIds={deletedItemIds} onItemClick={handleItemClick} onAddClick={handleAddClick} onDragStart={handleDragStart} onDragEnd={handleDragEnd} showAddButton={searchResults === null}/>;
    };

    const renderForm = () => {
        if (!showAddForm) return null;

        if (activeTab === Category.Outfits) {
            return <AddOutfitForm clothingItems={clothingItems} onClose={handleFormClose} onAddOutfit={handleAddOutfit} />;
        } else {
            return <AddItemForm category={activeTab as Category.Tops | Category.Bottoms | Category.Extra} onClose={handleFormClose} onAddItem={handleAddItem} />;
        }
    };

    return (
        <div className="min-h-screen bg-brand-surface font-sans">
            <HomeScreen onEnter={() => setHasEntered(true)} />

            <div className="relative">
                <CupboardDoors isOpen={hasEntered} />
                <div className={`transition-opacity duration-500 delay-500 ${hasEntered ? 'opacity-100' : 'opacity-0'}`}>
                    <Header activeTab={activeTab} setActiveTab={changeTab} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    <main className="pb-24">
                        <div key={view + selectedId + searchQuery} className="page-transition">
                            {renderContent()}
                        </div>
                    </main>
                </div>
            </div>

            {hasEntered && (
                <>
                    {renderForm()}
                    <AIAssistant outfits={outfits} onOutfitRecommendation={handleOutfitRecommendation} />
                    <TrashDropzone isDragging={!!draggingItem} onDrop={handleTrashDrop} />
                </>
            )}
        </div>
    );
};

export default App;