import { Component,inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { RestBackendService } from '../_service/rest-backend/rest-backend.service';
import { AuthService } from '../_service/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NotifyService } from '../_service/notify/notify.service';
@Component({
  selector: 'login-component',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  router = inject(Router);
  restService = inject(RestBackendService);
  auth = inject(AuthService);
  notifyService = inject(NotifyService);
  hide:boolean = true;


  login = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  onSubmit() {
    if (this.login.invalid || this.login.value.username === '' || this.login.value.password === '') {
      this.notifyService.openSnackBar("Please fill in all fields", "Close", "snackBarWarning");
    } 
    else {
      this.restService.login({
        username: this.login.value.username as string,
        password: this.login.value.password as string
      }).subscribe({
          next: (token) => { 
            this.auth.updateToken(token.toString());
          },
          error: (err) => {
            this.notifyService.openSnackBar(err.error, "Close", "snackBarError");            
          },
          complete: () => {
            if (this.auth.isAuthenticated()) {
              this.notifyService.openSnackBar("Login successful", "Close", "snackBarSuccess");
              this.router.navigateByUrl("/idea");
          }}
     });
    }
  }


  exitLogin(){  this.router.navigateByUrl("/"); }

  

}


