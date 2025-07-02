import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './services/auth.service';
import { UserInterface } from './models/user.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'mg-auth';
  authService = inject(AuthService);

  // ✅ Optional: derived signal for current user
  readonly userSig: Signal<UserInterface | null | undefined> =
    this.authService.currentUserSig;

  // ✅ Use getter to safely extract role
  get role(): 'admin' | 'user' | null {
    const user = this.userSig();
    return user?.role ?? null;
  }

  ngOnInit(): void {}

  logOut(): void {
    this.authService.logout().subscribe({
      next: () => {
        alert('Logout successful');
        // Optionally: reload or redirect
        window.location.reload();
      },
      error: (err) => alert('Error: ' + err.message),
    });
  }
}
