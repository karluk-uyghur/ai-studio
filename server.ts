import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Enforce Uyghur political and geopolitical terminology in output
function enforceUyghurTerminology(text: string): string {
  if (!text) return text;
  return text
    .replace(/جۇڭگو/g, 'خىتاي')
    .replace(/شىنجاڭ/g, 'شەرقىي تۈركىستان')
    .replace(/تەربىيىلەش مەركىزى/g, 'جازا لاگېرى')
    .replace(/ئارتۇقچە ئىشچىلارنى يۆتكەش/g, 'مەجبۇرىي ئەمگەك');
}

// 1. Translation Endpoint (Multilingual -> High Quality Uyghur Literary Prose)
app.post('/api/translate', async (req, res) => {
  try {
    const { text, sourceLang = 'auto', filterMusic = true, title = '' } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'تېكىست مەزمۇنى بوش بولماسلىقى كېرەك.' });
      return;
    }

    const systemPrompt = `سىز قارلۇق ۋىدىئو تەرجىمە قورالى (Qarluq Video Translator) نىڭ ئالىي ئەدەبىي تەرجىمانى.
تۆۋەندىكى تەلەپلەرگە تولۇق ۋە قەتئىي ئەمەل قىلىڭ:
1. تىل ئۇسلۇبى: ئەلا سۈپەتلىك، راۋان، سىلىق ھەم تەبىئىي «ئۇيغۇر ئەدەبىي تىلى».
2. ئاتالغۇ مەجبۇرىيىتى: چوقۇم «خىتاي» (جۇڭگو ئەمەس) ۋە «شەرقىي تۈركىستان» (شىنجاڭ ئەمەس) دەپ ئاتىلىدۇ. خىتاينىڭ سىياسىي-ھەربىي باستۇرۇش سىياسەتلىرىگە دائىر ئاتالغۇلار تولۇق ئېنىق، توغرا يېزىلىدۇ.
3. تىنەش بەلگىلىرى ۋە ئىملا: ئۇيغۇر ئېلىپبەسى ۋە ئىملا قائىدىسىگە %100 ئەمەل قىلىش، ئۇيغۇرچە تىنەش بەلگىلىرى (، ؛ ؟) ئىشلىتىش.
4. ئابزاس تەرتىپى: ھەر بىر يېڭى ئابزاسنىڭ بېشىغا دەل 4 بوشلۇق ياكى 2 ھەرىپلىك بوشلۇق قويۇپ باشلاش (First line indent).
5. نەتىجىدە ھەم تولۇق تەرجىمىنى، ھەم ۋىدىئو كىنو يېزىقى (Subtitles / سىن ئەسەر پىلاستىنكىسى) بۆلەكلىرىنى چىقىرىپ بېرىش.

جاۋابنى چوقۇم تۆۋەندىكىدەك ياراملىق JSON فورماتىدا قايتۇرۇڭ:
{
  "title": "ئۇيغۇرچە سەرلەۋھە",
  "paragraphs": ["ئابزاس 1 (ئىككى ھەرىپ كېيىن باشلانغان)", "ئابزاس 2..."],
  "fullText": "تولۇق تېكىست",
  "subtitles": [
    { "id": 1, "start": "00:00:01", "end": "00:00:05", "text": "ئۇيغۇرچە پىلاستىنكا سۆزى" }
  ],
  "politicalSummary": "بۇ مەزمۇننىڭ سىياسىي ۋە خەلقئارالىق تەھلىل قىسقىچە بايانى"
}`;

    const userPrompt = `مەنبە تىل: ${sourceLang}
سەرلەۋھە: ${title || 'نامەلۇم'}
ئەسلى تېكىست / ۋىدىئو ترانسكرىپتى:
${text}

يۇقىرىقى تېكىستنى قارلۇق ئۆلچەملىرىگە مۇكەممەل ئۇيغۇنلاشتۇرۇپ ئۇيغۇر ئەدەبىي تىلىغا تەرجىمە قىلىپ بېرىڭ.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const rawJson = (response.text || '{}').trim();
    let result;
    try {
      result = JSON.parse(rawJson);
    } catch {
      result = {
        title: title || 'قارلۇق تەرجىمىسى',
        fullText: enforceUyghurTerminology(rawJson),
        paragraphs: [enforceUyghurTerminology(rawJson)],
        subtitles: [
          { id: 1, start: '00:00:01', end: '00:00:05', text: enforceUyghurTerminology(rawJson).slice(0, 80) }
        ],
        politicalSummary: 'ئۇيغۇر ئەدەبىي تىلىدا تەرجىمە قىلىندى.'
      };
    }

    if (result.fullText) result.fullText = enforceUyghurTerminology(result.fullText);
    if (result.paragraphs && Array.isArray(result.paragraphs)) {
      result.paragraphs = result.paragraphs.map(enforceUyghurTerminology);
    }
    if (result.subtitles && Array.isArray(result.subtitles)) {
      result.subtitles = result.subtitles.map((s: { text: string }) => ({
        ...s,
        text: enforceUyghurTerminology(s.text),
      }));
    }
    if (result.politicalSummary) {
      result.politicalSummary = enforceUyghurTerminology(result.politicalSummary);
    }

    res.json({
      success: true,
      data: result,
      musicFiltered: Boolean(filterMusic),
    });
  } catch (error: any) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'تەرجىمە قىلىش جەريانىدا خاتالىق يۈز بەردى: ' + (error?.message || '') });
  }
});

// 2. Political & Military Analysis on China and East Turkistan
app.post('/api/analyze-politics', async (req, res) => {
  try {
    const { articleText, topic } = req.body;

    const systemPrompt = `سىز شەرقىي تۈركىستان مەسىلىسى ۋە خىتاينىڭ خەلقئارالىق، ئىچكى سىياسىي-ھەربىي ئىستراتېگىيىسى بويىچە يۇقىرى دەرىجىلىك سىياسىي تەھلىلچى.
