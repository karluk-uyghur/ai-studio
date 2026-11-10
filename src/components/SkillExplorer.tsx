import React, { useState } from 'react';
import { 
  Folder, FolderOpen, FileCode, FileText, Check, 
  Copy, Download, ExternalLink, Terminal, ShieldAlert, Sparkles 
} from 'lucide-react';

interface FileNode {
  path: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  language?: string;
}

export const SkillExplorer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  // File structure tree
  const fileTree: FileNode = {
    name: '.agents/skills/qarluq-video-translator',
    path: '.agents/skills/qarluq-video-translator',
    type: 'folder',
    children: [
      {
        name: 'SKILL.md',
        path: 'SKILL.md',
        type: 'file',
        language: 'markdown',
        content: `---
name: qarluq-video-translator
description: "قارلۇق ۋىدىئو تەرجىمە قورالى - ئۇيغۇر ئەدەبىي تىلىدا ئەلا سۈپەتلىك ۋىدىئو، ئاۋاز ۋە ماقالە تەرجىمە قىلىش، سىياسىي-ھەربىي تەھلىل ئېلىپ بېرىش، ئارقا مۇزىكىنى سۈزۈش ۋە مەخسۇس ئاۋاز ماھارىتى."
---

# قارلۇق ۋىدىئو تەرجىمە قورالى (Qarluq Video Translator Agent Skill)

1. **تىل ۋە پاساھەت**: ئۇيغۇر ئەدەبىي تىلىدا ئەلا سۈپەتلىك تەرجىمە.
2. **ئاتالغۇ سىياسىتى**: چوقۇم «خىتاي» ۋە «شەرقىي تۈركىستان» سۆزلىرىنى ئىشلىتىش.
3. **ئابزاس ۋە شەكىل**: نۇسخا تولۇق RTL، ئوڭ-سول تۈز تەڭشەلگەن (Justified)، بىرىنچى قۇرى 2 ھەرىپ كېيىن باشلىنىدۇ (2em indent).
4. **فونت**: UKIJ Tuz نۇسخىسى.
5. **ئاۋاز ۋە مۇزىكا سۈزۈش**: ۋىدىئودىكى ئارقا مۇزىكىنى چىقىرىپ تاشلاپ ساپ ئاۋازنى ئايرىش.`
      },
      {
        name: 'scripts',
        path: 'scripts',
        type: 'folder',
        children: [
          {
            name: 'validate.py',
            path: 'scripts/validate.py',
            type: 'file',
            language: 'python',
            content: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""قارلۇق تەرجىمە تەكشۈرۈش سكرىپتى"""
import sys

FORBIDDEN_MAPPINGS = {
    "جۇڭگو": "خىتاي",
    "شىنجاڭ": "شەرقىي تۈركىستان",
    "ئاپتونوم رايون": "ئىشغال ئاستىدىكى شەرقىي تۈركىستان زېمىنى",
}

def validate_text(content: str) -> bool:
    print("🔍 تەكشۈرۈش ئېلىپ بېرىلماقتا...")
    for bad, good in FORBIDDEN_MAPPINGS.items():
        if bad in content:
            print(f"❌ خاتالىق: '{bad}' تېپىلدى. ئورنىغا '{good}' ئىشلىتىڭ.")
            return False
    print("✅ بارلىق سىياسىي ۋە ئەدەبىي تىل ئۆلچەملىرىگە ئۇيغۇن!")
    return True

if __name__ == "__main__":
    validate_text(sys.argv[1] if len(sys.argv) > 1 else "خىتاي ۋە شەرقىي تۈركىستان")`
          },
          {
            name: 'fetch_youtube.py',
            path: 'scripts/fetch_youtube.py',
            type: 'file',
            language: 'python',
            content: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""YouTube سىن ئۇچۇرلىرى ۋە تېكىستىنى تارتىش سكرىپتى"""
import sys, json, re, urllib.request

def fetch_video_metadata(url: str):
    yt_id = ""
    match = re.search(r'(?:youtu\\.be\\/|youtube\\.com\\/(?:watch\\?v=|embed\\/))([a-zA-Z0-9_-]{11})', url)
    if match: yt_id = match.group(1)
    if yt_id:
        req = urllib.request.Request(f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={yt_id}&format=json")
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print(f"🎬 ماۋزۇ: {data.get('title')}")
            return data
    return {"title": "سىن ئۇچۇرى", "url": url}

if __name__ == "__main__":
    fetch_video_metadata(sys.argv[1] if len(sys.argv) > 1 else "https://youtu.be/bYrwEQ_Fr_I")`
          },
          {
            name: 'build.sh',
            path: 'scripts/build.sh',
            type: 'file',
            language: 'bash',
            content: `#!/usr/bin/env bash
set -e
echo "🚀 قارلۇق Agent Skill قۇرۇلمىسىنى تەييارلاش..."
python3 scripts/validate.py "خىتاي ۋە شەرقىي تۈركىستان ۋەزىيىتى تەھلىلى"
echo "🎉 مۇۋەپپەقىيەتلىك تامام Rome قىلىندى!"`
          },
          {
            name: 'convert.js',
            path: 'scripts/convert.js',
            type: 'file',
            language: 'javascript',
            content: `/**
 * قارلۇق فورمات ئايلاندۇرغۇچ (SRT, VTT ۋە 2em Indent)
 */
function formatUyghurParagraphs(rawText) {
  return rawText.split(/\\n\\s*\\n/).map(p => \`    \${p.trim()}\`).join('\\n\\n');
}
module.exports = { formatUyghurParagraphs };`
          }
        ]
      },
      {
        name: 'references',
        path: 'references',
        type: 'folder',
        children: [
          {
            name: 'api-guide.md',
            path: 'references/api-guide.md',
            type: 'file',
            language: 'markdown',
            content: `# API قوللانمىسى
POST /api/translate
POST /api/analyze-politics
GET /api/news-feed`
          },
          {
            name: 'style-guide.md',
            path: 'references/style-guide.md',
            type: 'file',
            language: 'markdown',
            content: `# قارلۇق ئۇسلۇب قوللانمىسى
1. فۇندى UKIJ Tuz بولسۇن.
2. ئابزاس rtl بولسۇن، ئوڭ-سول تەرىپى تۈز تەڭشەلسۇن (Justified).
3. ئابزاسنىڭ بىرىنچى قۇرى دەل 2 ھەرىپ كەينىدىن باشلانسۇن (text-indent: 2em).
4. تىنەش بەلگىلىرى ئۇيغۇرچە بولسۇن (، ؛ ؟).`
          },
          {
            name: 'glossary.md',
            path: 'references/glossary.md',
            type: 'file',
            language: 'markdown',
            content: `# قارلۇق ئاتالغۇ لۇغىتى
- جۇڭگو -> خىتاي (مەجبۇرىي)
- شىنجاڭ -> شەرقىي تۈركىستان (مەجبۇرىي)
- تەربىيەلەش مەركىزى -> جازا لاگېرى
- ئارتۇقچە ئىشچى يۆتكەش -> مەجبۇرىي ئەمگەك`
          },
          {
            name: 'examples.md',
            path: 'references/examples.md',
            type: 'file',
            language: 'markdown',
            content: `# ياخشى ۋە ناچار ئۈلگىلەر
✅ ياخشى: "    خىتاينىڭ شەرقىي تۈركىستاندىكى ھەربىي بازىلىرى..."
❌ ناچار: "بېيجىڭ شىنجاڭدا نازارەتنى چىڭىتتى."`
          }
        ]
      },
      {
        name: 'assets',
        path: 'assets',
        type: 'folder',
        children: [
          {
            name: 'video_source.json',
            path: 'assets/video_source.json',
            type: 'file',
            language: 'json',
            content: `{
  "videoId": "bYrwEQ_Fr_I",
  "url": "https://youtu.be/bYrwEQ_Fr_I?si=kS0ZVj3gnJG6zGcl",
  "title": "The \\"Weapons of the Future\\" Event! (Art of War 3 RTS)",
  "uyghurTitle": "«كەلگۈسى قوراللىرى» ھەربىي تاكتىكا ۋە قوراللىنىش تەھلىلى (Art of War)",
  "author": "Art Of War 3: Global Conflict"
}`
          },
          {
            name: 'weapons_of_the_future.srt',
            path: 'assets/weapons_of_the_future.srt',
            type: 'file',
            language: 'text',
            content: `1
00:00:01,000 --> 00:00:05,500
«كەلگۈسى قوراللىرى» ناملىق ھەربىي تاكتىكا پائالىيىتى تەھلىلى

2
00:00:06,000 --> 00:00:11,000
زامانىۋى يۇقىرى تېخنىكىلىق قوراللار ۋە جەڭ تاكتىكىسىنىڭ ئەھمىيىتى

3
00:00:12,000 --> 00:00:17,500
خىتاينىڭ كەلگۈسى قوراللىرىنى تەرەققىي قىلدۇرۇپ رايونغا خەۋپ يەتكۈزۈشى

4
00:00:18,000 --> 00:00:24,000
شەرقىي تۈركىستاندا قۇرۇلغان ئىلغار ھەربىي قوراللىنىش سىستېمىلىرى`
          },
          {
            name: 'weapons_of_the_future_translation.html',
            path: 'assets/weapons_of_the_future_translation.html',
            type: 'file',
            language: 'html',
            content: `<!DOCTYPE html>
<html lang="ug" dir="rtl">
<head>
  <style>
    body { font-family: 'UKIJ Tuz', Tahoma, sans-serif; direction: rtl; }
    p { text-align: justify; text-indent: 2em; line-height: 2.1; }
  </style>
</head>
<body>
  <h1>«كەلگۈسى قوراللىرى» ھەربىي تاكتىكا ۋە قوراللىنىش تەھلىلى</h1>
  <p>    زامانىۋى يۇقىرى تېخنىكىلىق جەڭ مۇھىتىدا، كەلگۈسى قوراللىرى پۈتكۈل دۇنياۋى ھەربىي تەڭپۇڭلۇقنى ئۆزگەرتمەكتە...</p>
</body>
</html>`
          },
          {
            name: 'political_military_analysis.md',
            path: 'assets/political_military_analysis.md',
            type: 'file',
            language: 'markdown',
            content: `# «كەلگۈسى قوراللىرى» ۋە خىتاينىڭ شەرقىي تۈركىستاندىكى ھەربىي تاكتىكىسى
- مەنبە: https://youtu.be/bYrwEQ_Fr_I
- خىتاي كوممۇنىست پارتىيىسىنىڭ رايوندىكى دېروئىن بازىلىرى ۋە باستۇرۇش سىياسەتلىرى ئانالىزى.`
          },
          {
            name: 'weapons_of_the_future.mp4',
            path: 'assets/weapons_of_the_future.mp4',
            type: 'file',
            language: 'binary',
            content: `[MP4 سىن ھۆججىتى (H.264 / AAC Audio - 98 KB) - مەزكۇر ھۆججەتنى «چۈشۈرۈش» كۇنۇپكىسى ئارقىلىق بىۋاسىتە چۈشۈرۈپ ئاڭلىيالايسىز / كۆرەلەيسىز]`
          },
          {
            name: 'template.html',
            path: 'assets/template.html',
            type: 'file',
            language: 'html',
            content: `<!DOCTYPE html>
<html lang="ug" dir="rtl">
<head>
  <style>
    body { font-family: 'UKIJ Tuz', Tahoma, sans-serif; direction: rtl; }
    p { text-align: justify; text-indent: 2em; line-height: 2.1; }
  </style>
</head>
<body>
  <h1>شەرقىي تۈركىستان ۋە خىتاينىڭ رايوندىكى ۋەزىيىتى تەھلىلى</h1>
  <p>خىتاي ھاكىمىيىتىنىڭ سىياسىي ھەرىكەتلىرى خەلقئارالىق تەنقىدكە ئۇچرىماقتا...</p>
</body>
</html>`
          }
        ]
      }
    ]
  };

  const [selectedFile, setSelectedFile] = useState<FileNode>(fileTree.children![0]);

  const handleCopyCode = () => {
    if (selectedFile.content) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadFile = () => {
    if (!selectedFile.content) return;
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                <FileCode className="w-5 h-5" />
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-serif">
                قارلۇق ۋىدىئو تەرجىمە Agent Skill ئۆلچەملىك ھۆججەتلەر ئامبىرى
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 uyghur-text">
              بۇ قۇرۇلما Claude, Gemini, OpenAI Agents ۋە پۈتكۈل سۈنئىي ئەقىل سىستېمىلىرى قوبۇل قىلىدىغان ئۆلچەملىك Skill شەكىلدە تۈزۈلگەن.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
              .agents/skills/qarluq-video-translator
            </span>
          </div>
        </div>
      </div>

      {/* Main File Explorer Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Tree Explorer (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-sky-500" />
              ھۆججەت تىزىملىكى (Tree)
            </span>
            <span className="text-[11px] text-slate-400 font-mono">10 ھۆججەت</span>
          </div>

          <div className="space-y-1 font-mono text-xs" dir="ltr">
            {/* Root folder */}
            <div className="text-sky-600 dark:text-sky-400 font-bold flex items-center gap-1.5 py-1">
              <Folder className="w-4 h-4" />
              <span>qarluq-video-translator/</span>
            </div>

            {/* Child nodes */}
            <div className="pl-4 space-y-1 border-l border-slate-200 dark:border-slate-800">
              {/* SKILL.md */}
              <button
                onClick={() => setSelectedFile(fileTree.children![0])}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                  selectedFile.name === 'SKILL.md'
                    ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 font-bold'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>SKILL.md</span>
              </button>

              {/* scripts folder */}
              <div className="pt-1">
                <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 py-1 font-semibold">
                  <Folder className="w-3.5 h-3.5 text-amber-500" />
                  <span>scripts/</span>
                </div>
                <div className="pl-4 space-y-1 border-l border-slate-200 dark:border-slate-800">
                  {fileTree.children![1].children?.map((file) => (
                    <button
                      key={file.name}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-left transition-colors ${
                        selectedFile.name === file.name
                          ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{file.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* references folder */}
              <div className="pt-1">
                <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 py-1 font-semibold">
                  <Folder className="w-3.5 h-3.5 text-indigo-500" />
                  <span>references/</span>
                </div>
                <div className="pl-4 space-y-1 border-l border-slate-200 dark:border-slate-800">
                  {fileTree.children![2].children?.map((file) => (
                    <button
                      key={file.name}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-left transition-colors ${
                        selectedFile.name === file.name
                          ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{file.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* assets folder */}
              <div className="pt-1">
                <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 py-1 font-semibold">
                  <Folder className="w-3.5 h-3.5 text-purple-500" />
                  <span>assets/</span>
                </div>
                <div className="pl-4 space-y-1 border-l border-slate-200 dark:border-slate-800">
                  {fileTree.children![3].children?.map((file) => (
                    <button
                      key={file.name}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-left transition-colors ${
                        selectedFile.name === file.name
                          ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5 text-purple-500" />
                      <span>{file.name}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Code / Content Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
          
          {/* Header Bar */}
          <div className="p-4 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-500">.agents/skills/qarluq-video-translator/</span>
              <span className="font-bold text-sky-600 dark:text-sky-400">{selectedFile.path}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 shadow-2xs transition-colors"
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

              <button
                onClick={handleDownloadFile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-2xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>چۈشۈرۈش</span>
              </button>
            </div>
          </div>

          {/* Content Code Display */}
          <div className="p-5 overflow-x-auto bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed" dir="ltr">
            <pre className="whitespace-pre-wrap">{selectedFile.content || 'بۇ ھۆججەت بوش.'}</pre>
          </div>

        </div>

      </div>

    </div>
  );
};
