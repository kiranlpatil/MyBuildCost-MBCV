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
var building_report_1 = require("../../../model/building-report");
var index_1 = require("../../../../../shared/index");
var cost_summary_service_1 = require("../../cost-summary-report/cost-summary.service");
var loaders_service_1 = require("../../../../../shared/loader/loaders.service");
var CommonAmenitiesComponent = (function () {
    function CommonAmenitiesComponent(activatedRoute, _router, costSummaryService, messageService, loaderService) {
        this.activatedRoute = activatedRoute;
        this._router = _router;
        this.costSummaryService = costSummaryService;
        this.messageService = messageService;
        this.loaderService = loaderService;
        this.getReportDetails = new core_1.EventEmitter();
        this.inActiveProjectCostHeads = new Array();
    }
    CommonAmenitiesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.params.subscribe(function (params) {
            _this.projectId = params['projectId'];
        });
    };
    CommonAmenitiesComponent.prototype.goToCostHeadView = function (estimatedItem) {
        this.projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
        this.projectName = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_NAME);
        this._router.navigate([constants_1.NavigationRoutes.APP_PROJECT, this.projectId, constants_1.NavigationRoutes.APP_COMMON_AMENITIES,
            this.projectName, constants_1.NavigationRoutes.APP_COST_HEAD, estimatedItem.name, estimatedItem.rateAnalysisId, constants_1.NavigationRoutes.APP_CATEGORY]);
    };
    CommonAmenitiesComponent.prototype.changeBudgetedCostAmountOfProjectCostHead = function (costHead, amount) {
        var _this = this;
        if (amount !== null) {
            var projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
            this.costSummaryService.changeBudgetedCostAmountOfProjectCostHead(projectId, costHead, amount).subscribe(function (buildingDetails) { return _this.onUpdateBudgetedCostAmountSuccess(buildingDetails); }, function (error) { return _this.onUpdateBudgetedCostAmountFailure(error); });
        }
    };
    CommonAmenitiesComponent.prototype.onUpdateBudgetedCostAmountSuccess = function (buildingDetails) {
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = index_1.Messages.MSG_SUCCESS_UPDATE_THUMBRULE_RATE_COSTHEAD;
        this.messageService.message(message);
        this.getReportDetails.emit();
    };
    CommonAmenitiesComponent.prototype.onUpdateBudgetedCostAmountFailure = function (error) {
        console.log('onAddCostheadSuccess : ' + error);
    };
    CommonAmenitiesComponent.prototype.getAllInActiveProjectCostHeads = function () {
        var _this = this;
        var projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
        this.costSummaryService.getAllInActiveProjectCostHeads(this.projectId).subscribe(function (inActiveCostHeads) { return _this.onGetAllInActiveCostHeadsSuccess(inActiveCostHeads); }, function (error) { return _this.onGetAllInActiveCostHeadsFailure(error); });
    };
    CommonAmenitiesComponent.prototype.onGetAllInActiveCostHeadsSuccess = function (inActiveCostHeads) {
        this.inActiveProjectCostHeads = inActiveCostHeads.data;
        this.showProjectCostHeadList = true;
        this.getReportDetails.emit();
    };
    CommonAmenitiesComponent.prototype.onGetAllInActiveCostHeadsFailure = function (error) {
        console.log(error);
    };
    CommonAmenitiesComponent.prototype.onChangeActiveSelectedCostHead = function (selectedInActiveCostHeadId) {
        var _this = this;
        this.showProjectCostHeadList = false;
        this.loaderService.start();
        this.costSummaryService.activateProjectCostHead(this.projectId, selectedInActiveCostHeadId).subscribe(function (inActiveCostHeads) { return _this.onActiveCostHeadSuccess(inActiveCostHeads); }, function (error) { return _this.onActiveCostHeadFailure(error); });
    };
    CommonAmenitiesComponent.prototype.onActiveCostHeadSuccess = function (inActiveCostHeads) {
        this.getReportDetails.emit();
        this.loaderService.stop();
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = index_1.Messages.MSG_SUCCESS_ADD_COSTHEAD;
        this.messageService.message(message);
    };
    CommonAmenitiesComponent.prototype.onActiveCostHeadFailure = function (error) {
        console.log('onActiveCostHeadFailure()' + error);
        this.loaderService.stop();
    };
    CommonAmenitiesComponent.prototype.setIdsToInActiveCostHead = function (projectCostHeadId) {
        this.currentProjectCostHeadId = projectCostHeadId;
    };
    CommonAmenitiesComponent.prototype.deleteProjectCostHead = function () {
        var _this = this;
        this.showProjectCostHeadList = false;
        var projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
        this.loaderService.start();
        this.costSummaryService.inactivateProjectCostHead(projectId, this.currentProjectCostHeadId).subscribe(function (inActiveCostHeads) { return _this.onInactivateCostHeadSuccess(inActiveCostHeads); }, function (error) { return _this.onInactivateCostHeadFailure(error); });
    };
    CommonAmenitiesComponent.prototype.onInactivateCostHeadSuccess = function (inActiveCostHeads) {
        this.getReportDetails.emit();
        this.loaderService.stop();
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = index_1.Messages.MSG_SUCCESS_DELETE_COSTHEAD;
        this.messageService.message(message);
    };
    CommonAmenitiesComponent.prototype.onInactivateCostHeadFailure = function (error) {
        console.log('onActiveCostHeadFailure()' + error);
        this.loaderService.stop();
    };
    CommonAmenitiesComponent.prototype.getHeadings = function () {
        return constants_1.Headings;
    };
    CommonAmenitiesComponent.prototype.getTableHeadings = function () {
        return constants_1.TableHeadings;
    };
    CommonAmenitiesComponent.prototype.getLabel = function () {
        return constants_1.Label;
    };
    CommonAmenitiesComponent.prototype.getButton = function () {
        return constants_1.Button;
    };
    CommonAmenitiesComponent.prototype.getProjectElements = function () {
        return constants_1.ProjectElements;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", building_report_1.BuildingReport)
    ], CommonAmenitiesComponent.prototype, "amenitiesReport", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], CommonAmenitiesComponent.prototype, "costingByUnit", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], CommonAmenitiesComponent.prototype, "costingByArea", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], CommonAmenitiesComponent.prototype, "getReportDetails", void 0);
    CommonAmenitiesComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-common-amenities',
            styleUrls: ['common-amenities.component.css'],
            templateUrl: 'common-amenities.component.html'
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute, router_1.Router, cost_summary_service_1.CostSummaryService,
            index_1.MessageService, loaders_service_1.LoaderService])
    ], CommonAmenitiesComponent);
    return CommonAmenitiesComponent;
}());
exports.CommonAmenitiesComponent = CommonAmenitiesComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29tbW9uLWFtZW5pdGllcy9jb21tb24tYW1lbml0aWVzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUErRTtBQUMvRSwwQ0FBeUQ7QUFDekQsNkRBQTRIO0FBQzVILGtFQUFnRTtBQUNoRSxxREFBd0g7QUFFeEgsdUZBQW9GO0FBRXBGLGdGQUE2RTtBQVM3RTtJQVlFLGtDQUFvQixjQUE4QixFQUFVLE9BQWdCLEVBQVUsa0JBQXVDLEVBQ3pHLGNBQStCLEVBQVUsYUFBNkI7UUFEdEUsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUFVLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBcUI7UUFDekcsbUJBQWMsR0FBZCxjQUFjLENBQWlCO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQWdCO1FBVGhGLHFCQUFnQixHQUFJLElBQUksbUJBQVksRUFBTyxDQUFDO1FBTXRELDZCQUF3QixHQUFHLElBQUksS0FBSyxFQUFZLENBQUM7SUFJakQsQ0FBQztJQUVELDJDQUFRLEdBQVI7UUFBQSxpQkFJQztRQUhDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFBLE1BQU07WUFDekMsS0FBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0QsbURBQWdCLEdBQWhCLFVBQWlCLGFBQTZCO1FBQzVDLElBQUksQ0FBQyxTQUFTLEdBQUcsNkJBQXFCLENBQUMsZUFBZSxDQUFDLHNCQUFjLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUMxRixJQUFJLENBQUMsV0FBVyxHQUFHLDZCQUFxQixDQUFDLGVBQWUsQ0FBQyxzQkFBYyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDOUYs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QUN6QixDQUFDO0lBeklRO1FBQVIsWUFBSyxFQUFFO2tDQUFrQixnQ0FBYztxRUFBQztJQUNoQztRQUFSLFlBQUssRUFBRTs7bUVBQXdCO0lBQ3ZCO1FBQVIsWUFBSyxFQUFFOzttRUFBd0I7SUFDdEI7UUFBVCxhQUFNLEVBQUU7O3NFQUE2QztJQUozQyx3QkFBd0I7UUFQcEMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUscUJBQXFCO1lBQy9CLFNBQVMsRUFBRSxDQUFDLGdDQUFnQyxDQUFDO1lBQzdDLFdBQVcsRUFBRSxpQ0FBaUM7U0FDL0MsQ0FBQzt5Q0Fjb0MsdUJBQWMsRUFBb0IsZUFBTSxFQUErQix5Q0FBa0I7WUFDeEYsc0JBQWMsRUFBMEIsK0JBQWE7T0FiL0Usd0JBQXdCLENBMklwQztJQUFELCtCQUFDO0NBM0lELEFBMklDLElBQUE7QUEzSVksNERBQXdCIiwiZmlsZSI6ImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29tbW9uLWFtZW5pdGllcy9jb21tb24tYW1lbml0aWVzLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IEJ1dHRvbiwgSGVhZGluZ3MsIExhYmVsLCBOYXZpZ2F0aW9uUm91dGVzLCBUYWJsZUhlYWRpbmdzLCBQcm9qZWN0RWxlbWVudHMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zaGFyZWQvY29uc3RhbnRzJztcclxuaW1wb3J0IHsgQnVpbGRpbmdSZXBvcnQgfSBmcm9tICcuLi8uLi8uLi9tb2RlbC9idWlsZGluZy1yZXBvcnQnO1xyXG5pbXBvcnQgeyBTZXNzaW9uU3RvcmFnZSwgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLCAgTWVzc2FnZSwgTWVzc2FnZXMsIE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2hhcmVkL2luZGV4JztcclxuaW1wb3J0IHsgRXN0aW1hdGVSZXBvcnQgfSBmcm9tICcuLi8uLi8uLi9tb2RlbC9lc3RpbWF0ZS1yZXBvcnQnO1xyXG5pbXBvcnQgeyBDb3N0U3VtbWFyeVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jb3N0LXN1bW1hcnktcmVwb3J0L2Nvc3Qtc3VtbWFyeS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29zdEhlYWQgfSBmcm9tICcuLi8uLi8uLi9tb2RlbC9jb3N0aGVhZCc7XHJcbmltcG9ydCB7IExvYWRlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zaGFyZWQvbG9hZGVyL2xvYWRlcnMuc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAnYmktY29tbW9uLWFtZW5pdGllcycsXHJcbiAgc3R5bGVVcmxzOiBbJ2NvbW1vbi1hbWVuaXRpZXMuY29tcG9uZW50LmNzcyddLFxyXG4gIHRlbXBsYXRlVXJsOiAnY29tbW9uLWFtZW5pdGllcy5jb21wb25lbnQuaHRtbCdcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tb25BbWVuaXRpZXNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpIGFtZW5pdGllc1JlcG9ydDogQnVpbGRpbmdSZXBvcnQ7XHJcbiAgQElucHV0KCkgY29zdGluZ0J5VW5pdCA6IHN0cmluZztcclxuICBASW5wdXQoKSBjb3N0aW5nQnlBcmVhIDogc3RyaW5nO1xyXG4gIEBPdXRwdXQoKSBnZXRSZXBvcnREZXRhaWxzID0gIG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIHByb2plY3RJZDogc3RyaW5nO1xyXG4gIHByb2plY3ROYW1lOiBzdHJpbmc7XHJcbiAgY29zdEhlYWRJZDpudW1iZXI7XHJcbiAgY3VycmVudFByb2plY3RDb3N0SGVhZElkIDogbnVtYmVyO1xyXG4gIHNob3dQcm9qZWN0Q29zdEhlYWRMaXN0IDogYm9vbGVhbjtcclxuICBpbkFjdGl2ZVByb2plY3RDb3N0SGVhZHMgPSBuZXcgQXJyYXk8Q29zdEhlYWQ+KCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYWN0aXZhdGVkUm91dGU6IEFjdGl2YXRlZFJvdXRlLCBwcml2YXRlIF9yb3V0ZXIgOiBSb3V0ZXIsIHByaXZhdGUgY29zdFN1bW1hcnlTZXJ2aWNlIDogQ29zdFN1bW1hcnlTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgbWVzc2FnZVNlcnZpY2UgOiBNZXNzYWdlU2VydmljZSwgcHJpdmF0ZSBsb2FkZXJTZXJ2aWNlIDogTG9hZGVyU2VydmljZSkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLmFjdGl2YXRlZFJvdXRlLnBhcmFtcy5zdWJzY3JpYmUocGFyYW1zID0+IHtcclxuICAgICAgdGhpcy5wcm9qZWN0SWQgPSBwYXJhbXNbJ3Byb2plY3RJZCddO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGdvVG9Db3N0SGVhZFZpZXcoZXN0aW1hdGVkSXRlbSA6RXN0aW1hdGVSZXBvcnQpIHtcclxuICAgIHRoaXMucHJvamVjdElkID0gU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfSUQpO1xyXG4gICAgdGhpcy5wcm9qZWN0TmFtZSA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX05BTUUpO1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9QUk9KRUNULCB0aGlzLnByb2plY3RJZCwgTmF2aWdhdGlvblJvdXRlcy5BUFBfQ09NTU9OX0FNRU5JVElFUyxcclxuICAgICAgdGhpcy5wcm9qZWN0TmFtZSwgTmF2aWdhdGlvblJvdXRlcy5BUFBfQ09TVF9IRUFELCBlc3RpbWF0ZWRJdGVtLm5hbWUsIGVzdGltYXRlZEl0ZW0ucmF0ZUFuYWx5c2lzSWQsIE5hdmlnYXRpb25Sb3V0ZXMuQVBQX0NBVEVHT1JZXSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgY2hhbmdlQnVkZ2V0ZWRDb3N0QW1vdW50T2ZQcm9qZWN0Q29zdEhlYWQoY29zdEhlYWQ6IHN0cmluZywgYW1vdW50OiBudW1iZXIpIHtcclxuICAgIGlmIChhbW91bnQgIT09IG51bGwpIHtcclxuICAgICAgbGV0IHByb2plY3RJZCA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuICAgICAgdGhpcy5jb3N0U3VtbWFyeVNlcnZpY2UuY2hhbmdlQnVkZ2V0ZWRDb3N0QW1vdW50T2ZQcm9qZWN0Q29zdEhlYWQoIHByb2plY3RJZCwgIGNvc3RIZWFkLCBhbW91bnQpLnN1YnNjcmliZShcclxuICAgICAgICBidWlsZGluZ0RldGFpbHMgPT4gdGhpcy5vblVwZGF0ZUJ1ZGdldGVkQ29zdEFtb3VudFN1Y2Nlc3MoYnVpbGRpbmdEZXRhaWxzKSxcclxuICAgICAgICBlcnJvciA9PiB0aGlzLm9uVXBkYXRlQnVkZ2V0ZWRDb3N0QW1vdW50RmFpbHVyZShlcnJvcilcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uVXBkYXRlQnVkZ2V0ZWRDb3N0QW1vdW50U3VjY2VzcyhidWlsZGluZ0RldGFpbHMgOiBhbnkpIHtcclxuICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX1VQREFURV9USFVNQlJVTEVfUkFURV9DT1NUSEVBRDtcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIHRoaXMuZ2V0UmVwb3J0RGV0YWlscy5lbWl0KCk7XHJcbiAgfVxyXG5cclxuICBvblVwZGF0ZUJ1ZGdldGVkQ29zdEFtb3VudEZhaWx1cmUoZXJyb3IgOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKCdvbkFkZENvc3RoZWFkU3VjY2VzcyA6ICcrZXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWxsSW5BY3RpdmVQcm9qZWN0Q29zdEhlYWRzKCkge1xyXG4gICAgbGV0IHByb2plY3RJZCA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuICAgIHRoaXMuY29zdFN1bW1hcnlTZXJ2aWNlLmdldEFsbEluQWN0aXZlUHJvamVjdENvc3RIZWFkcyggdGhpcy5wcm9qZWN0SWQgKS5zdWJzY3JpYmUoXHJcbiAgICAgIGluQWN0aXZlQ29zdEhlYWRzID0+IHRoaXMub25HZXRBbGxJbkFjdGl2ZUNvc3RIZWFkc1N1Y2Nlc3MoaW5BY3RpdmVDb3N0SGVhZHMpLFxyXG4gICAgICBlcnJvciA9PiB0aGlzLm9uR2V0QWxsSW5BY3RpdmVDb3N0SGVhZHNGYWlsdXJlKGVycm9yKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIG9uR2V0QWxsSW5BY3RpdmVDb3N0SGVhZHNTdWNjZXNzKGluQWN0aXZlQ29zdEhlYWRzIDogYW55KSB7XHJcbiAgICB0aGlzLmluQWN0aXZlUHJvamVjdENvc3RIZWFkcyA9IGluQWN0aXZlQ29zdEhlYWRzLmRhdGE7XHJcbiAgICB0aGlzLnNob3dQcm9qZWN0Q29zdEhlYWRMaXN0ID0gdHJ1ZTtcclxuICAgIHRoaXMuZ2V0UmVwb3J0RGV0YWlscy5lbWl0KCk7XHJcbiAgfVxyXG5cclxuICBvbkdldEFsbEluQWN0aXZlQ29zdEhlYWRzRmFpbHVyZShlcnJvciA6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgb25DaGFuZ2VBY3RpdmVTZWxlY3RlZENvc3RIZWFkKHNlbGVjdGVkSW5BY3RpdmVDb3N0SGVhZElkOm51bWJlcikge1xyXG4gICAgdGhpcy5zaG93UHJvamVjdENvc3RIZWFkTGlzdCA9IGZhbHNlO1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0YXJ0KCk7XHJcbiAgICB0aGlzLmNvc3RTdW1tYXJ5U2VydmljZS5hY3RpdmF0ZVByb2plY3RDb3N0SGVhZCggdGhpcy5wcm9qZWN0SWQsIHNlbGVjdGVkSW5BY3RpdmVDb3N0SGVhZElkKS5zdWJzY3JpYmUoXHJcbiAgICAgIGluQWN0aXZlQ29zdEhlYWRzID0+IHRoaXMub25BY3RpdmVDb3N0SGVhZFN1Y2Nlc3MoaW5BY3RpdmVDb3N0SGVhZHMpLFxyXG4gICAgICBlcnJvciA9PiB0aGlzLm9uQWN0aXZlQ29zdEhlYWRGYWlsdXJlKGVycm9yKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIG9uQWN0aXZlQ29zdEhlYWRTdWNjZXNzKGluQWN0aXZlQ29zdEhlYWRzIDogYW55KSB7XHJcbiAgICB0aGlzLmdldFJlcG9ydERldGFpbHMuZW1pdCgpO1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0FERF9DT1NUSEVBRDtcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICB9XHJcblxyXG4gIG9uQWN0aXZlQ29zdEhlYWRGYWlsdXJlKGVycm9yIDogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZygnb25BY3RpdmVDb3N0SGVhZEZhaWx1cmUoKScrZXJyb3IpO1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICB9XHJcblxyXG4gIHNldElkc1RvSW5BY3RpdmVDb3N0SGVhZChwcm9qZWN0Q29zdEhlYWRJZCA6IG51bWJlcikge1xyXG4gICAgdGhpcy5jdXJyZW50UHJvamVjdENvc3RIZWFkSWQgPSBwcm9qZWN0Q29zdEhlYWRJZDtcclxuICB9XHJcblxyXG4gIGRlbGV0ZVByb2plY3RDb3N0SGVhZCAoKSB7XHJcbiAgICB0aGlzLnNob3dQcm9qZWN0Q29zdEhlYWRMaXN0ID0gZmFsc2U7XHJcbiAgICBsZXQgcHJvamVjdElkID0gU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfSUQpO1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0YXJ0KCk7XHJcbiAgICB0aGlzLmNvc3RTdW1tYXJ5U2VydmljZS5pbmFjdGl2YXRlUHJvamVjdENvc3RIZWFkKCBwcm9qZWN0SWQsIHRoaXMuY3VycmVudFByb2plY3RDb3N0SGVhZElkKS5zdWJzY3JpYmUoXHJcbiAgICAgIGluQWN0aXZlQ29zdEhlYWRzID0+IHRoaXMub25JbmFjdGl2YXRlQ29zdEhlYWRTdWNjZXNzKGluQWN0aXZlQ29zdEhlYWRzKSxcclxuICAgICAgZXJyb3IgPT4gdGhpcy5vbkluYWN0aXZhdGVDb3N0SGVhZEZhaWx1cmUoZXJyb3IpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgb25JbmFjdGl2YXRlQ29zdEhlYWRTdWNjZXNzKGluQWN0aXZlQ29zdEhlYWRzIDogYW55KSB7XHJcbiAgICB0aGlzLmdldFJlcG9ydERldGFpbHMuZW1pdCgpO1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0RFTEVURV9DT1NUSEVBRDtcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICB9XHJcblxyXG4gIG9uSW5hY3RpdmF0ZUNvc3RIZWFkRmFpbHVyZShlcnJvciA6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coJ29uQWN0aXZlQ29zdEhlYWRGYWlsdXJlKCknK2Vycm9yKTtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdG9wKCk7XHJcbiAgfVxyXG5cclxuICBnZXRIZWFkaW5ncygpIHtcclxuICAgIHJldHVybiBIZWFkaW5ncztcclxuICB9XHJcblxyXG4gIGdldFRhYmxlSGVhZGluZ3MoKSB7XHJcbiAgICByZXR1cm4gVGFibGVIZWFkaW5ncztcclxuICB9XHJcblxyXG4gIGdldExhYmVsKCkge1xyXG4gICAgcmV0dXJuIExhYmVsO1xyXG4gIH1cclxuXHJcbiAgZ2V0QnV0dG9uKCkge1xyXG4gICAgcmV0dXJuIEJ1dHRvbjtcclxuICB9XHJcblxyXG4gIGdldFByb2plY3RFbGVtZW50cygpIHtcclxuICAgIHJldHVybiBQcm9qZWN0RWxlbWVudHM7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuIl19
