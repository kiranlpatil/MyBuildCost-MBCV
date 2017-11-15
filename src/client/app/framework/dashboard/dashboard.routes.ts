import {Route} from "@angular/router";
import {DashboardComponent} from "./dashboard.component";
import {DashboardHomeComponent} from "./dashboard-home/index";
import {AboutComponent} from "./about/index";
import {ContactComponent} from "./contact/contact.component";
import {UserProfileComponent} from "../../user/user-profile/user-profile.component";
import {ChangePasswordComponent} from "../../user/change-password/change-password.component";

export const DashboardRoutes: Route[] = [
  {
    path: 'user',
    component: DashboardComponent,
    children: [
      {path: '', component: DashboardHomeComponent},
      {path: 'details', component: UserProfileComponent},
      {path: 'change-password', component: ChangePasswordComponent},
      {path: 'about', component: AboutComponent},
      {path: 'contact', component: ContactComponent}
    ]
  }
];



