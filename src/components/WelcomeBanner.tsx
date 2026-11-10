import React, { useState, useRef } from 'react';
import { Sparkles, Play, Pause, Volume2, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WelcomeBannerProps {
  onStartTranslating: () => void;
  voiceSrc: string;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  onStartTranslating,
  voiceSrc,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayVoice = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }).catch(err => {
        console.warn('Audio play prevented:', err);
      });
    }
  };

  if (isDismissed) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <button
          onClick={() => setIsDismissed(false)}
          className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-medium"
        >
          <Sparkles className="w-3.5 h-3.5" />
          قارلۇق خۇش كېلىپسىز ئۇچۇرىنى قايتا كۆرۈش
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-900 text-white shadow-xl max-w-7xl mx-auto my-4 sm:my-6 mx-4 sm:mx-6 lg:mx-8">
      {/* Background Decorative patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

      {/* Dismiss Button */}
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-4 left-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors z-10"
        title="ياپ"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Welcome Content */}
        <div className="space-y-4 text-center lg:text-right max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-sky-100 text-xs sm:text-sm font-medium border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>قارلۇق سۈنئىي ئەقىل ۋىدىئو تەرجىمە ماھارىتى</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight font-serif">
            قارلۇق تەرجىمىسىگە خۇش كەلدىڭىز!
          </h2>

          <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed uyghur-paragraph">
            بۇ سىستېما سىز يوللىغان ھەرقانداق سىن ۋە ماقالىلارنى ئەڭ يۇقىرى سەۋىيەدىكى ئۇيغۇر ئەدەبىي تىلىدا تەرجىمە قىلىپ بېرىدۇ. ئەسلى كىلونلانغان ئۇيغۇرچە ئاۋاز، تەگلىك مۇزىكىسىنى سۈزۈش تېخنىكىسى، شەرقىي تۈركىستان ۋە خىتاينىڭ سىياسىي-ھەربىي تەھلىللىرى بىلەن تولۇق تەمىنلەنگەن.
          </p>

          {/* Core Feature Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs text-sky-100">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>فونت: UKIJ Tuz</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>ئابزاس: RTL + 2 ھەرىپ بوشلۇق</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>ئاتالغۇ: خىتاي، شەرقىي تۈركىستان</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-300 shrink-0" />
              <span>مۇزىكىنى سۈزۈپ ئېلىۋېتىش</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-300 shrink-0" />
              <span>ئەدەبىي تىل ۋە سۆز ئېنىقلىقى</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-white/10">
              <Volume2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>ئەسلى ئۇيغۇرچە ئاۋاز بىلەن</span>
            </div>
          </div>
        </div>

        {/* User-Provided Cloned Voice Interactive Showcase Card */}
        <div className="w-full lg:w-80 shrink-0 bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 shadow-lg flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 mb-3 shadow-inner">
            <Volume2 className="w-7 h-7" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-1">
            مەن بەرگەن كىلونلانغان ئاۋاز
          </span>
          <p className="text-sm font-bold text-white mb-2 font-serif">
            «ئۇيغۇرچە ئاۋاز. مەن بىر ئۇيغۇر. مەن شەرقىي تۈركىستانلىق.»
          </p>
          <p className="text-xs text-sky-200/80 mb-4">
            تەرجىمە ۋە سىن ئاۋازىدا مەزكۇر مىللىي ئاۋاز ئۆلچەم قىلىپ ئىشلىتىلىدۇ.
          </p>

          {/* Hidden Audio Element */}
          <audio
            ref={audioRef}
            src={voiceSrc}
            onEnded={() => setIsPlaying(false)}
            preload="auto"
          />

          <div className="flex items-center gap-2.5 w-full">
            <button
              onClick={handlePlayVoice}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-md active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>توختىتىش</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>ئاۋازنى ئاڭلاش</span>
                </>
              )}
            </button>

            <button
              onClick={onStartTranslating}
              className="py-2.5 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium text-xs transition-colors"
            >
              باشلاش
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
