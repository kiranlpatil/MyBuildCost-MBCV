import { Component, OnInit, Input, Output } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';

import {
  AppSettings,
  Label,
  Button,
  Headings,
  NavigationRoutes
} from '../../../../../../shared/constants';
import { API, BaseService, SessionStorage, SessionStorageService,  Message,
  Messages } from '../../../../../../shared/index';

import { GetQuantityService } from './get-quantity.service';

@Component({
  moduleId: module.id,
  selector: 'bi-cost-head-get-quantity',
  templateUrl: 'get-quantity.component.html'
})

export class GetQuantityComponent implements OnInit {
  @Input() quantityItems : any;
  @Output() quantityItems : any;

  constructor(private getQuantityService : GetQuantityService, private activatedRoute : ActivatedRoute) {
  }

  ngOnInit() {
    console.log('quantityItems : '+JSON.stringify(this.quantityItems));
  }

  onSubmit() {
  }

  getCostHeadQuantityDetails() {
    console.log('Getting qunaity');
  }

}
