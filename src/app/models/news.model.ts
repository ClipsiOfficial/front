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
