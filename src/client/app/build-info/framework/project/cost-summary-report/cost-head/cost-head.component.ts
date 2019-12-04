import {Component, OnInit, OnChanges, ViewChild, AfterViewInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Messages, ProjectElements, NavigationRoutes, TableHeadings, Button, Label, ValueConstant, Animations, AppSettings } from '../../../../../shared/constants';
import { API,SessionStorage, SessionStorageService, Message, MessageService, ErrorInstance } from '../../../../../shared/index';
import { Rate } from '../../../model/rate';
import { CommonService } from '../../../../../shared/services/common.service';
import { CostSummaryService } from '../cost-summary.service';
import * as lodsh from 'lodash';
import { Category } from '../../../model/category';
import { WorkItem } from '../../../model/work-item';
import { QuantityItem } from '../../../model/quantity-item';
import { QuantityDetails } from '../../../model/quantity-details';
import { LoaderService } from '../../../../../shared/loader/loaders.service';
import { QuantityDetailsComponent } from './quantity-details/quantity-details.component';
import { RateItem } from '../../../model/rate-item';
import { AttachmentComponent } from './attachment/attachment.component';
import { AttachmentDetailsModel } from '../../../model/attachment-details';
import { trigger, state, style, animate, transition } from '@angular/animations';
import Any = jasmine.Any;
import { SteelQuantityItems } from '../../../model/SteelQuantityItems';
import { ErrorService } from '../../../../../shared/services/error.service';
import {UpdateSubscriptionStatusService} from "../../../../../shared/services/update-subscription-status.service";
import {ProjectHeaderVisibilityService} from "../../../../../shared/services/project-header-visibility.service";

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'bi-cost-head',
  styleUrls: ['cost-head.component.css'],
  templateUrl: 'cost-head.component.html',

  animations: [
    trigger('expandList', [
      state('inactive', style({
        'height': '48px'
      })),
      state('active',   style({
        'height': '*'
      })),
      transition('inactive => active', animate('300ms ease-in')),
      transition('active => inactive', animate('300ms ease-out'))
    ]),

    trigger('fadeIn', [
      transition(':enter', [
        style({
          'opacity': '0',
          'transform': 'translateY(20px)'
        }),
        animate('0.3s')
      ]),

      transition(':leave', [
        style({
          'opacity': '1',
          'transform': 'translateY(0px)'
        }),
        animate('0.3s')
      ])
    ])
  ]
})

