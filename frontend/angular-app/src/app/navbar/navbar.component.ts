import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive} from '@angular/router';
import { AuthService } from '../_service/auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { IdeaFormComponent } from '../idea-form/idea-form.component';

@Component({
  selector: 'navbar-component',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isMenuOpen = false;
  isUserMenuOpen = false;

  authService = inject(AuthService);

  constructor(public dialog: MatDialog) {}

  toggleUserMenu() {  this.isUserMenuOpen = !this.isUserMenuOpen; }


  toggleMenu() {  this.isMenuOpen = !this.isMenuOpen; }


  openDialogFormIdea()
  {
    this.dialog.open(IdeaFormComponent, {
      minWidth:"50vw" ,
      minHeight:"24vh",
      disableClose: false,
      hasBackdrop: true, 
      autoFocus: true, 
    });
  }
  
}
