import { Component, inject } from '@angular/core';

import { NewsService } from '../../services/news.service';
import { NewsFiltersComponent } from '../../components/news-filters/news-filters.component';
import { NewsTableComponent } from '../../components/news-table/news-table.component';
import { FilterState } from '../../models/news.model';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-results-page',
  imports: [NewsFiltersComponent, NewsTableComponent],
  templateUrl: './results.page.html',
})
export class ResultsPage {
  private newsService = inject(NewsService);
  private layout = inject(LayoutService);

  filteredNews = this.newsService.filteredNews;
  selectedNewsIds = this.newsService.selectedNewsIds;
  filters = this.newsService.filters;
  keywords = this.newsService.keywords;

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
}
