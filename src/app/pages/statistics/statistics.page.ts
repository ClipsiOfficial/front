import { Component, inject, computed, effect, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NewsService } from '../../services/news.service';
import { LayoutService } from '../../services/layout.service';
import { ProjectsService } from '../../services/projects.service';
import { SavedNews } from '../../models/news.model';

interface StatMetric {
  label: string;
  value: string | number;
  subtext?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

interface Distribution {
  name: string;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-statistics-page',
  imports: [MatIconModule, MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './statistics.page.html',
})
export class StatisticsPage {
  private newsService = inject(NewsService);
  private layout = inject(LayoutService);
  private route = inject(ActivatedRoute);
  private projectsService = inject(ProjectsService);

  currentProject = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('projectId')),
      switchMap((id) => this.projectsService.getProject(Number(id)))
    )
  );

  isLoading = signal(false);
  savedNews = signal<SavedNews[]>([]);

  // Derived Metrics
  metrics = computed<StatMetric[]>(() => {
    const news = this.savedNews();
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const total = news.length;
    // Assuming timestamp corresponds to collection/save date. If it's pub date, this is pub stats.
    // If we want collection stats we might need 'createdAt' from backend.
    // Using 'timestamp' as proxy for now.

    // Safety check for date parsing
    const getNewsDate = (n: SavedNews) => n.timestamp ? new Date(n.timestamp) : new Date();

    const todayCount = news.filter(n => getNewsDate(n) >= startOfDay).length;
    const monthCount = news.filter(n => getNewsDate(n) >= startOfMonth).length;
    const totalViews = news.reduce((acc, curr) => acc + (curr.views || 0), 0);

    // Mock Impact Score (Average views * 1.5 + categorization bonus?)
    const avgViews = total > 0 ? totalViews / total : 0;
    const impactScore = Math.min(100, Math.round(avgViews / 10)); // Mock logic

    return [
      {
        label: 'Total Collected',
        value: total,
        subtext: 'All time news',
        icon: 'library_books',
        color: 'text-blue-500'
      },
      {
        label: 'Collected Today',
        value: todayCount,
        subtext: 'News added today',
        icon: 'today',
        color: 'text-green-500',
        trend: 'up'
      },
      {
        label: 'This Month',
        value: monthCount,
        subtext: 'Current month',
        icon: 'calendar_month',
        color: 'text-purple-500'
      },
      {
        label: 'Total Views',
        value: totalViews,
        subtext: 'Across all news',
        icon: 'visibility',
        color: 'text-yellow-500'
      },
      {
        label: 'Impact Score',
        value: impactScore + '/100',
        subtext: 'Based on visibility',
        icon: 'insights',
        color: 'text-red-500'
      }
    ];
  });

  sourceDistribution = computed<Distribution[]>(() => {
    const news = this.savedNews();
    const counts: Record<string, number> = {};
    news.forEach(n => {
      const source = n.source || 'Unknown';
      counts[source] = (counts[source] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: news.length > 0 ? count / news.length : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6); // Top 6
  });

  categoryDistribution = computed<Distribution[]>(() => {
    const news = this.savedNews();
    const counts: Record<string, number> = {};
    news.forEach(n => {
      const cat = n.category || 'Uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: news.length > 0 ? count / news.length : 0
      }))
      .sort((a, b) => b.count - a.count);
  });

  topNews = computed(() => {
    return [...this.savedNews()]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  });

  constructor() {
    // Update project title in layout service
    effect(() => {
      const project = this.currentProject();
      if (project) {
        this.layout.setProjectTitle(project.name);
        this.loadData(project.id);
      }
    });
  }

  ngOnInit(): void {
    this.layout.showFullHeader();
  }

  loadData(projectId: number): void {
    this.isLoading.set(true);
    // Fetch all saved news for stats (high limit)
    this.newsService.getSavedNews(projectId, { limit: 1000 }).subscribe({
      next: (res) => {
        this.savedNews.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading stats data:', err);
        this.isLoading.set(false);
      }
    });
  }
}
