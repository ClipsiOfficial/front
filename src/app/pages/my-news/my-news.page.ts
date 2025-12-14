import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NewsService } from '../../services/news.service';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-my-news-page',
  imports: [NewsCardComponent, MatButtonModule, MatIconModule],
  templateUrl: './my-news.page.html',
})
export class MyNewsPage {
  private newsService = inject(NewsService);
  private layout = inject(LayoutService);

  selectedNews = this.newsService.selectedNews;

  ngOnInit(): void {
    this.layout.showFullHeader();
  }

  onRemove(id: number): void {
    this.newsService.removeFromSelected(id);
  }

  handleExport(): void {
    console.log('Export', this.selectedNews().length, 'news');
  }
}
