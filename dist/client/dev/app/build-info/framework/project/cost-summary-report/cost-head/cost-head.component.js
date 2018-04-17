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
    CostHeadComponent.prototype.changeDirectQuantity = function (categoryId, workItemId, directQuantity) {
        var _this = this;
        if (directQuantity !== null || directQuantity !== 0) {
            this.loaderService.start();
            this.costSummaryService.updateDirectQuantityAmount(this.baseUrl, this.costHeadId, categoryId, workItemId, directQuantity).subscribe(function (workItemList) { return _this.onChangeDirectQuantitySuccess(workItemList); }, function (error) { return _this.onChangeDirectQuantityFailure(error); });
        }
    };
    CostHeadComponent.prototype.onChangeDirectQuantitySuccess = function (success) {
        console.log('success : ' + JSON.stringify(success));
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = constants_1.Messages.MSG_SUCCESS_UPDATE_DIRECT_QUANTITY_OF_WORKITEM;
        this.messageService.message(message);
        this.refreshWorkItemList();
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
        this.showWorkItemTab = null;
        this.showQuantityTab = null;
        this.displayRateView = null;
    };
    CostHeadComponent.prototype.refreshWorkItemList = function () {
        this.refreshCategoryList();
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
        this.showWorkItemTab = tabName;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1oZWFkL2Nvc3QtaGVhZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBd0U7QUFDeEUsMENBQXlEO0FBQ3pELDZEQUEySTtBQUMzSSxxREFBaUg7QUFFakgsZ0ZBQThFO0FBQzlFLGdFQUE2RDtBQUM3RCw4QkFBZ0M7QUFJaEMsb0VBQWtFO0FBQ2xFLGdGQUE2RTtBQUM3RSw0RkFBeUY7QUFXekY7SUFzREUsMkJBQW9CLGtCQUF1QyxFQUFVLGNBQStCLEVBQ2hGLE9BQWUsRUFBVSxjQUE4QixFQUFVLGFBQTZCLEVBQzlGLGFBQTRCO1FBRjVCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBcUI7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBaUI7UUFDaEYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFnQjtRQUM5RixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQXhDaEQsK0JBQTBCLEdBQVMsQ0FBQyxDQUFDO1FBSXJDLGFBQVEsR0FBUSxDQUFDLENBQUM7UUFDbEIseUJBQW9CLEdBQVEsQ0FBQyxDQUFDO1FBQzlCLFNBQUksR0FBUSxFQUFFLENBQUM7UUFDZixxQkFBZ0IsR0FBWSxLQUFLLENBQUM7UUFFbEMsK0JBQTBCLEdBQUcsMkJBQWUsQ0FBQyxRQUFRLENBQUM7UUFDdEQsK0JBQTBCLEdBQUcsMkJBQWUsQ0FBQyxTQUFTLENBQUM7UUFDdkQseUNBQW9DLEdBQUcsMkJBQWUsQ0FBQyxnQkFBZ0IsQ0FBQztRQUN4RSx3Q0FBbUMsR0FBRywyQkFBZSxDQUFDLGVBQWUsQ0FBQztRQUMvRCx3QkFBbUIsR0FBUyxLQUFLLENBQUM7UUFDakMscUJBQWdCLEdBQVMsS0FBSyxDQUFDO1FBQy9CLG9CQUFlLEdBQVksSUFBSSxDQUFD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OENBQWtCLEdBQWxCLFVBQW9CLE9BQWdCO1FBQ2xDLElBQUksQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDO0lBQ2pDLENBQUM7SUFFRCx5Q0FBYSxHQUFiO1FBQ0UsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFDNUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7SUFDOUIsQ0FBQztJQUVELDZDQUFpQixHQUFqQjtRQUNFLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQzVCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO0lBQzlCLENBQUM7SUFyaUJvQztRQUFwQyxnQkFBUyxDQUFDLHFEQUF3QixDQUFDO2tDQUFRLHFEQUF3QjtvREFBQztJQUYxRCxpQkFBaUI7UUFQN0IsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsY0FBYztZQUN4QixTQUFTLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztZQUN0QyxXQUFXLEVBQUUsMEJBQTBCO1NBQ3hDLENBQUM7eUNBd0R5Qyx5Q0FBa0IsRUFBMkIsdUJBQWM7WUFDdkUsZUFBTSxFQUEwQixzQkFBYyxFQUEwQiw4QkFBYTtZQUMvRSwrQkFBYTtPQXhEckMsaUJBQWlCLENBd2lCN0I7SUFBRCx3QkFBQztDQXhpQkQsQUF3aUJDLElBQUE7QUF4aUJZLDhDQUFpQiIsImZpbGUiOiJhcHAvYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9jb3N0LXN1bW1hcnktcmVwb3J0L2Nvc3QtaGVhZC9jb3N0LWhlYWQuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIE9uQ2hhbmdlcywgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBNZXNzYWdlcywgUHJvamVjdEVsZW1lbnRzLCBOYXZpZ2F0aW9uUm91dGVzLCBUYWJsZUhlYWRpbmdzLCBCdXR0b24sIExhYmVsLCBWYWx1ZUNvbnN0YW50IH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IEFQSSxTZXNzaW9uU3RvcmFnZSwgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLCBNZXNzYWdlLCBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IFJhdGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbC9yYXRlJztcclxuaW1wb3J0IHsgQ29tbW9uU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9jb21tb24uc2VydmljZSc7XHJcbmltcG9ydCB7IENvc3RTdW1tYXJ5U2VydmljZSB9IGZyb20gJy4uL2Nvc3Qtc3VtbWFyeS5zZXJ2aWNlJztcclxuaW1wb3J0ICogYXMgbG9kc2ggZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgQ2F0ZWdvcnkgfSBmcm9tICcuLi8uLi8uLi9tb2RlbC9jYXRlZ29yeSc7XHJcbmltcG9ydCB7IFdvcmtJdGVtIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWwvd29yay1pdGVtJztcclxuaW1wb3J0IHsgUXVhbnRpdHlJdGVtIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWwvcXVhbnRpdHktaXRlbSc7XHJcbmltcG9ydCB7IFF1YW50aXR5RGV0YWlscyB9IGZyb20gJy4uLy4uLy4uL21vZGVsL3F1YW50aXR5LWRldGFpbHMnO1xyXG5pbXBvcnQgeyBMb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2hhcmVkL2xvYWRlci9sb2FkZXJzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBRdWFudGl0eURldGFpbHNDb21wb25lbnQgfSBmcm9tICcuL3F1YW50aXR5LWRldGFpbHMvcXVhbnRpdHktZGV0YWlscy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBSYXRlSXRlbSB9IGZyb20gJy4uLy4uLy4uL21vZGVsL3JhdGUtaXRlbSc7XHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICBzZWxlY3RvcjogJ2JpLWNvc3QtaGVhZCcsXHJcbiAgc3R5bGVVcmxzOiBbJ2Nvc3QtaGVhZC5jb21wb25lbnQuY3NzJ10sXHJcbiAgdGVtcGxhdGVVcmw6ICdjb3N0LWhlYWQuY29tcG9uZW50Lmh0bWwnXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgQ29zdEhlYWRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XHJcblxyXG4gIEBWaWV3Q2hpbGQoUXVhbnRpdHlEZXRhaWxzQ29tcG9uZW50KSBjaGlsZDogUXVhbnRpdHlEZXRhaWxzQ29tcG9uZW50O1xyXG5cclxuICBwcm9qZWN0SWQgOiBzdHJpbmc7XHJcbiAgdmlld1R5cGVWYWx1ZTogc3RyaW5nO1xyXG4gIGJhc2VVcmw6c3RyaW5nO1xyXG4gIHZpZXdUeXBlOnN0cmluZztcclxuICBrZXlRdWFudGl0eTpzdHJpbmc7XHJcbiAgY3VycmVudEtleTpzdHJpbmc7XHJcbiAgY29zdEhlYWROYW1lOiBzdHJpbmc7XHJcbiAgY29zdEhlYWRJZDpudW1iZXI7XHJcbiAgd29ya0l0ZW1JZDogbnVtYmVyO1xyXG4gIGNhdGVnb3J5SWQ6IG51bWJlcjtcclxuICBkaXJlY3RRdWFudGl0eTogbnVtYmVyO1xyXG4gIGNhdGVnb3J5RGV0YWlsczogQXJyYXk8Q2F0ZWdvcnk+O1xyXG4gIGNhdGVnb3J5RGV0YWlsc1RvdGFsQW1vdW50OiBudW1iZXI9MDtcclxuICB3b3JrSXRlbTogV29ya0l0ZW07XHJcbiAgY2F0ZWdvcnlSYXRlQW5hbHlzaXNJZDpudW1iZXI7XHJcbiAgY29tcGFyZVdvcmtJdGVtUmF0ZUFuYWx5c2lzSWQ6bnVtYmVyO1xyXG4gIHF1YW50aXR5Om51bWJlcj0wO1xyXG4gIHJhdGVGcm9tUmF0ZUFuYWx5c2lzOm51bWJlcj0wO1xyXG4gIHVuaXQ6c3RyaW5nPScnO1xyXG4gIHNob3dDYXRlZ29yeUxpc3Q6IGJvb2xlYW4gPSBmYWxzZTtcclxuICB3b3JrSXRlbXNMaXN0OiBBcnJheTxXb3JrSXRlbT47XHJcbiAgZGVsZXRlQ29uZmlybWF0aW9uQ2F0ZWdvcnkgPSBQcm9qZWN0RWxlbWVudHMuQ0FURUdPUlk7XHJcbiAgZGVsZXRlQ29uZmlybWF0aW9uV29ya0l0ZW0gPSBQcm9qZWN0RWxlbWVudHMuV09SS19JVEVNO1xyXG4gIGRlbGV0ZUNvbmZpcm1hdGlvbkZvclF1YW50aXR5RGV0YWlscyA9IFByb2plY3RFbGVtZW50cy5RVUFOVElUWV9ERVRBSUxTO1xyXG4gIHVwZGF0ZUNvbmZpcm1hdGlvbkZvckRpcmVjdFF1YW50aXR5ID0gUHJvamVjdEVsZW1lbnRzLkRJUkVDVF9RVUFOVElUWTtcclxuICBwdWJsaWMgc2hvd1F1YW50aXR5RGV0YWlsczpib29sZWFuPWZhbHNlO1xyXG4gIHByaXZhdGUgc2hvd1dvcmtJdGVtTGlzdDpib29sZWFuPWZhbHNlO1xyXG4gIHByaXZhdGUgc2hvd1dvcmtJdGVtVGFiIDogc3RyaW5nID0gbnVsbDtcclxuICBwcml2YXRlIHNob3dRdWFudGl0eVRhYiA6IHN0cmluZyA9IG51bGw7XHJcbiAgcHJpdmF0ZSBjb21wYXJlV29ya0l0ZW1JZDpudW1iZXI9MDtcclxuICBwcml2YXRlIGNvbXBhcmVDYXRlZ29yeUlkOm51bWJlcj0wO1xyXG4gIHByaXZhdGUgcXVhbnRpdHlJdGVtc0FycmF5OiBBcnJheTxRdWFudGl0eUl0ZW0+ID0gW107XHJcbiAgcHJpdmF0ZSByYXRlSXRlbXNBcnJheTogUmF0ZTtcclxuICBwcml2YXRlIGNhdGVnb3J5QXJyYXkgOiBBcnJheTxDYXRlZ29yeT4gPSBbXTtcclxuXHJcbiAgcHJpdmF0ZSB3b3JrSXRlbUxpc3RBcnJheTogQXJyYXk8V29ya0l0ZW0+ID0gW107XHJcbiAgcHJpdmF0ZSBjYXRlZ29yeUxpc3RBcnJheSA6IEFycmF5PENhdGVnb3J5PiA9IFtdO1xyXG4gIHByaXZhdGUgY2F0ZWdvcnlJZEZvckluQWN0aXZlOiBudW1iZXI7XHJcbiAgcHJpdmF0ZSBjdXJyZW50Q2F0ZWdvcnlJbmRleDogbnVtYmVyO1xyXG4gIHByaXZhdGUgY3VycmVudFdvcmtJdGVtSW5kZXg6IG51bWJlcjtcclxuXHJcbiAgcHJpdmF0ZSBkaXNhYmxlUmF0ZUZpZWxkOmJvb2xlYW4gPSBmYWxzZTtcclxuICBwcml2YXRlIHJhdGVWaWV3IDogc3RyaW5nO1xyXG4gIHByaXZhdGUgcHJldmlvdXNSYXRlUXVhbnRpdHk6bnVtYmVyID0gMDtcclxuICBwcml2YXRlIHF1YW50aXR5SW5jcmVtZW50Om51bWJlciA9IDE7XHJcbiAgcHJpdmF0ZSBkaXNwbGF5UmF0ZVZpZXc6IHN0cmluZyA9IG51bGw7XHJcblxyXG4gIHByaXZhdGUgc2VsZWN0ZWRXb3JrSXRlbURhdGEgOiBBcnJheTxXb3JrSXRlbT4gPSBbXTtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29zdFN1bW1hcnlTZXJ2aWNlIDogQ29zdFN1bW1hcnlTZXJ2aWNlLCBwcml2YXRlIGFjdGl2YXRlZFJvdXRlIDogQWN0aXZhdGVkUm91dGUsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlLCBwcml2YXRlIGNvbW1vblNlcnZpY2UgOiBDb21tb25TZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgbG9hZGVyU2VydmljZTogTG9hZGVyU2VydmljZSkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLmFjdGl2YXRlZFJvdXRlLnBhcmFtcy5zdWJzY3JpYmUocGFyYW1zID0+IHtcclxuXHJcbiAgICAgIHRoaXMucHJvamVjdElkID0gcGFyYW1zWydwcm9qZWN0SWQnXTtcclxuICAgICAgdGhpcy52aWV3VHlwZSA9IHBhcmFtc1sndmlld1R5cGUnXTtcclxuICAgICAgdGhpcy52aWV3VHlwZVZhbHVlID0gcGFyYW1zWyd2aWV3VHlwZVZhbHVlJ107XHJcbiAgICAgIHRoaXMuY29zdEhlYWROYW1lID0gcGFyYW1zWydjb3N0SGVhZE5hbWUnXTtcclxuICAgICAgdGhpcy5jb3N0SGVhZElkID0gcGFyc2VJbnQocGFyYW1zWydjb3N0SGVhZElkJ10pO1xyXG5cclxuXHJcbiAgICAgIGlmKHRoaXMudmlld1R5cGUgPT09ICBBUEkuQlVJTERJTkcgKSB7XHJcbiAgICAgICAgbGV0IGJ1aWxkaW5nSWQgPSBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfQlVJTERJTkcpO1xyXG4gICAgICAgIHRoaXMuYmFzZVVybCA9ICcnICtBUEkuUFJPSkVDVCArICcvJyArIHRoaXMucHJvamVjdElkICsgJy8nICsgJycgKyAgQVBJLkJVSUxESU5HKyAnLycgKyBidWlsZGluZ0lkO1xyXG4gICAgICB9IGVsc2UgaWYodGhpcy52aWV3VHlwZSA9PT0gQVBJLkNPTU1PTl9BTUVOSVRJRVMpIHtcclxuICAgICAgICB0aGlzLmJhc2VVcmwgPSAnJyArQVBJLlBST0pFQ1QgKyAnLycgKyB0aGlzLnByb2plY3RJZDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnRXJyb3InKTtcclxuICAgICAgfVxyXG5cclxuICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX0NPU1RfSEVBRF9JRCwgdGhpcy5jb3N0SGVhZElkKTtcclxuICAgICAgdGhpcy5nZXRDYXRlZ29yaWVzKCB0aGlzLnByb2plY3RJZCwgdGhpcy5jb3N0SGVhZElkKTtcclxuXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldENhdGVnb3JpZXMocHJvamVjdElkOiBzdHJpbmcsIGNvc3RIZWFkSWQ6IG51bWJlcikge1xyXG5cclxuICAgIHRoaXMuY29zdFN1bW1hcnlTZXJ2aWNlLmdldENhdGVnb3JpZXModGhpcy5iYXNlVXJsLCBjb3N0SGVhZElkKS5zdWJzY3JpYmUoXHJcbiAgICAgIGNhdGVnb3J5RGV0YWlscyA9PiB0aGlzLm9uR2V0Q2F0ZWdvcmllc1N1Y2Nlc3MoY2F0ZWdvcnlEZXRhaWxzKSxcclxuICAgICAgZXJyb3IgPT4gdGhpcy5vbkdldENhdGVnb3JpZXNGYWlsdXJlKGVycm9yKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIG9uR2V0Q2F0ZWdvcmllc1N1Y2Nlc3MoY2F0ZWdvcnlEZXRhaWxzOiBhbnkpIHtcclxuICAgIHRoaXMuY2F0ZWdvcnlEZXRhaWxzID0gY2F0ZWdvcnlEZXRhaWxzLmRhdGEuY2F0ZWdvcmllcztcclxuICAgIHRoaXMuY2F0ZWdvcnlEZXRhaWxzVG90YWxBbW91bnQgPSBjYXRlZ29yeURldGFpbHMuZGF0YS5jYXRlZ29yaWVzQW1vdW50O1xyXG4gICAgaWYodGhpcy5jYXRlZ29yeVJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgIHRoaXMuZ2V0QWN0aXZlV29ya0l0ZW1zT2ZDYXRlZ29yeSh0aGlzLmNhdGVnb3J5UmF0ZUFuYWx5c2lzSWQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2FsY3VsYXRlQ2F0ZWdvcmllc1RvdGFsKCkge1xyXG5cclxuICAgIHRoaXMuY2F0ZWdvcnlEZXRhaWxzVG90YWxBbW91bnQgPSAwLjA7XHJcblxyXG4gICAgZm9yIChsZXQgY2F0ZWdvcnlEYXRhIG9mIHRoaXMuY2F0ZWdvcnlEZXRhaWxzKSB7XHJcbiAgICAgIHRoaXMuY2F0ZWdvcnlEZXRhaWxzVG90YWxBbW91bnQgPXRoaXMuY2F0ZWdvcnlEZXRhaWxzVG90YWxBbW91bnQgKyBjYXRlZ29yeURhdGEuYW1vdW50O1xyXG4gICAgfVxyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICB9XHJcblxyXG4gIG9uR2V0Q2F0ZWdvcmllc0ZhaWx1cmUoZXJyb3I6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IGFueSkge1xyXG4gICAgaWYgKGNoYW5nZXMuY2F0ZWdvcnlMaXN0QXJyYXkuY3VycmVudFZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5jYXRlZ29yeUxpc3RBcnJheSA9IGNoYW5nZXMuY2F0ZWdvcnlMaXN0QXJyYXkuY3VycmVudFZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0UXVhbnRpdHkoY2F0ZWdvcnlJZDogbnVtYmVyLCB3b3JrSXRlbTogV29ya0l0ZW0sIGNhdGVnb3J5SW5kZXg6IG51bWJlciwgd29ya0l0ZW1JbmRleDpudW1iZXIpIHtcclxuICAgICAgaWYgKCh3b3JrSXRlbS5xdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzLmxlbmd0aCA+IDEpIHx8ICh3b3JrSXRlbS5xdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzLmxlbmd0aCA9PT0gMSAmJlxyXG4gICAgICAgICAgd29ya0l0ZW0ucXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlsc1swXS5uYW1lICE9PSBMYWJlbC5ERUZBVUxUX1ZJRVcpKSB7XHJcbiAgICAgICAgdGhpcy5nZXREZXRhaWxlZFF1YW50aXR5KGNhdGVnb3J5SWQsIHdvcmtJdGVtLCBjYXRlZ29yeUluZGV4LCB3b3JrSXRlbUluZGV4KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmdldERlZmF1bHRRdWFudGl0eShjYXRlZ29yeUlkLCB3b3JrSXRlbSwgY2F0ZWdvcnlJbmRleCwgd29ya0l0ZW1JbmRleCk7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIC8vR2V0IGRldGFpbGVkIHF1YW50aXR5XHJcbiAgZ2V0RGV0YWlsZWRRdWFudGl0eShjYXRlZ29yeUlkOiBudW1iZXIsIHdvcmtJdGVtOiBXb3JrSXRlbSwgY2F0ZWdvcnlJbmRleDogbnVtYmVyLCB3b3JrSXRlbUluZGV4Om51bWJlcikge1xyXG4gICAgaWYoIHRoaXMuc2hvd1F1YW50aXR5VGFiICE9PSBMYWJlbC5XT1JLSVRFTV9ERVRBSUxFRF9RVUFOVElUWV9UQUIgfHxcclxuICAgICAgdGhpcy5jb21wYXJlQ2F0ZWdvcnlJZCAhPT0gY2F0ZWdvcnlJZCB8fCB0aGlzLmNvbXBhcmVXb3JrSXRlbUlkICE9PSB3b3JrSXRlbS5yYXRlQW5hbHlzaXNJZCkge1xyXG5cclxuICAgICAgdGhpcy5zZXRJdGVtSWQoY2F0ZWdvcnlJZCwgd29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQpO1xyXG5cclxuICAgICAgdGhpcy53b3JrSXRlbUlkID0gd29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9XT1JLSVRFTV9JRCwgdGhpcy53b3JrSXRlbUlkKTtcclxuXHJcbiAgICAgIGxldCBxdWFudGl0eURldGFpbHM6IEFycmF5PFF1YW50aXR5RGV0YWlscz4gPSB3b3JrSXRlbS5xdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzO1xyXG4gICAgICB0aGlzLndvcmtJdGVtID0gd29ya0l0ZW07XHJcbiAgICAgIHRoaXMud29ya0l0ZW0ucXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscyA9IFtdO1xyXG4gICAgICBmb3IobGV0IHF1YW50aXR5RGV0YWlsIG9mIHF1YW50aXR5RGV0YWlscykge1xyXG4gICAgICAgIGlmKHF1YW50aXR5RGV0YWlsLm5hbWUgIT09IHRoaXMuZ2V0TGFiZWwoKS5ERUZBVUxUX1ZJRVcpIHtcclxuICAgICAgICAgIHRoaXMud29ya0l0ZW0ucXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscy5wdXNoKHF1YW50aXR5RGV0YWlsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY3VycmVudENhdGVnb3J5SW5kZXggPSBjYXRlZ29yeUluZGV4O1xyXG4gICAgICB0aGlzLmN1cnJlbnRXb3JrSXRlbUluZGV4ID0gd29ya0l0ZW1JbmRleDtcclxuICAgICAgdGhpcy5zaG93UXVhbnRpdHlUYWIgPSBMYWJlbC5XT1JLSVRFTV9ERVRBSUxFRF9RVUFOVElUWV9UQUI7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zaG93V29ya0l0ZW1UYWIgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy9BZGQgYmxhbmsgZGV0YWlsZWQgcXVhbnRpdHkgYXQgbGFzdFxyXG4gIGFkZE5ld0RldGFpbGVkUXVhbnRpdHkoY2F0ZWdvcnlJZDogbnVtYmVyLCB3b3JrSXRlbTogV29ya0l0ZW0sIGNhdGVnb3J5SW5kZXg6IG51bWJlciwgd29ya0l0ZW1JbmRleDpudW1iZXIpIHtcclxuICAgIHRoaXMuc2hvd1dvcmtJdGVtVGFiID0gTGFiZWwuV09SS0lURU1fREVUQUlMRURfUVVBTlRJVFlfVEFCO1xyXG4gICAgdGhpcy5nZXREZXRhaWxlZFF1YW50aXR5KGNhdGVnb3J5SWQsIHdvcmtJdGVtLCBjYXRlZ29yeUluZGV4LCB3b3JrSXRlbUluZGV4KTtcclxuICAgIGxldCBxdWFudGl0eURldGFpbDogUXVhbnRpdHlEZXRhaWxzID0gbmV3IFF1YW50aXR5RGV0YWlscygpO1xyXG4gICAgdGhpcy53b3JrSXRlbS5xdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzLnB1c2gocXVhbnRpdHlEZXRhaWwpO1xyXG4gICAgdGhpcy5zaG93SGlkZVF1YW50aXR5RGV0YWlscyhjYXRlZ29yeUlkLCB3b3JrSXRlbUluZGV4KTtcclxuICB9XHJcblxyXG4gIHNob3dIaWRlUXVhbnRpdHlEZXRhaWxzKGNhdGVnb3J5SWQ6bnVtYmVyLHdvcmtJdGVtSW5kZXg6bnVtYmVyKSB7XHJcbiAgICBpZih0aGlzLmNvbXBhcmVXb3JrSXRlbUlkID09PSB0aGlzLndvcmtJdGVtLnJhdGVBbmFseXNpc0lkICYmIHRoaXMuY29tcGFyZUNhdGVnb3J5SWQgPT09IGNhdGVnb3J5SWQpIHtcclxuICAgICAgdGhpcy5zaG93UXVhbnRpdHlEZXRhaWxzID0gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2hvd1F1YW50aXR5RGV0YWlscyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy9HZXQgRGVmYXVsdCBRdWFudGl0eSAoSWYgZmxvb3Igd2lzZSBvciBidWlsZGluZyB3aXNlIHF1YW50aXR5IGlzIG5vdCBhZGRlZClcclxuICBnZXREZWZhdWx0UXVhbnRpdHkoY2F0ZWdvcnlJZDogbnVtYmVyLCB3b3JrSXRlbTogV29ya0l0ZW0sIGNhdGVnb3J5SW5kZXg6IG51bWJlciwgd29ya0l0ZW1JbmRleDpudW1iZXIpIHtcclxuXHJcbiAgICBpZiggdGhpcy5zaG93V29ya0l0ZW1UYWIgIT09IExhYmVsLldPUktJVEVNX1FVQU5USVRZX1RBQiB8fCB0aGlzLmNvbXBhcmVDYXRlZ29yeUlkICE9PSBjYXRlZ29yeUlkIHx8XHJcbiAgICAgIHRoaXMuY29tcGFyZVdvcmtJdGVtSWQgIT09IHdvcmtJdGVtLnJhdGVBbmFseXNpc0lkKSB7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0SXRlbUlkKGNhdGVnb3J5SWQsIHdvcmtJdGVtLnJhdGVBbmFseXNpc0lkKTtcclxuICAgICAgICB0aGlzLndvcmtJdGVtSWQgPSB3b3JrSXRlbS5yYXRlQW5hbHlzaXNJZDtcclxuICAgICAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfV09SS0lURU1fSUQsIHRoaXMud29ya0l0ZW1JZCk7XHJcbiAgICAgICAgdGhpcy53b3JrSXRlbSA9IHdvcmtJdGVtO1xyXG4gICAgICAgIGxldCBxdWFudGl0eURldGFpbHM6IEFycmF5PFF1YW50aXR5RGV0YWlscz4gPSB3b3JrSXRlbS5xdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzO1xyXG5cclxuICAgICAgICBpZiggcXVhbnRpdHlEZXRhaWxzLmxlbmd0aCAhPT0wICkge1xyXG4gICAgICAgICAgICB0aGlzLndvcmtJdGVtLnF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMgPSBbXTtcclxuICAgICAgICAgICAgbGV0IGRlZmF1bHRRdWFudGl0eURldGFpbCA9IHF1YW50aXR5RGV0YWlscy5maWx0ZXIoXHJcbiAgICAgICAgICAgICAgZnVuY3Rpb24oIGRlZmF1bHRRdWFudGl0eURldGFpbDogYW55KXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZhdWx0UXVhbnRpdHlEZXRhaWwubmFtZSA9PT0gTGFiZWwuREVGQVVMVF9WSUVXO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLndvcmtJdGVtLnF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMgPSBkZWZhdWx0UXVhbnRpdHlEZXRhaWw7XHJcbiAgICAgICAgICAgIHRoaXMucXVhbnRpdHlJdGVtc0FycmF5ID0gbG9kc2guY2xvbmVEZWVwKGRlZmF1bHRRdWFudGl0eURldGFpbFswXS5xdWFudGl0eUl0ZW1zKTtcclxuICAgICAgICAgICAgdGhpcy5rZXlRdWFudGl0eSA9IGRlZmF1bHRRdWFudGl0eURldGFpbFswXS5uYW1lO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBxdWFudGl0eURldGFpbDogUXVhbnRpdHlEZXRhaWxzID0gbmV3IFF1YW50aXR5RGV0YWlscygpO1xyXG4gICAgICAgICAgICBxdWFudGl0eURldGFpbC5xdWFudGl0eUl0ZW1zID0gW107XHJcbiAgICAgICAgICAgIHF1YW50aXR5RGV0YWlsLm5hbWUgPSB0aGlzLmdldExhYmVsKCkuREVGQVVMVF9WSUVXO1xyXG4gICAgICAgICAgICB0aGlzLndvcmtJdGVtLnF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMucHVzaChxdWFudGl0eURldGFpbCk7XHJcbiAgICAgICAgICAgIHRoaXMucXVhbnRpdHlJdGVtc0FycmF5ID0gW107XHJcbiAgICAgICAgICAgIHRoaXMua2V5UXVhbnRpdHkgPSB0aGlzLmdldExhYmVsKCkuREVGQVVMVF9WSUVXO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50Q2F0ZWdvcnlJbmRleCA9IGNhdGVnb3J5SW5kZXg7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50V29ya0l0ZW1JbmRleCA9IHdvcmtJdGVtSW5kZXg7XHJcbiAgICAgICAgdGhpcy5zaG93V29ya0l0ZW1UYWIgPSBMYWJlbC5XT1JLSVRFTV9RVUFOVElUWV9UQUI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNob3dXb3JrSXRlbVRhYiA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBHZXQgUmF0ZVxyXG4gIGdldFJhdGUoZGlzcGxheVJhdGVWaWV3IDogc3RyaW5nLCBjYXRlZ29yeUlkOm51bWJlciwgd29ya0l0ZW1JZDpudW1iZXIsIHdvcmtJdGVtIDogV29ya0l0ZW0sIGRpc2FibGVSYXRlRmllbGQgOiBib29sZWFuLFxyXG4gICAgICAgICAgY2F0ZWdvcnlJbmRleCA6IG51bWJlciwgd29ya0l0ZW1JbmRleCA6IG51bWJlciApIHtcclxuXHJcbiAgICBpZih0aGlzLnNob3dXb3JrSXRlbVRhYiAhPT0gTGFiZWwuV09SS0lURU1fUkFURV9UQUIgfHwgdGhpcy5kaXNwbGF5UmF0ZVZpZXcgIT09IGRpc3BsYXlSYXRlVmlldyB8fFxyXG4gICAgICB0aGlzLmNvbXBhcmVDYXRlZ29yeUlkICE9PSBjYXRlZ29yeUlkIHx8IHRoaXMuY29tcGFyZVdvcmtJdGVtSWQgIT09IHdvcmtJdGVtSWQpIHtcclxuXHJcbiAgICAgIHRoaXMuc2V0SXRlbUlkKGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQpO1xyXG4gICAgICB0aGlzLnNldFdvcmtJdGVtRGF0YUZvclJhdGVWaWV3KHdvcmtJdGVtLnJhdGVBbmFseXNpc0lkLCB3b3JrSXRlbS5yYXRlKTtcclxuICAgICAgdGhpcy5jdXJyZW50Q2F0ZWdvcnlJbmRleCA9IGNhdGVnb3J5SW5kZXg7XHJcbiAgICAgIHRoaXMuY3VycmVudFdvcmtJdGVtSW5kZXggPSB3b3JrSXRlbUluZGV4O1xyXG4gICAgICB0aGlzLnJhdGVWaWV3ID0gTGFiZWwuV09SS0lURU1fUkFURV9UQUI7XHJcbiAgICAgIHRoaXMuc2V0UmF0ZUZsYWdzKGRpc3BsYXlSYXRlVmlldywgZGlzYWJsZVJhdGVGaWVsZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNob3dXb3JrSXRlbVRhYiA9IG51bGw7XHJcbiAgICAgIHRoaXMuZGlzcGxheVJhdGVWaWV3ID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEdldCBSYXRlIGJ5IHF1YW50aXR5XHJcbiAgZ2V0UmF0ZUJ5UXVhbnRpdHkoZGlzcGxheVJhdGVWaWV3IDogc3RyaW5nLCBjYXRlZ29yeUlkOm51bWJlciwgd29ya0l0ZW1JZDpudW1iZXIsIHdvcmtJdGVtIDogV29ya0l0ZW0sXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZVJhdGVGaWVsZCA6IGJvb2xlYW4gLCBjYXRlZ29yeUluZGV4Om51bWJlciwgd29ya0l0ZW1JbmRleCA6IG51bWJlcikge1xyXG4gICAgaWYodGhpcy5zaG93V29ya0l0ZW1UYWIgIT09IExhYmVsLldPUktJVEVNX1JBVEVfVEFCIHx8IHRoaXMuZGlzcGxheVJhdGVWaWV3ICE9PSBkaXNwbGF5UmF0ZVZpZXcgfHxcclxuICAgICAgdGhpcy5jb21wYXJlQ2F0ZWdvcnlJZCAhPT0gY2F0ZWdvcnlJZCB8fCB0aGlzLmNvbXBhcmVXb3JrSXRlbUlkICE9PSB3b3JrSXRlbUlkKSB7XHJcblxyXG4gICAgICB0aGlzLnNldEl0ZW1JZChjYXRlZ29yeUlkLCB3b3JrSXRlbUlkKTtcclxuICAgICAgdGhpcy5zZXRXb3JrSXRlbURhdGFGb3JSYXRlVmlldyh3b3JrSXRlbS5yYXRlQW5hbHlzaXNJZCwgd29ya0l0ZW0ucmF0ZSk7XHJcbiAgICAgIHRoaXMuY2FsY3VsYXRlUXVhbnRpdHkod29ya0l0ZW0pO1xyXG4gICAgICB0aGlzLnNldFJhdGVGbGFncyhkaXNwbGF5UmF0ZVZpZXcsIGRpc2FibGVSYXRlRmllbGQpO1xyXG4gICAgICB0aGlzLnJhdGVWaWV3ID0gTGFiZWwuV09SS0lURU1fUkFURV9CWV9RVUFOVElUWV9UQUI7XHJcbiAgICAgIHRoaXMuY3VycmVudENhdGVnb3J5SW5kZXggPSBjYXRlZ29yeUluZGV4O1xyXG4gICAgICB0aGlzLmN1cnJlbnRXb3JrSXRlbUluZGV4ID0gd29ya0l0ZW1JbmRleDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2hvd1dvcmtJdGVtVGFiID0gbnVsbDtcclxuICAgICAgdGhpcy5kaXNwbGF5UmF0ZVZpZXcgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gR2V0IFN5c3RlbSByYXRlXHJcbiAgZ2V0U3lzdGVtUmF0ZShkaXNwbGF5UmF0ZVZpZXcgOiBzdHJpbmcsIGNhdGVnb3J5SWQ6bnVtYmVyLCB3b3JrSXRlbUlkOm51bWJlciwgd29ya0l0ZW0gOiBXb3JrSXRlbSxcclxuICAgICAgICAgICAgICAgIGRpc2FibGVSYXRlRmllbGQgOiBib29sZWFuLCBjYXRlZ29yeUluZGV4Om51bWJlciwgd29ya0l0ZW1JbmRleCA6IG51bWJlcikge1xyXG5cclxuICAgIGlmKHRoaXMuc2hvd1dvcmtJdGVtVGFiICE9PSBMYWJlbC5XT1JLSVRFTV9SQVRFX1RBQiB8fCB0aGlzLmRpc3BsYXlSYXRlVmlldyAhPT0gZGlzcGxheVJhdGVWaWV3IHx8XHJcbiAgICAgIHRoaXMuY29tcGFyZUNhdGVnb3J5SWQgIT09IGNhdGVnb3J5SWQgfHwgdGhpcy5jb21wYXJlV29ya0l0ZW1JZCAhPT0gd29ya0l0ZW1JZCkge1xyXG5cclxuICAgICAgdGhpcy5zZXRJdGVtSWQoY2F0ZWdvcnlJZCwgd29ya0l0ZW1JZCk7XHJcbiAgICAgIHRoaXMuc2V0V29ya0l0ZW1EYXRhRm9yUmF0ZVZpZXcod29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQsIHdvcmtJdGVtLnN5c3RlbVJhdGUpO1xyXG4gICAgICB0aGlzLnJhdGVWaWV3ID0gTGFiZWwuV09SS0lURU1fU1lTVEVNX1JBVEVfVEFCO1xyXG4gICAgICB0aGlzLmN1cnJlbnRDYXRlZ29yeUluZGV4ID0gY2F0ZWdvcnlJbmRleDtcclxuICAgICAgdGhpcy5jdXJyZW50V29ya0l0ZW1JbmRleCA9IHdvcmtJdGVtSW5kZXg7XHJcbiAgICAgIHRoaXMuc2V0UmF0ZUZsYWdzKGRpc3BsYXlSYXRlVmlldywgZGlzYWJsZVJhdGVGaWVsZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNob3dXb3JrSXRlbVRhYiA9IG51bGw7XHJcbiAgICAgIHRoaXMuZGlzcGxheVJhdGVWaWV3ID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldEl0ZW1JZChjYXRlZ29yeUlkOm51bWJlciwgd29ya0l0ZW1JZDpudW1iZXIpIHtcclxuICAgIHRoaXMuY29tcGFyZUNhdGVnb3J5SWQgPSBjYXRlZ29yeUlkO1xyXG4gICAgdGhpcy5jb21wYXJlV29ya0l0ZW1JZCA9IHdvcmtJdGVtSWQ7XHJcbiAgfVxyXG5cclxuICBjbG9zZURldGFpbGVkUXVhbnRpdHlUYWIoKSB7XHJcbiAgICB0aGlzLnNob3dRdWFudGl0eVRhYiA9IG51bGw7XHJcbiAgfVxyXG5cclxuICBjbG9zZVF1YW50aXR5VGFiKCkge1xyXG4gICAgdGhpcy5zaG93V29ya0l0ZW1UYWIgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgc2V0UmF0ZUZsYWdzKGRpc3BsYXlSYXRlVmlldyA6IHN0cmluZywgZGlzYWJsZVJhdGVGaWVsZCA6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuZGlzcGxheVJhdGVWaWV3ID0gZGlzcGxheVJhdGVWaWV3O1xyXG4gICAgdGhpcy5kaXNhYmxlUmF0ZUZpZWxkPWRpc2FibGVSYXRlRmllbGQ7XHJcbiAgICB0aGlzLnNob3dXb3JrSXRlbVRhYiA9IExhYmVsLldPUktJVEVNX1JBVEVfVEFCO1xyXG4gIH1cclxuXHJcbiAgc2V0V29ya0l0ZW1EYXRhRm9yUmF0ZVZpZXcod29ya0l0ZW1JZCA6IG51bWJlciwgcmF0ZSA6IFJhdGUpIHtcclxuICAgIHRoaXMud29ya0l0ZW1JZCA9IHdvcmtJdGVtSWQ7XHJcbiAgICAgIHRoaXMucmF0ZUl0ZW1zQXJyYXkgPSBsb2RzaC5jbG9uZURlZXAocmF0ZSk7XHJcbiAgICAgIHRoaXMudW5pdCA9IGxvZHNoLmNsb25lRGVlcChyYXRlLnVuaXQpO1xyXG4gICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1dPUktJVEVNX0lELCB0aGlzLndvcmtJdGVtSWQpO1xyXG4gIH1cclxuXHJcbiAgY2FsY3VsYXRlUXVhbnRpdHkod29ya0l0ZW0gOiBXb3JrSXRlbSkge1xyXG4gICAgdGhpcy5wcmV2aW91c1JhdGVRdWFudGl0eSA9IGxvZHNoLmNsb25lRGVlcCh3b3JrSXRlbS5yYXRlLnF1YW50aXR5KTtcclxuICAgIHRoaXMucmF0ZUl0ZW1zQXJyYXkucXVhbnRpdHkgPSBsb2RzaC5jbG9uZURlZXAod29ya0l0ZW0ucXVhbnRpdHkudG90YWwpO1xyXG4gICAgdGhpcy5xdWFudGl0eUluY3JlbWVudCA9IHRoaXMucmF0ZUl0ZW1zQXJyYXkucXVhbnRpdHkgLyB0aGlzLnByZXZpb3VzUmF0ZVF1YW50aXR5O1xyXG4gICAgZm9yIChsZXQgcmF0ZUl0ZW1zSW5kZXggPSAwOyByYXRlSXRlbXNJbmRleCA8IHRoaXMucmF0ZUl0ZW1zQXJyYXkucmF0ZUl0ZW1zLmxlbmd0aDsgcmF0ZUl0ZW1zSW5kZXgrKykge1xyXG4gICAgICB0aGlzLnJhdGVJdGVtc0FycmF5LnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0ucXVhbnRpdHkgPSBwYXJzZUZsb2F0KChcclxuICAgICAgICB0aGlzLnJhdGVJdGVtc0FycmF5LnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0ucXVhbnRpdHkgKlxyXG4gICAgICAgIHRoaXMucXVhbnRpdHlJbmNyZW1lbnQpLnRvRml4ZWQoVmFsdWVDb25zdGFudC5OVU1CRVJfT0ZfRlJBQ1RJT05fRElHSVQpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldElkc0ZvckRlbGV0ZVdvcmtJdGVtKGNhdGVnb3J5SWQ6IHN0cmluZywgd29ya0l0ZW1JZDogc3RyaW5nLHdvcmtJdGVtSW5kZXg6bnVtYmVyKSB7XHJcbiAgICB0aGlzLmNhdGVnb3J5SWQgPSBwYXJzZUludChjYXRlZ29yeUlkKTtcclxuICAgIHRoaXMud29ya0l0ZW1JZCA9ICBwYXJzZUludCh3b3JrSXRlbUlkKTtcclxuICAgIHRoaXMuY29tcGFyZVdvcmtJdGVtSWQgPSB3b3JrSXRlbUluZGV4O1xyXG4gIH1cclxuXHJcbiAgZGVhY3RpdmF0ZVdvcmtJdGVtKCkge1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0YXJ0KCk7XHJcbiAgICBsZXQgY29zdEhlYWRJZD1wYXJzZUludChTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfQ09TVF9IRUFEX0lEKSk7XHJcbiAgICB0aGlzLmNvc3RTdW1tYXJ5U2VydmljZS5kZWFjdGl2YXRlV29ya0l0ZW0oIHRoaXMuYmFzZVVybCwgY29zdEhlYWRJZCwgdGhpcy5jYXRlZ29yeUlkLCB0aGlzLndvcmtJdGVtSWQgKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgc3VjY2VzcyA9PiB0aGlzLm9uRGVBY3RpdmF0ZVdvcmtJdGVtU3VjY2VzcyhzdWNjZXNzKSxcclxuICAgICAgZXJyb3IgPT4gdGhpcy5vbkRlQWN0aXZhdGVXb3JrSXRlbUZhaWx1cmUoZXJyb3IpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgb25EZUFjdGl2YXRlV29ya0l0ZW1TdWNjZXNzKHN1Y2Nlc3M6IHN0cmluZykge1xyXG5cclxuICAgIHRoaXMuc2hvd1dvcmtJdGVtTGlzdCA9IGZhbHNlO1xyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgbWVzc2FnZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfREVMRVRFX1dPUktJVEVNO1xyXG4gICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG5cclxuICAgIHRoaXMud29ya0l0ZW1zTGlzdC5zcGxpY2UodGhpcy5jb21wYXJlV29ya0l0ZW1JZCwgMSk7XHJcblxyXG4gICAgdGhpcy5jYXRlZ29yeURldGFpbHNUb3RhbEFtb3VudCA9IHRoaXMuY29tbW9uU2VydmljZS50b3RhbENhbGN1bGF0aW9uT2ZDYXRlZ29yaWVzKHRoaXMuY2F0ZWdvcnlEZXRhaWxzLFxyXG4gICAgICB0aGlzLmNhdGVnb3J5UmF0ZUFuYWx5c2lzSWQsIHRoaXMud29ya0l0ZW1zTGlzdCk7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgb25EZUFjdGl2YXRlV29ya0l0ZW1GYWlsdXJlKGVycm9yOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKCdJbkFjdGl2ZSBXb3JrSXRlbSBlcnJvciA6ICcrSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdG9wKCk7XHJcbiAgfVxyXG5cclxuICBnZXRJbkFjdGl2ZVdvcmtJdGVtcyhjYXRlZ29yeUlkOm51bWJlciwgY2F0ZWdvcnlJbmRleDpudW1iZXIpIHtcclxuXHJcbiAgICB0aGlzLmNvbXBhcmVXb3JrSXRlbVJhdGVBbmFseXNpc0lkID0gY2F0ZWdvcnlJbmRleDtcclxuICAgIHRoaXMuY2F0ZWdvcnlSYXRlQW5hbHlzaXNJZCA9IGNhdGVnb3J5SWQ7XHJcblxyXG4gICAgdGhpcy5jb3N0U3VtbWFyeVNlcnZpY2UuZ2V0SW5BY3RpdmVXb3JrSXRlbXMoIHRoaXMuYmFzZVVybCwgdGhpcy5jb3N0SGVhZElkLCBjYXRlZ29yeUlkKS5zdWJzY3JpYmUoXHJcbiAgICAgIHdvcmtJdGVtTGlzdCA9PiB0aGlzLm9uR2V0SW5BY3RpdmVXb3JrSXRlbXNTdWNjZXNzKHdvcmtJdGVtTGlzdCksXHJcbiAgICAgIGVycm9yID0+IHRoaXMub25HZXRJbkFjdGl2ZVdvcmtJdGVtc0ZhaWx1cmUoZXJyb3IpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgb25HZXRJbkFjdGl2ZVdvcmtJdGVtc1N1Y2Nlc3Mod29ya0l0ZW1MaXN0OmFueSkge1xyXG4gICAgaWYgKHdvcmtJdGVtTGlzdC5kYXRhLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICB0aGlzLndvcmtJdGVtTGlzdEFycmF5ID0gd29ya0l0ZW1MaXN0LmRhdGE7XHJcbiAgICAgIHRoaXMuc2hvd1dvcmtJdGVtTGlzdCA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX0FMUkVBRFlfQURERURfQUxMX1dPUktJVEVNUztcclxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25HZXRJbkFjdGl2ZVdvcmtJdGVtc0ZhaWx1cmUoZXJyb3I6YW55KSB7XHJcbiAgICBjb25zb2xlLmxvZygnR2V0IFdvcmtJdGVtTGlzdCBlcnJvciA6ICcrZXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgb25DaGFuZ2VBY3RpdmF0ZVNlbGVjdGVkV29ya0l0ZW0oc2VsZWN0ZWRXb3JrSXRlbTphbnkpIHtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdGFydCgpO1xyXG4gICAgdGhpcy5zaG93V29ya0l0ZW1MaXN0PWZhbHNlO1xyXG4gICAgbGV0IHdvcmtJdGVtTGlzdOKAguKAgj3igILigIJ0aGlzLndvcmtJdGVtTGlzdEFycmF5O1xyXG4gICAgbGV0IHdvcmtJdGVtT2JqZWN0ID0gd29ya0l0ZW1MaXN0LmZpbHRlcihcclxuICAgICAgZnVuY3Rpb24oIHdvcmtJdGVtT2JqOiBhbnkpe1xyXG4gICAgICAgIHJldHVybiB3b3JrSXRlbU9iai5uYW1lID09PSBzZWxlY3RlZFdvcmtJdGVtO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB0aGlzLnNlbGVjdGVkV29ya0l0ZW1EYXRhWzBdID0gd29ya0l0ZW1PYmplY3RbMF07XHJcblxyXG4gICAgbGV0IGNhdGVnb3J5SWQ9dGhpcy5jYXRlZ29yeVJhdGVBbmFseXNpc0lkO1xyXG5cclxuICAgIHRoaXMuY29zdFN1bW1hcnlTZXJ2aWNlLmFjdGl2YXRlV29ya0l0ZW0oIHRoaXMuYmFzZVVybCwgdGhpcy5jb3N0SGVhZElkLCBjYXRlZ29yeUlkLFxyXG4gICAgICB3b3JrSXRlbU9iamVjdFswXS5yYXRlQW5hbHlzaXNJZCkuc3Vic2NyaWJlKFxyXG4gICAgICBzdWNjZXNzID0+IHRoaXMub25BY3RpdmF0ZVdvcmtJdGVtU3VjY2VzcyhzdWNjZXNzKSxcclxuICAgICAgZXJyb3IgPT4gdGhpcy5vbkFjdGl2YXRlV29ya0l0ZW1GYWlsdXJlKGVycm9yKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIG9uQWN0aXZhdGVXb3JrSXRlbVN1Y2Nlc3Moc3VjY2VzcyA6IHN0cmluZykge1xyXG5cclxuICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0FERF9XT1JLSVRFTTtcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuXHJcblxyXG4gICAgdGhpcy53b3JrSXRlbXNMaXN0ID0gdGhpcy53b3JrSXRlbXNMaXN0LmNvbmNhdCh0aGlzLnRvdGFsQ2FsY3VsYXRpb25PZldvcmtJdGVtc0xpc3QodGhpcy5zZWxlY3RlZFdvcmtJdGVtRGF0YSkpO1xyXG4gICAgdGhpcy5jYXRlZ29yeURldGFpbHNUb3RhbEFtb3VudCA9IHRoaXMuY29tbW9uU2VydmljZS50b3RhbENhbGN1bGF0aW9uT2ZDYXRlZ29yaWVzKHRoaXMuY2F0ZWdvcnlEZXRhaWxzLFxyXG4gICAgICB0aGlzLmNhdGVnb3J5UmF0ZUFuYWx5c2lzSWQsIHRoaXMud29ya0l0ZW1zTGlzdCk7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgb25BY3RpdmF0ZVdvcmtJdGVtRmFpbHVyZShlcnJvcjphbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKCdBY3RpdmUgV29ya0l0ZW0gZXJyb3IgOiAnK2Vycm9yKTtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdG9wKCk7XHJcbiAgfVxyXG5cclxuICBzZXRDYXRlZ29yeUlkRm9yRGVhY3RpdmF0ZShjYXRlZ29yeUlkIDogYW55KSB7XHJcbiAgICB0aGlzLmNhdGVnb3J5SWRGb3JJbkFjdGl2ZSA9IGNhdGVnb3J5SWQ7XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VEaXJlY3RRdWFudGl0eShjYXRlZ29yeUlkIDogbnVtYmVyLCB3b3JrSXRlbUlkOiBudW1iZXIsIGRpcmVjdFF1YW50aXR5IDogbnVtYmVyKSB7XHJcbiAgICBpZihkaXJlY3RRdWFudGl0eSAhPT0gbnVsbCB8fCBkaXJlY3RRdWFudGl0eSAhPT0gMCkge1xyXG4gICAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RhcnQoKTtcclxuICAgICAgdGhpcy5jb3N0U3VtbWFyeVNlcnZpY2UudXBkYXRlRGlyZWN0UXVhbnRpdHlBbW91bnQodGhpcy5iYXNlVXJsLCB0aGlzLmNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIGRpcmVjdFF1YW50aXR5KS5zdWJzY3JpYmUoXHJcbiAgICAgICAgd29ya0l0ZW1MaXN0ID0+IHRoaXMub25DaGFuZ2VEaXJlY3RRdWFudGl0eVN1Y2Nlc3Mod29ya0l0ZW1MaXN0KSxcclxuICAgICAgICBlcnJvciA9PiB0aGlzLm9uQ2hhbmdlRGlyZWN0UXVhbnRpdHlGYWlsdXJlKGVycm9yKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25DaGFuZ2VEaXJlY3RRdWFudGl0eVN1Y2Nlc3Moc3VjY2VzcyA6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coJ3N1Y2Nlc3MgOiAnK0pTT04uc3RyaW5naWZ5KHN1Y2Nlc3MpKTtcclxuICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX1VQREFURV9ESVJFQ1RfUVVBTlRJVFlfT0ZfV09SS0lURU07XHJcbiAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB0aGlzLnJlZnJlc2hXb3JrSXRlbUxpc3QoKTtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdG9wKCk7XHJcbiAgfVxyXG5cclxuICBvbkNoYW5nZURpcmVjdFF1YW50aXR5RmFpbHVyZShlcnJvciA6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coJ2Vycm9yIDogJytKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICB9XHJcblxyXG4gIGNoYW5nZURpcmVjdFJhdGUoY2F0ZWdvcnlJZCA6IG51bWJlciwgd29ya0l0ZW1JZDogbnVtYmVyLCBkaXJlY3RSYXRlIDogbnVtYmVyKSB7XHJcbiAgICBpZihkaXJlY3RSYXRlICE9PSBudWxsIHx8IGRpcmVjdFJhdGUgIT09IDApIHtcclxuICAgICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0YXJ0KCk7XHJcbiAgICAgIHRoaXMuY29zdFN1bW1hcnlTZXJ2aWNlLnVwZGF0ZURpcmVjdFJhdGUodGhpcy5iYXNlVXJsLCB0aGlzLmNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQsIGRpcmVjdFJhdGUpLnN1YnNjcmliZShcclxuICAgICAgICBzdWNjZXNzID0+IHRoaXMub25VcGRhdGVEaXJlY3RSYXRlU3VjY2VzcyhzdWNjZXNzKSxcclxuICAgICAgICBlcnJvciA9PiB0aGlzLm9uVXBkYXRlRGlyZWN0UmF0ZUZhaWx1cmUoZXJyb3IpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvblVwZGF0ZURpcmVjdFJhdGVTdWNjZXNzKHN1Y2Nlc3MgOiBhbnkpIHtcclxuICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX1VQREFURV9ESVJFQ1RfUkFURV9PRl9XT1JLSVRFTTtcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIHRoaXMucmVmcmVzaFdvcmtJdGVtTGlzdCgpO1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICB9XHJcblxyXG4gIG9uVXBkYXRlRGlyZWN0UmF0ZUZhaWx1cmUoZXJyb3IgOiBhbnkpIHtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdG9wKCk7XHJcbiAgfVxyXG5cclxuICByZWZyZXNoQ2F0ZWdvcnlMaXN0KCkge1xyXG4gICAgdGhpcy5nZXRDYXRlZ29yaWVzKCB0aGlzLnByb2plY3RJZCwgdGhpcy5jb3N0SGVhZElkKTtcclxuICAgIHRoaXMuc2hvd1dvcmtJdGVtVGFiID0gbnVsbDtcclxuICAgIHRoaXMuc2hvd1F1YW50aXR5VGFiID0gbnVsbDtcclxuICAgIHRoaXMuZGlzcGxheVJhdGVWaWV3ID0gbnVsbDtcclxuICB9XHJcblxyXG4gIHJlZnJlc2hXb3JrSXRlbUxpc3QoKSB7XHJcbiAgICB0aGlzLnJlZnJlc2hDYXRlZ29yeUxpc3QoKTtcclxuICB9XHJcblxyXG4vKiAgc2V0U2VsZWN0ZWRXb3JrSXRlbXMod29ya0l0ZW1MaXN0OmFueSkge1xyXG4gICAgdGhpcy5zZWxlY3RlZFdvcmtJdGVtcyA9IHdvcmtJdGVtTGlzdDtcclxuICB9Ki9cclxuXHJcbiAgICBnZXRBY3RpdmVXb3JrSXRlbXNPZkNhdGVnb3J5KGNhdGVnb3J5SWQgOiBudW1iZXIpIHtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfQ09TVF9IRUFEX0lEKSk7XHJcbiAgICAgIHRoaXMuY2F0ZWdvcnlJZCA9IGNhdGVnb3J5SWQ7XHJcbiAgICAgIHRoaXMuY2F0ZWdvcnlSYXRlQW5hbHlzaXNJZCA9IGNhdGVnb3J5SWQ7XHJcbiAgICAgIHRoaXMuY29zdFN1bW1hcnlTZXJ2aWNlLmdldEFjdGl2ZVdvcmtJdGVtc09mQ2F0ZWdvcnkoIHRoaXMuYmFzZVVybCwgY29zdEhlYWRJZCwgdGhpcy5jYXRlZ29yeUlkKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgd29ya0l0ZW1zTGlzdCA9PiB0aGlzLm9uR2V0QWN0aXZlV29ya0l0ZW1zT2ZDYXRlZ29yeVN1Y2Nlc3Mod29ya0l0ZW1zTGlzdCksXHJcbiAgICAgICAgZXJyb3IgPT4gdGhpcy5vbkdldEFjdGl2ZVdvcmtJdGVtc09mQ2F0ZWdvcnlGYWlsdXJlKGVycm9yKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICBvbkdldEFjdGl2ZVdvcmtJdGVtc09mQ2F0ZWdvcnlTdWNjZXNzKHdvcmtJdGVtc0xpc3QgOiBhbnkpIHtcclxuICAgIHRoaXMud29ya0l0ZW1zTGlzdCA9IHdvcmtJdGVtc0xpc3QuZGF0YTtcclxuICB9XHJcblxyXG4gIC8vIGNhbGN1bGF0aW9uIG9mIFF1YW50aXR5ICogUmF0ZVxyXG4gIHRvdGFsQ2FsY3VsYXRpb25PZldvcmtJdGVtc0xpc3Qod29ya0l0ZW1zTGlzdCA6IGFueSkge1xyXG4gICAgICBmb3IobGV0IHdvcmtJdGVtRGF0YSBvZiB3b3JrSXRlbXNMaXN0KSB7XHJcbiAgICAgICAgd29ya0l0ZW1EYXRhLmFtb3VudCA9IHRoaXMuY29tbW9uU2VydmljZS5jYWxjdWxhdGVBbW91bnRPZldvcmtJdGVtKHdvcmtJdGVtRGF0YS5xdWFudGl0eS50b3RhbCwgd29ya0l0ZW1EYXRhLnJhdGUudG90YWwpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB3b3JrSXRlbXNMaXN0O1xyXG4gIH1cclxuXHJcbiAgb25HZXRBY3RpdmVXb3JrSXRlbXNPZkNhdGVnb3J5RmFpbHVyZShlcnJvciA6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coJ29uR2V0QWN0aXZlV29ya0l0ZW1zT2ZDYXRlZ29yeUZhaWx1cmUgZXJyb3IgOiAnK0pTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgZGVsZXRlRWxlbWVudChlbGVtZW50VHlwZSA6IHN0cmluZykge1xyXG4gICAgaWYoZWxlbWVudFR5cGUgPT09IFByb2plY3RFbGVtZW50cy5RVUFOVElUWV9ERVRBSUxTKSB7XHJcbiAgICAgIHRoaXMuY2hpbGQuZGVsZXRlUXVhbnRpdHlEZXRhaWxzQnlOYW1lKCk7XHJcbiAgICB9XHJcbiAgICBpZihlbGVtZW50VHlwZSA9PT0gUHJvamVjdEVsZW1lbnRzLldPUktfSVRFTSkge1xyXG4gICAgICB0aGlzLmRlYWN0aXZhdGVXb3JrSXRlbSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAvKiB1cGRhdGVFbGVtZW50KHF1YW50aXR5VHlwZSA6IHN0cmluZykge1xyXG4gICAgICBpZihxdWFudGl0eVR5cGUgPT09IFByb2plY3RFbGVtZW50cy5ESVJFQ1RfUVVBTlRJVFkpIHtcclxuICAgICAgICB0aGlzLmNoYW5nZURpcmVjdFF1YW50aXR5KCk7XHJcbiAgICAgIH1cclxuICB9Ki9cclxuXHJcbiAgZ29CYWNrKCkge1xyXG4gICAgbGV0IHByb2plY3RJZCA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbTmF2aWdhdGlvblJvdXRlcy5BUFBfUFJPSkVDVCxwcm9qZWN0SWQsTmF2aWdhdGlvblJvdXRlcy5BUFBfQ09TVF9TVU1NQVJZXSk7XHJcbiAgfVxyXG5cclxuICBnZXRUYWJsZUhlYWRpbmdzKCkge1xyXG4gICAgcmV0dXJuIFRhYmxlSGVhZGluZ3M7XHJcbiAgfVxyXG5cclxuICBnZXRCdXR0b24oKSB7XHJcbiAgICByZXR1cm4gQnV0dG9uO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGFiZWwoKSB7XHJcbiAgICByZXR1cm4gTGFiZWw7XHJcbiAgfVxyXG5cclxuICBzZXRDYXRlZ29yaWVzVG90YWwoIGNhdGVnb3JpZXNUb3RhbCA6IG51bWJlcikge1xyXG4gICAgdGhpcy5jYXRlZ29yeURldGFpbHNUb3RhbEFtb3VudCA9IGNhdGVnb3JpZXNUb3RhbDtcclxuICAgIHRoaXMucmVmcmVzaENhdGVnb3J5TGlzdCgpO1xyXG4gIH1cclxuXHJcbiAgc2V0U2hvd1dvcmtJdGVtVGFiKCB0YWJOYW1lIDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnNob3dXb3JrSXRlbVRhYiA9IHRhYk5hbWU7XHJcbiAgfVxyXG5cclxuICBjbG9zZVJhdGVWaWV3KCkge1xyXG4gICAgdGhpcy5zaG93V29ya0l0ZW1UYWIgPSBudWxsO1xyXG4gICAgdGhpcy5kaXNwbGF5UmF0ZVZpZXcgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgY2xvc2VRdWFudGl0eVZpZXcoKSB7XHJcbiAgICB0aGlzLnNob3dRdWFudGl0eVRhYiA9IG51bGw7XHJcbiAgICB0aGlzLnNob3dXb3JrSXRlbVRhYiA9IG51bGw7XHJcbiAgfVxyXG59XHJcbiJdfQ==