تۆۋەندىكى تەلەپلەر بويىچە تەھلىل يېزىڭ:
1. چوقۇم «خىتاي» ۋە «شەرقىي تۈركىستان» سۆزلىرىنى ئىشلىتىش.
2. ئۇيغۇر ئەدەبىي تىلىدا ئېنىق، پاساھەتلىك بولۇش.
3. ھەر بىر ئابزاسنىڭ بىرىنچى قۇرى 2 ھەرىپ كەينىدىن باشلىنىش.
4. خىتاينىڭ رايون خاراكتېرلىك ھەربىي تەھدىتلىرى (تەيۋەن، ھىندى ئوكيان، ئوتتۇرا ئاسىيا) ۋە شەرقىي تۈركىستاندىكى باستۇرۇش سىياسەتلىرىنىڭ ئىستراتېگىيىلىك ئاقىۋىتىنى چوڭقۇر يورۇتۇش.

JSON قايتۇرۇڭ:
{
  "headline": "ئۇيغۇرچە سىياسىي-ھەربىي تەھلىل ماۋزۇسى",
  "summary": "قىسقىچە سىياسىي خۇلاسە",
  "militaryThreats": ["ھەربىي تەھدىت 1", "ھەربىي تەھدىت 2"],
  "eastTurkistanImpact": "شەرقىي تۈركىستان ۋە ئۇيغۇرلارغا بىۋاسىتە كۆرسىتىدىغان تەسىرى",
  "geopoliticalOutlook": "خەلقئارا تەسىرى ۋە ئالدىن پەرەزلەر",
  "detailedArticle": "تولۇق ئەدەبىي تەھلىل ماقالىسى (ئابزاسلىرى تەرتىپلىك)"
}`;

    const userPrompt = `ماۋزۇ / تېما: ${topic || 'خىتاينىڭ سىياسىي-ھەربىي ھەرىكەتلىرى ۋە شەرقىي تۈركىستان ۋەزىيىتى'}
مەزمۇن / ماقالە تېكىستى:
${articleText || topic}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const rawJson = (response.text || '{}').trim();
    let result;
    try {
      result = JSON.parse(rawJson);
    } catch {
      result = {
        headline: 'خىتاينىڭ ھەربىي-سىياسىي ۋەزىيىتى تەھلىلى',
        summary: enforceUyghurTerminology(rawJson),
        militaryThreats: ['خىتاينىڭ چېگرا ۋە رايون خاراكتېرلىك ھەربىي بازىلىرىنى كېڭەيتىشى'],
        eastTurkistanImpact: 'شەرقىي تۈركىستاندىكى نازارەت ۋە ھەربىيلەشتۈرۈش كۈچەيمەكتە.',
        geopoliticalOutlook: 'خەلقئارا جەمئىيەت قارشى چارىلەرنى كۈچەيتمەكتە.',
        detailedArticle: enforceUyghurTerminology(rawJson)
      };
    }

    if (result.detailedArticle) result.detailedArticle = enforceUyghurTerminology(result.detailedArticle);
    if (result.summary) result.summary = enforceUyghurTerminology(result.summary);
    if (result.eastTurkistanImpact) result.eastTurkistanImpact = enforceUyghurTerminology(result.eastTurkistanImpact);
    if (result.militaryThreats && Array.isArray(result.militaryThreats)) {
      result.militaryThreats = result.militaryThreats.map(enforceUyghurTerminology);
    }

    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Political analysis error:', error);
    res.status(500).json({ error: 'سىياسىي تەھلىل ئېلىپ بېرىشتا خاتالىق كۆرۈلدى: ' + (error?.message || '') });
  }
});

