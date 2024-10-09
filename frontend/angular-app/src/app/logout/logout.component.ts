import { Component } from '@angular/core';
import { AuthService } from '../_service/auth/auth.service';
import { Router } from '@angular/router';
import { NotifyService } from '../_service/notify/notify.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  constructor(private authService: AuthService, private router:Router, private notifyService:NotifyService) { }
 

  ngOnInit() {
    if(this.authService.isAuthenticated()){
      this.authService.logout();
      this.notifyService.openSnackBar("Thank you for using our web-app. You have been logged out. ", "Close", "snackBarSuccess");
    }
    this.router.navigateByUrl("/"); 
  }

  
}
