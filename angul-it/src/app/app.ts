import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';  // Add RouterLink to existing import

@Component({
  selector: 'app-root',
  standalone: true,  // Add this line
  imports: [RouterOutlet, RouterLink],  // Add RouterLink to existing imports
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angul-it');  // Keep your signal as-is
}
