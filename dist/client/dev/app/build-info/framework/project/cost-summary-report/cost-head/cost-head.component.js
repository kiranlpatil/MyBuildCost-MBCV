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
        this.ratePerUnitAmount = 0;
        this.totalAmount = 0;
        this.totalAmountOfMaterial = 0;
        this.totalAmountOfLabour = 0;
        this.totalAmountOfMaterialAndLabour = 0;
        this.quantity = 0;
        this.rateFromRateAnalysis = 0;
        this.unit = '';
        this.showCategoryList = false;
        this.deleteConfirmationCategory = constants_1.ProjectElements.CATEGORY;
        this.deleteConfirmationWorkItem = constants_1.ProjectElements.WORK_ITEM;
        this.deleteConfirmationForQuantityDetails = constants_1.ProjectElements.QUANTITY_DETAILS;
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
    };
    CostHeadComponent.prototype.calculateCategoriesTotal = function () {
        this.categoryDetailsTotalAmount = 0.0;
        for (var _i = 0, _a = this.categoryDetails; _i < _a.length; _i++) {
            var categoryData = _a[_i];
            this.categoryDetailsTotalAmount = this.commonService.decimalConversion(this.categoryDetailsTotalAmount
                + categoryData.amount);
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
                this.quantityItemsArray = defaultQuantityDetail[0].quantityItems;
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
            this.calculateTotalForRateView();
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
            this.calculateTotalForRateView();
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
            this.calculateTotalForRateView();
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
    CostHeadComponent.prototype.calculateTotalForRateView = function () {
        this.rateItemsArray.total = 0;
        this.ratePerUnitAmount = 0;
        this.totalAmount = this.calculateTotalForRateItems(this.rateItemsArray.rateItems);
        this.ratePerUnitAmount = this.commonService.decimalConversion(this.totalAmount / this.rateItemsArray.quantity);
        this.rateItemsArray.total = this.ratePerUnitAmount;
    };
    CostHeadComponent.prototype.calculateTotalForRateItems = function (rateItems) {
        this.totalAmount = 0;
        this.totalAmountOfMaterial = 0;
        this.totalAmountOfLabour = 0;
        this.totalAmountOfMaterialAndLabour = 0;
        for (var rateItemsIndex in rateItems) {
            this.choice = rateItems[rateItemsIndex].type;
            switch (this.choice) {
                case 'M':
                    this.rateItemsArray.rateItems[rateItemsIndex].totalAmount = parseFloat((this.rateItemsArray.rateItems[rateItemsIndex].quantity *
                        this.rateItemsArray.rateItems[rateItemsIndex].rate).toFixed(constants_1.ValueConstant.NUMBER_OF_FRACTION_DIGIT));
                    this.totalAmountOfMaterial = Math.round(this.totalAmountOfMaterial + this.rateItemsArray.rateItems[rateItemsIndex].totalAmount);
                    break;
                case 'L':
                    this.rateItemsArray.rateItems[rateItemsIndex].totalAmount = parseFloat((this.rateItemsArray.rateItems[rateItemsIndex].quantity *
                        this.rateItemsArray.rateItems[rateItemsIndex].rate).toFixed(constants_1.ValueConstant.NUMBER_OF_FRACTION_DIGIT));
                    this.totalAmountOfLabour = Math.round(this.totalAmountOfLabour + this.rateItemsArray.rateItems[rateItemsIndex].totalAmount);
                    break;
                case 'M + L':
                    this.rateItemsArray.rateItems[rateItemsIndex].totalAmount = parseFloat((this.rateItemsArray.rateItems[rateItemsIndex].quantity *
                        this.rateItemsArray.rateItems[rateItemsIndex].rate).toFixed(constants_1.ValueConstant.NUMBER_OF_FRACTION_DIGIT));
                    this.totalAmountOfMaterialAndLabour = Math.round(this.totalAmountOfMaterialAndLabour +
                        this.rateItemsArray.rateItems[rateItemsIndex].totalAmount);
                    break;
            }
            this.totalAmount = this.totalAmountOfMaterial + this.totalAmountOfLabour + this.totalAmountOfMaterialAndLabour;
            this.totalAmount = Math.round(this.totalAmount);
        }
        return (this.totalAmount);
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
        message.custom_message = constants_1.Messages.MSG_SUCCESS_UPDATE_RATE;
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
        this.refreshWorkItemList();
    };
    CostHeadComponent.prototype.setShowWorkItemTab = function (tabName) {
        this.showWorkItemTab = tabName;
        this.refreshCategoryList();
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1oZWFkL2Nvc3QtaGVhZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBd0U7QUFDeEUsMENBQXlEO0FBQ3pELDZEQUEySTtBQUMzSSxxREFBaUg7QUFFakgsZ0ZBQThFO0FBQzlFLGdFQUE2RDtBQUM3RCw4QkFBZ0M7QUFJaEMsb0VBQWtFO0FBQ2xFLGdGQUE2RTtBQUM3RSw0RkFBeUY7QUFXekY7SUEwREUsMkJBQW9CLGtCQUF1QyxFQUFVLGNBQStCLEVBQ2hGLE9BQWUsRUFBVSxjQUE4QixFQUFVLGFBQTZCLEVBQzlGLGFBQTRCO1FBRjVCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBcUI7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBaUI7UUFDaEYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFnQjtRQUM5RixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQTdDaEQsK0JBQTBCLEdBQVMsQ0FBQyxDQUFDO1FBRXJDLHNCQUFpQixHQUFZLENBQUMsQ0FBQztRQUMvQixnQkFBVyxHQUFZLENBQUMsQ0FBQztRQUN6QiwwQkFBcUIsR0FBWSxDQUFDLENBQUM7UUFDbkMsd0JBQW1CLEdBQVksQ0FBQyxDQUFDO1FBQ2pDLG1DQUE4QixHQUFZLENBQUMsQ0FBQztRQUc1QyxhQUFRLEdBQVEsQ0FBQyxDQUFDO1FBQ2xCLHlCQUFvQixHQUFRLENBQUMsQ0FBQztRQUM5QixTQUFJLEdBQVEsRUFBRSxDQUFDO1FBRWYscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBRWxDLCtCQUEwQixHQUFHLDJCQUFlLENBQUMsUUFBUSxDQUFDO1FBQ3RELCtCQUEwQixHQUFHLDJCQUFlLENBQUMsU0FBUyxDQUFDO1FBQ3ZELHlDQUFvQyxHQUFHLDJCQUFl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U0FBUyxFQUFFLENBQUMseUJBQXlCLENBQUM7WUFDdEMsV0FBVyxFQUFFLDBCQUEwQjtTQUN4QyxDQUFDO3lDQTREeUMseUNBQWtCLEVBQTJCLHVCQUFjO1lBQ3ZFLGVBQU0sRUFBMEIsc0JBQWMsRUFBMEIsOEJBQWE7WUFDL0UsK0JBQWE7T0E1RHJDLGlCQUFpQixDQWtxQjdCO0lBQUQsd0JBQUM7Q0FscUJELEFBa3FCQyxJQUFBO0FBbHFCWSw4Q0FBaUIiLCJmaWxlIjoiYXBwL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvY29zdC1zdW1tYXJ5LXJlcG9ydC9jb3N0LWhlYWQvY29zdC1oZWFkLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBPbkNoYW5nZXMsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgTWVzc2FnZXMsIFByb2plY3RFbGVtZW50cywgTmF2aWdhdGlvblJvdXRlcywgVGFibGVIZWFkaW5ncywgQnV0dG9uLCBMYWJlbCwgVmFsdWVDb25zdGFudCB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBBUEksU2Vzc2lvblN0b3JhZ2UsIFNlc3Npb25TdG9yYWdlU2VydmljZSwgTWVzc2FnZSwgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zaGFyZWQvaW5kZXgnO1xyXG5pbXBvcnQgeyBSYXRlIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWwvcmF0ZSc7XHJcbmltcG9ydCB7IENvbW1vblNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zaGFyZWQvc2VydmljZXMvY29tbW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb3N0U3VtbWFyeVNlcnZpY2UgfSBmcm9tICcuLi9jb3N0LXN1bW1hcnkuc2VydmljZSc7XHJcbmltcG9ydCAqIGFzIGxvZHNoIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IENhdGVnb3J5IH0gZnJvbSAnLi4vLi4vLi4vbW9kZWwvY2F0ZWdvcnknO1xyXG5pbXBvcnQgeyBXb3JrSXRlbSB9IGZyb20gJy4uLy4uLy4uL21vZGVsL3dvcmstaXRlbSc7XHJcbmltcG9ydCB7IFF1YW50aXR5SXRlbSB9IGZyb20gJy4uLy4uLy4uL21vZGVsL3F1YW50aXR5LWl0ZW0nO1xyXG5pbXBvcnQgeyBRdWFudGl0eURldGFpbHMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbC9xdWFudGl0eS1kZXRhaWxzJztcclxuaW1wb3J0IHsgTG9hZGVyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9sb2FkZXIvbG9hZGVycy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUXVhbnRpdHlEZXRhaWxzQ29tcG9uZW50IH0gZnJvbSAnLi9xdWFudGl0eS1kZXRhaWxzL3F1YW50aXR5LWRldGFpbHMuY29tcG9uZW50JztcclxuaW1wb3J0IHsgUmF0ZUl0ZW0gfSBmcm9tICcuLi8uLi8uLi9tb2RlbC9yYXRlLWl0ZW0nO1xyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICdiaS1jb3N0LWhlYWQnLFxyXG4gIHN0eWxlVXJsczogWydjb3N0LWhlYWQuY29tcG9uZW50LmNzcyddLFxyXG4gIHRlbXBsYXRlVXJsOiAnY29zdC1oZWFkLmNvbXBvbmVudC5odG1sJ1xyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIENvc3RIZWFkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xyXG5cclxuICBAVmlld0NoaWxkKFF1YW50aXR5RGV0YWlsc0NvbXBvbmVudCkgY2hpbGQ6IFF1YW50aXR5RGV0YWlsc0NvbXBvbmVudDtcclxuXHJcbiAgcHJvamVjdElkIDogc3RyaW5nO1xyXG4gIHZpZXdUeXBlVmFsdWU6IHN0cmluZztcclxuICBiYXNlVXJsOnN0cmluZztcclxuICB2aWV3VHlwZTpzdHJpbmc7XHJcbiAga2V5UXVhbnRpdHk6c3RyaW5nO1xyXG4gIGN1cnJlbnRLZXk6c3RyaW5nO1xyXG4gIGNvc3RIZWFkTmFtZTogc3RyaW5nO1xyXG4gIGNvc3RIZWFkSWQ6bnVtYmVyO1xyXG4gIHdvcmtJdGVtSWQ6IG51bWJlcjtcclxuICBjYXRlZ29yeUlkOiBudW1iZXI7XHJcbiAgY2F0ZWdvcnlEZXRhaWxzOiBBcnJheTxDYXRlZ29yeT47XHJcbiAgY2F0ZWdvcnlEZXRhaWxzVG90YWxBbW91bnQ6IG51bWJlcj0wO1xyXG4gIHdvcmtJdGVtOiBXb3JrSXRlbTtcclxuICByYXRlUGVyVW5pdEFtb3VudCA6IG51bWJlciA9IDA7XHJcbiAgdG90YWxBbW91bnQgOiBudW1iZXIgPSAwO1xyXG4gIHRvdGFsQW1vdW50T2ZNYXRlcmlhbCA6IG51bWJlciA9IDA7XHJcbiAgdG90YWxBbW91bnRPZkxhYm91ciA6IG51bWJlciA9IDA7XHJcbiAgdG90YWxBbW91bnRPZk1hdGVyaWFsQW5kTGFib3VyIDogbnVtYmVyID0gMDtcclxuICBjYXRlZ29yeVJhdGVBbmFseXNpc0lkOm51bWJlcjtcclxuICBjb21wYXJlV29ya0l0ZW1SYXRlQW5hbHlzaXNJZDpudW1iZXI7XHJcbiAgcXVhbnRpdHk6bnVtYmVyPTA7XHJcbiAgcmF0ZUZyb21SYXRlQW5hbHlzaXM6bnVtYmVyPTA7XHJcbiAgdW5pdDpzdHJpbmc9Jyc7XHJcbiAgY2hvaWNlOnN0cmluZztcclxuICBzaG93Q2F0ZWdvcnlMaXN0OiBib29sZWFuID0gZmFsc2U7XHJcbiAgd29ya0l0ZW1zTGlzdDogQXJyYXk8V29ya0l0ZW0+O1xyXG4gIGRlbGV0ZUNvbmZpcm1hdGlvbkNhdGVnb3J5ID0gUHJvamVjdEVsZW1lbnRzLkNBVEVHT1JZO1xyXG4gIGRlbGV0ZUNvbmZpcm1hdGlvbldvcmtJdGVtID0gUHJvamVjdEVsZW1lbnRzLldPUktfSVRFTTtcclxuICBkZWxldGVDb25maXJtYXRpb25Gb3JRdWFudGl0eURldGFpbHMgPSBQcm9qZWN0RWxlbWVudHMuUVVBTlRJVFlfREVUQUlMUztcclxuICBwdWJsaWMgc2hvd1F1YW50aXR5RGV0YWlsczpib29sZWFuPWZhbHNlO1xyXG4gIHByaXZhdGUgc2hvd1dvcmtJdGVtTGlzdDpib29sZWFuPWZhbHNlO1xyXG4gIHByaXZhdGUgc2hvd1dvcmtJdGVtVGFiIDogc3RyaW5nID0gbnVsbDtcclxuICBwcml2YXRlIHNob3dRdWFudGl0eVRhYiA6IHN0cmluZyA9IG51bGw7XHJcbiAgcHJpdmF0ZSBjb21wYXJlV29ya0l0ZW1JZDpudW1iZXI9MDtcclxuICBwcml2YXRlIGNvbXBhcmVDYXRlZ29yeUlkOm51bWJlcj0wO1xyXG4gIHByaXZhdGUgcXVhbnRpdHlJdGVtc0FycmF5OiBBcnJheTxRdWFudGl0eUl0ZW0+ID0gW107XHJcbiAgcHJpdmF0ZSByYXRlSXRlbXNBcnJheTogUmF0ZTtcclxuICBwcml2YXRlIGNhdGVnb3J5QXJyYXkgOiBBcnJheTxDYXRlZ29yeT4gPSBbXTtcclxuXHJcbiAgcHJpdmF0ZSB3b3JrSXRlbUxpc3RBcnJheTogQXJyYXk8V29ya0l0ZW0+ID0gW107XHJcbiAgcHJpdmF0ZSBjYXRlZ29yeUxpc3RBcnJheSA6IEFycmF5PENhdGVnb3J5PiA9IFtdO1xyXG4gIHByaXZhdGUgY2F0ZWdvcnlJZEZvckluQWN0aXZlOiBudW1iZXI7XHJcbiAgcHJpdmF0ZSBjdXJyZW50Q2F0ZWdvcnlJbmRleDogbnVtYmVyO1xyXG4gIHByaXZhdGUgY3VycmVudFdvcmtJdGVtSW5kZXg6IG51bWJlcjtcclxuXHJcbiAgcHJpdmF0ZSBkaXNhYmxlUmF0ZUZpZWxkOmJvb2xlYW4gPSBmYWxzZTtcclxuICBwcml2YXRlIHJhdGVWaWV3IDogc3RyaW5nO1xyXG4gIHByaXZhdGUgcHJldmlvdXNSYXRlUXVhbnRpdHk6bnVtYmVyID0gMDtcclxuICBwcml2YXRlIHF1YW50aXR5SW5jcmVtZW50Om51bWJlciA9IDE7XHJcbiAgcHJpdmF0ZSBkaXNwbGF5UmF0ZVZpZXc6IHN0cmluZyA9IG51bGw7XHJcblxyXG4gIHByaXZhdGUgc2VsZWN0ZWRXb3JrSXRlbURhdGEgOiBBcnJheTxXb3JrSXRlbT4gPSBbXTtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29zdFN1bW1hcnlTZXJ2aWNlIDogQ29zdFN1bW1hcnlTZXJ2aWNlLCBwcml2YXRlIGFjdGl2YXRlZFJvdXRlIDogQWN0aXZhdGVkUm91dGUsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlLCBwcml2YXRlIGNvbW1vblNlcnZpY2UgOiBDb21tb25TZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgbG9hZGVyU2VydmljZTogTG9hZGVyU2VydmljZSkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLmFjdGl2YXRlZFJvdXRlLnBhcmFtcy5zdWJzY3JpYmUocGFyYW1zID0+IHtcclxuXHJcbiAgICAgIHRoaXMucHJvamVjdElkID0gcGFyYW1zWydwcm9qZWN0SWQnXTtcclxuICAgICAgdGhpcy52aWV3VHlwZSA9IHBhcmFtc1sndmlld1R5cGUnXTtcclxuICAgICAgdGhpcy52aWV3VHlwZVZhbHVlID0gcGFyYW1zWyd2aWV3VHlwZVZhbHVlJ107XHJcbiAgICAgIHRoaXMuY29zdEhlYWROYW1lID0gcGFyYW1zWydjb3N0SGVhZE5hbWUnXTtcclxuICAgICAgdGhpcy5jb3N0SGVhZElkID0gcGFyc2VJbnQocGFyYW1zWydjb3N0SGVhZElkJ10pO1xyXG5cclxuXHJcbiAgICAgIGlmKHRoaXMudmlld1R5cGUgPT09ICBBUEkuQlVJTERJTkcgKSB7XHJcbiAgICAgICAgbGV0IGJ1aWxkaW5nSWQgPSBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfQlVJTERJTkcpO1xyXG4gICAgICAgIHRoaXMuYmFzZVVybCA9ICcnICtBUEkuUFJPSkVDVCArICcvJyArIHRoaXMucHJvamVjdElkICsgJy8nICsgJycgKyAgQVBJLkJVSUxESU5HKyAnLycgKyBidWlsZGluZ0lkO1xyXG4gICAgICB9IGVsc2UgaWYodGhpcy52aWV3VHlwZSA9PT0gQVBJLkNPTU1PTl9BTUVOSVRJRVMpIHtcclxuICAgICAgICB0aGlzLmJhc2VVcmwgPSAnJyArQVBJLlBST0pFQ1QgKyAnLycgKyB0aGlzLnByb2plY3RJZDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnRXJyb3InKTtcclxuICAgICAgfVxyXG5cclxuICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX0NPU1RfSEVBRF9JRCwgdGhpcy5jb3N0SGVhZElkKTtcclxuICAgICAgdGhpcy5nZXRDYXRlZ29yaWVzKCB0aGlzLnByb2plY3RJZCwgdGhpcy5jb3N0SGVhZElkKTtcclxuXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldENhdGVnb3JpZXMocHJvamVjdElkOiBzdHJpbmcsIGNvc3RIZWFkSWQ6IG51bWJlcikge1xyXG5cclxuICAgIHRoaXMuY29zdFN1bW1hcnlTZXJ2aWNlLmdldENhdGVnb3JpZXModGhpcy5iYXNlVXJsLCBjb3N0SGVhZElkKS5zdWJzY3JpYmUoXHJcbiAgICAgIGNhdGVnb3J5RGV0YWlscyA9PiB0aGlzLm9uR2V0Q2F0ZWdvcmllc1N1Y2Nlc3MoY2F0ZWdvcnlEZXRhaWxzKSxcclxuICAgICAgZXJyb3IgPT4gdGhpcy5vbkdldENhdGVnb3JpZXNGYWlsdXJlKGVycm9yKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIG9uR2V0Q2F0ZWdvcmllc1N1Y2Nlc3MoY2F0ZWdvcnlEZXRhaWxzOiBhbnkpIHtcclxuICAgIHRoaXMuY2F0ZWdvcnlEZXRhaWxzID0gY2F0ZWdvcnlEZXRhaWxzLmRhdGEuY2F0ZWdvcmllcztcclxuICAgIHRoaXMuY2F0ZWdvcnlEZXRhaWxzVG90YWxBbW91bnQgPSBjYXRlZ29yeURldGFpbHMuZGF0YS5jYXRlZ29yaWVzQW1vdW50O1xyXG4gIH1cclxuXHJcbiAgY2FsY3VsYXRlQ2F0ZWdvcmllc1RvdGFsKCkge1xyXG5cclxuICAgIHRoaXMuY2F0ZWdvcnlEZXRhaWxzVG90YWxBbW91bnQgPSAwLjA7XHJcblxyXG4gICAgZm9yIChsZXQgY2F0ZWdvcnlEYXRhIG9mIHRoaXMuY2F0ZWdvcnlEZXRhaWxzKSB7XHJcbiAgICAgIHRoaXMuY2F0ZWdvcnlEZXRhaWxzVG90YWxBbW91bnQgPSB0aGlzLmNvbW1vblNlcnZpY2UuZGVjaW1hbENvbnZlcnNpb24odGhpcy5jYXRlZ29yeURldGFpbHNUb3RhbEFtb3VudFxyXG4gICAgICAgICsgY2F0ZWdvcnlEYXRhLmFtb3VudCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgb25HZXRDYXRlZ29yaWVzRmFpbHVyZShlcnJvcjogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogYW55KSB7XHJcbiAgICBpZiAoY2hhbmdlcy5jYXRlZ29yeUxpc3RBcnJheS5jdXJyZW50VmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLmNhdGVnb3J5TGlzdEFycmF5ID0gY2hhbmdlcy5jYXRlZ29yeUxpc3RBcnJheS5jdXJyZW50VmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRRdWFudGl0eShjYXRlZ29yeUlkOiBudW1iZXIsIHdvcmtJdGVtOiBXb3JrSXRlbSwgY2F0ZWdvcnlJbmRleDogbnVtYmVyLCB3b3JrSXRlbUluZGV4Om51bWJlcikge1xyXG4gICAgICBpZiAoKHdvcmtJdGVtLnF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMubGVuZ3RoID4gMSkgfHwgKHdvcmtJdGVtLnF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMubGVuZ3RoID09PSAxICYmXHJcbiAgICAgICAgICB3b3JrSXRlbS5xdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzWzBdLm5hbWUgIT09IExhYmVsLkRFRkFVTFRfVklFVykpIHtcclxuICAgICAgICB0aGlzLmdldERldGFpbGVkUXVhbnRpdHkoY2F0ZWdvcnlJZCwgd29ya0l0ZW0sIGNhdGVnb3J5SW5kZXgsIHdvcmtJdGVtSW5kZXgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZ2V0RGVmYXVsdFF1YW50aXR5KGNhdGVnb3J5SWQsIHdvcmtJdGVtLCBjYXRlZ29yeUluZGV4LCB3b3JrSXRlbUluZGV4KTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgLy9HZXQgZGV0YWlsZWQgcXVhbnRpdHlcclxuICBnZXREZXRhaWxlZFF1YW50aXR5KGNhdGVnb3J5SWQ6IG51bWJlciwgd29ya0l0ZW06IFdvcmtJdGVtLCBjYXRlZ29yeUluZGV4OiBudW1iZXIsIHdvcmtJdGVtSW5kZXg6bnVtYmVyKSB7XHJcbiAgICBpZiggdGhpcy5zaG93UXVhbnRpdHlUYWIgIT09IExhYmVsLldPUktJVEVNX0RFVEFJTEVEX1FVQU5USVRZX1RBQiB8fFxyXG4gICAgICB0aGlzLmNvbXBhcmVDYXRlZ29yeUlkICE9PSBjYXRlZ29yeUlkIHx8IHRoaXMuY29tcGFyZVdvcmtJdGVtSWQgIT09IHdvcmtJdGVtLnJhdGVBbmFseXNpc0lkKSB7XHJcblxyXG4gICAgICB0aGlzLnNldEl0ZW1JZChjYXRlZ29yeUlkLCB3b3JrSXRlbS5yYXRlQW5hbHlzaXNJZCk7XHJcblxyXG4gICAgICB0aGlzLndvcmtJdGVtSWQgPSB3b3JrSXRlbS5yYXRlQW5hbHlzaXNJZDtcclxuICAgICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1dPUktJVEVNX0lELCB0aGlzLndvcmtJdGVtSWQpO1xyXG5cclxuICAgICAgbGV0IHF1YW50aXR5RGV0YWlsczogQXJyYXk8UXVhbnRpdHlEZXRhaWxzPiA9IHdvcmtJdGVtLnF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHM7XHJcbiAgICAgIHRoaXMud29ya0l0ZW0gPSB3b3JrSXRlbTtcclxuICAgICAgdGhpcy53b3JrSXRlbS5xdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzID0gW107XHJcbiAgICAgIGZvcihsZXQgcXVhbnRpdHlEZXRhaWwgb2YgcXVhbnRpdHlEZXRhaWxzKSB7XHJcbiAgICAgICAgaWYocXVhbnRpdHlEZXRhaWwubmFtZSAhPT0gdGhpcy5nZXRMYWJlbCgpLkRFRkFVTFRfVklFVykge1xyXG4gICAgICAgICAgdGhpcy53b3JrSXRlbS5xdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzLnB1c2gocXVhbnRpdHlEZXRhaWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jdXJyZW50Q2F0ZWdvcnlJbmRleCA9IGNhdGVnb3J5SW5kZXg7XHJcbiAgICAgIHRoaXMuY3VycmVudFdvcmtJdGVtSW5kZXggPSB3b3JrSXRlbUluZGV4O1xyXG4gICAgICB0aGlzLnNob3dRdWFudGl0eVRhYiA9IExhYmVsLldPUktJVEVNX0RFVEFJTEVEX1FVQU5USVRZX1RBQjtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNob3dXb3JrSXRlbVRhYiA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvL0FkZCBibGFuayBkZXRhaWxlZCBxdWFudGl0eSBhdCBsYXN0XHJcbiAgYWRkTmV3RGV0YWlsZWRRdWFudGl0eShjYXRlZ29yeUlkOiBudW1iZXIsIHdvcmtJdGVtOiBXb3JrSXRlbSwgY2F0ZWdvcnlJbmRleDogbnVtYmVyLCB3b3JrSXRlbUluZGV4Om51bWJlcikge1xyXG4gICAgdGhpcy5zaG93V29ya0l0ZW1UYWIgPSBMYWJlbC5XT1JLSVRFTV9ERVRBSUxFRF9RVUFOVElUWV9UQUI7XHJcbiAgICB0aGlzLmdldERldGFpbGVkUXVhbnRpdHkoY2F0ZWdvcnlJZCwgd29ya0l0ZW0sIGNhdGVnb3J5SW5kZXgsIHdvcmtJdGVtSW5kZXgpO1xyXG4gICAgbGV0IHF1YW50aXR5RGV0YWlsOiBRdWFudGl0eURldGFpbHMgPSBuZXcgUXVhbnRpdHlEZXRhaWxzKCk7XHJcbiAgICB0aGlzLndvcmtJdGVtLnF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMucHVzaChxdWFudGl0eURldGFpbCk7XHJcbiAgICB0aGlzLnNob3dIaWRlUXVhbnRpdHlEZXRhaWxzKGNhdGVnb3J5SWQsIHdvcmtJdGVtSW5kZXgpO1xyXG4gIH1cclxuXHJcbiAgc2hvd0hpZGVRdWFudGl0eURldGFpbHMoY2F0ZWdvcnlJZDpudW1iZXIsd29ya0l0ZW1JbmRleDpudW1iZXIpIHtcclxuICAgIGlmKHRoaXMuY29tcGFyZVdvcmtJdGVtSWQgPT09IHRoaXMud29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQgJiYgdGhpcy5jb21wYXJlQ2F0ZWdvcnlJZCA9PT0gY2F0ZWdvcnlJZCkge1xyXG4gICAgICB0aGlzLnNob3dRdWFudGl0eURldGFpbHMgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zaG93UXVhbnRpdHlEZXRhaWxzID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvL0dldCBEZWZhdWx0IFF1YW50aXR5IChJZiBmbG9vciB3aXNlIG9yIGJ1aWxkaW5nIHdpc2UgcXVhbnRpdHkgaXMgbm90IGFkZGVkKVxyXG4gIGdldERlZmF1bHRRdWFudGl0eShjYXRlZ29yeUlkOiBudW1iZXIsIHdvcmtJdGVtOiBXb3JrSXRlbSwgY2F0ZWdvcnlJbmRleDogbnVtYmVyLCB3b3JrSXRlbUluZGV4Om51bWJlcikge1xyXG5cclxuICAgIGlmKCB0aGlzLnNob3dXb3JrSXRlbVRhYiAhPT0gTGFiZWwuV09SS0lURU1fUVVBTlRJVFlfVEFCIHx8IHRoaXMuY29tcGFyZUNhdGVnb3J5SWQgIT09IGNhdGVnb3J5SWQgfHxcclxuICAgICAgdGhpcy5jb21wYXJlV29ya0l0ZW1JZCAhPT0gd29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRJdGVtSWQoY2F0ZWdvcnlJZCwgd29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQpO1xyXG4gICAgICAgIHRoaXMud29ya0l0ZW1JZCA9IHdvcmtJdGVtLnJhdGVBbmFseXNpc0lkO1xyXG4gICAgICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9XT1JLSVRFTV9JRCwgdGhpcy53b3JrSXRlbUlkKTtcclxuICAgICAgICB0aGlzLndvcmtJdGVtID0gd29ya0l0ZW07XHJcbiAgICAgICAgbGV0IHF1YW50aXR5RGV0YWlsczogQXJyYXk8UXVhbnRpdHlEZXRhaWxzPiA9IHdvcmtJdGVtLnF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHM7XHJcblxyXG4gICAgICAgIGlmKCBxdWFudGl0eURldGFpbHMubGVuZ3RoICE9PTAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMud29ya0l0ZW0ucXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscyA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgZGVmYXVsdFF1YW50aXR5RGV0YWlsID0gcXVhbnRpdHlEZXRhaWxzLmZpbHRlcihcclxuICAgICAgICAgICAgICBmdW5jdGlvbiggZGVmYXVsdFF1YW50aXR5RGV0YWlsOiBhbnkpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRRdWFudGl0eURldGFpbC5uYW1lID09PSBMYWJlbC5ERUZBVUxUX1ZJRVc7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMud29ya0l0ZW0ucXVhbnRpdHkucXVhbnRpdHlJdGVtRGV0YWlscyA9IGRlZmF1bHRRdWFudGl0eURldGFpbDtcclxuICAgICAgICAgICAgdGhpcy5xdWFudGl0eUl0ZW1zQXJyYXkgPSBkZWZhdWx0UXVhbnRpdHlEZXRhaWxbMF0ucXVhbnRpdHlJdGVtcztcclxuICAgICAgICAgICAgdGhpcy5rZXlRdWFudGl0eSA9IGRlZmF1bHRRdWFudGl0eURldGFpbFswXS5uYW1lO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBxdWFudGl0eURldGFpbDogUXVhbnRpdHlEZXRhaWxzID0gbmV3IFF1YW50aXR5RGV0YWlscygpO1xyXG4gICAgICAgICAgICBxdWFudGl0eURldGFpbC5xdWFudGl0eUl0ZW1zID0gW107XHJcbiAgICAgICAgICAgIHF1YW50aXR5RGV0YWlsLm5hbWUgPSB0aGlzLmdldExhYmVsKCkuREVGQVVMVF9WSUVXO1xyXG4gICAgICAgICAgICB0aGlzLndvcmtJdGVtLnF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMucHVzaChxdWFudGl0eURldGFpbCk7XHJcbiAgICAgICAgICAgIHRoaXMucXVhbnRpdHlJdGVtc0FycmF5ID0gW107XHJcbiAgICAgICAgICAgIHRoaXMua2V5UXVhbnRpdHkgPSB0aGlzLmdldExhYmVsKCkuREVGQVVMVF9WSUVXO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50Q2F0ZWdvcnlJbmRleCA9IGNhdGVnb3J5SW5kZXg7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50V29ya0l0ZW1JbmRleCA9IHdvcmtJdGVtSW5kZXg7XHJcbiAgICAgICAgdGhpcy5zaG93V29ya0l0ZW1UYWIgPSBMYWJlbC5XT1JLSVRFTV9RVUFOVElUWV9UQUI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNob3dXb3JrSXRlbVRhYiA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBHZXQgUmF0ZVxyXG4gIGdldFJhdGUoZGlzcGxheVJhdGVWaWV3IDogc3RyaW5nLCBjYXRlZ29yeUlkOm51bWJlciwgd29ya0l0ZW1JZDpudW1iZXIsIHdvcmtJdGVtIDogV29ya0l0ZW0sIGRpc2FibGVSYXRlRmllbGQgOiBib29sZWFuLFxyXG4gICAgICAgICAgY2F0ZWdvcnlJbmRleCA6IG51bWJlciwgd29ya0l0ZW1JbmRleCA6IG51bWJlciApIHtcclxuXHJcbiAgICBpZih0aGlzLnNob3dXb3JrSXRlbVRhYiAhPT0gTGFiZWwuV09SS0lURU1fUkFURV9UQUIgfHwgdGhpcy5kaXNwbGF5UmF0ZVZpZXcgIT09IGRpc3BsYXlSYXRlVmlldyB8fFxyXG4gICAgICB0aGlzLmNvbXBhcmVDYXRlZ29yeUlkICE9PSBjYXRlZ29yeUlkIHx8IHRoaXMuY29tcGFyZVdvcmtJdGVtSWQgIT09IHdvcmtJdGVtSWQpIHtcclxuXHJcbiAgICAgIHRoaXMuc2V0SXRlbUlkKGNhdGVnb3J5SWQsIHdvcmtJdGVtSWQpO1xyXG4gICAgICB0aGlzLnNldFdvcmtJdGVtRGF0YUZvclJhdGVWaWV3KHdvcmtJdGVtLnJhdGVBbmFseXNpc0lkLCB3b3JrSXRlbS5yYXRlKTtcclxuICAgICAgdGhpcy5jYWxjdWxhdGVUb3RhbEZvclJhdGVWaWV3KCk7XHJcbiAgICAgIHRoaXMuY3VycmVudENhdGVnb3J5SW5kZXggPSBjYXRlZ29yeUluZGV4O1xyXG4gICAgICB0aGlzLmN1cnJlbnRXb3JrSXRlbUluZGV4ID0gd29ya0l0ZW1JbmRleDtcclxuICAgICAgdGhpcy5yYXRlVmlldyA9IExhYmVsLldPUktJVEVNX1JBVEVfVEFCO1xyXG4gICAgICB0aGlzLnNldFJhdGVGbGFncyhkaXNwbGF5UmF0ZVZpZXcsIGRpc2FibGVSYXRlRmllbGQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zaG93V29ya0l0ZW1UYWIgPSBudWxsO1xyXG4gICAgICB0aGlzLmRpc3BsYXlSYXRlVmlldyA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBHZXQgUmF0ZSBieSBxdWFudGl0eVxyXG4gIGdldFJhdGVCeVF1YW50aXR5KGRpc3BsYXlSYXRlVmlldyA6IHN0cmluZywgY2F0ZWdvcnlJZDpudW1iZXIsIHdvcmtJdGVtSWQ6bnVtYmVyLCB3b3JrSXRlbSA6IFdvcmtJdGVtLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVSYXRlRmllbGQgOiBib29sZWFuICwgY2F0ZWdvcnlJbmRleDpudW1iZXIsIHdvcmtJdGVtSW5kZXggOiBudW1iZXIpIHtcclxuICAgIGlmKHRoaXMuc2hvd1dvcmtJdGVtVGFiICE9PSBMYWJlbC5XT1JLSVRFTV9SQVRFX1RBQiB8fCB0aGlzLmRpc3BsYXlSYXRlVmlldyAhPT0gZGlzcGxheVJhdGVWaWV3IHx8XHJcbiAgICAgIHRoaXMuY29tcGFyZUNhdGVnb3J5SWQgIT09IGNhdGVnb3J5SWQgfHwgdGhpcy5jb21wYXJlV29ya0l0ZW1JZCAhPT0gd29ya0l0ZW1JZCkge1xyXG5cclxuICAgICAgdGhpcy5zZXRJdGVtSWQoY2F0ZWdvcnlJZCwgd29ya0l0ZW1JZCk7XHJcbiAgICAgIHRoaXMuc2V0V29ya0l0ZW1EYXRhRm9yUmF0ZVZpZXcod29ya0l0ZW0ucmF0ZUFuYWx5c2lzSWQsIHdvcmtJdGVtLnJhdGUpO1xyXG4gICAgICB0aGlzLmNhbGN1bGF0ZVF1YW50aXR5KHdvcmtJdGVtKTtcclxuICAgICAgdGhpcy5jYWxjdWxhdGVUb3RhbEZvclJhdGVWaWV3KCk7XHJcbiAgICAgIHRoaXMuc2V0UmF0ZUZsYWdzKGRpc3BsYXlSYXRlVmlldywgZGlzYWJsZVJhdGVGaWVsZCk7XHJcbiAgICAgIHRoaXMucmF0ZVZpZXcgPSBMYWJlbC5XT1JLSVRFTV9SQVRFX0JZX1FVQU5USVRZX1RBQjtcclxuICAgICAgdGhpcy5jdXJyZW50Q2F0ZWdvcnlJbmRleCA9IGNhdGVnb3J5SW5kZXg7XHJcbiAgICAgIHRoaXMuY3VycmVudFdvcmtJdGVtSW5kZXggPSB3b3JrSXRlbUluZGV4O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zaG93V29ya0l0ZW1UYWIgPSBudWxsO1xyXG4gICAgICB0aGlzLmRpc3BsYXlSYXRlVmlldyA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBHZXQgU3lzdGVtIHJhdGVcclxuICBnZXRTeXN0ZW1SYXRlKGRpc3BsYXlSYXRlVmlldyA6IHN0cmluZywgY2F0ZWdvcnlJZDpudW1iZXIsIHdvcmtJdGVtSWQ6bnVtYmVyLCB3b3JrSXRlbSA6IFdvcmtJdGVtLFxyXG4gICAgICAgICAgICAgICAgZGlzYWJsZVJhdGVGaWVsZCA6IGJvb2xlYW4sIGNhdGVnb3J5SW5kZXg6bnVtYmVyLCB3b3JrSXRlbUluZGV4IDogbnVtYmVyKSB7XHJcblxyXG4gICAgaWYodGhpcy5zaG93V29ya0l0ZW1UYWIgIT09IExhYmVsLldPUktJVEVNX1JBVEVfVEFCIHx8IHRoaXMuZGlzcGxheVJhdGVWaWV3ICE9PSBkaXNwbGF5UmF0ZVZpZXcgfHxcclxuICAgICAgdGhpcy5jb21wYXJlQ2F0ZWdvcnlJZCAhPT0gY2F0ZWdvcnlJZCB8fCB0aGlzLmNvbXBhcmVXb3JrSXRlbUlkICE9PSB3b3JrSXRlbUlkKSB7XHJcblxyXG4gICAgICB0aGlzLnNldEl0ZW1JZChjYXRlZ29yeUlkLCB3b3JrSXRlbUlkKTtcclxuICAgICAgdGhpcy5zZXRXb3JrSXRlbURhdGFGb3JSYXRlVmlldyh3b3JrSXRlbS5yYXRlQW5hbHlzaXNJZCwgd29ya0l0ZW0uc3lzdGVtUmF0ZSk7XHJcbiAgICAgIHRoaXMuY2FsY3VsYXRlVG90YWxGb3JSYXRlVmlldygpO1xyXG4gICAgICB0aGlzLnJhdGVWaWV3ID0gTGFiZWwuV09SS0lURU1fU1lTVEVNX1JBVEVfVEFCO1xyXG4gICAgICB0aGlzLmN1cnJlbnRDYXRlZ29yeUluZGV4ID0gY2F0ZWdvcnlJbmRleDtcclxuICAgICAgdGhpcy5jdXJyZW50V29ya0l0ZW1JbmRleCA9IHdvcmtJdGVtSW5kZXg7XHJcbiAgICAgIHRoaXMuc2V0UmF0ZUZsYWdzKGRpc3BsYXlSYXRlVmlldywgZGlzYWJsZVJhdGVGaWVsZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNob3dXb3JrSXRlbVRhYiA9IG51bGw7XHJcbiAgICAgIHRoaXMuZGlzcGxheVJhdGVWaWV3ID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldEl0ZW1JZChjYXRlZ29yeUlkOm51bWJlciwgd29ya0l0ZW1JZDpudW1iZXIpIHtcclxuICAgIHRoaXMuY29tcGFyZUNhdGVnb3J5SWQgPSBjYXRlZ29yeUlkO1xyXG4gICAgdGhpcy5jb21wYXJlV29ya0l0ZW1JZCA9IHdvcmtJdGVtSWQ7XHJcbiAgfVxyXG5cclxuICBjbG9zZURldGFpbGVkUXVhbnRpdHlUYWIoKSB7XHJcbiAgICB0aGlzLnNob3dRdWFudGl0eVRhYiA9IG51bGw7XHJcbiAgfVxyXG5cclxuICBjbG9zZVF1YW50aXR5VGFiKCkge1xyXG4gICAgdGhpcy5zaG93V29ya0l0ZW1UYWIgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgc2V0UmF0ZUZsYWdzKGRpc3BsYXlSYXRlVmlldyA6IHN0cmluZywgZGlzYWJsZVJhdGVGaWVsZCA6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuZGlzcGxheVJhdGVWaWV3ID0gZGlzcGxheVJhdGVWaWV3O1xyXG4gICAgdGhpcy5kaXNhYmxlUmF0ZUZpZWxkPWRpc2FibGVSYXRlRmllbGQ7XHJcbiAgICB0aGlzLnNob3dXb3JrSXRlbVRhYiA9IExhYmVsLldPUktJVEVNX1JBVEVfVEFCO1xyXG4gIH1cclxuXHJcbiAgc2V0V29ya0l0ZW1EYXRhRm9yUmF0ZVZpZXcod29ya0l0ZW1JZCA6IG51bWJlciwgcmF0ZSA6IFJhdGUpIHtcclxuICAgIHRoaXMud29ya0l0ZW1JZCA9IHdvcmtJdGVtSWQ7XHJcbiAgICAgIHRoaXMucmF0ZUl0ZW1zQXJyYXkgPSBsb2RzaC5jbG9uZURlZXAocmF0ZSk7XHJcbiAgICAgIHRoaXMudW5pdCA9IGxvZHNoLmNsb25lRGVlcChyYXRlLnVuaXQpO1xyXG4gICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1dPUktJVEVNX0lELCB0aGlzLndvcmtJdGVtSWQpO1xyXG4gIH1cclxuXHJcbiAgY2FsY3VsYXRlUXVhbnRpdHkod29ya0l0ZW0gOiBXb3JrSXRlbSkge1xyXG4gICAgdGhpcy5wcmV2aW91c1JhdGVRdWFudGl0eSA9IGxvZHNoLmNsb25lRGVlcCh3b3JrSXRlbS5yYXRlLnF1YW50aXR5KTtcclxuICAgIHRoaXMucmF0ZUl0ZW1zQXJyYXkucXVhbnRpdHkgPSBsb2RzaC5jbG9uZURlZXAod29ya0l0ZW0ucXVhbnRpdHkudG90YWwpO1xyXG4gICAgdGhpcy5xdWFudGl0eUluY3JlbWVudCA9IHRoaXMucmF0ZUl0ZW1zQXJyYXkucXVhbnRpdHkgLyB0aGlzLnByZXZpb3VzUmF0ZVF1YW50aXR5O1xyXG4gICAgZm9yIChsZXQgcmF0ZUl0ZW1zSW5kZXggPSAwOyByYXRlSXRlbXNJbmRleCA8IHRoaXMucmF0ZUl0ZW1zQXJyYXkucmF0ZUl0ZW1zLmxlbmd0aDsgcmF0ZUl0ZW1zSW5kZXgrKykge1xyXG4gICAgICB0aGlzLnJhdGVJdGVtc0FycmF5LnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0ucXVhbnRpdHkgPSBwYXJzZUZsb2F0KChcclxuICAgICAgICB0aGlzLnJhdGVJdGVtc0FycmF5LnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0ucXVhbnRpdHkgKlxyXG4gICAgICAgIHRoaXMucXVhbnRpdHlJbmNyZW1lbnQpLnRvRml4ZWQoVmFsdWVDb25zdGFudC5OVU1CRVJfT0ZfRlJBQ1RJT05fRElHSVQpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNhbGN1bGF0ZVRvdGFsRm9yUmF0ZVZpZXcoKSB7XHJcbiAgICB0aGlzLnJhdGVJdGVtc0FycmF5LnRvdGFsPTA7XHJcbiAgICB0aGlzLnJhdGVQZXJVbml0QW1vdW50ID0gMDtcclxuICAgICB0aGlzLnRvdGFsQW1vdW50ID0gIHRoaXMuY2FsY3VsYXRlVG90YWxGb3JSYXRlSXRlbXModGhpcy5yYXRlSXRlbXNBcnJheS5yYXRlSXRlbXMpO1xyXG4gICAgdGhpcy5yYXRlUGVyVW5pdEFtb3VudCA9IHRoaXMuY29tbW9uU2VydmljZS5kZWNpbWFsQ29udmVyc2lvbih0aGlzLnRvdGFsQW1vdW50IC8gdGhpcy5yYXRlSXRlbXNBcnJheS5xdWFudGl0eSk7XHJcbiAgICB0aGlzLnJhdGVJdGVtc0FycmF5LnRvdGFsPSB0aGlzLnJhdGVQZXJVbml0QW1vdW50O1xyXG4gIH1cclxuXHJcbiAgY2FsY3VsYXRlVG90YWxGb3JSYXRlSXRlbXMocmF0ZUl0ZW1zIDogQXJyYXk8UmF0ZUl0ZW0+KSB7XHJcbiAgICB0aGlzLnRvdGFsQW1vdW50ID0gMDtcclxuICAgIHRoaXMudG90YWxBbW91bnRPZk1hdGVyaWFsID0gMDtcclxuICAgIHRoaXMudG90YWxBbW91bnRPZkxhYm91ciA9IDA7XHJcbiAgICB0aGlzLnRvdGFsQW1vdW50T2ZNYXRlcmlhbEFuZExhYm91ciA9IDA7XHJcbiAgICBmb3IgKGxldCByYXRlSXRlbXNJbmRleCBpbiAgcmF0ZUl0ZW1zKSB7XHJcbiAgICAgIHRoaXMuY2hvaWNlID0gcmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS50eXBlO1xyXG4gICAgICBzd2l0Y2ggKHRoaXMuY2hvaWNlKSB7XHJcbiAgICAgICAgY2FzZSAnTSc6XHJcbiAgICAgICAgICB0aGlzLnJhdGVJdGVtc0FycmF5LnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0udG90YWxBbW91bnQgPSBwYXJzZUZsb2F0KCh0aGlzLnJhdGVJdGVtc0FycmF5LnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0ucXVhbnRpdHkgKlxyXG4gICAgICAgICAgICB0aGlzLnJhdGVJdGVtc0FycmF5LnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0ucmF0ZSkudG9GaXhlZChWYWx1ZUNvbnN0YW50Lk5VTUJFUl9PRl9GUkFDVElPTl9ESUdJVCkpO1xyXG5cclxuICAgICAgICAgIHRoaXMudG90YWxBbW91bnRPZk1hdGVyaWFsID0gTWF0aC5yb3VuZCh0aGlzLnRvdGFsQW1vdW50T2ZNYXRlcmlhbCArIHRoaXMucmF0ZUl0ZW1zQXJyYXkucmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS50b3RhbEFtb3VudCk7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSAnTCc6XHJcbiAgICAgICAgICB0aGlzLnJhdGVJdGVtc0FycmF5LnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0udG90YWxBbW91bnQgPSBwYXJzZUZsb2F0KCh0aGlzLnJhdGVJdGVtc0FycmF5LnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0ucXVhbnRpdHkgKlxyXG4gICAgICAgICAgICB0aGlzLnJhdGVJdGVtc0FycmF5LnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0ucmF0ZSkudG9GaXhlZChWYWx1ZUNvbnN0YW50Lk5VTUJFUl9PRl9GUkFDVElPTl9ESUdJVCkpO1xyXG5cclxuICAgICAgICAgIHRoaXMudG90YWxBbW91bnRPZkxhYm91ciA9IE1hdGgucm91bmQodGhpcy50b3RhbEFtb3VudE9mTGFib3VyICsgdGhpcy5yYXRlSXRlbXNBcnJheS5yYXRlSXRlbXNbcmF0ZUl0ZW1zSW5kZXhdLnRvdGFsQW1vdW50KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlICdNICsgTCc6XHJcbiAgICAgICAgICB0aGlzLnJhdGVJdGVtc0FycmF5LnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0udG90YWxBbW91bnQgPSBwYXJzZUZsb2F0KCh0aGlzLnJhdGVJdGVtc0FycmF5LnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0ucXVhbnRpdHkgKlxyXG4gICAgICAgICAgICB0aGlzLnJhdGVJdGVtc0FycmF5LnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0ucmF0ZSkudG9GaXhlZChWYWx1ZUNvbnN0YW50Lk5VTUJFUl9PRl9GUkFDVElPTl9ESUdJVCkpO1xyXG5cclxuICAgICAgICAgIHRoaXMudG90YWxBbW91bnRPZk1hdGVyaWFsQW5kTGFib3VyID0gTWF0aC5yb3VuZCh0aGlzLnRvdGFsQW1vdW50T2ZNYXRlcmlhbEFuZExhYm91ciArXHJcbiAgICAgICAgICAgIHRoaXMucmF0ZUl0ZW1zQXJyYXkucmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS50b3RhbEFtb3VudCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnRvdGFsQW1vdW50ID0gdGhpcy50b3RhbEFtb3VudE9mTWF0ZXJpYWwgKyB0aGlzLnRvdGFsQW1vdW50T2ZMYWJvdXIgKyB0aGlzLnRvdGFsQW1vdW50T2ZNYXRlcmlhbEFuZExhYm91cjtcclxuICAgICAgdGhpcy50b3RhbEFtb3VudCA9IE1hdGgucm91bmQodGhpcy50b3RhbEFtb3VudCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gKHRoaXMudG90YWxBbW91bnQpO1xyXG4gIH1cclxuXHJcbiAgc2V0SWRzRm9yRGVsZXRlV29ya0l0ZW0oY2F0ZWdvcnlJZDogc3RyaW5nLCB3b3JrSXRlbUlkOiBzdHJpbmcsd29ya0l0ZW1JbmRleDpudW1iZXIpIHtcclxuICAgIHRoaXMuY2F0ZWdvcnlJZCA9IHBhcnNlSW50KGNhdGVnb3J5SWQpO1xyXG4gICAgdGhpcy53b3JrSXRlbUlkID0gIHBhcnNlSW50KHdvcmtJdGVtSWQpO1xyXG4gICAgdGhpcy5jb21wYXJlV29ya0l0ZW1JZCA9IHdvcmtJdGVtSW5kZXg7XHJcbiAgfVxyXG5cclxuICBkZWFjdGl2YXRlV29ya0l0ZW0oKSB7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RhcnQoKTtcclxuICAgIGxldCBjb3N0SGVhZElkPXBhcnNlSW50KFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9DT1NUX0hFQURfSUQpKTtcclxuICAgIHRoaXMuY29zdFN1bW1hcnlTZXJ2aWNlLmRlYWN0aXZhdGVXb3JrSXRlbSggdGhpcy5iYXNlVXJsLCBjb3N0SGVhZElkLCB0aGlzLmNhdGVnb3J5SWQsIHRoaXMud29ya0l0ZW1JZCApLnN1YnNjcmliZShcclxuICAgICAgICBzdWNjZXNzID0+IHRoaXMub25EZUFjdGl2YXRlV29ya0l0ZW1TdWNjZXNzKHN1Y2Nlc3MpLFxyXG4gICAgICBlcnJvciA9PiB0aGlzLm9uRGVBY3RpdmF0ZVdvcmtJdGVtRmFpbHVyZShlcnJvcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkRlQWN0aXZhdGVXb3JrSXRlbVN1Y2Nlc3Moc3VjY2Vzczogc3RyaW5nKSB7XHJcblxyXG4gICAgdGhpcy5zaG93V29ya0l0ZW1MaXN0ID0gZmFsc2U7XHJcbiAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgIG1lc3NhZ2UuY3VzdG9tX21lc3NhZ2UgPSBNZXNzYWdlcy5NU0dfU1VDQ0VTU19ERUxFVEVfV09SS0lURU07XHJcbiAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcblxyXG4gICAgdGhpcy53b3JrSXRlbXNMaXN0LnNwbGljZSh0aGlzLmNvbXBhcmVXb3JrSXRlbUlkLCAxKTtcclxuXHJcbiAgICB0aGlzLmNhdGVnb3J5RGV0YWlsc1RvdGFsQW1vdW50ID0gdGhpcy5jb21tb25TZXJ2aWNlLnRvdGFsQ2FsY3VsYXRpb25PZkNhdGVnb3JpZXModGhpcy5jYXRlZ29yeURldGFpbHMsXHJcbiAgICAgIHRoaXMuY2F0ZWdvcnlSYXRlQW5hbHlzaXNJZCwgdGhpcy53b3JrSXRlbXNMaXN0KTtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdG9wKCk7XHJcbiAgfVxyXG5cclxuICBvbkRlQWN0aXZhdGVXb3JrSXRlbUZhaWx1cmUoZXJyb3I6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coJ0luQWN0aXZlIFdvcmtJdGVtIGVycm9yIDogJytKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICB9XHJcblxyXG4gIGdldEluQWN0aXZlV29ya0l0ZW1zKGNhdGVnb3J5SWQ6bnVtYmVyLCBjYXRlZ29yeUluZGV4Om51bWJlcikge1xyXG5cclxuICAgIHRoaXMuY29tcGFyZVdvcmtJdGVtUmF0ZUFuYWx5c2lzSWQgPSBjYXRlZ29yeUluZGV4O1xyXG4gICAgdGhpcy5jYXRlZ29yeVJhdGVBbmFseXNpc0lkID0gY2F0ZWdvcnlJZDtcclxuXHJcbiAgICB0aGlzLmNvc3RTdW1tYXJ5U2VydmljZS5nZXRJbkFjdGl2ZVdvcmtJdGVtcyggdGhpcy5iYXNlVXJsLCB0aGlzLmNvc3RIZWFkSWQsIGNhdGVnb3J5SWQpLnN1YnNjcmliZShcclxuICAgICAgd29ya0l0ZW1MaXN0ID0+IHRoaXMub25HZXRJbkFjdGl2ZVdvcmtJdGVtc1N1Y2Nlc3Mod29ya0l0ZW1MaXN0KSxcclxuICAgICAgZXJyb3IgPT4gdGhpcy5vbkdldEluQWN0aXZlV29ya0l0ZW1zRmFpbHVyZShlcnJvcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkdldEluQWN0aXZlV29ya0l0ZW1zU3VjY2Vzcyh3b3JrSXRlbUxpc3Q6YW55KSB7XHJcbiAgICBpZiAod29ya0l0ZW1MaXN0LmRhdGEubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgIHRoaXMud29ya0l0ZW1MaXN0QXJyYXkgPSB3b3JrSXRlbUxpc3QuZGF0YTtcclxuICAgICAgdGhpcy5zaG93V29ya0l0ZW1MaXN0ID0gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgICAgbWVzc2FnZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICAgIG1lc3NhZ2UuY3VzdG9tX21lc3NhZ2UgPSBNZXNzYWdlcy5NU0dfQUxSRUFEWV9BRERFRF9BTExfV09SS0lURU1TO1xyXG4gICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkdldEluQWN0aXZlV29ya0l0ZW1zRmFpbHVyZShlcnJvcjphbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKCdHZXQgV29ya0l0ZW1MaXN0IGVycm9yIDogJytlcnJvcik7XHJcbiAgfVxyXG5cclxuICBvbkNoYW5nZUFjdGl2YXRlU2VsZWN0ZWRXb3JrSXRlbShzZWxlY3RlZFdvcmtJdGVtOmFueSkge1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0YXJ0KCk7XHJcbiAgICB0aGlzLnNob3dXb3JrSXRlbUxpc3Q9ZmFsc2U7XHJcbiAgICBsZXQgd29ya0l0ZW1MaXN04oCC4oCCPeKAguKAgnRoaXMud29ya0l0ZW1MaXN0QXJyYXk7XHJcbiAgICBsZXQgd29ya0l0ZW1PYmplY3QgPSB3b3JrSXRlbUxpc3QuZmlsdGVyKFxyXG4gICAgICBmdW5jdGlvbiggd29ya0l0ZW1PYmo6IGFueSl7XHJcbiAgICAgICAgcmV0dXJuIHdvcmtJdGVtT2JqLm5hbWUgPT09IHNlbGVjdGVkV29ya0l0ZW07XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIHRoaXMuc2VsZWN0ZWRXb3JrSXRlbURhdGFbMF0gPSB3b3JrSXRlbU9iamVjdFswXTtcclxuXHJcbiAgICBsZXQgY2F0ZWdvcnlJZD10aGlzLmNhdGVnb3J5UmF0ZUFuYWx5c2lzSWQ7XHJcblxyXG4gICAgdGhpcy5jb3N0U3VtbWFyeVNlcnZpY2UuYWN0aXZhdGVXb3JrSXRlbSggdGhpcy5iYXNlVXJsLCB0aGlzLmNvc3RIZWFkSWQsIGNhdGVnb3J5SWQsXHJcbiAgICAgIHdvcmtJdGVtT2JqZWN0WzBdLnJhdGVBbmFseXNpc0lkKS5zdWJzY3JpYmUoXHJcbiAgICAgIHN1Y2Nlc3MgPT4gdGhpcy5vbkFjdGl2YXRlV29ya0l0ZW1TdWNjZXNzKHN1Y2Nlc3MpLFxyXG4gICAgICBlcnJvciA9PiB0aGlzLm9uQWN0aXZhdGVXb3JrSXRlbUZhaWx1cmUoZXJyb3IpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgb25BY3RpdmF0ZVdvcmtJdGVtU3VjY2VzcyhzdWNjZXNzIDogc3RyaW5nKSB7XHJcblxyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgbWVzc2FnZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfQUREX1dPUktJVEVNO1xyXG4gICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG5cclxuXHJcbiAgICB0aGlzLndvcmtJdGVtc0xpc3QgPSB0aGlzLndvcmtJdGVtc0xpc3QuY29uY2F0KHRoaXMudG90YWxDYWxjdWxhdGlvbk9mV29ya0l0ZW1zTGlzdCh0aGlzLnNlbGVjdGVkV29ya0l0ZW1EYXRhKSk7XHJcbiAgICB0aGlzLmNhdGVnb3J5RGV0YWlsc1RvdGFsQW1vdW50ID0gdGhpcy5jb21tb25TZXJ2aWNlLnRvdGFsQ2FsY3VsYXRpb25PZkNhdGVnb3JpZXModGhpcy5jYXRlZ29yeURldGFpbHMsXHJcbiAgICAgIHRoaXMuY2F0ZWdvcnlSYXRlQW5hbHlzaXNJZCwgdGhpcy53b3JrSXRlbXNMaXN0KTtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdG9wKCk7XHJcbiAgfVxyXG5cclxuICBvbkFjdGl2YXRlV29ya0l0ZW1GYWlsdXJlKGVycm9yOmFueSkge1xyXG4gICAgY29uc29sZS5sb2coJ0FjdGl2ZSBXb3JrSXRlbSBlcnJvciA6ICcrZXJyb3IpO1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICB9XHJcblxyXG4gIHNldENhdGVnb3J5SWRGb3JEZWFjdGl2YXRlKGNhdGVnb3J5SWQgOiBhbnkpIHtcclxuICAgIHRoaXMuY2F0ZWdvcnlJZEZvckluQWN0aXZlID0gY2F0ZWdvcnlJZDtcclxuICB9XHJcblxyXG4gIGNoYW5nZURpcmVjdFF1YW50aXR5KGNhdGVnb3J5SWQgOiBudW1iZXIsIHdvcmtJdGVtSWQ6IG51bWJlciwgZGlyZWN0UXVhbnRpdHkgOiBudW1iZXIpIHtcclxuICAgIGlmKGRpcmVjdFF1YW50aXR5ICE9PSBudWxsIHx8IGRpcmVjdFF1YW50aXR5ICE9PSAwKSB7XHJcbiAgICAgIHRoaXMubG9hZGVyU2VydmljZS5zdGFydCgpO1xyXG4gICAgICB0aGlzLmNvc3RTdW1tYXJ5U2VydmljZS51cGRhdGVEaXJlY3RRdWFudGl0eUFtb3VudCh0aGlzLmJhc2VVcmwsIHRoaXMuY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCwgd29ya0l0ZW1JZCwgZGlyZWN0UXVhbnRpdHkpLnN1YnNjcmliZShcclxuICAgICAgICB3b3JrSXRlbUxpc3QgPT4gdGhpcy5vbkNoYW5nZURpcmVjdFF1YW50aXR5U3VjY2Vzcyh3b3JrSXRlbUxpc3QpLFxyXG4gICAgICAgIGVycm9yID0+IHRoaXMub25DaGFuZ2VEaXJlY3RRdWFudGl0eUZhaWx1cmUoZXJyb3IpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkNoYW5nZURpcmVjdFF1YW50aXR5U3VjY2VzcyhzdWNjZXNzIDogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZygnc3VjY2VzcyA6ICcrSlNPTi5zdHJpbmdpZnkoc3VjY2VzcykpO1xyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgbWVzc2FnZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfVVBEQVRFX0RJUkVDVF9RVUFOVElUWV9PRl9XT1JLSVRFTTtcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIHRoaXMucmVmcmVzaFdvcmtJdGVtTGlzdCgpO1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICB9XHJcblxyXG4gIG9uQ2hhbmdlRGlyZWN0UXVhbnRpdHlGYWlsdXJlKGVycm9yIDogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZygnZXJyb3IgOiAnK0pTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgY2hhbmdlRGlyZWN0UmF0ZShjYXRlZ29yeUlkIDogbnVtYmVyLCB3b3JrSXRlbUlkOiBudW1iZXIsIGRpcmVjdFJhdGUgOiBudW1iZXIpIHtcclxuICAgIGlmKGRpcmVjdFJhdGUgIT09IG51bGwgfHwgZGlyZWN0UmF0ZSAhPT0gMCkge1xyXG4gICAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RhcnQoKTtcclxuICAgICAgdGhpcy5jb3N0U3VtbWFyeVNlcnZpY2UudXBkYXRlRGlyZWN0UmF0ZSh0aGlzLmJhc2VVcmwsIHRoaXMuY29zdEhlYWRJZCwgY2F0ZWdvcnlJZCwgd29ya0l0ZW1JZCwgZGlyZWN0UmF0ZSkuc3Vic2NyaWJlKFxyXG4gICAgICAgIHN1Y2Nlc3MgPT4gdGhpcy5vblVwZGF0ZURpcmVjdFJhdGVTdWNjZXNzKHN1Y2Nlc3MpLFxyXG4gICAgICAgIGVycm9yID0+IHRoaXMub25VcGRhdGVEaXJlY3RSYXRlRmFpbHVyZShlcnJvcilcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uVXBkYXRlRGlyZWN0UmF0ZVN1Y2Nlc3Moc3VjY2VzcyA6IGFueSkge1xyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgbWVzc2FnZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfVVBEQVRFX1JBVEU7XHJcbiAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB0aGlzLnJlZnJlc2hXb3JrSXRlbUxpc3QoKTtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdG9wKCk7XHJcbiAgfVxyXG5cclxuICBvblVwZGF0ZURpcmVjdFJhdGVGYWlsdXJlKGVycm9yIDogYW55KSB7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgLyogIGRlYWN0aXZhdGVDYXRlZ29yeSgpIHtcclxuICAgIGxldCBwcm9qZWN0SWQ9U2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfSUQpO1xyXG4gICAgbGV0IGJ1aWxkaW5nSWQ9U2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX0JVSUxESU5HKTtcclxuXHJcbiAgICB0aGlzLmNvc3RTdW1tYXJ5U2VydmljZS5kZWFjdGl2YXRlQ2F0ZWdvcnkoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgdGhpcy5jb3N0SGVhZElkLCB0aGlzLmNhdGVnb3J5SWRGb3JJbkFjdGl2ZSkuc3Vic2NyaWJlKFxyXG4gICAgICBkZWFjdGl2YXRlZENhdGVnb3J5ID0+IHRoaXMub25EZWFjdGl2YXRlQ2F0ZWdvcnlTdWNjZXNzKGRlYWN0aXZhdGVkQ2F0ZWdvcnkpLFxyXG4gICAgICBlcnJvciA9PiB0aGlzLm9uRGVhY3RpdmF0ZUNhdGVnb3J5RmFpbHVyZShlcnJvcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkRlYWN0aXZhdGVDYXRlZ29yeVN1Y2Nlc3MoZGVhY3RpdmF0ZWRDYXRlZ29yeSA6IGFueSkge1xyXG4gICAgbGV0IGNhdGVnb3J5TGlzdCA9IGxvZHNoLmNsb25lKHRoaXMuY2F0ZWdvcnlEZXRhaWxzKTtcclxuICAgIHRoaXMuY2F0ZWdvcnlEZXRhaWxzID0gdGhpcy5jb21tb25TZXJ2aWNlLnJlbW92ZUR1cGxpY2F0ZUl0bWVzKGNhdGVnb3J5TGlzdCwgZGVhY3RpdmF0ZWRDYXRlZ29yeS5kYXRhKTtcclxuICAgIHRoaXMuY2FsY3VsYXRlQ2F0ZWdvcmllc1RvdGFsKCk7XHJcbiAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgIG1lc3NhZ2UuY3VzdG9tX21lc3NhZ2UgPSBNZXNzYWdlcy5NU0dfU1VDQ0VTU19ERUxFVEVfQ0FURUdPUlk7XHJcbiAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbi8hKiAgICB0aGlzLmdldENhdGVnb3JpZXMoIHRoaXMucHJvamVjdElkLCB0aGlzLmNvc3RIZWFkSWQpOyohL1xyXG4gIH1cclxuXHJcbiAgb25EZWFjdGl2YXRlQ2F0ZWdvcnlGYWlsdXJlKGVycm9yIDogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZygnSW4gQWN0aXZlIENhdGVnb3J5IGVycm9yIDogJytKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gIH0qL1xyXG5cclxuIC8qIGdldEluQWN0aXZlQ2F0ZWdvcmllcygpIHtcclxuICAgIGxldCBwcm9qZWN0SWQgPSBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfUFJPSkVDVF9JRCk7XHJcbiAgICBsZXQgYnVpbGRpbmdJZCA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9CVUlMRElORyk7XHJcblxyXG4gICAgdGhpcy5jb3N0U3VtbWFyeVNlcnZpY2UuZ2V0SW5BY3RpdmVDYXRlZ29yaWVzKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIHRoaXMuY29zdEhlYWRJZCkuc3Vic2NyaWJlKFxyXG4gICAgICBjYXRlZ29yeUxpc3QgPT4gdGhpcy5vbkdldEluQWN0aXZlQ2F0ZWdvcmllc1N1Y2Nlc3MoY2F0ZWdvcnlMaXN0KSxcclxuICAgICAgZXJyb3IgPT4gdGhpcy5vbkdldEluQWN0aXZlQ2F0ZWdvcmllc0ZhaWx1cmUoZXJyb3IpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgb25HZXRJbkFjdGl2ZUNhdGVnb3JpZXNTdWNjZXNzKGNhdGVnb3J5TGlzdCA6IGFueSkge1xyXG4gICAgaWYoY2F0ZWdvcnlMaXN0LmRhdGEubGVuZ3RoIT09MCkge1xyXG4gICAgdGhpcy5jYXRlZ29yeUFycmF5ID0gY2F0ZWdvcnlMaXN0LmRhdGE7XHJcbiAgICB0aGlzLnNob3dDYXRlZ29yeUxpc3QgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19BTFJFQURZX0FEREVEX0FMTF9DQVRFR09SSUVTO1xyXG4gICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkdldEluQWN0aXZlQ2F0ZWdvcmllc0ZhaWx1cmUoZXJyb3IgOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKCdjYXRlZ29yeUxpc3QgZXJyb3IgOiAnK0pTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgfSovXHJcblxyXG4gIC8qb25DaGFuZ2VBY3RpdmF0ZVNlbGVjdGVkQ2F0ZWdvcnkoc2VsZWN0ZWRDYXRlZ29yeUlkIDogbnVtYmVyICkge1xyXG4gICAgbGV0IHByb2plY3RJZD1TZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfUFJPSkVDVF9JRCk7XHJcbiAgICBsZXQgYnVpbGRpbmdJZD1TZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfQlVJTERJTkcpO1xyXG5cclxuICAgIHRoaXMuY29zdFN1bW1hcnlTZXJ2aWNlLmFjdGl2YXRlQ2F0ZWdvcnkoIHByb2plY3RJZCwgYnVpbGRpbmdJZCwgdGhpcy5jb3N0SGVhZElkLCBzZWxlY3RlZENhdGVnb3J5SWQpLnN1YnNjcmliZShcclxuICAgICAgYnVpbGRpbmcgPT4gdGhpcy5vbkFjdGl2YXRlQ2F0ZWdvcnlTdWNjZXNzKGJ1aWxkaW5nKSxcclxuICAgICAgZXJyb3IgPT4gdGhpcy5vbkFjdGl2YXRlQ2F0ZWdvcnlGYWlsdXJlKGVycm9yKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIG9uQWN0aXZhdGVDYXRlZ29yeVN1Y2Nlc3MoYWN0aXZhdGVkQ2F0ZWdvcnkgOiBhbnkpIHtcclxuICAgIHRoaXMuY2F0ZWdvcnlEZXRhaWxzID0gdGhpcy5jYXRlZ29yeURldGFpbHMuY29uY2F0KGFjdGl2YXRlZENhdGVnb3J5LmRhdGEpO1xyXG4gICAgdGhpcy5jYWxjdWxhdGVDYXRlZ29yaWVzVG90YWwoKTtcclxuXHJcbiAgICBsZXQgY2F0ZWdvcnlMaXN0ID0gbG9kc2guY2xvbmUodGhpcy5jYXRlZ29yeUFycmF5KTtcclxuICAgIHRoaXMuY2F0ZWdvcnlBcnJheSA9IHRoaXMuY29tbW9uU2VydmljZS5yZW1vdmVEdXBsaWNhdGVJdG1lcyhjYXRlZ29yeUxpc3QsIHRoaXMuY2F0ZWdvcnlEZXRhaWxzKTtcclxuXHJcbiAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgIG1lc3NhZ2UuY3VzdG9tX21lc3NhZ2UgPSBNZXNzYWdlcy5NU0dfU1VDQ0VTU19BRERfQ0FURUdPUlk7XHJcbiAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgfVxyXG5cclxuICBvbkFjdGl2YXRlQ2F0ZWdvcnlGYWlsdXJlKGVycm9yIDogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZygnYnVpbGRpbmcgZXJyb3IgOiAnKyBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xyXG4gIH1cclxuKi9cclxuICByZWZyZXNoQ2F0ZWdvcnlMaXN0KCkge1xyXG4gICAgdGhpcy5nZXRDYXRlZ29yaWVzKCB0aGlzLnByb2plY3RJZCwgdGhpcy5jb3N0SGVhZElkKTtcclxuICAgIHRoaXMuc2hvd1dvcmtJdGVtVGFiID0gbnVsbDtcclxuICAgIHRoaXMuc2hvd1F1YW50aXR5VGFiID0gbnVsbDtcclxuICAgIHRoaXMuZGlzcGxheVJhdGVWaWV3ID0gbnVsbDtcclxuICB9XHJcblxyXG4gIHJlZnJlc2hXb3JrSXRlbUxpc3QoKSB7XHJcbiAgICB0aGlzLnJlZnJlc2hDYXRlZ29yeUxpc3QoKTtcclxuICB9XHJcblxyXG4vKiAgc2V0U2VsZWN0ZWRXb3JrSXRlbXMod29ya0l0ZW1MaXN0OmFueSkge1xyXG4gICAgdGhpcy5zZWxlY3RlZFdvcmtJdGVtcyA9IHdvcmtJdGVtTGlzdDtcclxuICB9Ki9cclxuXHJcbiAgICBnZXRBY3RpdmVXb3JrSXRlbXNPZkNhdGVnb3J5KGNhdGVnb3J5SWQgOiBudW1iZXIpIHtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUludChTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfQ09TVF9IRUFEX0lEKSk7XHJcbiAgICAgIHRoaXMuY2F0ZWdvcnlJZCA9IGNhdGVnb3J5SWQ7XHJcbiAgICAgIHRoaXMuY2F0ZWdvcnlSYXRlQW5hbHlzaXNJZCA9IGNhdGVnb3J5SWQ7XHJcbiAgICAgIHRoaXMuY29zdFN1bW1hcnlTZXJ2aWNlLmdldEFjdGl2ZVdvcmtJdGVtc09mQ2F0ZWdvcnkoIHRoaXMuYmFzZVVybCwgY29zdEhlYWRJZCwgdGhpcy5jYXRlZ29yeUlkKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgd29ya0l0ZW1zTGlzdCA9PiB0aGlzLm9uR2V0QWN0aXZlV29ya0l0ZW1zT2ZDYXRlZ29yeVN1Y2Nlc3Mod29ya0l0ZW1zTGlzdCksXHJcbiAgICAgICAgZXJyb3IgPT4gdGhpcy5vbkdldEFjdGl2ZVdvcmtJdGVtc09mQ2F0ZWdvcnlGYWlsdXJlKGVycm9yKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICBvbkdldEFjdGl2ZVdvcmtJdGVtc09mQ2F0ZWdvcnlTdWNjZXNzKHdvcmtJdGVtc0xpc3QgOiBhbnkpIHtcclxuICAgIHRoaXMud29ya0l0ZW1zTGlzdCA9IHdvcmtJdGVtc0xpc3QuZGF0YTtcclxuICB9XHJcblxyXG4gIC8vIGNhbGN1bGF0aW9uIG9mIFF1YW50aXR5ICogUmF0ZVxyXG4gIHRvdGFsQ2FsY3VsYXRpb25PZldvcmtJdGVtc0xpc3Qod29ya0l0ZW1zTGlzdCA6IGFueSkge1xyXG4gICAgICBmb3IobGV0IHdvcmtJdGVtRGF0YSBvZiB3b3JrSXRlbXNMaXN0KSB7XHJcbiAgICAgICAgd29ya0l0ZW1EYXRhLmFtb3VudCA9IHRoaXMuY29tbW9uU2VydmljZS5jYWxjdWxhdGVBbW91bnRPZldvcmtJdGVtKHdvcmtJdGVtRGF0YS5xdWFudGl0eS50b3RhbCwgd29ya0l0ZW1EYXRhLnJhdGUudG90YWwpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB3b3JrSXRlbXNMaXN0O1xyXG4gIH1cclxuXHJcbiAgb25HZXRBY3RpdmVXb3JrSXRlbXNPZkNhdGVnb3J5RmFpbHVyZShlcnJvciA6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coJ29uR2V0QWN0aXZlV29ya0l0ZW1zT2ZDYXRlZ29yeUZhaWx1cmUgZXJyb3IgOiAnK0pTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgZGVsZXRlRWxlbWVudChlbGVtZW50VHlwZSA6IHN0cmluZykge1xyXG4gICAgaWYoZWxlbWVudFR5cGUgPT09IFByb2plY3RFbGVtZW50cy5RVUFOVElUWV9ERVRBSUxTKSB7XHJcbiAgICAgIHRoaXMuY2hpbGQuZGVsZXRlUXVhbnRpdHlEZXRhaWxzQnlOYW1lKCk7XHJcbiAgICB9XHJcbiAgICBpZihlbGVtZW50VHlwZSA9PT0gUHJvamVjdEVsZW1lbnRzLldPUktfSVRFTSkge1xyXG4gICAgICB0aGlzLmRlYWN0aXZhdGVXb3JrSXRlbSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ29CYWNrKCkge1xyXG4gICAgbGV0IHByb2plY3RJZCA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbTmF2aWdhdGlvblJvdXRlcy5BUFBfUFJPSkVDVCxwcm9qZWN0SWQsTmF2aWdhdGlvblJvdXRlcy5BUFBfQ09TVF9TVU1NQVJZXSk7XHJcbiAgfVxyXG5cclxuICBnZXRUYWJsZUhlYWRpbmdzKCkge1xyXG4gICAgcmV0dXJuIFRhYmxlSGVhZGluZ3M7XHJcbiAgfVxyXG5cclxuICBnZXRCdXR0b24oKSB7XHJcbiAgICByZXR1cm4gQnV0dG9uO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGFiZWwoKSB7XHJcbiAgICByZXR1cm4gTGFiZWw7XHJcbiAgfVxyXG5cclxuICBzZXRDYXRlZ29yaWVzVG90YWwoIGNhdGVnb3JpZXNUb3RhbCA6IG51bWJlcikge1xyXG4gICAgdGhpcy5jYXRlZ29yeURldGFpbHNUb3RhbEFtb3VudCA9IGNhdGVnb3JpZXNUb3RhbDtcclxuICAgIHRoaXMucmVmcmVzaFdvcmtJdGVtTGlzdCgpO1xyXG4gIH1cclxuXHJcbiAgc2V0U2hvd1dvcmtJdGVtVGFiKCB0YWJOYW1lIDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnNob3dXb3JrSXRlbVRhYiA9IHRhYk5hbWU7XHJcbiAgICB0aGlzLnJlZnJlc2hDYXRlZ29yeUxpc3QoKTtcclxuICB9XHJcblxyXG4gIGNsb3NlUmF0ZVZpZXcoKSB7XHJcbiAgICB0aGlzLnNob3dXb3JrSXRlbVRhYiA9IG51bGw7XHJcbiAgICB0aGlzLmRpc3BsYXlSYXRlVmlldyA9IG51bGw7XHJcbiAgfVxyXG5cclxuICBjbG9zZVF1YW50aXR5VmlldygpIHtcclxuICAgIHRoaXMuc2hvd1F1YW50aXR5VGFiID0gbnVsbDtcclxuICAgIHRoaXMuc2hvd1dvcmtJdGVtVGFiID0gbnVsbDtcclxuICB9XHJcbn1cclxuIl19
