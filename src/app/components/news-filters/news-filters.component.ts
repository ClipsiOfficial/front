import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterState, AVAILABLE_SOURCES, AVAILABLE_CATEGORIES } from '../../models/news.model';

@Component({
  selector: 'app-news-filters',
  imports: [CommonModule, FormsModule],
  templateUrl: './news-filters.component.html',
})
export class NewsFiltersComponent {
  filters = input.required<FilterState>();
  keywords = input.required<string[]>();
  filtersChange = output<FilterState>();
  keywordsChange = output<string[]>();

  showFilters = signal(false);
  showKeywordsManager = signal(false);
  newKeyword = signal('');
  newKeywordInput = '';
  sourcesExpanded = signal(true);
  categoriesExpanded = signal(true);

  availableSources = AVAILABLE_SOURCES;
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

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filtersChange.emit({ ...this.filters(), searchTerm: input.value });
  }

  onKeywordsInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filtersChange.emit({ ...this.filters(), keywords: input.value });
  }

  toggleFilters(): void {
    this.showFilters.update((v) => !v);
  }

  toggleSourcesExpanded(): void {
    this.sourcesExpanded.update((v) => !v);
  }

  toggleCategoriesExpanded(): void {
    this.categoriesExpanded.update((v) => !v);
  }

  toggleKeywordsManager(): void {
    this.showKeywordsManager.update((v) => !v);
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

  addKeyword(): void {
    const keyword = this.newKeywordInput.trim();
    if (keyword && !this.keywords().includes(keyword)) {
      this.keywordsChange.emit([...this.keywords(), keyword]);
      this.newKeywordInput = '';
    }
  }

  removeKeyword(keyword: string): void {
    this.keywordsChange.emit(this.keywords().filter((k) => k !== keyword));
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

  removeCategoryFilter(category: string): void {
    this.toggleCategory(category);
  }

  removeDateFrom(): void {
    this.filtersChange.emit({ ...this.filters(), dateFrom: '' });
  }

  removeDateTo(): void {
    this.filtersChange.emit({ ...this.filters(), dateTo: '' });
  }
}
