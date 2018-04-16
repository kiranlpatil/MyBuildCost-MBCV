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
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var constants_1 = require("../../../../../shared/constants");
var loaders_service_1 = require("../../../../../shared/loader/loaders.service");
var building_1 = require("../../../model/building");
var index_1 = require("../../../../../shared/index");
var index_2 = require("../../../../../shared/index");
var building_service_1 = require("../building.service");
var validation_service_1 = require("../../../../../shared/customvalidations/validation.service");
var project_service_1 = require("../../project.service");
var BuildingListComponent = (function () {
    function BuildingListComponent(buildingService, projectService, _router, activatedRoute, messageService, formBuilder, loaderService) {
        this.buildingService = buildingService;
        this.projectService = projectService;
        this._router = _router;
        this.activatedRoute = activatedRoute;
        this.messageService = messageService;
        this.formBuilder = formBuilder;
        this.loaderService = loaderService;
        this.model = new building_1.Building();
        this.cloneBuildingForm = this.formBuilder.group({
            name: ['', validation_service_1.ValidationService.requiredBuildingName],
            totalSlabArea: ['', validation_service_1.ValidationService.requiredSlabArea],
            totalCarpetAreaOfUnit: ['', validation_service_1.ValidationService.requiredCarpetArea],
            totalSaleableAreaOfUnit: ['', validation_service_1.ValidationService.requiredSalebleArea],
            plinthArea: ['', validation_service_1.ValidationService.requiredPlinthArea],
            totalNumOfFloors: ['', validation_service_1.ValidationService.requiredTotalNumOfFloors],
            numOfParkingFloors: ['', validation_service_1.ValidationService.requiredNumOfParkingFloors],
            carpetAreaOfParking: ['', validation_service_1.ValidationService.requiredCarpetAreaOfParking],
            numOfOneBHK: ['', validation_service_1.ValidationService.requiredOneBHK],
            numOfTwoBHK: ['', validation_service_1.ValidationService.requiredTwoBHK],
            numOfThreeBHK: ['', validation_service_1.ValidationService.requiredThreeBHK],
            numOfFourBHK: ['', validation_service_1.ValidationService.requiredFourBHK],
            numOfFiveBHK: ['', validation_service_1.ValidationService.requiredFiveBHK],
            numOfLifts: ['', validation_service_1.ValidationService.requiredNumOfLifts],
        });
    }
    BuildingListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.params.subscribe(function (params) {
            _this.projectId = params['projectId'];
            if (_this.projectId) {
                _this.getProject();
            }
        });
    };
    BuildingListComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.cloneBuildingForm.valid) {
            this.model = this.cloneBuildingForm.value;
            var projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
            this.buildingService.createBuilding(projectId, this.model)
                .subscribe(function (building) { return _this.onCreateBuildingSuccess(building); }, function (error) { return _this.onCreateBuildingFailure(error); });
        }
    };
    BuildingListComponent.prototype.onCreateBuildingSuccess = function (building) {
        var message = new index_2.Message();
        message.isError = false;
        message.custom_message = constants_1.Messages.MSG_SUCCESS_ADD_BUILDING_PROJECT;
        this.messageService.message(message);
        this.clonedBuildingId = building.data._id;
    };
    BuildingListComponent.prototype.onCreateBuildingFailure = function (error) {
        console.log(error);
    };
    BuildingListComponent.prototype.updateBuildingByCostHead = function (cloneCostHead) {
        var _this = this;
        var projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
        this.buildingService.cloneBuildingCostHeads(projectId, this.clonedBuildingId, cloneCostHead).subscribe(function (project) { return _this.onCloneBuildingCostHeadsSuccess(project); }, function (error) { return _this.onCloneBuildingCostHeadsFailure(error); });
    };
    BuildingListComponent.prototype.onCloneBuildingCostHeadsSuccess = function (project) {
        this.getProject();
    };
    BuildingListComponent.prototype.onCloneBuildingCostHeadsFailure = function (error) {
        console.log(error);
    };
    BuildingListComponent.prototype.createBuilding = function () {
        this._router.navigate([constants_1.NavigationRoutes.APP_CREATE_BUILDING]);
    };
    BuildingListComponent.prototype.setBuildingId = function (buildingId) {
        this.currentbuildingId = buildingId;
    };
    BuildingListComponent.prototype.deleteBuilding = function () {
        var _this = this;
        this.loaderService.start();
        var projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
        this.buildingService.deleteBuilding(projectId, this.currentbuildingId).subscribe(function (project) { return _this.onDeleteBuildingSuccess(project); }, function (error) { return _this.onDeleteBuildingFailure(error); });
    };
    BuildingListComponent.prototype.onDeleteBuildingSuccess = function (result) {
        if (result !== null) {
            var message = new index_2.Message();
            message.isError = false;
            message.custom_message = constants_1.Messages.MSG_SUCCESS_DELETE_BUILDING;
            this.messageService.message(message);
            this.loaderService.stop();
            this.getProject();
        }
    };
    BuildingListComponent.prototype.onDeleteBuildingFailure = function (error) {
        console.log(error);
        this.loaderService.stop();
    };
    BuildingListComponent.prototype.getProject = function () {
        var _this = this;
        this.projectService.getProject(this.projectId).subscribe(function (projects) { return _this.onGetProjectSuccess(projects); }, function (error) { return _this.onGetProjectFailure(error); });
    };
    BuildingListComponent.prototype.onGetProjectSuccess = function (projects) {
        this.buildings = projects.data[0].building;
    };
    BuildingListComponent.prototype.onGetProjectFailure = function (error) {
        console.log(error);
    };
    BuildingListComponent.prototype.navigateToEditBuildingDetails = function (buildingId) {
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CURRENT_BUILDING, buildingId);
        this._router.navigate([constants_1.NavigationRoutes.APP_VIEW_BUILDING_DETAILS, buildingId]);
    };
    BuildingListComponent.prototype.cloneBuilding = function (buildingId) {
        var _this = this;
        this.loaderService.start();
        var projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
        this.buildingService.getBuilding(projectId, buildingId).subscribe(function (building) { return _this.onGetBuildingSuccess(building); }, function (error) { return _this.onGetBuildingFailure(error); });
    };
    BuildingListComponent.prototype.onGetBuildingSuccess = function (building) {
        var buildingDetails = building.data;
        this.clonedBuildingDetails = building.data.costHead;
        this.model.name = buildingDetails.name;
        this.model.totalSlabArea = buildingDetails.totalSlabArea;
        this.model.totalCarpetAreaOfUnit = buildingDetails.totalCarpetAreaOfUnit;
        this.model.totalSaleableAreaOfUnit = buildingDetails.totalSaleableAreaOfUnit;
        this.model.plinthArea = buildingDetails.plinthArea;
        this.model.totalNumOfFloors = buildingDetails.totalNumOfFloors;
        this.model.numOfParkingFloors = buildingDetails.numOfParkingFloors;
        this.model.carpetAreaOfParking = buildingDetails.carpetAreaOfParking;
        this.model.numOfOneBHK = buildingDetails.numOfOneBHK;
        this.model.numOfTwoBHK = buildingDetails.numOfTwoBHK;
        this.model.numOfThreeBHK = buildingDetails.numOfThreeBHK;
        this.model.numOfFourBHK = buildingDetails.numOfFourBHK;
        this.model.numOfFiveBHK = buildingDetails.numOfFiveBHK;
        this.model.numOfLifts = buildingDetails.numOfLifts;
        this.loaderService.stop();
    };
    BuildingListComponent.prototype.onGetBuildingFailure = function (error) {
        console.log(error);
        this.loaderService.stop();
    };
    BuildingListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-building-list',
            templateUrl: 'building-list.component.html'
        }),
        __metadata("design:paramtypes", [building_service_1.BuildingService, project_service_1.ProjectService, router_1.Router,
            router_1.ActivatedRoute, index_1.MessageService, forms_1.FormBuilder,
            loaders_service_1.LoaderService])
    ], BuildingListComponent);
    return BuildingListComponent;
}());
exports.BuildingListComponent = BuildingListComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2J1aWxkaW5nL2J1aWxkaW5ncy1saXN0L2J1aWxkaW5nLWxpc3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQWtEO0FBQ2xELHdDQUF3RDtBQUN4RCwwQ0FBeUQ7QUFDekQsNkRBQTZFO0FBQzdFLGdGQUE2RTtBQUM3RSxvREFBbUQ7QUFDbkQscURBQW1HO0FBQ25HLHFEQUFzRDtBQUN0RCx3REFBc0Q7QUFDdEQsaUdBQStGO0FBQy9GLHlEQUF1RDtBQVF2RDtJQVVFLCtCQUFvQixlQUFnQyxFQUFVLGNBQStCLEVBQVUsT0FBZSxFQUNsRyxjQUE2QixFQUFTLGNBQThCLEVBQVUsV0FBd0IsRUFDdEcsYUFBNEI7UUFGNUIsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQWlCO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNsRyxtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQUFTLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3RHLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBTGhELFVBQUssR0FBYSxJQUFJLG1CQUFRLEVBQUUsQ0FBQztRQU8vQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7WUFDOUMsSUFBSSxFQUFHLENBQUMsRUFBRSxFQUFFLHNDQUFpQixDQUFDLG9CQUFvQixDQUFDO1lBQ25ELGFBQWEsRUFBRSxDQUFDLEVBQUUsRUFBRSxzQ0FBaUIsQ0FBQyxnQkFBZ0IsQ0FBQztZQUN2RCxxQkFBcUIsRUFBRSxDQUFDLEVBQUUsRUFBRSxzQ0FBaUIsQ0FBQyxrQkFBa0IsQ0FBQztZQUNqRSx1QkFBdUIsRUFBRSxDQUFDLEVBQUUsRUFBRSxzQ0FBaUIsQ0FBQyxtQkFBbUIsQ0FBQztZQUNwRSxVQUFVLEVBQUUs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QThCO1NBQzVDLENBQUM7eUNBWXFDLGtDQUFlLEVBQTJCLGdDQUFjLEVBQW1CLGVBQU07WUFDbkYsdUJBQWMsRUFBeUIsc0JBQWMsRUFBdUIsbUJBQVc7WUFDdkYsK0JBQWE7T0FackMscUJBQXFCLENBd0tqQztJQUFELDRCQUFDO0NBeEtELEFBd0tDLElBQUE7QUF4S1ksc0RBQXFCIiwiZmlsZSI6ImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2J1aWxkaW5nL2J1aWxkaW5ncy1saXN0L2J1aWxkaW5nLWxpc3QuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgUm91dGVyLCBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IE1lc3NhZ2VzLCBOYXZpZ2F0aW9uUm91dGVzIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IExvYWRlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zaGFyZWQvbG9hZGVyL2xvYWRlcnMuc2VydmljZSc7XHJcbmltcG9ydCB7IEJ1aWxkaW5nIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWwvYnVpbGRpbmcnO1xyXG5pbXBvcnQgeyBTZXNzaW9uU3RvcmFnZSwgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2hhcmVkL2luZGV4JztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IEJ1aWxkaW5nU2VydmljZSB9IGZyb20gJy4uL2J1aWxkaW5nLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBWYWxpZGF0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9jdXN0b212YWxpZGF0aW9ucy92YWxpZGF0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQcm9qZWN0U2VydmljZSB9IGZyb20gJy4uLy4uL3Byb2plY3Quc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAnYmktYnVpbGRpbmctbGlzdCcsXHJcbiAgdGVtcGxhdGVVcmw6ICdidWlsZGluZy1saXN0LmNvbXBvbmVudC5odG1sJ1xyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIEJ1aWxkaW5nTGlzdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIGJ1aWxkaW5ncyA6IGFueTtcclxuICBwcm9qZWN0SWQgOiBhbnk7XHJcbiAgY3VycmVudGJ1aWxkaW5nSWQ6IGFueTtcclxuICBjbG9uZWRCdWlsZGluZ0lkIDogc3RyaW5nO1xyXG4gIGNsb25lQnVpbGRpbmdGb3JtOiBGb3JtR3JvdXA7XHJcbiAgbW9kZWw6IEJ1aWxkaW5nID0gbmV3IEJ1aWxkaW5nKCk7XHJcbiAgY2xvbmVkQnVpbGRpbmdEZXRhaWxzOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYnVpbGRpbmdTZXJ2aWNlOiBCdWlsZGluZ1NlcnZpY2UsIHByaXZhdGUgcHJvamVjdFNlcnZpY2UgOiBQcm9qZWN0U2VydmljZSwgcHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZTpBY3RpdmF0ZWRSb3V0ZSxwcml2YXRlIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSwgcHJpdmF0ZSBmb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBsb2FkZXJTZXJ2aWNlOiBMb2FkZXJTZXJ2aWNlKSB7XHJcblxyXG4gICAgdGhpcy5jbG9uZUJ1aWxkaW5nRm9ybSA9IHRoaXMuZm9ybUJ1aWxkZXIuZ3JvdXAoe1xyXG4gICAgICBuYW1lIDogWycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZEJ1aWxkaW5nTmFtZV0sXHJcbiAgICAgIHRvdGFsU2xhYkFyZWEgOlsnJywgVmFsaWRhdGlvblNlcnZpY2UucmVxdWlyZWRTbGFiQXJlYV0sXHJcbiAgICAgIHRvdGFsQ2FycGV0QXJlYU9mVW5pdCA6WycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZENhcnBldEFyZWFdLFxyXG4gICAgICB0b3RhbFNhbGVhYmxlQXJlYU9mVW5pdCA6WycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZFNhbGVibGVBcmVhXSxcclxuICAgICAgcGxpbnRoQXJlYSA6WycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZFBsaW50aEFyZWFdLFxyXG4gICAgICB0b3RhbE51bU9mRmxvb3JzIDpbJycsIFZhbGlkYXRpb25TZXJ2aWNlLnJlcXVpcmVkVG90YWxOdW1PZkZsb29yc10sXHJcbiAgICAgIG51bU9mUGFya2luZ0Zsb29ycyA6WycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZE51bU9mUGFya2luZ0Zsb29yc10sXHJcbiAgICAgIGNhcnBldEFyZWFPZlBhcmtpbmcgOlsnJywgVmFsaWRhdGlvblNlcnZpY2UucmVxdWlyZWRDYXJwZXRBcmVhT2ZQYXJraW5nXSxcclxuICAgICAgbnVtT2ZPbmVCSEsgOiBbJycsICBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZE9uZUJIS10sXHJcbiAgICAgIG51bU9mVHdvQkhLIDpbJycsIFZhbGlkYXRpb25TZXJ2aWNlLnJlcXVpcmVkVHdvQkhLXSxcclxuICAgICAgbnVtT2ZUaHJlZUJISyA6WycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZFRocmVlQkhLXSxcclxuICAgICAgbnVtT2ZGb3VyQkhLIDpbJycsIFZhbGlkYXRpb25TZXJ2aWNlLnJlcXVpcmVkRm91ckJIS10sXHJcbiAgICAgIG51bU9mRml2ZUJISyA6WycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZEZpdmVCSEtdLFxyXG4gICAgICBudW1PZkxpZnRzIDpbJycsIFZhbGlkYXRpb25TZXJ2aWNlLnJlcXVpcmVkTnVtT2ZMaWZ0c10sXHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuYWN0aXZhdGVkUm91dGUucGFyYW1zLnN1YnNjcmliZShwYXJhbXMgPT4ge1xyXG4gICAgICB0aGlzLnByb2plY3RJZCA9IHBhcmFtc1sncHJvamVjdElkJ107XHJcbiAgICAgIGlmKHRoaXMucHJvamVjdElkKSB7XHJcbiAgICAgICAgdGhpcy5nZXRQcm9qZWN0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgb25TdWJtaXQoKSB7XHJcbiAgICBpZih0aGlzLmNsb25lQnVpbGRpbmdGb3JtLnZhbGlkKSB7XHJcbiAgICAgIHRoaXMubW9kZWwgPSB0aGlzLmNsb25lQnVpbGRpbmdGb3JtLnZhbHVlO1xyXG4gICAgICBsZXQgcHJvamVjdElkPVNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuICAgICAgdGhpcy5idWlsZGluZ1NlcnZpY2UuY3JlYXRlQnVpbGRpbmcoIHByb2plY3RJZCwgdGhpcy5tb2RlbClcclxuICAgICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgYnVpbGRpbmcgPT4gdGhpcy5vbkNyZWF0ZUJ1aWxkaW5nU3VjY2VzcyhidWlsZGluZyksXHJcbiAgICAgICAgICBlcnJvciA9PiB0aGlzLm9uQ3JlYXRlQnVpbGRpbmdGYWlsdXJlKGVycm9yKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkNyZWF0ZUJ1aWxkaW5nU3VjY2VzcyhidWlsZGluZyA6IGFueSkge1xyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgbWVzc2FnZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfQUREX0JVSUxESU5HX1BST0pFQ1Q7XHJcbiAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB0aGlzLmNsb25lZEJ1aWxkaW5nSWQgPSBidWlsZGluZy5kYXRhLl9pZDtcclxuICB9XHJcblxyXG4gIG9uQ3JlYXRlQnVpbGRpbmdGYWlsdXJlKGVycm9yIDogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVCdWlsZGluZ0J5Q29zdEhlYWQoY2xvbmVDb3N0SGVhZDogYW55KSB7XHJcbiAgICBsZXQgcHJvamVjdElkPVNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuICAgIHRoaXMuYnVpbGRpbmdTZXJ2aWNlLmNsb25lQnVpbGRpbmdDb3N0SGVhZHMocHJvamVjdElkLCB0aGlzLmNsb25lZEJ1aWxkaW5nSWQsIGNsb25lQ29zdEhlYWQpLnN1YnNjcmliZShcclxuICAgICAgcHJvamVjdCA9PiB0aGlzLm9uQ2xvbmVCdWlsZGluZ0Nvc3RIZWFkc1N1Y2Nlc3MocHJvamVjdCksXHJcbiAgICAgIGVycm9yID0+IHRoaXMub25DbG9uZUJ1aWxkaW5nQ29zdEhlYWRzRmFpbHVyZShlcnJvcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkNsb25lQnVpbGRpbmdDb3N0SGVhZHNTdWNjZXNzKHByb2plY3Q6IGFueSkge1xyXG4gICAgdGhpcy5nZXRQcm9qZWN0KCk7XHJcbiAgfVxyXG5cclxuICBvbkNsb25lQnVpbGRpbmdDb3N0SGVhZHNGYWlsdXJlKGVycm9yOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZUJ1aWxkaW5nKCkge1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9DUkVBVEVfQlVJTERJTkddKTtcclxuICB9XHJcblxyXG4gIHNldEJ1aWxkaW5nSWQoYnVpbGRpbmdJZCA6IGFueSkge1xyXG4gICAgdGhpcy5jdXJyZW50YnVpbGRpbmdJZCA9IGJ1aWxkaW5nSWQ7XHJcbiAgfVxyXG5cclxuICBkZWxldGVCdWlsZGluZygpIHtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdGFydCgpO1xyXG4gICAgbGV0IHByb2plY3RJZD1TZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfUFJPSkVDVF9JRCk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nU2VydmljZS5kZWxldGVCdWlsZGluZyggcHJvamVjdElkLCB0aGlzLmN1cnJlbnRidWlsZGluZ0lkKS5zdWJzY3JpYmUoXHJcbiAgICAgIHByb2plY3QgPT4gdGhpcy5vbkRlbGV0ZUJ1aWxkaW5nU3VjY2Vzcyhwcm9qZWN0KSxcclxuICAgICAgZXJyb3IgPT4gdGhpcy5vbkRlbGV0ZUJ1aWxkaW5nRmFpbHVyZShlcnJvcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkRlbGV0ZUJ1aWxkaW5nU3VjY2VzcyhyZXN1bHQgOiBhbnkpIHtcclxuICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcclxuICAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0RFTEVURV9CVUlMRElORztcclxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gICAgICB0aGlzLmdldFByb2plY3QoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uRGVsZXRlQnVpbGRpbmdGYWlsdXJlKGVycm9yIDogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0UHJvamVjdCgpIHtcclxuICAgIC8vY2hhbmdlICBpbiBwcm9qZWN0U2VydmljZVxyXG4gICAgdGhpcy5wcm9qZWN0U2VydmljZS5nZXRQcm9qZWN0KHRoaXMucHJvamVjdElkKS5zdWJzY3JpYmUoXHJcbiAgICAgIHByb2plY3RzID0+IHRoaXMub25HZXRQcm9qZWN0U3VjY2Vzcyhwcm9qZWN0cyksXHJcbiAgICAgIGVycm9yID0+IHRoaXMub25HZXRQcm9qZWN0RmFpbHVyZShlcnJvcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkdldFByb2plY3RTdWNjZXNzKHByb2plY3RzIDogYW55KSB7XHJcbiAgICB0aGlzLmJ1aWxkaW5ncyA9IHByb2plY3RzLmRhdGFbMF0uYnVpbGRpbmc7XHJcbiAgfVxyXG5cclxuICBvbkdldFByb2plY3RGYWlsdXJlKGVycm9yIDogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgfVxyXG5cclxuICBuYXZpZ2F0ZVRvRWRpdEJ1aWxkaW5nRGV0YWlscyhidWlsZGluZ0lkIDogYW55KSB7XHJcbiAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfQlVJTERJTkcsIGJ1aWxkaW5nSWQpO1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9WSUVXX0JVSUxESU5HX0RFVEFJTFMsIGJ1aWxkaW5nSWRdKTtcclxuICB9XHJcblxyXG4gIGNsb25lQnVpbGRpbmcoYnVpbGRpbmdJZCA6IGFueSkge1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0YXJ0KCk7XHJcbiAgICBsZXQgcHJvamVjdElkPVNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuICAgIHRoaXMuYnVpbGRpbmdTZXJ2aWNlLmdldEJ1aWxkaW5nKCBwcm9qZWN0SWQsIGJ1aWxkaW5nSWQpLnN1YnNjcmliZShcclxuICAgICAgYnVpbGRpbmcgPT4gdGhpcy5vbkdldEJ1aWxkaW5nU3VjY2VzcyhidWlsZGluZyksXHJcbiAgICAgIGVycm9yID0+IHRoaXMub25HZXRCdWlsZGluZ0ZhaWx1cmUoZXJyb3IpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgb25HZXRCdWlsZGluZ1N1Y2Nlc3MoYnVpbGRpbmcgOiBhbnkpIHtcclxuICAgIGxldCBidWlsZGluZ0RldGFpbHM9YnVpbGRpbmcuZGF0YTtcclxuICAgIHRoaXMuY2xvbmVkQnVpbGRpbmdEZXRhaWxzID0gYnVpbGRpbmcuZGF0YS5jb3N0SGVhZDtcclxuICAgIHRoaXMubW9kZWwubmFtZSA9IGJ1aWxkaW5nRGV0YWlscy5uYW1lO1xyXG4gICAgdGhpcy5tb2RlbC50b3RhbFNsYWJBcmVhID0gYnVpbGRpbmdEZXRhaWxzLnRvdGFsU2xhYkFyZWE7XHJcbiAgICB0aGlzLm1vZGVsLnRvdGFsQ2FycGV0QXJlYU9mVW5pdCA9IGJ1aWxkaW5nRGV0YWlscy50b3RhbENhcnBldEFyZWFPZlVuaXQ7XHJcbiAgICB0aGlzLm1vZGVsLnRvdGFsU2FsZWFibGVBcmVhT2ZVbml0ID0gYnVpbGRpbmdEZXRhaWxzLnRvdGFsU2FsZWFibGVBcmVhT2ZVbml0O1xyXG4gICAgdGhpcy5tb2RlbC5wbGludGhBcmVhID0gYnVpbGRpbmdEZXRhaWxzLnBsaW50aEFyZWE7XHJcbiAgICB0aGlzLm1vZGVsLnRvdGFsTnVtT2ZGbG9vcnMgPSBidWlsZGluZ0RldGFpbHMudG90YWxOdW1PZkZsb29ycztcclxuICAgIHRoaXMubW9kZWwubnVtT2ZQYXJraW5nRmxvb3JzID0gYnVpbGRpbmdEZXRhaWxzLm51bU9mUGFya2luZ0Zsb29ycztcclxuICAgIHRoaXMubW9kZWwuY2FycGV0QXJlYU9mUGFya2luZyA9IGJ1aWxkaW5nRGV0YWlscy5jYXJwZXRBcmVhT2ZQYXJraW5nO1xyXG4gICAgdGhpcy5tb2RlbC5udW1PZk9uZUJISyA9IGJ1aWxkaW5nRGV0YWlscy5udW1PZk9uZUJISztcclxuICAgIHRoaXMubW9kZWwubnVtT2ZUd29CSEsgPSBidWlsZGluZ0RldGFpbHMubnVtT2ZUd29CSEs7XHJcbiAgICB0aGlzLm1vZGVsLm51bU9mVGhyZWVCSEsgPSBidWlsZGluZ0RldGFpbHMubnVtT2ZUaHJlZUJISztcclxuICAgIHRoaXMubW9kZWwubnVtT2ZGb3VyQkhLID0gYnVpbGRpbmdEZXRhaWxzLm51bU9mRm91ckJISztcclxuICAgIHRoaXMubW9kZWwubnVtT2ZGaXZlQkhLID0gYnVpbGRpbmdEZXRhaWxzLm51bU9mRml2ZUJISztcclxuICAgIHRoaXMubW9kZWwubnVtT2ZMaWZ0cyA9IGJ1aWxkaW5nRGV0YWlscy5udW1PZkxpZnRzO1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICB9XHJcblxyXG4gIG9uR2V0QnVpbGRpbmdGYWlsdXJlKGVycm9yIDogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxufVxyXG4iXX0=
