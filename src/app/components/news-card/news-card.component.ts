import { Component, input, output, signal, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewsItem, SavedNews } from '../../models/news.model';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news-card',
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule
],
  templateUrl: './news-card.component.html',
})
export class NewsCardComponent {
  private newsService = inject(NewsService);
  private snackBar = inject(MatSnackBar);

  news = input.required<NewsItem | SavedNews>();
  remove = output<number>();
  updated = output<NewsItem | SavedNews>();

  isEditing = signal(false);
  editedTitle = signal('');
  editedSummary = signal('');
  isTranslating = signal(false);
  selectedLanguage = signal('es');
  
  availableLanguages = [
    { code: 'es', name: 'Español' },
    { code: 'ca', name: 'Català' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
  ];

  ngOnInit(): void {
    this.editedTitle.set(this.news().title);
    this.editedSummary.set(this.news().summary || '');
  }

  toggleEdit(): void {
    if (!this.isEditing()) {
      this.editedTitle.set(this.news().title);
      this.editedSummary.set(this.news().summary || '');
    }
    this.isEditing.update((v) => !v);
  }

  handleSave(): void {
    const newsItem = this.news();
    
    // Only save if it's a SavedNews (has projectId property)
    if ('projectId' in newsItem) {
      this.newsService.updateSavedNews(newsItem.id, {
        title: this.editedTitle(),
        summary: this.editedSummary(),
      }).subscribe({
        next: (updatedNews) => {
          this.isEditing.set(false);
          this.updated.emit(updatedNews);
          this.snackBar.open('News updated successfully', 'Close', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Error updating saved news:', error);
          this.snackBar.open('Error updating news', 'Close', {
            duration: 3000,
          });
        }
      });
    } else {
      // If it's a NewsItem, just close the edit mode (can't update remote news)
      console.log('Cannot save changes to remote news');
      this.isEditing.set(false);
    }
  }

  handleCancel(): void {
    this.editedTitle.set(this.news().title);
    this.editedSummary.set(this.news().summary || '');
    this.isEditing.set(false);
  }

  handleTranslate(): void {
    this.isTranslating.set(true);
    const targetLang = this.selectedLanguage();
    
    // Simulate translation call
    setTimeout(() => {
      const translations: Record<string, string> = {
        es: `[Traducido al Español] ${this.editedSummary()}`,
        ca: `[Traduït al Català] ${this.editedSummary()}`,
        en: `[Translated to English] ${this.editedSummary()}`,
        fr: `[Traduit en Français] ${this.editedSummary()}`,
        de: `[Übersetzt ins Deutsche] ${this.editedSummary()}`,
        it: `[Tradotto in Italiano] ${this.editedSummary()}`,
      };
      
      this.editedSummary.set(translations[targetLang] || this.editedSummary());
      this.isTranslating.set(false);
      
      this.snackBar.open('Summary translated successfully', 'Close', {
        duration: 3000,
      });
    }, 2000);
  }

  handleRemove(): void {
    this.remove.emit(this.news().id);
  }

  openLink(): void {
    const newsItem = this.news();
    if ('url' in newsItem) {
      window.open(newsItem.url, '_blank');
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  getSource(): string {
    const newsItem = this.news();
    return ('source' in newsItem && newsItem.source) ? newsItem.source : 'Noticia guardada';
  }

  getTimestamp(): string {
    const newsItem = this.news();
    return ('timestamp' in newsItem && newsItem.timestamp) ? newsItem.timestamp : new Date().toISOString();
  }

  hasUrl(): boolean {
    const newsItem = this.news();
    return 'url' in newsItem && !!newsItem.url;
  }
}
