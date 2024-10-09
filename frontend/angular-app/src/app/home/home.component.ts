import { Component, inject } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../_service/auth/auth.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  authService = inject(AuthService);

}
