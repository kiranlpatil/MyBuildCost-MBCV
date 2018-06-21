import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/index';
import { AboutComponent } from './about/index';
import { ContactComponent } from './contact/contact.component';
import { DashboardProfileComponent }  from '../../framework/dashboard/user-profile/dashboard-user-profile.component';
import { UserChangePasswordComponent } from '../../framework/dashboard/user-change-password/user-change-password.component';
import { AuthGuardService } from '../../shared/services/auth-guard.service';
import { BillingDetailsComponent } from './billing-details/index';

export const DashboardRoutes: Route[] = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
    children: [
      {path: '', component: DashboardHomeComponent},
      {path: 'details', component: DashboardProfileComponent},
      {path: 'change-password', component: UserChangePasswordComponent},
      {path: 'about', component: AboutComponent},
      {path: 'contact', component: ContactComponent},
      {path: 'account-summary', component: BillingDetailsComponent }
    ]
  }
];



