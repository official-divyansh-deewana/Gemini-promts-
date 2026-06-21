'use client';

import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface PromptItem {
  id: string;
  prompt: string;
  imageUrl: string;
  category: string;
  timestamp: string;
}

export default function PromptCard({ item }: { item: PromptItem }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy karne me dikkat aayi: ', err);
    }
  };

  return (
    <div className="flex flex-col bg-[#111827] border border-gray-800/80 rounded-2xl overflow-hidden hover:border-gray-700 transition duration-300 group">
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-950">
        <img
          src={item.imageUrl}
          alt={item.prompt}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="text-xs font-semibold px-2.5 py-1 bg-black/70 backdrop-blur-md text-teal-400 rounded-md border border-teal-500/20 uppercase tracking-wider">
            {item.category}
          </span>
        </div>
        <a 
          href={item.imageUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="absolute top-3 right-3 p-1.5 bg-black/70 hover:bg-black text-gray-300 hover:text-white rounded-md backdrop-blur-md transition duration-200"
        >
          <ExternalLink size={16} />
        </a>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <p className="text-sm text-gray-300 leading-relaxed line-clamp-4 font-mono select-all bg-black/20 p-3 rounded-lg border border-gray-900">
            "{item.prompt}"
          </p>
        </div>

        {/* Copy Button */}
        <div className="mt-4 pt-4 border-t border-gray-800/60 flex items-center justify-between">
          <span className="text-[10px] text-gray-500 font-mono">
            {new Date(item.timestamp).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
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
                <span>Copy Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
