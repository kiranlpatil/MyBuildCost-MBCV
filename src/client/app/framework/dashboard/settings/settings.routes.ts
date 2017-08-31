import {Route} from "@angular/router";
import {SettingsComponent} from "./index";


export const SettingsRoutes: Route[] = [
  {
      path: 'settings/:role',
    component: SettingsComponent,

  }
];
