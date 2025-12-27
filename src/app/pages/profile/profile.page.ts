import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile-page',
  imports: [FormsModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './profile.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage {
  private auth = inject(AuthService);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private layout = inject(LayoutService);

  username = '';
  email = '';
  subscriptionType = '';

  constructor() {
    this.layout.showMinimalHeader();
    const user = this.auth.currentUser();

    if (user) {
      this.username = user.username;
      this.email = user.email;
      this.subscriptionType = user.subscriptionId ? 'Premium' : 'Free';
    }
  }

  updateProfile(): void {
    this.userService.updateProfile({
      username: this.username,
      email: this.email
    }).subscribe({
      next: (updatedUser) => {
        this.auth.currentUser.set(updatedUser);
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Failed to update profile', 'Close', { duration: 3000 });
      }
    });
  }
}
