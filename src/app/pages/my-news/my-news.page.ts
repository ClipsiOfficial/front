import { Component, inject, effect, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NewsService } from '../../services/news.service';
import { ResultsNewsCardComponent } from '../../components/results-news-card/results-news-card.component';
import { NewsFiltersComponent } from '../../components/news-filters/news-filters.component';
import { LayoutService } from '../../services/layout.service';
import { ProjectsService } from '../../services/projects.service';
import { NewsItem, FilterState, SavedNews } from '../../models/news.model';

@Component({
  selector: 'app-my-news-page',
  imports: [ResultsNewsCardComponent, NewsFiltersComponent, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './my-news.page.html',
})
export class MyNewsPage {
  private newsService = inject(NewsService);
  private layout = inject(LayoutService);
  private route = inject(ActivatedRoute);
  private projectsService = inject(ProjectsService);
  private snackBar = inject(MatSnackBar);

  currentProject = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('projectId')),
      switchMap((id) => this.projectsService.getProject(Number(id)))
    )
  );

  savedNews = signal<NewsItem[]>([]);
  totalSavedNews = signal<number>(0);
  isLoading = signal<boolean>(false);

  // Filters state
  filters = signal<FilterState>({
    searchTerm: '',
    keywords: '', // Not used here
    sources: [],
    categories: [],
    dateFrom: '',
    dateTo: ''
  });

  availableSources = signal<string[]>([]);
  dummyKeywords = signal<string[]>([]); // To pass to component

  constructor() {
    // Update project title in layout service
    effect(() => {
      const project = this.currentProject();
      if (project) {
        this.layout.setProjectTitle(project.name);
      }
    });

    // Load available sources
    effect(() => {
      const project = this.currentProject();
      if (project?.id) {
        this.newsService.getNewsSources(project.id).subscribe({
          next: (response) => {
            this.availableSources.set(response.sources);
          },
          error: (err) => {
            console.error('Error fetching sources:', err);
            this.snackBar.open(
              'Failed to load news sources. Some filters may be unavailable.',
              'Dismiss',
              { duration: 5000 }
            );
          }
        });
      }
    });

    // Load saved news when project or filters change
    effect(() => {
      const project = this.currentProject();
      const currentFilters = this.filters(); // dependence

      if (project?.id) {
        this.loadSavedNews(project.id, currentFilters);
      }
    });
  }

  ngOnInit(): void {
    this.layout.showFullHeader();
  }

  loadSavedNews(projectId: number, filters: FilterState): void {
    this.isLoading.set(true);

    // Convert FilterState to API options
    const options: any = { page: 1, limit: 100 };

    if (filters.searchTerm) options.search = filters.searchTerm;
    if (filters.sources?.length) options.sources = filters.sources.join(','); // API expects comma separated
    if (filters.categories?.length) options.categories = filters.categories.join(',');
    if (filters.dateFrom) options.dateFrom = filters.dateFrom;
    if (filters.dateTo) options.dateTo = filters.dateTo;

    this.newsService.getSavedNews(projectId, options).subscribe({
      next: (response) => {
        // Cast as NewsItem[] to satisfy component input
        this.savedNews.set(response.data as unknown as NewsItem[]);
        this.totalSavedNews.set(response.total);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading saved news:', error);
        this.snackBar.open('Failed to load saved news. Please try again.', 'Dismiss', {
          duration: 5000
        });
        this.isLoading.set(false);
      }
    });
  }

  onFiltersChange(newFilters: FilterState): void {
    this.filters.set(newFilters);
  }

  onRemove(id: number): void {
    // Current logic: wait for server.
    this.newsService.deleteSavedNews(id).subscribe({
      next: () => {
        this.savedNews.update(news => news.filter(n => n.id !== id));
        this.totalSavedNews.update(total => total - 1);
      },
      error: (error) => {
        console.error('Error deleting saved news:', error);
        this.snackBar.open('Failed to remove saved news. Please try again.', 'Dismiss', {
          duration: 5000
        });
      }
    });
  }

  onNewsEdit(updatedData: Partial<SavedNews>): void {
    if (!updatedData.id) return;

    this.newsService.updateSavedNews(updatedData.id, {
      title: updatedData.title,
      summary: updatedData.summary || undefined,
      category: updatedData.category,
    }).subscribe({
      next: (response) => {
        // Update the local array
        this.savedNews.update(news =>
          news.map(n => n.id === updatedData.id ? { ...n, ...response } as NewsItem : n)
        );
        this.snackBar.open('✅ News updated successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar'],
        });

        // Refetch to ensure the item still matches current filters
        const project = this.currentProject();
        if (project?.id) {
          this.loadSavedNews(project.id, this.filters());
        }
      },
      error: (error) => {
        console.error('Error updating news:', error);
        this.snackBar.open('❌ Error updating news', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'],
        });
      }
    });
  }

  handleExport(): void {
    console.log('Export', this.savedNews().length, 'news');
  }
}
