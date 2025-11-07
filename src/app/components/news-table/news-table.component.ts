import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsItem } from '../../models/news.model';

const ITEMS_PER_PAGE = 10;

@Component({
  selector: 'app-news-table',
  imports: [CommonModule],
  templateUrl: './news-table.component.html',
})
export class NewsTableComponent {
  news = input.required<NewsItem[]>();
  selectedIds = input.required<number[]>();
  toggleNews = output<number>();

  currentPage = signal(1);

  totalPages = computed(() => Math.ceil(this.news().length / ITEMS_PER_PAGE));

  currentNews = computed(() => {
    const startIndex = (this.currentPage() - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return this.news().slice(startIndex, endIndex);
  });

  paginationItems = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const maxVisible = 5;
    const items: (number | 'ellipsis')[] = [];

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) {
        items.push(i);
      }
    } else {
      items.push(1);

      if (current > 3) {
        items.push('ellipsis');
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        items.push(i);
      }

      if (current < total - 2) {
        items.push('ellipsis');
      }

      items.push(total);
    }

    return items;
  });

  isSelected(id: number): boolean {
    return this.selectedIds().includes(id);
  }

  onToggle(id: number): void {
    this.toggleNews.emit(id);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }
}
