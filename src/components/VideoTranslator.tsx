import React, { useState, useRef } from 'react';
import { 
  Play, Pause, Upload, FileText, Sparkles, Music, 
  Download, Copy, Check, ShieldCheck, Film, Volume2, 
  Languages, Eye, RefreshCw, ZoomIn, ZoomOut
} from 'lucide-react';
import { TranslationData } from '../types';

interface VideoTranslatorProps {
  voiceSrc: string;
}

export const VideoTranslator: React.FC<VideoTranslatorProps> = ({ voiceSrc }) => {
  const [sourceText, setSourceText] = useState('');
  const [videoUrl, setVideoUrl] = useState('https://youtu.be/bYrwEQ_Fr_I?si=kS0ZVj3gnJG6zGcl');
  const [sourceLang, setSourceLang] = useState('auto');
  const [filterMusic, setFilterMusic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [copied, setCopied] = useState(false);
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);

  // Voice-cloning dubbing states (User requirement: use cloned voice to dub original video into Uyghur and export MP4)
  const [isDubbedVideoMode, setIsDubbedVideoMode] = useState(true);
  const [dubbedVoiceUrl, setDubbedVoiceUrl] = useState('/assets/videos/weapons_of_the_future_dubbed_voice.mp3');
  const [dubbedMp4Url, setDubbedMp4Url] = useState('/assets/videos/weapons_of_the_future.mp4');
  const [isDubbingLoading, setIsDubbingLoading] = useState(false);
  const dubbedAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isDubbedAudioPlaying, setIsDubbedAudioPlaying] = useState(false);

  // Helper to extract YouTube ID
  const getYouTubeId = (url: string): string | null => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const youtubeId = getYouTubeId(videoUrl);

  // Initial translation state customized for the user's video: "The Weapons of the Future Event"
  const [translationResult, setTranslationResult] = useState<TranslationData>({
    title: '«كەلگۈسى قوراللىرى» ھەربىي تاكتىكا ۋە قوراللىنىش تەھلىلى (Art of War)',
    paragraphs: [
      'زامانىۋى يۇقىرى تېخنىكىلىق جەڭ مۇھىتىدا، كەلگۈسى قوراللىرى، تاكتىكىلىق ئۇچقۇچىسىز ھاۋا ئاپپاراتلىرى، راداردىن ساقلىنىدىغان ئىلغار بومباردىمان سىستېمىلىرى ۋە سۈنئىي ئەقىللىق مۇداپىئە قۇرۇلمىلىرى پۈتكۈل دۇنياۋى ھەربىي تەڭپۇڭلۇقنى تۈپتىن ئۆزگەرتمەكتە. بولۇپمۇ «ئۇرۇش سەنئىتى» (Art of War) نوقتىسىدىن ئېيتقاندا، دۈشمەننىڭ كۈچىنى ئالدىن پەرەز قىلىش ۋە ئەڭ ئىلغار تاكتىكىلىق بىرلىكلەرنى دەل جايىدا ئىشقا سېلىش غەلىبىنىڭ ھەل قىلغۇچ ئامىلىغا ئايلاندى.',
      'بۇ خىل زامانىۋى ھەربىي تەرەققىياتلار خىتاينىڭ رايون خاراكتېرلىك ھەربىي پىلانلىرىغىمۇ چوڭقۇر باغلىنىشلىق بولۇپ، خىتاي ھاكىمىيىتى شەرقىي تۈركىستان زېمىنىنى بىر سىناق مەيدانىغا ئايلاندۇرۇۋالدى. رايوندىكى نازارەت تورى، ئۇچقۇچىسىز ئايروپىلان بازىلىرى ۋە سۈنئىي ئىستراتېگىيىلىك قۇرۇلۇشلار پەقەت ئىچكى خەلقنى رەھىمسىزلەرچە باستۇرۇش ئۈچۈنلا ئەمەس، بەلكى كەلگۈسىدىكى چوڭ كۆلەملىك رايون ئۇرۇشلىرىغا ھازىرلىق كۆرۈش مەقسىتىدە جىددىي كېڭەيتىلمەكتە. شۇڭلاشقا، ئەركىن دۇنيا مەزكۇر ھەربىي تەھدىتلەرگە قارىتا ھوشيارلىقنى ئاشۇرۇشى زۆرۈردۇر.'
    ],
    fullText: '    زامانىۋى يۇقىرى تېخنىكىلىق جەڭ مۇھىتىدا، كەلگۈسى قوراللىرى، تاكتىكىلىق ئۇچقۇچىسىز ھاۋا ئاپپاراتلىرى، راداردىن ساقلىنىدىغان ئىلغار بومباردىمان سىستېمىلىرى ۋە سۈنئىي ئەقىللىق مۇداپىئە قۇرۇلمىلىرى پۈتكۈل دۇنياۋى ھەربىي تەڭپۇڭلۇقنى تۈپتىن ئۆزگەرتمەكتە. بولۇپمۇ «ئۇرۇش سەنئىتى» (Art of War) نوقتىسىدىن ئېيتقاندا، دۈشمەننىڭ كۈچىنى ئالدىن پەرەز قىلىش ۋە ئەڭ ئىلغار تاكتىكىلىق بىرلىكلەرنى دەل جايىدا ئىشقا سېلىش غەلىبىنىڭ ھەل قىلغۇچ ئامىلىغا ئايلاندى.\n\n    بۇ خىل زامانىۋى ھەربىي تەرەققىياتلار خىتاينىڭ رايون خاراكتېرلىك ھەربىي پىلانلىرىغىمۇ چوڭقۇر باغلىنىشلىق بولۇپ، خىتاي ھاكىمىيىتى شەرقىي تۈركىستان زېمىنىنى بىر سىناق مەيدانىغا ئايلاندۇرۇۋالدى. رايوندىكى نازارەت تورى، ئۇچقۇچىسىز ئايروپىلان بازىلىرى ۋە سۈنئىي ئىستراتېگىيىلىك قۇرۇلۇشلار پەقەت ئىچكى خەلقنى رەھىمسىزلەرچە باستۇرۇش ئۈچۈنلا ئەمەس، بەلكى كەلگۈسىدىكى چوڭ كۆلەملىك رايون ئۇرۇشلىرىغا ھازىرلىق كۆرۈش مەقسىتىدە جىددىي كېڭەيتىلمەكتە. شۇڭلاشقا، ئەركىن دۇنيا مەزكۇر ھەربىي تەھدىتلەرگە قارىتا ھوشيارلىقنى ئاشۇرۇشى زۆرۈردۇر.',
    subtitles: [
      { id: 1, start: '00:00:01', end: '00:00:05', text: '«كەلگۈسى قوراللىرى» ناملىق ھەربىي تاكتىكا پائالىيىتى تەھلىلى' },
      { id: 2, start: '00:00:06', end: '00:00:11', text: 'زامانىۋى يۇقىرى تېخنىكىلىق قوراللار ۋە جەڭ تاكتىكىسىنىڭ ئەھمىيىتى' },
      { id: 3, start: '00:00:12', end: '00:00:17', text: 'خىتاينىڭ كەلگۈسى قوراللىرىنى تەرەققىي قىلدۇرۇپ رايونغا خەۋپ يەتكۈزۈشى' },
      { id: 4, start: '00:00:18', end: '00:00:24', text: 'شەرقىي تۈركىستاندا قۇرۇلغان ئىلغار ھەربىي قوراللىنىش سىستېمىلىرى' },
      { id: 5, start: '00:00:25', end: '00:00:30', text: 'ئۇيغۇر ئەدەبىي تىلىدا مۇكەممەل تەرجىمە ۋە سىياسىي-ھەربىي خۇلاسە' }
    ],
    politicalSummary: 'كەلگۈسى قوراللىرى ۋە زامانىۋى تاكتىكىلار خىتاينىڭ شەرقىي تۈركىستان زېمىنىنى قوراللاندۇرۇپ، ئوتتۇرا ئاسىيا ۋە قوشنا ئەللەرگە ھەربىي تەھدىت سېلىشىدىكى خەتەرلىك ھەرىكەتلىرى بىلەن سېلىشتۇرۇپ باھالاندى.'
  });

  // Pre-configured presets with user-requested video prominently highlighted
  const samplePresets = [
    {
      title: '🎯 YouTube: «كەلگۈسى قوراللىرى» (bYrwEQ_Fr_I)',
      lang: 'en',
      text: 'The "Weapons of the Future" Event! Art of War 3 Global Conflict RTS gameplay, featuring advanced modern tactical units, drone warfare, artillery strikes and futuristic battlefield command strategies.',
      video: 'https://youtu.be/bYrwEQ_Fr_I?si=kS0ZVj3gnJG6zGcl'
    },
    {
      title: '📁 يەرلىك MP4 ھۆججىتى (Local .mp4)',
      lang: 'ug',
      text: '«كەلگۈسى قوراللىرى» ھەربىي تاكتىكا پائالىيىتى ۋە خىتاينىڭ شەرقىي تۈركىستاندىكى قوراللىنىش تاكتىكىسى تەھلىلى.',
      video: '/assets/videos/weapons_of_the_future.mp4'
    },
    {
      title: 'خىتاينىڭ شەرقىي تۈركىستاندىكى ھەربىي بازىلىرى (ئىنگلىزچە خەۋەر)',
      lang: 'en',
      text: 'Recent satellite intelligence reveals that China has constructed multiple new military drone facilities across East Turkistan, reinforcing Beijing strategic dominance over Central Asia while accelerating political suppression.',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    }
  ];

  const handleApplyPreset = (preset: typeof samplePresets[0]) => {
    setSourceText(preset.text);
    setSourceLang(preset.lang);
    setVideoUrl(preset.video);
    handleFetchAndTranslateUrl(preset.video);
  };

  const handleFetchAndTranslateUrl = async (targetUrl = videoUrl) => {
    if (!targetUrl.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/fetch-video-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setTranslationResult(data.data);
        if (data.videoInfo?.title) {
          setSourceText(`[ۋىدىئو نامى: ${data.videoInfo.title}]\nئاپتور: ${data.videoInfo.author || 'YouTube'}\nتور ئادرېسى: ${targetUrl}\n\nقارلۇق ۋىدىئو تەرجىمە ماھارىتى ئارقىلىق ئەدەبىي تەرجىمە، سىن پىلاستىنكىلىرى ۋە خىتاي-شەرقىي تۈركىستان ھەربىي تەھلىلى تەييارلاندى.`);
        }
      } else {
        alert(data.error || 'ۋىدىئو ئانالىزىدا كاشىلا كۆرۈلدى');
      }
    } catch (e: any) {
      console.error(e);
      alert('مۇلازىمېتىر بىلەن ئالاقە قىلىش مەغلۇپ بولدى: ' + e?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          sourceLang,
          filterMusic,
          title: 'قارلۇق تەرجىمە نەتىجىسى'
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setTranslationResult(data.data);
      } else {
        alert(data.error || 'تەرجىمىدە كاشىلا كۆرۈلدى');
      }
    } catch (e: any) {
      console.error(e);
      alert('مۇلازىمېتىر بىلەن ئالاقە قىلىش مەغلۇپ بولدى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    // Synchronize subtitle
    const sec = time;
    if (translationResult.subtitles && translationResult.subtitles.length > 0) {
      const idx = translationResult.subtitles.findIndex((sub) => {
        // parse mm:ss or seconds
        const parts = sub.start.split(':').map(Number);
        const startSec = (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
        const endParts = sub.end.split(':').map(Number);
        const endSec = (endParts[0] || 0) * 3600 + (endParts[1] || 0) * 60 + (endParts[2] || 0);
        return sec >= startSec && sec <= endSec;
      });
      if (idx !== -1) setActiveSubtitleIndex(idx);
    }
  };

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  const toggleVoicePlay = () => {
    if (!voiceAudioRef.current) return;
    if (isVoicePlaying) {
      voiceAudioRef.current.pause();
      setIsVoicePlaying(false);
    } else {
      voiceAudioRef.current.play();
      setIsVoicePlaying(true);
    }
  };

  const toggleDubbedAudioPlay = () => {
    if (!dubbedAudioRef.current) return;
    if (isDubbedAudioPlaying) {
      dubbedAudioRef.current.pause();
      setIsDubbedAudioPlaying(false);
    } else {
      dubbedAudioRef.current.play();
      setIsDubbedAudioPlaying(true);
    }
  };

  const handleGenerateDubbing = async () => {
    setIsDubbingLoading(true);
    try {
      const fullText = translationResult.paragraphs.join(' ');
      const res = await fetch('/api/dub-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: fullText,
          videoUrl,
          title: translationResult.title
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.mp4Url) setDubbedMp4Url(data.mp4Url + '?t=' + Date.now());
        if (data.dubbedAudioUrl) setDubbedVoiceUrl(data.dubbedAudioUrl + '?t=' + Date.now());
        setIsDubbedVideoMode(true);
        alert('مۇۋەپپەقىيەتلىك تامام block: ئەسلى ئاۋازنىڭ ئورنىغا كىلونلانغان ئۇيغۇرچە ئاۋاز تولۇق بىرىكتۈرۈلۈپ، MP4 سىن ھۆججىتى پۈتتى!');
      } else {
        alert(data.error || 'دۇبليۇ قىلىشتا كاشىلا كۆرۈلدى');
      }
    } catch (err: any) {
      console.error('Dubbing error:', err);
      alert('دۇبليۇ ماتورى بىلەن ئۇلىنىش مەغلۇپ بولدى: ' + err?.message);
    } finally {
      setIsDubbingLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = translationResult.paragraphs.map(p => `    ${p}`).join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSRT = () => {
    let srt = '';
    translationResult.subtitles.forEach((sub, i) => {
      srt += `${i + 1}\n${sub.start},000 --> ${sub.end},000\n${sub.text}\n\n`;
    });
    const blob = new Blob([srt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qarluq-uyghur-subtitles.srt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="ug" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${translationResult.title || 'قارلۇق تەرجىمە نەتىجىسى'}</title>
  <style>
    body {
      font-family: 'UKIJ Tuz', 'UKIJ Tuz Tom', 'ALKATIP Tor', 'Noto Sans Arabic', Tahoma, sans-serif;
      direction: rtl;
      background: #f8fafc;
      color: #0f172a;
      padding: 30px;
      line-height: 2.1;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 36px;
      border-radius: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    }
    h1 {
      font-size: 26px;
      color: #1e3a8a;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 12px;
      margin-bottom: 24px;
    }
    p {
      text-align: justify;
      text-justify: inter-word;
      text-indent: 2em;
      font-size: 19px;
      margin-bottom: 20px;
    }
    .badge {
      display: inline-block;
      background: #eff6ff;
      color: #1d4ed8;
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 13px;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">قارلۇق ئەدەبىي تەرجىمە قورالى</div>
    <h1>${translationResult.title || 'قارلۇق تەرجىمىسى'}</h1>
    ${translationResult.paragraphs.map(p => `<p>${p}</p>`).join('\n')}
  </div>
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qarluq-uyghur-article.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner / Preset Chooser */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-serif">
              <Film className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              ۋىدىئو ۋە تېكىستنى تەرجىمە قىلىش مەركىزى
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 uyghur-text">
              ئىنگلىزچە، خىتايچە، تۈركچە قاتارلىق ھەرقايسى تىللاردىن ئۇيغۇر ئەدەبىي تىلىغا مۇكەممەل ئايلاندۇرۇش.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              «خىتاي» ۋە «شەرقىي تۈركىستان» مەجبۇرىي ئۆلچەم
            </span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
            تېز سىناش نۇسخىلىرى:
          </span>
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors font-medium border border-slate-200 dark:border-slate-700"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Input Column & Translation / Subtitles Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Input Section (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            {/* Video URL or Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                ۋىدىئو ئادرېسى (YouTube / تور ئۇلانمىسى ياكى ھۆججەت):
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  dir="ltr"
                  placeholder="https://youtu.be/... ياكى mp4 ئادرېسى"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleFetchAndTranslateUrl(videoUrl)}
                  disabled={isLoading || !videoUrl.trim()}
                  className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-xs shrink-0 flex items-center justify-center gap-1.5"
                  title="مەزكۇر ۋىدىئونى سۈنئىي ئەقىل ئارقىلىق تارتىپ تەرجىمە قىلىش"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تارتىش ۋە تەرجىمە</span>
                </button>
                <label className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer transition-colors shrink-0 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept="video/*,audio/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const localUrl = URL.createObjectURL(file);
                        setVideoUrl(localUrl);
                        if (!sourceText) {
                          setSourceText(`[ۋىدىئو ھۆججىتى: ${file.name}]\nخىتاينىڭ خەلقئارالىق سىياسىي-ھەربىي تەھلىلى ۋە شەرقىي تۈركىستان ۋەزىيىتى.`);
                        }
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Language & Filter Settings */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  مەنبە تىل:
                </label>
                <div className="relative">
                  <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 appearance-none font-medium"
                  >
                    <option value="auto">ئاپتوماتىك تونۇش (Auto)</option>
                    <option value="en">ئىنگلىزچە (English)</option>
                    <option value="zh">خىتايچە (Chinese)</option>
                    <option value="tr">تۈركچە (Turkish)</option>
                    <option value="ar">ئەرەبچە (Arabic)</option>
                    <option value="ru">رۇسچە (Russian)</option>
                    <option value="de">نېمىسچە (German)</option>
                    <option value="fr">فىرانسۇزچە (French)</option>
                  </select>
                  <Languages className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Music Filter Toggle (Requirement #8: مۇزىكىنى سۈزۈپ ئىلۋات) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  مۇزىكىنى سۈزۈش:
                </label>
                <button
                  type="button"
                  onClick={() => setFilterMusic(!filterMusic)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                    filterMusic
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <Music className="w-3.5 h-3.5 shrink-0" />
                    <span>{filterMusic ? 'مۇزىكا سۈزۈلىدۇ' : 'سۈزۈلمەيدۇ'}</span>
                  </span>
                  <span className={`w-2 h-2 rounded-full ${filterMusic ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                </button>
              </div>
            </div>

            {/* Source Text / Transcript Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-500" />
                  ئەسلى ۋىدىئو ئاۋاز تېكىستى ياكى ماقالە مەزمۇنى:
                </label>
                <span className="text-[11px] text-slate-400">
                  {sourceText.length} ھەرپ
                </span>
              </div>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                rows={7}
                placeholder="تەرجىمە قىلماقچى بولغان ۋىدىئو تېكىستى ياكى ماقالىنى بۇ يەرگە كىرگۈزۈڭ..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden leading-relaxed resize-y"
              />
            </div>

            {/* Action Submit Button */}
            <button
              onClick={handleTranslate}
              disabled={isLoading || !sourceText.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-bold text-sm shadow-md transition-all active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>ئەدەبىي تەرجىمە ئىشلىنىۋاتىدۇ...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>ئۇيغۇر ئەدەبىي تىلىدا تەرجىمە قىلىش</span>
                </>
              )}
            </button>
          </div>

          {/* Video Preview Card with Live Subtitles (Supports Dubbed MP4 & Original YouTube) */}
          <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
            
            {/* Player Mode Switcher Tabs */}
            <div className="p-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsDubbedVideoMode(true)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    isDubbedVideoMode
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>دۇبليۇ سىن (.mp4)</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-black/30">48s</span>
                </button>

                {youtubeId && (
                  <button
                    type="button"
                    onClick={() => setIsDubbedVideoMode(false)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                      !isDubbedVideoMode
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>YouTube ئەسلى كۆرۈنۈشى</span>
                  </button>
                )}
              </div>

              <span className="text-[11px] font-mono text-emerald-400 hidden sm:inline-block">
                {isDubbedVideoMode ? '✓ كىلون ئاۋاز بىلەن دۇبليۇ قىلىنغان' : 'ئەسلى ئاۋاز'}
              </span>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center">
              {!isDubbedVideoMode && youtubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?enablejsapi=1&rel=0`}
                  title="قارلۇق ۋىدىئو قويغۇچ (YouTube)"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    src={dubbedMp4Url}
                    onTimeUpdate={handleVideoTimeUpdate}
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    controls
                    className="w-full h-full object-contain"
                  />
                </>
              )}

              {/* In-Video Uyghur Subtitles Layer (UKIJ Tuz font, Beautiful Shadow, RTL) */}
              {translationResult.subtitles.length > 0 && !isDubbedVideoMode && (
                <div className="absolute bottom-3 inset-x-3 pointer-events-none text-center z-10">
                  <span className="inline-block px-3.5 py-1.5 rounded-lg bg-black/85 backdrop-blur-xs text-white text-xs sm:text-sm font-semibold tracking-wide border border-white/10 shadow-xl uyghur-text">
                    {translationResult.subtitles[activeSubtitleIndex]?.text || translationResult.subtitles[0]?.text}
                  </span>
                </div>
              )}
            </div>

            {/* Video Controls Footer */}
            <div className="p-3 bg-slate-900 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {isDubbedVideoMode
                    ? 'ئۇيغۇرچە دۇبليۇ قىلىنغان MP4 قويۇلماقتا (48.64s)'
                    : 'ۋىدىئو ۋە پىلاستىنكا ماسقەدەملىكى'}
                </span>
              </div>
              <span className="font-mono text-slate-400">
                {Math.floor(currentTime)} سېكۇنت
              </span>
            </div>
          </div>

          {/* Video Assets Location Card */}
          <div className="p-4 rounded-xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs space-y-2.5 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
              <span className="font-bold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                مەزكۇر ۋىدىئو ۋە ئۇنىڭغا مۇناسىۋەتلىك ھۆججەتلەر:
              </span>
              <span className="font-mono text-[11px] text-sky-700 dark:text-sky-300 font-semibold" dir="ltr">
                .agents/skills/qarluq-video-translator/assets/
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 dark:text-slate-300 font-mono" dir="ltr">
              <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-sky-100 dark:border-sky-900 flex items-center gap-1.5">
                <span>📄</span>
                <span>video_source.json</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-sky-100 dark:border-sky-900 flex items-center gap-1.5">
                <span>🎬</span>
                <span>weapons_of_the_future.srt</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-sky-100 dark:border-sky-900 flex items-center gap-1.5">
                <span>🌐</span>
                <span>weapons_of_the_future_translation.html</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-sky-100 dark:border-sky-900 flex items-center gap-1.5">
                <span>🛡</span>
                <span>political_military_analysis.md</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right / Result Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Main Translation Output Card adhering strictly to UKIJ Tuz, RTL, Justified, 2em indent */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
            
            {/* Header & Tools Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    ئەدەبىي ئۇيغۇرچە تەرجىمە
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    UKIJ Tuz • 2-ھەرىپ بوشلۇق
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-serif">
                  {translationResult.title || 'قارلۇق نەتىجىسى'}
                </h3>
              </div>

              {/* Font Sizing & Copy */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => setFontSize(Math.max(14, fontSize - 1))}
                    className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
                    title="كىچىكلىتىش"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono px-1 font-semibold">{fontSize}px</span>
                  <button
                    onClick={() => setFontSize(Math.min(26, fontSize + 1))}
                    className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
                    title="چوڭايتىش"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>كۆچۈرۈلدى</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>كۆچۈرۈش</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Voice-Cloning & Dubbing Center (User requirement: replace video audio with cloned Uyghur voice) */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3 shadow-xs">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-emerald-200/60 dark:border-emerald-800/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-1.5">
                      <span>قارلۇق كىلون ئاۋاز دۇبليۇ قورالى (Qarluq Dubbing Engine)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono">AI Voice Clone</span>
                    </h4>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                      سىندىكى ئەسلى ئاۋاز چىقىرىۋېتىلىپ، سىز بەرگەن كىلون ئاۋازدا تولۇق ئۇيغۇرچە دۇبليۇ قىلىنىدۇ.
                    </p>
                  </div>
                </div>

                {/* Dubbing Re-generation Button */}
                <button
                  onClick={handleGenerateDubbing}
                  disabled={isDubbingLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs active:scale-95 disabled:opacity-50 shrink-0"
                >
                  {isDubbingLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>دۇبليۇ قىلىنىۋاتىدۇ...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>ئاۋازنى كىلونلاپ دۇبليۇ قىلىش</span>
                    </>
                  )}
                </button>
              </div>

              {/* Two Voice Tracks: 1) Reference Sample vs 2) Dubbed Uyghur Speech */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                
                {/* 1. Reference Sample Provided by User */}
                <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                      🎙 1. ئەسلى كىلون ئەۋرىشكىسى (Sample)
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      4.46 سېكۇنت • 24kHz Mono
                    </span>
                  </div>

                  <audio
                    ref={voiceAudioRef}
                    src={voiceSrc}
                    onEnded={() => setIsVoicePlaying(false)}
                  />

                  <button
                    onClick={toggleVoicePlay}
                    className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900 hover:bg-emerald-200 dark:hover:bg-emerald-800 text-emerald-800 dark:text-emerald-200 shrink-0 transition-colors"
                    title="ئەسلى كىلون ئاۋاز ئەۋرىشكىسىنى ئاڭلاش"
                  >
                    {isVoicePlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                </div>

                {/* 2. Full Dubbed Uyghur Speech */}
                <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-emerald-200 dark:border-emerald-700 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 block truncate">
                      🔊 2. تولۇق دۇبليۇ قىلىنغان ئاۋاز (Dubbed)
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                      48.64 سېكۇنت • ئۇيغۇرچە تەپسىلىي بايان
                    </span>
                  </div>

                  <audio
                    ref={dubbedAudioRef}
                    src={dubbedVoiceUrl}
                    onEnded={() => setIsDubbedAudioPlaying(false)}
                  />

                  <button
                    onClick={toggleDubbedAudioPlay}
                    className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 transition-colors shadow-xs"
                    title="يېڭى ئۇيغۇرچە دۇبليۇ ئاۋازىنى ئاڭلاش"
                  >
                    {isDubbedAudioPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                </div>

              </div>

            </div>

            {/* Uyghur Literary Paragraphs View - User Requirement #2 and #3 */}
            <div 
              className="space-y-4 p-5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800"
              style={{ fontSize: `${fontSize}px` }}
            >
              {translationResult.paragraphs.map((p, idx) => (
                <p 
                  key={idx}
                  className="uyghur-paragraph text-slate-800 dark:text-slate-200"
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Political Analysis Highlight Box */}
            {translationResult.politicalSummary && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs leading-relaxed space-y-1">
                <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  سىياسىي ۋە خەلقئارالىق نۇقتىدىن باھالاش:
                </span>
                <p className="text-amber-900/90 dark:text-amber-200/90 uyghur-text">
                  {translationResult.politicalSummary}
                </p>
              </div>
            )}

            {/* Subtitle Lines Synchronizer List */}
            <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="font-bold flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-sky-500" />
                  ۋىدىئو پىلاستىنكا قۇرلىرى (Subtitles):
                </span>
                <span>{translationResult.subtitles.length} قۇر بۆلەك</span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {translationResult.subtitles.map((sub, idx) => (
                  <div
                    key={sub.id || idx}
                    onClick={() => {
                      setActiveSubtitleIndex(idx);
                      if (videoRef.current) {
                        const parts = sub.start.split(':').map(Number);
                        const sec = (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
                        videoRef.current.currentTime = sec;
                        videoRef.current.play();
                        setIsVideoPlaying(true);
                      }
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-all ${
                      activeSubtitleIndex === idx
                        ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 font-bold border border-sky-300 dark:border-sky-800'
                        : 'bg-white dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60'
                    }`}
                  >
                    <span className="uyghur-text truncate flex-1">{sub.text}</span>
                    <span className="font-mono text-[11px] text-slate-400 shrink-0 ml-2">
                      {sub.start} → {sub.end}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Toolbar */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800 pt-4">
              <a
                href="/assets/videos/weapons_of_the_future.mp4"
                download="weapons_of_the_future.mp4"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
                title="MP4 سىن ھۆججىتىنى بىۋاسىتە كومپيۇتېرىڭىز ياكى تېلېفونىڭىزغا چۈشۈرۈش"
              >
                <Download className="w-3.5 h-3.5" />
                <span>MP4 سىننى بىۋاسىتە چۈشۈرۈش (.mp4)</span>
              </a>

              <button
                onClick={handleDownloadSRT}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-sky-500" />
                <span>SRT پىلاستىنكىسى</span>
              </button>

              <button
                onClick={handleDownloadHTML}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ئۇيغۇرچە HTML ھۆججىتى چۈشۈرۈش</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
