import {Component, Input, Output, EventEmitter, OnInit, OnChanges} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button, Headings, Label, NavigationRoutes, TableHeadings, ProjectElements } from '../../../../../shared/constants';
import { BuildingReport } from '../../../model/building-report';
import { SessionStorage, SessionStorageService,  Message, Messages, MessageService } from '../../../../../shared/index';
import { EstimateReport } from '../../../model/estimate-report';
import { CostSummaryService } from '../../cost-summary-report/cost-summary.service';
import { CostHead } from '../../../model/costhead';
import { LoaderService } from '../../../../../shared/loader/loaders.service';
import { ErrorService } from '../../../../../shared/services/error.service';

declare let $: any;

@Component({
  moduleId: module.id,
  selector: 'bi-common-amenities',
  styleUrls: ['common-amenities.component.css'],
  templateUrl: 'common-amenities.component.html'
})

export class CommonAmenitiesComponent implements OnInit,OnChanges {
  @Input() amenitiesReport: BuildingReport;
  @Input() totalNumberOfBuildings: number;
  @Input() costingByUnit : string;
  @Input() costingByArea : string;
  @Input() showHideCostHeadButtonList ?: Array<any>;

  @Output() getReportDetails =  new EventEmitter<any>();
  @Output() sednCommonEmenitiesChartStatus=  new EventEmitter<any>();

  projectId: string;
  projectName: string;
  costHeadId:number;
  currentProjectCostHeadId : number;
  showProjectCostHeadList : boolean;
  showGrandTotalPanelTable:boolean=true;
  inActiveProjectCostHeads = new Array<CostHead>();

  constructor(private activatedRoute: ActivatedRoute, private _router : Router, private costSummaryService : CostSummaryService,
              private messageService : MessageService, private loaderService : LoaderService,
              private errorService:ErrorService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
    });
  }
  ngOnChanges() {
    $('#collapse-cost-summary-panel'+this.totalNumberOfBuildings).addClass('collapsed');
    $('#collapse'+this.totalNumberOfBuildings).removeClass('in');
}
  goToCostHeadView(estimatedItem :EstimateReport) {
    if(!estimatedItem.disableCostHeadView) {
      SessionStorageService.setSessionValue(SessionStorage.CURRENT_WINDOW_POSITION, $(window).scrollTop());
      this.projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
      this.projectName = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME);
      this._router.navigate([NavigationRoutes.APP_PROJECT, this.projectId, NavigationRoutes.APP_COMMON_AMENITIES,
        this.projectName, NavigationRoutes.APP_COST_HEAD, estimatedItem.name, estimatedItem.rateAnalysisId, NavigationRoutes.APP_CATEGORY]);
    }
  }


  changeBudgetedCostAmountOfProjectCostHead(costHead: string, amount: number) {
    if(amount !== null && amount &&  amount.toString().match(/^\d{1,9}(\.\d{1,2})?$/)===null ) {
      var message = new Message();
      message.isError = true;
      message.error_msg = this.getMessages().AMOUNT_VALIDATION_MESSAGE_BUDGETED;
      this.messageService.message(message);
      return;
    }
    if (amount !== null) {
      let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
      this.loaderService.start();
      this.costSummaryService.changeBudgetedCostAmountOfProjectCostHead( projectId,  costHead, amount).subscribe(
        buildingDetails => this.onUpdateBudgetedCostAmountSuccess(buildingDetails),
        error => this.onUpdateBudgetedCostAmountFailure(error)
      );
    }
  }

  onUpdateBudgetedCostAmountSuccess(buildingDetails : any) {
    this.loaderService.stop();
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_UPDATE_THUMBRULE_RATE_COSTHEAD;
    this.messageService.message(message);
    this.getReportDetails.emit();
  }

  onUpdateBudgetedCostAmountFailure(error : any) {

    if(error.err_code === 404 || error.err_code === 401 ||error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
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
    //  this.getReportDetails.emit();
    } else {
      this.showProjectCostHeadList = false;
      let message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_ALREADY_ADDED_ALL_COSTHEADS;
      this.messageService.message(message);
    }
  }

  onGetAllInActiveCostHeadsFailure(error : any) {
    if(error.err_code === 404 ||error.err_code === 401 || error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
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
    if(error.err_code === 404 ||error.err_code === 401 || error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
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
    if(error.err_code === 404 ||error.err_code === 401 || error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log('onActiveCostHeadFailure()'+error);
    this.loaderService.stop();
  }

  getHeadings() {
    return Headings;
  }
  getMessages() {
    return Messages;
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
    this.  savingCurrentAmenitiesIDInSessionStorage();
      this.costSummaryService.moveSelectedBuildingAtTop(this.totalNumberOfBuildings);

  }
  savingCurrentAmenitiesIDInSessionStorage() {
    if(SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING)===this.amenitiesReport.name) {
      SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING, null);
      if(this.totalNumberOfBuildings)
        this.sednCommonEmenitiesChartStatus.emit('true');
    }else {
      SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING,this.amenitiesReport.name);
      if(this.totalNumberOfBuildings)
        this.sednCommonEmenitiesChartStatus.emit('false');}
  }
}


