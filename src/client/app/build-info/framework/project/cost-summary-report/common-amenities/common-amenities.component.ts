import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { CostSummaryPipe } from './../cost-summary.pipe';
import  { FormBuilder, Validators } from '@angular/forms';

import {
  AppSettings,
  Label,
  Button,
  Headings,
  NavigationRoutes, Messages
} from '../../../../../shared/constants';
import { API, BaseService, SessionStorage, SessionStorageService, Message, MessageService } from '../../../../../shared/index';
import { CommonAmenitiesService } from './common-amenities.service';
import { CustomHttp } from '../../../../../shared/services/http/custom.http';
import { FormGroup } from '@angular/forms';
import { Project } from '../../../model/project';


@Component({
  moduleId: module.id,
  selector: 'bi-common-amenities-project-report',
  styleUrls: ['common-amenities.component.css'],
  templateUrl: 'common-amenities.component.html'
})

export class CommonAmenitiesComponent implements OnInit {
  projectId: string;

  constructor(private commonAmenitiesService: CommonAmenitiesService, private activatedRoute: ActivatedRoute, private messageService: MessageService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
      console.log(this.projectId);
      console.log('In Common');
    });
  }
}


