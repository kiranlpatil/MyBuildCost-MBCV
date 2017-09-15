import {Route} from "@angular/router";
import {UserProfileComponent} from "./user-profile.component";

export const UserProfileRoutes: Route[] = [
  {
    path: 'profile/:role',
    component: UserProfileComponent
  }
];
