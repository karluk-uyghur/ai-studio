/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { WelcomeBanner } from './components/WelcomeBanner';
import { VideoTranslator } from './components/VideoTranslator';
import { PoliticalIntelligence } from './components/PoliticalIntelligence';
import { AudioVoiceStudio } from './components/AudioVoiceStudio';
import { SkillExplorer } from './components/SkillExplorer';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('translate');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qarluq_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // User-provided audio asset path in workspace public folder
  const voiceSrc = '/assets/aistudio/kikivoice-cloned-file-2026-11-10-16-57-37-1330_fcbf34d4.mp3';

  // Toggle Theme (كۈندۈز ۋە كىچە كۇنۇپكىسى)
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('qarluq_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('qarluq_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200" dir="rtl">
      
      {/* Navigation Header with Theme Toggle */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onOpenVoicePlayer={() => setCurrentTab('audio-filter')}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {/* Welcome Greeting Banner (Requirement #6: باشلىنىشتىلا قارلۇق تەرجىمىسگە خۇش كەلدىڭىز دەپ چىقسۇن) */}
        <WelcomeBanner
          onStartTranslating={() => setCurrentTab('translate')}
          voiceSrc={voiceSrc}
        />

        {/* Tab Views */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          {currentTab === 'translate' && (
            <VideoTranslator voiceSrc={voiceSrc} />
          )}

          {currentTab === 'politics' && (
            <PoliticalIntelligence voiceSrc={voiceSrc} />
          )}

          {currentTab === 'audio-filter' && (
            <AudioVoiceStudio voiceSrc={voiceSrc} />
          )}

          {currentTab === 'agent-skill' && (
            <SkillExplorer />
          )}
        </div>
      </main>

      {/* Uyghur Typography Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div className="space-y-1">
            <p className="font-bold text-slate-700 dark:text-slate-300 font-serif">
              قارلۇق ۋىدىئو تەرجىمە قورالى (Qarluq Video Translator)
            </p>
            <p>
              UKIJ Tuz فونتى • RTL تۈز تەڭشەلگەن ئابزاس • ئەدەبىي ئۇيغۇر تىلى • خىتاي ۋە شەرقىي تۈركىستان ئۆلچىمى
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              مەن بەرگەن ئاۋاز كىلونى تەييار
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