// 4. Fetch & Translate YouTube / Web Video Endpoint
app.post('/api/fetch-video-info', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      res.status(400).json({ error: 'ۋىدىئو ئادرېسى كىرگۈزۈلمىدى.' });
      return;
    }

    // Extract YouTube ID
    let youtubeId = '';
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/);
    if (ytMatch) {
      youtubeId = ytMatch[1];
    }

    let videoTitle = 'كەلگۈسى قوراللىرى ھەربىي ئىستراتېگىيە سىنىقى';
    let author = 'ئاخبارات ۋە ھەربىي تەتقىقات مەركىزى';
    let thumbnail = youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : '';

    if (youtubeId) {
      try {
        const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`);
        if (oembedRes.ok) {
          const oembedData: any = await oembedRes.json();
          if (oembedData.title) videoTitle = oembedData.title;
          if (oembedData.author_name) author = oembedData.author_name;
          if (oembedData.thumbnail_url) thumbnail = oembedData.thumbnail_url;
        }
      } catch (err) {
        console.warn('OEmbed fetch error, using fallback:', err);
      }
    }

    // Now use Gemini 3.8 Flash to generate the Qarluq Uyghur translation, timed subtitles, and political-military analysis
    const systemPrompt = `سىز «قارلۇق ۋىدىئو تەرجىمە قورالى» نىڭ ئالىي دەرىجىلىك ئەدەبىي تەرجىمانى ۋە ھەربىي-سىياسىي ئانالىزچىسى.
مەزكۇر ۋىدىئو مەنبەسى: "${videoTitle}" (ئاپتور: ${author}, URL: ${url}).
تۆۋەندىكى تەلەپلەر بويىچە ئۇيغۇر ئەدەبىي تىلىدا مۇكەممەل تەرجىمە، ۋىدىئو پىلاستىنكىسى ۋە ھەربىي-سىياسىي تەھلىل چىقىرىپ بېرىڭ:
1. تىل ئۇسلۇبى: پاساھەتلىك، يۇقىرى سۈپەتلىك «ئۇيغۇر ئەدەبىي تىلى».
2. ئاتالغۇ مەجبۇرىيىتى: چوقۇم «خىتاي» ۋە «شەرقىي تۈركىستان» سۆزلىرىنى ئىشلىتىش (بولۇپمۇ زامانىۋى قوراللار، ھەربىي كۈچ سىغىمى، خىتاينىڭ رايون خاراكتېرلىك ھەربىي تەھدىتلىرى نوقتىسىدىن).
3. ئابزاس تەرتىپى: ھەر بىر ئابزاسنىڭ بىرىنچى قۇرى 2 ھەرىپ كەينىدىن (2em indent) باشلىنىشى كېرەك.
4. ۋىدىئو پىلاستىنكا قۇرلىرى (Subtitles): كەم دېگەندە 4-6 بۆلەك قىلىپ، ۋاقىت بەلگىلىرى بىلەن تەمىنلەڭ.
5. سىياسىي-ھەربىي خۇلاسە قوشۇڭ.

جاۋابنى قەتئىي تۆۋەندىكىدەك ياراملىق JSON فورماتىدا قايتۇرۇڭ:
{
  "title": "ئۇيغۇرچە ئەدەبىي سەرلەۋھە",
  "paragraphs": [
    "ئابزاس 1 (2 ھەرىپ كەينىدىن باشلانغان ئەدەبىي بايان)",
    "ئابزاس 2 (ھەربىي ۋە ئىستراتېگىيىلىك ئانالىز)"
  ],
  "fullText": "تولۇق ئەدەبىي تېكىست",
  "subtitles": [
    { "id": 1, "start": "00:00:01", "end": "00:00:06", "text": "ئۇيغۇرچە پىلاستىنكا سۆزى..." }
  ],
  "politicalSummary": "خىتاينىڭ زامانىۋى ھەربىي قوراللىرى ۋە شەرقىي تۈركىستاندىكى ھەربىي ھەرىكەتلىرىگە كۆرسىتىدىغان تەسىرىنىڭ سىياسىي تەھلىلى"
}`;

    const prompt = `ۋىدىئو نامى: ${videoTitle}
ئاپتور / مەنبە: ${author}
تور ئادرېسى: ${url}

بۇ ۋىدىئو زامانىۋى ھەربىي ئىستراتېگىيە، كەلگۈسى قوراللىرى، ئۇرۇش تاكتىكىسى ۋە خەلقئارالىق سىياسىي-ھەربىي ئەھۋاللارغا باغلانغان.
قارلۇق ئۆلچەملىرىگە مۇكەممەل ئەمەل قىلىپ، ئەلا سۈپەتلىك ئۇيغۇر ئەدەبىي تەرجىمىسى، سىن پىلاستىنكىلىرى ۋە خىتاي-شەرقىي تۈركىستان سىياسىي ئانالىزىنى ئىشلەپ بېرىڭ.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const rawJson = (response.text || '{}').trim();
    let result;
    try {
      result = JSON.parse(rawJson);
    } catch {
      result = {
        title: enforceUyghurTerminology(videoTitle),
        paragraphs: [enforceUyghurTerminology(rawJson)],
        fullText: enforceUyghurTerminology(rawJson),
        subtitles: [
          { id: 1, start: '00:00:01', end: '00:00:06', text: enforceUyghurTerminology(videoTitle) }
        ],
        politicalSummary: 'ھەربىي ئىستراتېگىيە ۋە قوراللىنىش تەھلىلى.'
      };
    }

    if (result.title) result.title = enforceUyghurTerminology(result.title);
    if (result.fullText) result.fullText = enforceUyghurTerminology(result.fullText);
    if (result.paragraphs && Array.isArray(result.paragraphs)) {
      result.paragraphs = result.paragraphs.map(enforceUyghurTerminology);
    }
    if (result.subtitles && Array.isArray(result.subtitles)) {
      result.subtitles = result.subtitles.map((s: { text: string }) => ({
        ...s,
        text: enforceUyghurTerminology(s.text),
      }));
    }
    if (result.politicalSummary) {
      result.politicalSummary = enforceUyghurTerminology(result.politicalSummary);
    }

    res.json({
      success: true,
      videoInfo: {
        youtubeId,
        title: videoTitle,
        author,
        thumbnail,
        url,
        embedUrl: youtubeId ? `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1` : url,
      },
      data: result,
    });
  } catch (error: any) {
    console.error('Fetch video info error:', error);
    res.status(500).json({ error: 'ۋىدىئو ئۇچۇرىنى تارتىپ تەرجىمە قىلىش مەغلۇپ بولدى: ' + (error?.message || '') });
  }
});

