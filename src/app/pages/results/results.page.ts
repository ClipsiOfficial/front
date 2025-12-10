import { Component, inject, signal, computed } from '@angular/core';

import { NewsService } from '../../services/news.service';
import { NewsFiltersComponent } from '../../components/news-filters/news-filters.component';
import { FilterState } from '../../models/news.model';
import { LayoutService } from '../../services/layout.service';
import { ResultsNewsCardComponent } from '../../components/results-news-card/results-news-card.component';
import { MatIconModule } from '@angular/material/icon';

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

  paginatedNews = computed(() => {
    const all = this.filteredNews();
    const start = (this.currentPage() - 1) * this.pageSize;
    return all.slice(start, start + this.pageSize);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredNews().length / this.pageSize);
  });

  ngOnInit(): void {
    this.layout.showFullHeader();
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
