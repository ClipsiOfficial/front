import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from '../../services/news.service';
import { NewsFiltersComponent } from '../news-filters/news-filters.component';
import { NewsTableComponent } from '../news-table/news-table.component';
import { FilterState } from '../../models/news.model';

@Component({
  selector: 'app-results-section',
  imports: [CommonModule, NewsFiltersComponent, NewsTableComponent],
  templateUrl: './results-section.component.html',
})
export class ResultsSectionComponent {
  private newsService = inject(NewsService);

  filteredNews = this.newsService.filteredNews;
  selectedNewsIds = this.newsService.selectedNewsIds;
  filters = this.newsService.filters;
  keywords = this.newsService.keywords;

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
