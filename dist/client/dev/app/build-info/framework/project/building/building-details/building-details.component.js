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
var building_1 = require("./../../../model/building");
var index_1 = require("../../../../../shared/index");
var index_2 = require("../../../../../shared/index");
var building_service_1 = require("../building.service");
var index_3 = require("../../../../../shared/index");
var BuildingDetailsComponent = (function () {
    function BuildingDetailsComponent(buildingService, activatedRoute, messageService) {
        this.buildingService = buildingService;
        this.activatedRoute = activatedRoute;
        this.messageService = messageService;
        this.buildingModel = new building_1.Building();
        this.isShowErrorMessage = true;
        this.errorMessage = false;
    }
    BuildingDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.params.subscribe(function (params) {
            _this.buildingId = params['buildingId'];
            if (_this.buildingId) {
                _this.getBuilding();
            }
        });
    };
    BuildingDetailsComponent.prototype.getBuilding = function () {
        var _this = this;
        var projectId = index_3.SessionStorageService.getSessionValue(index_3.SessionStorage.CURRENT_PROJECT_ID);
        this.buildingService.getBuilding(projectId, this.buildingId).subscribe(function (building) { return _this.onGetBuildingSuccess(building); }, function (error) { return _this.onGetBuildingFailure(error); });
    };
    BuildingDetailsComponent.prototype.onGetBuildingSuccess = function (building) {
        this.buildingModel = building.data;
    };
    BuildingDetailsComponent.prototype.onGetBuildingFailure = function (error) {
        var message = new index_2.Message();
        if (error.err_code === 404 || error.err_code === 0) {
            message.error_msg = error.err_msg;
            message.isError = true;
            this.messageService.message(message);
        }
        else {
            this.isShowErrorMessage = false;
            this.errorMessage = error.err_msg;
            message.error_msg = error.err_msg;
            message.isError = true;
            this.messageService.message(message);
        }
    };
    BuildingDetailsComponent.prototype.updateBuilding = function (buildingModel) {
        var _this = this;
        var projectId = index_3.SessionStorageService.getSessionValue(index_3.SessionStorage.CURRENT_PROJECT_ID);
        var buildingId = index_3.SessionStorageService.getSessionValue(index_3.SessionStorage.CURRENT_BUILDING);
        this.buildingService.updateBuilding(projectId, buildingId, buildingModel)
            .subscribe(function (building) { return _this.updateBuildingSuccess(building); }, function (error) { return _this.updateBuildingFailure(error); });
    };
    BuildingDetailsComponent.prototype.updateBuildingSuccess = function (result) {
        if (result !== null) {
            var message = new index_2.Message();
            message.isError = false;
            message.custom_message = constants_1.Messages.MSG_SUCCESS_UPDATE_BUILDING_DETAILS;
            this.messageService.message(message);
        }
    };
    BuildingDetailsComponent.prototype.updateBuildingFailure = function (error) {
        var message = new index_2.Message();
        if (error.err_code === 404 || error.err_code === 0) {
            message.error_msg = error.err_msg;
            message.isError = true;
            this.messageService.message(message);
        }
        else {
            this.isShowErrorMessage = false;
            this.errorMessage = error.err_msg;
            message.error_msg = error.err_msg;
            message.isError = true;
            this.messageService.message(message);
        }
    };
    BuildingDetailsComponent.prototype.getHeadings = function () {
        return constants_1.Headings;
    };
    BuildingDetailsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-building-details',
            templateUrl: 'building-details.component.html',
            styleUrls: ['building-details.component.css']
        }),
        __metadata("design:paramtypes", [building_service_1.BuildingService,
            router_1.ActivatedRoute, index_1.MessageService])
    ], BuildingDetailsComponent);
    return BuildingDetailsComponent;
}());
exports.BuildingDetailsComponent = BuildingDetailsComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2J1aWxkaW5nL2J1aWxkaW5nLWRldGFpbHMvYnVpbGRpbmctZGV0YWlscy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBa0Q7QUFDbEQsMENBQWlEO0FBQ2pELDZEQUFxRTtBQUNyRSxzREFBcUQ7QUFDckQscURBQTZEO0FBQzdELHFEQUFzRDtBQUN0RCx3REFBc0Q7QUFDdEQscURBQW9GO0FBU3BGO0lBT0Usa0NBQW9CLGVBQWdDLEVBQ2hDLGNBQTZCLEVBQVUsY0FBOEI7UUFEckUsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBTHpGLGtCQUFhLEdBQWEsSUFBSSxtQkFBUSxFQUFFLENBQUM7UUFDbEMsdUJBQWtCLEdBQVksSUFBSSxDQUFDO1FBQ25DLGlCQUFZLEdBQVksS0FBSyxDQUFDO0lBSXJDLENBQUM7SUFFRCwyQ0FBUSxHQUFSO1FBQUEsaUJBT0M7UUFOQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBQSxNQUFNO1lBQ3pDLEtBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3ZDLEVBQUUsQ0FBQSxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixLQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDckIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELDhDQUFXLEdBQVg7UUFBQSxpQkFNQztRQUxDLElBQUksU0FBUyxHQUFDLDZCQUFxQixDQUFDLGVBQWUsQ0FBQyxzQkFBYyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDdkYsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFDLElBQUksQ0FBQyxVQUFV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QUFPLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztZQUNsQyxPQUFPLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7WUFDbEMsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDdkIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkMsQ0FBQztJQUNILENBQUM7SUFFRCw4Q0FBVyxHQUFYO1FBQ0UsTUFBTSxDQUFDLG9CQUFRLENBQUM7SUFDbEIsQ0FBQztJQXZGVSx3QkFBd0I7UUFQcEMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUscUJBQXFCO1lBQy9CLFdBQVcsRUFBRSxpQ0FBaUM7WUFDOUMsU0FBUyxFQUFFLENBQUMsZ0NBQWdDLENBQUM7U0FDOUMsQ0FBQzt5Q0FTcUMsa0NBQWU7WUFDakIsdUJBQWMsRUFBMEIsc0JBQWM7T0FSOUUsd0JBQXdCLENBd0ZwQztJQUFELCtCQUFDO0NBeEZELEFBd0ZDLElBQUE7QUF4RlksNERBQXdCIiwiZmlsZSI6ImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2J1aWxkaW5nL2J1aWxkaW5nLWRldGFpbHMvYnVpbGRpbmctZGV0YWlscy5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IE1lc3NhZ2VzLCBIZWFkaW5ncyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBCdWlsZGluZyB9IGZyb20gJy4vLi4vLi4vLi4vbW9kZWwvYnVpbGRpbmcnO1xyXG5pbXBvcnQgeyBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zaGFyZWQvaW5kZXgnO1xyXG5pbXBvcnQgeyBCdWlsZGluZ1NlcnZpY2UgfSBmcm9tICcuLi9idWlsZGluZy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU2Vzc2lvblN0b3JhZ2UsIFNlc3Npb25TdG9yYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAnYmktYnVpbGRpbmctZGV0YWlscycsXHJcbiAgdGVtcGxhdGVVcmw6ICdidWlsZGluZy1kZXRhaWxzLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnYnVpbGRpbmctZGV0YWlscy5jb21wb25lbnQuY3NzJ11cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBCdWlsZGluZ0RldGFpbHNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICBidWlsZGluZ0lkIDogc3RyaW5nO1xyXG4gIGJ1aWxkaW5nTW9kZWw6IEJ1aWxkaW5nID0gbmV3IEJ1aWxkaW5nKCk7XHJcbiAgcHVibGljIGlzU2hvd0Vycm9yTWVzc2FnZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgcHVibGljIGVycm9yTWVzc2FnZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGJ1aWxkaW5nU2VydmljZTogQnVpbGRpbmdTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgYWN0aXZhdGVkUm91dGU6QWN0aXZhdGVkUm91dGUsIHByaXZhdGUgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuYWN0aXZhdGVkUm91dGUucGFyYW1zLnN1YnNjcmliZShwYXJhbXMgPT4ge1xyXG4gICAgICB0aGlzLmJ1aWxkaW5nSWQgPSBwYXJhbXNbJ2J1aWxkaW5nSWQnXTtcclxuICAgICAgaWYodGhpcy5idWlsZGluZ0lkKSB7XHJcbiAgICAgICAgdGhpcy5nZXRCdWlsZGluZygpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEJ1aWxkaW5nKCkge1xyXG4gICAgbGV0IHByb2plY3RJZD1TZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfUFJPSkVDVF9JRCk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nU2VydmljZS5nZXRCdWlsZGluZyhwcm9qZWN0SWQsdGhpcy5idWlsZGluZ0lkKS5zdWJzY3JpYmUoXHJcbiAgICAgIGJ1aWxkaW5nID0+IHRoaXMub25HZXRCdWlsZGluZ1N1Y2Nlc3MoYnVpbGRpbmcpLFxyXG4gICAgICBlcnJvciA9PiB0aGlzLm9uR2V0QnVpbGRpbmdGYWlsdXJlKGVycm9yKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIG9uR2V0QnVpbGRpbmdTdWNjZXNzKGJ1aWxkaW5nIDogYW55KSB7XHJcbiAgICB0aGlzLmJ1aWxkaW5nTW9kZWwgPSBidWlsZGluZy5kYXRhO1xyXG4gIH1cclxuXHJcbiAgb25HZXRCdWlsZGluZ0ZhaWx1cmUoZXJyb3IgOiBhbnkpIHtcclxuICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuXHJcbiAgICBpZiAoZXJyb3IuZXJyX2NvZGUgPT09IDQwNCB8fCBlcnJvci5lcnJfY29kZSA9PT0gMCkge1xyXG4gICAgICBtZXNzYWdlLmVycm9yX21zZyA9IGVycm9yLmVycl9tc2c7XHJcbiAgICAgIG1lc3NhZ2UuaXNFcnJvciA9IHRydWU7XHJcbiAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuaXNTaG93RXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gZXJyb3IuZXJyX21zZztcclxuICAgICAgbWVzc2FnZS5lcnJvcl9tc2cgPSBlcnJvci5lcnJfbXNnO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSB0cnVlO1xyXG4gICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgdXBkYXRlQnVpbGRpbmcoYnVpbGRpbmdNb2RlbCA6IEJ1aWxkaW5nKSB7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQ9U2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfSUQpO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZD1TZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfQlVJTERJTkcpO1xyXG4gICAgICB0aGlzLmJ1aWxkaW5nU2VydmljZS51cGRhdGVCdWlsZGluZyggcHJvamVjdElkLCBidWlsZGluZ0lkLCBidWlsZGluZ01vZGVsKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgICBidWlsZGluZyA9PiB0aGlzLnVwZGF0ZUJ1aWxkaW5nU3VjY2VzcyhidWlsZGluZyksXHJcbiAgICAgICAgICBlcnJvciA9PiB0aGlzLnVwZGF0ZUJ1aWxkaW5nRmFpbHVyZShlcnJvcikpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlQnVpbGRpbmdTdWNjZXNzKHJlc3VsdDogYW55KSB7XHJcblxyXG4gICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xyXG4gICAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfVVBEQVRFX0JVSUxESU5HX0RFVEFJTFM7XHJcbiAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZUJ1aWxkaW5nRmFpbHVyZShlcnJvcjogYW55KSB7XHJcblxyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG5cclxuICAgIGlmIChlcnJvci5lcnJfY29kZSA9PT0gNDA0IHx8IGVycm9yLmVycl9jb2RlID09PSAwKSB7XHJcbiAgICAgIG1lc3NhZ2UuZXJyb3JfbXNnID0gZXJyb3IuZXJyX21zZztcclxuICAgICAgbWVzc2FnZS5pc0Vycm9yID0gdHJ1ZTtcclxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5pc1Nob3dFcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxuICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBlcnJvci5lcnJfbXNnO1xyXG4gICAgICBtZXNzYWdlLmVycm9yX21zZyA9IGVycm9yLmVycl9tc2c7XHJcbiAgICAgIG1lc3NhZ2UuaXNFcnJvciA9IHRydWU7XHJcbiAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldEhlYWRpbmdzKCkge1xyXG4gICAgcmV0dXJuIEhlYWRpbmdzO1xyXG4gIH1cclxufVxyXG4iXX0=
