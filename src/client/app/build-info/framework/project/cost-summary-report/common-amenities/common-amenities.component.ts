import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button, Headings, Label, NavigationRoutes, TableHeadings } from '../../../../../shared/constants';
import { BuildingReport } from '../../../model/building-report';
import { SessionStorage, SessionStorageService } from '../../../../../shared/index';
import { EstimateReport } from '../../../model/estimate-report';

@Component({
  moduleId: module.id,
  selector: 'bi-common-amenities',
  styleUrls: ['common-amenities.component.css'],
  templateUrl: 'common-amenities.component.html'
})

export class CommonAmenitiesComponent implements OnInit {
  @Input() amenitiesReport: BuildingReport;
  @Input() costingByUnit : string;
  @Input() costingByArea : string;
  projectId: string;
  projectName: string;
  costHeadId:number;

  constructor(private activatedRoute: ActivatedRoute, private _router : Router, ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
    });
  }
  goToCostHeadView(estimatedItem :EstimateReport) {
    this.projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.projectName = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME);
    this._router.navigate([NavigationRoutes.APP_PROJECT, this.projectId,  this.projectName, NavigationRoutes.APP_COST_SUMMARY,
     NavigationRoutes.APP_COMMON_AMENITIES, NavigationRoutes.APP_COST_HEAD, estimatedItem.name, estimatedItem.rateAnalysisId]);
  }


  getHeadings() {
    return Headings;
  }

  getTableHeadings() {
    return TableHeadings;
  }

  getLabel() {
    return Label;
  }
  getButton() {
    return Button;
  }

}


