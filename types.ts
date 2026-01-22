export interface TimelineEvent {
  date: string;
  time?: string;
  title: string;
  description: string;
  sentimentScore: number; // -1 (negative) to 1 (positive)
  tags: string[];
}

export interface NewsAnalysis {
  headline: string;
  summary: string;
  events: TimelineEvent[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface AppState {
  url: string;
  analysis: NewsAnalysis | null;
  loadingState: LoadingState;
  errorMessage: string | null;
  generatedImage: string | null;
  isImageLoading: boolean;
}