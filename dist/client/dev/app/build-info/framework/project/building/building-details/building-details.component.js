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
    function BuildingDetailsComponent(buildingService, _router, activatedRoute, messageService) {
        this.buildingService = buildingService;
        this._router = _router;
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
    BuildingDetailsComponent.prototype.goBack = function () {
        var projectId = index_3.SessionStorageService.getSessionValue(index_3.SessionStorage.CURRENT_PROJECT_ID);
        this._router.navigate([constants_1.NavigationRoutes.APP_PROJECT, projectId, constants_1.NavigationRoutes.APP_COST_SUMMARY]);
    };
    BuildingDetailsComponent.prototype.getButton = function () {
        return constants_1.Button;
    };
    BuildingDetailsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-building-details',
            templateUrl: 'building-details.component.html',
            styleUrls: ['building-details.component.css']
        }),
        __metadata("design:paramtypes", [building_service_1.BuildingService, router_1.Router,
            router_1.ActivatedRoute, index_1.MessageService])
    ], BuildingDetailsComponent);
    return BuildingDetailsComponent;
}());
exports.BuildingDetailsComponent = BuildingDetailsComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2J1aWxkaW5nL2J1aWxkaW5nLWRldGFpbHMvYnVpbGRpbmctZGV0YWlscy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBa0Q7QUFDbEQsMENBQXlEO0FBQ3pELDZEQUE2RjtBQUM3RixzREFBcUQ7QUFDckQscURBQTZEO0FBQzdELHFEQUFzRDtBQUN0RCx3REFBc0Q7QUFDdEQscURBQW9GO0FBU3BGO0lBT0Usa0NBQW9CLGVBQWdDLEVBQVUsT0FBZSxFQUN6RCxjQUE2QixFQUFVLGNBQThCO1FBRHJFLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDekQsbUJBQWMsR0FBZCxjQUFjLENBQWU7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFMekYsa0JBQWEsR0FBYSxJQUFJLG1CQUFRLEVBQUUsQ0FBQztRQUNsQyx1QkFBa0IsR0FBWSxJQUFJLENBQUM7UUFDbkMsaUJBQVksR0FBWSxLQUFLLENBQUM7SUFJckMsQ0FBQztJQUVELDJDQUFRLEdBQVI7UUFBQSxpQkFPQztRQU5DLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFBLE1BQU07WUFDekMsS0FBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDdkMsRUFBRSxDQUFBLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNyQixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsOENBQVcsR0FBWDtRQUFBLGlCQU1DO1FBTEMsSUFBSSxTQUFTLEdBQUMsNkJBQXFCLENBQUMsZUFBZSxDQUFDLHNCQUFjLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUN2RixJQUFJLENBQUMsZUFBZSxDQUFD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dWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2J1aWxkaW5nL2J1aWxkaW5nLWRldGFpbHMvYnVpbGRpbmctZGV0YWlscy5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHtNZXNzYWdlcywgSGVhZGluZ3MsIE5hdmlnYXRpb25Sb3V0ZXMsIEJ1dHRvbn0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IEJ1aWxkaW5nIH0gZnJvbSAnLi8uLi8uLi8uLi9tb2RlbC9idWlsZGluZyc7XHJcbmltcG9ydCB7IE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2hhcmVkL2luZGV4JztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IEJ1aWxkaW5nU2VydmljZSB9IGZyb20gJy4uL2J1aWxkaW5nLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTZXNzaW9uU3RvcmFnZSwgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2hhcmVkL2luZGV4JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICdiaS1idWlsZGluZy1kZXRhaWxzJyxcclxuICB0ZW1wbGF0ZVVybDogJ2J1aWxkaW5nLWRldGFpbHMuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydidWlsZGluZy1kZXRhaWxzLmNvbXBvbmVudC5jc3MnXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIEJ1aWxkaW5nRGV0YWlsc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIGJ1aWxkaW5nSWQgOiBzdHJpbmc7XHJcbiAgYnVpbGRpbmdNb2RlbDogQnVpbGRpbmcgPSBuZXcgQnVpbGRpbmcoKTtcclxuICBwdWJsaWMgaXNTaG93RXJyb3JNZXNzYWdlOiBib29sZWFuID0gdHJ1ZTtcclxuICBwdWJsaWMgZXJyb3JNZXNzYWdlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYnVpbGRpbmdTZXJ2aWNlOiBCdWlsZGluZ1NlcnZpY2UsIHByaXZhdGUgX3JvdXRlcjogUm91dGVyLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgYWN0aXZhdGVkUm91dGU6QWN0aXZhdGVkUm91dGUsIHByaXZhdGUgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuYWN0aXZhdGVkUm91dGUucGFyYW1zLnN1YnNjcmliZShwYXJhbXMgPT4ge1xyXG4gICAgICB0aGlzLmJ1aWxkaW5nSWQgPSBwYXJhbXNbJ2J1aWxkaW5nSWQnXTtcclxuICAgICAgaWYodGhpcy5idWlsZGluZ0lkKSB7XHJcbiAgICAgICAgdGhpcy5nZXRCdWlsZGluZygpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEJ1aWxkaW5nKCkge1xyXG4gICAgbGV0IHByb2plY3RJZD1TZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfUFJPSkVDVF9JRCk7XHJcbiAgICB0aGlzLmJ1aWxkaW5nU2VydmljZS5nZXRCdWlsZGluZyhwcm9qZWN0SWQsdGhpcy5idWlsZGluZ0lkKS5zdWJzY3JpYmUoXHJcbiAgICAgIGJ1aWxkaW5nID0+IHRoaXMub25HZXRCdWlsZGluZ1N1Y2Nlc3MoYnVpbGRpbmcpLFxyXG4gICAgICBlcnJvciA9PiB0aGlzLm9uR2V0QnVpbGRpbmdGYWlsdXJlKGVycm9yKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIG9uR2V0QnVpbGRpbmdTdWNjZXNzKGJ1aWxkaW5nIDogYW55KSB7XHJcbiAgICB0aGlzLmJ1aWxkaW5nTW9kZWwgPSBidWlsZGluZy5kYXRhO1xyXG4gIH1cclxuXHJcbiAgb25HZXRCdWlsZGluZ0ZhaWx1cmUoZXJyb3IgOiBhbnkpIHtcclxuICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuXHJcbiAgICBpZiAoZXJyb3IuZXJyX2NvZGUgPT09IDQwNCB8fCBlcnJvci5lcnJfY29kZSA9PT0gMCkge1xyXG4gICAgICBtZXNzYWdlLmVycm9yX21zZyA9IGVycm9yLmVycl9tc2c7XHJcbiAgICAgIG1lc3NhZ2UuaXNFcnJvciA9IHRydWU7XHJcbiAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuaXNTaG93RXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gZXJyb3IuZXJyX21zZztcclxuICAgICAgbWVzc2FnZS5lcnJvcl9tc2cgPSBlcnJvci5lcnJfbXNnO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSB0cnVlO1xyXG4gICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgdXBkYXRlQnVpbGRpbmcoYnVpbGRpbmdNb2RlbCA6IEJ1aWxkaW5nKSB7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQ9U2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfSUQpO1xyXG4gICAgICBsZXQgYnVpbGRpbmdJZD1TZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfQlVJTERJTkcpO1xyXG4gICAgICB0aGlzLmJ1aWxkaW5nU2VydmljZS51cGRhdGVCdWlsZGluZyggcHJvamVjdElkLCBidWlsZGluZ0lkLCBidWlsZGluZ01vZGVsKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgICBidWlsZGluZyA9PiB0aGlzLnVwZGF0ZUJ1aWxkaW5nU3VjY2VzcyhidWlsZGluZyksXHJcbiAgICAgICAgICBlcnJvciA9PiB0aGlzLnVwZGF0ZUJ1aWxkaW5nRmFpbHVyZShlcnJvcikpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlQnVpbGRpbmdTdWNjZXNzKHJlc3VsdDogYW55KSB7XHJcblxyXG4gICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xyXG4gICAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfVVBEQVRFX0JVSUxESU5HX0RFVEFJTFM7XHJcbiAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZUJ1aWxkaW5nRmFpbHVyZShlcnJvcjogYW55KSB7XHJcblxyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG5cclxuICAgIGlmIChlcnJvci5lcnJfY29kZSA9PT0gNDA0IHx8IGVycm9yLmVycl9jb2RlID09PSAwKSB7XHJcbiAgICAgIG1lc3NhZ2UuZXJyb3JfbXNnID0gZXJyb3IuZXJyX21zZztcclxuICAgICAgbWVzc2FnZS5pc0Vycm9yID0gdHJ1ZTtcclxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5pc1Nob3dFcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxuICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBlcnJvci5lcnJfbXNnO1xyXG4gICAgICBtZXNzYWdlLmVycm9yX21zZyA9IGVycm9yLmVycl9tc2c7XHJcbiAgICAgIG1lc3NhZ2UuaXNFcnJvciA9IHRydWU7XHJcbiAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldEhlYWRpbmdzKCkge1xyXG4gICAgcmV0dXJuIEhlYWRpbmdzO1xyXG4gIH1cclxuXHJcbiAgZ29CYWNrKCkge1xyXG4gICAgbGV0IHByb2plY3RJZCA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbTmF2aWdhdGlvblJvdXRlcy5BUFBfUFJPSkVDVCxwcm9qZWN0SWQsTmF2aWdhdGlvblJvdXRlcy5BUFBfQ09TVF9TVU1NQVJZXSk7XHJcbiAgfVxyXG5cclxuICBnZXRCdXR0b24oKSB7XHJcbiAgICByZXR1cm4gQnV0dG9uO1xyXG4gIH1cclxufVxyXG4iXX0=
