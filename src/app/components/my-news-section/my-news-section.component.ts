import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from '../../services/news.service';
import { NewsCardComponent } from '../news-card/news-card.component';

@Component({
  selector: 'app-my-news-section',
  imports: [CommonModule, NewsCardComponent],
  templateUrl: './my-news-section.component.html',
})
export class MyNewsSectionComponent {
  private newsService = inject(NewsService);

  selectedNews = this.newsService.selectedNews;

  onRemove(id: number): void {
    this.newsService.removeFromSelected(id);
  }

  handleExport(): void {
    console.log('Export', this.selectedNews().length, 'news');
    // Show export dialog
  }
}
