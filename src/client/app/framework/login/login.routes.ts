import { Route } from '@angular/router';
import { LoginComponent } from './login.component';
import { LoginauthGuard } from './login-auth-guard.service';


export const LoginRoutes: Route[] = [
  {
    path: 'signin',
    component: LoginComponent/*,
    canActivate:[LoginauthGuard]*/
  }
];
