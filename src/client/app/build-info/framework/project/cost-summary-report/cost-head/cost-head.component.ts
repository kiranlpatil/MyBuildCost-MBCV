import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import {
  AppSettings,
  Label,
  Button,
  Headings,
  NavigationRoutes
} from '../../../../../shared/constants';
import { API, BaseService, SessionStorage, SessionStorageService,  Message,
  Messages } from '../../../../../shared/index';
import { CostHeadService } from './cost-head.service';

@Component({
  moduleId: module.id,
  selector: 'bi-cost-head-project-report',
  templateUrl: 'cost-head.component.html'
})

export class CostHeadComponent implements OnInit {

  projectId :any;
  buildingDetails = {
    "name": "Dwaraka",
    "plaster": [
      {
        "item": "Internal Plaster in CM 1:4",
        "quantity": 800,
        "unit": "Sqft.",
        "rate": 200,
        "amount": 800000
      },
      {
        "item": "External Plaster in CM 1:4",
        "quantity": 4100,
        "unit": "Sqft.",
        "rate": 150,
        "amount": 615000
      }
      ],
    "Masonary": [
      {
        "item": "Internal Plaster in CM 1:4",
        "quantity": 14,
        "unit": 14,
        "rate": 14,
        "amount": 4
      },
      {
        "item": "Internal Plaster in CM 1:4",
        "quantity": 14,
        "unit": 14,
        "rate": 14,
        "amount": 4
      }
      ],
    "RCC Work": [
      {
        "item": "Internal Plaster in CM 1:4",
        "quantity": 14,
        "unit": 14,
        "rate": 14,
        "amount": 4
      },
      {
        "item": "Internal Plaster in CM 1:4",
        "quantity": 14,
        "unit": 14,
        "rate": 14,
        "amount": 4
      }
      ]
  };

  costHeadDetails :any;

  constructor(private costHeadService : CostHeadService, private activatedRoute : ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
      if(this.projectId) {
        console.log('Got into Project Cost Head Component Details');
        //this.getCostHeadComponentDetails();
      }
    });
  }

  onSubmit() {
  }

  getQuantity() {
  }

  getRate() {

  }

  getCostHeadComponentDetails() {
    this.costHeadService.getCostHeadDetails().subscribe(
      costHeadDetails => this.onGetCostHeadDetailsSuccess(costHeadDetails),
      error => this.onGetCostHeadDetailsFail(error)
    );
  }

  onGetCostHeadDetailsSuccess(costHeadDetails : any) {
    this.costHeadDetails = costHeadDetails.data;
  }

  onGetCostHeadDetailsFail(error : any) {
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
