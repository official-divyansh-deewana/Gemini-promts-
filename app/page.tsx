import React from 'react';
import { PromptGallery } from './PromptCard';

// Enforce server-side data fetching every 60 seconds (No CORS issue)
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
    console.warn("NEXT_PUBLIC_APPS_SCRIPT_URL configured nahi mila.");
    return [];
  }

  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 60 },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error) {
    console.error("Server-side fetch error:", error);
    return [];
  }
}

export default async function Home() {
  const prompts = await getPrompts();

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

      {/* Hum server ka data ab interactive Client Gallery component me bhej rahe hain */}
      <PromptGallery initialItems={prompts} />
    </div>
  );
}
