'use client';

import React, { useState, useEffect } from 'react';
import PromptCard from './PromptCard';
import { Heart, Image as ImageIcon, Loader2 } from 'lucide-react';

interface PromptItem {
  id: string;
  prompt: string;
  imageUrl: string;
  category: string;
  timestamp: string;
}

export default function Home() {
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'favs'>('all');
  const [favIds, setFavIds] = useState<string[]>([]);

  const fetchPrompts = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;
    if (!apiUrl) return;

    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setPrompts(data);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const saved = JSON.parse(localStorage.getItem('fav_prompts') || '[]');
    setFavIds(saved);
  };

  useEffect(() => {
    fetchPrompts();
    loadFavorites();
  }, []);

  const handleFavToggle = () => {
    loadFavorites();
  };

  const displayedPrompts = activeTab === 'all' 
    ? prompts 
    : prompts.filter(p => favIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Trending AI Art Prompts
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Instagram Par Trending: Couple, Birthday, 3D Avatars, aur Aesthetic Prompts har ghante updated.
        </p>
      </div>

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
          <span>All Prompts ({prompts.length})</span>
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

      {/* Main Grid View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-500 mb-3" size={32} />
          <p className="text-sm text-gray-400">Prompts load ho rahe hain, kripya intezar karein...</p>
        </div>
      ) : displayedPrompts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl bg-gray-900/20">
          <p className="text-gray-400 text-sm">
            {activeTab === 'favs' ? 'Aapne abhi tak koi post favorite list me add nahi kiya hai.' : 'Koi prompts nahi mile.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPrompts.map((item) => (
            <PromptCard 
              key={item.id} 
              item={item} 
              onFavChange={handleFavToggle} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
