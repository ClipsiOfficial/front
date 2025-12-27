import { Component, inject, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NewsService } from '../../services/news.service';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { LayoutService } from '../../services/layout.service';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-my-news-page',
  imports: [NewsCardComponent, MatButtonModule, MatIconModule],
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

  selectedNews = this.newsService.selectedNews;

  constructor() {
    // Update project title in layout service
    effect(() => {
      const project = this.currentProject();
      if (project) {
        this.layout.setProjectTitle(project.name);
      }
    });
  }

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
