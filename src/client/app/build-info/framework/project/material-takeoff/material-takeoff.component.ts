import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AppSettings,
  Label,
  Button,
  Headings,
  NavigationRoutes
} from '../../../../shared/constants';
import { API, BaseService, SessionStorage, SessionStorageService,  Message,
  Messages,
  MessageService } from '../../../../shared/index';
import { MaterialTakeoffService } from './material-takeoff.service';
import { Project } from './../../model/project';
import { ValidationService } from './../../../../shared/customvalidations/validation.service';
import { SharedService } from '../../../../shared/services/shared-service';

@Component({
  moduleId: module.id,
  selector: 'bi-material-takeoff',
  templateUrl: 'material-takeoff.component.html'
})

export class MaterialTakeoffComponent implements OnInit {

  constructor(private materialTakeoffService: MaterialTakeoffService, private _router: Router) {

  }

  ngOnInit() {
    console.log('Inside MaterialTakeoffComponent');
  }

  onSubmit() {
    //this.projectService
  }
}
