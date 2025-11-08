import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NewsService } from '../../services/news.service';

interface SourceStat {
  name: string;
  count: number;
  percentage: number;
}

interface TopNews {
  id: number;
  title: string;
  source: string;
  category: string;
  views: number;
}

@Component({
  selector: 'app-statistics-page',
  imports: [CommonModule, MatIconModule],
  templateUrl: './statistics.page.html',
})
export class StatisticsPage {
  private newsService = inject(NewsService);

  selectedNews = this.newsService.selectedNews;

  sourceDistribution = computed(() => {
    const news = this.selectedNews();
    const sourceCounts: Record<string, number> = {};

    news.forEach((item) => {
      sourceCounts[item.source] = (sourceCounts[item.source] || 0) + 1;
    });

    const total = news.length;
    const stats: SourceStat[] = Object.entries(sourceCounts).map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }));

    return stats.sort((a, b) => b.count - a.count);
  });

  categoryDistribution = computed(() => {
    const news = this.selectedNews();
    const categoryCounts: Record<string, number> = {};

    news.forEach((item) => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });

    const total = news.length;
    return Object.entries(categoryCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);
  });

  topNewsByViews = computed(() => {
    return [...this.selectedNews()]
      .filter((item) => item.views !== undefined)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
      .map((item) => ({
        id: item.id,
        title: item.title,
        source: item.source,
        category: item.category,
        views: item.views || 0,
      }));
  });

  totalNews = computed(() => this.selectedNews().length);
  totalSources = computed(() => new Set(this.selectedNews().map((n) => n.source)).size);
  totalCategories = computed(() => new Set(this.selectedNews().map((n) => n.category)).size);
}
