import {Route} from "@angular/router";
import {UserVerificationComponent} from "./user-verification.component";

export const UserVerificationRoutes: Route[] = [
  {
    path: 'verify_user',
    component: UserVerificationComponent
  }
];
