'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, Heart, Layers, X } from 'lucide-react';

interface PromptItem {
  id: string;
  prompt: string;
  imageUrl: string;
  category: string;
  timestamp: string;
}

// 1. Sleek Card Component (Perfect for 2x2 Dense Grid)
export default function PromptCard({ item, onFavChange }: { item: PromptItem; onFavChange?: () => void }) {
  const [copied, setCopied] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const currentFavs = JSON.parse(localStorage.getItem('fav_prompts') || '[]');
    setIsFav(currentFavs.includes(item.id));
  }, [item.id]);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(item.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentFavs = JSON.parse(localStorage.getItem('fav_prompts') || '[]');
    let updatedFavs: string[] = [];

    if (currentFavs.includes(item.id)) {
      updatedFavs = currentFavs.filter((favId: string) => favId !== item.id);
      setIsFav(false);
    } else {
      updatedFavs = [...currentFavs, item.id];
      setIsFav(true);
    }

    localStorage.setItem('fav_prompts', JSON.stringify(updatedFavs));
    if (onFavChange) onFavChange();
  };

  return (
    <>
      {/* 2x2 Grid Card */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="flex flex-col bg-[#0f172a]/60 border border-gray-800/80 rounded-2xl overflow-hidden active:scale-95 transition-all duration-200 cursor-pointer relative shadow-lg"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-black">
          <img
            src={item.imageUrl}
            alt={item.prompt}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          
          {/* Subtle Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Category Pill Tag (Bottom Left) */}
          <div className="absolute bottom-2.5 left-2.5 max-w-[70%]">
            <span className="text-[9px] font-extrabold px-2 py-0.5 bg-black/60 backdrop-blur-md text-emerald-400 rounded-full border border-emerald-500/10 truncate block text-center">
              {item.category}
            </span>
          </div>

          {/* Heart Button (Top Right) */}
          <button
            onClick={toggleFavorite}
            className="absolute top-2.5 right-2.5 p-2 bg-black/50 active:bg-black/85 text-gray-300 rounded-full backdrop-blur-md transition-all z-10"
          >
            <Heart size={14} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-300'} />
          </button>
        </div>
      </div>

      {/* Premium Full-Screen Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md transition-all">
          <div className="relative w-full max-w-md bg-[#090d16] border border-gray-800/80 rounded-3xl overflow-hidden shadow-2xl">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2.5 bg-gray-900/90 text-gray-400 hover:text-white rounded-full border border-gray-800/60 active:scale-90 transition"
            >
              <X size={18} />
            </button>

            {/* Modal Photo */}
            <div className="relative aspect-square w-full bg-black">
              <img 
                src={item.imageUrl} 
                alt={item.prompt} 
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-4 left-4 text-[10px] font-black px-3 py-1 bg-[#090d16]/90 backdrop-blur-md text-teal-400 rounded-full border border-teal-500/20 uppercase tracking-widest">
                {item.category}
              </span>
            </div>

            {/* Prompt Description & Actions */}
            <div className="p-6">
              <span className="text-[10px] text-gray-500 font-extrabold tracking-widest uppercase block mb-2">
                Face-Swap & Style Prompt
              </span>
              <p className="text-xs text-gray-200 font-mono bg-black/40 p-4 rounded-xl border border-gray-800/80 leading-relaxed max-h-36 overflow-y-auto select-all">
                {item.prompt}
              </p>

              <div className="mt-5 flex gap-2">
                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className={`flex-grow flex items-center justify-center gap-2 text-xs font-bold py-3.5 rounded-xl transition-all ${
                    copied
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-indigo-600 active:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                  }`}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied Prompt' : 'Copy Prompt'}</span>
                </button>

                {/* Open/Save Image */}
                <a 
                  href={item.imageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-4 py-3.5 bg-gray-900 text-gray-300 rounded-xl border border-gray-800 flex items-center justify-center active:scale-95 transition"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// 2. Interactive Category Slider & Main Layout
export function PromptGallery({ initialItems }: { initialItems: PromptItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [favIds, setFavIds] = useState<string[]>([]);

  // Unique categories list with custom Swiper ordering
  const defaultCategories = ['All', 'Ghibli Anime', 'Wedding Style', 'Add Partner/GF', 'Image Enhance', 'Claymation 3D', 'Favorites'];

  const loadFavorites = () => {
    const saved = JSON.parse(localStorage.getItem('fav_prompts') || '[]');
    setFavIds(saved);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  // Filter Algorithm
  const getFilteredItems = () => {
    if (selectedCategory === 'Favorites') {
      return initialItems.filter(p => favIds.includes(p.id));
    }
    if (selectedCategory === 'All') {
      return initialItems;
    }
    return initialItems.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
  };

  const displayedPrompts = getFilteredItems();

  return (
    <>
      {/* 🌟 Horizontal Category Swiper Slider */}
      <div className="w-full mb-6">
        <div className="flex items-center gap-2 mb-2 px-1">
          <Layers size={12} className="text-gray-500" />
          <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest">Swipe Categories</span>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-3 pt-1 px-1 scrollbar-none whitespace-nowrap scroll-smooth">
          {defaultCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const isFavTab = cat === 'Favorites';

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-block px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                  isSelected
                    ? isFavTab
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                      : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'bg-[#0f172a] text-gray-400 border border-gray-800/80 hover:text-white'
                }`}
              >
                {isFavTab ? `❤️ Favs (${favIds.length})` : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 📱 2x2 Dense Mobile Grid (gap is tight for visual clean look) */}
      {displayedPrompts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-800/60 rounded-3xl bg-[#070b13]/60">
          <p className="text-gray-500 text-xs">
            {selectedCategory === 'Favorites' ? 'Koi posts favorite nahi kiye hain.' : 'Is category me koi prompts nahi hain.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayedPrompts.map((item) => (
            <PromptCard 
              key={item.id} 
              item={item} 
              onFavChange={loadFavorites} 
            />
          ))}
        </div>
      )}
    </>
  );
}
