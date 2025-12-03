import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NewsService } from '../../services/news.service';
import { NewsCardComponent } from '../../components/news-card/news-card.component';

@Component({
  selector: 'app-my-news-page',
  imports: [NewsCardComponent, MatButtonModule, MatIconModule],
  templateUrl: './my-news.page.html',
})
export class MyNewsPage {
  private newsService = inject(NewsService);

  selectedNews = this.newsService.selectedNews;

  onRemove(id: number): void {
    this.newsService.removeFromSelected(id);
  }

  handleExport(): void {
    console.log('Export', this.selectedNews().length, 'news');
  }
}
