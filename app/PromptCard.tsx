'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, Heart, Image as ImageIcon, X } from 'lucide-react';

interface PromptItem {
  id: string;
  prompt: string;
  imageUrl: string;
  category: string;
  timestamp: string;
}

// 1. Single Card Component with Tap to Zoom Modal
export default function PromptCard({ item, onFavChange }: { item: PromptItem; onFavChange?: () => void }) {
  const [copied, setCopied] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const currentFavs = JSON.parse(localStorage.getItem('fav_prompts') || '[]');
    setIsFav(currentFavs.includes(item.id));
  }, [item.id]);

  const handleCopy = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Card tap event ko rokne ke liye
    try {
      await navigator.clipboard.writeText(item.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy fail hua:', err);
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
    
    if (onFavChange) {
      onFavChange();
    }
  };

  return (
    <>
      {/* 2x2 Grid Friendly Card */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="flex flex-col bg-[#0f172a] border border-gray-800 rounded-xl overflow-hidden active:scale-95 hover:border-gray-700 transition duration-200 cursor-pointer relative group"
      >
        {/* Image Aspect ratio is perfectly square */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-950">
          <img
            src={item.imageUrl}
            alt={item.prompt}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          
          {/* Tag */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center z-10">
            <span className="text-[9px] font-bold px-2 py-0.5 bg-black/80 backdrop-blur-md text-teal-400 rounded border border-teal-500/10 truncate max-w-[70%]">
              {item.category}
            </span>
          </div>

          {/* Quick Fav Icon */}
          <button
            onClick={toggleFavorite}
            className="absolute top-2 right-2 p-1.5 bg-black/60 active:bg-black text-gray-300 rounded-lg backdrop-blur-md transition z-20"
          >
            <Heart size={14} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-300'} />
          </button>
        </div>
      </div>

      {/* Modern Dialog/Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0f172a] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-900/80 hover:bg-gray-800 text-gray-400 hover:text-white rounded-full transition"
            >
              <X size={20} />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-square w-full bg-black">
              <img 
                src={item.imageUrl} 
                alt={item.prompt} 
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 bg-black/80 backdrop-blur-md text-teal-400 rounded-full border border-teal-500/20 uppercase tracking-wide">
                {item.category}
              </span>
            </div>

            {/* Modal Details */}
            <div className="p-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Prompt Details</h3>
              <p className="text-sm text-gray-200 font-mono bg-black/30 p-4 rounded-2xl border border-gray-800 leading-relaxed max-h-40 overflow-y-auto select-all">
                {item.prompt}
              </p>

              <div className="mt-6 flex gap-3">
                {/* Copy Button */}
                <button
                  onClick={() => handleCopy()}
                  className={`flex-grow flex items-center justify-center gap-2 text-sm font-medium py-3 rounded-xl transition duration-200 ${
                    copied
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Full Prompt'}</span>
                </button>

                {/* External Link */}
                <a 
                  href={item.imageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-4 py-3 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white rounded-xl border border-gray-800 transition flex items-center justify-center"
                >
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// 2. Premium 2x2 Grid Gallery Layout
export function PromptGallery({ initialItems }: { initialItems: PromptItem[] }) {
  const [activeTab, setActiveTab] = useState<'all' | 'favs'>('all');
  const [favIds, setFavIds] = useState<string[]>([]);

  const loadFavorites = () => {
    const saved = JSON.parse(localStorage.getItem('fav_prompts') || '[]');
    setFavIds(saved);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const displayedPrompts = activeTab === 'all' 
    ? initialItems 
    : initialItems.filter(p => favIds.includes(p.id));

  return (
    <>
      {/* Modern Filter Tabs */}
      <div className="flex justify-center gap-3 mb-8">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition duration-200 ${
            activeTab === 'all'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-gray-900 text-gray-400 border border-gray-800 hover:text-white'
          }`}
        >
          <ImageIcon size={14} />
          <span>All Prompts ({initialItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favs')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition duration-200 ${
            activeTab === 'favs'
              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
              : 'bg-gray-900 text-gray-400 border border-gray-800 hover:text-white'
          }`}
        >
          <Heart size={14} className={activeTab === 'favs' ? 'fill-red-500 text-red-400' : ''} />
          <span>My Favorites ({favIds.length})</span>
        </button>
      </div>

      {/* Grid Optimized: 2 columns on Mobile, 3 on Tablet, 4 on Desktop */}
      {displayedPrompts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl bg-[#0f172a]/40">
          <p className="text-gray-400 text-xs">
            {activeTab === 'favs' ? 'Koi favorite posts nahi hain.' : 'Koi prompts nahi mile.'}
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
