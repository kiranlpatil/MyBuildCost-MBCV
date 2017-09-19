import {Route} from "@angular/router";
import {ShareContainerComponent} from "./share-container.component";

export const ShareContainerRoutes:Route[] = [
  {
    path: 'share/:shortUrl',
    component: ShareContainerComponent
  }
];


