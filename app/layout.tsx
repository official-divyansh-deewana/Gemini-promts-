import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gemini Prompt Vault",
  description: "Curated AI-generated image prompts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <header className="border-b border-gray-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent">
              Gemini Prompt Vault
            </span>
            <div className="text-xs text-gray-400 font-mono bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800">
              Database: Google Sheets
            </div>
          </div>
        </header>
        
        <main className="flex-grow">
          {children}
        </main>

        <footer className="border-t border-gray-900 bg-[#070b13] py-8 text-center text-sm text-gray-500">
          <div className="max-w-7xl mx-auto px-4">
            <p>© {new Date().getFullYear()} Gemini Prompt Vault. Powered by Gemini 2.5 & Pollinations.ai.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
