import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../_service/auth/auth.service';
import { Router } from '@angular/router';
export const AuthGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);
  if(authService.isUserAuthenticated()){
    return true;
  } else {
    return router.parseUrl("/login"); 
  }
};

