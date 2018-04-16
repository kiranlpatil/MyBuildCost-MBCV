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
            this.grandTotalOfBudgetedCost = this.grandTotalOfBudgetedCost +
                parseFloat((this.buildingsReport[buildindIndex].thumbRule.totalBudgetedCost).toFixed(constants_1.ValueConstant.NUMBER_OF_FRACTION_DIGIT));
            this.grandTotalOfTotalRate = this.grandTotalOfTotalRate +
                parseFloat((this.buildingsReport[buildindIndex].thumbRule.totalRate).toFixed(constants_1.ValueConstant.NUMBER_OF_FRACTION_DIGIT));
            this.grandTotalOfArea = (this.grandTotalOfArea + parseFloat((this.buildingsReport[buildindIndex].area).toFixed(constants_1.ValueConstant.NUMBER_OF_FRACTION_DIGIT)));
            this.grandTotalOfEstimatedCost = this.grandTotalOfEstimatedCost +
                parseFloat((this.buildingsReport[buildindIndex].estimate.totalEstimatedCost).toFixed(constants_1.ValueConstant.NUMBER_OF_FRACTION_DIGIT));
            this.grandTotalOfEstimatedRate = this.grandTotalOfEstimatedRate +
                parseFloat((this.buildingsReport[buildindIndex].estimate.totalRate).toFixed(constants_1.ValueConstant.NUMBER_OF_FRACTION_DIGIT));
        }
        this.grandTotalOfBudgetedCost = this.grandTotalOfBudgetedCost +
            parseFloat((this.amenitiesReport.thumbRule.totalBudgetedCost).toFixed(constants_1.ValueConstant.NUMBER_OF_FRACTION_DIGIT));
        this.grandTotalOfTotalRate = this.grandTotalOfTotalRate +
            parseFloat((this.amenitiesReport.thumbRule.totalRate).toFixed(constants_1.ValueConstant.NUMBER_OF_FRACTION_DIGIT));
        this.grandTotalOfEstimatedCost = this.grandTotalOfEstimatedCost +
            parseFloat((this.amenitiesReport.estimate.totalEstimatedCost).toFixed(constants_1.ValueConstant.NUMBER_OF_FRACTION_DIGIT));
        this.grandTotalOfEstimatedRate = this.grandTotalOfEstimatedRate +
            parseFloat((this.amenitiesReport.estimate.totalRate).toFixed(constants_1.ValueConstant.NUMBER_OF_FRACTION_DIGIT));
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1zdW1tYXJ5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUF5RTtBQUN6RSwwQ0FBMEQ7QUFDMUQsMERBR3NDO0FBQ3RDLGtEQUFxSDtBQUNySCwrREFBNEQ7QUFDNUQsaURBQWdEO0FBQ2hELHdDQUF3RDtBQUN4RCw4RkFBNEY7QUFDNUYsaUVBQStEO0FBSS9ELDBEQUE2RDtBQUM3RCw2RUFBMEU7QUFDMUUsNkJBQStCO0FBUy9CO0lBOENFLDhCQUFvQixrQkFBdUMsRUFBVSxjQUErQixFQUNoRixXQUF3QixFQUFVLE9BQWdCLEVBQVUsY0FBK0IsRUFDM0YsZUFBZ0MsRUFBVSxhQUE2QjtRQUZ2RSx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQXFCO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQWlCO1FBQ2hGLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFpQjtRQUMzRixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBZ0I7UUEzQjNGLHFCQUFnQixHQUFTLEtBQUssQ0FBQztRQUMvQiw0QkFBdUIsR0FBUyxJQUFJLENBQUM7UUFDckMsaUJBQVksR0FBUSxDQUFDLENBQUM7UUFJdEIsdUJBQWtCLEdBQWEsSUFBSSxtQkFBUSxFQUFFLENBQUM7UUFHdkMsV0FBTSxHQUFVO1lBQ3JCLEVBQUUsVUFBVSxFQUFFLDJCQUFlLENBQUMsV0FBVyxFQUFDO1lBQzFDLEVBQUUsVUFBVSxFQUFFLDJCQUFlLENBQUMsV0FBVyxFQUFDO1NBQzNDLENBQUM7UUFFSyxZQUFPLEdBQVU7WUFDdEIsRUFBRSxXQUFXLEVBQUUsMkJBQWUsQ0FBQyxTQUFTLEVBQUM7WUFDekMsRUFBRSxXQUFXLEVBQUUsMkJBQWUs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QUMxQyxTQUFTLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQztTQUMxQyxDQUFDO3lDQWdEeUMseUNBQWtCLEVBQTJCLHVCQUFjO1lBQ25FLG1CQUFXLEVBQW9CLGVBQU0sRUFBMkIsc0JBQWM7WUFDMUUsa0NBQWUsRUFBMEIsK0JBQWE7T0FoRGhGLG9CQUFvQixDQXVaaEM7SUFBRCwyQkFBQztDQXZaRCxBQXVaQyxJQUFBO0FBdlpZLG9EQUFvQiIsImZpbGUiOiJhcHAvYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9jb3N0LXN1bW1hcnktcmVwb3J0L2Nvc3Qtc3VtbWFyeS5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJvdXRlciAsIEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHtcclxuICBOYXZpZ2F0aW9uUm91dGVzLCBQcm9qZWN0RWxlbWVudHMsIEJ1dHRvbiwgTWVudXMsIEhlYWRpbmdzLCBMYWJlbCxcclxuICBWYWx1ZUNvbnN0YW50XHJcbn0gZnJvbSAnLi4vLi4vLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IFNlc3Npb25TdG9yYWdlLCBTZXNzaW9uU3RvcmFnZVNlcnZpY2UsICBNZXNzYWdlLCBNZXNzYWdlcywgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zaGFyZWQvaW5kZXgnO1xyXG5pbXBvcnQgeyBDb3N0U3VtbWFyeVNlcnZpY2UgfSBmcm9tICcuL2Nvc3Qtc3VtbWFyeS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQnVpbGRpbmcgfSBmcm9tICcuLi8uLi9tb2RlbC9idWlsZGluZyc7XHJcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IFZhbGlkYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2hhcmVkL2N1c3RvbXZhbGlkYXRpb25zL3ZhbGlkYXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7IEJ1aWxkaW5nU2VydmljZSB9IGZyb20gJy4uL2J1aWxkaW5nL2J1aWxkaW5nLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb3N0SGVhZCB9IGZyb20gJy4uLy4uL21vZGVsL2Nvc3RoZWFkJztcclxuaW1wb3J0IHsgRXN0aW1hdGVSZXBvcnQgfSBmcm9tICcuLi8uLi9tb2RlbC9lc3RpbWF0ZS1yZXBvcnQnO1xyXG5pbXBvcnQgeyBCdWlsZGluZ1JlcG9ydCB9IGZyb20gJy4uLy4uL21vZGVsL2J1aWxkaW5nLXJlcG9ydCc7XHJcbmltcG9ydCBQcm9qZWN0UmVwb3J0ID0gcmVxdWlyZSgnLi4vLi4vbW9kZWwvcHJvamVjdC1yZXBvcnQnKTtcclxuaW1wb3J0IHsgTG9hZGVyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NoYXJlZC9sb2FkZXIvbG9hZGVycy5zZXJ2aWNlJztcclxuaW1wb3J0ICogYXMganNQREYgZnJvbSAnanNwZGYnO1xyXG4vKi8vLyA8cmVmZXJlbmNlIHBhdGg9Jy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Rvb2xzL21hbnVhbF90eXBpbmdzL3Byb2plY3QvanNwZGYuZC50cycvPiovXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICdiaS1jb3N0LXN1bW1hcnktcmVwb3J0JyxcclxuICB0ZW1wbGF0ZVVybDogJ2Nvc3Qtc3VtbWFyeS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJ2Nvc3Qtc3VtbWFyeS5jb21wb25lbnQuY3NzJ10sXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgQ29zdFN1bW1hcnlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICBAVmlld0NoaWxkKCdjb250ZW50JykgY29udGVudDogRWxlbWVudFJlZjtcclxuICBidWlsZGluZ3NSZXBvcnQ6IEFycmF5IDxCdWlsZGluZ1JlcG9ydD47XHJcbiAgYW1lbml0aWVzUmVwb3J0OiBCdWlsZGluZ1JlcG9ydDtcclxuICBwcm9qZWN0UmVwb3J0OiBQcm9qZWN0UmVwb3J0O1xyXG4gIHByb2plY3RJZDogc3RyaW5nO1xyXG4gIGJ1aWxkaW5nSWQ6IHN0cmluZztcclxuICBjbG9uZUJ1aWxkaW5nSWQ6IHN0cmluZztcclxuICBjb3N0SGVhZElkOiBudW1iZXI7XHJcblxyXG4gIGdyYW5kVG90YWxPZkJ1ZGdldGVkQ29zdDogbnVtYmVyO1xyXG4gIGdyYW5kVG90YWxPZlRvdGFsUmF0ZTogbnVtYmVyO1xyXG4gIGdyYW5kVG90YWxPZkFyZWE6IG51bWJlcjtcclxuICBncmFuZFRvdGFsT2ZFc3RpbWF0ZWRDb3N0IDogbnVtYmVyO1xyXG4gIGdyYW5kVG90YWxPZkVzdGltYXRlZFJhdGUgOiBudW1iZXI7XHJcblxyXG4gIGJ1aWxkaW5nTmFtZSA6IHN0cmluZztcclxuICBjb3N0SGVhZDogc3RyaW5nO1xyXG5cclxuICBlc3RpbWF0ZWRJdGVtOiBFc3RpbWF0ZVJlcG9ydDtcclxuICBzaG93Q29zdEhlYWRMaXN0OmJvb2xlYW49ZmFsc2U7XHJcbiAgc2hvd0dyYW5kVG90YWxQYW5lbEJvZHk6Ym9vbGVhbj10cnVlO1xyXG4gIGNvbXBhcmVJbmRleDpudW1iZXI9MDtcclxuXHJcbiBwdWJsaWMgaW5BY3RpdmVDb3N0SGVhZEFycmF5OiBBcnJheTxDb3N0SGVhZD47XHJcbiAgY2xvbmVCdWlsZGluZ0Zvcm06IEZvcm1Hcm91cDtcclxuICBjbG9uZUJ1aWxkaW5nTW9kZWw6IEJ1aWxkaW5nID0gbmV3IEJ1aWxkaW5nKCk7XHJcbiAgY2xvbmVkQnVpbGRpbmdEZXRhaWxzOiBBcnJheTxDb3N0SGVhZD47XHJcblxyXG4gIHB1YmxpYyBjb3N0SW46IGFueVtdID0gW1xyXG4gICAgeyAnY29zdEluSWQnOiBQcm9qZWN0RWxlbWVudHMuUlNfUEVSX1NRRlR9LFxyXG4gICAgeyAnY29zdEluSWQnOiBQcm9qZWN0RWxlbWVudHMuUlNfUEVSX1NRTVR9XHJcbiAgXTtcclxuXHJcbiAgcHVibGljIGNvc3RQZXI6IGFueVtdID0gW1xyXG4gICAgeyAnY29zdFBlcklkJzogUHJvamVjdEVsZW1lbnRzLlNMQUJfQVJFQX0sXHJcbiAgICB7ICdjb3N0UGVySWQnOiBQcm9qZWN0RWxlbWVudHMuU0FMRUFCTEVfQVJFQX0sXHJcbiAgICB7ICdjb3N0UGVySWQnOiBQcm9qZWN0RWxlbWVudHMuQ0FSUEVUX0FSRUF9LFxyXG4gIF07XHJcblxyXG4gIGRlZmF1bHRDb3N0aW5nQnlVbml0OnN0cmluZyA9IFByb2plY3RFbGVtZW50cy5SU19QRVJfU1FGVDtcclxuICBkZWZhdWx0Q29zdGluZ0J5QXJlYTpzdHJpbmcgPSBQcm9qZWN0RWxlbWVudHMuU0xBQl9BUkVBO1xyXG4gIGRlbGV0ZUNvbmZpcm1hdGlvbkNvc3RIZWFkID0gUHJvamVjdEVsZW1lbnRzLkNPU1RfSEVBRDtcclxuICBkZWxldGVDb25maXJtYXRpb25CdWlsZGluZyA9IFByb2plY3RFbGVtZW50cy5CVUlMRElORztcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb3N0U3VtbWFyeVNlcnZpY2UgOiBDb3N0U3VtbWFyeVNlcnZpY2UsIHByaXZhdGUgYWN0aXZhdGVkUm91dGUgOiBBY3RpdmF0ZWRSb3V0ZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIGZvcm1CdWlsZGVyOiBGb3JtQnVpbGRlciwgcHJpdmF0ZSBfcm91dGVyIDogUm91dGVyLCBwcml2YXRlIG1lc3NhZ2VTZXJ2aWNlIDogTWVzc2FnZVNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBidWlsZGluZ1NlcnZpY2U6IEJ1aWxkaW5nU2VydmljZSwgcHJpdmF0ZSBsb2FkZXJTZXJ2aWNlIDogTG9hZGVyU2VydmljZSkge1xyXG5cclxuICAgIHRoaXMuY2xvbmVCdWlsZGluZ0Zvcm0gPSB0aGlzLmZvcm1CdWlsZGVyLmdyb3VwKHtcclxuICAgICAgbmFtZSA6IFsnJywgVmFsaWRhdGlvblNlcnZpY2UucmVxdWlyZWRCdWlsZGluZ05hbWVdLFxyXG4gICAgICB0b3RhbFNsYWJBcmVhIDpbJycsIFZhbGlkYXRpb25TZXJ2aWNlLnJlcXVpcmVkU2xhYkFyZWFdLFxyXG4gICAgICB0b3RhbENhcnBldEFyZWFPZlVuaXQgOlsnJywgVmFsaWRhdGlvblNlcnZpY2UucmVxdWlyZWRDYXJwZXRBcmVhXSxcclxuICAgICAgdG90YWxTYWxlYWJsZUFyZWFPZlVuaXQgOlsnJywgVmFsaWRhdGlvblNlcnZpY2UucmVxdWlyZWRTYWxlYmxlQXJlYV0sXHJcbiAgICAgIHBsaW50aEFyZWEgOlsnJywgVmFsaWRhdGlvblNlcnZpY2UucmVxdWlyZWRQbGludGhBcmVhXSxcclxuICAgICAgdG90YWxOdW1PZkZsb29ycyA6WycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZFRvdGFsTnVtT2ZGbG9vcnNdLFxyXG4gICAgICBudW1PZlBhcmtpbmdGbG9vcnMgOlsnJywgVmFsaWRhdGlvblNlcnZpY2UucmVxdWlyZWROdW1PZlBhcmtpbmdGbG9vcnNdLFxyXG4gICAgICBjYXJwZXRBcmVhT2ZQYXJraW5nIDpbJycsIFZhbGlkYXRpb25TZXJ2aWNlLnJlcXVpcmVkQ2FycGV0QXJlYU9mUGFya2luZ10sXHJcbiAgICAgIG51bU9mT25lQkhLIDogWycnXSxcclxuICAgICAgbnVtT2ZUd29CSEsgOlsnJ10sXHJcbiAgICAgIG51bU9mVGhyZWVCSEsgOlsnJ10sXHJcbiAgICAgIG51bU9mRm91ckJISyA6WycnXSxcclxuICAgICAgbnVtT2ZGaXZlQkhLIDpbJyddLFxyXG4gICAgICBudW1PZkxpZnRzIDpbJyddXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1ZJRVcsJ2Nvc3RTdW1tYXJ5Jyk7XHJcbiAgICB0aGlzLmFjdGl2YXRlZFJvdXRlLnBhcmFtcy5zdWJzY3JpYmUocGFyYW1zID0+IHtcclxuICAgICAgdGhpcy5wcm9qZWN0SWQgPSBwYXJhbXNbJ3Byb2plY3RJZCddO1xyXG4gICAgICBpZih0aGlzLnByb2plY3RJZCkge1xyXG4gICAgICAgIHRoaXMub25DaGFuZ2VDb3N0aW5nQnlVbml0KHRoaXMuZGVmYXVsdENvc3RpbmdCeVVuaXQpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNldEJ1aWxkaW5nSWQoIGk6bnVtYmVyLCBidWlsZGluZ0lkOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuY29tcGFyZUluZGV4ID0gaTtcclxuICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9CVUlMRElORywgYnVpbGRpbmdJZCk7XHJcbiAgfVxyXG5cclxuICBnZXRBbGxJbkFjdGl2ZUNvc3RIZWFkcyhidWlsZGluZ0lkOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuYnVpbGRpbmdJZD1idWlsZGluZ0lkO1xyXG4gICAgdGhpcy5jb3N0U3VtbWFyeVNlcnZpY2UuZ2V0QWxsSW5BY3RpdmVDb3N0SGVhZHMoIHRoaXMucHJvamVjdElkLCB0aGlzLmJ1aWxkaW5nSWQpLnN1YnNjcmliZShcclxuICAgICAgaW5BY3RpdmVDb3N0SGVhZHMgPT4gdGhpcy5vbkdldEFsbEluQWN0aXZlQ29zdEhlYWRzU3VjY2VzcyhpbkFjdGl2ZUNvc3RIZWFkcyksXHJcbiAgICAgIGVycm9yID0+IHRoaXMub25HZXRBbGxJbkFjdGl2ZUNvc3RIZWFkc0ZhaWx1cmUoZXJyb3IpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgb25HZXRBbGxJbkFjdGl2ZUNvc3RIZWFkc1N1Y2Nlc3MoaW5BY3RpdmVDb3N0SGVhZHMgOiBhbnkpIHtcclxuICAgICAgdGhpcy5pbkFjdGl2ZUNvc3RIZWFkQXJyYXk9aW5BY3RpdmVDb3N0SGVhZHMuZGF0YTtcclxuICAgICAgdGhpcy5zaG93Q29zdEhlYWRMaXN0PXRydWU7XHJcbiAgfVxyXG5cclxuICBvbkdldEFsbEluQWN0aXZlQ29zdEhlYWRzRmFpbHVyZShlcnJvciA6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgZ29Ub0Nvc3RIZWFkVmlldyggYnVpbGRpbmdJZCA6IHN0cmluZywgYnVpbGRpbmdOYW1lOnN0cmluZywgZXN0aW1hdGVkSXRlbSA6YW55KSB7XHJcblxyXG4gICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX0JVSUxESU5HLCBidWlsZGluZ0lkKTtcclxuICAgIHRoaXMuYnVpbGRpbmdJZCA9ICBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfQlVJTERJTkcpO1xyXG4gICAgdGhpcy5wcm9qZWN0SWQgPSBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfUFJPSkVDVF9JRCk7XHJcblxyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9QUk9KRUNULCB0aGlzLnByb2plY3RJZCwgTmF2aWdhdGlvblJvdXRlcy5BUFBfQlVJTERJTkcsXHJcbiAgICAgIGJ1aWxkaW5nTmFtZSwgTmF2aWdhdGlvblJvdXRlcy5BUFBfQ09TVF9IRUFELCBlc3RpbWF0ZWRJdGVtLm5hbWUsICBlc3RpbWF0ZWRJdGVtLnJhdGVBbmFseXNpc0lkLCBOYXZpZ2F0aW9uUm91dGVzLkFQUF9DQVRFR09SWV0pO1xyXG4gIH1cclxuXHJcbiAgZ29Ub0NvbW1vbkFtZW5pdGllcygpIHtcclxuICAgIHRoaXMucHJvamVjdElkID0gU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfSUQpO1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9QUk9KRUNULHRoaXMucHJvamVjdElkLE5hdmlnYXRpb25Sb3V0ZXMuQVBQX0NPTU1PTl9BTUVOSVRJRVNdKTtcclxuICB9XHJcblxyXG4gIG9uQ2hhbmdlQ29zdGluZ0J5VW5pdChjb3N0aW5nQnlVbml0OmFueSkge1xyXG4gICAgdGhpcy5kZWZhdWx0Q29zdGluZ0J5VW5pdD1jb3N0aW5nQnlVbml0O1xyXG4gICAgdGhpcy5jb3N0U3VtbWFyeVNlcnZpY2UuZ2V0Q29zdFN1bW1hcnlSZXBvcnQoIHRoaXMucHJvamVjdElkLCB0aGlzLmRlZmF1bHRDb3N0aW5nQnlVbml0LCB0aGlzLmRlZmF1bHRDb3N0aW5nQnlBcmVhKS5zdWJzY3JpYmUoXHJcbiAgICAgIHByb2plY3RDb3N0SW4gPT4gdGhpcy5vbkdldENvc3RTdW1tYXJ5UmVwb3J0U3VjY2Vzcyhwcm9qZWN0Q29zdEluKSxcclxuICAgICAgZXJyb3IgPT4gdGhpcy5vbkdldENvc3RTdW1tYXJ5UmVwb3J0RmFpbHVyZShlcnJvcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkdldENvc3RTdW1tYXJ5UmVwb3J0U3VjY2Vzcyhwcm9qZWN0cyA6IGFueSkge1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3J0ID0gbmV3IFByb2plY3RSZXBvcnQoIHByb2plY3RzLmRhdGEuYnVpbGRpbmdzLCBwcm9qZWN0cy5kYXRhLmNvbW1vbkFtZW5pdGllc1swXSkgO1xyXG4gICAgdGhpcy5idWlsZGluZ3NSZXBvcnQgPSB0aGlzLnByb2plY3RSZXBvcnQuYnVpbGRpbmdzO1xyXG4gICAgdGhpcy5hbWVuaXRpZXNSZXBvcnQgPSB0aGlzLnByb2plY3RSZXBvcnQuY29tbW9uQW1lbml0aWVzO1xyXG4gICAgdGhpcy5jYWxjdWxhdGVHcmFuZFRvdGFsKCk7XHJcbiAgfVxyXG5cclxuICBvbkdldENvc3RTdW1tYXJ5UmVwb3J0RmFpbHVyZShlcnJvciA6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coJ29uR2V0Q29zdEluRmFpbCgpJytlcnJvcik7XHJcbiAgfVxyXG5cclxuICAvL1RPRE8gOiBDaGVjayBpZiBjYW4gbWVyZ2VcclxuICBvbkNoYW5nZUNvc3RpbmdCeUFyZWEoY29zdGluZ0J5QXJlYTphbnkpIHtcclxuICAgIHRoaXMuZGVmYXVsdENvc3RpbmdCeUFyZWE9Y29zdGluZ0J5QXJlYTtcclxuICAgIHRoaXMuY29zdFN1bW1hcnlTZXJ2aWNlLmdldENvc3RTdW1tYXJ5UmVwb3J0KCB0aGlzLnByb2plY3RJZCwgdGhpcy5kZWZhdWx0Q29zdGluZ0J5VW5pdCwgdGhpcy5kZWZhdWx0Q29zdGluZ0J5QXJlYSkuc3Vic2NyaWJlKFxyXG4gICAgICBwcm9qZWN0Q29zdFBlciA9PiB0aGlzLm9uR2V0Q29zdFN1bW1hcnlSZXBvcnRTdWNjZXNzKHByb2plY3RDb3N0UGVyKSxcclxuICAgICAgZXJyb3IgPT4gdGhpcy5vbkdldENvc3RTdW1tYXJ5UmVwb3J0RmFpbHVyZShlcnJvcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBzZXRJZHNUb0luQWN0aXZlQ29zdEhlYWQoYnVpbGRpbmdJZDogc3RyaW5nLCBjb3N0SGVhZElkOiBudW1iZXIpIHtcclxuICAgIHRoaXMuYnVpbGRpbmdJZCA9IGJ1aWxkaW5nSWQ7XHJcbiAgICB0aGlzLmNvc3RIZWFkSWQgPSBjb3N0SGVhZElkO1xyXG4gIH1cclxuXHJcbiAgaW5BY3RpdmVDb3N0SGVhZCgpIHtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdGFydCgpO1xyXG4gICAgbGV0IHByb2plY3RJZCA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuICAgIHRoaXMuY29zdFN1bW1hcnlTZXJ2aWNlLmluQWN0aXZlQ29zdEhlYWQoIHByb2plY3RJZCwgdGhpcy5idWlsZGluZ0lkLCB0aGlzLmNvc3RIZWFkSWQpLnN1YnNjcmliZShcclxuICAgICAgICBjb3N0SGVhZERldGFpbCA9PiB0aGlzLm9uSW5BY3RpdmVDb3N0SGVhZFN1Y2Nlc3MoY29zdEhlYWREZXRhaWwpLFxyXG4gICAgICAgIGVycm9yID0+IHRoaXMub25JbkFjdGl2ZUNvc3RIZWFkRmFpbHVyZShlcnJvcilcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgb25JbkFjdGl2ZUNvc3RIZWFkU3VjY2Vzcyhjb3N0SGVhZERldGFpbHM6IGFueSkge1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICAgICBpZiAoIGNvc3RIZWFkRGV0YWlscyAhPT0gbnVsbCkge1xyXG4gICAgICB0aGlzLnNob3dDb3N0SGVhZExpc3QgPSBmYWxzZTtcclxuICAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0RFTEVURV9DT1NUSEVBRDtcclxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5vbkNoYW5nZUNvc3RpbmdCeVVuaXQodGhpcy5kZWZhdWx0Q29zdGluZ0J5VW5pdCk7XHJcbiAgfVxyXG5cclxuICBvbkluQWN0aXZlQ29zdEhlYWRGYWlsdXJlKGVycm9yOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdG9wKCk7XHJcbiAgfVxyXG5cclxuICBvbkNoYW5nZUFjdGl2ZVNlbGVjdGVkQ29zdEhlYWQoc2VsZWN0ZWRJbkFjdGl2ZUNvc3RIZWFkSWQ6bnVtYmVyKSB7XHJcbiAgICB0aGlzLnNob3dDb3N0SGVhZExpc3Q9ZmFsc2U7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RhcnQoKTtcclxuICAgIHRoaXMuY29zdFN1bW1hcnlTZXJ2aWNlLmFjdGl2ZUNvc3RIZWFkKCB0aGlzLnByb2plY3RJZCwgdGhpcy5idWlsZGluZ0lkLCBzZWxlY3RlZEluQWN0aXZlQ29zdEhlYWRJZCkuc3Vic2NyaWJlKFxyXG4gICAgICBpbkFjdGl2ZUNvc3RIZWFkcyA9PiB0aGlzLm9uQWN0aXZlQ29zdEhlYWRTdWNjZXNzKGluQWN0aXZlQ29zdEhlYWRzKSxcclxuICAgICAgZXJyb3IgPT4gdGhpcy5vbkFjdGl2ZUNvc3RIZWFkRmFpbHVyZShlcnJvcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkFjdGl2ZUNvc3RIZWFkU3VjY2VzcyhpbkFjdGl2ZUNvc3RIZWFkcyA6IGFueSkge1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0FERF9DT1NUSEVBRDtcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIHRoaXMub25DaGFuZ2VDb3N0aW5nQnlVbml0KHRoaXMuZGVmYXVsdENvc3RpbmdCeVVuaXQpO1xyXG4gIH1cclxuXHJcbiAgb25BY3RpdmVDb3N0SGVhZEZhaWx1cmUoZXJyb3IgOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKCdvbkFjdGl2ZUNvc3RIZWFkRmFpbHVyZSgpJytlcnJvcik7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgY2hhbmdlQnVkZ2V0ZWRDb3N0QW1vdW50T2ZCdWlsZGluZ0Nvc3RIZWFkKGJ1aWxkaW5nSWQ6IHN0cmluZywgY29zdEhlYWQ6IHN0cmluZywgYW1vdW50OiBudW1iZXIpIHtcclxuICAgIGlmIChhbW91bnQgIT09IG51bGwpIHtcclxuICAgICAgbGV0IHByb2plY3RJZD1TZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfUFJPSkVDVF9JRCk7XHJcbiAgICAgIHRoaXMuY29zdFN1bW1hcnlTZXJ2aWNlLmNoYW5nZUJ1ZGdldGVkQ29zdEFtb3VudE9mQnVpbGRpbmdDb3N0SGVhZCggcHJvamVjdElkLCBidWlsZGluZ0lkLCBjb3N0SGVhZCwgYW1vdW50KS5zdWJzY3JpYmUoXHJcbiAgICAgICAgYnVpbGRpbmdEZXRhaWxzID0+IHRoaXMub25VcGRhdGVSYXRlT2ZUaHVtYlJ1bGVTdWNjZXNzKGJ1aWxkaW5nRGV0YWlscyksXHJcbiAgICAgICAgZXJyb3IgPT4gdGhpcy5vblVwZGF0ZVJhdGVPZlRodW1iUnVsZUZhaWx1cmUoZXJyb3IpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvblVwZGF0ZVJhdGVPZlRodW1iUnVsZVN1Y2Nlc3MoYnVpbGRpbmdEZXRhaWxzIDogYW55KSB7XHJcbiAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgIG1lc3NhZ2UuY3VzdG9tX21lc3NhZ2UgPSBNZXNzYWdlcy5NU0dfU1VDQ0VTU19VUERBVEVfVEhVTUJSVUxFX1JBVEVfQ09TVEhFQUQ7XHJcbiAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB0aGlzLm9uQ2hhbmdlQ29zdGluZ0J5VW5pdCh0aGlzLmRlZmF1bHRDb3N0aW5nQnlVbml0KTtcclxuICB9XHJcblxyXG4gIG9uVXBkYXRlUmF0ZU9mVGh1bWJSdWxlRmFpbHVyZShlcnJvciA6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coJ29uQWRkQ29zdGhlYWRTdWNjZXNzIDogJytlcnJvcik7XHJcbiAgfVxyXG5cclxuICBzZXRJZEZvckRlbGV0ZUJ1aWxkaW5nKGJ1aWxkaW5nSWQgOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuYnVpbGRpbmdJZCA9IGJ1aWxkaW5nSWQ7XHJcbiAgfVxyXG5cclxuICBkZWxldGVCdWlsZGluZygpIHtcclxuICAgIGxldCBwcm9qZWN0SWQ9U2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfSUQpO1xyXG4gICAgdGhpcy5idWlsZGluZ1NlcnZpY2UuZGVsZXRlQnVpbGRpbmcoIHByb2plY3RJZCwgdGhpcy5idWlsZGluZ0lkKS5zdWJzY3JpYmUoXHJcbiAgICAgIHByb2plY3QgPT4gdGhpcy5vbkRlbGV0ZUJ1aWxkaW5nU3VjY2Vzcyhwcm9qZWN0KSxcclxuICAgICAgZXJyb3IgPT4gdGhpcy5vbkRlbGV0ZUJ1aWxkaW5nRmFpbHVyZShlcnJvcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkRlbGV0ZUJ1aWxkaW5nU3VjY2VzcyhyZXN1bHQgOiBhbnkpIHtcclxuICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcclxuICAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0RFTEVURV9CVUlMRElORztcclxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgICB0aGlzLm9uQ2hhbmdlQ29zdGluZ0J5VW5pdCh0aGlzLmRlZmF1bHRDb3N0aW5nQnlVbml0KTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgb25EZWxldGVCdWlsZGluZ0ZhaWx1cmUoZXJyb3IgOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICB9XHJcblxyXG4gIGdvVG9FZGl0QnVpbGRpbmcoYnVpbGRpbmdJZDogc3RyaW5nKSB7XHJcbiAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfQlVJTERJTkcsIGJ1aWxkaW5nSWQpO1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9WSUVXX0JVSUxESU5HX0RFVEFJTFMsIGJ1aWxkaW5nSWRdKTtcclxuICB9XHJcblxyXG4gIGNsb25lQnVpbGRpbmcoYnVpbGRpbmdJZDogc3RyaW5nKSB7XHJcbiAgICBsZXQgcHJvamVjdElkPVNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuICAgIHRoaXMuYnVpbGRpbmdTZXJ2aWNlLmdldEJ1aWxkaW5nRGV0YWlsc0ZvckNsb25lKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQpLnN1YnNjcmliZShcclxuICAgICAgYnVpbGRpbmcgPT4gdGhpcy5vbkdldEJ1aWxkaW5nRGV0YWlsc0ZvckNsb25lU3VjY2VzcyhidWlsZGluZyksXHJcbiAgICAgIGVycm9yID0+IHRoaXMub25HZXRCdWlsZGluZ0RldGFpbHNGb3JDbG9uZUZhaWx1cmUoZXJyb3IpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgb25HZXRCdWlsZGluZ0RldGFpbHNGb3JDbG9uZVN1Y2Nlc3MoYnVpbGRpbmc6IGFueSkge1xyXG4gICAgdGhpcy5jbG9uZUJ1aWxkaW5nTW9kZWwgPSBidWlsZGluZy5kYXRhO1xyXG4gICAgdGhpcy5jbG9uZWRCdWlsZGluZ0RldGFpbHMgPSBidWlsZGluZy5kYXRhLmNvc3RIZWFkcztcclxuICB9XHJcblxyXG4gIG9uR2V0QnVpbGRpbmdEZXRhaWxzRm9yQ2xvbmVGYWlsdXJlKGVycm9yOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICB9XHJcblxyXG4gIGNsb25lQnVpbGRpbmdCYXNpY0RldGFpbHMoKSB7XHJcbiAgICBpZiAodGhpcy5jbG9uZUJ1aWxkaW5nRm9ybS52YWxpZCkge1xyXG4gICAgIC8vIHRoaXMuY2xvbmVCdWlsZGluZ01vZGVsID0gdGhpcy5jbG9uZUJ1aWxkaW5nRm9ybS52YWx1ZTtcclxuICAgICAgbGV0IHByb2plY3RJZD1TZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfUFJPSkVDVF9JRCk7XHJcbiAgICAgIHRoaXMuYnVpbGRpbmdTZXJ2aWNlLmNyZWF0ZUJ1aWxkaW5nKCBwcm9qZWN0SWQsIHRoaXMuY2xvbmVCdWlsZGluZ01vZGVsKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgICBidWlsZGluZyA9PiB0aGlzLm9uQ3JlYXRlQnVpbGRpbmdTdWNjZXNzKGJ1aWxkaW5nKSxcclxuICAgICAgICAgIGVycm9yID0+IHRoaXMub25DcmVhdGVCdWlsZGluZ0ZhaWx1cmUoZXJyb3IpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uQ3JlYXRlQnVpbGRpbmdTdWNjZXNzKGJ1aWxkaW5nOiBhbnkpIHtcclxuICAgIC8vdGhpcy5jbG9uZUJ1aWxkaW5nSWQgPSBidWlsZGluZy5kYXRhLl9pZDtcclxuICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0NMT05FRF9CVUlMRElOR19ERVRBSUxTO1xyXG4gICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgdGhpcy5vbkNoYW5nZUNvc3RpbmdCeVVuaXQodGhpcy5kZWZhdWx0Q29zdGluZ0J5VW5pdCk7XHJcbiAgfVxyXG5cclxuICBvbkNyZWF0ZUJ1aWxkaW5nRmFpbHVyZShlcnJvcjogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgfVxyXG5cclxuICBjbG9uZUJ1aWxkaW5nQ29zdEhlYWRzKGNsb25lQ29zdEhlYWQ6IENvc3RIZWFkKSB7XHJcbiAgICBsZXQgcHJvamVjdElkPVNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuICAgIHRoaXMuYnVpbGRpbmdTZXJ2aWNlLmNsb25lQnVpbGRpbmdDb3N0SGVhZHMoIHByb2plY3RJZCwgdGhpcy5jbG9uZUJ1aWxkaW5nSWQsIGNsb25lQ29zdEhlYWQpLnN1YnNjcmliZShcclxuICAgICAgcHJvamVjdCA9PiB0aGlzLm9uQ2xvbmVCdWlsZGluZ0Nvc3RIZWFkc1N1Y2Nlc3MocHJvamVjdCksXHJcbiAgICAgIGVycm9yID0+IHRoaXMub25DbG9uZUJ1aWxkaW5nQ29zdEhlYWRzRmFpbHVyZShlcnJvcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkNsb25lQnVpbGRpbmdDb3N0SGVhZHNTdWNjZXNzKHByb2plY3Q6IGFueSkge1xyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgbWVzc2FnZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfQUREX0JVSUxESU5HX1BST0pFQ1Q7XHJcbiAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB0aGlzLm9uQ2hhbmdlQ29zdGluZ0J5VW5pdCh0aGlzLmRlZmF1bHRDb3N0aW5nQnlVbml0KTtcclxuICB9XHJcblxyXG4gIG9uQ2xvbmVCdWlsZGluZ0Nvc3RIZWFkc0ZhaWx1cmUoZXJyb3I6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgY2FsY3VsYXRlR3JhbmRUb3RhbCgpIHtcclxuICAgIC8vVG9EbyB3ZSBoYXZlIHRvIHJlbW92ZSB0aGlzIGNvZGUgYWZ0ZXJcclxuICAgIHRoaXMuZ3JhbmRUb3RhbE9mQnVkZ2V0ZWRDb3N0ID0gMDtcclxuICAgIHRoaXMuZ3JhbmRUb3RhbE9mVG90YWxSYXRlID0gMDtcclxuICAgIHRoaXMuZ3JhbmRUb3RhbE9mQXJlYSA9IDA7XHJcblxyXG4gICAgdGhpcy5ncmFuZFRvdGFsT2ZFc3RpbWF0ZWRDb3N0ID0gMDtcclxuICAgIHRoaXMuZ3JhbmRUb3RhbE9mRXN0aW1hdGVkUmF0ZSA9IDA7XHJcblxyXG4gICAgLy9DYWxjdWxhdGUgdG90YWwgb2YgYWxsIGJ1aWxkaW5nXHJcbiAgICBmb3IgKGxldCBidWlsZGluZEluZGV4ID0gMDsgYnVpbGRpbmRJbmRleCA8IHRoaXMuYnVpbGRpbmdzUmVwb3J0Lmxlbmd0aDsgYnVpbGRpbmRJbmRleCsrKSB7XHJcblxyXG4gICAgICB0aGlzLmdyYW5kVG90YWxPZkJ1ZGdldGVkQ29zdCA9IHRoaXMuZ3JhbmRUb3RhbE9mQnVkZ2V0ZWRDb3N0ICtcclxuICAgICAgICBwYXJzZUZsb2F0KCh0aGlzLmJ1aWxkaW5nc1JlcG9ydFtidWlsZGluZEluZGV4XS50aHVtYlJ1bGUudG90YWxCdWRnZXRlZENvc3QpLnRvRml4ZWQoVmFsdWVDb25zdGFudC5OVU1CRVJfT0ZfRlJBQ1RJT05fRElHSVQpKTtcclxuXHJcbiAgICAgIHRoaXMuZ3JhbmRUb3RhbE9mVG90YWxSYXRlID0gdGhpcy5ncmFuZFRvdGFsT2ZUb3RhbFJhdGUgK1xyXG4gICAgICAgIHBhcnNlRmxvYXQoKHRoaXMuYnVpbGRpbmdzUmVwb3J0W2J1aWxkaW5kSW5kZXhdLnRodW1iUnVsZS50b3RhbFJhdGUpLnRvRml4ZWQoVmFsdWVDb25zdGFudC5OVU1CRVJfT0ZfRlJBQ1RJT05fRElHSVQpKTtcclxuXHJcbiAgICAgIHRoaXMuZ3JhbmRUb3RhbE9mQXJlYSA9KCB0aGlzLmdyYW5kVG90YWxPZkFyZWEgKyBwYXJzZUZsb2F0KChcclxuICAgICAgICB0aGlzLmJ1aWxkaW5nc1JlcG9ydFtidWlsZGluZEluZGV4XS5hcmVhKS50b0ZpeGVkKFZhbHVlQ29uc3RhbnQuTlVNQkVSX09GX0ZSQUNUSU9OX0RJR0lUKSkpO1xyXG5cclxuICAgICAgdGhpcy5ncmFuZFRvdGFsT2ZFc3RpbWF0ZWRDb3N0ID0gdGhpcy5ncmFuZFRvdGFsT2ZFc3RpbWF0ZWRDb3N0ICtcclxuICAgICAgICBwYXJzZUZsb2F0KCh0aGlzLmJ1aWxkaW5nc1JlcG9ydFtidWlsZGluZEluZGV4XS5lc3RpbWF0ZS50b3RhbEVzdGltYXRlZENvc3QpLnRvRml4ZWQoVmFsdWVDb25zdGFudC5OVU1CRVJfT0ZfRlJBQ1RJT05fRElHSVQpKTtcclxuXHJcbiAgICAgIHRoaXMuZ3JhbmRUb3RhbE9mRXN0aW1hdGVkUmF0ZSA9IHRoaXMuZ3JhbmRUb3RhbE9mRXN0aW1hdGVkUmF0ZSArXHJcbiAgICAgICAgcGFyc2VGbG9hdCgodGhpcy5idWlsZGluZ3NSZXBvcnRbYnVpbGRpbmRJbmRleF0uZXN0aW1hdGUudG90YWxSYXRlKS50b0ZpeGVkKFZhbHVlQ29uc3RhbnQuTlVNQkVSX09GX0ZSQUNUSU9OX0RJR0lUKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9DYWxjdWxhdGUgdG90YWwgd2l0aCBhbWVuaXRpZXMgZGF0YVxyXG4gICAgdGhpcy5ncmFuZFRvdGFsT2ZCdWRnZXRlZENvc3QgPSB0aGlzLmdyYW5kVG90YWxPZkJ1ZGdldGVkQ29zdCArXHJcbiAgICAgIHBhcnNlRmxvYXQoKHRoaXMuYW1lbml0aWVzUmVwb3J0LnRodW1iUnVsZS50b3RhbEJ1ZGdldGVkQ29zdCkudG9GaXhlZChWYWx1ZUNvbnN0YW50Lk5VTUJFUl9PRl9GUkFDVElPTl9ESUdJVCkpO1xyXG5cclxuICAgIHRoaXMuZ3JhbmRUb3RhbE9mVG90YWxSYXRlID0gdGhpcy5ncmFuZFRvdGFsT2ZUb3RhbFJhdGUgK1xyXG4gICAgICBwYXJzZUZsb2F0KCh0aGlzLmFtZW5pdGllc1JlcG9ydC50aHVtYlJ1bGUudG90YWxSYXRlKS50b0ZpeGVkKFZhbHVlQ29uc3RhbnQuTlVNQkVSX09GX0ZSQUNUSU9OX0RJR0lUKSk7XHJcblxyXG4gICAgdGhpcy5ncmFuZFRvdGFsT2ZFc3RpbWF0ZWRDb3N0ID0gdGhpcy5ncmFuZFRvdGFsT2ZFc3RpbWF0ZWRDb3N0ICtcclxuICAgICAgcGFyc2VGbG9hdCgodGhpcy5hbWVuaXRpZXNSZXBvcnQuZXN0aW1hdGUudG90YWxFc3RpbWF0ZWRDb3N0KS50b0ZpeGVkKFZhbHVlQ29uc3RhbnQuTlVNQkVSX09GX0ZSQUNUSU9OX0RJR0lUKSk7XHJcblxyXG4gICAgdGhpcy5ncmFuZFRvdGFsT2ZFc3RpbWF0ZWRSYXRlID0gdGhpcy5ncmFuZFRvdGFsT2ZFc3RpbWF0ZWRSYXRlICtcclxuICAgICAgcGFyc2VGbG9hdCgodGhpcy5hbWVuaXRpZXNSZXBvcnQuZXN0aW1hdGUudG90YWxSYXRlKS50b0ZpeGVkKFZhbHVlQ29uc3RhbnQuTlVNQkVSX09GX0ZSQUNUSU9OX0RJR0lUKSk7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVTaG93R3JhbmRUb3RhbFBhbmVsQm9keSgpIHtcclxuICAgIHRoaXMuc2hvd0dyYW5kVG90YWxQYW5lbEJvZHk9IXRoaXMuc2hvd0dyYW5kVG90YWxQYW5lbEJvZHk7XHJcbiAgfVxyXG5cclxuICBkZWxldGVFbGVtZW50KGVsZW1lbnRUeXBlIDogc3RyaW5nKSB7XHJcbiAgICBpZihlbGVtZW50VHlwZSA9PT0gUHJvamVjdEVsZW1lbnRzLkNPU1RfSEVBRCkge1xyXG4gICAgICB0aGlzLmluQWN0aXZlQ29zdEhlYWQoKTtcclxuICAgIH1cclxuICAgIGlmKGVsZW1lbnRUeXBlID09PSBQcm9qZWN0RWxlbWVudHMuQlVJTERJTkcpIHtcclxuICAgICAgdGhpcy5kZWxldGVCdWlsZGluZygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0Q29zdFN1bW1hcnlSZXBvcnQoKSB7XHJcbiAgICB0aGlzLm9uQ2hhbmdlQ29zdGluZ0J5VW5pdCh0aGlzLmRlZmF1bHRDb3N0aW5nQnlVbml0KTtcclxuICB9XHJcblxyXG4gIGdldE1lbnVzKCkge1xyXG4gICAgcmV0dXJuIE1lbnVzO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGFiZWwoKSB7XHJcbiAgICByZXR1cm4gTGFiZWw7XHJcbiAgfVxyXG5cclxuICBnZXRCdXR0b24oKSB7XHJcbiAgICByZXR1cm4gQnV0dG9uO1xyXG4gIH1cclxuXHJcbiAgZ2V0SGVhZGluZ3MoKSB7XHJcbiAgICByZXR1cm4gSGVhZGluZ3M7XHJcbiAgfVxyXG5cclxuICBnZXRQcm9qZWN0RWxlbWVudHMoKSB7XHJcbiAgICByZXR1cm4gUHJvamVjdEVsZW1lbnRzO1xyXG4gIH1cclxuXHJcbiAgZG93bmxvYWRUb1BkZigpIHtcclxuICAgIGxldCBkb2MgPSBuZXcganNQREYoKTtcclxuICAgIGxldCBzcGVjaWFsRWxlbWVudEhhbmRsZXJzID0ge1xyXG4gICAgICAnI2VkaXRvcic6IGZ1bmN0aW9uIChlbGVtZW50IDogYW55LCByZW5kZXJlciA6IGFueSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxldCBjb250ZW50ID0gdGhpcy5jb250ZW50Lm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICBkb2MuZnJvbUhUTUwoY29udGVudC5pbm5lckhUTUwsIDUsIDUsIHtcclxuICAgICAgJ3dpZHRoJzogMTkwMCxcclxuICAgICAgJ2VsZW1lbnRIYW5kbGVycyc6IHNwZWNpYWxFbGVtZW50SGFuZGxlcnNcclxuICAgIH0pO1xyXG5cclxuICAgIGRvYy5zYXZlKCd0ZXN0LnBkZicpO1xyXG4gIH1cclxuXHJcbn1cclxuIl19
