import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import {
  NavigationRoutes, ProjectElements, Button, Menus, Headings, Label,
  ValueConstant, CurrentView, ScrollView, Animations
} from '../../../../shared/constants';
import { SessionStorage, SessionStorageService,  Message, Messages, MessageService } from '../../../../shared/index';
import { CostSummaryService } from './cost-summary.service';
import { Building } from '../../model/building';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidationService } from '../../../../shared/customvalidations/validation.service';
import { BuildingService } from '../building/building.service';
import { CostHead } from '../../model/costhead';
import { EstimateReport } from '../../model/estimate-report';
import { BuildingReport } from '../../model/building-report';
import ProjectReport = require('../../model/project-report');
import {LoaderService} from '../../../../shared/loader/loaders.service';
import {AddCostHeadButton} from '../../model/showHideCostHeadButton';
import { ErrorService } from '../../../../shared/services/error.service';

declare let $: any;

@Component({
  moduleId: module.id,
  selector: 'bi-cost-summary-report',
  templateUrl: 'cost-summary.component.html',
  styleUrls: ['cost-summary.component.css'],
})

export class CostSummaryComponent implements OnInit, AfterViewInit {

  animateView: boolean = false;
  @ViewChild('content') content: ElementRef;
  buildingsReport: Array <BuildingReport>;
  amenitiesReport: BuildingReport;
  projectReport: ProjectReport;
  projectId: string;
  buildingId: string;
  cloneBuildingId: string;
  costHeadId: number;

  grandTotalOfBudgetedCost: number;
  grandTotalOfTotalRate: number;
  grandTotalOfArea: number;
  grandTotalOfEstimatedCost : number;
  grandTotalOfEstimatedRate : number;

  buildingName : string;
  costHead: string;

  estimatedItem: EstimateReport;
  showCostHeadList:boolean=false;
  showGrandTotalPanelBody:boolean=true;
  isShowBuildingCostSummaryChart:boolean=true;
  isShowCommonAmenitiesChart:boolean=true;
  //showGrandTotalPanelTable= new Array<boolean>(10);
  compareIndex:number=0;
  userId:any;
  baseUrl:string;
  totalNumberOfBuildings : number;
  numberOfRemainingBuildings :number;
  activeStatus:boolean;
  addBuildingButtonDisable:boolean;
 public inActiveCostHeadArray: Array<CostHead>;
  cloneBuildingForm: FormGroup;
  cloneBuildingModel: Building = new Building();
  clonedBuildingDetails: Array<CostHead>;
  showHideCostHeadButtonsList: Array<AddCostHeadButton>;
  isActiveAddBuildingButton:boolean=false;
  public costIn: any[] = [
    { 'costInId': ProjectElements.RS_PER_SQFT},
    { 'costInId': ProjectElements.RS_PER_SQMT}
  ];

  public costPer: any[] = [
    { 'costPerId': ProjectElements.SLAB_AREA},
    { 'costPerId': ProjectElements.SALEABLE_AREA},
    { 'costPerId': ProjectElements.CARPET_AREA},
  ];

  defaultCostingByUnit:string = ProjectElements.RS_PER_SQFT;
  defaultCostingByArea:string = ProjectElements.SLAB_AREA;
  deleteConfirmationCostHead = ProjectElements.COST_HEAD;
  deleteConfirmationBuilding = ProjectElements.BUILDING;

