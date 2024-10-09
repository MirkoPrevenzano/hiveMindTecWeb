import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { IdeaPageComponent } from './idea-page/idea-page.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule, NavbarComponent,IdeaPageComponent, CommonModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title() {
    throw new Error('Method not implemented.');
  }
  constructor(private router: Router) {}

  isHomeUrl(): boolean {
    return this.router.url === '/';
  }

}
