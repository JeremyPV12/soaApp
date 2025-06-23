import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../../shared/services/admin-auth.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css'],
})
export class AdminNavbarComponent {
  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router
  ) {}

  logout(): void {
    this.adminAuthService.logout();
    this.router.navigate(['/']);
  }
}