  constructor(private costSummaryService : CostSummaryService, private activatedRoute : ActivatedRoute,
              private formBuilder: FormBuilder, private _router : Router, private messageService : MessageService,
              private buildingService: BuildingService, private loaderService : LoaderService,
              private errorService:ErrorService) {

    this.cloneBuildingForm = this.formBuilder.group({
      name : ['', ValidationService.requiredBuildingName],
      totalSlabArea :['', ValidationService.requiredSlabArea],
      totalCarpetAreaOfUnit :['', ValidationService.requiredCarpetArea],
      totalSaleableAreaOfUnit :['', ValidationService.requiredSalebleArea],
      plinthArea :['', ValidationService.requiredPlinthArea],
      totalNumOfFloors :['', ValidationService.requiredTotalNumOfFloors],
      numOfParkingFloors :['', ValidationService.requiredNumOfParkingFloors],
      carpetAreaOfParking :['', ValidationService.requiredCarpetAreaOfParking],
      numOfOneBHK : [''],
      numOfTwoBHK :[''],
      numOfThreeBHK :[''],
      numOfFourBHK :[''],
      numOfFiveBHK :[''],
      numOfLifts :['']
    });
  }

  ngOnInit() {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_VIEW, CurrentView.COST_SUMMARY);
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
      if(this.projectId) {
        this.onChangeCostingByUnit(this.defaultCostingByUnit);
      }
    });
    this.getProjectSubscriptionDetails();
  }

  getProjectSubscriptionDetails () {
    let userId = SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.costSummaryService.checkLimitationOfBuilding(userId, projectId).subscribe(
      status=>this.checkLimitationOfBuildingSuccess(status),
      error=>this.checkLimitationOfBuildingFailure(error)
    );
  }


  checkLimitationOfBuildingSuccess(status:any) {
    this.numberOfRemainingBuildings = status.numOfBuildingsRemaining;
    this.activeStatus = status.activeStatus;
    this.addBuildingButtonDisable =status.addBuildingDisable;
   /* if(status.expiryMessage) {
      this.subscriptionValidityMessage = status.expiryMessage;
    } else if(status.warningMessage) {
      this.subscriptionValidityMessage = status.warningMessage;
    }*/
  }

  checkLimitationOfBuildingFailure(error:any) {
    console.log(error);
  }
  showDropdown(e: any) {
      e.stopPropagation();
  }

  setBuildingId( i:number, buildingId: string) {
    this.setChartVisibility(i);
    this.compareIndex = i;
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING, buildingId);
   this.costSummaryService.moveSelectedBuildingAtTop(this.compareIndex);
  }

  getAllInActiveCostHeads(buildingId: string) {
    this.buildingId=buildingId;
    this.costSummaryService.getAllInActiveCostHeads( this.projectId, this.buildingId).subscribe(
      inActiveCostHeads => this.onGetAllInActiveCostHeadsSuccess(inActiveCostHeads),
      error => this.onGetAllInActiveCostHeadsFailure(error)
    );
  }

  onGetAllInActiveCostHeadsSuccess(inActiveCostHeads : any) {
    if(inActiveCostHeads.data.length !== 0) {
      this.inActiveCostHeadArray=inActiveCostHeads.data;
      this.showCostHeadList = true;
    } else if(inActiveCostHeads.data.length === 0) {
      this.showCostHeadList = false;
      let message = new Message();
      message.isError = true;
      message.error_msg = Messages.MSG_SUCCESS_ALREADY_ADDED_ALL_COSTHEADS;
      this.messageService.message(message);
    }
  }

  onGetAllInActiveCostHeadsFailure(error : any) {
    if(error.err_code === 404 || error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log(error);
  }

  goToCostHeadView( buildingId : string, buildingName:string, estimatedItem :any) {

    SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING, buildingId);
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING_NAME, buildingName);
    this.buildingId =  SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
    this.projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);

    this._router.navigate([NavigationRoutes.APP_PROJECT, this.projectId, NavigationRoutes.APP_BUILDING,
      buildingName, NavigationRoutes.APP_COST_HEAD, estimatedItem.name,  estimatedItem.rateAnalysisId, NavigationRoutes.APP_CATEGORY]);
  }

  goToCommonAmenities() {
    this.projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this._router.navigate([NavigationRoutes.APP_PROJECT,this.projectId,NavigationRoutes.APP_COMMON_AMENITIES]);
  }

  onChangeCostingByUnit(costingByUnit:any) {
    this.defaultCostingByUnit=costingByUnit;
    this.costSummaryService.getCostSummaryReport( this.projectId, this.defaultCostingByUnit, this.defaultCostingByArea).subscribe(
      projectCostIn => this.onGetCostSummaryReportSuccess(projectCostIn),
      error => this.onGetCostSummaryReportFailure(error)
    );
  }

  onGetCostSummaryReportSuccess(projects : any) {
    this.userId=SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    this.projectReport = new ProjectReport( projects.data.buildings, projects.data.commonAmenities[0]) ;
    this.buildingsReport = this.projectReport.buildings;
    if(this.projectReport.buildings !== undefined) {
      this.totalNumberOfBuildings = this.projectReport.buildings.length;
    }
    this.checkBuildingReportExist();
    this.amenitiesReport = this.projectReport.commonAmenities;
    this.projectReport.totalAreaOfBuildings = projects.data.totalAreaOfBuildings;
    this.showHideCostHeadButtonsList = projects.data.showHideCostHeadButtons;
    this.calculateGrandTotal();
    if(SessionStorageService.getSessionValue(SessionStorage.FROM_VIEW) === this.getScrollView().GO_TO_RECENT_BUILDING) {
      SessionStorageService.setSessionValue(SessionStorage.FROM_VIEW, null);
      this.costSummaryService.moveRecentBuildingAtTop( this.projectReport.buildings.length - 1);
    }
  }

  onGetCostSummaryReportFailure(error : any) {
    if(error.err_code === 404 || error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log('onGetCostInFail()'+error);
  }

  //TODO : Check if can merge
  onChangeCostingByArea(costingByArea:any) {
    this.defaultCostingByArea=costingByArea;
    this.costSummaryService.getCostSummaryReport( this.projectId, this.defaultCostingByUnit, this.defaultCostingByArea).subscribe(
      projectCostPer => this.onGetCostSummaryReportSuccess(projectCostPer),
      error => this.onGetCostSummaryReportFailure(error)
    );
  }

  setIdsToInActiveCostHead(buildingId: string, costHeadId: number) {
    this.buildingId = buildingId;
    this.costHeadId = costHeadId;
  }

  inActiveCostHead() {
    this.loaderService.start();
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.costSummaryService.inActiveCostHead( projectId, this.buildingId, this.costHeadId).subscribe(
        costHeadDetail => this.onInActiveCostHeadSuccess(costHeadDetail),
        error => this.onInActiveCostHeadFailure(error)
      );
    }

  onInActiveCostHeadSuccess(costHeadDetails: any) {
    this.loaderService.stop();
     if ( costHeadDetails !== null) {
      this.showCostHeadList = false;
      }
    this.onChangeCostingByUnit(this.defaultCostingByUnit);
  }

  onInActiveCostHeadFailure(error: any) {
    if(error.err_code === 404 || error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log(error);
    this.loaderService.stop();
  }

  onChangeActiveSelectedCostHead(selectedInActiveCostHeadId:number) {
    this.showCostHeadList=false;
    this.loaderService.start();
    this.costSummaryService.activeCostHead( this.projectId, this.buildingId, selectedInActiveCostHeadId).subscribe(
      inActiveCostHeads => this.onActiveCostHeadSuccess(inActiveCostHeads),
      error => this.onActiveCostHeadFailure(error)
    );
  }

  onActiveCostHeadSuccess(inActiveCostHeads : any) {
    this.loaderService.stop();
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_COSTHEAD;
    this.messageService.message(message);
    this.onChangeCostingByUnit(this.defaultCostingByUnit);
  }

  onActiveCostHeadFailure(error : any) {
    if(error.err_code === 404 || error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log('onActiveCostHeadFailure()'+error);
    this.loaderService.stop();
  }

  changeBudgetedCostAmountOfBuildingCostHead(buildingId: string, costHead: string, amount: number) {
    if (amount !== null) {
      let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
      this.costSummaryService.changeBudgetedCostAmountOfBuildingCostHead( projectId, buildingId, costHead, amount).subscribe(
        buildingDetails => this.onUpdateRateOfThumbRuleSuccess(buildingDetails),
        error => this.onUpdateRateOfThumbRuleFailure(error)
      );
    }
  }

  onUpdateRateOfThumbRuleSuccess(buildingDetails : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_UPDATE_THUMBRULE_RATE_COSTHEAD;
    this.messageService.message(message);
    this.onChangeCostingByUnit(this.defaultCostingByUnit);
  }

  onUpdateRateOfThumbRuleFailure(error : any) {
    if(error.err_code === 404 || error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log('onAddCostheadSuccess : '+error);
  }

  setIdForDeleteBuilding(buildingId : string) {
    this.buildingId = buildingId;
  }

  deleteBuilding() {
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.buildingService.deleteBuilding( projectId, this.buildingId).subscribe(
      project => this.onDeleteBuildingSuccess(project),
      error => this.onDeleteBuildingFailure(error)
    );
  }

  onDeleteBuildingSuccess(result : any) {
    if (result !== null) {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_SUCCESS_DELETE_BUILDING;
      this.messageService.message(message);
      this.onChangeCostingByUnit(this.defaultCostingByUnit);
      }
  }

  onDeleteBuildingFailure(error : any) {
    if(error.err_code === 404 || error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log(error);
  }

  goToEditBuilding(buildingId: string) {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING, buildingId);
    this._router.navigate([NavigationRoutes.APP_VIEW_BUILDING_DETAILS, buildingId]);
  }

  cloneBuilding(buildingId: string) {
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_BUILDING, buildingId);
    if(this.numberOfRemainingBuildings > 0) {
      this._router.navigate([NavigationRoutes.APP_CLONE_BUILDING]);
    } else {
      let packageName = 'Add_building';
      let premiumPackageAvailable = SessionStorageService.getSessionValue(SessionStorage.PREMIUM_PACKAGE_AVAILABLE);
      this._router.navigate([NavigationRoutes.APP_PACKAGE_SUMMARY, packageName,premiumPackageAvailable]);
    }
  }

  onGetBuildingDetailsForCloneSuccess(building: any) {
    this.cloneBuildingModel = building.data;
    this.clonedBuildingDetails = building.data.costHeads;
  }

  onGetBuildingDetailsForCloneFailure(error: any) {
    if(error.err_code === 404 || error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log(error);
  }

  cloneBuildingBasicDetails() {
    if (this.cloneBuildingForm.valid) {
     // this.cloneBuildingModel = this.cloneBuildingForm.value;
      let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
      this.buildingService.createBuilding( projectId, this.cloneBuildingModel)
        .subscribe(
          building => this.onCreateBuildingSuccess(building),
          error => this.onCreateBuildingFailure(error));
    }
  }

  onCreateBuildingSuccess(building: any) {
    //this.cloneBuildingId = building.data._id;
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_CLONED_BUILDING_DETAILS;
    this.messageService.message(message);
    this.onChangeCostingByUnit(this.defaultCostingByUnit);
  }

  onCreateBuildingFailure(error: any) {
    if(error.err_code === 404 || error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log(error);
  }

  cloneBuildingCostHeads(cloneCostHead: CostHead) {
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this.buildingService.cloneBuilding( projectId, this.cloneBuildingId, cloneCostHead).subscribe(
      project => this.onCloneBuildingCostHeadsSuccess(project),
      error => this.onCloneBuildingCostHeadsFailure(error)
    );
  }

  onCloneBuildingCostHeadsSuccess(project: any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_BUILDING_PROJECT;
    this.messageService.message(message);
    this.onChangeCostingByUnit(this.defaultCostingByUnit);
  }

  onCloneBuildingCostHeadsFailure(error: any) {
    if(error.err_code === 404 || error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log(error);
  }

  calculateGrandTotal() {
    //ToDo we have to remove this code after
    this.grandTotalOfBudgetedCost = 0;
    this.grandTotalOfTotalRate = 0;
    this.grandTotalOfArea = 0;

    this.grandTotalOfEstimatedCost = 0;
    this.grandTotalOfEstimatedRate = 0;

    //Calculate total of all building
    for (let buildindIndex = 0; buildindIndex < this.buildingsReport.length; buildindIndex++) {

      this.grandTotalOfBudgetedCost = this.grandTotalOfBudgetedCost + this.buildingsReport[buildindIndex].thumbRule.totalBudgetedCost;

      this.grandTotalOfArea = this.grandTotalOfArea + this.buildingsReport[buildindIndex].area;

      this.grandTotalOfEstimatedCost = this.grandTotalOfEstimatedCost +
       this.buildingsReport[buildindIndex].estimate.totalEstimatedCost;
    }

    //Calculate total with amenities data
    this.grandTotalOfBudgetedCost = this.grandTotalOfBudgetedCost + this.amenitiesReport.thumbRule.totalBudgetedCost;

    this.grandTotalOfTotalRate = (this.grandTotalOfBudgetedCost / this.projectReport.totalAreaOfBuildings);

    this.grandTotalOfEstimatedCost = this.grandTotalOfEstimatedCost + this.amenitiesReport.estimate.totalEstimatedCost;

    this.grandTotalOfEstimatedRate = (this.grandTotalOfEstimatedCost / this.projectReport.totalAreaOfBuildings);
  }

  toggleShowGrandTotalPanelBody() {
    this.showGrandTotalPanelBody=!this.showGrandTotalPanelBody;
  }

  deleteElement(elementType : string) {
    if(elementType === ProjectElements.COST_HEAD) {
      this.inActiveCostHead();
    }
    if(elementType === ProjectElements.BUILDING) {
      this.deleteBuilding();
    }
  }

  getCostSummaryReport() {
    this.onChangeCostingByUnit(this.defaultCostingByUnit);
  }

  getMenus() {
    return Menus;
  }

  getLabel() {
    return Label;
  }

  getButton() {
    return Button;
  }

  getHeadings() {
    return Headings;
  }

  getProjectElements() {
    return ProjectElements;
  }

  getScrollView() {
    return ScrollView;
  }

  getListItemAnimation(index : number) {
    return Animations.getListItemAnimationStyle(index, Animations.defaultDelayFactor);
  }
  getStatusOfCommonEmenities(event:string) {
    this.isShowBuildingCostSummaryChart=false;
    if(event==='true') {
      this.isShowCommonAmenitiesChart=false;
    } else {
      this.isShowCommonAmenitiesChart=true;
    }
  }
  setChartVisibility(currentIndex:number) {
    this.isShowCommonAmenitiesChart=false;
    if(this.compareIndex===currentIndex && ($('#collapse'+currentIndex).attr('aria-expanded')==='true'||
        $('#collapse'+currentIndex).attr('aria-expanded')==undefined)) {
      this.isShowBuildingCostSummaryChart=false;
    } else {
      this.isShowBuildingCostSummaryChart=true;
    }
    $('#collapse'+this.totalNumberOfBuildings).attr({
      'aria-expanded':'false'
    });
  }
  checkBuildingReportExist() {
    if(this.projectReport.buildings.length==0) {
      this.isShowBuildingCostSummaryChart = false;
      this.isShowCommonAmenitiesChart = false;
    } else {
      this.isShowBuildingCostSummaryChart =true;
      this.isShowCommonAmenitiesChart =true;
    }
  }
  ngAfterViewInit() {
    setTimeout(() => {
      console.log('animated');
      this.animateView = true;
    },150);
  }

}