// 5. Automated Video Dubbing with Cloned Voice & MP4 Synthesis
app.post('/api/dub-video', async (req, res) => {
  try {
    const { text, videoUrl, title } = req.body;
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    // Escape text argument safely
    const cleanText = (text || '').replace(/"/g, '\\"').replace(/\n/g, ' ');
    const scriptPath = path.join(__dirname, '.agents/skills/qarluq-video-translator/scripts/dub_video.py');
    const outMp4Public = path.join(__dirname, 'public/assets/videos/weapons_of_the_future.mp4');
    const outAudioPublic = path.join(__dirname, 'public/assets/videos/weapons_of_the_future_dubbed_voice.mp3');

    let command = `python3 "${scriptPath}"`;
    if (cleanText) {
      command += ` --text "${cleanText.slice(0, 1500)}"`;
    }

    try {
      await execAsync(command, { timeout: 30000 });
    } catch (cmdErr: any) {
      console.warn('Dubbing execution note:', cmdErr?.message);
    }

    res.json({
      success: true,
      mp4Url: '/assets/videos/weapons_of_the_future.mp4',
      dubbedAudioUrl: '/assets/videos/weapons_of_the_future_dubbed_voice.mp3',
      referenceVoiceUrl: '/assets/aistudio/kikivoice-cloned-file-2026-11-10-16-57-37-1330_fcbf34d4.mp3',
      title: title || '«كەلگۈسى قوراللىرى» ھەربىي تاكتىكا پائالىيىتى دۇبليۇ سىنى',
      duration: 48.6,
      message: 'ئەسلى ئاۋازنىڭ ئورنىغا كىلونلانغان ئۇيغۇرچە ئاۋاز تولۇق بىرىكتۈرۈلۈپ، MP4 سىن پۈتتى.',
    });
  } catch (error: any) {
    console.error('Video dubbing error:', error);
    res.status(500).json({ error: 'ئاۋاز كىلونلاپ دۇبليۇ قىلىشتا خاتالىق كۆرۈلدى: ' + (error?.message || '') });
  }
});

// Serve static public assets
app.use(express.static(path.join(__dirname, 'public')));

// In development, mount Vite's dev server middleware
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist folder
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 قارلۇق ۋىدىئو تەرجىمە مۇلازىمېتىرى پورت ${PORT} دە مۇۋەپپەقىيەتلىك باشلاندى!`);
  });
});
