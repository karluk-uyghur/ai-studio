export interface SubtitleItem {
  id: number;
  start: string;
  end: string;
  text: string;
}

export interface TranslationData {
  title: string;
  fullText: string;
  paragraphs: string[];
  subtitles: SubtitleItem[];
  politicalSummary?: string;
}

export interface NewsItem {
  id: number;
  date: string;
  category: string;
  title: string;
  summary: string;
  source: string;
  tags: string[];
}

export interface PoliticalAnalysisData {
  headline: string;
  summary: string;
  militaryThreats: string[];
  eastTurkistanImpact: string;
  geopoliticalOutlook: string;
  detailedArticle: string;
}
