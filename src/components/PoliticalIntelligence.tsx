import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, Newspaper, Search, Send, Sparkles, 
  ExternalLink, Volume2, Play, Pause, Bookmark, 
  Share2, ArrowRight, Check, AlertTriangle, FileText
} from 'lucide-react';
import { NewsItem, PoliticalAnalysisData } from '../types';

interface PoliticalIntelligenceProps {
  voiceSrc: string;
}

export const PoliticalIntelligence: React.FC<PoliticalIntelligenceProps> = ({ voiceSrc }) => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ھەممىسى');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom analysis state
  const [articleInput, setArticleInput] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PoliticalAnalysisData | null>(null);

  // Audio voice player
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  useEffect(() => {
    fetch('/api/news-feed')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setNewsList(data.data);
        }
      })
      .catch(err => console.error('Failed to load news feed:', err));
  }, []);

  const handleAnalyzeArticle = async () => {
    if (!articleInput.trim() && !topicInput.trim()) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/analyze-politics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleText: articleInput,
          topic: topicInput
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setAnalysisResult(data.data);
      } else {
        alert(data.error || 'تەھلىل ئېلىپ بېرىشتا خاتالىق كۆرۈلدى');
      }
    } catch (e) {
      console.error(e);
      alert('مۇلازىمېتىر خاتالىقى.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const categories = ['ھەممىسى', 'ھەربىي ئىستراتېگىيە', 'سىياسىي تەھلىل', 'خەلقئارالىق مۇناسىۋەتلەر'];

  const filteredNews = newsList.filter(item => {
    const matchCat = selectedCategory === 'ھەممىسى' || item.category === selectedCategory;
    const matchSearch = !searchQuery || item.title.includes(searchQuery) || item.summary.includes(searchQuery);
    return matchCat && matchSearch;
  });

  const toggleVoice = () => {
    if (!audioRef.current) return;
    if (isPlayingVoice) {
      audioRef.current.pause();
      setIsPlayingVoice(false);
    } else {
      audioRef.current.play();
      setIsPlayingVoice(true);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-serif">
                شەرقىي تۈركىستان ۋە خىتاي سىياسىي-ھەربىي تەھلىل مەركىزى
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 uyghur-text">
              خىتاينىڭ دۇنياۋى ھەربىي ئورۇنلاشتۇرۇشلىرى، سىياسىي تاكتىكىلىرى، شەرقىي تۈركىستاندىكى باستۇرۇش سىياسەتلىرىنىڭ ئىستراتېگىيىلىك يېڭىلىقلىرى ۋە دوكلاتلىرى.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200 border border-red-300 dark:border-red-700">
              ئىستراتېگىيىلىك ئۇچۇر مەركىزى
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Article Analyzer (Top/Left) + Breaking Intelligence Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Article Submitting & Deep Analysis (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                <FileText className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                ماقالە ۋە سىياسىي-ھەربىي مەزمۇننى تەھلىل قىلدۇرۇش
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                AI ئانالىز ماتورى
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                تېما ياكى تەتقىقات ماۋزۇسى:
              </label>
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="مەسىلەن: خىتاينىڭ غەربىي چېگرا ۋە شەرقىي تۈركىستاندىكى ھەربىي بازىلىرى..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 uyghur-text"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                تولۇق ماقالە تېكىستى ياكى مۇھىم بايانلار:
              </label>
              <textarea
                value={articleInput}
                onChange={(e) => setArticleInput(e.target.value)}
                rows={5}
                placeholder="مەن يوللىغان ماقالىدىكى مەزمۇنلارنى بۇ يەرگە قويۇڭ. خىتاينىڭ سىياسىي، ھەربىي ھەرىكەتلىرى ۋە ئۇيغۇرلارغا ئائىت يېڭىلىقلار چوڭقۇر تەھلىل قىلىنىدۇ..."
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:outline-hidden leading-relaxed uyghur-text"
              />
            </div>

            <button
              onClick={handleAnalyzeArticle}
              disabled={isAnalyzing || (!articleInput.trim() && !topicInput.trim())}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-md transition-all active:scale-98 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>چوڭقۇر ئىستراتېگىيىلىك تەھلىل ئېلىپ بېرىلماقتا...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  <span>ئەدەبىي سىياسىي-ھەربىي تەھلىلنى باشلاش</span>
                </>
              )}
            </button>
          </div>

          {/* Analysis Result Card */}
          {analysisResult && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-red-200 dark:border-red-900/60 shadow-lg space-y-5">
              
              <div className="flex items-center justify-between border-b border-red-100 dark:border-red-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                    <ShieldAlert className="w-4 h-4" />
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                    {analysisResult.headline}
                  </h4>
                </div>

                {/* Voice Narration button */}
                <button
                  onClick={toggleVoice}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold"
                >
                  {isPlayingVoice ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>توختات</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>ئاۋازدا ئاڭلاش</span>
                    </>
                  )}
                </button>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-xs font-bold text-red-600 dark:text-red-400 block mb-1">
                  قىسقىچە سىياسىي يەكۈن:
                </span>
                <p className="uyghur-paragraph text-sm text-slate-800 dark:text-slate-200">
                  {analysisResult.summary}
                </p>
              </div>

              {/* Military Threats List */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  خىتاينىڭ رايون خاراكتېرلىك ھەربىي تەھدىتلىرى:
                </h5>
                <div className="grid grid-cols-1 gap-2">
                  {analysisResult.militaryThreats?.map((threat, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-800/40 text-xs text-red-950 dark:text-red-200 flex items-start gap-2.5 uyghur-text"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      <span>{threat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* East Turkistan Direct Impact */}
              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/50 space-y-1">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 block">
                  شەرقىي تۈركىستان ۋە ئۇيغۇرلارغا بولغان بىۋاسىتە تەسىرى:
                </span>
                <p className="uyghur-paragraph text-xs sm:text-sm text-blue-950 dark:text-blue-100">
                  {analysisResult.eastTurkistanImpact}
                </p>
              </div>

              {/* Full Detailed Article adhering to UKIJ Tuz & 2em indent */}
              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  تولۇق ئەدەبىي تەھلىل بايانى (UKIJ Tuz):
                </h5>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <p className="uyghur-paragraph text-sm text-slate-800 dark:text-slate-200">
                    {analysisResult.detailedArticle}
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right / News & Strategic Intelligence Stream (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                <Newspaper className="w-4 h-4 text-red-500" />
                ئاخىرقى سىياسىي-ھەربىي يېڭىلىقلار
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">
                2026 يېڭى ئۇچۇرلار
              </span>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* News Cards List */}
            <div className="space-y-3">
              {filteredNews.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      {item.category}
                    </span>
                    <span className="font-mono">{item.date}</span>
                  </div>

                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug font-serif">
                    {item.title}
                  </h5>

                  <p className="uyghur-paragraph text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="flex flex-wrap items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-200/50 dark:border-slate-700/50">
                    <span className="font-medium text-slate-500 dark:text-slate-400">
                      مەنبە: {item.source}
                    </span>
                    <button
                      onClick={() => {
                        setTopicInput(item.title);
                        setArticleInput(item.summary);
                      }}
                      className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      تەھلىلگە ئەكىرىش
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* Hidden audio element for reading analysis */}
      <audio
        ref={audioRef}
        src={voiceSrc}
        onEnded={() => setIsPlayingVoice(false)}
      />

    </div>
  );
};
