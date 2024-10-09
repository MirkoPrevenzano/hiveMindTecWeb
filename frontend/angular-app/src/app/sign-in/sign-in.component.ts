import { Component, inject} from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validator } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { RestBackendService } from '../_service/rest-backend/rest-backend.service';
import { NotifyService } from '../_service/notify/notify.service';
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  router = inject(Router);
  restService = inject(RestBackendService);
  notifyService = inject(NotifyService);
  hide:boolean = true;

  signinForm= new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    name: new FormControl(''),
    surname: new FormControl(''),
    email: new FormControl(''),
    
  })

  private isValidForm():boolean{
    return this.signinForm.invalid || this.signinForm.value.username === '' || 
    this.signinForm.value.password === '' || this.signinForm.value.name === '' || 
    this.signinForm.value.surname === '' || this.signinForm.value.email === '';
  }

  onSubmit(){
    if(this.isValidForm())    this.notifyService.openSnackBar("Please fill in all fields", "Close", "snackBarWarning");

    else {
      this.restService.signup({
        username: this.signinForm.value.username as string,
        password: this.signinForm.value.password as string,
        name: this.signinForm.value.name as string,
        surname: this.signinForm.value.surname as string,
        email: this.signinForm.value.email as string,
      }).subscribe({
        error: (err) => {
          this.notifyService.openSnackBar(err.error, "Close", "snackBarError");
        },
        complete: () => {
          this.notifyService.openSnackBar("Sign in successful", "Close", "snackBarSuccess");
          this.router.navigateByUrl("/login");
        }
      }
      );
    }
  }


  exitSignIn(){
    this.router.navigateByUrl("/");
  }

  
  
}
