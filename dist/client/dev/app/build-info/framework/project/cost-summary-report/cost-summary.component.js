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
var jsPDF = require("jspdf");
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
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CURRENT_VIEW, 'costSummary');
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
    CostSummaryComponent.prototype.downloadToPdf = function () {
        var doc = new jsPDF();
        var specialElementHandlers = {
            '#editor': function (element, renderer) {
                return true;
            }
        };
        var content = this.content.nativeElement;
        doc.fromHTML(content.innerHTML, 5, 5, {
            'width': 1900,
            'elementHandlers': specialElementHandlers
        });
        doc.save('test.pdf');
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1zdW1tYXJ5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUF5RTtBQUN6RSwwQ0FBMEQ7QUFDMUQsMERBR3NDO0FBQ3RDLGtEQUFxSDtBQUNySCwrREFBNEQ7QUFDNUQsaURBQWdEO0FBQ2hELHdDQUF3RDtBQUN4RCw4RkFBNEY7QUFDNUYsaUVBQStEO0FBSS9ELDBEQUE2RDtBQUM3RCw2RUFBMEU7QUFDMUUsNkJBQStCO0FBUy9CO0lBOENFLDhCQUFvQixrQkFBdUMsRUFBVSxjQUErQixFQUNoRixXQUF3QixFQUFVLE9BQWdCLEVBQVUsY0FBK0IsRUFDM0YsZUFBZ0MsRUFBVSxhQUE2QjtRQUZ2RSx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQXFCO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQWlCO1FBQ2hGLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFpQjtRQUMzRixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBZ0I7UUEzQjNGLHFCQUFnQixHQUFTLEtBQUssQ0FBQztRQUMvQiw0QkFBdUIsR0FBUyxJQUFJLENBQUM7UUFDckMsaUJBQVksR0FBUSxDQUFDLENBQUM7UUFJdEIsdUJBQWtCLEdBQWEsSUFBSSxtQkFBUSxFQUFFLENBQUM7UUFHdkMsV0FBTSxHQUFVO1lBQ3JCLEVBQUUsVUFBVSxFQUFFLDJCQUFlLENBQUMsV0FBVyxFQUFDO1lBQzFDLEVBQUUsVUFBVSxFQUFFLDJCQUFlLENBQUMsV0FBVyxFQUFDO1NBQzNDLENBQUM7UUFFSyxZQUFPLEdBQVU7WUFDdEIsRUFBRSxXQUFXLEVBQUUsMkJBQWUsQ0FBQyxTQUFTLEVBQUM7WUFDekMsRUFBRSxXQUFXLEVBQUUsMkJBQWUs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QUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ3BDLE9BQU8sRUFBRSxJQUFJO1lBQ2IsaUJBQWlCLEVBQUUsc0JBQXNCO1NBQzFDLENBQUMsQ0FBQztRQUVILEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQTVZcUI7UUFBckIsZ0JBQVMsQ0FBQyxTQUFTLENBQUM7a0NBQVUsaUJBQVU7eURBQUM7SUFGL0Isb0JBQW9CO1FBUGhDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLHdCQUF3QjtZQUNsQyxXQUFXLEVBQUUsNkJBQTZCO1lBQzFDLFNBQVMsRUFBRSxDQUFDLDRCQUE0QixDQUFDO1NBQzFDLENBQUM7eUNBZ0R5Qyx5Q0FBa0IsRUFBMkIsdUJBQWM7WUFDbkUsbUJBQVcsRUFBb0IsZUFBTSxFQUEyQixzQkFBYztZQUMxRSxrQ0FBZSxFQUEwQiwrQkFBYTtPQWhEaEYsb0JBQW9CLENBZ1poQztJQUFELDJCQUFDO0NBaFpELEFBZ1pDLElBQUE7QUFoWlksb0RBQW9CIiwiZmlsZSI6ImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1zdW1tYXJ5LmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUm91dGVyICwgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQge1xyXG4gIE5hdmlnYXRpb25Sb3V0ZXMsIFByb2plY3RFbGVtZW50cywgQnV0dG9uLCBNZW51cywgSGVhZGluZ3MsIExhYmVsLFxyXG4gIFZhbHVlQ29uc3RhbnRcclxufSBmcm9tICcuLi8uLi8uLi8uLi9zaGFyZWQvY29uc3RhbnRzJztcclxuaW1wb3J0IHsgU2Vzc2lvblN0b3JhZ2UsIFNlc3Npb25TdG9yYWdlU2VydmljZSwgIE1lc3NhZ2UsIE1lc3NhZ2VzLCBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IENvc3RTdW1tYXJ5U2VydmljZSB9IGZyb20gJy4vY29zdC1zdW1tYXJ5LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBCdWlsZGluZyB9IGZyb20gJy4uLy4uL21vZGVsL2J1aWxkaW5nJztcclxuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zaGFyZWQvY3VzdG9tdmFsaWRhdGlvbnMvdmFsaWRhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQnVpbGRpbmdTZXJ2aWNlIH0gZnJvbSAnLi4vYnVpbGRpbmcvYnVpbGRpbmcuc2VydmljZSc7XHJcbmltcG9ydCB7IENvc3RIZWFkIH0gZnJvbSAnLi4vLi4vbW9kZWwvY29zdGhlYWQnO1xyXG5pbXBvcnQgeyBFc3RpbWF0ZVJlcG9ydCB9IGZyb20gJy4uLy4uL21vZGVsL2VzdGltYXRlLXJlcG9ydCc7XHJcbmltcG9ydCB7IEJ1aWxkaW5nUmVwb3J0IH0gZnJvbSAnLi4vLi4vbW9kZWwvYnVpbGRpbmctcmVwb3J0JztcclxuaW1wb3J0IFByb2plY3RSZXBvcnQgPSByZXF1aXJlKCcuLi8uLi9tb2RlbC9wcm9qZWN0LXJlcG9ydCcpO1xyXG5pbXBvcnQgeyBMb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2hhcmVkL2xvYWRlci9sb2FkZXJzLnNlcnZpY2UnO1xyXG5pbXBvcnQgKiBhcyBqc1BERiBmcm9tICdqc3BkZic7XHJcbi8qLy8vIDxyZWZlcmVuY2UgcGF0aD0nLi4vLi4vLi4vLi4vLi4vLi4vLi4vdG9vbHMvbWFudWFsX3R5cGluZ3MvcHJvamVjdC9qc3BkZi5kLnRzJy8+Ki9cclxuQENvbXBvbmVudCh7XHJcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICBzZWxlY3RvcjogJ2JpLWNvc3Qtc3VtbWFyeS1yZXBvcnQnLFxyXG4gIHRlbXBsYXRlVXJsOiAnY29zdC1zdW1tYXJ5LmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnY29zdC1zdW1tYXJ5LmNvbXBvbmVudC5jc3MnXSxcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBDb3N0U3VtbWFyeUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIEBWaWV3Q2hpbGQoJ2NvbnRlbnQnKSBjb250ZW50OiBFbGVtZW50UmVmO1xyXG4gIGJ1aWxkaW5nc1JlcG9ydDogQXJyYXkgPEJ1aWxkaW5nUmVwb3J0PjtcclxuICBhbWVuaXRpZXNSZXBvcnQ6IEJ1aWxkaW5nUmVwb3J0O1xyXG4gIHByb2plY3RSZXBvcnQ6IFByb2plY3RSZXBvcnQ7XHJcbiAgcHJvamVjdElkOiBzdHJpbmc7XHJcbiAgYnVpbGRpbmdJZDogc3RyaW5nO1xyXG4gIGNsb25lQnVpbGRpbmdJZDogc3RyaW5nO1xyXG4gIGNvc3RIZWFkSWQ6IG51bWJlcjtcclxuXHJcbiAgZ3JhbmRUb3RhbE9mQnVkZ2V0ZWRDb3N0OiBudW1iZXI7XHJcbiAgZ3JhbmRUb3RhbE9mVG90YWxSYXRlOiBudW1iZXI7XHJcbiAgZ3JhbmRUb3RhbE9mQXJlYTogbnVtYmVyO1xyXG4gIGdyYW5kVG90YWxPZkVzdGltYXRlZENvc3QgOiBudW1iZXI7XHJcbiAgZ3JhbmRUb3RhbE9mRXN0aW1hdGVkUmF0ZSA6IG51bWJlcjtcclxuXHJcbiAgYnVpbGRpbmdOYW1lIDogc3RyaW5nO1xyXG4gIGNvc3RIZWFkOiBzdHJpbmc7XHJcblxyXG4gIGVzdGltYXRlZEl0ZW06IEVzdGltYXRlUmVwb3J0O1xyXG4gIHNob3dDb3N0SGVhZExpc3Q6Ym9vbGVhbj1mYWxzZTtcclxuICBzaG93R3JhbmRUb3RhbFBhbmVsQm9keTpib29sZWFuPXRydWU7XHJcbiAgY29tcGFyZUluZGV4Om51bWJlcj0wO1xyXG5cclxuIHB1YmxpYyBpbkFjdGl2ZUNvc3RIZWFkQXJyYXk6IEFycmF5PENvc3RIZWFkPjtcclxuICBjbG9uZUJ1aWxkaW5nRm9ybTogRm9ybUdyb3VwO1xyXG4gIGNsb25lQnVpbGRpbmdNb2RlbDogQnVpbGRpbmcgPSBuZXcgQnVpbGRpbmcoKTtcclxuICBjbG9uZWRCdWlsZGluZ0RldGFpbHM6IEFycmF5PENvc3RIZWFkPjtcclxuXHJcbiAgcHVibGljIGNvc3RJbjogYW55W10gPSBbXHJcbiAgICB7ICdjb3N0SW5JZCc6IFByb2plY3RFbGVtZW50cy5SU19QRVJfU1FGVH0sXHJcbiAgICB7ICdjb3N0SW5JZCc6IFByb2plY3RFbGVtZW50cy5SU19QRVJfU1FNVH1cclxuICBdO1xyXG5cclxuICBwdWJsaWMgY29zdFBlcjogYW55W10gPSBbXHJcbiAgICB7ICdjb3N0UGVySWQnOiBQcm9qZWN0RWxlbWVudHMuU0xBQl9BUkVBfSxcclxuICAgIHsgJ2Nvc3RQZXJJZCc6IFByb2plY3RFbGVtZW50cy5TQUxFQUJMRV9BUkVBfSxcclxuICAgIHsgJ2Nvc3RQZXJJZCc6IFByb2plY3RFbGVtZW50cy5DQVJQRVRfQVJFQX0sXHJcbiAgXTtcclxuXHJcbiAgZGVmYXVsdENvc3RpbmdCeVVuaXQ6c3RyaW5nID0gUHJvamVjdEVsZW1lbnRzLlJTX1BFUl9TUUZUO1xyXG4gIGRlZmF1bHRDb3N0aW5nQnlBcmVhOnN0cmluZyA9IFByb2plY3RFbGVtZW50cy5TTEFCX0FSRUE7XHJcbiAgZGVsZXRlQ29uZmlybWF0aW9uQ29zdEhlYWQgPSBQcm9qZWN0RWxlbWVudHMuQ09TVF9IRUFEO1xyXG4gIGRlbGV0ZUNvbmZpcm1hdGlvbkJ1aWxkaW5nID0gUHJvamVjdEVsZW1lbnRzLkJVSUxESU5HO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvc3RTdW1tYXJ5U2VydmljZSA6IENvc3RTdW1tYXJ5U2VydmljZSwgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZSA6IEFjdGl2YXRlZFJvdXRlLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgZm9ybUJ1aWxkZXI6IEZvcm1CdWlsZGVyLCBwcml2YXRlIF9yb3V0ZXIgOiBSb3V0ZXIsIHByaXZhdGUgbWVzc2FnZVNlcnZpY2UgOiBNZXNzYWdlU2VydmljZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIGJ1aWxkaW5nU2VydmljZTogQnVpbGRpbmdTZXJ2aWNlLCBwcml2YXRlIGxvYWRlclNlcnZpY2UgOiBMb2FkZXJTZXJ2aWNlKSB7XHJcblxyXG4gICAgdGhpcy5jbG9uZUJ1aWxkaW5nRm9ybSA9IHRoaXMuZm9ybUJ1aWxkZXIuZ3JvdXAoe1xyXG4gICAgICBuYW1lIDogWycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZEJ1aWxkaW5nTmFtZV0sXHJcbiAgICAgIHRvdGFsU2xhYkFyZWEgOlsnJywgVmFsaWRhdGlvblNlcnZpY2UucmVxdWlyZWRTbGFiQXJlYV0sXHJcbiAgICAgIHRvdGFsQ2FycGV0QXJlYU9mVW5pdCA6WycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZENhcnBldEFyZWFdLFxyXG4gICAgICB0b3RhbFNhbGVhYmxlQXJlYU9mVW5pdCA6WycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZFNhbGVibGVBcmVhXSxcclxuICAgICAgcGxpbnRoQXJlYSA6WycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZFBsaW50aEFyZWFdLFxyXG4gICAgICB0b3RhbE51bU9mRmxvb3JzIDpbJycsIFZhbGlkYXRpb25TZXJ2aWNlLnJlcXVpcmVkVG90YWxOdW1PZkZsb29yc10sXHJcbiAgICAgIG51bU9mUGFya2luZ0Zsb29ycyA6WycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZE51bU9mUGFya2luZ0Zsb29yc10sXHJcbiAgICAgIGNhcnBldEFyZWFPZlBhcmtpbmcgOlsnJywgVmFsaWRhdGlvblNlcnZpY2UucmVxdWlyZWRDYXJwZXRBcmVhT2ZQYXJraW5nXSxcclxuICAgICAgbnVtT2ZPbmVCSEsgOiBbJyddLFxyXG4gICAgICBudW1PZlR3b0JISyA6WycnXSxcclxuICAgICAgbnVtT2ZUaHJlZUJISyA6WycnXSxcclxuICAgICAgbnVtT2ZGb3VyQkhLIDpbJyddLFxyXG4gICAgICBudW1PZkZpdmVCSEsgOlsnJ10sXHJcbiAgICAgIG51bU9mTGlmdHMgOlsnJ11cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfVklFVywnY29zdFN1bW1hcnknKTtcclxuICAgIHRoaXMuYWN0aXZhdGVkUm91dGUucGFyYW1zLnN1YnNjcmliZShwYXJhbXMgPT4ge1xyXG4gICAgICB0aGlzLnByb2plY3RJZCA9IHBhcmFtc1sncHJvamVjdElkJ107XHJcbiAgICAgIGlmKHRoaXMucHJvamVjdElkKSB7XHJcbiAgICAgICAgdGhpcy5vbkNoYW5nZUNvc3RpbmdCeVVuaXQodGhpcy5kZWZhdWx0Q29zdGluZ0J5VW5pdCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0QnVpbGRpbmdJZCggaTpudW1iZXIsIGJ1aWxkaW5nSWQ6IHN0cmluZykge1xyXG4gICAgdGhpcy5jb21wYXJlSW5kZXggPSBpO1xyXG4gICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX0JVSUxESU5HLCBidWlsZGluZ0lkKTtcclxuICB9XHJcblxyXG4gIGdldEFsbEluQWN0aXZlQ29zdEhlYWRzKGJ1aWxkaW5nSWQ6IHN0cmluZykge1xyXG4gICAgdGhpcy5idWlsZGluZ0lkPWJ1aWxkaW5nSWQ7XHJcbiAgICB0aGlzLmNvc3RTdW1tYXJ5U2VydmljZS5nZXRBbGxJbkFjdGl2ZUNvc3RIZWFkcyggdGhpcy5wcm9qZWN0SWQsIHRoaXMuYnVpbGRpbmdJZCkuc3Vic2NyaWJlKFxyXG4gICAgICBpbkFjdGl2ZUNvc3RIZWFkcyA9PiB0aGlzLm9uR2V0QWxsSW5BY3RpdmVDb3N0SGVhZHNTdWNjZXNzKGluQWN0aXZlQ29zdEhlYWRzKSxcclxuICAgICAgZXJyb3IgPT4gdGhpcy5vbkdldEFsbEluQWN0aXZlQ29zdEhlYWRzRmFpbHVyZShlcnJvcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkdldEFsbEluQWN0aXZlQ29zdEhlYWRzU3VjY2VzcyhpbkFjdGl2ZUNvc3RIZWFkcyA6IGFueSkge1xyXG4gICAgICB0aGlzLmluQWN0aXZlQ29zdEhlYWRBcnJheT1pbkFjdGl2ZUNvc3RIZWFkcy5kYXRhO1xyXG4gICAgICB0aGlzLnNob3dDb3N0SGVhZExpc3Q9dHJ1ZTtcclxuICB9XHJcblxyXG4gIG9uR2V0QWxsSW5BY3RpdmVDb3N0SGVhZHNGYWlsdXJlKGVycm9yIDogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgfVxyXG5cclxuICBnb1RvQ29zdEhlYWRWaWV3KCBidWlsZGluZ0lkIDogc3RyaW5nLCBidWlsZGluZ05hbWU6c3RyaW5nLCBlc3RpbWF0ZWRJdGVtIDphbnkpIHtcclxuXHJcbiAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfQlVJTERJTkcsIGJ1aWxkaW5nSWQpO1xyXG4gICAgdGhpcy5idWlsZGluZ0lkID0gIFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9CVUlMRElORyk7XHJcbiAgICB0aGlzLnByb2plY3RJZCA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuXHJcbiAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW05hdmlnYXRpb25Sb3V0ZXMuQVBQX1BST0pFQ1QsIHRoaXMucHJvamVjdElkLCBOYXZpZ2F0aW9uUm91dGVzLkFQUF9CVUlMRElORyxcclxuICAgICAgYnVpbGRpbmdOYW1lLCBOYXZpZ2F0aW9uUm91dGVzLkFQUF9DT1NUX0hFQUQsIGVzdGltYXRlZEl0ZW0ubmFtZSwgIGVzdGltYXRlZEl0ZW0ucmF0ZUFuYWx5c2lzSWQsIE5hdmlnYXRpb25Sb3V0ZXMuQVBQX0NBVEVHT1JZXSk7XHJcbiAgfVxyXG5cclxuICBnb1RvQ29tbW9uQW1lbml0aWVzKCkge1xyXG4gICAgdGhpcy5wcm9qZWN0SWQgPSBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfUFJPSkVDVF9JRCk7XHJcbiAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW05hdmlnYXRpb25Sb3V0ZXMuQVBQX1BST0pFQ1QsdGhpcy5wcm9qZWN0SWQsTmF2aWdhdGlvblJvdXRlcy5BUFBfQ09NTU9OX0FNRU5JVElFU10pO1xyXG4gIH1cclxuXHJcbiAgb25DaGFuZ2VDb3N0aW5nQnlVbml0KGNvc3RpbmdCeVVuaXQ6YW55KSB7XHJcbiAgICB0aGlzLmRlZmF1bHRDb3N0aW5nQnlVbml0PWNvc3RpbmdCeVVuaXQ7XHJcbiAgICB0aGlzLmNvc3RTdW1tYXJ5U2VydmljZS5nZXRDb3N0U3VtbWFyeVJlcG9ydCggdGhpcy5wcm9qZWN0SWQsIHRoaXMuZGVmYXVsdENvc3RpbmdCeVVuaXQsIHRoaXMuZGVmYXVsdENvc3RpbmdCeUFyZWEpLnN1YnNjcmliZShcclxuICAgICAgcHJvamVjdENvc3RJbiA9PiB0aGlzLm9uR2V0Q29zdFN1bW1hcnlSZXBvcnRTdWNjZXNzKHByb2plY3RDb3N0SW4pLFxyXG4gICAgICBlcnJvciA9PiB0aGlzLm9uR2V0Q29zdFN1bW1hcnlSZXBvcnRGYWlsdXJlKGVycm9yKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIG9uR2V0Q29zdFN1bW1hcnlSZXBvcnRTdWNjZXNzKHByb2plY3RzIDogYW55KSB7XHJcbiAgICB0aGlzLnByb2plY3RSZXBvcnQgPSBuZXcgUHJvamVjdFJlcG9ydCggcHJvamVjdHMuZGF0YS5idWlsZGluZ3MsIHByb2plY3RzLmRhdGEuY29tbW9uQW1lbml0aWVzWzBdKSA7XHJcbiAgICB0aGlzLmJ1aWxkaW5nc1JlcG9ydCA9IHRoaXMucHJvamVjdFJlcG9ydC5idWlsZGluZ3M7XHJcbiAgICB0aGlzLmFtZW5pdGllc1JlcG9ydCA9IHRoaXMucHJvamVjdFJlcG9ydC5jb21tb25BbWVuaXRpZXM7XHJcbiAgICB0aGlzLmNhbGN1bGF0ZUdyYW5kVG90YWwoKTtcclxuICB9XHJcblxyXG4gIG9uR2V0Q29zdFN1bW1hcnlSZXBvcnRGYWlsdXJlKGVycm9yIDogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZygnb25HZXRDb3N0SW5GYWlsKCknK2Vycm9yKTtcclxuICB9XHJcblxyXG4gIC8vVE9ETyA6IENoZWNrIGlmIGNhbiBtZXJnZVxyXG4gIG9uQ2hhbmdlQ29zdGluZ0J5QXJlYShjb3N0aW5nQnlBcmVhOmFueSkge1xyXG4gICAgdGhpcy5kZWZhdWx0Q29zdGluZ0J5QXJlYT1jb3N0aW5nQnlBcmVhO1xyXG4gICAgdGhpcy5jb3N0U3VtbWFyeVNlcnZpY2UuZ2V0Q29zdFN1bW1hcnlSZXBvcnQoIHRoaXMucHJvamVjdElkLCB0aGlzLmRlZmF1bHRDb3N0aW5nQnlVbml0LCB0aGlzLmRlZmF1bHRDb3N0aW5nQnlBcmVhKS5zdWJzY3JpYmUoXHJcbiAgICAgIHByb2plY3RDb3N0UGVyID0+IHRoaXMub25HZXRDb3N0U3VtbWFyeVJlcG9ydFN1Y2Nlc3MocHJvamVjdENvc3RQZXIpLFxyXG4gICAgICBlcnJvciA9PiB0aGlzLm9uR2V0Q29zdFN1bW1hcnlSZXBvcnRGYWlsdXJlKGVycm9yKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHNldElkc1RvSW5BY3RpdmVDb3N0SGVhZChidWlsZGluZ0lkOiBzdHJpbmcsIGNvc3RIZWFkSWQ6IG51bWJlcikge1xyXG4gICAgdGhpcy5idWlsZGluZ0lkID0gYnVpbGRpbmdJZDtcclxuICAgIHRoaXMuY29zdEhlYWRJZCA9IGNvc3RIZWFkSWQ7XHJcbiAgfVxyXG5cclxuICBpbkFjdGl2ZUNvc3RIZWFkKCkge1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0YXJ0KCk7XHJcbiAgICBsZXQgcHJvamVjdElkID0gU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfSUQpO1xyXG4gICAgdGhpcy5jb3N0U3VtbWFyeVNlcnZpY2UuaW5BY3RpdmVDb3N0SGVhZCggcHJvamVjdElkLCB0aGlzLmJ1aWxkaW5nSWQsIHRoaXMuY29zdEhlYWRJZCkuc3Vic2NyaWJlKFxyXG4gICAgICAgIGNvc3RIZWFkRGV0YWlsID0+IHRoaXMub25JbkFjdGl2ZUNvc3RIZWFkU3VjY2Vzcyhjb3N0SGVhZERldGFpbCksXHJcbiAgICAgICAgZXJyb3IgPT4gdGhpcy5vbkluQWN0aXZlQ29zdEhlYWRGYWlsdXJlKGVycm9yKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICBvbkluQWN0aXZlQ29zdEhlYWRTdWNjZXNzKGNvc3RIZWFkRGV0YWlsczogYW55KSB7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gICAgIGlmICggY29zdEhlYWREZXRhaWxzICE9PSBudWxsKSB7XHJcbiAgICAgIHRoaXMuc2hvd0Nvc3RIZWFkTGlzdCA9IGZhbHNlO1xyXG4gICAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfREVMRVRFX0NPU1RIRUFEO1xyXG4gICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLm9uQ2hhbmdlQ29zdGluZ0J5VW5pdCh0aGlzLmRlZmF1bHRDb3N0aW5nQnlVbml0KTtcclxuICB9XHJcblxyXG4gIG9uSW5BY3RpdmVDb3N0SGVhZEZhaWx1cmUoZXJyb3I6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICB9XHJcblxyXG4gIG9uQ2hhbmdlQWN0aXZlU2VsZWN0ZWRDb3N0SGVhZChzZWxlY3RlZEluQWN0aXZlQ29zdEhlYWRJZDpudW1iZXIpIHtcclxuICAgIHRoaXMuc2hvd0Nvc3RIZWFkTGlzdD1mYWxzZTtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdGFydCgpO1xyXG4gICAgdGhpcy5jb3N0U3VtbWFyeVNlcnZpY2UuYWN0aXZlQ29zdEhlYWQoIHRoaXMucHJvamVjdElkLCB0aGlzLmJ1aWxkaW5nSWQsIHNlbGVjdGVkSW5BY3RpdmVDb3N0SGVhZElkKS5zdWJzY3JpYmUoXHJcbiAgICAgIGluQWN0aXZlQ29zdEhlYWRzID0+IHRoaXMub25BY3RpdmVDb3N0SGVhZFN1Y2Nlc3MoaW5BY3RpdmVDb3N0SGVhZHMpLFxyXG4gICAgICBlcnJvciA9PiB0aGlzLm9uQWN0aXZlQ29zdEhlYWRGYWlsdXJlKGVycm9yKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIG9uQWN0aXZlQ29zdEhlYWRTdWNjZXNzKGluQWN0aXZlQ29zdEhlYWRzIDogYW55KSB7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgbWVzc2FnZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfQUREX0NPU1RIRUFEO1xyXG4gICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgdGhpcy5vbkNoYW5nZUNvc3RpbmdCeVVuaXQodGhpcy5kZWZhdWx0Q29zdGluZ0J5VW5pdCk7XHJcbiAgfVxyXG5cclxuICBvbkFjdGl2ZUNvc3RIZWFkRmFpbHVyZShlcnJvciA6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coJ29uQWN0aXZlQ29zdEhlYWRGYWlsdXJlKCknK2Vycm9yKTtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdG9wKCk7XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VCdWRnZXRlZENvc3RBbW91bnRPZkJ1aWxkaW5nQ29zdEhlYWQoYnVpbGRpbmdJZDogc3RyaW5nLCBjb3N0SGVhZDogc3RyaW5nLCBhbW91bnQ6IG51bWJlcikge1xyXG4gICAgaWYgKGFtb3VudCAhPT0gbnVsbCkge1xyXG4gICAgICBsZXQgcHJvamVjdElkPVNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuICAgICAgdGhpcy5jb3N0U3VtbWFyeVNlcnZpY2UuY2hhbmdlQnVkZ2V0ZWRDb3N0QW1vdW50T2ZCdWlsZGluZ0Nvc3RIZWFkKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQsIGNvc3RIZWFkLCBhbW91bnQpLnN1YnNjcmliZShcclxuICAgICAgICBidWlsZGluZ0RldGFpbHMgPT4gdGhpcy5vblVwZGF0ZVJhdGVPZlRodW1iUnVsZVN1Y2Nlc3MoYnVpbGRpbmdEZXRhaWxzKSxcclxuICAgICAgICBlcnJvciA9PiB0aGlzLm9uVXBkYXRlUmF0ZU9mVGh1bWJSdWxlRmFpbHVyZShlcnJvcilcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uVXBkYXRlUmF0ZU9mVGh1bWJSdWxlU3VjY2VzcyhidWlsZGluZ0RldGFpbHMgOiBhbnkpIHtcclxuICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX1VQREFURV9USFVNQlJVTEVfUkFURV9DT1NUSEVBRDtcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIHRoaXMub25DaGFuZ2VDb3N0aW5nQnlVbml0KHRoaXMuZGVmYXVsdENvc3RpbmdCeVVuaXQpO1xyXG4gIH1cclxuXHJcbiAgb25VcGRhdGVSYXRlT2ZUaHVtYlJ1bGVGYWlsdXJlKGVycm9yIDogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZygnb25BZGRDb3N0aGVhZFN1Y2Nlc3MgOiAnK2Vycm9yKTtcclxuICB9XHJcblxyXG4gIHNldElkRm9yRGVsZXRlQnVpbGRpbmcoYnVpbGRpbmdJZCA6IHN0cmluZykge1xyXG4gICAgdGhpcy5idWlsZGluZ0lkID0gYnVpbGRpbmdJZDtcclxuICB9XHJcblxyXG4gIGRlbGV0ZUJ1aWxkaW5nKCkge1xyXG4gICAgbGV0IHByb2plY3RJZD1TZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfUFJPSkVDVF9JRCk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nU2VydmljZS5kZWxldGVCdWlsZGluZyggcHJvamVjdElkLCB0aGlzLmJ1aWxkaW5nSWQpLnN1YnNjcmliZShcclxuICAgICAgcHJvamVjdCA9PiB0aGlzLm9uRGVsZXRlQnVpbGRpbmdTdWNjZXNzKHByb2plY3QpLFxyXG4gICAgICBlcnJvciA9PiB0aGlzLm9uRGVsZXRlQnVpbGRpbmdGYWlsdXJlKGVycm9yKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIG9uRGVsZXRlQnVpbGRpbmdTdWNjZXNzKHJlc3VsdCA6IGFueSkge1xyXG4gICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xyXG4gICAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfREVMRVRFX0JVSUxESU5HO1xyXG4gICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICAgIHRoaXMub25DaGFuZ2VDb3N0aW5nQnlVbml0KHRoaXMuZGVmYXVsdENvc3RpbmdCeVVuaXQpO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBvbkRlbGV0ZUJ1aWxkaW5nRmFpbHVyZShlcnJvciA6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgZ29Ub0VkaXRCdWlsZGluZyhidWlsZGluZ0lkOiBzdHJpbmcpIHtcclxuICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9CVUlMRElORywgYnVpbGRpbmdJZCk7XHJcbiAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW05hdmlnYXRpb25Sb3V0ZXMuQVBQX1ZJRVdfQlVJTERJTkdfREVUQUlMUywgYnVpbGRpbmdJZF0pO1xyXG4gIH1cclxuXHJcbiAgY2xvbmVCdWlsZGluZyhidWlsZGluZ0lkOiBzdHJpbmcpIHtcclxuICAgIGxldCBwcm9qZWN0SWQ9U2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfSUQpO1xyXG4gICAgdGhpcy5idWlsZGluZ1NlcnZpY2UuZ2V0QnVpbGRpbmdEZXRhaWxzRm9yQ2xvbmUoIHByb2plY3RJZCwgYnVpbGRpbmdJZCkuc3Vic2NyaWJlKFxyXG4gICAgICBidWlsZGluZyA9PiB0aGlzLm9uR2V0QnVpbGRpbmdEZXRhaWxzRm9yQ2xvbmVTdWNjZXNzKGJ1aWxkaW5nKSxcclxuICAgICAgZXJyb3IgPT4gdGhpcy5vbkdldEJ1aWxkaW5nRGV0YWlsc0ZvckNsb25lRmFpbHVyZShlcnJvcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkdldEJ1aWxkaW5nRGV0YWlsc0ZvckNsb25lU3VjY2VzcyhidWlsZGluZzogYW55KSB7XHJcbiAgICB0aGlzLmNsb25lQnVpbGRpbmdNb2RlbCA9IGJ1aWxkaW5nLmRhdGE7XHJcbiAgICB0aGlzLmNsb25lZEJ1aWxkaW5nRGV0YWlscyA9IGJ1aWxkaW5nLmRhdGEuY29zdEhlYWRzO1xyXG4gIH1cclxuXHJcbiAgb25HZXRCdWlsZGluZ0RldGFpbHNGb3JDbG9uZUZhaWx1cmUoZXJyb3I6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgY2xvbmVCdWlsZGluZ0Jhc2ljRGV0YWlscygpIHtcclxuICAgIGlmICh0aGlzLmNsb25lQnVpbGRpbmdGb3JtLnZhbGlkKSB7XHJcbiAgICAgLy8gdGhpcy5jbG9uZUJ1aWxkaW5nTW9kZWwgPSB0aGlzLmNsb25lQnVpbGRpbmdGb3JtLnZhbHVlO1xyXG4gICAgICBsZXQgcHJvamVjdElkPVNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuICAgICAgdGhpcy5idWlsZGluZ1NlcnZpY2UuY3JlYXRlQnVpbGRpbmcoIHByb2plY3RJZCwgdGhpcy5jbG9uZUJ1aWxkaW5nTW9kZWwpXHJcbiAgICAgICAgLnN1YnNjcmliZShcclxuICAgICAgICAgIGJ1aWxkaW5nID0+IHRoaXMub25DcmVhdGVCdWlsZGluZ1N1Y2Nlc3MoYnVpbGRpbmcpLFxyXG4gICAgICAgICAgZXJyb3IgPT4gdGhpcy5vbkNyZWF0ZUJ1aWxkaW5nRmFpbHVyZShlcnJvcikpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25DcmVhdGVCdWlsZGluZ1N1Y2Nlc3MoYnVpbGRpbmc6IGFueSkge1xyXG4gICAgLy90aGlzLmNsb25lQnVpbGRpbmdJZCA9IGJ1aWxkaW5nLmRhdGEuX2lkO1xyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgbWVzc2FnZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfQ0xPTkVEX0JVSUxESU5HX0RFVEFJTFM7XHJcbiAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB0aGlzLm9uQ2hhbmdlQ29zdGluZ0J5VW5pdCh0aGlzLmRlZmF1bHRDb3N0aW5nQnlVbml0KTtcclxuICB9XHJcblxyXG4gIG9uQ3JlYXRlQnVpbGRpbmdGYWlsdXJlKGVycm9yOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICB9XHJcblxyXG4gIGNsb25lQnVpbGRpbmdDb3N0SGVhZHMoY2xvbmVDb3N0SGVhZDogQ29zdEhlYWQpIHtcclxuICAgIGxldCBwcm9qZWN0SWQ9U2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfSUQpO1xyXG4gICAgdGhpcy5idWlsZGluZ1NlcnZpY2UuY2xvbmVCdWlsZGluZ0Nvc3RIZWFkcyggcHJvamVjdElkLCB0aGlzLmNsb25lQnVpbGRpbmdJZCwgY2xvbmVDb3N0SGVhZCkuc3Vic2NyaWJlKFxyXG4gICAgICBwcm9qZWN0ID0+IHRoaXMub25DbG9uZUJ1aWxkaW5nQ29zdEhlYWRzU3VjY2Vzcyhwcm9qZWN0KSxcclxuICAgICAgZXJyb3IgPT4gdGhpcy5vbkNsb25lQnVpbGRpbmdDb3N0SGVhZHNGYWlsdXJlKGVycm9yKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIG9uQ2xvbmVCdWlsZGluZ0Nvc3RIZWFkc1N1Y2Nlc3MocHJvamVjdDogYW55KSB7XHJcbiAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgIG1lc3NhZ2UuY3VzdG9tX21lc3NhZ2UgPSBNZXNzYWdlcy5NU0dfU1VDQ0VTU19BRERfQlVJTERJTkdfUFJPSkVDVDtcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIHRoaXMub25DaGFuZ2VDb3N0aW5nQnlVbml0KHRoaXMuZGVmYXVsdENvc3RpbmdCeVVuaXQpO1xyXG4gIH1cclxuXHJcbiAgb25DbG9uZUJ1aWxkaW5nQ29zdEhlYWRzRmFpbHVyZShlcnJvcjogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgfVxyXG5cclxuICBjYWxjdWxhdGVHcmFuZFRvdGFsKCkge1xyXG4gICAgLy9Ub0RvIHdlIGhhdmUgdG8gcmVtb3ZlIHRoaXMgY29kZSBhZnRlclxyXG4gICAgdGhpcy5ncmFuZFRvdGFsT2ZCdWRnZXRlZENvc3QgPSAwO1xyXG4gICAgdGhpcy5ncmFuZFRvdGFsT2ZUb3RhbFJhdGUgPSAwO1xyXG4gICAgdGhpcy5ncmFuZFRvdGFsT2ZBcmVhID0gMDtcclxuXHJcbiAgICB0aGlzLmdyYW5kVG90YWxPZkVzdGltYXRlZENvc3QgPSAwO1xyXG4gICAgdGhpcy5ncmFuZFRvdGFsT2ZFc3RpbWF0ZWRSYXRlID0gMDtcclxuXHJcbiAgICAvL0NhbGN1bGF0ZSB0b3RhbCBvZiBhbGwgYnVpbGRpbmdcclxuICAgIGZvciAobGV0IGJ1aWxkaW5kSW5kZXggPSAwOyBidWlsZGluZEluZGV4IDwgdGhpcy5idWlsZGluZ3NSZXBvcnQubGVuZ3RoOyBidWlsZGluZEluZGV4KyspIHtcclxuXHJcbiAgICAgIHRoaXMuZ3JhbmRUb3RhbE9mQnVkZ2V0ZWRDb3N0ID0gdGhpcy5ncmFuZFRvdGFsT2ZCdWRnZXRlZENvc3QgKyB0aGlzLmJ1aWxkaW5nc1JlcG9ydFtidWlsZGluZEluZGV4XS50aHVtYlJ1bGUudG90YWxCdWRnZXRlZENvc3Q7XHJcblxyXG4gICAgICB0aGlzLmdyYW5kVG90YWxPZlRvdGFsUmF0ZSA9IHRoaXMuZ3JhbmRUb3RhbE9mVG90YWxSYXRlICsgdGhpcy5idWlsZGluZ3NSZXBvcnRbYnVpbGRpbmRJbmRleF0udGh1bWJSdWxlLnRvdGFsUmF0ZTtcclxuXHJcbiAgICAgIHRoaXMuZ3JhbmRUb3RhbE9mQXJlYSA9IHRoaXMuZ3JhbmRUb3RhbE9mQXJlYSArIHRoaXMuYnVpbGRpbmdzUmVwb3J0W2J1aWxkaW5kSW5kZXhdLmFyZWE7XHJcblxyXG4gICAgICB0aGlzLmdyYW5kVG90YWxPZkVzdGltYXRlZENvc3QgPSB0aGlzLmdyYW5kVG90YWxPZkVzdGltYXRlZENvc3QgK1xyXG4gICAgICAgdGhpcy5idWlsZGluZ3NSZXBvcnRbYnVpbGRpbmRJbmRleF0uZXN0aW1hdGUudG90YWxFc3RpbWF0ZWRDb3N0O1xyXG5cclxuICAgICAgdGhpcy5ncmFuZFRvdGFsT2ZFc3RpbWF0ZWRSYXRlID0gdGhpcy5ncmFuZFRvdGFsT2ZFc3RpbWF0ZWRSYXRlICtcclxuICAgICAgIHRoaXMuYnVpbGRpbmdzUmVwb3J0W2J1aWxkaW5kSW5kZXhdLmVzdGltYXRlLnRvdGFsUmF0ZTtcclxuICAgIH1cclxuXHJcbiAgICAvL0NhbGN1bGF0ZSB0b3RhbCB3aXRoIGFtZW5pdGllcyBkYXRhXHJcbiAgICB0aGlzLmdyYW5kVG90YWxPZkJ1ZGdldGVkQ29zdCA9IHRoaXMuZ3JhbmRUb3RhbE9mQnVkZ2V0ZWRDb3N0ICsgdGhpcy5hbWVuaXRpZXNSZXBvcnQudGh1bWJSdWxlLnRvdGFsQnVkZ2V0ZWRDb3N0O1xyXG5cclxuICAgIHRoaXMuZ3JhbmRUb3RhbE9mVG90YWxSYXRlID0gdGhpcy5ncmFuZFRvdGFsT2ZUb3RhbFJhdGUgKyB0aGlzLmFtZW5pdGllc1JlcG9ydC50aHVtYlJ1bGUudG90YWxSYXRlO1xyXG5cclxuICAgIHRoaXMuZ3JhbmRUb3RhbE9mRXN0aW1hdGVkQ29zdCA9IHRoaXMuZ3JhbmRUb3RhbE9mRXN0aW1hdGVkQ29zdCArIHRoaXMuYW1lbml0aWVzUmVwb3J0LmVzdGltYXRlLnRvdGFsRXN0aW1hdGVkQ29zdDtcclxuXHJcbiAgICB0aGlzLmdyYW5kVG90YWxPZkVzdGltYXRlZFJhdGUgPSB0aGlzLmdyYW5kVG90YWxPZkVzdGltYXRlZFJhdGUgKyB0aGlzLmFtZW5pdGllc1JlcG9ydC5lc3RpbWF0ZS50b3RhbFJhdGU7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVTaG93R3JhbmRUb3RhbFBhbmVsQm9keSgpIHtcclxuICAgIHRoaXMuc2hvd0dyYW5kVG90YWxQYW5lbEJvZHk9IXRoaXMuc2hvd0dyYW5kVG90YWxQYW5lbEJvZHk7XHJcbiAgfVxyXG5cclxuICBkZWxldGVFbGVtZW50KGVsZW1lbnRUeXBlIDogc3RyaW5nKSB7XHJcbiAgICBpZihlbGVtZW50VHlwZSA9PT0gUHJvamVjdEVsZW1lbnRzLkNPU1RfSEVBRCkge1xyXG4gICAgICB0aGlzLmluQWN0aXZlQ29zdEhlYWQoKTtcclxuICAgIH1cclxuICAgIGlmKGVsZW1lbnRUeXBlID09PSBQcm9qZWN0RWxlbWVudHMuQlVJTERJTkcpIHtcclxuICAgICAgdGhpcy5kZWxldGVCdWlsZGluZygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0Q29zdFN1bW1hcnlSZXBvcnQoKSB7XHJcbiAgICB0aGlzLm9uQ2hhbmdlQ29zdGluZ0J5VW5pdCh0aGlzLmRlZmF1bHRDb3N0aW5nQnlVbml0KTtcclxuICB9XHJcblxyXG4gIGdldE1lbnVzKCkge1xyXG4gICAgcmV0dXJuIE1lbnVzO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGFiZWwoKSB7XHJcbiAgICByZXR1cm4gTGFiZWw7XHJcbiAgfVxyXG5cclxuICBnZXRCdXR0b24oKSB7XHJcbiAgICByZXR1cm4gQnV0dG9uO1xyXG4gIH1cclxuXHJcbiAgZ2V0SGVhZGluZ3MoKSB7XHJcbiAgICByZXR1cm4gSGVhZGluZ3M7XHJcbiAgfVxyXG5cclxuICBnZXRQcm9qZWN0RWxlbWVudHMoKSB7XHJcbiAgICByZXR1cm4gUHJvamVjdEVsZW1lbnRzO1xyXG4gIH1cclxuXHJcbiAgZG93bmxvYWRUb1BkZigpIHtcclxuICAgIGxldCBkb2MgPSBuZXcganNQREYoKTtcclxuICAgIGxldCBzcGVjaWFsRWxlbWVudEhhbmRsZXJzID0ge1xyXG4gICAgICAnI2VkaXRvcic6IGZ1bmN0aW9uIChlbGVtZW50IDogYW55LCByZW5kZXJlciA6IGFueSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxldCBjb250ZW50ID0gdGhpcy5jb250ZW50Lm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICBkb2MuZnJvbUhUTUwoY29udGVudC5pbm5lckhUTUwsIDUsIDUsIHtcclxuICAgICAgJ3dpZHRoJzogMTkwMCxcclxuICAgICAgJ2VsZW1lbnRIYW5kbGVycyc6IHNwZWNpYWxFbGVtZW50SGFuZGxlcnNcclxuICAgIH0pO1xyXG5cclxuICAgIGRvYy5zYXZlKCd0ZXN0LnBkZicpO1xyXG4gIH1cclxuXHJcbn1cclxuIl19
