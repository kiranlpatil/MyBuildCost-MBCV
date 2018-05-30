import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { NavigationRoutes, Button, Animations } from '../../../shared/constants';
import { ProjectService } from '../project/project.service';
import { Project } from './../model/project';

@Component({
  moduleId: module.id,
  selector: 'bi-project-list',
  templateUrl: 'project-list.component.html',
  styleUrls: ['project-list.component.css']
})

export class ProjectListComponent implements OnInit, AfterViewInit {
  isVisible: boolean = false;
  animateView: boolean = false;
  projects : Array<Project>;

  constructor(private projectService: ProjectService, private _router: Router) {
  }

  ngOnInit() {
    this.getAllProjects();
  }

  createProject() {
    this._router.navigate([NavigationRoutes.APP_CREATE_PROJECT]);
  }

  getAllProjects() {
    this.projectService.getAllProjects().subscribe(
      projects => this.onGetAllProjectSuccess(projects),
      error => this.onGetAllProjectFailure(error)
    );
  }

  onGetAllProjectSuccess(projects : any) {
    this.projects = projects.data;
    this.isVisible = true;
  }

  onGetAllProjectFailure(error : any) {
    console.log(error);
  }

  getButton() {
    return Button;
  }

  getListItemAnimation(index : number) {
    return Animations.getListItemAnimationStyle(index, 0.1);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      console.log('animated');
      this.animateView = true;
    },150);
  }
}
