import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button, Headings, Label, NavigationRoutes, TableHeadings, ProjectElements } from '../../../../../shared/constants';
import { BuildingReport } from '../../../model/building-report';
import { SessionStorage, SessionStorageService,  Message, Messages, MessageService } from '../../../../../shared/index';
import { EstimateReport } from '../../../model/estimate-report';
import { CostSummaryService } from '../../cost-summary-report/cost-summary.service';

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
  @Output() getReportDetails =  new EventEmitter<any>();
  projectId: string;
  projectName: string;
  costHeadId:number;

  constructor(private activatedRoute: ActivatedRoute, private _router : Router, private costSummaryService : CostSummaryService,
              private messageService : MessageService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
    });
  }
  goToCostHeadView(estimatedItem :EstimateReport) {
    this.projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.projectName = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME);
    this._router.navigate([NavigationRoutes.APP_PROJECT, this.projectId, NavigationRoutes.APP_COMMON_AMENITIES,
      this.projectName, NavigationRoutes.APP_COST_HEAD, estimatedItem.name, estimatedItem.rateAnalysisId, NavigationRoutes.APP_CATEGORY]);
  }


  changeBudgetedCostAmountOfProjectCostHead(costHead: string, amount: number) {
    if (amount !== null) {
      let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
      this.costSummaryService.changeBudgetedCostAmountOfProjectCostHead( projectId,  costHead, amount).subscribe(
        buildingDetails => this.onUpdateBudgetedCostAmountSuccess(buildingDetails),
        error => this.onUpdateBudgetedCostAmountFailure(error)
      );
    }
  }

  onUpdateBudgetedCostAmountSuccess(buildingDetails : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_UPDATE_THUMBRULE_RATE_COSTHEAD;
    this.messageService.message(message);
    this.getReportDetails.emit();
  }

  onUpdateBudgetedCostAmountFailure(error : any) {
    console.log('onAddCostheadSuccess : '+error);
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

  getProjectElements() {
    return ProjectElements;
  }
}


