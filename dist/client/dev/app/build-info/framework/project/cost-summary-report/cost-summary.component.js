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
var constants_1 = require("../../../../shared/constants");
var index_1 = require("../../../../shared/index");
var cost_summary_service_1 = require("./cost-summary.service");
var building_1 = require("../../model/building");
var forms_1 = require("@angular/forms");
var validation_service_1 = require("../../../../shared/customvalidations/validation.service");
var building_service_1 = require("../building/building.service");
var ProjectReport = require("../../model/project-report");
var loaders_service_1 = require("../../../../shared/loader/loaders.service");
var CostSummaryComponent = (function () {
    function CostSummaryComponent(costSummaryService, activatedRoute, formBuilder, _router, messageService, buildingService, loaderService) {
        this.costSummaryService = costSummaryService;
        this.activatedRoute = activatedRoute;
        this.formBuilder = formBuilder;
        this._router = _router;
        this.messageService = messageService;
        this.buildingService = buildingService;
        this.loaderService = loaderService;
        this.showCostHeadList = false;
        this.showGrandTotalPanelBody = true;
        this.compareIndex = 0;
        this.cloneBuildingModel = new building_1.Building();
        this.costIn = [
            { 'costInId': constants_1.ProjectElements.RS_PER_SQFT },
            { 'costInId': constants_1.ProjectElements.RS_PER_SQMT }
        ];
        this.costPer = [
            { 'costPerId': constants_1.ProjectElements.SLAB_AREA },
            { 'costPerId': constants_1.ProjectElements.SALEABLE_AREA },
            { 'costPerId': constants_1.ProjectElements.CARPET_AREA },
        ];
        this.defaultCostingByUnit = constants_1.ProjectElements.RS_PER_SQFT;
        this.defaultCostingByArea = constants_1.ProjectElements.SLAB_AREA;
        this.deleteConfirmationCostHead = constants_1.ProjectElements.COST_HEAD;
        this.deleteConfirmationBuilding = constants_1.ProjectElements.BUILDING;
        this.cloneBuildingForm = this.formBuilder.group({
            name: ['', validation_service_1.ValidationService.requiredBuildingName],
            totalSlabArea: ['', validation_service_1.ValidationService.requiredSlabArea],
            totalCarpetAreaOfUnit: ['', validation_service_1.ValidationService.requiredCarpetArea],
            totalSaleableAreaOfUnit: ['', validation_service_1.ValidationService.requiredSalebleArea],
            plinthArea: ['', validation_service_1.ValidationService.requiredPlinthArea],
            totalNumOfFloors: ['', validation_service_1.ValidationService.requiredTotalNumOfFloors],
            numOfParkingFloors: ['', validation_service_1.ValidationService.requiredNumOfParkingFloors],
            carpetAreaOfParking: ['', validation_service_1.ValidationService.requiredCarpetAreaOfParking],
            numOfOneBHK: [''],
            numOfTwoBHK: [''],
            numOfThreeBHK: [''],
            numOfFourBHK: [''],
            numOfFiveBHK: [''],
            numOfLifts: ['']
        });
    }
    CostSummaryComponent.prototype.ngOnInit = function () {
        var _this = this;
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CURRENT_VIEW, constants_1.CurrentView.COST_SUMMARY);
        this.activatedRoute.params.subscribe(function (params) {
            _this.projectId = params['projectId'];
            if (_this.projectId) {
                _this.onChangeCostingByUnit(_this.defaultCostingByUnit);
            }
        });
    };
    CostSummaryComponent.prototype.setBuildingId = function (i, buildingId) {
        this.compareIndex = i;
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CURRENT_BUILDING, buildingId);
    };
    CostSummaryComponent.prototype.getAllInActiveCostHeads = function (buildingId) {
        var _this = this;
        this.buildingId = buildingId;
        this.costSummaryService.getAllInActiveCostHeads(this.projectId, this.buildingId).subscribe(function (inActiveCostHeads) { return _this.onGetAllInActiveCostHeadsSuccess(inActiveCostHeads); }, function (error) { return _this.onGetAllInActiveCostHeadsFailure(error); });
    };
    CostSummaryComponent.prototype.onGetAllInActiveCostHeadsSuccess = function (inActiveCostHeads) {
        this.inActiveCostHeadArray = inActiveCostHeads.data;
        this.showCostHeadList = true;
    };
    CostSummaryComponent.prototype.onGetAllInActiveCostHeadsFailure = function (error) {
        console.log(error);
    };
    CostSummaryComponent.prototype.goToCostHeadView = function (buildingId, buildingName, estimatedItem) {
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CURRENT_BUILDING, buildingId);
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CURRENT_BUILDING_NAME, buildingName);
        this.buildingId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_BUILDING);
        this.projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
        this._router.navigate([constants_1.NavigationRoutes.APP_PROJECT, this.projectId, constants_1.NavigationRoutes.APP_BUILDING,
            buildingName, constants_1.NavigationRoutes.APP_COST_HEAD, estimatedItem.name, estimatedItem.rateAnalysisId, constants_1.NavigationRoutes.APP_CATEGORY]);
    };
    CostSummaryComponent.prototype.goToCommonAmenities = function () {
        this.projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
        this._router.navigate([constants_1.NavigationRoutes.APP_PROJECT, this.projectId, constants_1.NavigationRoutes.APP_COMMON_AMENITIES]);
    };
    CostSummaryComponent.prototype.onChangeCostingByUnit = function (costingByUnit) {
        var _this = this;
        this.defaultCostingByUnit = costingByUnit;
        this.costSummaryService.getCostSummaryReport(this.projectId, this.defaultCostingByUnit, this.defaultCostingByArea).subscribe(function (projectCostIn) { return _this.onGetCostSummaryReportSuccess(projectCostIn); }, function (error) { return _this.onGetCostSummaryReportFailure(error); });
    };
    CostSummaryComponent.prototype.onGetCostSummaryReportSuccess = function (projects) {
        this.projectReport = new ProjectReport(projects.data.buildings, projects.data.commonAmenities[0]);
        this.buildingsReport = this.projectReport.buildings;
        this.amenitiesReport = this.projectReport.commonAmenities;
        this.calculateGrandTotal();
    };
    CostSummaryComponent.prototype.onGetCostSummaryReportFailure = function (error) {
        console.log('onGetCostInFail()' + error);
    };
    CostSummaryComponent.prototype.onChangeCostingByArea = function (costingByArea) {
        var _this = this;
        this.defaultCostingByArea = costingByArea;
        this.costSummaryService.getCostSummaryReport(this.projectId, this.defaultCostingByUnit, this.defaultCostingByArea).subscribe(function (projectCostPer) { return _this.onGetCostSummaryReportSuccess(projectCostPer); }, function (error) { return _this.onGetCostSummaryReportFailure(error); });
    };
    CostSummaryComponent.prototype.setIdsToInActiveCostHead = function (buildingId, costHeadId) {
        this.buildingId = buildingId;
        this.costHeadId = costHeadId;
    };
    CostSummaryComponent.prototype.inActiveCostHead = function () {
        var _this = this;
        this.loaderService.start();
        var projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
        this.costSummaryService.inActiveCostHead(projectId, this.buildingId, this.costHeadId).subscribe(function (costHeadDetail) { return _this.onInActiveCostHeadSuccess(costHeadDetail); }, function (error) { return _this.onInActiveCostHeadFailure(error); });
    };
    CostSummaryComponent.prototype.onInActiveCostHeadSuccess = function (costHeadDetails) {
        this.loaderService.stop();
        if (costHeadDetails !== null) {
            this.showCostHeadList = false;
            var message = new index_1.Message();
            message.isError = false;
            message.custom_message = index_1.Messages.MSG_SUCCESS_DELETE_COSTHEAD;
            this.messageService.message(message);
        }
        this.onChangeCostingByUnit(this.defaultCostingByUnit);
    };
    CostSummaryComponent.prototype.onInActiveCostHeadFailure = function (error) {
        console.log(error);
        this.loaderService.stop();
    };
    CostSummaryComponent.prototype.onChangeActiveSelectedCostHead = function (selectedInActiveCostHeadId) {
        var _this = this;
        this.showCostHeadList = false;
        this.loaderService.start();
        this.costSummaryService.activeCostHead(this.projectId, this.buildingId, selectedInActiveCostHeadId).subscribe(function (inActiveCostHeads) { return _this.onActiveCostHeadSuccess(inActiveCostHeads); }, function (error) { return _this.onActiveCostHeadFailure(error); });
    };
    CostSummaryComponent.prototype.onActiveCostHeadSuccess = function (inActiveCostHeads) {
        this.loaderService.stop();
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = index_1.Messages.MSG_SUCCESS_ADD_COSTHEAD;
        this.messageService.message(message);
        this.onChangeCostingByUnit(this.defaultCostingByUnit);
    };
    CostSummaryComponent.prototype.onActiveCostHeadFailure = function (error) {
        console.log('onActiveCostHeadFailure()' + error);
        this.loaderService.stop();
    };
    CostSummaryComponent.prototype.changeBudgetedCostAmountOfBuildingCostHead = function (buildingId, costHead, amount) {
        var _this = this;
        if (amount !== null) {
            var projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
            this.costSummaryService.changeBudgetedCostAmountOfBuildingCostHead(projectId, buildingId, costHead, amount).subscribe(function (buildingDetails) { return _this.onUpdateRateOfThumbRuleSuccess(buildingDetails); }, function (error) { return _this.onUpdateRateOfThumbRuleFailure(error); });
        }
    };
    CostSummaryComponent.prototype.onUpdateRateOfThumbRuleSuccess = function (buildingDetails) {
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = index_1.Messages.MSG_SUCCESS_UPDATE_THUMBRULE_RATE_COSTHEAD;
        this.messageService.message(message);
        this.onChangeCostingByUnit(this.defaultCostingByUnit);
    };
    CostSummaryComponent.prototype.onUpdateRateOfThumbRuleFailure = function (error) {
        console.log('onAddCostheadSuccess : ' + error);
    };
    CostSummaryComponent.prototype.setIdForDeleteBuilding = function (buildingId) {
        this.buildingId = buildingId;
    };
    CostSummaryComponent.prototype.deleteBuilding = function () {
        var _this = this;
        var projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
        this.buildingService.deleteBuilding(projectId, this.buildingId).subscribe(function (project) { return _this.onDeleteBuildingSuccess(project); }, function (error) { return _this.onDeleteBuildingFailure(error); });
    };
    CostSummaryComponent.prototype.onDeleteBuildingSuccess = function (result) {
        if (result !== null) {
            var message = new index_1.Message();
            message.isError = false;
            message.custom_message = index_1.Messages.MSG_SUCCESS_DELETE_BUILDING;
            this.messageService.message(message);
            this.onChangeCostingByUnit(this.defaultCostingByUnit);
        }
    };
    CostSummaryComponent.prototype.onDeleteBuildingFailure = function (error) {
        console.log(error);
    };
    CostSummaryComponent.prototype.goToEditBuilding = function (buildingId) {
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CURRENT_BUILDING, buildingId);
        this._router.navigate([constants_1.NavigationRoutes.APP_VIEW_BUILDING_DETAILS, buildingId]);
    };
    CostSummaryComponent.prototype.cloneBuilding = function (buildingId) {
        var _this = this;
        var projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
        this.buildingService.getBuildingDetailsForClone(projectId, buildingId).subscribe(function (building) { return _this.onGetBuildingDetailsForCloneSuccess(building); }, function (error) { return _this.onGetBuildingDetailsForCloneFailure(error); });
    };
    CostSummaryComponent.prototype.onGetBuildingDetailsForCloneSuccess = function (building) {
        this.cloneBuildingModel = building.data;
        this.clonedBuildingDetails = building.data.costHeads;
    };
    CostSummaryComponent.prototype.onGetBuildingDetailsForCloneFailure = function (error) {
        console.log(error);
    };
    CostSummaryComponent.prototype.cloneBuildingBasicDetails = function () {
        var _this = this;
        if (this.cloneBuildingForm.valid) {
            var projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
            this.buildingService.createBuilding(projectId, this.cloneBuildingModel)
                .subscribe(function (building) { return _this.onCreateBuildingSuccess(building); }, function (error) { return _this.onCreateBuildingFailure(error); });
        }
    };
    CostSummaryComponent.prototype.onCreateBuildingSuccess = function (building) {
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = index_1.Messages.MSG_SUCCESS_CLONED_BUILDING_DETAILS;
        this.messageService.message(message);
        this.onChangeCostingByUnit(this.defaultCostingByUnit);
    };
    CostSummaryComponent.prototype.onCreateBuildingFailure = function (error) {
        console.log(error);
    };
    CostSummaryComponent.prototype.cloneBuildingCostHeads = function (cloneCostHead) {
        var _this = this;
        var projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
        this.buildingService.cloneBuildingCostHeads(projectId, this.cloneBuildingId, cloneCostHead).subscribe(function (project) { return _this.onCloneBuildingCostHeadsSuccess(project); }, function (error) { return _this.onCloneBuildingCostHeadsFailure(error); });
    };
    CostSummaryComponent.prototype.onCloneBuildingCostHeadsSuccess = function (project) {
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = index_1.Messages.MSG_SUCCESS_ADD_BUILDING_PROJECT;
        this.messageService.message(message);
        this.onChangeCostingByUnit(this.defaultCostingByUnit);
    };
    CostSummaryComponent.prototype.onCloneBuildingCostHeadsFailure = function (error) {
        console.log(error);
    };
    CostSummaryComponent.prototype.calculateGrandTotal = function () {
        this.grandTotalOfBudgetedCost = 0;
        this.grandTotalOfTotalRate = 0;
        this.grandTotalOfArea = 0;
        this.grandTotalOfEstimatedCost = 0;
        this.grandTotalOfEstimatedRate = 0;
        for (var buildindIndex = 0; buildindIndex < this.buildingsReport.length; buildindIndex++) {
            this.grandTotalOfBudgetedCost = this.grandTotalOfBudgetedCost + this.buildingsReport[buildindIndex].thumbRule.totalBudgetedCost;
            this.grandTotalOfTotalRate = this.grandTotalOfTotalRate + this.buildingsReport[buildindIndex].thumbRule.totalRate;
            this.grandTotalOfArea = this.grandTotalOfArea + this.buildingsReport[buildindIndex].area;
            this.grandTotalOfEstimatedCost = this.grandTotalOfEstimatedCost +
                this.buildingsReport[buildindIndex].estimate.totalEstimatedCost;
            this.grandTotalOfEstimatedRate = this.grandTotalOfEstimatedRate +
                this.buildingsReport[buildindIndex].estimate.totalRate;
        }
        this.grandTotalOfBudgetedCost = this.grandTotalOfBudgetedCost + this.amenitiesReport.thumbRule.totalBudgetedCost;
        this.grandTotalOfTotalRate = this.grandTotalOfTotalRate + this.amenitiesReport.thumbRule.totalRate;
        this.grandTotalOfEstimatedCost = this.grandTotalOfEstimatedCost + this.amenitiesReport.estimate.totalEstimatedCost;
        this.grandTotalOfEstimatedRate = this.grandTotalOfEstimatedRate + this.amenitiesReport.estimate.totalRate;
    };
    CostSummaryComponent.prototype.toggleShowGrandTotalPanelBody = function () {
        this.showGrandTotalPanelBody = !this.showGrandTotalPanelBody;
    };
    CostSummaryComponent.prototype.deleteElement = function (elementType) {
        if (elementType === constants_1.ProjectElements.COST_HEAD) {
            this.inActiveCostHead();
        }
        if (elementType === constants_1.ProjectElements.BUILDING) {
            this.deleteBuilding();
        }
    };
    CostSummaryComponent.prototype.getCostSummaryReport = function () {
        this.onChangeCostingByUnit(this.defaultCostingByUnit);
    };
    CostSummaryComponent.prototype.getMenus = function () {
        return constants_1.Menus;
    };
    CostSummaryComponent.prototype.getLabel = function () {
        return constants_1.Label;
    };
    CostSummaryComponent.prototype.getButton = function () {
        return constants_1.Button;
    };
    CostSummaryComponent.prototype.getHeadings = function () {
        return constants_1.Headings;
    };
    CostSummaryComponent.prototype.getProjectElements = function () {
        return constants_1.ProjectElements;
    };
    __decorate([
        core_1.ViewChild('content'),
        __metadata("design:type", core_1.ElementRef)
    ], CostSummaryComponent.prototype, "content", void 0);
    CostSummaryComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-cost-summary-report',
            templateUrl: 'cost-summary.component.html',
            styleUrls: ['cost-summary.component.css'],
        }),
        __metadata("design:paramtypes", [cost_summary_service_1.CostSummaryService, router_1.ActivatedRoute,
            forms_1.FormBuilder, router_1.Router, index_1.MessageService,
            building_service_1.BuildingService, loaders_service_1.LoaderService])
    ], CostSummaryComponent);
    return CostSummaryComponent;
}());
exports.CostSummaryComponent = CostSummaryComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1zdW1tYXJ5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUF5RTtBQUN6RSwwQ0FBMEQ7QUFDMUQsMERBR3NDO0FBQ3RDLGtEQUFxSDtBQUNySCwrREFBNEQ7QUFDNUQsaURBQWdEO0FBQ2hELHdDQUF3RDtBQUN4RCw4RkFBNEY7QUFDNUYsaUVBQStEO0FBSS9ELDBEQUE2RDtBQUM3RCw2RUFBMEU7QUFTMUU7SUE4Q0UsOEJBQW9CLGtCQUF1QyxFQUFVLGNBQStCLEVBQ2hGLFdBQXdCLEVBQVUsT0FBZ0IsRUFBVSxjQUErQixFQUMzRixlQUFnQyxFQUFVLGFBQTZCO1FBRnZFLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBcUI7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBaUI7UUFDaEYsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQWlCO1FBQzNGLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFnQjtRQTNCM0YscUJBQWdCLEdBQVMsS0FBSyxDQUFDO1FBQy9CLDRCQUF1QixHQUFTLElBQUksQ0FBQztRQUNyQyxpQkFBWSxHQUFRLENBQUMsQ0FBQztRQUl0Qix1QkFBa0IsR0FBYSxJQUFJLG1CQUFRLEVBQUUsQ0FBQztRQUd2QyxXQUFNLEdBQVU7WUFDckIsRUFBRSxVQUFVLEVBQUUsMkJBQWUsQ0FBQyxXQUFXLEVBQUM7WUFDMUMsRUFBRSxVQUFVLEVBQUUsMkJBQWUsQ0FBQyxXQUFXLEVBQUM7U0FDM0MsQ0FBQztRQUVLLFlBQU8sR0FBVTtZQUN0QixFQUFFLFdBQVcsRUFBRSwyQkFBZSxDQUFDLFNBQVMsRUFBQztZQUN6QyxFQUFFLFdBQVcsRUFBRSwyQkFBZSxDQUFDLGFBQWEsRUFB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QUUsQ0FBQyw0QkFBNEIsQ0FBQztTQUMxQyxDQUFDO3lDQWdEeUMseUNBQWtCLEVBQTJCLHVCQUFjO1lBQ25FLG1CQUFXLEVBQW9CLGVBQU0sRUFBMkIsc0JBQWM7WUFDMUUsa0NBQWUsRUFBMEIsK0JBQWE7T0FoRGhGLG9CQUFvQixDQWdZaEM7SUFBRCwyQkFBQztDQWhZRCxBQWdZQyxJQUFBO0FBaFlZLG9EQUFvQiIsImZpbGUiOiJhcHAvYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9jb3N0LXN1bW1hcnktcmVwb3J0L2Nvc3Qtc3VtbWFyeS5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJvdXRlciAsIEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHtcclxuICBOYXZpZ2F0aW9uUm91dGVzLCBQcm9qZWN0RWxlbWVudHMsIEJ1dHRvbiwgTWVudXMsIEhlYWRpbmdzLCBMYWJlbCxcclxuICBWYWx1ZUNvbnN0YW50LCBDdXJyZW50Vmlld1xyXG59IGZyb20gJy4uLy4uLy4uLy4uL3NoYXJlZC9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBTZXNzaW9uU3RvcmFnZSwgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLCAgTWVzc2FnZSwgTWVzc2FnZXMsIE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2hhcmVkL2luZGV4JztcclxuaW1wb3J0IHsgQ29zdFN1bW1hcnlTZXJ2aWNlIH0gZnJvbSAnLi9jb3N0LXN1bW1hcnkuc2VydmljZSc7XHJcbmltcG9ydCB7IEJ1aWxkaW5nIH0gZnJvbSAnLi4vLi4vbW9kZWwvYnVpbGRpbmcnO1xyXG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBWYWxpZGF0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NoYXJlZC9jdXN0b212YWxpZGF0aW9ucy92YWxpZGF0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBCdWlsZGluZ1NlcnZpY2UgfSBmcm9tICcuLi9idWlsZGluZy9idWlsZGluZy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29zdEhlYWQgfSBmcm9tICcuLi8uLi9tb2RlbC9jb3N0aGVhZCc7XHJcbmltcG9ydCB7IEVzdGltYXRlUmVwb3J0IH0gZnJvbSAnLi4vLi4vbW9kZWwvZXN0aW1hdGUtcmVwb3J0JztcclxuaW1wb3J0IHsgQnVpbGRpbmdSZXBvcnQgfSBmcm9tICcuLi8uLi9tb2RlbC9idWlsZGluZy1yZXBvcnQnO1xyXG5pbXBvcnQgUHJvamVjdFJlcG9ydCA9IHJlcXVpcmUoJy4uLy4uL21vZGVsL3Byb2plY3QtcmVwb3J0Jyk7XHJcbmltcG9ydCB7IExvYWRlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zaGFyZWQvbG9hZGVyL2xvYWRlcnMuc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAnYmktY29zdC1zdW1tYXJ5LXJlcG9ydCcsXHJcbiAgdGVtcGxhdGVVcmw6ICdjb3N0LXN1bW1hcnkuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydjb3N0LXN1bW1hcnkuY29tcG9uZW50LmNzcyddLFxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIENvc3RTdW1tYXJ5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgQFZpZXdDaGlsZCgnY29udGVudCcpIGNvbnRlbnQ6IEVsZW1lbnRSZWY7XHJcbiAgYnVpbGRpbmdzUmVwb3J0OiBBcnJheSA8QnVpbGRpbmdSZXBvcnQ+O1xyXG4gIGFtZW5pdGllc1JlcG9ydDogQnVpbGRpbmdSZXBvcnQ7XHJcbiAgcHJvamVjdFJlcG9ydDogUHJvamVjdFJlcG9ydDtcclxuICBwcm9qZWN0SWQ6IHN0cmluZztcclxuICBidWlsZGluZ0lkOiBzdHJpbmc7XHJcbiAgY2xvbmVCdWlsZGluZ0lkOiBzdHJpbmc7XHJcbiAgY29zdEhlYWRJZDogbnVtYmVyO1xyXG5cclxuICBncmFuZFRvdGFsT2ZCdWRnZXRlZENvc3Q6IG51bWJlcjtcclxuICBncmFuZFRvdGFsT2ZUb3RhbFJhdGU6IG51bWJlcjtcclxuICBncmFuZFRvdGFsT2ZBcmVhOiBudW1iZXI7XHJcbiAgZ3JhbmRUb3RhbE9mRXN0aW1hdGVkQ29zdCA6IG51bWJlcjtcclxuICBncmFuZFRvdGFsT2ZFc3RpbWF0ZWRSYXRlIDogbnVtYmVyO1xyXG5cclxuICBidWlsZGluZ05hbWUgOiBzdHJpbmc7XHJcbiAgY29zdEhlYWQ6IHN0cmluZztcclxuXHJcbiAgZXN0aW1hdGVkSXRlbTogRXN0aW1hdGVSZXBvcnQ7XHJcbiAgc2hvd0Nvc3RIZWFkTGlzdDpib29sZWFuPWZhbHNlO1xyXG4gIHNob3dHcmFuZFRvdGFsUGFuZWxCb2R5OmJvb2xlYW49dHJ1ZTtcclxuICBjb21wYXJlSW5kZXg6bnVtYmVyPTA7XHJcblxyXG4gcHVibGljIGluQWN0aXZlQ29zdEhlYWRBcnJheTogQXJyYXk8Q29zdEhlYWQ+O1xyXG4gIGNsb25lQnVpbGRpbmdGb3JtOiBGb3JtR3JvdXA7XHJcbiAgY2xvbmVCdWlsZGluZ01vZGVsOiBCdWlsZGluZyA9IG5ldyBCdWlsZGluZygpO1xyXG4gIGNsb25lZEJ1aWxkaW5nRGV0YWlsczogQXJyYXk8Q29zdEhlYWQ+O1xyXG5cclxuICBwdWJsaWMgY29zdEluOiBhbnlbXSA9IFtcclxuICAgIHsgJ2Nvc3RJbklkJzogUHJvamVjdEVsZW1lbnRzLlJTX1BFUl9TUUZUfSxcclxuICAgIHsgJ2Nvc3RJbklkJzogUHJvamVjdEVsZW1lbnRzLlJTX1BFUl9TUU1UfVxyXG4gIF07XHJcblxyXG4gIHB1YmxpYyBjb3N0UGVyOiBhbnlbXSA9IFtcclxuICAgIHsgJ2Nvc3RQZXJJZCc6IFByb2plY3RFbGVtZW50cy5TTEFCX0FSRUF9LFxyXG4gICAgeyAnY29zdFBlcklkJzogUHJvamVjdEVsZW1lbnRzLlNBTEVBQkxFX0FSRUF9LFxyXG4gICAgeyAnY29zdFBlcklkJzogUHJvamVjdEVsZW1lbnRzLkNBUlBFVF9BUkVBfSxcclxuICBdO1xyXG5cclxuICBkZWZhdWx0Q29zdGluZ0J5VW5pdDpzdHJpbmcgPSBQcm9qZWN0RWxlbWVudHMuUlNfUEVSX1NRRlQ7XHJcbiAgZGVmYXVsdENvc3RpbmdCeUFyZWE6c3RyaW5nID0gUHJvamVjdEVsZW1lbnRzLlNMQUJfQVJFQTtcclxuICBkZWxldGVDb25maXJtYXRpb25Db3N0SGVhZCA9IFByb2plY3RFbGVtZW50cy5DT1NUX0hFQUQ7XHJcbiAgZGVsZXRlQ29uZmlybWF0aW9uQnVpbGRpbmcgPSBQcm9qZWN0RWxlbWVudHMuQlVJTERJTkc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29zdFN1bW1hcnlTZXJ2aWNlIDogQ29zdFN1bW1hcnlTZXJ2aWNlLCBwcml2YXRlIGFjdGl2YXRlZFJvdXRlIDogQWN0aXZhdGVkUm91dGUsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBmb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIsIHByaXZhdGUgX3JvdXRlciA6IFJvdXRlciwgcHJpdmF0ZSBtZXNzYWdlU2VydmljZSA6IE1lc3NhZ2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgYnVpbGRpbmdTZXJ2aWNlOiBCdWlsZGluZ1NlcnZpY2UsIHByaXZhdGUgbG9hZGVyU2VydmljZSA6IExvYWRlclNlcnZpY2UpIHtcclxuXHJcbiAgICB0aGlzLmNsb25lQnVpbGRpbmdGb3JtID0gdGhpcy5mb3JtQnVpbGRlci5ncm91cCh7XHJcbiAgICAgIG5hbWUgOiBbJycsIFZhbGlkYXRpb25TZXJ2aWNlLnJlcXVpcmVkQnVpbGRpbmdOYW1lXSxcclxuICAgICAgdG90YWxTbGFiQXJlYSA6WycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZFNsYWJBcmVhXSxcclxuICAgICAgdG90YWxDYXJwZXRBcmVhT2ZVbml0IDpbJycsIFZhbGlkYXRpb25TZXJ2aWNlLnJlcXVpcmVkQ2FycGV0QXJlYV0sXHJcbiAgICAgIHRvdGFsU2FsZWFibGVBcmVhT2ZVbml0IDpbJycsIFZhbGlkYXRpb25TZXJ2aWNlLnJlcXVpcmVkU2FsZWJsZUFyZWFdLFxyXG4gICAgICBwbGludGhBcmVhIDpbJycsIFZhbGlkYXRpb25TZXJ2aWNlLnJlcXVpcmVkUGxpbnRoQXJlYV0sXHJcbiAgICAgIHRvdGFsTnVtT2ZGbG9vcnMgOlsnJywgVmFsaWRhdGlvblNlcnZpY2UucmVxdWlyZWRUb3RhbE51bU9mRmxvb3JzXSxcclxuICAgICAgbnVtT2ZQYXJraW5nRmxvb3JzIDpbJycsIFZhbGlkYXRpb25TZXJ2aWNlLnJlcXVpcmVkTnVtT2ZQYXJraW5nRmxvb3JzXSxcclxuICAgICAgY2FycGV0QXJlYU9mUGFya2luZyA6WycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZENhcnBldEFyZWFPZlBhcmtpbmddLFxyXG4gICAgICBudW1PZk9uZUJISyA6IFsnJ10sXHJcbiAgICAgIG51bU9mVHdvQkhLIDpbJyddLFxyXG4gICAgICBudW1PZlRocmVlQkhLIDpbJyddLFxyXG4gICAgICBudW1PZkZvdXJCSEsgOlsnJ10sXHJcbiAgICAgIG51bU9mRml2ZUJISyA6WycnXSxcclxuICAgICAgbnVtT2ZMaWZ0cyA6WycnXVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9WSUVXLCBDdXJyZW50Vmlldy5DT1NUX1NVTU1BUlkpO1xyXG4gICAgdGhpcy5hY3RpdmF0ZWRSb3V0ZS5wYXJhbXMuc3Vic2NyaWJlKHBhcmFtcyA9PiB7XHJcbiAgICAgIHRoaXMucHJvamVjdElkID0gcGFyYW1zWydwcm9qZWN0SWQnXTtcclxuICAgICAgaWYodGhpcy5wcm9qZWN0SWQpIHtcclxuICAgICAgICB0aGlzLm9uQ2hhbmdlQ29zdGluZ0J5VW5pdCh0aGlzLmRlZmF1bHRDb3N0aW5nQnlVbml0KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZXRCdWlsZGluZ0lkKCBpOm51bWJlciwgYnVpbGRpbmdJZDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmNvbXBhcmVJbmRleCA9IGk7XHJcbiAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfQlVJTERJTkcsIGJ1aWxkaW5nSWQpO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWxsSW5BY3RpdmVDb3N0SGVhZHMoYnVpbGRpbmdJZDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmJ1aWxkaW5nSWQ9YnVpbGRpbmdJZDtcclxuICAgIHRoaXMuY29zdFN1bW1hcnlTZXJ2aWNlLmdldEFsbEluQWN0aXZlQ29zdEhlYWRzKCB0aGlzLnByb2plY3RJZCwgdGhpcy5idWlsZGluZ0lkKS5zdWJzY3JpYmUoXHJcbiAgICAgIGluQWN0aXZlQ29zdEhlYWRzID0+IHRoaXMub25HZXRBbGxJbkFjdGl2ZUNvc3RIZWFkc1N1Y2Nlc3MoaW5BY3RpdmVDb3N0SGVhZHMpLFxyXG4gICAgICBlcnJvciA9PiB0aGlzLm9uR2V0QWxsSW5BY3RpdmVDb3N0SGVhZHNGYWlsdXJlKGVycm9yKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIG9uR2V0QWxsSW5BY3RpdmVDb3N0SGVhZHNTdWNjZXNzKGluQWN0aXZlQ29zdEhlYWRzIDogYW55KSB7XHJcbiAgICAgIHRoaXMuaW5BY3RpdmVDb3N0SGVhZEFycmF5PWluQWN0aXZlQ29zdEhlYWRzLmRhdGE7XHJcbiAgICAgIHRoaXMuc2hvd0Nvc3RIZWFkTGlzdD10cnVlO1xyXG4gIH1cclxuXHJcbiAgb25HZXRBbGxJbkFjdGl2ZUNvc3RIZWFkc0ZhaWx1cmUoZXJyb3IgOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICB9XHJcblxyXG4gIGdvVG9Db3N0SGVhZFZpZXcoIGJ1aWxkaW5nSWQgOiBzdHJpbmcsIGJ1aWxkaW5nTmFtZTpzdHJpbmcsIGVzdGltYXRlZEl0ZW0gOmFueSkge1xyXG5cclxuICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9CVUlMRElORywgYnVpbGRpbmdJZCk7XHJcbiAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfQlVJTERJTkdfTkFNRSwgYnVpbGRpbmdOYW1lKTtcclxuICAgIHRoaXMuYnVpbGRpbmdJZCA9ICBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfQlVJTERJTkcpO1xyXG4gICAgdGhpcy5wcm9qZWN0SWQgPSBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfUFJPSkVDVF9JRCk7XHJcblxyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9QUk9KRUNULCB0aGlzLnByb2plY3RJZCwgTmF2aWdhdGlvblJvdXRlcy5BUFBfQlVJTERJTkcsXHJcbiAgICAgIGJ1aWxkaW5nTmFtZSwgTmF2aWdhdGlvblJvdXRlcy5BUFBfQ09TVF9IRUFELCBlc3RpbWF0ZWRJdGVtLm5hbWUsICBlc3RpbWF0ZWRJdGVtLnJhdGVBbmFseXNpc0lkLCBOYXZpZ2F0aW9uUm91dGVzLkFQUF9DQVRFR09SWV0pO1xyXG4gIH1cclxuXHJcbiAgZ29Ub0NvbW1vbkFtZW5pdGllcygpIHtcclxuICAgIHRoaXMucHJvamVjdElkID0gU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfSUQpO1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9QUk9KRUNULHRoaXMucHJvamVjdElkLE5hdmlnYXRpb25Sb3V0ZXMuQVBQX0NPTU1PTl9BTUVOSVRJRVNdKTtcclxuICB9XHJcblxyXG4gIG9uQ2hhbmdlQ29zdGluZ0J5VW5pdChjb3N0aW5nQnlVbml0OmFueSkge1xyXG4gICAgdGhpcy5kZWZhdWx0Q29zdGluZ0J5VW5pdD1jb3N0aW5nQnlVbml0O1xyXG4gICAgdGhpcy5jb3N0U3VtbWFyeVNlcnZpY2UuZ2V0Q29zdFN1bW1hcnlSZXBvcnQoIHRoaXMucHJvamVjdElkLCB0aGlzLmRlZmF1bHRDb3N0aW5nQnlVbml0LCB0aGlzLmRlZmF1bHRDb3N0aW5nQnlBcmVhKS5zdWJzY3JpYmUoXHJcbiAgICAgIHByb2plY3RDb3N0SW4gPT4gdGhpcy5vbkdldENvc3RTdW1tYXJ5UmVwb3J0U3VjY2Vzcyhwcm9qZWN0Q29zdEluKSxcclxuICAgICAgZXJyb3IgPT4gdGhpcy5vbkdldENvc3RTdW1tYXJ5UmVwb3J0RmFpbHVyZShlcnJvcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkdldENvc3RTdW1tYXJ5UmVwb3J0U3VjY2Vzcyhwcm9qZWN0cyA6IGFueSkge1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3J0ID0gbmV3IFByb2plY3RSZXBvcnQoIHByb2plY3RzLmRhdGEuYnVpbGRpbmdzLCBwcm9qZWN0cy5kYXRhLmNvbW1vbkFtZW5pdGllc1swXSkgO1xyXG4gICAgdGhpcy5idWlsZGluZ3NSZXBvcnQgPSB0aGlzLnByb2plY3RSZXBvcnQuYnVpbGRpbmdzO1xyXG4gICAgdGhpcy5hbWVuaXRpZXNSZXBvcnQgPSB0aGlzLnByb2plY3RSZXBvcnQuY29tbW9uQW1lbml0aWVzO1xyXG4gICAgdGhpcy5jYWxjdWxhdGVHcmFuZFRvdGFsKCk7XHJcbiAgfVxyXG5cclxuICBvbkdldENvc3RTdW1tYXJ5UmVwb3J0RmFpbHVyZShlcnJvciA6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coJ29uR2V0Q29zdEluRmFpbCgpJytlcnJvcik7XHJcbiAgfVxyXG5cclxuICAvL1RPRE8gOiBDaGVjayBpZiBjYW4gbWVyZ2VcclxuICBvbkNoYW5nZUNvc3RpbmdCeUFyZWEoY29zdGluZ0J5QXJlYTphbnkpIHtcclxuICAgIHRoaXMuZGVmYXVsdENvc3RpbmdCeUFyZWE9Y29zdGluZ0J5QXJlYTtcclxuICAgIHRoaXMuY29zdFN1bW1hcnlTZXJ2aWNlLmdldENvc3RTdW1tYXJ5UmVwb3J0KCB0aGlzLnByb2plY3RJZCwgdGhpcy5kZWZhdWx0Q29zdGluZ0J5VW5pdCwgdGhpcy5kZWZhdWx0Q29zdGluZ0J5QXJlYSkuc3Vic2NyaWJlKFxyXG4gICAgICBwcm9qZWN0Q29zdFBlciA9PiB0aGlzLm9uR2V0Q29zdFN1bW1hcnlSZXBvcnRTdWNjZXNzKHByb2plY3RDb3N0UGVyKSxcclxuICAgICAgZXJyb3IgPT4gdGhpcy5vbkdldENvc3RTdW1tYXJ5UmVwb3J0RmFpbHVyZShlcnJvcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBzZXRJZHNUb0luQWN0aXZlQ29zdEhlYWQoYnVpbGRpbmdJZDogc3RyaW5nLCBjb3N0SGVhZElkOiBudW1iZXIpIHtcclxuICAgIHRoaXMuYnVpbGRpbmdJZCA9IGJ1aWxkaW5nSWQ7XHJcbiAgICB0aGlzLmNvc3RIZWFkSWQgPSBjb3N0SGVhZElkO1xyXG4gIH1cclxuXHJcbiAgaW5BY3RpdmVDb3N0SGVhZCgpIHtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdGFydCgpO1xyXG4gICAgbGV0IHByb2plY3RJZCA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuICAgIHRoaXMuY29zdFN1bW1hcnlTZXJ2aWNlLmluQWN0aXZlQ29zdEhlYWQoIHByb2plY3RJZCwgdGhpcy5idWlsZGluZ0lkLCB0aGlzLmNvc3RIZWFkSWQpLnN1YnNjcmliZShcclxuICAgICAgICBjb3N0SGVhZERldGFpbCA9PiB0aGlzLm9uSW5BY3RpdmVDb3N0SGVhZFN1Y2Nlc3MoY29zdEhlYWREZXRhaWwpLFxyXG4gICAgICAgIGVycm9yID0+IHRoaXMub25JbkFjdGl2ZUNvc3RIZWFkRmFpbHVyZShlcnJvcilcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgb25JbkFjdGl2ZUNvc3RIZWFkU3VjY2Vzcyhjb3N0SGVhZERldGFpbHM6IGFueSkge1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICAgICBpZiAoIGNvc3RIZWFkRGV0YWlscyAhPT0gbnVsbCkge1xyXG4gICAgICB0aGlzLnNob3dDb3N0SGVhZExpc3QgPSBmYWxzZTtcclxuICAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0RFTEVURV9DT1NUSEVBRDtcclxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5vbkNoYW5nZUNvc3RpbmdCeVVuaXQodGhpcy5kZWZhdWx0Q29zdGluZ0J5VW5pdCk7XHJcbiAgfVxyXG5cclxuICBvbkluQWN0aXZlQ29zdEhlYWRGYWlsdXJlKGVycm9yOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdG9wKCk7XHJcbiAgfVxyXG5cclxuICBvbkNoYW5nZUFjdGl2ZVNlbGVjdGVkQ29zdEhlYWQoc2VsZWN0ZWRJbkFjdGl2ZUNvc3RIZWFkSWQ6bnVtYmVyKSB7XHJcbiAgICB0aGlzLnNob3dDb3N0SGVhZExpc3Q9ZmFsc2U7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RhcnQoKTtcclxuICAgIHRoaXMuY29zdFN1bW1hcnlTZXJ2aWNlLmFjdGl2ZUNvc3RIZWFkKCB0aGlzLnByb2plY3RJZCwgdGhpcy5idWlsZGluZ0lkLCBzZWxlY3RlZEluQWN0aXZlQ29zdEhlYWRJZCkuc3Vic2NyaWJlKFxyXG4gICAgICBpbkFjdGl2ZUNvc3RIZWFkcyA9PiB0aGlzLm9uQWN0aXZlQ29zdEhlYWRTdWNjZXNzKGluQWN0aXZlQ29zdEhlYWRzKSxcclxuICAgICAgZXJyb3IgPT4gdGhpcy5vbkFjdGl2ZUNvc3RIZWFkRmFpbHVyZShlcnJvcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkFjdGl2ZUNvc3RIZWFkU3VjY2VzcyhpbkFjdGl2ZUNvc3RIZWFkcyA6IGFueSkge1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0FERF9DT1NUSEVBRDtcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIHRoaXMub25DaGFuZ2VDb3N0aW5nQnlVbml0KHRoaXMuZGVmYXVsdENvc3RpbmdCeVVuaXQpO1xyXG4gIH1cclxuXHJcbiAgb25BY3RpdmVDb3N0SGVhZEZhaWx1cmUoZXJyb3IgOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKCdvbkFjdGl2ZUNvc3RIZWFkRmFpbHVyZSgpJytlcnJvcik7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgY2hhbmdlQnVkZ2V0ZWRDb3N0QW1vdW50T2ZCdWlsZGluZ0Nvc3RIZWFkKGJ1aWxkaW5nSWQ6IHN0cmluZywgY29zdEhlYWQ6IHN0cmluZywgYW1vdW50OiBudW1iZXIpIHtcclxuICAgIGlmIChhbW91bnQgIT09IG51bGwpIHtcclxuICAgICAgbGV0IHByb2plY3RJZD1TZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfUFJPSkVDVF9JRCk7XHJcbiAgICAgIHRoaXMuY29zdFN1bW1hcnlTZXJ2aWNlLmNoYW5nZUJ1ZGdldGVkQ29zdEFtb3VudE9mQnVpbGRpbmdDb3N0SGVhZCggcHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZCwgYW1vdW50KS5zdWJzY3JpYmUoXHJcbiAgICAgICAgYnVpbGRpbmdEZXRhaWxzID0+IHRoaXMub25VcGRhdGVSYXRlT2ZUaHVtYlJ1bGVTdWNjZXNzKGJ1aWxkaW5nRGV0YWlscyksXHJcbiAgICAgICAgZXJyb3IgPT4gdGhpcy5vblVwZGF0ZVJhdGVPZlRodW1iUnVsZUZhaWx1cmUoZXJyb3IpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvblVwZGF0ZVJhdGVPZlRodW1iUnVsZVN1Y2Nlc3MoYnVpbGRpbmdEZXRhaWxzIDogYW55KSB7XHJcbiAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgIG1lc3NhZ2UuY3VzdG9tX21lc3NhZ2UgPSBNZXNzYWdlcy5NU0dfU1VDQ0VTU19VUERBVEVfVEhVTUJSVUxFX1JBVEVfQ09TVEhFQUQ7XHJcbiAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB0aGlzLm9uQ2hhbmdlQ29zdGluZ0J5VW5pdCh0aGlzLmRlZmF1bHRDb3N0aW5nQnlVbml0KTtcclxuICB9XHJcblxyXG4gIG9uVXBkYXRlUmF0ZU9mVGh1bWJSdWxlRmFpbHVyZShlcnJvciA6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coJ29uQWRkQ29zdGhlYWRTdWNjZXNzIDogJytlcnJvcik7XHJcbiAgfVxyXG5cclxuICBzZXRJZEZvckRlbGV0ZUJ1aWxkaW5nKGJ1aWxkaW5nSWQgOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuYnVpbGRpbmdJZCA9IGJ1aWxkaW5nSWQ7XHJcbiAgfVxyXG5cclxuICBkZWxldGVCdWlsZGluZygpIHtcclxuICAgIGxldCBwcm9qZWN0SWQ9U2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfSUQpO1xyXG4gICAgdGhpcy5idWlsZGluZ1NlcnZpY2UuZGVsZXRlQnVpbGRpbmcoIHByb2plY3RJZCwgdGhpcy5idWlsZGluZ0lkKS5zdWJzY3JpYmUoXHJcbiAgICAgIHByb2plY3QgPT4gdGhpcy5vbkRlbGV0ZUJ1aWxkaW5nU3VjY2Vzcyhwcm9qZWN0KSxcclxuICAgICAgZXJyb3IgPT4gdGhpcy5vbkRlbGV0ZUJ1aWxkaW5nRmFpbHVyZShlcnJvcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkRlbGV0ZUJ1aWxkaW5nU3VjY2VzcyhyZXN1bHQgOiBhbnkpIHtcclxuICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcclxuICAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0RFTEVURV9CVUlMRElORztcclxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgICB0aGlzLm9uQ2hhbmdlQ29zdGluZ0J5VW5pdCh0aGlzLmRlZmF1bHRDb3N0aW5nQnlVbml0KTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgb25EZWxldGVCdWlsZGluZ0ZhaWx1cmUoZXJyb3IgOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICB9XHJcblxyXG4gIGdvVG9FZGl0QnVpbGRpbmcoYnVpbGRpbmdJZDogc3RyaW5nKSB7XHJcbiAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfQlVJTERJTkcsIGJ1aWxkaW5nSWQpO1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9WSUVXX0JVSUxESU5HX0RFVEFJTFMsIGJ1aWxkaW5nSWRdKTtcclxuICB9XHJcblxyXG4gIGNsb25lQnVpbGRpbmcoYnVpbGRpbmdJZDogc3RyaW5nKSB7XHJcbiAgICBsZXQgcHJvamVjdElkPVNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuICAgIHRoaXMuYnVpbGRpbmdTZXJ2aWNlLmdldEJ1aWxkaW5nRGV0YWlsc0ZvckNsb25lKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQpLnN1YnNjcmliZShcclxuICAgICAgYnVpbGRpbmcgPT4gdGhpcy5vbkdldEJ1aWxkaW5nRGV0YWlsc0ZvckNsb25lU3VjY2VzcyhidWlsZGluZyksXHJcbiAgICAgIGVycm9yID0+IHRoaXMub25HZXRCdWlsZGluZ0RldGFpbHNGb3JDbG9uZUZhaWx1cmUoZXJyb3IpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgb25HZXRCdWlsZGluZ0RldGFpbHNGb3JDbG9uZVN1Y2Nlc3MoYnVpbGRpbmc6IGFueSkge1xyXG4gICAgdGhpcy5jbG9uZUJ1aWxkaW5nTW9kZWwgPSBidWlsZGluZy5kYXRhO1xyXG4gICAgdGhpcy5jbG9uZWRCdWlsZGluZ0RldGFpbHMgPSBidWlsZGluZy5kYXRhLmNvc3RIZWFkcztcclxuICB9XHJcblxyXG4gIG9uR2V0QnVpbGRpbmdEZXRhaWxzRm9yQ2xvbmVGYWlsdXJlKGVycm9yOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICB9XHJcblxyXG4gIGNsb25lQnVpbGRpbmdCYXNpY0RldGFpbHMoKSB7XHJcbiAgICBpZiAodGhpcy5jbG9uZUJ1aWxkaW5nRm9ybS52YWxpZCkge1xyXG4gICAgIC8vIHRoaXMuY2xvbmVCdWlsZGluZ01vZGVsID0gdGhpcy5jbG9uZUJ1aWxkaW5nRm9ybS52YWx1ZTtcclxuICAgICAgbGV0IHByb2plY3RJZD1TZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfUFJPSkVDVF9JRCk7XHJcbiAgICAgIHRoaXMuYnVpbGRpbmdTZXJ2aWNlLmNyZWF0ZUJ1aWxkaW5nKCBwcm9qZWN0SWQsIHRoaXMuY2xvbmVCdWlsZGluZ01vZGVsKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgICBidWlsZGluZyA9PiB0aGlzLm9uQ3JlYXRlQnVpbGRpbmdTdWNjZXNzKGJ1aWxkaW5nKSxcclxuICAgICAgICAgIGVycm9yID0+IHRoaXMub25DcmVhdGVCdWlsZGluZ0ZhaWx1cmUoZXJyb3IpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uQ3JlYXRlQnVpbGRpbmdTdWNjZXNzKGJ1aWxkaW5nOiBhbnkpIHtcclxuICAgIC8vdGhpcy5jbG9uZUJ1aWxkaW5nSWQgPSBidWlsZGluZy5kYXRhLl9pZDtcclxuICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0NMT05FRF9CVUlMRElOR19ERVRBSUxTO1xyXG4gICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgdGhpcy5vbkNoYW5nZUNvc3RpbmdCeVVuaXQodGhpcy5kZWZhdWx0Q29zdGluZ0J5VW5pdCk7XHJcbiAgfVxyXG5cclxuICBvbkNyZWF0ZUJ1aWxkaW5nRmFpbHVyZShlcnJvcjogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgfVxyXG5cclxuICBjbG9uZUJ1aWxkaW5nQ29zdEhlYWRzKGNsb25lQ29zdEhlYWQ6IENvc3RIZWFkKSB7XHJcbiAgICBsZXQgcHJvamVjdElkPVNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuICAgIHRoaXMuYnVpbGRpbmdTZXJ2aWNlLmNsb25lQnVpbGRpbmdDb3N0SGVhZHMoIHByb2plY3RJZCwgdGhpcy5jbG9uZUJ1aWxkaW5nSWQsIGNsb25lQ29zdEhlYWQpLnN1YnNjcmliZShcclxuICAgICAgcHJvamVjdCA9PiB0aGlzLm9uQ2xvbmVCdWlsZGluZ0Nvc3RIZWFkc1N1Y2Nlc3MocHJvamVjdCksXHJcbiAgICAgIGVycm9yID0+IHRoaXMub25DbG9uZUJ1aWxkaW5nQ29zdEhlYWRzRmFpbHVyZShlcnJvcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkNsb25lQnVpbGRpbmdDb3N0SGVhZHNTdWNjZXNzKHByb2plY3Q6IGFueSkge1xyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgbWVzc2FnZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfQUREX0JVSUxESU5HX1BST0pFQ1Q7XHJcbiAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB0aGlzLm9uQ2hhbmdlQ29zdGluZ0J5VW5pdCh0aGlzLmRlZmF1bHRDb3N0aW5nQnlVbml0KTtcclxuICB9XHJcblxyXG4gIG9uQ2xvbmVCdWlsZGluZ0Nvc3RIZWFkc0ZhaWx1cmUoZXJyb3I6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgY2FsY3VsYXRlR3JhbmRUb3RhbCgpIHtcclxuICAgIC8vVG9EbyB3ZSBoYXZlIHRvIHJlbW92ZSB0aGlzIGNvZGUgYWZ0ZXJcclxuICAgIHRoaXMuZ3JhbmRUb3RhbE9mQnVkZ2V0ZWRDb3N0ID0gMDtcclxuICAgIHRoaXMuZ3JhbmRUb3RhbE9mVG90YWxSYXRlID0gMDtcclxuICAgIHRoaXMuZ3JhbmRUb3RhbE9mQXJlYSA9IDA7XHJcblxyXG4gICAgdGhpcy5ncmFuZFRvdGFsT2ZFc3RpbWF0ZWRDb3N0ID0gMDtcclxuICAgIHRoaXMuZ3JhbmRUb3RhbE9mRXN0aW1hdGVkUmF0ZSA9IDA7XHJcblxyXG4gICAgLy9DYWxjdWxhdGUgdG90YWwgb2YgYWxsIGJ1aWxkaW5nXHJcbiAgICBmb3IgKGxldCBidWlsZGluZEluZGV4ID0gMDsgYnVpbGRpbmRJbmRleCA8IHRoaXMuYnVpbGRpbmdzUmVwb3J0Lmxlbmd0aDsgYnVpbGRpbmRJbmRleCsrKSB7XHJcblxyXG4gICAgICB0aGlzLmdyYW5kVG90YWxPZkJ1ZGdldGVkQ29zdCA9IHRoaXMuZ3JhbmRUb3RhbE9mQnVkZ2V0ZWRDb3N0ICsgdGhpcy5idWlsZGluZ3NSZXBvcnRbYnVpbGRpbmRJbmRleF0udGh1bWJSdWxlLnRvdGFsQnVkZ2V0ZWRDb3N0O1xyXG5cclxuICAgICAgdGhpcy5ncmFuZFRvdGFsT2ZUb3RhbFJhdGUgPSB0aGlzLmdyYW5kVG90YWxPZlRvdGFsUmF0ZSArIHRoaXMuYnVpbGRpbmdzUmVwb3J0W2J1aWxkaW5kSW5kZXhdLnRodW1iUnVsZS50b3RhbFJhdGU7XHJcblxyXG4gICAgICB0aGlzLmdyYW5kVG90YWxPZkFyZWEgPSB0aGlzLmdyYW5kVG90YWxPZkFyZWEgKyB0aGlzLmJ1aWxkaW5nc1JlcG9ydFtidWlsZGluZEluZGV4XS5hcmVhO1xyXG5cclxuICAgICAgdGhpcy5ncmFuZFRvdGFsT2ZFc3RpbWF0ZWRDb3N0ID0gdGhpcy5ncmFuZFRvdGFsT2ZFc3RpbWF0ZWRDb3N0ICtcclxuICAgICAgIHRoaXMuYnVpbGRpbmdzUmVwb3J0W2J1aWxkaW5kSW5kZXhdLmVzdGltYXRlLnRvdGFsRXN0aW1hdGVkQ29zdDtcclxuXHJcbiAgICAgIHRoaXMuZ3JhbmRUb3RhbE9mRXN0aW1hdGVkUmF0ZSA9IHRoaXMuZ3JhbmRUb3RhbE9mRXN0aW1hdGVkUmF0ZSArXHJcbiAgICAgICB0aGlzLmJ1aWxkaW5nc1JlcG9ydFtidWlsZGluZEluZGV4XS5lc3RpbWF0ZS50b3RhbFJhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgLy9DYWxjdWxhdGUgdG90YWwgd2l0aCBhbWVuaXRpZXMgZGF0YVxyXG4gICAgdGhpcy5ncmFuZFRvdGFsT2ZCdWRnZXRlZENvc3QgPSB0aGlzLmdyYW5kVG90YWxPZkJ1ZGdldGVkQ29zdCArIHRoaXMuYW1lbml0aWVzUmVwb3J0LnRodW1iUnVsZS50b3RhbEJ1ZGdldGVkQ29zdDtcclxuXHJcbiAgICB0aGlzLmdyYW5kVG90YWxPZlRvdGFsUmF0ZSA9IHRoaXMuZ3JhbmRUb3RhbE9mVG90YWxSYXRlICsgdGhpcy5hbWVuaXRpZXNSZXBvcnQudGh1bWJSdWxlLnRvdGFsUmF0ZTtcclxuXHJcbiAgICB0aGlzLmdyYW5kVG90YWxPZkVzdGltYXRlZENvc3QgPSB0aGlzLmdyYW5kVG90YWxPZkVzdGltYXRlZENvc3QgKyB0aGlzLmFtZW5pdGllc1JlcG9ydC5lc3RpbWF0ZS50b3RhbEVzdGltYXRlZENvc3Q7XHJcblxyXG4gICAgdGhpcy5ncmFuZFRvdGFsT2ZFc3RpbWF0ZWRSYXRlID0gdGhpcy5ncmFuZFRvdGFsT2ZFc3RpbWF0ZWRSYXRlICsgdGhpcy5hbWVuaXRpZXNSZXBvcnQuZXN0aW1hdGUudG90YWxSYXRlO1xyXG4gIH1cclxuXHJcbiAgdG9nZ2xlU2hvd0dyYW5kVG90YWxQYW5lbEJvZHkoKSB7XHJcbiAgICB0aGlzLnNob3dHcmFuZFRvdGFsUGFuZWxCb2R5PSF0aGlzLnNob3dHcmFuZFRvdGFsUGFuZWxCb2R5O1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlRWxlbWVudChlbGVtZW50VHlwZSA6IHN0cmluZykge1xyXG4gICAgaWYoZWxlbWVudFR5cGUgPT09IFByb2plY3RFbGVtZW50cy5DT1NUX0hFQUQpIHtcclxuICAgICAgdGhpcy5pbkFjdGl2ZUNvc3RIZWFkKCk7XHJcbiAgICB9XHJcbiAgICBpZihlbGVtZW50VHlwZSA9PT0gUHJvamVjdEVsZW1lbnRzLkJVSUxESU5HKSB7XHJcbiAgICAgIHRoaXMuZGVsZXRlQnVpbGRpbmcoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldENvc3RTdW1tYXJ5UmVwb3J0KCkge1xyXG4gICAgdGhpcy5vbkNoYW5nZUNvc3RpbmdCeVVuaXQodGhpcy5kZWZhdWx0Q29zdGluZ0J5VW5pdCk7XHJcbiAgfVxyXG5cclxuICBnZXRNZW51cygpIHtcclxuICAgIHJldHVybiBNZW51cztcclxuICB9XHJcblxyXG4gIGdldExhYmVsKCkge1xyXG4gICAgcmV0dXJuIExhYmVsO1xyXG4gIH1cclxuXHJcbiAgZ2V0QnV0dG9uKCkge1xyXG4gICAgcmV0dXJuIEJ1dHRvbjtcclxuICB9XHJcblxyXG4gIGdldEhlYWRpbmdzKCkge1xyXG4gICAgcmV0dXJuIEhlYWRpbmdzO1xyXG4gIH1cclxuXHJcbiAgZ2V0UHJvamVjdEVsZW1lbnRzKCkge1xyXG4gICAgcmV0dXJuIFByb2plY3RFbGVtZW50cztcclxuICB9XHJcblxyXG59XHJcbiJdfQ==
