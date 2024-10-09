import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { IdeaDetailComponent } from './idea-detail/idea-detail.component';
import { IdeaPageComponent } from './idea-page/idea-page.component';
import{HomeComponent} from './home/home.component';
import { AuthGuard } from './guard/auth.guard';
import { LogoutComponent } from './logout/logout.component';
export const routes: Routes = [

    
    { 
        title: 'Login',
        path: 'login', 
        component: LoginComponent 
    },
    {
        title:'Logout',
        path:'logout',
        component: LogoutComponent
    },
    {
        title:'Signin',
        path:'signin',
        component: SignInComponent
    },
    {
        title:'IdeaPage',
        path:'idea',
        component: IdeaPageComponent,
        canActivate: [AuthGuard]
    },
    
    {
        title:'MyProfile',
        path:'profile/:username',
        component: MyProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        title:'IdeaDetail',
        path:'idea/:id',
        component: IdeaDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        title:'Home',
        path:'home',
        component: HomeComponent
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: '**', 
        redirectTo: 'home'
    }
    
   
];
