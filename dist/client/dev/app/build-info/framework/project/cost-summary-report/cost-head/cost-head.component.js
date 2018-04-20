"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var constants_1 = require("../../../../../shared/constants");
var index_1 = require("../../../../../shared/index");
var common_service_1 = require("../../../../../shared/services/common.service");
var cost_summary_service_1 = require("../cost-summary.service");
var lodsh = require("lodash");
var quantity_details_1 = require("../../../model/quantity-details");
var loaders_service_1 = require("../../../../../shared/loader/loaders.service");
var quantity_details_component_1 = require("./quantity-details/quantity-details.component");
var CostHeadComponent = (function () {
    function CostHeadComponent(costSummaryService, activatedRoute, _router, messageService, commonService, loaderService) {
        this.costSummaryService = costSummaryService;
        this.activatedRoute = activatedRoute;
        this._router = _router;
        this.messageService = messageService;
        this.commonService = commonService;
        this.loaderService = loaderService;
        this.categoryDetailsTotalAmount = 0;
        this.quantity = 0;
        this.rateFromRateAnalysis = 0;
        this.unit = '';
        this.showCategoryList = false;
        this.deleteConfirmationCategory = constants_1.ProjectElements.CATEGORY;
        this.deleteConfirmationWorkItem = constants_1.ProjectElements.WORK_ITEM;
        this.deleteConfirmationForQuantityDetails = constants_1.ProjectElements.QUANTITY_DETAILS;
        this.updateConfirmationForDirectQuantity = constants_1.ProjectElements.DIRECT_QUANTITY;
        this.showQuantityDetails = false;
        this.showWorkItemList = false;
        this.showWorkItemTab = null;
        this.showQuantityTab = null;
        this.compareWorkItemId = 0;
        this.compareCategoryId = 0;
        this.quantityItemsArray = [];
        this.categoryArray = [];
        this.workItemListArray = [];
        this.categoryListArray = [];
        this.disableRateField = false;
        this.previousRateQuantity = 0;
        this.quantityIncrement = 1;
        this.displayRateView = null;
        this.selectedWorkItemData = [];
    }
    CostHeadComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.params.subscribe(function (params) {
            _this.projectId = params['projectId'];
            _this.viewType = params['viewType'];
            _this.viewTypeValue = params['viewTypeValue'];
            _this.costHeadName = params['costHeadName'];
            _this.costHeadId = parseInt(params['costHeadId']);
            if (_this.viewType === index_1.API.BUILDING) {
                var buildingId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_BUILDING);
                _this.baseUrl = '' + index_1.API.PROJECT + '/' + _this.projectId + '/' + '' + index_1.API.BUILDING + '/' + buildingId;
            }
            else if (_this.viewType === index_1.API.COMMON_AMENITIES) {
                _this.baseUrl = '' + index_1.API.PROJECT + '/' + _this.projectId;
            }
            else {
                console.log('Error');
            }
            index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CURRENT_COST_HEAD_ID, _this.costHeadId);
            index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CURRENT_COST_HEAD_NAME, _this.costHeadName);
            _this.getCategories(_this.projectId, _this.costHeadId);
        });
    };
    CostHeadComponent.prototype.getCategories = function (projectId, costHeadId) {
        var _this = this;
        this.costSummaryService.getCategories(this.baseUrl, costHeadId).subscribe(function (categoryDetails) { return _this.onGetCategoriesSuccess(categoryDetails); }, function (error) { return _this.onGetCategoriesFailure(error); });
    };
    CostHeadComponent.prototype.onGetCategoriesSuccess = function (categoryDetails) {
        this.categoryDetails = categoryDetails.data.categories;
        this.categoryDetailsTotalAmount = categoryDetails.data.categoriesAmount;
        if (this.categoryRateAnalysisId) {
            this.getActiveWorkItemsOfCategory(this.categoryRateAnalysisId);
        }
    };
    CostHeadComponent.prototype.calculateCategoriesTotal = function () {
        this.categoryDetailsTotalAmount = 0.0;
        for (var _i = 0, _a = this.categoryDetails; _i < _a.length; _i++) {
            var categoryData = _a[_i];
            this.categoryDetailsTotalAmount = this.categoryDetailsTotalAmount + categoryData.amount;
        }
        this.loaderService.stop();
    };
    CostHeadComponent.prototype.onGetCategoriesFailure = function (error) {
        console.log(error);
        this.loaderService.stop();
    };
    CostHeadComponent.prototype.ngOnChanges = function (changes) {
        if (changes.categoryListArray.currentValue !== undefined) {
            this.categoryListArray = changes.categoryListArray.currentValue;
        }
    };
    CostHeadComponent.prototype.getQuantity = function (categoryId, workItem, categoryIndex, workItemIndex) {
        if ((workItem.quantity.quantityItemDetails.length > 1) || (workItem.quantity.quantityItemDetails.length === 1 &&
            workItem.quantity.quantityItemDetails[0].name !== constants_1.Label.DEFAULT_VIEW)) {
            this.getDetailedQuantity(categoryId, workItem, categoryIndex, workItemIndex);
        }
        else {
            this.getDefaultQuantity(categoryId, workItem, categoryIndex, workItemIndex);
        }
    };
    CostHeadComponent.prototype.getDetailedQuantity = function (categoryId, workItem, categoryIndex, workItemIndex) {
        if (this.showQuantityTab !== constants_1.Label.WORKITEM_DETAILED_QUANTITY_TAB ||
            this.compareCategoryId !== categoryId || this.compareWorkItemId !== workItem.rateAnalysisId) {
            this.setItemId(categoryId, workItem.rateAnalysisId);
            this.workItemId = workItem.rateAnalysisId;
            index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CURRENT_WORKITEM_ID, this.workItemId);
            var quantityDetails = workItem.quantity.quantityItemDetails;
            this.workItem = workItem;
            this.workItem.quantity.quantityItemDetails = [];
            for (var _i = 0, quantityDetails_1 = quantityDetails; _i < quantityDetails_1.length; _i++) {
                var quantityDetail = quantityDetails_1[_i];
                if (quantityDetail.name !== this.getLabel().DEFAULT_VIEW) {
                    this.workItem.quantity.quantityItemDetails.push(quantityDetail);
                }
            }
            this.currentCategoryIndex = categoryIndex;
            this.currentWorkItemIndex = workItemIndex;
            this.showQuantityTab = constants_1.Label.WORKITEM_DETAILED_QUANTITY_TAB;
        }
        else {
            this.showWorkItemTab = null;
        }
    };
    CostHeadComponent.prototype.addNewDetailedQuantity = function (categoryId, workItem, categoryIndex, workItemIndex) {
        this.showWorkItemTab = constants_1.Label.WORKITEM_DETAILED_QUANTITY_TAB;
        this.getDetailedQuantity(categoryId, workItem, categoryIndex, workItemIndex);
        var quantityDetail = new quantity_details_1.QuantityDetails();
        this.workItem.quantity.quantityItemDetails.push(quantityDetail);
        this.showHideQuantityDetails(categoryId, workItemIndex);
    };
    CostHeadComponent.prototype.showHideQuantityDetails = function (categoryId, workItemIndex) {
        if (this.compareWorkItemId === this.workItem.rateAnalysisId && this.compareCategoryId === categoryId) {
            this.showQuantityDetails = true;
        }
        else {
            this.showQuantityDetails = false;
        }
    };
    CostHeadComponent.prototype.getDefaultQuantity = function (categoryId, workItem, categoryIndex, workItemIndex) {
        if (this.showWorkItemTab !== constants_1.Label.WORKITEM_QUANTITY_TAB || this.compareCategoryId !== categoryId ||
            this.compareWorkItemId !== workItem.rateAnalysisId) {
            this.setItemId(categoryId, workItem.rateAnalysisId);
            this.workItemId = workItem.rateAnalysisId;
            index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CURRENT_WORKITEM_ID, this.workItemId);
            this.workItem = workItem;
            var quantityDetails = workItem.quantity.quantityItemDetails;
            if (quantityDetails.length !== 0) {
                this.workItem.quantity.quantityItemDetails = [];
                var defaultQuantityDetail = quantityDetails.filter(function (defaultQuantityDetail) {
                    return defaultQuantityDetail.name === constants_1.Label.DEFAULT_VIEW;
                });
                this.workItem.quantity.quantityItemDetails = defaultQuantityDetail;
                this.quantityItemsArray = lodsh.cloneDeep(defaultQuantityDetail[0].quantityItems);
                this.keyQuantity = defaultQuantityDetail[0].name;
            }
            else {
                var quantityDetail = new quantity_details_1.QuantityDetails();
                quantityDetail.quantityItems = [];
                quantityDetail.name = this.getLabel().DEFAULT_VIEW;
                this.workItem.quantity.quantityItemDetails.push(quantityDetail);
                this.quantityItemsArray = [];
                this.keyQuantity = this.getLabel().DEFAULT_VIEW;
            }
            this.currentCategoryIndex = categoryIndex;
            this.currentWorkItemIndex = workItemIndex;
            this.showWorkItemTab = constants_1.Label.WORKITEM_QUANTITY_TAB;
        }
        else {
            this.showWorkItemTab = null;
        }
    };
    CostHeadComponent.prototype.getRate = function (displayRateView, categoryId, workItemId, workItem, disableRateField, categoryIndex, workItemIndex) {
        if (this.showWorkItemTab !== constants_1.Label.WORKITEM_RATE_TAB || this.displayRateView !== displayRateView ||
            this.compareCategoryId !== categoryId || this.compareWorkItemId !== workItemId) {
            this.setItemId(categoryId, workItemId);
            this.setWorkItemDataForRateView(workItem.rateAnalysisId, workItem.rate);
            this.currentCategoryIndex = categoryIndex;
            this.currentWorkItemIndex = workItemIndex;
            this.rateView = constants_1.Label.WORKITEM_RATE_TAB;
            this.setRateFlags(displayRateView, disableRateField);
        }
        else {
            this.showWorkItemTab = null;
            this.displayRateView = null;
        }
    };
    CostHeadComponent.prototype.getRateByQuantity = function (displayRateView, categoryId, workItemId, workItem, disableRateField, categoryIndex, workItemIndex) {
        if (this.showWorkItemTab !== constants_1.Label.WORKITEM_RATE_TAB || this.displayRateView !== displayRateView ||
            this.compareCategoryId !== categoryId || this.compareWorkItemId !== workItemId) {
            this.setItemId(categoryId, workItemId);
            this.setWorkItemDataForRateView(workItem.rateAnalysisId, workItem.rate);
            this.calculateQuantity(workItem);
            this.setRateFlags(displayRateView, disableRateField);
            this.rateView = constants_1.Label.WORKITEM_RATE_BY_QUANTITY_TAB;
            this.currentCategoryIndex = categoryIndex;
            this.currentWorkItemIndex = workItemIndex;
        }
        else {
            this.showWorkItemTab = null;
            this.displayRateView = null;
        }
    };
    CostHeadComponent.prototype.getSystemRate = function (displayRateView, categoryId, workItemId, workItem, disableRateField, categoryIndex, workItemIndex) {
        if (this.showWorkItemTab !== constants_1.Label.WORKITEM_RATE_TAB || this.displayRateView !== displayRateView ||
            this.compareCategoryId !== categoryId || this.compareWorkItemId !== workItemId) {
            this.setItemId(categoryId, workItemId);
            this.setWorkItemDataForRateView(workItem.rateAnalysisId, workItem.systemRate);
            this.rateView = constants_1.Label.WORKITEM_SYSTEM_RATE_TAB;
            this.currentCategoryIndex = categoryIndex;
            this.currentWorkItemIndex = workItemIndex;
            this.setRateFlags(displayRateView, disableRateField);
        }
        else {
            this.showWorkItemTab = null;
            this.displayRateView = null;
        }
    };
    CostHeadComponent.prototype.setItemId = function (categoryId, workItemId) {
        this.compareCategoryId = categoryId;
        this.compareWorkItemId = workItemId;
    };
    CostHeadComponent.prototype.closeDetailedQuantityTab = function () {
        this.showQuantityTab = null;
    };
    CostHeadComponent.prototype.closeQuantityTab = function () {
        this.showWorkItemTab = null;
    };
    CostHeadComponent.prototype.setRateFlags = function (displayRateView, disableRateField) {
        this.displayRateView = displayRateView;
        this.disableRateField = disableRateField;
        this.showWorkItemTab = constants_1.Label.WORKITEM_RATE_TAB;
    };
    CostHeadComponent.prototype.setWorkItemDataForRateView = function (workItemId, rate) {
        this.workItemId = workItemId;
        this.rateItemsArray = lodsh.cloneDeep(rate);
        this.unit = lodsh.cloneDeep(rate.unit);
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CURRENT_WORKITEM_ID, this.workItemId);
    };
    CostHeadComponent.prototype.calculateQuantity = function (workItem) {
        this.previousRateQuantity = lodsh.cloneDeep(workItem.rate.quantity);
        this.rateItemsArray.quantity = lodsh.cloneDeep(workItem.quantity.total);
        this.quantityIncrement = this.rateItemsArray.quantity / this.previousRateQuantity;
        for (var rateItemsIndex = 0; rateItemsIndex < this.rateItemsArray.rateItems.length; rateItemsIndex++) {
            this.rateItemsArray.rateItems[rateItemsIndex].quantity = parseFloat((this.rateItemsArray.rateItems[rateItemsIndex].quantity *
                this.quantityIncrement).toFixed(constants_1.ValueConstant.NUMBER_OF_FRACTION_DIGIT));
        }
    };
    CostHeadComponent.prototype.setIdsForDeleteWorkItem = function (categoryId, workItemId, workItemIndex) {
        this.categoryId = parseInt(categoryId);
        this.workItemId = parseInt(workItemId);
        this.compareWorkItemId = workItemIndex;
    };
    CostHeadComponent.prototype.deactivateWorkItem = function () {
        var _this = this;
        this.loaderService.start();
        var costHeadId = parseInt(index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_COST_HEAD_ID));
        this.costSummaryService.deactivateWorkItem(this.baseUrl, costHeadId, this.categoryId, this.workItemId).subscribe(function (success) { return _this.onDeActivateWorkItemSuccess(success); }, function (error) { return _this.onDeActivateWorkItemFailure(error); });
    };
    CostHeadComponent.prototype.onDeActivateWorkItemSuccess = function (success) {
        this.showWorkItemList = false;
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = constants_1.Messages.MSG_SUCCESS_DELETE_WORKITEM;
        this.messageService.message(message);
        this.workItemsList.splice(this.compareWorkItemId, 1);
        this.categoryDetailsTotalAmount = this.commonService.totalCalculationOfCategories(this.categoryDetails, this.categoryRateAnalysisId, this.workItemsList);
        this.loaderService.stop();
    };
    CostHeadComponent.prototype.onDeActivateWorkItemFailure = function (error) {
        console.log('InActive WorkItem error : ' + JSON.stringify(error));
        this.loaderService.stop();
    };
    CostHeadComponent.prototype.getInActiveWorkItems = function (categoryId, categoryIndex) {
        var _this = this;
        this.compareWorkItemRateAnalysisId = categoryIndex;
        this.categoryRateAnalysisId = categoryId;
        this.costSummaryService.getInActiveWorkItems(this.baseUrl, this.costHeadId, categoryId).subscribe(function (workItemList) { return _this.onGetInActiveWorkItemsSuccess(workItemList); }, function (error) { return _this.onGetInActiveWorkItemsFailure(error); });
    };
    CostHeadComponent.prototype.onGetInActiveWorkItemsSuccess = function (workItemList) {
        if (workItemList.data.length !== 0) {
            this.workItemListArray = workItemList.data;
            this.showWorkItemList = true;
        }
        else {
            var message = new index_1.Message();
            message.isError = false;
            message.custom_message = constants_1.Messages.MSG_ALREADY_ADDED_ALL_WORKITEMS;
            this.messageService.message(message);
        }
    };
    CostHeadComponent.prototype.onGetInActiveWorkItemsFailure = function (error) {
        console.log('Get WorkItemList error : ' + error);
    };
    CostHeadComponent.prototype.onChangeActivateSelectedWorkItem = function (selectedWorkItem) {
        var _this = this;
        this.loaderService.start();
        this.showWorkItemList = false;
        var workItemList = this.workItemListArray;
        var workItemObject = workItemList.filter(function (workItemObj) {
            return workItemObj.name === selectedWorkItem;
        });
        this.selectedWorkItemData[0] = workItemObject[0];
        var categoryId = this.categoryRateAnalysisId;
        this.costSummaryService.activateWorkItem(this.baseUrl, this.costHeadId, categoryId, workItemObject[0].rateAnalysisId).subscribe(function (success) { return _this.onActivateWorkItemSuccess(success); }, function (error) { return _this.onActivateWorkItemFailure(error); });
    };
    CostHeadComponent.prototype.onActivateWorkItemSuccess = function (success) {
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = constants_1.Messages.MSG_SUCCESS_ADD_WORKITEM;
        this.messageService.message(message);
        this.workItemsList = this.workItemsList.concat(this.totalCalculationOfWorkItemsList(this.selectedWorkItemData));
        this.categoryDetailsTotalAmount = this.commonService.totalCalculationOfCategories(this.categoryDetails, this.categoryRateAnalysisId, this.workItemsList);
        this.loaderService.stop();
    };
    CostHeadComponent.prototype.onActivateWorkItemFailure = function (error) {
        console.log('Active WorkItem error : ' + error);
        this.loaderService.stop();
    };
    CostHeadComponent.prototype.setCategoryIdForDeactivate = function (categoryId) {
        this.categoryIdForInActive = categoryId;
    };
    CostHeadComponent.prototype.setDirectQuantity = function (categoryId, workItemId, directQuantity) {
        this.categoryId = categoryId;
        this.workItemId = workItemId;
        this.directQuantity = directQuantity;
    };
    CostHeadComponent.prototype.displayModal = function () {
        $('#updateDirectQuantity').modal('show');
    };
    CostHeadComponent.prototype.changeDirectQuantity = function () {
        var _this = this;
        if (this.directQuantity !== null || this.directQuantity !== 0) {
            this.loaderService.start();
            this.costSummaryService.updateDirectQuantityAmount(this.baseUrl, this.costHeadId, this.categoryId, this.workItemId, this.directQuantity).subscribe(function (workItemList) { return _this.onChangeDirectQuantitySuccess(workItemList); }, function (error) { return _this.onChangeDirectQuantityFailure(error); });
        }
    };
    CostHeadComponent.prototype.onChangeDirectQuantitySuccess = function (success) {
        console.log('success : ' + JSON.stringify(success));
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = constants_1.Messages.MSG_SUCCESS_UPDATE_DIRECT_QUANTITY_OF_WORKITEM;
        this.messageService.message(message);
        this.refreshCategoryList();
        this.loaderService.stop();
    };
    CostHeadComponent.prototype.onChangeDirectQuantityFailure = function (error) {
        console.log('error : ' + JSON.stringify(error));
        this.loaderService.stop();
    };
    CostHeadComponent.prototype.changeDirectRate = function (categoryId, workItemId, directRate) {
        var _this = this;
        if (directRate !== null || directRate !== 0) {
            this.loaderService.start();
            this.costSummaryService.updateDirectRate(this.baseUrl, this.costHeadId, categoryId, workItemId, directRate).subscribe(function (success) { return _this.onUpdateDirectRateSuccess(success); }, function (error) { return _this.onUpdateDirectRateFailure(error); });
        }
    };
    CostHeadComponent.prototype.onUpdateDirectRateSuccess = function (success) {
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = constants_1.Messages.MSG_SUCCESS_UPDATE_DIRECT_RATE_OF_WORKITEM;
        this.messageService.message(message);
        this.refreshWorkItemList();
        this.loaderService.stop();
    };
    CostHeadComponent.prototype.onUpdateDirectRateFailure = function (error) {
        this.loaderService.stop();
    };
    CostHeadComponent.prototype.refreshCategoryList = function () {
        this.getCategories(this.projectId, this.costHeadId);
    };
    CostHeadComponent.prototype.refreshWorkItemList = function () {
    };
    CostHeadComponent.prototype.getActiveWorkItemsOfCategory = function (categoryId) {
        var _this = this;
        var costHeadId = parseInt(index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_COST_HEAD_ID));
        this.categoryId = categoryId;
        this.categoryRateAnalysisId = categoryId;
        this.costSummaryService.getActiveWorkItemsOfCategory(this.baseUrl, costHeadId, this.categoryId).subscribe(function (workItemsList) { return _this.onGetActiveWorkItemsOfCategorySuccess(workItemsList); }, function (error) { return _this.onGetActiveWorkItemsOfCategoryFailure(error); });
    };
    CostHeadComponent.prototype.onGetActiveWorkItemsOfCategorySuccess = function (workItemsList) {
        this.workItemsList = workItemsList.data;
    };
    CostHeadComponent.prototype.totalCalculationOfWorkItemsList = function (workItemsList) {
        for (var _i = 0, workItemsList_1 = workItemsList; _i < workItemsList_1.length; _i++) {
            var workItemData = workItemsList_1[_i];
            workItemData.amount = this.commonService.calculateAmountOfWorkItem(workItemData.quantity.total, workItemData.rate.total);
        }
        return workItemsList;
    };
    CostHeadComponent.prototype.onGetActiveWorkItemsOfCategoryFailure = function (error) {
        console.log('onGetActiveWorkItemsOfCategoryFailure error : ' + JSON.stringify(error));
    };
    CostHeadComponent.prototype.deleteElement = function (elementType) {
        if (elementType === constants_1.ProjectElements.QUANTITY_DETAILS) {
            this.child.deleteQuantityDetailsByName();
        }
        if (elementType === constants_1.ProjectElements.WORK_ITEM) {
            this.deactivateWorkItem();
        }
    };
    CostHeadComponent.prototype.updateElement = function (elementType) {
        if (elementType === constants_1.ProjectElements.DIRECT_QUANTITY) {
            this.changeDirectQuantity();
        }
    };
    CostHeadComponent.prototype.goBack = function () {
        var projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
        this._router.navigate([constants_1.NavigationRoutes.APP_PROJECT, projectId, constants_1.NavigationRoutes.APP_COST_SUMMARY]);
    };
    CostHeadComponent.prototype.getTableHeadings = function () {
        return constants_1.TableHeadings;
    };
    CostHeadComponent.prototype.getButton = function () {
        return constants_1.Button;
    };
    CostHeadComponent.prototype.getLabel = function () {
        return constants_1.Label;
    };
    CostHeadComponent.prototype.setCategoriesTotal = function (categoriesTotal) {
        this.categoryDetailsTotalAmount = categoriesTotal;
        this.refreshCategoryList();
    };
    CostHeadComponent.prototype.setShowWorkItemTab = function (tabName) {
    };
    CostHeadComponent.prototype.closeRateView = function () {
        this.showWorkItemTab = null;
        this.displayRateView = null;
    };
    CostHeadComponent.prototype.closeQuantityView = function () {
        this.showQuantityTab = null;
        this.showWorkItemTab = null;
    };
    __decorate([
        core_1.ViewChild(quantity_details_component_1.QuantityDetailsComponent),
        __metadata("design:type", quantity_details_component_1.QuantityDetailsComponent)
    ], CostHeadComponent.prototype, "child", void 0);
    CostHeadComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-cost-head',
            styleUrls: ['cost-head.component.css'],
            templateUrl: 'cost-head.component.html'
        }),
        __metadata("design:paramtypes", [cost_summary_service_1.CostSummaryService, router_1.ActivatedRoute,
            router_1.Router, index_1.MessageService, common_service_1.CommonService,
            loaders_service_1.LoaderService])
    ], CostHeadComponent);
    return CostHeadComponent;
}());
exports.CostHeadComponent = CostHeadComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1oZWFkL2Nvc3QtaGVhZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBd0U7QUFDeEUsMENBQXlEO0FBQ3pELDZEQUEySTtBQUMzSSxxREFBaUg7QUFFakgsZ0ZBQThFO0FBQzlFLGdFQUE2RDtBQUM3RCw4QkFBZ0M7QUFJaEMsb0VBQWtFO0FBQ2xFLGdGQUE2RTtBQUM3RSw0RkFBeUY7QUFZekY7SUFxREUsMkJBQW9CLGtCQUF1QyxFQUFVLGNBQStCLEVBQ2hGLE9BQWUsRUFBVSxjQUE4QixFQUFVLGFBQTZCLEVBQzlGLGFBQTRCO1FBRjVCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBcUI7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBaUI7UUFDaEYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFnQjtRQUM5RixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQXhDaEQsK0JBQTBCLEdBQVMsQ0FBQyxDQUFDO1FBSXJDLGFBQVEsR0FBUSxDQUFDLENBQUM7UUFDbEIseUJBQW9CLEdBQVEsQ0FBQyxDQUFDO1FBQzlCLFNBQUksR0FBUSxFQUFFLENBQUM7UUFDZixxQkFBZ0IsR0FBWSxLQUFLLENBQUM7UUFFbEMsK0JBQTBCLEdBQUcsMkJBQWUsQ0FBQyxRQUFRLENBQUM7UUFDdEQsK0JBQTBCLEdBQUcsMkJBQWUsQ0FBQyxTQUFTLENBQUM7UUFDdkQseUNBQW9DLEdBQUcsMkJBQWUsQ0FBQyxnQkFBZ0IsQ0FBQztRQUN4RSx3Q0FBbUMsR0FBRywyQkFBZSxDQUFDLGVBQWUsQ0FBQztRQUMvRCx3QkFBbUIsR0FBUyxLQUFLLENBQUM7UUFDakMscUJBQWdCLEdBQVMsS0FBSyxDQUFDO1FBQy9CLG9CQUFlLEdBQVksSUFBSSxDQUFD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LEFBbWpCQyxJQUFBO0FBbmpCWSw4Q0FBaUIiLCJmaWxlIjoiYXBwL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvY29zdC1zdW1tYXJ5LXJlcG9ydC9jb3N0LWhlYWQvY29zdC1oZWFkLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBPbkNoYW5nZXMsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgTWVzc2FnZXMsIFByb2plY3RFbGVtZW50cywgTmF2aWdhdGlvblJvdXRlcywgVGFibGVIZWFkaW5ncywgQnV0dG9uLCBMYWJlbCwgVmFsdWVDb25zdGFudCB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBBUEksU2Vzc2lvblN0b3JhZ2UsIFNlc3Npb25TdG9yYWdlU2VydmljZSwgTWVzc2FnZSwgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zaGFyZWQvaW5kZXgnO1xyXG5pbXBvcnQgeyBSYXRlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWwvcmF0ZSc7XHJcbmltcG9ydCB7IENvbW1vblNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zaGFyZWQvc2VydmljZXMvY29tbW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb3N0U3VtbWFyeVNlcnZpY2UgfSBmcm9tICcuLi9jb3N0LXN1bW1hcnkuc2VydmljZSc7XHJcbmltcG9ydCAqIGFzIGxvZHNoIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IENhdGVnb3J5IH0gZnJvbSAnLi4vLi4vLi4vbW9kZWwvY2F0ZWdvcnknO1xyXG5pbXBvcnQgeyBXb3JrSXRlbSB9IGZyb20gJy4uLy4uLy4uL21vZGVsL3dvcmstaXRlbSc7XHJcbmltcG9ydCB7IFF1YW50aXR5SXRlbSB9IGZyb20gJy4uLy4uLy4uL21vZGVsL3F1YW50aXR5LWl0ZW0nO1xyXG5pbXBvcnQgeyBRdWFudGl0eURldGFpbHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbC9xdWFudGl0eS1kZXRhaWxzJztcclxuaW1wb3J0IHsgTG9hZGVyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9sb2FkZXIvbG9hZGVycy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUXVhbnRpdHlEZXRhaWxzQ29tcG9uZW50IH0gZnJvbSAnLi9xdWFudGl0eS1kZXRhaWxzL3F1YW50aXR5LWRldGFpbHMuY29tcG9uZW50JztcclxuaW1wb3J0IHsgUmF0ZUl0ZW0gfSBmcm9tICcuLi8uLi8uLi9tb2RlbC9yYXRlLWl0ZW0nO1xyXG5cclxuZGVjbGFyZSB2YXIgJDogYW55O1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICBzZWxlY3RvcjogJ2JpLWNvc3QtaGVhZCcsXHJcbiAgc3R5bGVVcmxzOiBbJ2Nvc3QtaGVhZC5jb21wb25lbnQuY3NzJ10sXHJcbiAgdGVtcGxhdGVVcmw6ICdjb3N0LWhlYWQuY29tcG9uZW50Lmh0bWwnXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgQ29zdEhlYWRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XHJcblxyXG4gIEBWaWV3Q2hpbGQoUXVhbnRpdHlEZXRhaWxzQ29tcG9uZW50KSBjaGlsZDogUXVhbnRpdHlEZXRhaWxzQ29tcG9uZW50O1xyXG5cclxuICBwcm9qZWN0SWQgOiBzdHJpbmc7XHJcbiAgdmlld1R5cGVWYWx1ZTogc3RyaW5nO1xyXG4gIGJhc2VVcmw6c3RyaW5nO1xyXG4gIHZpZXdUeXBlOnN0cmluZztcclxuICBrZXlRdWFudGl0eTpzdHJpbmc7XHJcbiAgY29zdEhlYWROYW1lOiBzdHJpbmc7XHJcbiAgY29zdEhlYWRJZDpudW1iZXI7XHJcbiAgd29ya0l0ZW1JZDogbnVtYmVyO1xyXG4gIGNhdGVnb3J5SWQ6IG51bWJlcjtcclxuICBkaXJlY3RRdWFudGl0eTogbnVtYmVyO1xyXG4gIGNhdGVnb3J5RGV0YWlsczogQXJyYXk8Q2F0ZWdvcnk+O1xyXG4gIGNhdGVnb3J5RGV0YWlsc1RvdGFsQW1vdW50OiBudW1iZXI9MDtcclxuICB3b3JrSXRlbTogV29ya0l0ZW07XHJcbiAgY2F0ZWdvcnlSYXRlQW5hbHlzaXNJZDpudW1iZXI7XHJcbiAgY29tcGFyZVdvcmtJdGVtUmF0ZUFuYWx5c2lzSWQ6bnVtYmVyO1xyXG4gIHF1YW50aXR5Om51bWJlcj0wO1xyXG4gIHJhdGVGcm9tUmF0ZUFuYWx5c2lzOm51bWJlcj0wO1xyXG4gIHVuaXQ6c3RyaW5nPScnO1xyXG4gIHNob3dDYXRlZ29yeUxpc3Q6IGJvb2xlYW4gPSBmYWxzZTtcclxuICB3b3JrSXRlbXNMaXN0OiBBcnJheTxXb3JrSXRlbT47XHJcbiAgZGVsZXRlQ29uZmlybWF0aW9uQ2F0ZWdvcnkgPSBQcm9qZWN0RWxlbWVudHMuQ0FURUdPUlk7XHJcbiAgZGVsZXRlQ29uZmlybWF0aW9uV29ya0l0ZW0gPSBQcm9qZWN0RWxlbWVudHMuV09SS19JVEVNO1xyXG4gIGRlbGV0ZUNvbmZpcm1hdGlvbkZvclF1YW50aXR5RGV0YWlscyA9IFByb2plY3RFbGVtZW50cy5RVUFOVElUWV9ERVRBSUxTO1xyXG4gIHVwZGF0ZUNvbmZpcm1hdGlvbkZvckRpcmVjdFF1YW50aXR5ID0gUHJvamVjdEVsZW1lbnRzLkRJUkVDVF9RVUFOVElUWTtcclxuICBwdWJsaWMgc2hvd1F1YW50aXR5RGV0YWlsczpib29sZWFuPWZhbHNlO1xyXG4gIHByaXZhdGUgc2hvd1dvcmtJdGVtTGlzdDpib29sZWFuPWZhbHNlO1xyXG4gIHByaXZhdGUgc2hvd1dvcmtJdGVtVGFiIDogc3RyaW5nID0gbnVsbDtcclxuICBwcml2YXRlIHNob3dRdWFudGl0eVRhYiA6IHN0cmluZyA9IG51bGw7XHJcbiAgcHJpdmF0ZSBjb21wYXJlV29ya0l0ZW1JZDpudW1iZXI9MDtcclxuICBwcml2YXRlIGNvbXBhcmVDYXRlZ29yeUlkOm51bWJlcj0wO1xyXG4gIHByaXZhdGUgcXVhbnRpdHlJdGVtc0FycmF5OiBBcnJheTxRdWFudGl0eUl0ZW0+ID0gW107XHJcbiAgcHJpdmF0ZSByYXRlSXRlbXNBcnJheTogUmF0ZTtcclxuICBwcml2YXRlIGNhdGVnb3J5QXJyYXkgOiBBcnJheTxDYXRlZ29yeT4gPSBbXTtcclxuXHJcbiAgcHJpdmF0ZSB3b3JrSXRlbUxpc3RBcnJheTogQXJyYXk8V29ya0l0ZW0+ID0gW107XHJcbiAgcHJpdmF0ZSBjYXRlZ29yeUxpc3RBcnJheSA6IEFycmF5PENhdGVnb3J5PiA9IFtdO1xyXG4gIHByaXZhdGUgY2F0ZWdvcnlJZEZvckluQWN0aXZlOiBudW1iZXI7XHJcbiAgcHJpdmF0ZSBjdXJyZW50Q2F0ZWdvcnlJbmRleDogbnVtYmVyO1xyXG4gIHByaXZhdGUgY3VycmVudFdvcmtJdGVtSW5kZXg6IG51bWJlcjtcclxuXHJcbiAgcHJpdmF0ZSBkaXNhYmxlUmF0ZUZpZWxkOmJvb2xlYW4gPSBmYWxzZTtcclxuICBwcml2YXRlIHJhdGVWaWV3IDogc3RyaW5nO1xyXG4gIHByaXZhdGUgcHJldmlvdXNSYXRlUXVhbnRpdHk6bnVtYmVyID0gMDtcclxuICBwcml2YXRlIHF1YW50aXR5SW5jcmVtZW50Om51bWJlciA9IDE7XHJcbiAgcHJpdmF0ZSBkaXNwbGF5UmF0ZVZpZXc6IHN0cmluZyA9IG51bGw7XHJcblxyXG4gIHByaXZhdGUgc2VsZWN0ZWRXb3JrSXRlbURhdGEgOiBBcnJheTxXb3JrSXRlbT4gPSBbXTtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29zdFN1bW1hcnlTZXJ2aWNlIDogQ29zdFN1bW1hcnlTZXJ2aWNlLCBwcml2YXRlIGFjdGl2YXRlZFJvdXRlIDogQWN0aXZhdGVkUm91dGUsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlLCBwcml2YXRlIGNvbW1vblNlcnZpY2UgOiBDb21tb25TZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgbG9hZGVyU2VydmljZTogTG9hZGVyU2VydmljZSkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLmFjdGl2YXRlZFJvdXRlLnBhcmFtcy5zdWJzY3JpYmUocGFyYW1zID0+IHtcclxuXHJcbiAgICAgIHRoaXMucHJvamVjdElkID0gcGFyYW1zWydwcm9qZWN0SWQnXTtcclxuICAgICAgdGhpcy52aWV3VHlwZSA9IHBhcmFtc1sndmlld1R5cGUnXTtcclxuICAgICAgdGhpcy52aWV3VHlwZVZhbHVlID0gcGFyYW1zWyd2aWV3VHlwZVZhbHVlJ107XHJcbiAgICAgIHRoaXMuY29zdEhlYWROYW1lID0gcGFyYW1zWydjb3N0SGVhZE5hbWUnXTtcclxuICAgICAgdGhpcy5jb3N0SGVhZElkID0gcGFyc2VJbnQocGFyYW1zWydjb3N0SGVhZElkJ10pO1xyXG5cclxuXHJcbiAgICAgIGlmKHRoaXMudmlld1R5cGUgPT09ICBBUEkuQlVJTERJTkcgKSB7XHJcbiAgICAgICAgbGV0IGJ1aWxkaW5nSWQgPSBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfQlVJTERJTkcpO1xyXG4gICAgICAgIHRoaXMuYmFzZVVybCA9ICcnICtBUEkuUFJPSkVDVCArICcvJyArIHRoaXMucHJvamVjdElkICsgJy8nICsgJycgKyAgQVBJLkJVSUxESU5HKyAnLycgKyBidWlsZGluZ0lkO1xyXG4gICAgICB9IGVsc2UgaWYodGhpcy52aWV3VHlwZSA9PT0gQVBJLkNPTU1PTl9BTUVOSVRJRVMpIHtcclxuICAgICAgICB0aGlzLmJhc2VVcmwgPSAnJyArQVBJLlBST0pFQ1QgKyAnLycgKyB0aGlzLnByb2plY3RJZDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnRXJyb3InKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX0NPU1RfSEVBRF9JRCwgdGhpcy5jb3N0SGVhZElkKTtcclxuICAgICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX0NPU1RfSEVBRF9OQU1FLCB0aGlzLmNvc3RIZWFkTmFtZSk7XHJcbiAgICAgIHRoaXMuZ2V0Q2F0ZWdvcmllcyggdGhpcy5wcm9qZWN0SWQsIHRoaXMuY29zdEhlYWRJZCk7XHJcblxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRDYXRlZ29yaWVzKHByb2plY3RJZDogc3RyaW5nLCBjb3N0SGVhZElkOiBudW1iZXIpIHtcclxuXHJcbiAgICB0aGlzLmNvc3RTdW1tYXJ5U2VydmljZS5nZXRDYXRlZ29yaWVzKHRoaXMuYmFzZVVybCwgY29zdEhlYWRJZCkuc3Vic2NyaWJlKFxyXG4gICAgICBjYXRlZ29yeURldGFpbHMgPT4gdGhpcy5vbkdldENhdGVnb3JpZXNTdWNjZXNzKGNhdGVnb3J5RGV0YWlscyksXHJcbiAgICAgIGVycm9yID0+IHRoaXMub25HZXRDYXRlZ29yaWVzRmFpbHVyZShlcnJvcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkdldENhdGVnb3JpZXNTdWNjZXNzKGNhdGVnb3J5RGV0YWlsczogYW55KSB7XHJcbiAgICB0aGlzLmNhdGVnb3J5RGV0YWlscyA9IGNhdGVnb3J5RGV0YWlscy5kYXRhLmNhdGVnb3JpZXM7XHJcbiAgICB0aGlzLmNhdGVnb3J5RGV0YWlsc1RvdGFsQW1vdW50ID0gY2F0ZWdvcnlEZXRhaWxzLmRhdGEuY2F0ZWdvcmllc0Ftb3VudDtcclxuICAgIGlmKHRoaXMuY2F0ZWdvcnlSYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICB0aGlzLmdldEFjdGl2ZVdvcmtJdGVtc09mQ2F0ZWdvcnkodGhpcy5jYXRlZ29yeVJhdGVBbmFseXNpc0lkKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNhbGN1bGF0ZUNhdGVnb3JpZXNUb3RhbCgpIHtcclxuXHJcbiAgICB0aGlzLmNhdGVnb3J5RGV0YWlsc1RvdGFsQW1vdW50ID0gMC4wO1xyXG5cclxuICAgIGZvciAobGV0IGNhdGVnb3J5RGF0YSBvZiB0aGlzLmNhdGVnb3J5RGV0YWlscykge1xyXG4gICAgICB0aGlzLmNhdGVnb3J5RGV0YWlsc1RvdGFsQW1vdW50ID10aGlzLmNhdGVnb3J5RGV0YWlsc1RvdGFsQW1vdW50ICsgY2F0ZWdvcnlEYXRhLmFtb3VudDtcclxuICAgIH1cclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdG9wKCk7XHJcbiAgfVxyXG5cclxuICBvbkdldENhdGVnb3JpZXNGYWlsdXJlKGVycm9yOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdG9wKCk7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBhbnkpIHtcclxuICAgIGlmIChjaGFuZ2VzLmNhdGVnb3J5TGlzdEFycmF5LmN1cnJlbnRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuY2F0ZWdvcnlMaXN0QXJyYXkgPSBjaGFuZ2VzLmNhdGVnb3J5TGlzdEFycmF5LmN1cnJlbnRWYWx1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldFF1YW50aXR5KGNhdGVnb3J5SWQ6IG51bWJlciwgd29ya0l0ZW06IFdvcmtJdGVtLCBjYXRlZ29yeUluZGV4OiBudW1iZXIsIHdvcmtJdGVtSW5kZXg6bnVtYmVyKSB7XHJcbiAgICAgIGlmICgod29ya0l0ZW0ucXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscy5sZW5ndGggPiAxKSB8fCAod29ya0l0ZW0ucXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscy5sZW5ndGggPT09IDEgJiZcclxuICAgICAgICAgIHdvcmtJdGVtLnF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHNbMF0ubmFtZSAhPT0gTGFiZWwuREVGQVVMVF9WSUVXKSkge1xyXG4gICAgICAgIHRoaXMuZ2V0RGV0YWlsZWRRdWFudGl0eShjYXRlZ29yeUlkLCB3b3JrSXRlbSwgY2F0ZWdvcnlJbmRleCwgd29ya0l0ZW1JbmRleCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5nZXREZWZhdWx0UXVhbnRpdHkoY2F0ZWdvcnlJZCwgd29ya0l0ZW0sIGNhdGVnb3J5SW5kZXgsIHdvcmtJdGVtSW5kZXgpO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICAvL0dldCBkZXRhaWxlZCBxdWFudGl0eVxyXG4gIGdldERldGFpbGVkUXVhbnRpdHkoY2F0ZWdvcnlJZDogbnVtYmVyLCB3b3JrSXRlbTogV29ya0l0ZW0sIGNhdGVnb3J5SW5kZXg6IG51bWJlciwgd29ya0l0ZW1JbmRleDpudW1iZXIpIHtcclxuICAgIGlmKCB0aGlzLnNob3dRdWFudGl0eVRhYiAhPT0gTGFiZWwuV09SS0lURU1fREVUQUlMRURfUVVBTlRJVFlfVEFCIHx8XHJcbiAgICAgIHRoaXMuY29tcGFyZUNhdGVnb3J5SWQgIT09IGNhdGVnb3J5SWQgfHwgdGhpcy5jb21wYXJlV29ya0l0ZW1JZCAhPT0gd29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQpIHtcclxuXHJcbiAgICAgIHRoaXMuc2V0SXRlbUlkKGNhdGVnb3J5SWQsIHdvcmtJdGVtLnJhdGVBbmFseXNpc0lkKTtcclxuXHJcbiAgICAgIHRoaXMud29ya0l0ZW1JZCA9IHdvcmtJdGVtLnJhdGVBbmFseXNpc0lkO1xyXG4gICAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfV09SS0lURU1fSUQsIHRoaXMud29ya0l0ZW1JZCk7XHJcblxyXG4gICAgICBsZXQgcXVhbnRpdHlEZXRhaWxzOiBBcnJheTxRdWFudGl0eURldGFpbHM+ID0gd29ya0l0ZW0ucXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscztcclxuICAgICAgdGhpcy53b3JrSXRlbSA9IHdvcmtJdGVtO1xyXG4gICAgICB0aGlzLndvcmtJdGVtLnF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMgPSBbXTtcclxuICAgICAgZm9yKGxldCBxdWFudGl0eURldGFpbCBvZiBxdWFudGl0eURldGFpbHMpIHtcclxuICAgICAgICBpZihxdWFudGl0eURldGFpbC5uYW1lICE9PSB0aGlzLmdldExhYmVsKCkuREVGQVVMVF9WSUVXKSB7XHJcbiAgICAgICAgICB0aGlzLndvcmtJdGVtLnF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMucHVzaChxdWFudGl0eURldGFpbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmN1cnJlbnRDYXRlZ29yeUluZGV4ID0gY2F0ZWdvcnlJbmRleDtcclxuICAgICAgdGhpcy5jdXJyZW50V29ya0l0ZW1JbmRleCA9IHdvcmtJdGVtSW5kZXg7XHJcbiAgICAgIHRoaXMuc2hvd1F1YW50aXR5VGFiID0gTGFiZWwuV09SS0lURU1fREVUQUlMRURfUVVBTlRJVFlfVEFCO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2hvd1dvcmtJdGVtVGFiID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vQWRkIGJsYW5rIGRldGFpbGVkIHF1YW50aXR5IGF0IGxhc3RcclxuICBhZGROZXdEZXRhaWxlZFF1YW50aXR5KGNhdGVnb3J5SWQ6IG51bWJlciwgd29ya0l0ZW06IFdvcmtJdGVtLCBjYXRlZ29yeUluZGV4OiBudW1iZXIsIHdvcmtJdGVtSW5kZXg6bnVtYmVyKSB7XHJcbiAgICB0aGlzLnNob3dXb3JrSXRlbVRhYiA9IExhYmVsLldPUktJVEVNX0RFVEFJTEVEX1FVQU5USVRZX1RBQjtcclxuICAgIHRoaXMuZ2V0RGV0YWlsZWRRdWFudGl0eShjYXRlZ29yeUlkLCB3b3JrSXRlbSwgY2F0ZWdvcnlJbmRleCwgd29ya0l0ZW1JbmRleCk7XHJcbiAgICBsZXQgcXVhbnRpdHlEZXRhaWw6IFF1YW50aXR5RGV0YWlscyA9IG5ldyBRdWFudGl0eURldGFpbHMoKTtcclxuICAgIHRoaXMud29ya0l0ZW0ucXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscy5wdXNoKHF1YW50aXR5RGV0YWlsKTtcclxuICAgIHRoaXMuc2hvd0hpZGVRdWFudGl0eURldGFpbHMoY2F0ZWdvcnlJZCwgd29ya0l0ZW1JbmRleCk7XHJcbiAgfVxyXG5cclxuICBzaG93SGlkZVF1YW50aXR5RGV0YWlscyhjYXRlZ29yeUlkOm51bWJlcix3b3JrSXRlbUluZGV4Om51bWJlcikge1xyXG4gICAgaWYodGhpcy5jb21wYXJlV29ya0l0ZW1JZCA9PT0gdGhpcy53b3JrSXRlbS5yYXRlQW5hbHlzaXNJZCAmJiB0aGlzLmNvbXBhcmVDYXRlZ29yeUlkID09PSBjYXRlZ29yeUlkKSB7XHJcbiAgICAgIHRoaXMuc2hvd1F1YW50aXR5RGV0YWlscyA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNob3dRdWFudGl0eURldGFpbHMgPSBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vR2V0IERlZmF1bHQgUXVhbnRpdHkgKElmIGZsb29yIHdpc2Ugb3IgYnVpbGRpbmcgd2lzZSBxdWFudGl0eSBpcyBub3QgYWRkZWQpXHJcbiAgZ2V0RGVmYXVsdFF1YW50aXR5KGNhdGVnb3J5SWQ6IG51bWJlciwgd29ya0l0ZW06IFdvcmtJdGVtLCBjYXRlZ29yeUluZGV4OiBudW1iZXIsIHdvcmtJdGVtSW5kZXg6bnVtYmVyKSB7XHJcblxyXG4gICAgaWYoIHRoaXMuc2hvd1dvcmtJdGVtVGFiICE9PSBMYWJlbC5XT1JLSVRFTV9RVUFOVElUWV9UQUIgfHwgdGhpcy5jb21wYXJlQ2F0ZWdvcnlJZCAhPT0gY2F0ZWdvcnlJZCB8fFxyXG4gICAgICB0aGlzLmNvbXBhcmVXb3JrSXRlbUlkICE9PSB3b3JrSXRlbS5yYXRlQW5hbHlzaXNJZCkge1xyXG5cclxuICAgICAgICB0aGlzLnNldEl0ZW1JZChjYXRlZ29yeUlkLCB3b3JrSXRlbS5yYXRlQW5hbHlzaXNJZCk7XHJcbiAgICAgICAgdGhpcy53b3JrSXRlbUlkID0gd29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1dPUktJVEVNX0lELCB0aGlzLndvcmtJdGVtSWQpO1xyXG4gICAgICAgIHRoaXMud29ya0l0ZW0gPSB3b3JrSXRlbTtcclxuICAgICAgICBsZXQgcXVhbnRpdHlEZXRhaWxzOiBBcnJheTxRdWFudGl0eURldGFpbHM+ID0gd29ya0l0ZW0ucXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscztcclxuXHJcbiAgICAgICAgaWYoIHF1YW50aXR5RGV0YWlscy5sZW5ndGggIT09MCApIHtcclxuICAgICAgICAgICAgdGhpcy53b3JrSXRlbS5xdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzID0gW107XHJcbiAgICAgICAgICAgIGxldCBkZWZhdWx0UXVhbnRpdHlEZXRhaWwgPSBxdWFudGl0eURldGFpbHMuZmlsdGVyKFxyXG4gICAgICAgICAgICAgIGZ1bmN0aW9uKCBkZWZhdWx0UXVhbnRpdHlEZXRhaWw6IGFueSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmYXVsdFF1YW50aXR5RGV0YWlsLm5hbWUgPT09IExhYmVsLkRFRkFVTFRfVklFVztcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy53b3JrSXRlbS5xdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzID0gZGVmYXVsdFF1YW50aXR5RGV0YWlsO1xyXG4gICAgICAgICAgICB0aGlzLnF1YW50aXR5SXRlbXNBcnJheSA9IGxvZHNoLmNsb25lRGVlcChkZWZhdWx0UXVhbnRpdHlEZXRhaWxbMF0ucXVhbnRpdHlJdGVtcyk7XHJcbiAgICAgICAgICAgIHRoaXMua2V5UXVhbnRpdHkgPSBkZWZhdWx0UXVhbnRpdHlEZXRhaWxbMF0ubmFtZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgcXVhbnRpdHlEZXRhaWw6IFF1YW50aXR5RGV0YWlscyA9IG5ldyBRdWFudGl0eURldGFpbHMoKTtcclxuICAgICAgICAgICAgcXVhbnRpdHlEZXRhaWwucXVhbnRpdHlJdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICBxdWFudGl0eURldGFpbC5uYW1lID0gdGhpcy5nZXRMYWJlbCgpLkRFRkFVTFRfVklFVztcclxuICAgICAgICAgICAgdGhpcy53b3JrSXRlbS5xdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzLnB1c2gocXVhbnRpdHlEZXRhaWwpO1xyXG4gICAgICAgICAgICB0aGlzLnF1YW50aXR5SXRlbXNBcnJheSA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmtleVF1YW50aXR5ID0gdGhpcy5nZXRMYWJlbCgpLkRFRkFVTFRfVklFVztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudENhdGVnb3J5SW5kZXggPSBjYXRlZ29yeUluZGV4O1xyXG4gICAgICAgIHRoaXMuY3VycmVudFdvcmtJdGVtSW5kZXggPSB3b3JrSXRlbUluZGV4O1xyXG4gICAgICAgIHRoaXMuc2hvd1dvcmtJdGVtVGFiID0gTGFiZWwuV09SS0lURU1fUVVBTlRJVFlfVEFCO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zaG93V29ya0l0ZW1UYWIgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gR2V0IFJhdGVcclxuICBnZXRSYXRlKGRpc3BsYXlSYXRlVmlldyA6IHN0cmluZywgY2F0ZWdvcnlJZDpudW1iZXIsIHdvcmtJdGVtSWQ6bnVtYmVyLCB3b3JrSXRlbSA6IFdvcmtJdGVtLCBkaXNhYmxlUmF0ZUZpZWxkIDogYm9vbGVhbixcclxuICAgICAgICAgIGNhdGVnb3J5SW5kZXggOiBudW1iZXIsIHdvcmtJdGVtSW5kZXggOiBudW1iZXIgKSB7XHJcblxyXG4gICAgaWYodGhpcy5zaG93V29ya0l0ZW1UYWIgIT09IExhYmVsLldPUktJVEVNX1JBVEVfVEFCIHx8IHRoaXMuZGlzcGxheVJhdGVWaWV3ICE9PSBkaXNwbGF5UmF0ZVZpZXcgfHxcclxuICAgICAgdGhpcy5jb21wYXJlQ2F0ZWdvcnlJZCAhPT0gY2F0ZWdvcnlJZCB8fCB0aGlzLmNvbXBhcmVXb3JrSXRlbUlkICE9PSB3b3JrSXRlbUlkKSB7XHJcblxyXG4gICAgICB0aGlzLnNldEl0ZW1JZChjYXRlZ29yeUlkLCB3b3JrSXRlbUlkKTtcclxuICAgICAgdGhpcy5zZXRXb3JrSXRlbURhdGFGb3JSYXRlVmlldyh3b3JrSXRlbS5yYXRlQW5hbHlzaXNJZCwgd29ya0l0ZW0ucmF0ZSk7XHJcbiAgICAgIHRoaXMuY3VycmVudENhdGVnb3J5SW5kZXggPSBjYXRlZ29yeUluZGV4O1xyXG4gICAgICB0aGlzLmN1cnJlbnRXb3JrSXRlbUluZGV4ID0gd29ya0l0ZW1JbmRleDtcclxuICAgICAgdGhpcy5yYXRlVmlldyA9IExhYmVsLldPUktJVEVNX1JBVEVfVEFCO1xyXG4gICAgICB0aGlzLnNldFJhdGVGbGFncyhkaXNwbGF5UmF0ZVZpZXcsIGRpc2FibGVSYXRlRmllbGQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zaG93V29ya0l0ZW1UYWIgPSBudWxsO1xyXG4gICAgICB0aGlzLmRpc3BsYXlSYXRlVmlldyA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBHZXQgUmF0ZSBieSBxdWFudGl0eVxyXG4gIGdldFJhdGVCeVF1YW50aXR5KGRpc3BsYXlSYXRlVmlldyA6IHN0cmluZywgY2F0ZWdvcnlJZDpudW1iZXIsIHdvcmtJdGVtSWQ6bnVtYmVyLCB3b3JrSXRlbSA6IFdvcmtJdGVtLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVSYXRlRmllbGQgOiBib29sZWFuICwgY2F0ZWdvcnlJbmRleDpudW1iZXIsIHdvcmtJdGVtSW5kZXggOiBudW1iZXIpIHtcclxuICAgIGlmKHRoaXMuc2hvd1dvcmtJdGVtVGFiICE9PSBMYWJlbC5XT1JLSVRFTV9SQVRFX1RBQiB8fCB0aGlzLmRpc3BsYXlSYXRlVmlldyAhPT0gZGlzcGxheVJhdGVWaWV3IHx8XHJcbiAgICAgIHRoaXMuY29tcGFyZUNhdGVnb3J5SWQgIT09IGNhdGVnb3J5SWQgfHwgdGhpcy5jb21wYXJlV29ya0l0ZW1JZCAhPT0gd29ya0l0ZW1JZCkge1xyXG5cclxuICAgICAgdGhpcy5zZXRJdGVtSWQoY2F0ZWdvcnlJZCwgd29ya0l0ZW1JZCk7XHJcbiAgICAgIHRoaXMuc2V0V29ya0l0ZW1EYXRhRm9yUmF0ZVZpZXcod29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQsIHdvcmtJdGVtLnJhdGUpO1xyXG4gICAgICB0aGlzLmNhbGN1bGF0ZVF1YW50aXR5KHdvcmtJdGVtKTtcclxuICAgICAgdGhpcy5zZXRSYXRlRmxhZ3MoZGlzcGxheVJhdGVWaWV3LCBkaXNhYmxlUmF0ZUZpZWxkKTtcclxuICAgICAgdGhpcy5yYXRlVmlldyA9IExhYmVsLldPUktJVEVNX1JBVEVfQllfUVVBTlRJVFlfVEFCO1xyXG4gICAgICB0aGlzLmN1cnJlbnRDYXRlZ29yeUluZGV4ID0gY2F0ZWdvcnlJbmRleDtcclxuICAgICAgdGhpcy5jdXJyZW50V29ya0l0ZW1JbmRleCA9IHdvcmtJdGVtSW5kZXg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNob3dXb3JrSXRlbVRhYiA9IG51bGw7XHJcbiAgICAgIHRoaXMuZGlzcGxheVJhdGVWaWV3ID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEdldCBTeXN0ZW0gcmF0ZVxyXG4gIGdldFN5c3RlbVJhdGUoZGlzcGxheVJhdGVWaWV3IDogc3RyaW5nLCBjYXRlZ29yeUlkOm51bWJlciwgd29ya0l0ZW1JZDpudW1iZXIsIHdvcmtJdGVtIDogV29ya0l0ZW0sXHJcbiAgICAgICAgICAgICAgICBkaXNhYmxlUmF0ZUZpZWxkIDogYm9vbGVhbiwgY2F0ZWdvcnlJbmRleDpudW1iZXIsIHdvcmtJdGVtSW5kZXggOiBudW1iZXIpIHtcclxuXHJcbiAgICBpZih0aGlzLnNob3dXb3JrSXRlbVRhYiAhPT0gTGFiZWwuV09SS0lURU1fUkFURV9UQUIgfHwgdGhpcy5kaXNwbGF5UmF0ZVZpZXcgIT09IGRpc3BsYXlSYXRlVmlldyB8fFxyXG4gICAgICB0aGlzLmNvbXBhcmVDYXRlZ29yeUlkICE9PSBjYXRlZ29yeUlkIHx8IHRoaXMuY29tcGFyZVdvcmtJdGVtSWQgIT09IHdvcmtJdGVtSWQpIHtcclxuXHJcbiAgICAgIHRoaXMuc2V0SXRlbUlkKGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQpO1xyXG4gICAgICB0aGlzLnNldFdvcmtJdGVtRGF0YUZvclJhdGVWaWV3KHdvcmtJdGVtLnJhdGVBbmFseXNpc0lkLCB3b3JrSXRlbS5zeXN0ZW1SYXRlKTtcclxuICAgICAgdGhpcy5yYXRlVmlldyA9IExhYmVsLldPUktJVEVNX1NZU1RFTV9SQVRFX1RBQjtcclxuICAgICAgdGhpcy5jdXJyZW50Q2F0ZWdvcnlJbmRleCA9IGNhdGVnb3J5SW5kZXg7XHJcbiAgICAgIHRoaXMuY3VycmVudFdvcmtJdGVtSW5kZXggPSB3b3JrSXRlbUluZGV4O1xyXG4gICAgICB0aGlzLnNldFJhdGVGbGFncyhkaXNwbGF5UmF0ZVZpZXcsIGRpc2FibGVSYXRlRmllbGQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zaG93V29ya0l0ZW1UYWIgPSBudWxsO1xyXG4gICAgICB0aGlzLmRpc3BsYXlSYXRlVmlldyA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRJdGVtSWQoY2F0ZWdvcnlJZDpudW1iZXIsIHdvcmtJdGVtSWQ6bnVtYmVyKSB7XHJcbiAgICB0aGlzLmNvbXBhcmVDYXRlZ29yeUlkID0gY2F0ZWdvcnlJZDtcclxuICAgIHRoaXMuY29tcGFyZVdvcmtJdGVtSWQgPSB3b3JrSXRlbUlkO1xyXG4gIH1cclxuXHJcbiAgY2xvc2VEZXRhaWxlZFF1YW50aXR5VGFiKCkge1xyXG4gICAgdGhpcy5zaG93UXVhbnRpdHlUYWIgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgY2xvc2VRdWFudGl0eVRhYigpIHtcclxuICAgIHRoaXMuc2hvd1dvcmtJdGVtVGFiID0gbnVsbDtcclxuICB9XHJcblxyXG4gIHNldFJhdGVGbGFncyhkaXNwbGF5UmF0ZVZpZXcgOiBzdHJpbmcsIGRpc2FibGVSYXRlRmllbGQgOiBib29sZWFuKSB7XHJcbiAgICB0aGlzLmRpc3BsYXlSYXRlVmlldyA9IGRpc3BsYXlSYXRlVmlldztcclxuICAgIHRoaXMuZGlzYWJsZVJhdGVGaWVsZD1kaXNhYmxlUmF0ZUZpZWxkO1xyXG4gICAgdGhpcy5zaG93V29ya0l0ZW1UYWIgPSBMYWJlbC5XT1JLSVRFTV9SQVRFX1RBQjtcclxuICB9XHJcblxyXG4gIHNldFdvcmtJdGVtRGF0YUZvclJhdGVWaWV3KHdvcmtJdGVtSWQgOiBudW1iZXIsIHJhdGUgOiBSYXRlKSB7XHJcbiAgICB0aGlzLndvcmtJdGVtSWQgPSB3b3JrSXRlbUlkO1xyXG4gICAgICB0aGlzLnJhdGVJdGVtc0FycmF5ID0gbG9kc2guY2xvbmVEZWVwKHJhdGUpO1xyXG4gICAgICB0aGlzLnVuaXQgPSBsb2RzaC5jbG9uZURlZXAocmF0ZS51bml0KTtcclxuICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9XT1JLSVRFTV9JRCwgdGhpcy53b3JrSXRlbUlkKTtcclxuICB9XHJcblxyXG4gIGNhbGN1bGF0ZVF1YW50aXR5KHdvcmtJdGVtIDogV29ya0l0ZW0pIHtcclxuICAgIHRoaXMucHJldmlvdXNSYXRlUXVhbnRpdHkgPSBsb2RzaC5jbG9uZURlZXAod29ya0l0ZW0ucmF0ZS5xdWFudGl0eSk7XHJcbiAgICB0aGlzLnJhdGVJdGVtc0FycmF5LnF1YW50aXR5ID0gbG9kc2guY2xvbmVEZWVwKHdvcmtJdGVtLnF1YW50aXR5LnRvdGFsKTtcclxuICAgIHRoaXMucXVhbnRpdHlJbmNyZW1lbnQgPSB0aGlzLnJhdGVJdGVtc0FycmF5LnF1YW50aXR5IC8gdGhpcy5wcmV2aW91c1JhdGVRdWFudGl0eTtcclxuICAgIGZvciAobGV0IHJhdGVJdGVtc0luZGV4ID0gMDsgcmF0ZUl0ZW1zSW5kZXggPCB0aGlzLnJhdGVJdGVtc0FycmF5LnJhdGVJdGVtcy5sZW5ndGg7IHJhdGVJdGVtc0luZGV4KyspIHtcclxuICAgICAgdGhpcy5yYXRlSXRlbXNBcnJheS5yYXRlSXRlbXNbcmF0ZUl0ZW1zSW5kZXhdLnF1YW50aXR5ID0gcGFyc2VGbG9hdCgoXHJcbiAgICAgICAgdGhpcy5yYXRlSXRlbXNBcnJheS5yYXRlSXRlbXNbcmF0ZUl0ZW1zSW5kZXhdLnF1YW50aXR5ICpcclxuICAgICAgICB0aGlzLnF1YW50aXR5SW5jcmVtZW50KS50b0ZpeGVkKFZhbHVlQ29uc3RhbnQuTlVNQkVSX09GX0ZSQUNUSU9OX0RJR0lUKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRJZHNGb3JEZWxldGVXb3JrSXRlbShjYXRlZ29yeUlkOiBzdHJpbmcsIHdvcmtJdGVtSWQ6IHN0cmluZyx3b3JrSXRlbUluZGV4Om51bWJlcikge1xyXG4gICAgdGhpcy5jYXRlZ29yeUlkID0gcGFyc2VJbnQoY2F0ZWdvcnlJZCk7XHJcbiAgICB0aGlzLndvcmtJdGVtSWQgPSAgcGFyc2VJbnQod29ya0l0ZW1JZCk7XHJcbiAgICB0aGlzLmNvbXBhcmVXb3JrSXRlbUlkID0gd29ya0l0ZW1JbmRleDtcclxuICB9XHJcblxyXG4gIGRlYWN0aXZhdGVXb3JrSXRlbSgpIHtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdGFydCgpO1xyXG4gICAgbGV0IGNvc3RIZWFkSWQ9cGFyc2VJbnQoU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX0NPU1RfSEVBRF9JRCkpO1xyXG4gICAgdGhpcy5jb3N0U3VtbWFyeVNlcnZpY2UuZGVhY3RpdmF0ZVdvcmtJdGVtKCB0aGlzLmJhc2VVcmwsIGNvc3RIZWFkSWQsIHRoaXMuY2F0ZWdvcnlJZCwgdGhpcy53b3JrSXRlbUlkICkuc3Vic2NyaWJlKFxyXG4gICAgICAgIHN1Y2Nlc3MgPT4gdGhpcy5vbkRlQWN0aXZhdGVXb3JrSXRlbVN1Y2Nlc3Moc3VjY2VzcyksXHJcbiAgICAgIGVycm9yID0+IHRoaXMub25EZUFjdGl2YXRlV29ya0l0ZW1GYWlsdXJlKGVycm9yKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIG9uRGVBY3RpdmF0ZVdvcmtJdGVtU3VjY2VzcyhzdWNjZXNzOiBzdHJpbmcpIHtcclxuXHJcbiAgICB0aGlzLnNob3dXb3JrSXRlbUxpc3QgPSBmYWxzZTtcclxuICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0RFTEVURV9XT1JLSVRFTTtcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuXHJcbiAgICB0aGlzLndvcmtJdGVtc0xpc3Quc3BsaWNlKHRoaXMuY29tcGFyZVdvcmtJdGVtSWQsIDEpO1xyXG5cclxuICAgIHRoaXMuY2F0ZWdvcnlEZXRhaWxzVG90YWxBbW91bnQgPSB0aGlzLmNvbW1vblNlcnZpY2UudG90YWxDYWxjdWxhdGlvbk9mQ2F0ZWdvcmllcyh0aGlzLmNhdGVnb3J5RGV0YWlscyxcclxuICAgICAgdGhpcy5jYXRlZ29yeVJhdGVBbmFseXNpc0lkLCB0aGlzLndvcmtJdGVtc0xpc3QpO1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICB9XHJcblxyXG4gIG9uRGVBY3RpdmF0ZVdvcmtJdGVtRmFpbHVyZShlcnJvcjogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZygnSW5BY3RpdmUgV29ya0l0ZW0gZXJyb3IgOiAnK0pTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0SW5BY3RpdmVXb3JrSXRlbXMoY2F0ZWdvcnlJZDpudW1iZXIsIGNhdGVnb3J5SW5kZXg6bnVtYmVyKSB7XHJcblxyXG4gICAgdGhpcy5jb21wYXJlV29ya0l0ZW1SYXRlQW5hbHlzaXNJZCA9IGNhdGVnb3J5SW5kZXg7XHJcbiAgICB0aGlzLmNhdGVnb3J5UmF0ZUFuYWx5c2lzSWQgPSBjYXRlZ29yeUlkO1xyXG5cclxuICAgIHRoaXMuY29zdFN1bW1hcnlTZXJ2aWNlLmdldEluQWN0aXZlV29ya0l0ZW1zKCB0aGlzLmJhc2VVcmwsIHRoaXMuY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCkuc3Vic2NyaWJlKFxyXG4gICAgICB3b3JrSXRlbUxpc3QgPT4gdGhpcy5vbkdldEluQWN0aXZlV29ya0l0ZW1zU3VjY2Vzcyh3b3JrSXRlbUxpc3QpLFxyXG4gICAgICBlcnJvciA9PiB0aGlzLm9uR2V0SW5BY3RpdmVXb3JrSXRlbXNGYWlsdXJlKGVycm9yKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIG9uR2V0SW5BY3RpdmVXb3JrSXRlbXNTdWNjZXNzKHdvcmtJdGVtTGlzdDphbnkpIHtcclxuICAgIGlmICh3b3JrSXRlbUxpc3QuZGF0YS5sZW5ndGggIT09IDApIHtcclxuICAgICAgdGhpcy53b3JrSXRlbUxpc3RBcnJheSA9IHdvcmtJdGVtTGlzdC5kYXRhO1xyXG4gICAgICB0aGlzLnNob3dXb3JrSXRlbUxpc3QgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19BTFJFQURZX0FEREVEX0FMTF9XT1JLSVRFTVM7XHJcbiAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uR2V0SW5BY3RpdmVXb3JrSXRlbXNGYWlsdXJlKGVycm9yOmFueSkge1xyXG4gICAgY29uc29sZS5sb2coJ0dldCBXb3JrSXRlbUxpc3QgZXJyb3IgOiAnK2Vycm9yKTtcclxuICB9XHJcblxyXG4gIG9uQ2hhbmdlQWN0aXZhdGVTZWxlY3RlZFdvcmtJdGVtKHNlbGVjdGVkV29ya0l0ZW06YW55KSB7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RhcnQoKTtcclxuICAgIHRoaXMuc2hvd1dvcmtJdGVtTGlzdD1mYWxzZTtcclxuICAgIGxldCB3b3JrSXRlbUxpc3TigILigII94oCC4oCCdGhpcy53b3JrSXRlbUxpc3RBcnJheTtcclxuICAgIGxldCB3b3JrSXRlbU9iamVjdCA9IHdvcmtJdGVtTGlzdC5maWx0ZXIoXHJcbiAgICAgIGZ1bmN0aW9uKCB3b3JrSXRlbU9iajogYW55KXtcclxuICAgICAgICByZXR1cm4gd29ya0l0ZW1PYmoubmFtZSA9PT0gc2VsZWN0ZWRXb3JrSXRlbTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgdGhpcy5zZWxlY3RlZFdvcmtJdGVtRGF0YVswXSA9IHdvcmtJdGVtT2JqZWN0WzBdO1xyXG5cclxuICAgIGxldCBjYXRlZ29yeUlkPXRoaXMuY2F0ZWdvcnlSYXRlQW5hbHlzaXNJZDtcclxuXHJcbiAgICB0aGlzLmNvc3RTdW1tYXJ5U2VydmljZS5hY3RpdmF0ZVdvcmtJdGVtKCB0aGlzLmJhc2VVcmwsIHRoaXMuY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCxcclxuICAgICAgd29ya0l0ZW1PYmplY3RbMF0ucmF0ZUFuYWx5c2lzSWQpLnN1YnNjcmliZShcclxuICAgICAgc3VjY2VzcyA9PiB0aGlzLm9uQWN0aXZhdGVXb3JrSXRlbVN1Y2Nlc3Moc3VjY2VzcyksXHJcbiAgICAgIGVycm9yID0+IHRoaXMub25BY3RpdmF0ZVdvcmtJdGVtRmFpbHVyZShlcnJvcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkFjdGl2YXRlV29ya0l0ZW1TdWNjZXNzKHN1Y2Nlc3MgOiBzdHJpbmcpIHtcclxuXHJcbiAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgIG1lc3NhZ2UuY3VzdG9tX21lc3NhZ2UgPSBNZXNzYWdlcy5NU0dfU1VDQ0VTU19BRERfV09SS0lURU07XHJcbiAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcblxyXG5cclxuICAgIHRoaXMud29ya0l0ZW1zTGlzdCA9IHRoaXMud29ya0l0ZW1zTGlzdC5jb25jYXQodGhpcy50b3RhbENhbGN1bGF0aW9uT2ZXb3JrSXRlbXNMaXN0KHRoaXMuc2VsZWN0ZWRXb3JrSXRlbURhdGEpKTtcclxuICAgIHRoaXMuY2F0ZWdvcnlEZXRhaWxzVG90YWxBbW91bnQgPSB0aGlzLmNvbW1vblNlcnZpY2UudG90YWxDYWxjdWxhdGlvbk9mQ2F0ZWdvcmllcyh0aGlzLmNhdGVnb3J5RGV0YWlscyxcclxuICAgICAgdGhpcy5jYXRlZ29yeVJhdGVBbmFseXNpc0lkLCB0aGlzLndvcmtJdGVtc0xpc3QpO1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICB9XHJcblxyXG4gIG9uQWN0aXZhdGVXb3JrSXRlbUZhaWx1cmUoZXJyb3I6YW55KSB7XHJcbiAgICBjb25zb2xlLmxvZygnQWN0aXZlIFdvcmtJdGVtIGVycm9yIDogJytlcnJvcik7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgc2V0Q2F0ZWdvcnlJZEZvckRlYWN0aXZhdGUoY2F0ZWdvcnlJZCA6IGFueSkge1xyXG4gICAgdGhpcy5jYXRlZ29yeUlkRm9ySW5BY3RpdmUgPSBjYXRlZ29yeUlkO1xyXG4gIH1cclxuXHJcbiAgc2V0RGlyZWN0UXVhbnRpdHkoY2F0ZWdvcnlJZCA6IG51bWJlciwgd29ya0l0ZW1JZDogbnVtYmVyLCBkaXJlY3RRdWFudGl0eSA6IG51bWJlcikge1xyXG4gICAgdGhpcy5jYXRlZ29yeUlkID0gY2F0ZWdvcnlJZDtcclxuICAgIHRoaXMud29ya0l0ZW1JZCA9IHdvcmtJdGVtSWQ7XHJcbiAgICB0aGlzLmRpcmVjdFF1YW50aXR5ID0gZGlyZWN0UXVhbnRpdHk7XHJcbiAgfVxyXG5cclxuICBkaXNwbGF5TW9kYWwoKSB7XHJcbiAgICAkKCcjdXBkYXRlRGlyZWN0UXVhbnRpdHknKS5tb2RhbCgnc2hvdycpO1xyXG4gIH1cclxuXHJcbiAgY2hhbmdlRGlyZWN0UXVhbnRpdHkoKSB7XHJcbiAgICBpZiggdGhpcy5kaXJlY3RRdWFudGl0eSAhPT0gbnVsbCB8fCAgdGhpcy5kaXJlY3RRdWFudGl0eSAhPT0gMCkge1xyXG4gICAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RhcnQoKTtcclxuICAgICAgdGhpcy5jb3N0U3VtbWFyeVNlcnZpY2UudXBkYXRlRGlyZWN0UXVhbnRpdHlBbW91bnQodGhpcy5iYXNlVXJsLCB0aGlzLmNvc3RIZWFkSWQsIHRoaXMuY2F0ZWdvcnlJZCxcclxuICAgICAgICB0aGlzLndvcmtJdGVtSWQsIHRoaXMuZGlyZWN0UXVhbnRpdHkpLnN1YnNjcmliZShcclxuICAgICAgICB3b3JrSXRlbUxpc3QgPT4gdGhpcy5vbkNoYW5nZURpcmVjdFF1YW50aXR5U3VjY2Vzcyh3b3JrSXRlbUxpc3QpLFxyXG4gICAgICAgIGVycm9yID0+IHRoaXMub25DaGFuZ2VEaXJlY3RRdWFudGl0eUZhaWx1cmUoZXJyb3IpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkNoYW5nZURpcmVjdFF1YW50aXR5U3VjY2VzcyhzdWNjZXNzIDogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZygnc3VjY2VzcyA6ICcrSlNPTi5zdHJpbmdpZnkoc3VjY2VzcykpO1xyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgbWVzc2FnZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfVVBEQVRFX0RJUkVDVF9RVUFOVElUWV9PRl9XT1JLSVRFTTtcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIHRoaXMucmVmcmVzaENhdGVnb3J5TGlzdCgpO1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICB9XHJcblxyXG4gIG9uQ2hhbmdlRGlyZWN0UXVhbnRpdHlGYWlsdXJlKGVycm9yIDogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZygnZXJyb3IgOiAnK0pTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgY2hhbmdlRGlyZWN0UmF0ZShjYXRlZ29yeUlkIDogbnVtYmVyLCB3b3JrSXRlbUlkOiBudW1iZXIsIGRpcmVjdFJhdGUgOiBudW1iZXIpIHtcclxuICAgIGlmKGRpcmVjdFJhdGUgIT09IG51bGwgfHwgZGlyZWN0UmF0ZSAhPT0gMCkge1xyXG4gICAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RhcnQoKTtcclxuICAgICAgdGhpcy5jb3N0U3VtbWFyeVNlcnZpY2UudXBkYXRlRGlyZWN0UmF0ZSh0aGlzLmJhc2VVcmwsIHRoaXMuY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCwgd29ya0l0ZW1JZCwgZGlyZWN0UmF0ZSkuc3Vic2NyaWJlKFxyXG4gICAgICAgIHN1Y2Nlc3MgPT4gdGhpcy5vblVwZGF0ZURpcmVjdFJhdGVTdWNjZXNzKHN1Y2Nlc3MpLFxyXG4gICAgICAgIGVycm9yID0+IHRoaXMub25VcGRhdGVEaXJlY3RSYXRlRmFpbHVyZShlcnJvcilcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uVXBkYXRlRGlyZWN0UmF0ZVN1Y2Nlc3Moc3VjY2VzcyA6IGFueSkge1xyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgbWVzc2FnZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfVVBEQVRFX0RJUkVDVF9SQVRFX09GX1dPUktJVEVNO1xyXG4gICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgdGhpcy5yZWZyZXNoV29ya0l0ZW1MaXN0KCk7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgb25VcGRhdGVEaXJlY3RSYXRlRmFpbHVyZShlcnJvciA6IGFueSkge1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICB9XHJcblxyXG4gIHJlZnJlc2hDYXRlZ29yeUxpc3QoKSB7XHJcbiAgICB0aGlzLmdldENhdGVnb3JpZXMoIHRoaXMucHJvamVjdElkLCB0aGlzLmNvc3RIZWFkSWQpO1xyXG4gICAgLy90aGlzLnNob3dXb3JrSXRlbVRhYiA9IG51bGw7XHJcbiAgICAvL3RoaXMuc2hvd1F1YW50aXR5VGFiID0gbnVsbDtcclxuICAgIC8vdGhpcy5kaXNwbGF5UmF0ZVZpZXcgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgcmVmcmVzaFdvcmtJdGVtTGlzdCgpIHtcclxuICAgIC8vdGhpcy5yZWZyZXNoQ2F0ZWdvcnlMaXN0KCk7XHJcbiAgfVxyXG5cclxuLyogIHNldFNlbGVjdGVkV29ya0l0ZW1zKHdvcmtJdGVtTGlzdDphbnkpIHtcclxuICAgIHRoaXMuc2VsZWN0ZWRXb3JrSXRlbXMgPSB3b3JrSXRlbUxpc3Q7XHJcbiAgfSovXHJcblxyXG4gICAgZ2V0QWN0aXZlV29ya0l0ZW1zT2ZDYXRlZ29yeShjYXRlZ29yeUlkIDogbnVtYmVyKSB7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gcGFyc2VJbnQoU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX0NPU1RfSEVBRF9JRCkpO1xyXG4gICAgICB0aGlzLmNhdGVnb3J5SWQgPSBjYXRlZ29yeUlkO1xyXG4gICAgICB0aGlzLmNhdGVnb3J5UmF0ZUFuYWx5c2lzSWQgPSBjYXRlZ29yeUlkO1xyXG4gICAgICB0aGlzLmNvc3RTdW1tYXJ5U2VydmljZS5nZXRBY3RpdmVXb3JrSXRlbXNPZkNhdGVnb3J5KCB0aGlzLmJhc2VVcmwsIGNvc3RIZWFkSWQsIHRoaXMuY2F0ZWdvcnlJZCkuc3Vic2NyaWJlKFxyXG4gICAgICAgIHdvcmtJdGVtc0xpc3QgPT4gdGhpcy5vbkdldEFjdGl2ZVdvcmtJdGVtc09mQ2F0ZWdvcnlTdWNjZXNzKHdvcmtJdGVtc0xpc3QpLFxyXG4gICAgICAgIGVycm9yID0+IHRoaXMub25HZXRBY3RpdmVXb3JrSXRlbXNPZkNhdGVnb3J5RmFpbHVyZShlcnJvcilcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgb25HZXRBY3RpdmVXb3JrSXRlbXNPZkNhdGVnb3J5U3VjY2Vzcyh3b3JrSXRlbXNMaXN0IDogYW55KSB7XHJcbiAgICB0aGlzLndvcmtJdGVtc0xpc3QgPSB3b3JrSXRlbXNMaXN0LmRhdGE7XHJcbiAgfVxyXG5cclxuICAvLyBjYWxjdWxhdGlvbiBvZiBRdWFudGl0eSAqIFJhdGVcclxuICB0b3RhbENhbGN1bGF0aW9uT2ZXb3JrSXRlbXNMaXN0KHdvcmtJdGVtc0xpc3QgOiBhbnkpIHtcclxuICAgICAgZm9yKGxldCB3b3JrSXRlbURhdGEgb2Ygd29ya0l0ZW1zTGlzdCkge1xyXG4gICAgICAgIHdvcmtJdGVtRGF0YS5hbW91bnQgPSB0aGlzLmNvbW1vblNlcnZpY2UuY2FsY3VsYXRlQW1vdW50T2ZXb3JrSXRlbSh3b3JrSXRlbURhdGEucXVhbnRpdHkudG90YWwsIHdvcmtJdGVtRGF0YS5yYXRlLnRvdGFsKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gd29ya0l0ZW1zTGlzdDtcclxuICB9XHJcblxyXG4gIG9uR2V0QWN0aXZlV29ya0l0ZW1zT2ZDYXRlZ29yeUZhaWx1cmUoZXJyb3IgOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKCdvbkdldEFjdGl2ZVdvcmtJdGVtc09mQ2F0ZWdvcnlGYWlsdXJlIGVycm9yIDogJytKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gIH1cclxuXHJcblxyXG4gIGRlbGV0ZUVsZW1lbnQoZWxlbWVudFR5cGUgOiBzdHJpbmcpIHtcclxuICAgIGlmKGVsZW1lbnRUeXBlID09PSBQcm9qZWN0RWxlbWVudHMuUVVBTlRJVFlfREVUQUlMUykge1xyXG4gICAgICB0aGlzLmNoaWxkLmRlbGV0ZVF1YW50aXR5RGV0YWlsc0J5TmFtZSgpO1xyXG4gICAgfVxyXG4gICAgaWYoZWxlbWVudFR5cGUgPT09IFByb2plY3RFbGVtZW50cy5XT1JLX0lURU0pIHtcclxuICAgICAgdGhpcy5kZWFjdGl2YXRlV29ya0l0ZW0oKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZUVsZW1lbnQoZWxlbWVudFR5cGUgOiBzdHJpbmcpIHtcclxuICAgICAgaWYoZWxlbWVudFR5cGUgPT09IFByb2plY3RFbGVtZW50cy5ESVJFQ1RfUVVBTlRJVFkpIHtcclxuICAgICAgICB0aGlzLmNoYW5nZURpcmVjdFF1YW50aXR5KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgZ29CYWNrKCkge1xyXG4gICAgbGV0IHByb2plY3RJZCA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbTmF2aWdhdGlvblJvdXRlcy5BUFBfUFJPSkVDVCxwcm9qZWN0SWQsTmF2aWdhdGlvblJvdXRlcy5BUFBfQ09TVF9TVU1NQVJZXSk7XHJcbiAgfVxyXG5cclxuICBnZXRUYWJsZUhlYWRpbmdzKCkge1xyXG4gICAgcmV0dXJuIFRhYmxlSGVhZGluZ3M7XHJcbiAgfVxyXG5cclxuICBnZXRCdXR0b24oKSB7XHJcbiAgICByZXR1cm4gQnV0dG9uO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGFiZWwoKSB7XHJcbiAgICByZXR1cm4gTGFiZWw7XHJcbiAgfVxyXG5cclxuICBzZXRDYXRlZ29yaWVzVG90YWwoIGNhdGVnb3JpZXNUb3RhbCA6IG51bWJlcikge1xyXG4gICAgdGhpcy5jYXRlZ29yeURldGFpbHNUb3RhbEFtb3VudCA9IGNhdGVnb3JpZXNUb3RhbDtcclxuICAgIHRoaXMucmVmcmVzaENhdGVnb3J5TGlzdCgpO1xyXG4gIH1cclxuXHJcbiAgc2V0U2hvd1dvcmtJdGVtVGFiKCB0YWJOYW1lIDogc3RyaW5nKSB7XHJcbiAgICAvL3RoaXMuc2hvd1dvcmtJdGVtVGFiID0gdGFiTmFtZTtcclxuICB9XHJcblxyXG4gIGNsb3NlUmF0ZVZpZXcoKSB7XHJcbiAgICB0aGlzLnNob3dXb3JrSXRlbVRhYiA9IG51bGw7XHJcbiAgICB0aGlzLmRpc3BsYXlSYXRlVmlldyA9IG51bGw7XHJcbiAgfVxyXG5cclxuICBjbG9zZVF1YW50aXR5VmlldygpIHtcclxuICAgIHRoaXMuc2hvd1F1YW50aXR5VGFiID0gbnVsbDtcclxuICAgIHRoaXMuc2hvd1dvcmtJdGVtVGFiID0gbnVsbDtcclxuICB9XHJcbn1cclxuIl19
