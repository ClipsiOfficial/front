import { Injectable, signal, computed, inject } from '@angular/core';
import { NewsItem, FilterState } from '../models/news.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private api = inject(ApiService);

  getNewsByProject(
    projectId: number,
    options?: {
      page?: number;
      limit?: number;
      search?: string;
      sources?: string;
      dateFrom?: string;
      dateTo?: string;
    }
  ) {
    const params: any = { projectId: projectId.toString() };
    if (options?.page) params.page = options.page.toString();
    if (options?.limit) params.limit = options.limit.toString();
    if (options?.search) params.search = options.search;
    if (options?.sources) params.sources = options.sources;
    if (options?.dateFrom) params.dateFrom = options.dateFrom;
    if (options?.dateTo) params.dateTo = options.dateTo;

    return this.api.get<{
      data: NewsItem[];
      total: number;
      page: number;
      limit: number;
    }>('/news', { params });
  }

  getNewsSources(projectId: number) {
    return this.api.get<{ sources: string[] }>('/news/sources', {
      params: { projectId: projectId.toString() }
    });
  }

  /**
   * Saves an existing news to the saved_news table for a project
   * @param newsId ID of the news to save
   * @param projectId ID of the destination project
   */
  saveNewsToProject(newsId: number, projectId: number) {
    return this.api.post<{ id: number }>(`/news/${newsId}/save`, { projectId });
  }

  /**
   * Deletes a saved news record
   * @param savedNewsId ID of the saved news record to delete
   */
  deleteSavedNews(savedNewsId: number) {
    return this.api.delete(`/saved-news/${savedNewsId}`);
  }

  // State signals
  filters = signal<FilterState>({
    searchTerm: '',
    keywords: '',
    sources: [],
    categories: [],
    dateFrom: '',
    dateTo: '',
  });

  remoteNews = signal<NewsItem[]>([]);
  totalNews = signal<number>(0);
  keywords = signal<string[]>([]);
  selectedNewsIds = signal<number[]>([]);
  availableSources = signal<string[]>([]);

  // Computed signals
  filteredNews = computed(() => {
    // Filtering is now done server-side, just return the remote news
    return this.remoteNews();
  });

  selectedNews = computed(() => {
    const selectedIds = this.selectedNewsIds();
    return this.remoteNews().filter((news) =>
      selectedIds.includes(news.id)
    );
  });

  // Methods
  toggleNewsSelection(id: number): void {
    this.selectedNewsIds.update((ids) =>
      ids.includes(id) ? ids.filter((newsId) => newsId !== id) : [...ids, id]
    );
  }

  updateFilters(filters: FilterState): void {
    this.filters.set(filters);
  }

  addKeyword(keyword: string): void {
    const trimmed = keyword.trim();
    if (trimmed && !this.keywords().includes(trimmed)) {
      this.keywords.update((keywords) => [...keywords, trimmed]);
    }
  }

  removeKeyword(keyword: string): void {
    this.keywords.update((keywords) => keywords.filter((k) => k !== keyword));
  }

  setKeywords(keywords: string[]): void {
    this.keywords.set(keywords);
  }

  removeFromSelected(id: number): void {
    this.selectedNewsIds.update((ids) => ids.filter((newsId) => newsId !== id));
  }

  getAllNews(): NewsItem[] {
    return [...this.remoteNews()];
  }

  clearNews(): void {
    this.remoteNews.set([]);
    this.selectedNewsIds.set([]);
  }
}
