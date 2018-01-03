import { Route } from '@angular/router';
import { ProjectComponent } from './project.component';
import { CreateProjectComponent } from './createProject/createProject.component';
import { ListProjectComponent } from './listProject/listProject.component';

export const ProjectRoutes: Route[] = [
  {
    path: 'project',
    component: ProjectComponent,
    children:[
      {path: '', component: ProjectComponent},
      {path: 'list', component: ListProjectComponent},
      {path: 'create', component: CreateProjectComponent}
    ]
  }
];
