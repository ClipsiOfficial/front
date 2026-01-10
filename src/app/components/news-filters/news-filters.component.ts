import { Component, input, output, signal, computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FormsModule } from '@angular/forms';
import { FilterState, AVAILABLE_SOURCES, AVAILABLE_CATEGORIES } from '../../models/news.model';
import { Project } from '../../models/project.model';
import { ManageKeywordsDialogComponent } from '../manage-keywords-dialog.component';

@Component({
  selector: 'app-news-filters',
  imports: [FormsModule],
  templateUrl: './news-filters.component.html',
})
export class NewsFiltersComponent {
  private dialog = inject(MatDialog);

  filters = input.required<FilterState>();
  project = input<Project>();
  availableSources = input<string[]>([]);
  showCategories = input<boolean>(true);
  showKeywords = input<boolean>(true);

  filtersChange = output<FilterState>();
  keywordsChanged = output<void>();

  showFilters = signal(false);
  sourcesExpanded = signal(true);
  categoriesExpanded = signal(true);

  // Limit logic
  readonly INITIAL_LIMIT = 5;
  showAllSources = signal(false);
  showAllCategories = signal(false);

  availableCategories = AVAILABLE_CATEGORIES;

  hasActiveFilters = computed(() => {
    const f = this.filters();
    return (
      f.searchTerm ||
      f.sources.length > 0 ||
      f.categories.length > 0 ||
      f.dateFrom ||
      f.dateTo
    );
  });

  displayedSources = computed(() => {
    const sources = this.availableSources();
    if (this.showAllSources()) {
      return sources;
    }
    return sources.slice(0, this.INITIAL_LIMIT);
  });

  displayedCategories = computed(() => {
    const categories = this.availableCategories;
    if (this.showAllCategories()) {
      return categories;
    }
    return categories.slice(0, this.INITIAL_LIMIT);
  });

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filtersChange.emit({ ...this.filters(), searchTerm: input.value });
  }

  toggleFilters(): void {
    this.showFilters.update((v) => !v);
  }

  toggleSourcesExpanded(): void {
    this.sourcesExpanded.update((v) => !v);
  }

  toggleShowAllSources(): void {
    this.showAllSources.update((v) => !v);
  }

  toggleShowAllCategories(): void {
    this.showAllCategories.update((v) => !v);
  }

  toggleCategoriesExpanded(): void {
    this.categoriesExpanded.update((v) => !v);
  }

  toggleKeywordsManager(): void {
    const project = this.project();
    if (project) {
      this.dialog.open(ManageKeywordsDialogComponent, {
        data: { project },
        width: '500px'
      }).afterClosed().subscribe((result: { content: string }[] | undefined) => {
        if (result) {
          this.keywordsChanged.emit();
        }
      });
    } else {
      console.warn('Cannot manage keywords without a project instance.');
    }
  }

  toggleSource(source: string): void {
    const currentSources = this.filters().sources;
    const newSources = currentSources.includes(source)
      ? currentSources.filter((s) => s !== source)
      : [...currentSources, source];
    this.filtersChange.emit({ ...this.filters(), sources: newSources });
  }

  toggleCategory(category: string): void {
    const currentCategories = this.filters().categories;
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];

    this.filtersChange.emit({ ...this.filters(), categories: newCategories });
  }

  onDateFromChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filtersChange.emit({ ...this.filters(), dateFrom: input.value });
  }

  onDateToChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filtersChange.emit({ ...this.filters(), dateTo: input.value });
  }

  clearFilters(): void {
    this.filtersChange.emit({
      searchTerm: '',
      keywords: '',
      sources: [],
      categories: [],
      dateFrom: '',
      dateTo: '',
    });
  }

  clearDateFrom(): void {
    this.filtersChange.emit({ ...this.filters(), dateFrom: '' });
  }

  clearDateTo(): void {
    this.filtersChange.emit({ ...this.filters(), dateTo: '' });
  }



  formatDateLabel(dateString: string): string {
    if (!dateString) return 'Seleccionar';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }

  removeSourceFilter(source: string): void {
    this.toggleSource(source);
  }

  // removeCategoryFilter(category: string): void {
  //   this.toggleCategory(category);
  // }

  removeDateFrom(): void {
    this.filtersChange.emit({ ...this.filters(), dateFrom: '' });
  }

  removeDateTo(): void {
    this.filtersChange.emit({ ...this.filters(), dateTo: '' });
  }
}
