import type { Metadata } from 'next';
import { Prompt, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const prompt = Prompt({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-prompt',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'MEKBOTAI - AI Platform',
  description: 'AI Chatbot with Gemini 3.7 Flash',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${prompt.variable} ${jetbrains.variable}`}>
      <body className="bg-[#0b0c0e] text-zinc-200 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
