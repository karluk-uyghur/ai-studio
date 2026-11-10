import React from 'react';
import { Sun, Moon, Video, Newspaper, Mic, FileCode2, Volume2 } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  onOpenVoicePlayer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isDark,
  toggleTheme,
  onOpenVoicePlayer,
}) => {
  const tabs = [
    { id: 'translate', label: 'ۋىدىئو ۋە تېكىست تەرجىمىسى', icon: Video },
    { id: 'politics', label: 'سىياسىي ۋە ھەربىي تەھلىل', icon: Newspaper },
    { id: 'audio-filter', label: 'قارلۇق ئاۋاز ۋە مۇزىكا سۈزگۈچ', icon: Mic },
    { id: 'agent-skill', label: 'Agent Skill قۇرۇلمىسى', icon: FileCode2 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <span className="text-xl sm:text-2xl font-black font-serif">ق</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white font-serif">
                  قارلۇق ۋىدىئو تەرجىمە
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  ئەدەبىي تىل • UKIJ Tuz
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                ئەلا سۈپەتلىك تەرجىمە، سىياسىي-ھەربىي تەھلىل ۋە ئاۋاز سۈزگۈچ
              </p>
            </div>
          </div>

          {/* Center Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Cloned Voice Quick Button & Dark/Light Toggle */}
          <div className="flex items-center gap-2">
            {/* Cloned Voice Quick Trigger */}
            <button
              onClick={onOpenVoicePlayer}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-xl font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors shadow-2xs"
              title="مەن بەرگەن كىلونلانغان ئۇيغۇرچە ئاۋازنى ئاڭلاش"
            >
              <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span className="hidden xs:inline font-semibold">ئەسلى ئاۋاز</span>
            </button>

            {/* Dark & Light Toggle (كۈندۈز ۋە كىچە كۇنۇپكىسى) */}
            <button
              onClick={toggleTheme}
              aria-label="كۈندۈز ۋە كىچە ھالىتىنى ئالماشتۇرۇش"
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors flex items-center gap-1.5 shadow-2xs"
              title={isDark ? 'كۈندۈز كۇنۇپكىسى (Light Mode)' : 'كىچە كۇنۇپكىسى (Dark Mode)'}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  <span className="text-xs font-medium hidden sm:inline text-amber-500">كۈندۈز</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                  <span className="text-xs font-medium hidden sm:inline text-indigo-600">كىچە</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Submenu Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 dark:border-slate-800/60 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isActive
                    ? 'bg-sky-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
