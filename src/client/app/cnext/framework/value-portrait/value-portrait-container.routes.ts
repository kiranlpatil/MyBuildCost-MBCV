import {Route} from "@angular/router";
import {ValuePortraitContainerComponent} from "./index";

export const ValuePortrait: Route[] = [
  {
    path: 'value-portrait/:id',
    component: ValuePortraitContainerComponent
  },
  {
    path: 'value-portrait/:userId/create',
    component: ValuePortraitContainerComponent
  }
];