export class CostHeadComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild(QuantityDetailsComponent) child: QuantityDetailsComponent;
  @ViewChild(AttachmentComponent) childVar: AttachmentComponent;

  animateView: boolean = false;
  gstval=ValueConstant.GST_VALUES;
  projectId : string;
  viewTypeValue: string;
  quantityName: string;
  baseUrl:string;
  viewType:string;
  keyQuantity:string;
  costHeadName: string;
  costHeadId:number;
  buildingId:any;
  workItemId: number;
  ccWorkItemID: number;
  quantityId: number;
  total: number;
  categoryId: number;
  directQuantity: number;
  categoryDetails: Array<Category>;
  categoryDetailsTotalAmount: number=0;
  workItem: WorkItem;
  categoryRateAnalysisId:number;
  compareWorkItemRateAnalysisId:number;
  compareCCWorkItemId:number;
  quantity:number=0;
  rateFromRateAnalysis:number=0;
  unit:string='';
  showCategoryList: boolean = false;
  displayCategory: boolean = false;
  status: string;
  fileNamesList:Array<AttachmentDetailsModel>;
  workItemsList: Array<WorkItem>;
  deleteConfirmationCategory = ProjectElements.CATEGORY;
  deleteConfirmationWorkItem = ProjectElements.WORK_ITEM;
  deleteConfirmationForQuantityDetails = ProjectElements.QUANTITY_DETAILS;
  deleteConfirmationForAttachment = ProjectElements.ATTACHMENT;
  updateConfirmationForDirectQuantity = ProjectElements.DIRECT_QUANTITY;
  updateConfirmationForMeasurementSheet = ProjectElements.MEASUREMENT_SHEET;
  updateConfirmationForFloorwiseQuantity = ProjectElements.FLOORWISE_QUANTITY;
  currentQuantityType: string;
  subscription:any;
  anySubscriptionAvailable:boolean;
  public showQuantityDetails:boolean=false;
  public state = 'inactive';

  public workItemNameFocus:boolean = false;

  private showWorkItemList:boolean=false;
  private showWorkItemTab : string = null;
  private showQuantityTab : string = null;
  private showAttachmentView : string = null;
  private compareWorkItemId:number=0;
  private compareCategoryId:number=0;
  private quantityItemsArray: Array<QuantityItem> = [];
  private steelQuantityItemsArray: any;
  private rateItemsArray: Rate;
  private categoryArray : Array<Category> = [];
  private showHideAddItemButton:boolean=true;

  private workItemListArray: Array<WorkItem> = [];
  private categoryListArray : Array<Category> = [];
  private categoryIdForInActive: number;
  private currentCategoryIndex: number;
  private currentWorkItemIndex: number;

  private disableRateField:boolean = false;
  private isDetailedQuantity:boolean = false;
  private rateView : string;
  private previousRateQuantity:number = 0;
  private quantityIncrement:number = 1;
  private displayRateView: string = null;


  private selectedWorkItemData : Array<WorkItem> = [];


  constructor(private costSummaryService : CostSummaryService, private activatedRoute : ActivatedRoute,
              private _router: Router, private messageService: MessageService, private commonService : CommonService,
              private loaderService: LoaderService, private errorService:ErrorService,
              private updateSubscriptionStatusService:UpdateSubscriptionStatusService,
              private projectHeaderVisibilityService:ProjectHeaderVisibilityService) {
    this.subscription = this.updateSubscriptionStatusService.changeSubscriptionStatus$.subscribe(
      (isAnySubscriptionAvailable:boolean )=> {
        this.anySubscriptionAvailable= isAnySubscriptionAvailable;}
    );
  }

  /*toggleState() {
    this.state = this.state === 'active' ? 'inactive' : 'active';
  }*/
  public toggleInput() {
    this.workItemNameFocus = true;
    setTimeout(() => {
      if(this.workItemNameFocus) {
        document.getElementById('workItemName').focus();
      }
    },100);
  }
  ngOnInit() {
    this.status = SessionStorageService.getSessionValue(SessionStorage.STATUS);
    this.projectHeaderVisibilityService.change(false);
    this.activatedRoute.params.subscribe(params => {

      this.projectId = params['projectId'];
      this.viewType = params['viewType'];
      this.viewTypeValue = params['viewTypeValue'];
      this.costHeadName = params['costHeadName'];
      this.costHeadId = parseInt(params['costHeadId']);


      if(this.viewType ===  API.BUILDING ) {
         this.buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
        this.baseUrl = '' +API.PROJECT + '/' + this.projectId + '/' + '' +  API.BUILDING+ '/' + this.buildingId;
      } else if(this.viewType === API.COMMON_AMENITIES) {
        this.baseUrl = '' +API.PROJECT + '/' + this.projectId;
      } else {
        console.log('Error');
      }

      SessionStorageService.setSessionValue(SessionStorage.CURRENT_COST_HEAD_ID, this.costHeadId);
      SessionStorageService.setSessionValue(SessionStorage.CURRENT_COST_HEAD_NAME, this.costHeadName);
      if(this.status) {
        this.getCategories(this.projectId, this.costHeadId);
      }
    });
  }

  getCategories(projectId: string, costHeadId: number) {
    this.loaderService.start();
    this.costSummaryService.getCategories(this.baseUrl, costHeadId).subscribe(
      categoryDetails => this.onGetCategoriesSuccess(categoryDetails),
      error => this.onGetCategoriesFailure(error)
    );
  }

  onGetCategoriesSuccess(categoryDetails: any) {
    this.categoryDetails = categoryDetails.data.categories;
    this.categoryDetailsTotalAmount = categoryDetails.data.categoriesAmount;
    if(this.categoryRateAnalysisId !== undefined && this.categoryRateAnalysisId !== null) {
      this.getActiveWorkItemsOfCategory(this.categoryRateAnalysisId);
      this.getInActiveWorkItems(this.categoryRateAnalysisId, this.compareWorkItemRateAnalysisId);
    }
    this.loaderService.stop();
  }

  calculateCategoriesTotal() {

    this.categoryDetailsTotalAmount = 0.0;

    for (let categoryData of this.categoryDetails) {
      this.categoryDetailsTotalAmount =this.categoryDetailsTotalAmount + categoryData.amount;
    }
    this.loaderService.stop();
  }

  onGetCategoriesFailure(error: any) {
    if(error.err_code === 404 ||error.err_code === 401 || error.err_code === 401 ||error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log(error);
    this.loaderService.stop();
  }

  ngOnChanges(changes: any) {
    if (changes.categoryListArray.currentValue !== undefined) {
      this.categoryListArray = changes.categoryListArray.currentValue;
    }
  }

  updateMeasurementSheet(categoryId: number, workItem : WorkItem, categoryIndex : number, workItemIndex : number,flag:string) {

    this.currentQuantityType = this.checkCurrentQuanitityType(workItem);
    if(workItem.quantity.isDirectQuantity ||
      (workItem.quantity.quantityItemDetails.length > 0 && workItem.quantity.quantityItemDetails[0].name !== 'default')) {
      $('#updateMeasurementQuantity'+workItemIndex).modal();
    } else if(!workItem.quantity.isDirectQuantity && workItem.quantity.quantityItemDetails.length === 0) {
      this.getDefaultQuantity(categoryId, workItem, categoryIndex, workItemIndex);
    } else if(!workItem.quantity.isDirectQuantity && workItem.quantity.quantityItemDetails[0].name === 'default') {
      this.getDefaultQuantity(categoryId, workItem, categoryIndex, workItemIndex);
    }
  }

  getQuantity(categoryId: number, workItem: WorkItem, categoryIndex: number, workItemIndex:number) {
      if ((workItem.quantity.quantityItemDetails.length > 1) || (workItem.quantity.quantityItemDetails.length === 1 &&
          workItem.quantity.quantityItemDetails[0].name !== Label.DEFAULT_VIEW)) {
        this.getDetailedQuantity(categoryId, workItem, categoryIndex, workItemIndex);
      } else {
          this.getDefaultQuantity(categoryId, workItem, categoryIndex, workItemIndex,);
      }
  }

  //Get detailed quantity
  getDetailedQuantity(categoryId: number, workItem: WorkItem, categoryIndex: number, workItemIndex:number) {
    this.setItemId(categoryId, workItem.rateAnalysisId, workItem.workItemId);
    this.workItemId = workItem.rateAnalysisId;
      SessionStorageService.setSessionValue(SessionStorage.CURRENT_WORKITEM_ID, this.workItemId);

      let quantityDetails: Array<QuantityDetails> = workItem.quantity.quantityItemDetails;
      this.workItem = workItem;
      this.workItem.quantity.quantityItemDetails = [];
      for(let quantityDetail of quantityDetails) {
        if(quantityDetail.name !== this.getLabel().DEFAULT_VIEW) {
          this.workItem.quantity.quantityItemDetails.push(quantityDetail);
        }
      }

      this.currentCategoryIndex = categoryIndex;
      this.currentWorkItemIndex = workItemIndex;
      this.showQuantityTab = Label.WORKITEM_DETAILED_QUANTITY_TAB;

      }

  showAddFloorwiseQuantityModal(workItem : WorkItem, workItemIndex : number, categoryId: number, categoryIndex : number) {
    let userId = SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    if(this.projectId !== AppSettings.SAMPLE_PROJECT_ID  ||  userId === AppSettings.SAMPLE_PROJECT_USER_ID ) {
      if (workItem.quantity.isDirectQuantity ||
        (workItem.quantity.quantityItemDetails.length > 0 && workItem.quantity.quantityItemDetails[0].name === 'default')) {
        this.currentQuantityType = this.checkCurrentQuanitityType(workItem);
        $('#addFloorwiseQuantity' + workItemIndex).modal();
      } else if (workItem.quantity.quantityItemDetails ||
        (workItem.quantity.quantityItemDetails.length > 0 && workItem.quantity.quantityItemDetails[0].name !== 'default')) {
        this.addNewDetailedQuantity(categoryId, workItem, categoryIndex, workItemIndex);
      }
    } else {
      var errorInstance = new ErrorInstance();
      errorInstance.err_msg = Messages.MSG_FOR_UPDATING_SAMPLE_PROJECT;
      errorInstance.err_code = 404;
      this.errorService.onError(errorInstance);
    }
  }

  addFloorwiseQuantity(categoryObject : any) {
    this.addNewDetailedQuantity(categoryObject.categoryId,
      categoryObject.workitem, categoryObject.categoryIndex, categoryObject.workItemIndex);
  }

  //Add blank detailed quantity at last
  addNewDetailedQuantity(categoryId: number, workItem: WorkItem, categoryIndex: number, workItemIndex:number) {
    this.showWorkItemTab = Label.WORKITEM_DETAILED_QUANTITY_TAB;
    workItem.quantity.isDirectQuantity = false;
    this.currentQuantityType = this.checkCurrentQuanitityType(workItem);

    this.toggleWorkItemPanel(workItemIndex, workItem);
    var element = document.getElementById('collapseDetails'+workItemIndex);
    if(element.classList.contains('hide-body')) {
      element.classList.remove('hide-body');
    }
    element.classList.add('display-body');

    this.getDetailedQuantity(categoryId, workItem, categoryIndex, workItemIndex);
    let quantityDetail: QuantityDetails = new QuantityDetails();
    this.workItem.quantity.quantityItemDetails.push(quantityDetail);
    this.showHideQuantityDetails(categoryId, workItemIndex);
  }

  showHideQuantityDetails(categoryId:number,workItemIndex:number) {
    if(this.compareWorkItemId === this.workItem.rateAnalysisId && this.compareCategoryId === categoryId) {
      this.showQuantityDetails = true;
    } else {
      this.showQuantityDetails = false;
    }
  }


  //Get Default Quantity (If floor wise or building wise quantity is not added)
  getDefaultQuantity(categoryId: number, workItem: WorkItem, categoryIndex: number, workItemIndex:number) {

    if((this.showWorkItemTab !== Label.WORKITEM_QUANTITY_TAB || this.compareCategoryId !== categoryId ||
      this.compareWorkItemId !== workItem.rateAnalysisId)) {
      if((this.showWorkItemTab !== Label.WORKITEM_STEEL_QUANTITY_TAB || this.compareCategoryId !== categoryId ||
          this.compareWorkItemId !== workItem.rateAnalysisId)) {
        this.setItemId(categoryId, workItem.rateAnalysisId, workItem.workItemId);
        this.workItemId = workItem.rateAnalysisId;
        SessionStorageService.setSessionValue(SessionStorage.CURRENT_WORKITEM_ID, this.workItemId);
        this.workItem = workItem;
        let quantityDetails: Array<QuantityDetails> = workItem.quantity.quantityItemDetails;

        if (quantityDetails.length !== 0 && quantityDetails[0].name === Label.DEFAULT_VIEW && !this.workItem.isSteelWorkItem) {
          this.workItem.quantity.quantityItemDetails = [];
          let defaultQuantityDetail = quantityDetails.filter(
            function (defaultQuantityDetail: any) {
              return defaultQuantityDetail.name === Label.DEFAULT_VIEW;
            });
          this.workItem.quantity.quantityItemDetails = defaultQuantityDetail;
          this.quantityItemsArray = lodsh.cloneDeep(defaultQuantityDetail[0].quantityItems);
          this.keyQuantity = defaultQuantityDetail[0].name;
          this.quantityId = defaultQuantityDetail[0].id;

        } else if (quantityDetails.length !== 0 && quantityDetails[0].name === Label.DEFAULT_VIEW && this.workItem.isSteelWorkItem) {

          this.workItem.quantity.quantityItemDetails = [];
          let defaultQuantityDetail = quantityDetails.filter(
            function (defaultQuantityDetail: any) {
              return defaultQuantityDetail.name === Label.DEFAULT_VIEW;
            });
          this.workItem.quantity.quantityItemDetails = defaultQuantityDetail;
          this.steelQuantityItemsArray = lodsh.cloneDeep(defaultQuantityDetail[0].steelQuantityItems);
          this.keyQuantity = defaultQuantityDetail[0].name;
          this.quantityId = defaultQuantityDetail[0].id;
        } else {
          let quantityDetail: QuantityDetails = new QuantityDetails();
          quantityDetail.quantityItems = [];
          quantityDetail.name = this.getLabel().DEFAULT_VIEW;
          if (this.workItem.isSteelWorkItem) {
            this.steelQuantityItemsArray = new SteelQuantityItems();
          } else {
            this.quantityItemsArray = [];
          }
           //this.workItem.quantity.quantityItemDetails.push(quantityDetail);
          this.keyQuantity = this.getLabel().DEFAULT_VIEW;
        }
        this.currentCategoryIndex = categoryIndex;
        this.currentWorkItemIndex = workItemIndex;
        this.showWorkItemTab = this.workItem.isSteelWorkItem ? Label.WORKITEM_STEEL_QUANTITY_TAB : Label.WORKITEM_QUANTITY_TAB;
      }else {
         this.showWorkItemTab=null;
      }
    } else {
      this.showWorkItemTab = null;
    }
  }

  // Get Rate
  getRate(displayRateView : string, categoryId:number, workItemId:number, workItem : WorkItem, disableRateField : boolean,
          categoryIndex : number, workItemIndex : number ) {

    if(this.showWorkItemTab !== Label.WORKITEM_RATE_TAB || this.displayRateView !== displayRateView ||
      this.compareCategoryId !== categoryId || this.compareWorkItemId !== workItemId) {
      //this.toggleState();
      this.setItemId(categoryId, workItemId, workItem.workItemId);
      this.setWorkItemDataForRateView(workItem.rateAnalysisId, workItem.rate);
      this.currentCategoryIndex = categoryIndex;
      this.currentWorkItemIndex = workItemIndex;
      this.rateView = Label.WORKITEM_RATE_TAB;
      this.setRateFlags(displayRateView, disableRateField);
    } else {
      //this.toggleState();
      this.showWorkItemTab = null;
      this.displayRateView = null;
    }
  }

  // Get Rate by quantity
  getRateByQuantity(displayRateView : string, categoryId:number, workItemId:number, workItem : WorkItem,
                    disableRateField : boolean , categoryIndex:number, workItemIndex : number) {
    if(this.showWorkItemTab !== Label.WORKITEM_RATE_TAB || this.displayRateView !== displayRateView ||
      this.compareCategoryId !== categoryId || this.compareWorkItemId !== workItemId) {

      this.setItemId(categoryId, workItemId, workItem.workItemId);
      this.setWorkItemDataForRateView(workItem.rateAnalysisId, workItem.rate);
      this.calculateQuantity(workItem);
      this.setRateFlags(displayRateView, disableRateField);
      this.rateView = Label.WORKITEM_RATE_BY_QUANTITY_TAB;
      this.currentCategoryIndex = categoryIndex;
      this.currentWorkItemIndex = workItemIndex;
    } else {
      this.showWorkItemTab = null;
      this.displayRateView = null;
    }
  }

  // Get System rate
  getSystemRate(displayRateView : string, categoryId:number, workItemId:number, workItem : WorkItem,
                disableRateField : boolean, categoryIndex:number, workItemIndex : number) {

    if(this.showWorkItemTab !== Label.WORKITEM_RATE_TAB || this.displayRateView !== displayRateView ||
      this.compareCategoryId !== categoryId || this.compareWorkItemId !== workItemId) {
      //this.toggleState();
      this.setItemId(categoryId, workItemId, workItem.workItemId);
      this.setWorkItemDataForRateView(workItem.rateAnalysisId, workItem.systemRate);
      this.rateView = Label.WORKITEM_SYSTEM_RATE_TAB;
      this.currentCategoryIndex = categoryIndex;
      this.currentWorkItemIndex = workItemIndex;
      this.setRateFlags(displayRateView, disableRateField);
    } else {
      //this.toggleState();
      this.showWorkItemTab = null;
      this.displayRateView = null;
    }
  }

  setItemId(categoryId:number, workItemId:number, ccWOrkItemId:number) {
    this.compareCategoryId = categoryId;
    this.compareWorkItemId = workItemId;
    this.compareCCWorkItemId = ccWOrkItemId;
  }

  closeDetailedQuantityTab() {
    this.showQuantityTab = null;
  }

  closeQuantityTab() {
    this.showWorkItemTab = null;
  }

  setRateFlags(displayRateView : string, disableRateField : boolean) {
    this.displayRateView = displayRateView;
    this.disableRateField=disableRateField;
    this.showWorkItemTab = Label.WORKITEM_RATE_TAB;
  }

  setWorkItemDataForRateView(workItemId : number, rate : Rate) {
    this.workItemId = workItemId;
      this.rateItemsArray = lodsh.cloneDeep(rate);
      this.unit = lodsh.cloneDeep(rate.unit);
    SessionStorageService.setSessionValue(SessionStorage.CURRENT_WORKITEM_ID, this.workItemId);
  }

  calculateQuantity(workItem : WorkItem) {
    this.previousRateQuantity = lodsh.cloneDeep(workItem.rate.quantity);
    let quantity = lodsh.cloneDeep(workItem.quantity.total);
    this.rateItemsArray.quantity = parseFloat(this.commonService.changeQuantityByWorkItemUnit(quantity, workItem.unit, this.rateItemsArray.unit).toFixed(2));
    this.quantityIncrement = this.rateItemsArray.quantity / this.previousRateQuantity;
    for (let rateItemsIndex = 0; rateItemsIndex < this.rateItemsArray.rateItems.length; rateItemsIndex++) {
      this.rateItemsArray.rateItems[rateItemsIndex].quantity = parseFloat((
        this.rateItemsArray.rateItems[rateItemsIndex].quantity *
        this.quantityIncrement).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
    }
  }

  setIdsForDeleteWorkItem(categoryId: string, workItemId: string, ccWorkItemId: number, workItemIndex:number) {
    this.categoryId = parseInt(categoryId);
    this.workItemId =  parseInt(workItemId);
    this.ccWorkItemID = ccWorkItemId;
    this.compareWorkItemId = workItemIndex;
  }

   deactivateWorkItem() {
    this.loaderService.start();
    let costHeadId=parseInt(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));
    this.costSummaryService.deactivateWorkItem( this.baseUrl, costHeadId, this.categoryId, this.workItemId , this.ccWorkItemID).subscribe(
        success => this.onDeActivateWorkItemSuccess(success),
      error => this.onDeActivateWorkItemFailure(error)
    );
  }

  onDeActivateWorkItemSuccess(success: string) {

    this.showWorkItemList = false;
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_DELETE_WORKITEM;
    this.messageService.message(message);

    this.workItemsList.splice(this.compareWorkItemId, 1);

    this.categoryDetailsTotalAmount = this.commonService.totalCalculationOfCategories(this.categoryDetails,
      this.categoryRateAnalysisId, this.workItemsList);
    this.loaderService.stop();
    this.refreshCategoryList();
  }

  onDeActivateWorkItemFailure(error: any) {
    if(error.err_code === 404 || error.err_code === 401 || error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log('InActive WorkItem error : '+JSON.stringify(error));
    this.loaderService.stop();
  }

  getInActiveWorkItems(categoryId:number, categoryIndex:number) {

    this.compareWorkItemRateAnalysisId = categoryIndex;
    this.categoryRateAnalysisId = categoryId;

    this.costSummaryService.getInActiveWorkItems( this.baseUrl, this.costHeadId, categoryId).subscribe(
      workItemList => this.onGetInActiveWorkItemsSuccess(workItemList),
      error => this.onGetInActiveWorkItemsFailure(error)
    );
  }

  onGetInActiveWorkItemsSuccess(workItemList:any) {
    if (workItemList.data.length !== 0) {
      this.workItemListArray = workItemList.data;
      this.showWorkItemList = true;
    } else {
      this.showWorkItemList = false;
      }
  }

  onGetInActiveWorkItemsFailure(error:any) {
    if(error.err_code === 404 ||error.err_code === 401 || error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log('Get WorkItemList error : '+error);
  }

  onSelectedWorkItem(selectedWorkItem:any) {
    this.loaderService.start();
    this.showWorkItemList=false;
    let workItemList  =  this.workItemListArray;
    let workItemObject = workItemList.filter(
      function( workItemObj: any){
        return workItemObj.name === selectedWorkItem;
      });

    this.selectedWorkItemData[0] = workItemObject[0];

    let categoryId=this.categoryRateAnalysisId;

    this.costSummaryService.addWorkItem( this.baseUrl, this.costHeadId, categoryId,
      workItemObject[0]).subscribe(
      success => this.onAddWorkItemSuccess(success),
      error => this.onAddWorkItemFailure(error)
    );
  }

  onAddWorkItemSuccess(success : string) {

    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_WORKITEM;
    this.messageService.message(message);


    this.workItemsList = this.workItemsList.concat(this.totalCalculationOfWorkItemsList(this.selectedWorkItemData));
    this.categoryDetailsTotalAmount = this.commonService.totalCalculationOfCategories(this.categoryDetails,
      this.categoryRateAnalysisId, this.workItemsList);
    this.loaderService.stop();
    this.refreshCategoryList();
  }

  onAddWorkItemFailure(error:any) {
    if(error.err_code === 404 || error.err_code === 401 ||error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log('Active WorkItem error : '+error);
    this.loaderService.stop();
  }

  setCategoryIdForDeactivate(categoryId : any) {
    this.categoryIdForInActive = categoryId;
  }

  setQuantityTotal(total: number) {
    this.total = total;
  }

  showUpdateDirectQuantityModal(workItem : WorkItem, categoryId : number, workItemIndex : number) {
    let userId = SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    if(this.projectId !== AppSettings.SAMPLE_PROJECT_ID  ||  userId === AppSettings.SAMPLE_PROJECT_USER_ID ) {
      this.currentWorkItemIndex = workItemIndex;
      this.currentQuantityType = this.checkCurrentQuanitityType(workItem);

      if (workItem.quantity.quantityItemDetails.length !== 0 &&
        ((workItem.quantity.quantityItemDetails[0].quantityItems && workItem.quantity.quantityItemDetails[0].quantityItems.length !== 0) ||
          (workItem.quantity.quantityItemDetails[0].steelQuantityItems && workItem.quantity.quantityItemDetails[0].steelQuantityItems.steelQuantityItem.length !== 0))) {
        $('#updateDirectQuantity' + workItemIndex).modal();
      } else {
        this.changeDirectQuantity(categoryId, workItem.rateAnalysisId, workItem.workItemId, workItem.quantity.total);
      }
    } else {
      workItem.quantity.total = this.total;
      var errorInstance = new ErrorInstance();
      errorInstance.err_msg = Messages.MSG_FOR_UPDATING_SAMPLE_PROJECT;
      errorInstance.err_code = 404;
      this.errorService.onError(errorInstance);
    }
  }

  checkCurrentQuanitityType(workItem : WorkItem) {
    if(workItem.quantity.isDirectQuantity) {
      return ProjectElements.DIRECT_QUANTITY;
    } else if(workItem.quantity.quantityItemDetails.length !== 0) {
      if(workItem.quantity.quantityItemDetails.length > 0 && workItem.quantity.quantityItemDetails[0].name === 'default') {
        return ProjectElements.MEASUREMENT_SHEET;
      } else {
        return ProjectElements.FLOORWISE_QUANTITY;
      }
    }
    return null;
  }

  changeDirectQuantity(categoryId : number, workItemId: number, ccWorkItemId: number, directQuantity : number) {
    if( directQuantity !== null ||  directQuantity !== 0) {
      this.loaderService.start();
      this.costSummaryService.updateDirectQuantityAmount(this.baseUrl, this.costHeadId, categoryId,
        workItemId, ccWorkItemId, directQuantity).subscribe(
        workItemList => this.onChangeDirectQuantitySuccess(workItemList),
        error => this.onChangeDirectQuantityFailure(error)
      );
    }
  }

  onChangeDirectQuantitySuccess(success : any) {
    console.log('success : '+JSON.stringify(success));
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_UPDATE_DIRECT_QUANTITY_OF_WORKITEM;
    this.messageService.message(message);
    this.refreshCategoryList();
    this.loaderService.stop();
  }

  onChangeDirectQuantityFailure(error : any) {
    if(error.err_code === 404 || error.err_code === 401 ||error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log('error : '+JSON.stringify(error));
    this.loaderService.stop();
  }

  changeGst(categoryId : number, workItem : WorkItem, gst:number) {
      this.loaderService.start();
      this.costSummaryService.updateGstAmount(this.baseUrl, this.costHeadId, categoryId,
        workItem.rateAnalysisId, workItem.workItemId, gst).subscribe(
        workItemList => this.onChangeGstSuccess(workItemList),
        error => this.onChangeGstFailure(error)
      );
  }

  onChangeGstSuccess(success : any) {
    console.log('success : '+JSON.stringify(success));
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_UPDATE_GST_OF_WORKITEM;
    this.messageService.message(message);
    this.refreshCategoryList();
    this.loaderService.stop();
  }

  onChangeGstFailure(error : any) {
    if(error.err_code === 404 || error.err_code === 401 ||error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log('error : '+JSON.stringify(error));
    this.loaderService.stop();
  }


  changeDirectRate(categoryId : number, workItemId: number, ccWorkItemId:number, directRate : number) {
    if(directRate && !directRate.toString().match(/^\d{1,7}(\.\d{1,2})?$/)) {
      var message = new Message();
      message.isError = true;
      message.error_msg = this.getMessages().AMOUNT_VALIDATION_MESSAGE;
      this.messageService.message(message);
      return;
    }
    if(directRate !== null && directRate !== 0 ) {
      this.loaderService.start();
      this.costSummaryService.updateDirectRate(this.baseUrl, this.costHeadId,
        categoryId, workItemId, ccWorkItemId, directRate).subscribe(
        success => this.onUpdateDirectRateSuccess(success),
        error => this.onUpdateDirectRateFailure(error)
      );
    }
  }

  onUpdateDirectRateSuccess(success : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_UPDATE_DIRECT_RATE_OF_WORKITEM;
    this.messageService.message(message);
    this.refreshCategoryList();
    this.loaderService.stop();
  }

  onUpdateDirectRateFailure(error : any) {
    if(error.err_code === 404 ||error.err_code === 401 || error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    this.loaderService.stop();
  }

  refreshCategoryList() {
    this.getCategories( this.projectId, this.costHeadId);
    //this.showWorkItemTab = null;
    //this.showQuantityTab = null;
    //this.displayRateView = null;
  }

  updateWorkItemName(categoryId: number, workItem : any) {
    this.loaderService.start();
    console.log('WorkItem name : ' + workItem.name);
    let costHeadId = parseInt(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));
    this.costSummaryService.updateWorkItemName( this.baseUrl, costHeadId, categoryId, workItem.rateAnalysisId,
      workItem.workItemId, workItem.name).subscribe(
      workItemsList => this.onUpdateWorkItemNameSuccess(workItemsList),
      error => this.onUpdateWorkItemNameFailure(error)
    );
  }

  onUpdateWorkItemNameSuccess(workItem : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_UPDATE_WORKITEM_NAME;
    this.messageService.message(message);
    this.refreshCategoryList();
    this.loaderService.stop();
  }

  onUpdateWorkItemNameFailure(error : any) {
    var message = new Message();
    message.isError = true;
    message.error_msg = error.err_msg;
    this.messageService.message(message);
    this.loaderService.stop();
  }

  toggleWorkItemPanel(workItemIndex : number, workItem:WorkItem) {
    var element = document.getElementById('collapseDetails' + workItemIndex);
    this.detailedQty(workItem);
    if(workItem.quantity.quantityItemDetails.length > 0 && workItem.quantity.quantityItemDetails[0].name === 'default') {
      element.classList.add('hide-body');
    } else if(element.classList.contains('display-body')) {
      element.classList.remove('display-body');
      element.classList.add('hide-body');
    } else if(element.classList.contains('hide-body')) {
      element.classList.remove('hide-body');
      element.classList.add('display-body');
    }
  }

  detailedQty(workItem: WorkItem) {
    if (workItem.quantity.quantityItemDetails.length > 0 && workItem.quantity.quantityItemDetails[0].name !== 'default') {
      for (let floorwiseQty of workItem.quantity.quantityItemDetails) {
        if ((floorwiseQty.quantityItems && floorwiseQty.quantityItems.length > 0) ||
          (floorwiseQty.steelQuantityItems && floorwiseQty.steelQuantityItems.steelQuantityItem.length > 0)) {
          floorwiseQty.isMeasurmentSheetPresentForFloor = true;
        } else {
          floorwiseQty.isMeasurmentSheetPresentForFloor = false;
        }
      }
    }
  }

  getActiveWorkItemsOfCategory(categoryId : number) {
      this.closeAllTabs();
      let costHeadId = parseInt(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));
      this.categoryId = categoryId;
      this.categoryRateAnalysisId = categoryId;
      this.costSummaryService.getActiveWorkItemsOfCategory( this.baseUrl, costHeadId, this.categoryId).subscribe(
        workItemsList => this.onGetActiveWorkItemsOfCategorySuccess(workItemsList),
        error => this.onGetActiveWorkItemsOfCategoryFailure(error)
      );
    }

  onGetActiveWorkItemsOfCategorySuccess(workItemsList : any) {
    this.workItemsList = workItemsList.data.workItems;
    for(let workItem of this.workItemsList) {
      if (workItem.quantity.quantityItemDetails &&
          (workItem.quantity.quantityItemDetails.length > 0 && workItem.quantity.quantityItemDetails[0].name !== 'default')) {
          workItem.isDetailedQuantity = true;
       }
      if((workItem.quantity.quantityItemDetails && workItem.quantity.quantityItemDetails.length !== 0 &&
          workItem.quantity.quantityItemDetails[0].name === 'default' && workItem.quantity.quantityItemDetails[0].quantityItems
          && workItem.quantity.quantityItemDetails[0].quantityItems.length > 0) ||
        (workItem.quantity.quantityItemDetails && workItem.quantity.quantityItemDetails.length !== 0 &&
          workItem.quantity.quantityItemDetails[0].name === 'default' &&  workItem.quantity.quantityItemDetails[0].steelQuantityItems
          && workItem.quantity.quantityItemDetails[0].steelQuantityItems.steelQuantityItem.length > 0)) {
        workItem.isMeasurmentSheetPresent = true;
      }
    }
    this.showHideAddItemButton=workItemsList.data.showHideAddButton;
    this.toggleWorkItemView();
  }

  toggleWorkItemView() {
    if($('#collapse'+this.categoryRateAnalysisId).hasClass('display-body')) {

      if($('#collapse'+this.categoryRateAnalysisId).prev().find('a').hasClass('collapsed')) {
        $('#collapse'+this.categoryRateAnalysisId).prev().find('a').removeClass('collapsed');
      } else {
        $('#collapse'+this.categoryRateAnalysisId).prev().find('a').addClass('collapsed');
      }

      $('#collapse'+this.categoryRateAnalysisId).removeClass('display-body');
      $('#collapse'+this.categoryRateAnalysisId).addClass('hide-body');
    } else {

      if($('#collapse'+this.categoryRateAnalysisId).prev().find('a').hasClass('collapsed')) {
        $('#collapse'+this.categoryRateAnalysisId).prev().find('a').removeClass('collapsed');
      } else {
        $('#collapse'+this.categoryRateAnalysisId).prev().find('a').addClass('collapsed');
      }

      $('#collapse'+ this.categoryRateAnalysisId).removeClass('hide-body');
      $('#collapse'+this.categoryRateAnalysisId).addClass('display-body');
    }
    setTimeout(() => {
      let taObjects = document.getElementsByTagName('textarea');
      for(let i=0;i<taObjects.length;i++) {
        taObjects[i].style.height = taObjects[i].scrollHeight + 'px';
        console.log('\n');
        console.log(taObjects[i].value);
      }
    },50);
  }

  // calculation of Quantity * Rate
  totalCalculationOfWorkItemsList(workItemsList : any) {
      for(let workItemData of workItemsList) {
        workItemData.amount = this.commonService.calculateAmountOfWorkItem(workItemData.quantity.total, workItemData.rate.total);
      }
      return workItemsList;
  }

  onGetActiveWorkItemsOfCategoryFailure(error : any) {
    if(error.err_code === 404 || error.err_code === 401 ||error.err_code === 0 || error.err_code===500) {
      this.errorService.onError(error);
    }
    console.log('onGetActiveWorkItemsOfCategoryFailure error : '+JSON.stringify(error));
  }

  setQuantityName(qtyName : string) {
    this.quantityName = qtyName;
  }

  setWorkItemId(workItemId:number) {
    this.workItemId = workItemId;
  }

  setccWorkItemRateId(workItemRateId: number) {
    this.ccWorkItemID = workItemRateId;
  }

  deleteElement(elementType : string) {
    if(elementType === ProjectElements.QUANTITY_DETAILS) {
      this.child.deleteQuantityDetailsByName(this.quantityName,this.workItemId, this.ccWorkItemID);
    }
    if(elementType === ProjectElements.WORK_ITEM) {
      this.deactivateWorkItem();
    }
    if(elementType === ProjectElements.ATTACHMENT) {
      this.childVar.removeAttachment();
    }
  }

  updateElement(updatedWorkitem : any) {
     this.changeDirectQuantity(updatedWorkitem.categoryId , updatedWorkitem.workitem.rateAnalysisId,
       updatedWorkitem.workitem.workItemId ,updatedWorkitem.workitem.quantity.total);
  }

  updateTotal(totalObj:any) {
    let workItem = totalObj.workitem;
    workItem.quantity.total = totalObj.total;
  }

  updateQuantityMeasurementSheet(categoryObj : any) {
    console.log('Call to update measurement sheet');
    this.getDefaultQuantity(categoryObj.categoryId, categoryObj.workitem, categoryObj.categoryIndex, categoryObj.workItemIndex);
  }

  goBack() {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    this._router.navigate([NavigationRoutes.APP_PROJECT,projectId,NavigationRoutes.APP_COST_SUMMARY]);
  }

  getTableHeadings() {
    return TableHeadings;
  }

  getButton() {
    return Button;
  }

  getLabel() {
    return Label;
  }

  getMessages() {
    return Messages;
  }

  setCategoriesTotal( categoriesTotal : number) {
    this.categoryDetailsTotalAmount = categoriesTotal;
    this.refreshCategoryList();
  }

  setCategoriesTotalOfQty( categoriesTotal : number) {
    this.categoryDetailsTotalAmount = categoriesTotal;
    if(this.workItem)
    this.workItem.isMeasurmentSheetPresent = false;
  }

  updateMeasurmentFlag(workItem: any) {
    this.detailedQty(workItem);
  }
  closeRateView() {
    this.showWorkItemTab = null;
    this.displayRateView = null;
  }

  closeQuantityView() {
    this.showQuantityTab = null;
    this.showWorkItemTab = null;
  }
  closeAttachmentView() {
      this.showAttachmentView = null;
  }

  closeAllTabs() {
    this.closeRateView();
    this.closeQuantityView();
    this.closeAttachmentView();
  }

  workItemRefresh() {
    this.getCategories( this.projectId, this.costHeadId);
  }

  setVariable(categoryId: number, workItemId:number, ccWorkItemId:number, categoryIndex: number, workItemIndex:number) {
    if(this.showAttachmentView !== Label.ATTACH_FILE || this.compareCategoryId !== categoryId || this.compareWorkItemId !== workItemId) {
      this.showAttachmentView = Button.ATTACH_FILE;
      this.currentCategoryIndex = categoryIndex;
      this.currentWorkItemIndex = workItemIndex;
      this.getPresentFilesForWorkItem(workItemId, ccWorkItemId);
    } else {
      this.showAttachmentView = null;
    }
  }

  getPresentFilesForWorkItem(workItemId:number, ccWorkItemId:number) {
    this.loaderService.start();
    this.costSummaryService.getPresentFilesForWorkItem(this.baseUrl,
      this.costHeadId, this.categoryId, workItemId, ccWorkItemId).subscribe(
      fileNamesList => this.onGetPresentFilesForWorkItemSuccess(fileNamesList),
      error => this.onGetPresentFilesForWorkItemFailure(error)
    );
  }

  onGetPresentFilesForWorkItemSuccess(fileNamesList : any) {
    this.loaderService.stop();
     this.fileNamesList = fileNamesList.response.data;
     this.loaderService.stop();
  }

  onGetPresentFilesForWorkItemFailure(error: any) {
    let message = new Message();
    if (error.err_code === 404 ||error.err_code === 401 || error.err_code === 0 || error.err_code===500) {
      message.error_msg = error.err_msg;
      message.error_code =  error.err_code;
      message.isError = true;
      this.messageService.message(message);
    } else {
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    }
    this.loaderService.stop();
    console.log(error);
  }

  getListItemAnimation(index : number) {
    return Animations.getListItemAnimationStyle(index, Animations.defaultDelayFactor);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.animateView = true;
    },150);
  }
}
