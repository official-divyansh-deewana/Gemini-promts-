'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, Heart, Image as ImageIcon } from 'lucide-react';

interface PromptItem {
  id: string;
  prompt: string;
  imageUrl: string;
  category: string;
  timestamp: string;
}

// 1. Individual Card Component
export default function PromptCard({ item, onFavChange }: { item: PromptItem; onFavChange?: () => void }) {
  const [copied, setCopied] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const currentFavs = JSON.parse(localStorage.getItem('fav_prompts') || '[]');
    setIsFav(currentFavs.includes(item.id));
  }, [item.id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy fail hua:', err);
    }
  };

  const toggleFavorite = () => {
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
    <div className="flex flex-col bg-[#111827] border border-gray-800/80 rounded-2xl overflow-hidden hover:border-gray-700 transition duration-300 group">
      <div className="relative aspect-square w-full overflow-hidden bg-gray-950">
        <img
          src={item.imageUrl}
          alt={item.prompt}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
        />
        
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-bold px-2.5 py-1 bg-black/75 backdrop-blur-md text-teal-400 rounded-md border border-teal-500/20 uppercase tracking-wider">
            {item.category}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={toggleFavorite}
            className="p-1.5 bg-black/70 hover:bg-black text-gray-300 rounded-md backdrop-blur-md transition duration-200"
          >
            <Heart size={16} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-300'} />
          </button>

          <a 
            href={item.imageUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-1.5 bg-black/70 hover:bg-black text-gray-300 hover:text-white rounded-md backdrop-blur-md transition duration-200"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <p className="text-sm text-gray-300 leading-relaxed line-clamp-4 font-mono select-all bg-black/20 p-3 rounded-lg border border-gray-900">
            "{item.prompt}"
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800/60 flex items-center justify-between">
          <span className="text-[10px] text-gray-500 font-mono">
            {new Date(item.timestamp).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
              copied
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white border border-transparent'
            }`}
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Interactive Gallery Wrapper
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
      {/* Tabs Filter */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition duration-200 ${
            activeTab === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-900 text-gray-400 border border-gray-800 hover:text-white'
          }`}
        >
          <ImageIcon size={16} />
          <span>All Prompts ({initialItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favs')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition duration-200 ${
            activeTab === 'favs'
              ? 'bg-red-500/10 text-red-400 border border-red-500/30'
              : 'bg-gray-900 text-gray-400 border border-gray-800 hover:text-white'
          }`}
        >
          <Heart size={16} className={activeTab === 'favs' ? 'fill-red-500 text-red-400' : ''} />
          <span>My Favorites ({favIds.length})</span>
        </button>
      </div>

      {/* Grid */}
      {displayedPrompts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl bg-gray-900/20">
          <p className="text-gray-400 text-sm">
            {activeTab === 'favs' ? 'Aapne abhi tak koi post favorite nahi kiya hai.' : 'Koi prompts nahi mile.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
