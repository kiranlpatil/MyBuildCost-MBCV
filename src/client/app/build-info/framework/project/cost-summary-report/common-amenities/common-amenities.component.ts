import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button, Headings, Label, NavigationRoutes, TableHeadings, ProjectElements } from '../../../../../shared/constants';
import { BuildingReport } from '../../../model/building-report';
import { SessionStorage, SessionStorageService,  Message, Messages, MessageService } from '../../../../../shared/index';
import { EstimateReport } from '../../../model/estimate-report';
import { CostSummaryService } from '../../cost-summary-report/cost-summary.service';
import { CostHead } from '../../../model/costhead';
import { LoaderService } from '../../../../../shared/loader/loaders.service';

declare let $: any;

@Component({
  moduleId: module.id,
  selector: 'bi-common-amenities',
  styleUrls: ['common-amenities.component.css'],
  templateUrl: 'common-amenities.component.html'
})

export class CommonAmenitiesComponent implements OnInit {
  @Input() amenitiesReport: BuildingReport;
  @Input() totalNumberOfBuildings: number;
  @Input() costingByUnit : string;
  @Input() costingByArea : string;
  @Input() showHideCostHeadButtonList ?: Array<any>;

  @Output() getReportDetails =  new EventEmitter<any>();
  projectId: string;
  projectName: string;
  costHeadId:number;
  currentProjectCostHeadId : number;
  showProjectCostHeadList : boolean;
  showGrandTotalPanelTable:boolean=true;
  inActiveProjectCostHeads = new Array<CostHead>();

  constructor(private activatedRoute: ActivatedRoute, private _router : Router, private costSummaryService : CostSummaryService,
              private messageService : MessageService, private loaderService : LoaderService) {
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

  getAllInActiveProjectCostHeads() {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.costSummaryService.getAllInActiveProjectCostHeads( this.projectId ).subscribe(
      inActiveCostHeads => this.onGetAllInActiveCostHeadsSuccess(inActiveCostHeads),
      error => this.onGetAllInActiveCostHeadsFailure(error)
    );
  }

  onGetAllInActiveCostHeadsSuccess(inActiveCostHeads : any) {
    if(inActiveCostHeads.data.length !== 0) {
      this.inActiveProjectCostHeads = inActiveCostHeads.data;
      this.showProjectCostHeadList = true;
      this.getReportDetails.emit();
    } else {
      this.showProjectCostHeadList = false;
      let message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_ALREADY_ADDED_ALL_COSTHEADS;
      this.messageService.message(message);
    }
  }

  onGetAllInActiveCostHeadsFailure(error : any) {
    console.log(error);
  }

  onChangeActiveSelectedCostHead(selectedInActiveCostHeadId:number) {
    this.showProjectCostHeadList = false;
    this.loaderService.start();
    this.costSummaryService.activateProjectCostHead( this.projectId, selectedInActiveCostHeadId).subscribe(
      inActiveCostHeads => this.onActiveCostHeadSuccess(inActiveCostHeads),
      error => this.onActiveCostHeadFailure(error)
    );
  }

  onActiveCostHeadSuccess(inActiveCostHeads : any) {
    this.getReportDetails.emit();
    this.loaderService.stop();
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_COSTHEAD;
    this.messageService.message(message);
  }

  onActiveCostHeadFailure(error : any) {
    console.log('onActiveCostHeadFailure()'+error);
    this.loaderService.stop();
  }

  setIdsToInActiveCostHead(projectCostHeadId : number) {
    this.currentProjectCostHeadId = projectCostHeadId;
  }

  deleteProjectCostHead () {
    this.showProjectCostHeadList = false;
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.loaderService.start();
    this.costSummaryService.inactivateProjectCostHead( projectId, this.currentProjectCostHeadId).subscribe(
      inActiveCostHeads => this.onInactivateCostHeadSuccess(inActiveCostHeads),
      error => this.onInactivateCostHeadFailure(error)
    );
  }

  onInactivateCostHeadSuccess(inActiveCostHeads : any) {
    this.getReportDetails.emit();
    this.loaderService.stop();
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_DELETE_COSTHEAD;
    this.messageService.message(message);
  }

  onInactivateCostHeadFailure(error : any) {
    console.log('onActiveCostHeadFailure()'+error);
    this.loaderService.stop();
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

  showGrandTotalTable() {
    this.showGrandTotalPanelTable = !this.showGrandTotalPanelTable;
    this.costSummaryService.moveSelectedBuildingAtTop(this.totalNumberOfBuildings);
  }
}


