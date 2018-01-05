import { Route } from '@angular/router';
import { BuildingComponent } from './building.component';
import { CreateBuildingComponent } from './createBuilding/createBuilding.component';
import { ListBuildingComponent } from './listBuildings/listBuilding.component';
import { ViewBuildingComponent } from './viewBuilding/viewBuilding.component';

export const BuildingRoutes: Route[] = [
  {
    path: 'building',
    component: BuildingComponent,
    children:[
      {path: '', component: BuildingComponent},
      {path: 'create', component: CreateBuildingComponent},
      {path: 'view', component: ListBuildingComponent},
      {path: 'details', component: ViewBuildingComponent}
    ]
  }
];
