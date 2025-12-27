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
  totalNews = this.newsService.totalNews;
  availableSources = this.newsService.availableSources;

  pageSize = 10;
  currentPage = signal(1);

  currentProject = toSignal(this.layout.currentProject$);

  paginatedNews = computed(() => {
    // News is already paginated from the server
    return this.filteredNews();
  });

  totalPages = computed(() => {
    return Math.ceil(this.totalNews() / this.pageSize);
  });

  constructor() {
    effect(() => {
      const project = this.currentProject();
      const filters = this.filters();
      const page = this.currentPage();

      console.log('Effect triggered - Project:', project, 'Page:', page);

      if (!project?.id) {
        console.warn('No project ID, skipping fetch');
        return;
      }

      // Build filter options
      const options: any = {
        page,
        limit: this.pageSize,
      };

      if (filters.searchTerm) {
        options.search = filters.searchTerm;
      }

      if (filters.sources.length > 0) {
        options.sources = filters.sources.join(',');
      }

      if (filters.dateFrom) {
        options.dateFrom = filters.dateFrom;
      }

      if (filters.dateTo) {
        options.dateTo = filters.dateTo;
      }

      console.log('Fetching news with options:', options);

      // Fetch news with filters
      this.newsService
        .getNewsByProject(project.id, options)
        .subscribe((response) => {
          console.log('News fetched:', response);
          this.newsService.remoteNews.set(response.data);
          this.newsService.totalNews.set(response.total);
        }, (error) => {
          console.error('Error fetching news:', error);
        });
    });

    // Load available sources when project changes
    effect(() => {
      const project = this.currentProject();
      if (!project?.id) {
        console.warn('No project ID for sources, skipping');
        return;
      }

      console.log('Fetching sources for project:', project.id);

      this.newsService.getNewsSources(project.id).subscribe((response) => {
        console.log('Sources fetched:', response);
        this.newsService.availableSources.set(response.sources);
      }, (error) => {
        console.error('Error fetching sources:', error);
      });
    });
  }


  ngOnInit(): void {
    this.layout.showFullHeader();
    // El título se establece automáticamente cuando se selecciona un proyecto
  }

  onFiltersChange(filters: FilterState): void {
    this.newsService.updateFilters(filters);
    this.currentPage.set(1); // Reset to first page when filters change
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
