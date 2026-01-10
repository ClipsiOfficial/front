import { Component, inject, signal, computed, effect } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';

import { NewsService } from '../../services/news.service';
import { NewsFiltersComponent } from '../../components/news-filters/news-filters.component';
import { FilterState } from '../../models/news.model';
import { LayoutService } from '../../services/layout.service';
import { ResultsNewsCardComponent } from '../../components/results-news-card/results-news-card.component';
import { MatIconModule } from '@angular/material/icon';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-results-page',
  imports: [NewsFiltersComponent, ResultsNewsCardComponent, MatIconModule, MatSnackBarModule],
  templateUrl: './results.page.html',
})
export class ResultsPage {
  private newsService = inject(NewsService);
  private layout = inject(LayoutService);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private projectsService = inject(ProjectsService);

  newsBeingSaved = signal<number | null>(null);

  filteredNews = this.newsService.filteredNews;
  selectedNewsIds = this.newsService.selectedNewsIds;
  filters = this.newsService.filters;
  keywords = this.newsService.keywords;
  totalNews = this.newsService.totalNews;
  availableSources = this.newsService.availableSources;

  pageSize = 10;
  currentPage = signal(1);

  // Get project from route params
  currentProject = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('projectId')),
      switchMap(projectId => {
        if (!projectId) throw new Error('No project ID in route');
        return this.projectsService.getProject(Number(projectId));
      })
    )
  );

  totalPages = computed(() => {
    return Math.ceil(this.totalNews() / this.pageSize);
  });

  private buildFilterOptions(page: number = this.currentPage()): any {
    const filters = this.filters();
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

    if (filters.categories.length > 0) {
      options.categories = filters.categories.join(',');
    }

    if (filters.dateFrom) {
      options.dateFrom = filters.dateFrom;
    }

    if (filters.dateTo) {
      options.dateTo = filters.dateTo;
    }

    return options;
  }

  constructor() {
    // Update project title in layout service
    effect(() => {
      const project = this.currentProject();
      if (project) {
        this.layout.setProjectTitle(project.name);
      }
    });

    effect(() => {
      const project = this.currentProject();
      const page = this.currentPage();

      if (!project?.id) {
        console.warn('No project ID, skipping fetch');
        return;
      }

      const options = this.buildFilterOptions(page);

      // Fetch news with filters
      this.newsService
        .getNewsByProject(project.id, options)
        .subscribe((response) => {
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


      this.newsService.getNewsSources(project.id).subscribe((response) => {
        this.newsService.availableSources.set(response.sources);
      }, (error) => {
        console.error('Error fetching sources:', error);
      });
    });
  }


  ngOnInit(): void {
    this.layout.showFullHeader();
  }

  onFiltersChange(filters: FilterState): void {
    this.newsService.updateFilters(filters);
    this.currentPage.set(1); // Reset to first page when filters change
  }

  onKeywordsChange(keywords: string[]): void {
    this.newsService.setKeywords(keywords);
  }

  onToggleNews(id: number): void {
    const project = this.currentProject();

    if (!project?.id) {
      console.warn('No project ID found');
      return;
    }

    const newsItem = this.filteredNews().find((n) => n.id === id);

    if (!newsItem) {
      console.warn('News item not found');
      return;
    }

    // Indicate fade-out via CSS
    this.newsBeingSaved.set(id);

    // Call save API
    this.newsService.saveNewsToProject(id, project.id).subscribe({
      next: (response) => {
        const savedNewsId = response.id;

        // Remove after the 200ms Tailwind transition completes
        setTimeout(() => {
          this.newsService.remoteNews.update((list) => list.filter((n) => n.id !== id));
          this.newsBeingSaved.set(null);
        }, 200);

        // Show snackbar with undo option
        const snackBarRef = this.snackBar.open(
          `News saved: ${newsItem.title.substring(0, 40)}`,
          'Undo',
          {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar'],
          }
        );

        snackBarRef.onAction().subscribe(() => {
          // Undo: delete the saved record then refresh list
          this.newsService.deleteSavedNews(savedNewsId).subscribe({
            next: () => {
              const options = this.buildFilterOptions();

              this.newsService.getNewsByProject(project.id, options).subscribe((resp) => {
                this.newsService.remoteNews.set(resp.data);
                this.newsService.totalNews.set(resp.total);
              });

              this.snackBar.open('Save undone', '', {
                duration: 2000,
                horizontalPosition: 'end',
                verticalPosition: 'bottom',
              });
            },
            error: (err) => {
              console.error('Error undoing save:', err);
              this.snackBar.open('❌ Error undoing save', 'Close', {
                duration: 5000,
                horizontalPosition: 'end',
                verticalPosition: 'bottom',
                panelClass: ['error-snackbar'],
              });
            },
          });
        });
      },
      error: (err) => {
        console.error('Error saving news:', err);
        this.snackBar.open('❌ Error saving news', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
}
