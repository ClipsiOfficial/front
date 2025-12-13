import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.css']
})
export class ProfilePage {
  username: string = 'JohnDoe';
  email: string = 'john.doe@example.com';
  subscriptionType: string = 'Premium';

  updateProfile() {
    // Aquí iría la lógica para guardar cambios en backend
    console.log('Profile updated:', {
      username: this.username,
      email: this.email
    });
    alert('Profile updated successfully!');
  }
}