import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsItem } from '../../models/news.model';

@Component({
  selector: 'app-news-card',
  imports: [CommonModule, FormsModule],
  templateUrl: './news-card.component.html',
})
export class NewsCardComponent {
  news = input.required<NewsItem>();
  remove = output<number>();

  isEditing = signal(false);
  editedTitle = signal('');
  editedExcerpt = signal('');
  isGeneratingSummary = signal(false);

  ngOnInit(): void {
    this.editedTitle.set(this.news().title);
    this.editedExcerpt.set(this.news().excerpt);
  }

  toggleEdit(): void {
    if (!this.isEditing()) {
      this.editedTitle.set(this.news().title);
      this.editedExcerpt.set(this.news().excerpt);
    }
    this.isEditing.update((v) => !v);
  }

  handleSave(): void {
    // In a real app, this would update via service
    console.log('Save changes:', {
      id: this.news().id,
      title: this.editedTitle(),
      excerpt: this.editedExcerpt(),
    });
    this.isEditing.set(false);
    // Show success toast
  }

  handleCancel(): void {
    this.editedTitle.set(this.news().title);
    this.editedExcerpt.set(this.news().excerpt);
    this.isEditing.set(false);
  }

  handleGenerateAISummary(): void {
    this.isGeneratingSummary.set(true);
    // Simulate AI call
    setTimeout(() => {
      const aiSummary = `[Resumen IA] Este artículo analiza los principales aspectos sobre ${this.news().category.toLowerCase()}, destacando tendencias actuales y su impacto en el sector. Los expertos señalan cambios significativos que podrían transformar el panorama en los próximos meses.`;
      this.editedExcerpt.set(aiSummary);
      this.isGeneratingSummary.set(false);
    }, 2000);
  }

  handleRemove(): void {
    this.remove.emit(this.news().id);
  }

  openLink(): void {
    window.open(this.news().link, '_blank');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }
}
