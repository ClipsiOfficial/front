export interface NewsItem {
  id: number;
  title: string;
  summary: string | null;
  url: string;
  timestamp: string;
  source: string;
  category?: string;
  rssAtomId: number | null;
}

export interface SavedNews {
  id: number;
  title: string;
  summary: string | null;
  projectId: number;
  sourceNewId: number;
  category: string | null;
  views: number;
  url?: string;
  source?: string;
  timestamp?: string;
}

export interface FilterState {
  searchTerm: string;
  keywords: string;
  sources: string[];
  categories: string[];
  dateFrom: string;
  dateTo: string;
}

export const AVAILABLE_SOURCES = [
  'El Economista',
  'Expansión',
  'La Vanguardia',
  'Cinco Días',
  'El País',
] as const;

export const AVAILABLE_CATEGORIES = [
  'Tecnología',
  'Finanzas',
  'Turismo',
  'Sostenibilidad',
  'Economía',
  'Recursos Humanos',
  'Inmobiliario',
] as const;
