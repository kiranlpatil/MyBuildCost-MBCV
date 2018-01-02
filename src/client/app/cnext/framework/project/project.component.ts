import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppSettings, Messages, Label, Button, Headings, NavigationRoutes } from '../../../shared/constants';
import { ProjectService } from './project.service';
import { Project } from './../model/project';

@Component({
  moduleId: module.id,
  selector: 'bi-project-list-entity',
  templateUrl: 'project.component.html'
})

export class ProjectComponent implements OnInit {

  projectForm:  FormGroup;
  projects : any;
  model: Project = new Project();

  constructor(private projectService: ProjectService, private formBuilder: FormBuilder) {

    this.projectForm = this.formBuilder.group({
      'name': '',
      'region': '',
      'plotArea': '',
      'projectDuration': '',
      'plotPeriphery': ''
    });

  }

  ngOnInit() {
      this.getProjects();
  }

  onSubmit() {
      //this.projectService
    if(this.projectForm.valid) {
      this.model = this.projectForm.value;
      this.projectService.createProject(this.model)
        .subscribe(
          project => this.projectCreationSuccess(project),
          error => this.projectCreationFailed(error));
    }
  }


  getProjects() {
    this.projectService.getProject().subscribe(
      projects => this.onGetProjecteSuccess(projects),
      error => this.onGetProjecteFail(error) );
  }

  onGetProjecteSuccess(projects: any) {
    console.log(projects);
    this.projects = projects.data;
  }

  onGetProjecteFail(error : any) {
    console.log(error);
  }

  projectCreationSuccess(project : any) {
    console.log(project);
    this.getProjects();
  }

  projectCreationFailed(error : any) {
    console.log(error);
  }

  getMessages() {
    return Messages;
  }

  getLabels() {
    return Label;
  }

  getButtons() {
    return Button;
  }

  getHeadings() {
    return Headings;
  }
}
