import React from 'react';
import PromptCard from './PromptCard';

export const revalidate = 60;

interface PromptItem {
  id: string;
  prompt: string;
  imageUrl: string;
  category: string;
  timestamp: string;
}

async function getPrompts(): Promise<PromptItem[]> {
  const apiUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

  if (!apiUrl) {
    console.warn("NEXT_PUBLIC_APPS_SCRIPT_URL configure nahi hai.");
    return [];
  }

  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error) {
    console.error("Fetch karne me error aayi:", error);
    return [];
  }
}

export default async function Home() {
  const prompts = await getPrompts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Trending AI Art Prompts
        </h1>
        <p className="mt-3 text-base text-gray-400">
          Curated image prompts generated daily by Gemini 2.5 and visualized using Pollinations.ai.
        </p>
      </div>

      {prompts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl bg-gray-900/20">
          <p className="text-gray-400 text-sm">Koi prompts nahi mile.</p>
          <p className="text-xs text-gray-600 mt-1">Apne Apps Script me setupSheet aur addTrendingPrompts ko run karein.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((item) => (
            <PromptCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
