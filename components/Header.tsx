import React from 'react';
import { Category } from '../types';
import { SparkleIcon, SearchIcon, CloseIcon } from './icons';

interface HeaderProps {
  activeTab: Category;
  setActiveTab: (tab: Category) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, searchQuery, setSearchQuery }) => {
  const tabs = [Category.Tops, Category.Bottoms, Category.Extra, Category.Outfits];
  const isSearching = searchQuery.length > 0;

  return (
    <header className="bg-brand-surface/80 backdrop-blur-lg sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
             <SparkleIcon className="w-5 h-5 text-brand-brown/50" />
             <h1 className="text-3xl font-serif text-brand-text">
                Virtual Closet
             </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-1 bg-brand-base p-1 rounded-full">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize text-base font-medium transition-colors duration-300 px-4 py-1.5 rounded-full relative ${
                  activeTab === tab && !isSearching
                    ? 'text-brand-dark'
                    : 'text-brand-text/70 hover:text-brand-text'
                }`}
              >
                {activeTab === tab && !isSearching && <div className="absolute inset-0 bg-white rounded-full shadow-sm"></div>}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </nav>
        </div>
        
        {/* Search Bar */}
        <div className="py-4 border-t border-brand-base">
            <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text/40"/>
                <input
                    type="text"
                    placeholder="Search all items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-brand-base/70 rounded-full py-3 pl-11 pr-10 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-brown/50 transition"
                />
                {isSearching && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text/50 hover:text-brand-text">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>

        <div className="md:hidden border-t border-brand-base">
          <div className="flex justify-around bg-white py-1 mt-2 rounded-lg shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize text-sm font-medium transition-colors duration-200 p-2 rounded-md w-full ${
                  activeTab === tab && !isSearching
                    ? 'text-brand-dark font-semibold'
                    : 'text-brand-text/70'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;