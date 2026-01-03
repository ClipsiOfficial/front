import { Component, inject, effect, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NewsService } from '../../services/news.service';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { LayoutService } from '../../services/layout.service';
import { ProjectsService } from '../../services/projects.service';
import { SavedNews, NewsItem } from '../../models/news.model';

@Component({
  selector: 'app-my-news-page',
  imports: [NewsCardComponent, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './my-news.page.html',
})
export class MyNewsPage {
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

  savedNews = signal<SavedNews[]>([]);
  totalSavedNews = signal<number>(0);
  isLoading = signal<boolean>(false);
  searchTerm = signal<string>('');

  constructor() {
    // Update project title in layout service
    effect(() => {
      const project = this.currentProject();
      if (project) {
        this.layout.setProjectTitle(project.name);
      }
    });

    // Load saved news when project changes
    effect(() => {
      const project = this.currentProject();
      if (project?.id) {
        this.loadSavedNews(project.id);
      }
    });
  }

  ngOnInit(): void {
    this.layout.showFullHeader();
  }

  loadSavedNews(projectId: number): void {
    this.isLoading.set(true);
    const options: any = { page: 1, limit: 100 };
    
    if (this.searchTerm()) {
      options.search = this.searchTerm();
    }
    
    this.newsService.getSavedNews(projectId, options).subscribe({
      next: (response) => {
        this.savedNews.set(response.data);
        this.totalSavedNews.set(response.total);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading saved news:', error);
        this.isLoading.set(false);
      }
    });
  }

  onSearchChange(): void {
    const project = this.currentProject();
    if (project?.id) {
      this.loadSavedNews(project.id);
    }
  }

  onRemove(id: number): void {
    this.newsService.deleteSavedNews(id).subscribe({
      next: () => {
        this.savedNews.update(news => news.filter(n => n.id !== id));
        this.totalSavedNews.update(total => total - 1);
      },
      error: (error) => {
        console.error('Error deleting saved news:', error);
      }
    });
  }

  onUpdate(updatedNews: SavedNews | NewsItem): void {
    // Type guard to ensure it's a SavedNews
    if ('projectId' in updatedNews) {
      this.savedNews.update(news => 
        news.map(n => n.id === updatedNews.id ? updatedNews : n)
      );
    }
  }

  handleExport(): void {
    console.log('Export', this.savedNews().length, 'news');
  }
}
