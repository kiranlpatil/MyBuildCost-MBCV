import {Route} from "@angular/router";
import {DashboardComponent} from "./dashboard.component";
import {ChangePasswordComponent} from "../../framework/password/change-password/index";
import {DashboardHomeComponent} from "./dashboard-home/index";
import {DashboardProfileComponent} from "./dashboard-profile/index";
import {SettingsComponent} from "./settings/index";
import {AboutComponent} from "./about/index";
import {ContactComponent} from "./contact/contact.component";
import {ChangeEmailComponent} from "./settings/change-email/change-email.component";

export const DashboardRoutes: Route[] = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {path: '', component: DashboardHomeComponent},
      {path: 'profile', component: DashboardProfileComponent},
      {path: 'changepassword', component: ChangePasswordComponent},
      {path: 'changeemail', component: ChangeEmailComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'about', component: AboutComponent},
      {path: 'contact', component: ContactComponent}
    ]
  }
];



