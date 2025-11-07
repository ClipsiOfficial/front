import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, Tab } from './components/header/header.component';
import { ResultsSectionComponent } from './components/results-section/results-section.component';
import { MyNewsSectionComponent } from './components/my-news-section/my-news-section.component';
import { StatisticsSectionComponent } from './components/statistics-section/statistics-section.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    ResultsSectionComponent,
    MyNewsSectionComponent,
    StatisticsSectionComponent,
  ],
  templateUrl: './app.html',
})
export class App {
  activeTab = signal<Tab>('results');

  onTabChange(tab: Tab): void {
    this.activeTab.set(tab);
  }
}


