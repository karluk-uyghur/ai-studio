/**
 * قارلۇق فورمات ئايلاندۇرغۇچ (SRT, VTT, تېكىست ۋە ئابزاس)
 */

function formatUyghurParagraphs(rawText) {
  if (!rawText) return '';
  const paragraphs = rawText
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);

  return paragraphs.map(p => {
    // 2em indent format
    return `    ${p}`;
  }).join('\n\n');
}

function srtToVtt(srtContent) {
  let vtt = 'WEBVTT - قارلۇق ۋىدىئو تەرجىمە كىنو يېزىقى\n\n';
  vtt += srtContent.replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2');
  return vtt;
}

module.exports = {
  formatUyghurParagraphs,
  srtToVtt
};

if (require.main === module) {
  const sample = "بۇ بىرىنچى ئابزاس.\n\nبۇ ئىككىنچى ئابزاس بولۇپ، ئابزاسنىڭ بىرىنچى قۇرى ئىككى ھەرىپ كېيىن باشلىنىدۇ.";
  console.log(formatUyghurParagraphs(sample));
}
