import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NewsItem } from '../../models/news.model';

@Component({
  selector: 'app-results-news-card',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './results-news-card.component.html',
  standalone: true
})
export class ResultsNewsCardComponent {
  news = input.required<NewsItem>();
  isSelected = input<boolean>(false);
  bookmark = output<number>();

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  openLink(): void {
    window.open(this.news().link, '_blank');
  }

  handleBookmark(): void {
    this.bookmark.emit(this.news().id);
  }
}