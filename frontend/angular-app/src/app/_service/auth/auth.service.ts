import { Injectable,WritableSignal, computed, effect, signal } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { AuthState } from './authState.type';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
 
  authState= signal<AuthState>({
    user: this.getUser(),
    token: this.getToken(), 
    isAuthenticated: this.verifyToken(this.getToken()) 
  })

  user = computed(() => this.authState().user); 
  token = computed(() => this.authState().token);
  isAuthenticated = computed(() => this.authState().isAuthenticated);

  constructor(){
    effect( () => { //this effect will run every time authState changes
      const token = this.authState().token;
      const user = this.authState().user;
      if(token !== null){
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
      if(user !== null){
        localStorage.setItem("user", user);
      } else {
        localStorage.removeItem("user");
      }
    });
  }

  updateToken(token: string): void {
    const decodedToken: any = jwtDecode(token);
    const user = decodedToken.user;
    this.authState.set({
      user: user,
      token: token,
      isAuthenticated: this.verifyToken(token)
    })
  }

  private verifyToken(token: string | null): boolean {
    if(token !== null){
      try{
        const decodedToken = jwtDecode(token); 
        const ttl = decodedToken.exp; 

        //essendo che date.now restituisce il tempo in millisecondi, moltiplico ttl per 1000
        if(ttl === undefined || Date.now() >= ttl * 1000){ 
          return false; 
        } else {
          return true; 
        }
      } catch(error) {  
        return false;
      }
    }
    return false;
  }
  

  isUserAuthenticated(): boolean { return this.verifyToken(this.getToken()); }


  getUser(): string | null { return localStorage.getItem("user"); }

  
  getToken(): string | null { return localStorage.getItem("token"); }
  

  logout(){ this.authState.set({user: null, token: null, isAuthenticated: false }); }

  
}
