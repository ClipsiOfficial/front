import { Component, inject, signal, computed, effect } from '@angular/core';

import { NewsService } from '../../services/news.service';
import { NewsFiltersComponent } from '../../components/news-filters/news-filters.component';
import { NewsItem, FilterState } from '../../models/news.model';
import { LayoutService } from '../../services/layout.service';
import { ResultsNewsCardComponent } from '../../components/results-news-card/results-news-card.component';
import { MatIconModule } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-results-page',
  imports: [NewsFiltersComponent, ResultsNewsCardComponent, MatIconModule],
  templateUrl: './results.page.html',
})
export class ResultsPage {
  private newsService = inject(NewsService);
  private layout = inject(LayoutService);

  filteredNews = this.newsService.filteredNews;
  selectedNewsIds = this.newsService.selectedNewsIds;
  filters = this.newsService.filters;
  keywords = this.newsService.keywords;

  pageSize = 10;
  currentPage = signal(1);

  currentProject = toSignal(this.layout.currentProject$);

  paginatedNews = computed(() => {
    const all = this.filteredNews();
    const start = (this.currentPage() - 1) * this.pageSize;
    return all.slice(start, start + this.pageSize);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredNews().length / this.pageSize);
  });
  
  constructor() {
    effect(() => {
      const project = this.currentProject();

      console.log('CURRENT PROJECT:', project);

      if (!project?.id) return;

      this.newsService
        .getNewsByProject(project.id, {
          page: 1,
          limit: 10,
        })
        .subscribe((response) => {
          console.log('NEWS RESPONSE:', response);
          const mappedNews: NewsItem[] = response.data.map((news: any) => ({
            id: news.id,
            title: news.title,
            summary: news.summary,
            url: news.url,
            timestamp: news.timestamp,
            rssAtomId: news.rssAtomId,
            source: this.newsService.extractSourceName(news.url),
          }));

          console.log('MAPPED NEWS:', mappedNews);

          this.newsService.remoteNews.set(mappedNews);
          //this.newsService.remoteNews.set(response.data);
        });
    });
  }


  ngOnInit(): void {
    this.layout.showFullHeader();
    // El título se establece automáticamente cuando se selecciona un proyecto
  }

  onFiltersChange(filters: FilterState): void {
    this.newsService.updateFilters(filters);
  }

  onKeywordsChange(keywords: string[]): void {
    this.newsService.setKeywords(keywords);
  }

  onToggleNews(id: number): void {
    this.newsService.toggleNewsSelection(id);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
}
