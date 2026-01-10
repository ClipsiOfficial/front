import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NewsItem, SavedNews } from '../../models/news.model';
import { inject } from '@angular/core';
import { EditNewsDialogComponent } from '../edit-news-dialog.component';

@Component({
  selector: 'app-news-card',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, MatSnackBarModule],
  templateUrl: './news-card.component.html',
  host: {
    '[class]': 'hostClasses()'
  }
})
export class NewsCardComponent {
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  news = input.required<NewsItem>();
  isSelected = input<boolean>(false);
  bookmarkLoading = input<boolean>(false);
  showEditButton = input<boolean>(false); // Whether to show edit button (only for My News page)
  bookmark = output<number>();
  edit = output<Partial<SavedNews>>();

  // Tailwind-based fade: when bookmarkLoading is true, opacity transitions to 0
  hostClasses() {
    return `transition-opacity duration-200 ease-out${this.bookmarkLoading() ? ' opacity-0' : ''}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  openLink(): void {
    window.open(this.news().url, '_blank');
  }

  handleBookmark(): void {
    this.bookmark.emit(this.news().id);
  }

  handleEdit(): void {
    // Open edit dialog - cast news to SavedNews for display
    const newsItem = this.news() as unknown as SavedNews;
    const dialogRef = this.dialog.open(EditNewsDialogComponent, {
      data: { news: newsItem },
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.edit.emit({
          id: this.news().id,
          title: result.title,
          summary: result.summary,
          category: result.category,
        });
      }
    });
  }

  handleTranslate(): void {
    this.snackBar.open('🌐 Translation feature coming soon!', 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['info-snackbar'],
    });
  }

  getSourceStyle(source: string): { [key: string]: string } {
    let hash = 0;
    for (let i = 0; i < source.length; i++) {
      hash = source.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    const bgColor = `hsl(${hue}, 60%, 55%)`;

    const h = hue / 360, s = 0.6, l = 0.55;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h * 12) % 12;
      const color = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
      return Math.round(255 * color);
    };
    const r = f(0), g = f(8), b = f(4);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    const textColor = luminance > 0.6 ? '#000' : '#fff';

    return {
      backgroundColor: bgColor,
      color: textColor
    };
  }
}
