import { Route } from '@angular/router';
import { ProjectComponent } from './project.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectListComponent } from './project-list/project-list.component';

export const ProjectRoutes: Route[] = [
  {
    path: 'project',
    component: ProjectComponent,
    children:[
      {path: '', component: ProjectComponent},
      {path: 'list', component: ProjectListComponent},
      {path: 'view', component: ProjectDetailsComponent},
      {path: 'create', component: CreateProjectComponent}
    ]
  }
];
