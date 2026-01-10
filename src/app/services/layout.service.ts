import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project } from '../models/project.model';

type HeaderMode = 'full' | 'minimal' | 'login';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private _headerMode = new BehaviorSubject<HeaderMode>('full');
  headerMode$ = this._headerMode.asObservable();

  private _projectTitle = new BehaviorSubject<string | null>(null);
  projectTitle$ = this._projectTitle.asObservable();

  private _currentProject = new BehaviorSubject<Project | null>(null);
  currentProject$ = this._currentProject.asObservable();

  get headerModeValue() {
    return this._headerMode.value;
  }

  get projectTitleValue() {
    return this._projectTitle.value;
  }

  get currentProject() {
    return this._currentProject.value;
  }

  showFullHeader() {
    this._headerMode.next('full');
  }

  showMinimalHeader() {
    this._headerMode.next('minimal');
  }

  showLoginHeader() {
    this._headerMode.next('login');
  }

  setProjectTitle(title: string | null) {
    this._projectTitle.next(title);
  }

  setCurrentProject(project: Project | null) {
    this._currentProject.next(project);
    if (project) {
      this._projectTitle.next(project.name);
    } else {
      this._projectTitle.next(null);
    }
  }
}
