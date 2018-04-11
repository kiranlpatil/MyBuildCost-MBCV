import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Messages, ProjectElements, NavigationRoutes, TableHeadings, Button, Label, ValueConstant } from '../../../../../shared/constants';
import { API,SessionStorage, SessionStorageService, Message, MessageService } from '../../../../../shared/index';
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


@Component({
  moduleId: module.id,
  selector: 'bi-cost-head',
  styleUrls: ['cost-head.component.css'],
  templateUrl: 'cost-head.component.html'
})

export class CostHeadComponent implements OnInit, OnChanges {

  @ViewChild(QuantityDetailsComponent) child: QuantityDetailsComponent;

  projectId : string;
  viewTypeValue: string;
  baseUrl:string;
  viewType:string;
  keyQuantity:string;
  currentKey:string;
  costHeadName: string;
  costHeadId:number;
  workItemId: number;
  categoryId: number;
  categoryDetails: Array<Category>;
  categoryDetailsTotalAmount: number=0;
  workItem: WorkItem;
  ratePerUnitAmount : number = 0;
  totalAmount : number = 0;
  totalAmountOfMaterial : number = 0;
  totalAmountOfLabour : number = 0;
  totalAmountOfMaterialAndLabour : number = 0;
  categoryRateAnalysisId:number;
  compareWorkItemRateAnalysisId:number;
  quantity:number=0;
  rateFromRateAnalysis:number=0;
  unit:string='';
  choice:string;
  showCategoryList: boolean = false;
  workItemsList: Array<WorkItem>;
  deleteConfirmationCategory = ProjectElements.CATEGORY;
  deleteConfirmationWorkItem = ProjectElements.WORK_ITEM;
  deleteConfirmationForQuantityDetails = ProjectElements.QUANTITY_DETAILS;
  public showQuantityDetails:boolean=false;
  private showWorkItemList:boolean=false;
  private showWorkItemTab : string = null;
  private showQuantityTab : string = null;
  private compareWorkItemId:number=0;
  private compareCategoryId:number=0;
  private quantityItemsArray: Array<QuantityItem> = [];
  private rateItemsArray: Rate;
  private categoryArray : Array<Category> = [];

  private workItemListArray: Array<WorkItem> = [];
  private categoryListArray : Array<Category> = [];
  private categoryIdForInActive: number;
  private currentCategoryIndex: number;
  private currentWorkItemIndex: number;

  private disableRateField:boolean = false;
  private rateView : string;
  private previousRateQuantity:number = 0;
  private quantityIncrement:number = 1;
  private displayRateView: string = null;

  private selectedWorkItemData : Array<WorkItem> = [];


