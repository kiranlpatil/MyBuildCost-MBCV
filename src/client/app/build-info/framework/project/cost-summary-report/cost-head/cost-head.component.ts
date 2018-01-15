import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { CostSummaryPipe } from './../cost-summary.pipe';

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
  styleUrls: ['cost-head.component.css'],
  templateUrl: 'cost-head.component.html'
})

export class CostHeadComponent implements OnInit {

 private toggleQty:boolean=false;
 private toggleRate:boolean=false;
 private compareIndex:number=0;
 private quantityItemsArray: any;
 private rateItemsArray: any;

  projectId : string;
  buildingId: string;
  buildingName: string;
  costHead:  string;
  costHeadDetails :any;
  /*buildingDetails = {
    'name': 'Dwaraka',
    'plaster': [
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
*/


  constructor(private costHeadService : CostHeadService, private activatedRoute : ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
      this.buildingName = params['buildingName'];
      this.costHead = params['costHead'];
      this.getCostHeadComponentDetails(this.projectId,this.costHead);
    });
  }

  onSubmit() {
  }

  getQuantity(i:number, quantityItems : any) {
    this.toggleQty=!this.toggleQty;
    this.compareIndex=i;
    if(this.toggleQty===true) {
      this.toggleRate=false;
    }
    this.quantityItemsArray = quantityItems;
  }

  getRate(i:number, rateItems : any) {
    this.toggleRate=!this.toggleRate;
    this.compareIndex=i;
    if(this.toggleRate===true) {
      this.toggleQty=false;
    }
    this.rateItemsArray = rateItems;
  }

  getItemRates(workItem: any, costHead:string) {
    console.log('WorkItem : '+workItem);
    console.log('costHead : '+costHead);
  }

  getCostHeadComponentDetails(projectId:string, costHead: string) {
    this.costHeadService.getCostHeadDetails(projectId, costHead).subscribe(
      costHeadDetail => this.onGetCostHeadDetailsSuccess(costHeadDetail),
      error => this.onGetCostHeadDetailsFail(error)
    );
  }

  onGetCostHeadDetailsSuccess(costHeadDetail : any) {
    this.costHeadDetails = costHeadDetail.data;
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

  deleteItem(i:number) {
    console.log('Item will be delete : '+i);
  }


}
