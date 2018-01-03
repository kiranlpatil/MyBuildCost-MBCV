import { Route } from '@angular/router';
import { BuildingComponent } from './building.component';
import { CreateBuildingComponent } from './createBuilding/createBuilding.component';

export const BuildingRoutes: Route[] = [
  {
    path: 'building',
    component: BuildingComponent,
    children:[
      {path: '', component: BuildingComponent},
      {path: 'create', component: CreateBuildingComponent}
    ]
  }
];
