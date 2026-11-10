import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Play, Pause, RotateCcw, Sliders, Music, Mic2, Sparkles, Check, Download } from 'lucide-react';

interface AudioVoiceStudioProps {
  voiceSrc: string;
}

export const AudioVoiceStudio: React.FC<AudioVoiceStudioProps> = ({ voiceSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [filterMusic, setFilterMusic] = useState(true);
  const [vocalClarity, setVocalClarity] = useState(85);
  const [customText, setCustomText] = useState('شەرقىي تۈركىستان مەدەنىيىتى ۋە خىتاينىڭ رايوندىكى ۋەزىيىتى تەھلىلى.');
  const [isSimulatingNarrator, setIsSimulatingNarrator] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<'sample' | 'dubbed'>('sample');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Audio Context and Nodes for Web Audio vocal filtering
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const highpassNodeRef = useRef<BiquadFilterNode | null>(null);
  const lowpassNodeRef = useRef<BiquadFilterNode | null>(null);
  const peakingNodeRef = useRef<BiquadFilterNode | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 5);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  // Web Audio Context setup for real filter
  const initWebAudio = () => {
    if (audioCtxRef.current || !audioRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaElementSource(audioRef.current);
      sourceNodeRef.current = source;

      // High pass filter (cuts low bass & music kicks under 260Hz)
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = filterMusic ? 260 : 20;
      highpassNodeRef.current = hp;

      // Low pass filter (cuts sharp cymbals/synths above 3600Hz)
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = filterMusic ? 3600 : 20000;
      lowpassNodeRef.current = lp;

      // Peaking vocal resonance filter (boosts human vocal frequencies at 1500Hz)
      const peak = ctx.createBiquadFilter();
      peak.type = 'peaking';
      peak.frequency.value = 1600;
      peak.gain.value = filterMusic ? 6 : 0;
      peakingNodeRef.current = peak;

      source.connect(hp);
      hp.connect(lp);
      lp.connect(peak);
      peak.connect(ctx.destination);
    } catch (e) {
      console.warn('Web Audio API initialized in standard fallback mode:', e);
    }
  };

  // Update filters when toggle changes
  useEffect(() => {
    if (highpassNodeRef.current && lowpassNodeRef.current && peakingNodeRef.current) {
      if (filterMusic) {
        highpassNodeRef.current.frequency.value = 260;
        lowpassNodeRef.current.frequency.value = 3600;
        peakingNodeRef.current.gain.value = 6;
      } else {
        highpassNodeRef.current.frequency.value = 20;
        lowpassNodeRef.current.frequency.value = 20000;
        peakingNodeRef.current.gain.value = 0;
      }
    }
  }, [filterMusic]);

  // Waveform rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const mid = height / 2;

      // Draw background center line
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, mid);
      ctx.lineTo(width, mid);
      ctx.stroke();

      const bars = 48;
      const barWidth = width / bars - 2;

      for (let i = 0; i < bars; i++) {
        let barHeight = 4;
        if (isPlaying || isSimulatingNarrator) {
          // Dynamic active waveform
          const freqMultiplier = filterMusic ? 0.8 : 1.2;
          const wave = Math.sin(phase + i * 0.25) * Math.cos(phase * 0.7 + i * 0.1);
          barHeight = Math.max(4, Math.abs(wave) * (height * 0.45) * freqMultiplier + 6);
        } else {
          // Static soft baseline
          barHeight = 4 + (Math.sin(i * 0.3) + 1) * 3;
        }

        const x = i * (barWidth + 2);
        const y = mid - barHeight / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (filterMusic) {
          grad.addColorStop(0, '#10b981');
          grad.addColorStop(1, '#0284c7');
        } else {
          grad.addColorStop(0, '#6366f1');
          grad.addColorStop(1, '#3b82f6');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      phase += 0.08;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, isSimulatingNarrator, filterMusic]);

  const togglePlay = () => {
    initWebAudio();
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.warn);
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) audioRef.current.playbackRate = rate;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) audioRef.current.currentTime = val;
  };

  const handleSimulateNarrator = () => {
    initWebAudio();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
      setIsSimulatingNarrator(true);
      setTimeout(() => {
        setIsSimulatingNarrator(false);
      }, 5000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <Mic2 className="w-5 h-5" />
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-serif">
                قارلۇق ئاۋاز ئامبىرى ۋە مۇزىكا سۈزگۈچ
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 uyghur-text">
              ئىشلەتكۈچى بەرگەن كىلونلانغان ناتىقلىق ئاۋازى، ئارقا مۇزىكىنى سۈزۈپ ئېلىۋېتىش (Vocal Extraction) تېخنىكىسى.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
              <Check className="w-3.5 h-3.5" />
              ئەسلى ئاۋاز ھۆججىتى قاچىلاندى
            </span>
          </div>
        </div>
      </div>

      {/* Main Studio Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        
        {/* User Cloned Voice Banner with Track Selector */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-right">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                ئەزا تەمىنلىگەن ئاۋاز كىلوندى (KikiVoice Voice Model)
              </p>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                {currentTrack === 'sample' 
                  ? '«ئۇيغۇرچە ئاۋاز. مەن بىر ئۇيغۇر. مەن شەرقىي تۈركىستانلىق.» (ئەۋرىشكە)'
                  : '«كەلگۈسى قوراللىرى ھەربىي تاكتىكىسى» (تولۇق ئۇيغۇرچە دۇبليۇ)'}
              </h4>
            </div>
          </div>

          {/* Track Selector Tabs */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => {
                setCurrentTrack('sample');
                setIsPlaying(false);
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                }
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                currentTrack === 'sample'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              🎙 1. كىلون ئەۋرىشكىسى (4.46s)
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentTrack('dubbed');
                setIsPlaying(false);
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                }
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                currentTrack === 'dubbed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              🔊 2. تولۇق دۇبليۇ (48.64s)
            </button>
          </div>

          {/* Quick Vocal Filter Switch (Requirement #8: مۇزىكىنى سۈزۈپ ئېلىۋەت) */}
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-sky-500" />
                مۇزىكىنى سۈزۈش (ئارقا مۇزىكىنى چىقىرىپ تاشلاش)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {filterMusic ? 'ئاۋاز سۈزگۈچ ئوچۇق (ساپ ئىنسان ئاۋازى)' : 'ئەسلى مۇزىكا بىلەن بىللە'}
              </span>
            </div>
            <button
              onClick={() => setFilterMusic(!filterMusic)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                filterMusic ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  filterMusic ? 'translate-x-0' : '-translate-x-5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Waveform Visualizer Canvas */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {filterMusic ? 'VOCAL_ISOLATION_ACTIVE (300Hz-3.4kHz)' : 'FULL_SPECTRUM_AUDIO'}
            </span>
            <span className="font-mono text-slate-400">
              {Math.floor(currentTime)}s / {Math.floor(duration || 5)}s
            </span>
          </div>

          <canvas
            ref={canvasRef}
            width={700}
            height={90}
            className="w-full h-20 rounded-lg bg-slate-900/50"
          />

          {/* Time Scrubber */}
          <input
            type="range"
            min={0}
            max={duration || 5}
            step={0.05}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={currentTrack === 'sample' ? voiceSrc : '/assets/videos/weapons_of_the_future_dubbed_voice.mp3'}
          preload="auto"
        />

        {/* Audio Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          
          {/* Main Play / Pause */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md active:scale-95 transition-all"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>توختىتىش</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>ئاۋازنى قويۇش</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  setCurrentTime(0);
                }
              }}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="قايتا باشتىن باشلاش"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Playback Speed Select */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {[0.75, 1, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => handleRateChange(rate)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  playbackRate === rate
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Download Audio */}
          <a
            href={voiceSrc}
            download="qarluq-uyghur-cloned-voice.mp3"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>ئاۋازنى چۈشۈرۈۋېلىش</span>
          </a>
        </div>

        {/* Vocal Clarity & Speech Enhancement Slider */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-sky-500" />
              ئۇيغۇرچە ناتىقلىق ئاۋاز سۈزۈكلۈك دەرىجىسى:
            </span>
            <span className="font-mono font-bold text-sky-600 dark:text-sky-400">%{vocalClarity}</span>
          </div>
          <input
            type="range"
            min={50}
            max={100}
            value={vocalClarity}
            onChange={(e) => setVocalClarity(Number(e.target.value))}
            className="w-full accent-sky-600 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>تەبىئىي كىنو ئاۋازى</span>
            <span>ئوتتۇراھال سۈزۈكلۈك</span>
            <span>ساپ ئەدەبىي ناتىقلىق</span>
          </div>
        </div>

        {/* Cloned Voice Interactive Speech Dubbing Simulator */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
              <Sparkles className="w-4 h-4 text-amber-500" />
              بۇ ئاۋازدا كىنو ۋە ماقالە دېكلاماتسىيە قىلىش سىنىقى
            </h4>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ئەسلى ئاۋاز بىلەن جۈملە قوشۇش
            </span>
          </div>

          <div className="relative">
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              rows={2}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none uyghur-text"
              placeholder="ئاۋازدا دېكلاماتسىيە قىلماقچى بولغان جۈملىنى يېزىڭ..."
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSimulateNarrator}
              disabled={isSimulatingNarrator}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <Mic2 className="w-4 h-4" />
              <span>مۇشۇ ئاۋاز بىلەن ئوقۇش (دېكلاماتسىيە)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
