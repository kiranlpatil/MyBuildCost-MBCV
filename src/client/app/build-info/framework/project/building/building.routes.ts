import { Route } from '@angular/router';
import { BuildingComponent } from './building.component';
import { CreateBuildingComponent } from './create-building/create-building.component';
import { BuildingListComponent } from './buildings-list/building-list.component';
import { BuildingDetailsComponent } from './building-details/building-details.component';

export const BuildingRoutes: Route[] = [
  {
    path: 'building',
    component: BuildingComponent,
    children:[
      {path: '', component: BuildingComponent},
      {path: 'create', component: CreateBuildingComponent},
      {path: 'list/:projectId', component: BuildingListComponent},
      {path: 'details/:buildingId', component: BuildingDetailsComponent}
    ]
  }
];