  constructor(private costSummaryService : CostSummaryService, private activatedRoute : ActivatedRoute,
              private _router: Router, private messageService: MessageService, private commonService : CommonService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {

      this.projectId = params['projectId'];
      this.viewType = params['viewType'];
      this.viewTypeValue = params['viewTypeValue'];
      this.costHeadName = params['costHeadName'];
      this.costHeadId = parseInt(params['costHeadId']);


      if(this.viewType ===  API.BUILDING ) {
        let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);
        this.baseUrl = '' +API.PROJECT + '/' + this.projectId + '/' + '' +  API.BUILDING+ '/' + buildingId;
      } else if(this.viewType === API.COMMON_AMENITIES) {
        this.baseUrl = '' +API.PROJECT + '/' + this.projectId;
      } else {
        console.log('Error');
      }

   SessionStorageService.setSessionValue(SessionStorage.CURRENT_COST_HEAD_ID, this.costHeadId);
      this.getCategories( this.projectId, this.costHeadId);

    });
  }

  getCategories(projectId: string, costHeadId: number) {

    this.costSummaryService.getCategories(this.baseUrl, costHeadId).subscribe(
      categoryDetails => this.onGetCategoriesSuccess(categoryDetails),
      error => this.onGetCategoriesFailure(error)
    );
  }

  onGetCategoriesSuccess(categoryDetails: any) {
    this.categoryDetails = categoryDetails.data.categories;
    this.categoryDetailsTotalAmount = categoryDetails.data.categoriesAmount;
  }

  calculateCategoriesTotal() {

    this.categoryDetailsTotalAmount = 0.0;

    for (let categoryData of this.categoryDetails) {
      this.categoryDetailsTotalAmount = this.commonService.decimalConversion(this.categoryDetailsTotalAmount
        + categoryData.amount);
    }
    this.loaderService.stop();
  }

  onGetCategoriesFailure(error: any) {
    console.log(error);
    this.loaderService.stop();
  }

  ngOnChanges(changes: any) {
    if (changes.categoryListArray.currentValue !== undefined) {
      this.categoryListArray = changes.categoryListArray.currentValue;
    }
  }

  getQuantity(categoryId: number, workItem: WorkItem, categoryIndex: number, workItemIndex:number) {
      if ((workItem.quantity.quantityItemDetails.length > 1) || (workItem.quantity.quantityItemDetails.length === 1 &&
          workItem.quantity.quantityItemDetails[0].name !== Label.DEFAULT_VIEW)) {
        this.getDetailedQuantity(categoryId, workItem, categoryIndex, workItemIndex);
      } else {
        this.getDefaultQuantity(categoryId, workItem, categoryIndex, workItemIndex);
      }
  }

  //Get detailed quantity
  getDetailedQuantity(categoryId: number, workItem: WorkItem, categoryIndex: number, workItemIndex:number) {
    if( this.showQuantityTab !== Label.WORKITEM_DETAILED_QUANTITY_TAB ||
      this.compareCategoryId !== categoryId || this.compareWorkItemId !== workItem.rateAnalysisId) {

      this.setItemId(categoryId, workItem.rateAnalysisId);

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

    } else {
      this.showWorkItemTab = null;
    }
  }

  //Add blank detailed quantity at last
  addNewDetailedQuantity(categoryId: number, workItem: WorkItem, categoryIndex: number, workItemIndex:number) {
    this.showWorkItemTab = Label.WORKITEM_DETAILED_QUANTITY_TAB;
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

    if( this.showWorkItemTab !== Label.WORKITEM_QUANTITY_TAB || this.compareCategoryId !== categoryId ||
      this.compareWorkItemId !== workItem.rateAnalysisId) {

        this.setItemId(categoryId, workItem.rateAnalysisId);
        this.workItemId = workItem.rateAnalysisId;
        SessionStorageService.setSessionValue(SessionStorage.CURRENT_WORKITEM_ID, this.workItemId);
        this.workItem = workItem;
        let quantityDetails: Array<QuantityDetails> = workItem.quantity.quantityItemDetails;

        if( quantityDetails.length !==0 ) {
            this.workItem.quantity.quantityItemDetails = [];
            let defaultQuantityDetail = quantityDetails.filter(
              function( defaultQuantityDetail: any){
                return defaultQuantityDetail.name === Label.DEFAULT_VIEW;
              });
            this.workItem.quantity.quantityItemDetails = defaultQuantityDetail;
            this.quantityItemsArray = defaultQuantityDetail[0].quantityItems;
            this.keyQuantity = defaultQuantityDetail[0].name;
        } else {
            let quantityDetail: QuantityDetails = new QuantityDetails();
            quantityDetail.quantityItems = [];
            quantityDetail.name = this.getLabel().DEFAULT_VIEW;
            this.workItem.quantity.quantityItemDetails.push(quantityDetail);
            this.quantityItemsArray = [];
            this.keyQuantity = this.getLabel().DEFAULT_VIEW;
        }

        this.currentCategoryIndex = categoryIndex;
        this.currentWorkItemIndex = workItemIndex;
        this.showWorkItemTab = Label.WORKITEM_QUANTITY_TAB;
    } else {
      this.showWorkItemTab = null;
    }
  }

  // Get Rate
  getRate(displayRateView : string, categoryId:number, workItemId:number, workItem : WorkItem, disableRateField : boolean,
          categoryIndex : number, workItemIndex : number ) {

    if(this.showWorkItemTab !== Label.WORKITEM_RATE_TAB || this.displayRateView !== displayRateView ||
      this.compareCategoryId !== categoryId || this.compareWorkItemId !== workItemId) {

      this.setItemId(categoryId, workItemId);
      this.setWorkItemDataForRateView(workItem.rateAnalysisId, workItem.rate);
      this.calculateTotalForRateView();
      this.currentCategoryIndex = categoryIndex;
      this.currentWorkItemIndex = workItemIndex;
      this.rateView = Label.WORKITEM_RATE_TAB;
      this.setRateFlags(displayRateView, disableRateField);
    } else {
      this.showWorkItemTab = null;
      this.displayRateView = null;
    }
  }

  // Get Rate by quantity
  getRateByQuantity(displayRateView : string, categoryId:number, workItemId:number, workItem : WorkItem,
                    disableRateField : boolean , categoryIndex:number, workItemIndex : number) {
    if(this.showWorkItemTab !== Label.WORKITEM_RATE_TAB || this.displayRateView !== displayRateView ||
      this.compareCategoryId !== categoryId || this.compareWorkItemId !== workItemId) {

      this.setItemId(categoryId, workItemId);
      this.setWorkItemDataForRateView(workItem.rateAnalysisId, workItem.rate);
      this.calculateQuantity(workItem);
      this.calculateTotalForRateView();
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

      this.setItemId(categoryId, workItemId);
      this.setWorkItemDataForRateView(workItem.rateAnalysisId, workItem.systemRate);
      this.calculateTotalForRateView();
      this.rateView = Label.WORKITEM_SYSTEM_RATE_TAB;
      this.currentCategoryIndex = categoryIndex;
      this.currentWorkItemIndex = workItemIndex;
      this.setRateFlags(displayRateView, disableRateField);
    } else {
      this.showWorkItemTab = null;
      this.displayRateView = null;
    }
  }

  setItemId(categoryId:number, workItemId:number) {
    this.compareCategoryId = categoryId;
    this.compareWorkItemId = workItemId;
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
    this.rateItemsArray.quantity = lodsh.cloneDeep(workItem.quantity.total);
    this.quantityIncrement = this.rateItemsArray.quantity / this.previousRateQuantity;
    for (let rateItemsIndex = 0; rateItemsIndex < this.rateItemsArray.rateItems.length; rateItemsIndex++) {
      this.rateItemsArray.rateItems[rateItemsIndex].quantity = parseFloat((
        this.rateItemsArray.rateItems[rateItemsIndex].quantity *
        this.quantityIncrement).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));
    }
  }

  calculateTotalForRateView() {
    this.rateItemsArray.total=0;
    this.ratePerUnitAmount = 0;
     this.totalAmount =  this.calculateTotalForRateItems(this.rateItemsArray.rateItems);
    this.ratePerUnitAmount = this.commonService.decimalConversion(this.totalAmount / this.rateItemsArray.quantity);
    this.rateItemsArray.total= this.ratePerUnitAmount;
  }

  calculateTotalForRateItems(rateItems : Array<RateItem>) {
    this.totalAmount = 0;
    this.totalAmountOfMaterial = 0;
    this.totalAmountOfLabour = 0;
    this.totalAmountOfMaterialAndLabour = 0;
    for (let rateItemsIndex in  rateItems) {
      this.choice = rateItems[rateItemsIndex].type;
      switch (this.choice) {
        case 'M':
          this.rateItemsArray.rateItems[rateItemsIndex].totalAmount = parseFloat((this.rateItemsArray.rateItems[rateItemsIndex].quantity *
            this.rateItemsArray.rateItems[rateItemsIndex].rate).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));

          this.totalAmountOfMaterial = Math.round(this.totalAmountOfMaterial + this.rateItemsArray.rateItems[rateItemsIndex].totalAmount);
          break;

        case 'L':
          this.rateItemsArray.rateItems[rateItemsIndex].totalAmount = parseFloat((this.rateItemsArray.rateItems[rateItemsIndex].quantity *
            this.rateItemsArray.rateItems[rateItemsIndex].rate).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));

          this.totalAmountOfLabour = Math.round(this.totalAmountOfLabour + this.rateItemsArray.rateItems[rateItemsIndex].totalAmount);
          break;

        case 'M + L':
          this.rateItemsArray.rateItems[rateItemsIndex].totalAmount = parseFloat((this.rateItemsArray.rateItems[rateItemsIndex].quantity *
            this.rateItemsArray.rateItems[rateItemsIndex].rate).toFixed(ValueConstant.NUMBER_OF_FRACTION_DIGIT));

          this.totalAmountOfMaterialAndLabour = Math.round(this.totalAmountOfMaterialAndLabour +
            this.rateItemsArray.rateItems[rateItemsIndex].totalAmount);
          break;
      }
      this.totalAmount = this.totalAmountOfMaterial + this.totalAmountOfLabour + this.totalAmountOfMaterialAndLabour;
      this.totalAmount = Math.round(this.totalAmount);
    }
    return (this.totalAmount);
  }

  setIdsForDeleteWorkItem(categoryId: string, workItemId: string,workItemIndex:number) {
    this.categoryId = parseInt(categoryId);
    this.workItemId =  parseInt(workItemId);
    this.compareWorkItemId = workItemIndex;
  }

  deactivateWorkItem() {
    this.loaderService.start();
    let costHeadId=parseInt(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));
    this.costSummaryService.deactivateWorkItem( this.baseUrl, costHeadId, this.categoryId, this.workItemId ).subscribe(
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
  }

  onDeActivateWorkItemFailure(error: any) {
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
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_ALREADY_ADDED_ALL_WORKITEMS;
      this.messageService.message(message);
    }
  }

  onGetInActiveWorkItemsFailure(error:any) {
    console.log('Get WorkItemList error : '+error);
  }

  onChangeActivateSelectedWorkItem(selectedWorkItem:any) {
    this.loaderService.start();
    this.showWorkItemList=false;
    let workItemList  =  this.workItemListArray;
    let workItemObject = workItemList.filter(
      function( workItemObj: any){
        return workItemObj.name === selectedWorkItem;
      });

    this.selectedWorkItemData[0] = workItemObject[0];

    let categoryId=this.categoryRateAnalysisId;

    this.costSummaryService.activateWorkItem( this.baseUrl, this.costHeadId, categoryId,
      workItemObject[0].rateAnalysisId).subscribe(
      success => this.onActivateWorkItemSuccess(success),
      error => this.onActivateWorkItemFailure(error)
    );
  }

  onActivateWorkItemSuccess(success : string) {

    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_WORKITEM;
    this.messageService.message(message);


    this.workItemsList = this.workItemsList.concat(this.totalCalculationOfWorkItemsList(this.selectedWorkItemData));
    this.categoryDetailsTotalAmount = this.commonService.totalCalculationOfCategories(this.categoryDetails,
      this.categoryRateAnalysisId, this.workItemsList);
    this.loaderService.stop();
  }

  onActivateWorkItemFailure(error:any) {
    console.log('Active WorkItem error : '+error);
    this.loaderService.stop();
  }

  setCategoryIdForDeactivate(categoryId : any) {
    this.categoryIdForInActive = categoryId;
  }

  changeDirectQuantity(categoryId : number, workItemId: number, directQuantity : number) {
    if(directQuantity !== null || directQuantity !== 0) {
      this.loaderService.start();
      this.costSummaryService.updateDirectQuantityAmount(this.baseUrl, this.costHeadId, categoryId, workItemId, directQuantity).subscribe(
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
    this.refreshWorkItemList();
    this.loaderService.stop();
  }

  onChangeDirectQuantityFailure(error : any) {
    console.log('error : '+JSON.stringify(error));
    this.loaderService.stop();
  }

  changeDirectRate(categoryId : number, workItemId: number, directRate : number) {
    if(directRate !== null || directRate !== 0) {
      this.loaderService.start();
      this.costSummaryService.updateDirectRate(this.baseUrl, this.costHeadId, categoryId, workItemId, directRate).subscribe(
        success => this.onUpdateDirectRateSuccess(success),
        error => this.onUpdateDirectRateFailure(error)
      );
    }
  }

  onUpdateDirectRateSuccess(success : any) {
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_UPDATE_RATE;
    this.messageService.message(message);
    this.refreshWorkItemList();
    this.loaderService.stop();
  }

  onUpdateDirectRateFailure(error : any) {
    this.loaderService.stop();
  }

  /*  deactivateCategory() {
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);

    this.costSummaryService.deactivateCategory( projectId, buildingId, this.costHeadId, this.categoryIdForInActive).subscribe(
      deactivatedCategory => this.onDeactivateCategorySuccess(deactivatedCategory),
      error => this.onDeactivateCategoryFailure(error)
    );
  }

  onDeactivateCategorySuccess(deactivatedCategory : any) {
    let categoryList = lodsh.clone(this.categoryDetails);
    this.categoryDetails = this.commonService.removeDuplicateItmes(categoryList, deactivatedCategory.data);
    this.calculateCategoriesTotal();
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_DELETE_CATEGORY;
    this.messageService.message(message);
/!*    this.getCategories( this.projectId, this.costHeadId);*!/
  }

  onDeactivateCategoryFailure(error : any) {
    console.log('In Active Category error : '+JSON.stringify(error));
  }*/

 /* getInActiveCategories() {
    let projectId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId = SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);

    this.costSummaryService.getInActiveCategories( projectId, buildingId, this.costHeadId).subscribe(
      categoryList => this.onGetInActiveCategoriesSuccess(categoryList),
      error => this.onGetInActiveCategoriesFailure(error)
    );
  }

  onGetInActiveCategoriesSuccess(categoryList : any) {
    if(categoryList.data.length!==0) {
    this.categoryArray = categoryList.data;
    this.showCategoryList = true;
    } else {
      var message = new Message();
      message.isError = false;
      message.custom_message = Messages.MSG_ALREADY_ADDED_ALL_CATEGORIES;
      this.messageService.message(message);
    }
  }

  onGetInActiveCategoriesFailure(error : any) {
    console.log('categoryList error : '+JSON.stringify(error));
  }*/

  /*onChangeActivateSelectedCategory(selectedCategoryId : number ) {
    let projectId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_ID);
    let buildingId=SessionStorageService.getSessionValue(SessionStorage.CURRENT_BUILDING);

    this.costSummaryService.activateCategory( projectId, buildingId, this.costHeadId, selectedCategoryId).subscribe(
      building => this.onActivateCategorySuccess(building),
      error => this.onActivateCategoryFailure(error)
    );
  }

  onActivateCategorySuccess(activatedCategory : any) {
    this.categoryDetails = this.categoryDetails.concat(activatedCategory.data);
    this.calculateCategoriesTotal();

    let categoryList = lodsh.clone(this.categoryArray);
    this.categoryArray = this.commonService.removeDuplicateItmes(categoryList, this.categoryDetails);

    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_ADD_CATEGORY;
    this.messageService.message(message);
  }

  onActivateCategoryFailure(error : any) {
    console.log('building error : '+ JSON.stringify(error));
  }
*/
  refreshCategoryList() {
    this.getCategories( this.projectId, this.costHeadId);
    this.showWorkItemTab = null;
    this.showQuantityTab = null;
    this.displayRateView = null;
  }

  refreshWorkItemList() {
    this.refreshCategoryList();
  }

/*  setSelectedWorkItems(workItemList:any) {
    this.selectedWorkItems = workItemList;
  }*/

    getActiveWorkItemsOfCategory(categoryId : number) {
      let costHeadId = parseInt(SessionStorageService.getSessionValue(SessionStorage.CURRENT_COST_HEAD_ID));
      this.categoryId = categoryId;
      this.categoryRateAnalysisId = categoryId;
      this.costSummaryService.getActiveWorkItemsOfCategory( this.baseUrl, costHeadId, this.categoryId).subscribe(
        workItemsList => this.onGetActiveWorkItemsOfCategorySuccess(workItemsList),
        error => this.onGetActiveWorkItemsOfCategoryFailure(error)
      );
    }

  onGetActiveWorkItemsOfCategorySuccess(workItemsList : any) {
    this.workItemsList = workItemsList.data;
  }

  // calculation of Quantity * Rate
  totalCalculationOfWorkItemsList(workItemsList : any) {
      for(let workItemData of workItemsList) {
        workItemData.amount = this.commonService.calculateAmountOfWorkItem(workItemData.quantity.total, workItemData.rate.total);
      }
      return workItemsList;
  }

  onGetActiveWorkItemsOfCategoryFailure(error : any) {
    console.log('onGetActiveWorkItemsOfCategoryFailure error : '+JSON.stringify(error));
  }


  deleteElement(elementType : string) {
    if(elementType === ProjectElements.QUANTITY_DETAILS) {
      this.child.deleteQuantityDetailsByName();
    }
    if(elementType === ProjectElements.WORK_ITEM) {
      this.deactivateWorkItem();
    }
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

  setCategoriesTotal( categoriesTotal : number) {
    this.categoryDetailsTotalAmount = categoriesTotal;
    this.refreshWorkItemList();
  }

  setShowWorkItemTab( tabName : string) {
    this.showWorkItemTab = tabName;
    this.refreshCategoryList();
  }

  closeRateView() {
    this.showWorkItemTab = null;
    this.displayRateView = null;
  }

  closeQuantityView() {
    this.showQuantityTab = null;
    this.showWorkItemTab = null;
  }
}
