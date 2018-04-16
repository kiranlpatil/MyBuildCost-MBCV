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
var building_service_1 = require("./../building.service");
var loaders_service_1 = require("../../../../../shared/loader/loaders.service");
var CreateBuildingComponent = (function () {
    function CreateBuildingComponent(buildingService, loaderService, _router, messageService) {
        this.buildingService = buildingService;
        this.loaderService = loaderService;
        this._router = _router;
        this.messageService = messageService;
        this.BODY_BACKGROUND_TRANSPARENT = constants_1.ImagePath.BODY_BACKGROUND_TRANSPARENT;
    }
    CreateBuildingComponent.prototype.ngOnInit = function () {
        this.isUserSignIn = parseFloat(index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.IS_USER_SIGN_IN));
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CURRENT_VIEW, 'createBuilding');
    };
    CreateBuildingComponent.prototype.goBack = function () {
        var projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
        this._router.navigate([constants_1.NavigationRoutes.APP_PROJECT, projectId, constants_1.NavigationRoutes.APP_COST_SUMMARY]);
    };
    CreateBuildingComponent.prototype.onSubmit = function (buildingModel) {
        var _this = this;
        if (this.checkNumberOfFloors(buildingModel.totalNumOfFloors, buildingModel.numOfParkingFloors)) {
            if (this.checkApartmentConfiguration(buildingModel)) {
                this.loaderService.start();
                var projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
                this.buildingService.createBuilding(projectId, buildingModel)
                    .subscribe(function (building) { return _this.onCreateBuildingSuccess(building); }, function (error) { return _this.onCreateBuildingFailure(error); });
            }
            else {
                var message = new index_1.Message();
                message.isError = false;
                message.custom_message = constants_1.Messages.MSG_ERROR_VALIDATION_ADD_AT_LEAST_ONE_APARTMENT_CONFIGURATION;
                this.messageService.message(message);
            }
        }
        else {
            message = new index_1.Message();
            message.isError = false;
            message.custom_message = constants_1.Messages.MSG_ERROR_VALIDATION_NUMBER_OF_FLOORS;
            this.messageService.message(message);
        }
    };
    CreateBuildingComponent.prototype.checkNumberOfFloors = function (totalNumOfFloors, numOfParkingFloors) {
        if (totalNumOfFloors > numOfParkingFloors) {
            return true;
        }
        else {
            return false;
        }
    };
    CreateBuildingComponent.prototype.checkApartmentConfiguration = function (buildingModel) {
        if ((buildingModel.numOfOneBHK !== 0 && buildingModel.numOfOneBHK !== null) ||
            (buildingModel.numOfTwoBHK !== 0 && buildingModel.numOfTwoBHK !== null) ||
            (buildingModel.numOfThreeBHK !== 0 && buildingModel.numOfThreeBHK !== null) ||
            (buildingModel.numOfFourBHK !== 0 && buildingModel.numOfFourBHK !== null) ||
            (buildingModel.numOfFiveBHK !== 0 && buildingModel.numOfFiveBHK !== null)) {
            return true;
        }
        else {
            return false;
        }
    };
    CreateBuildingComponent.prototype.onCreateBuildingSuccess = function (building) {
        var _this = this;
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = constants_1.Messages.MSG_SUCCESS_ADD_BUILDING_PROJECT;
        this.messageService.message(message);
        var projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
        this.buildingService.syncBuildingWithRateAnalysis(projectId, building.data._id).subscribe(function (building) { return _this.onSyncBuildingWithRateAnalysisSuccess(building); }, function (error) { return _this.onSyncBuildingWithRateAnalysisFailure(error); });
    };
    CreateBuildingComponent.prototype.onSyncBuildingWithRateAnalysisSuccess = function (building) {
        var projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
        this.loaderService.stop();
        this._router.navigate([constants_1.NavigationRoutes.APP_PROJECT, projectId, constants_1.NavigationRoutes.APP_COST_SUMMARY]);
    };
    CreateBuildingComponent.prototype.onSyncBuildingWithRateAnalysisFailure = function (error) {
        console.log(error);
        this.loaderService.stop();
    };
    CreateBuildingComponent.prototype.onCreateBuildingFailure = function (error) {
        console.log(error);
        this.loaderService.stop();
    };
    CreateBuildingComponent.prototype.getHeadings = function () {
        return constants_1.Headings;
    };
    CreateBuildingComponent.prototype.getButton = function () {
        return constants_1.Button;
    };
    CreateBuildingComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-create-building',
            templateUrl: 'create-building.component.html',
            styleUrls: ['create-building.component.css'],
        }),
        __metadata("design:paramtypes", [building_service_1.BuildingService, loaders_service_1.LoaderService,
            router_1.Router, index_1.MessageService])
    ], CreateBuildingComponent);
    return CreateBuildingComponent;
}());
exports.CreateBuildingComponent = CreateBuildingComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2J1aWxkaW5nL2NyZWF0ZS1idWlsZGluZy9jcmVhdGUtYnVpbGRpbmcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQWtEO0FBQ2xELDBDQUF5QztBQUN6Qyw2REFBMEc7QUFDMUcscURBQ3NEO0FBRXRELDBEQUF3RDtBQUN4RCxnRkFBNkU7QUFTN0U7SUFLRSxpQ0FBb0IsZUFBZ0MsRUFBVSxhQUE0QixFQUN0RSxPQUFlLEVBQVUsY0FBOEI7UUFEdkQsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDdEUsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUN6RSxJQUFJLENBQUMsMkJBQTJCLEdBQUcscUJBQVMsQ0FBQywyQkFBMkIsQ0FBQztJQUMzRSxDQUFDO0lBQ0QsMENBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLDZCQUFxQixDQUFDLGVBQWUsQ0FBQyxzQkFBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFDdEcsNkJBQXFCLENBQUMsZUFBZSxDQUFDLHNCQUFjLENBQUMsWUFBWSxFQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDdEYsQ0FBQztJQUNELHdDQUFNLEdBQU47UUFDRSxJQUFJLFNBQVMsR0FBRyw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3pGLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsNEJBQWdCLENBQUMsV0FBVyxFQUFDLFNBQVMsRUFBQyw0QkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7SUFDcEcsQ0FBQztJQUVELDBDQUFRLEdBQVIsVUFBUyxhQUF3QjtRQUFqQyxpQkF1QkM7UUF0QkMsRUFBRSxDQUFBLENBQUMsSUFB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QUFNLENBQUMsb0JBQVEsQ0FBQztJQUNsQixDQUFDO0lBRUQsMkNBQVMsR0FBVDtRQUNFLE1BQU0sQ0FBQyxrQkFBTSxDQUFDO0lBQ2hCLENBQUM7SUFqR1UsdUJBQXVCO1FBUG5DLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLG9CQUFvQjtZQUM5QixXQUFXLEVBQUUsZ0NBQWdDO1lBQzdDLFNBQVMsRUFBRSxDQUFDLCtCQUErQixDQUFDO1NBQzdDLENBQUM7eUNBT3FDLGtDQUFlLEVBQXlCLCtCQUFhO1lBQzdELGVBQU0sRUFBMEIsc0JBQWM7T0FOaEUsdUJBQXVCLENBa0duQztJQUFELDhCQUFDO0NBbEdELEFBa0dDLElBQUE7QUFsR1ksMERBQXVCIiwiZmlsZSI6ImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2J1aWxkaW5nL2NyZWF0ZS1idWlsZGluZy9jcmVhdGUtYnVpbGRpbmcuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgTWVzc2FnZXMsIE5hdmlnYXRpb25Sb3V0ZXMsIEltYWdlUGF0aCwgSGVhZGluZ3MsIEJ1dHRvbiB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBTZXNzaW9uU3RvcmFnZSwgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLCAgTWVzc2FnZSxcclxuICBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IEJ1aWxkaW5nIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWwvYnVpbGRpbmcnO1xyXG5pbXBvcnQgeyBCdWlsZGluZ1NlcnZpY2UgfSBmcm9tICcuLy4uL2J1aWxkaW5nLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2hhcmVkL2xvYWRlci9sb2FkZXJzLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICBzZWxlY3RvcjogJ2JpLWNyZWF0ZS1idWlsZGluZycsXHJcbiAgdGVtcGxhdGVVcmw6ICdjcmVhdGUtYnVpbGRpbmcuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydjcmVhdGUtYnVpbGRpbmcuY29tcG9uZW50LmNzcyddLFxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIENyZWF0ZUJ1aWxkaW5nQ29tcG9uZW50ICBpbXBsZW1lbnRzICBPbkluaXQge1xyXG5cclxuICBCT0RZX0JBQ0tHUk9VTkRfVFJBTlNQQVJFTlQ6IHN0cmluZztcclxuICBwdWJsaWMgaXNVc2VyU2lnbkluOm51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBidWlsZGluZ1NlcnZpY2U6IEJ1aWxkaW5nU2VydmljZSwgcHJpdmF0ZSBsb2FkZXJTZXJ2aWNlOiBMb2FkZXJTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgX3JvdXRlcjogUm91dGVyLCBwcml2YXRlIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSkge1xyXG4gICAgdGhpcy5CT0RZX0JBQ0tHUk9VTkRfVFJBTlNQQVJFTlQgPSBJbWFnZVBhdGguQk9EWV9CQUNLR1JPVU5EX1RSQU5TUEFSRU5UO1xyXG4gIH1cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuaXNVc2VyU2lnbkluID0gcGFyc2VGbG9hdChTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLklTX1VTRVJfU0lHTl9JTikpO1xyXG4gICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1ZJRVcsJ2NyZWF0ZUJ1aWxkaW5nJyk7XHJcbiAgfVxyXG4gIGdvQmFjaygpIHtcclxuICAgIGxldCBwcm9qZWN0SWQgPSBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfUFJPSkVDVF9JRCk7XHJcbiAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW05hdmlnYXRpb25Sb3V0ZXMuQVBQX1BST0pFQ1QscHJvamVjdElkLE5hdmlnYXRpb25Sb3V0ZXMuQVBQX0NPU1RfU1VNTUFSWV0pO1xyXG4gIH1cclxuXHJcbiAgb25TdWJtaXQoYnVpbGRpbmdNb2RlbCA6IEJ1aWxkaW5nKSB7XHJcbiAgICBpZih0aGlzLmNoZWNrTnVtYmVyT2ZGbG9vcnMoYnVpbGRpbmdNb2RlbC50b3RhbE51bU9mRmxvb3JzLCBidWlsZGluZ01vZGVsLm51bU9mUGFya2luZ0Zsb29ycykpIHtcclxuXHJcbiAgICAgIGlmKHRoaXMuY2hlY2tBcGFydG1lbnRDb25maWd1cmF0aW9uKGJ1aWxkaW5nTW9kZWwpKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0YXJ0KCk7XHJcbiAgICAgICAgbGV0IHByb2plY3RJZCA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuICAgICAgICB0aGlzLmJ1aWxkaW5nU2VydmljZS5jcmVhdGVCdWlsZGluZyhwcm9qZWN0SWQsIGJ1aWxkaW5nTW9kZWwpXHJcbiAgICAgICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgICBidWlsZGluZyA9PiB0aGlzLm9uQ3JlYXRlQnVpbGRpbmdTdWNjZXNzKGJ1aWxkaW5nKSxcclxuICAgICAgICAgICAgZXJyb3IgPT4gdGhpcy5vbkNyZWF0ZUJ1aWxkaW5nRmFpbHVyZShlcnJvcikpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgICAgICAgbWVzc2FnZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICAgICAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fQUREX0FUX0xFQVNUX09ORV9BUEFSVE1FTlRfQ09ORklHVVJBVElPTjtcclxuICAgICAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgICAgfVxyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19FUlJPUl9WQUxJREFUSU9OX05VTUJFUl9PRl9GTE9PUlM7XHJcbiAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNoZWNrTnVtYmVyT2ZGbG9vcnModG90YWxOdW1PZkZsb29ycyA6IG51bWJlciwgbnVtT2ZQYXJraW5nRmxvb3JzIDogbnVtYmVyKSB7XHJcbiAgICBpZih0b3RhbE51bU9mRmxvb3JzID4gbnVtT2ZQYXJraW5nRmxvb3JzKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2hlY2tBcGFydG1lbnRDb25maWd1cmF0aW9uKGJ1aWxkaW5nTW9kZWwgOiBCdWlsZGluZykge1xyXG4gICAgaWYoKGJ1aWxkaW5nTW9kZWwubnVtT2ZPbmVCSEsgIT09IDAgJiYgYnVpbGRpbmdNb2RlbC5udW1PZk9uZUJISyAhPT0gbnVsbCkgfHxcclxuICAgICAgKGJ1aWxkaW5nTW9kZWwubnVtT2ZUd29CSEsgICE9PSAwICYmIGJ1aWxkaW5nTW9kZWwubnVtT2ZUd29CSEsgIT09IG51bGwpIHx8XHJcbiAgICAgIChidWlsZGluZ01vZGVsLm51bU9mVGhyZWVCSEsgIT09IDAgJiYgYnVpbGRpbmdNb2RlbC5udW1PZlRocmVlQkhLICE9PSBudWxsKSB8fFxyXG4gICAgICAoYnVpbGRpbmdNb2RlbC5udW1PZkZvdXJCSEsgIT09IDAgJiYgYnVpbGRpbmdNb2RlbC5udW1PZkZvdXJCSEsgIT09IG51bGwpIHx8XHJcbiAgICAgIChidWlsZGluZ01vZGVsLm51bU9mRml2ZUJISyAhPT0gMCAmJiBidWlsZGluZ01vZGVsLm51bU9mRml2ZUJISyAhPT0gbnVsbCkpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkNyZWF0ZUJ1aWxkaW5nU3VjY2VzcyhidWlsZGluZyA6IGFueSkge1xyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgbWVzc2FnZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfQUREX0JVSUxESU5HX1BST0pFQ1Q7XHJcbiAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICBsZXQgcHJvamVjdElkID0gU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfSUQpO1xyXG5cclxuICAgIHRoaXMuYnVpbGRpbmdTZXJ2aWNlLnN5bmNCdWlsZGluZ1dpdGhSYXRlQW5hbHlzaXMocHJvamVjdElkLCBidWlsZGluZy5kYXRhLl9pZCkuc3Vic2NyaWJlKFxyXG4gICAgICBidWlsZGluZyA9PiB0aGlzLm9uU3luY0J1aWxkaW5nV2l0aFJhdGVBbmFseXNpc1N1Y2Nlc3MoYnVpbGRpbmcpLFxyXG4gICAgICBlcnJvciA9PiB0aGlzLm9uU3luY0J1aWxkaW5nV2l0aFJhdGVBbmFseXNpc0ZhaWx1cmUoZXJyb3IpKTtcclxuICB9XHJcblxyXG4gIG9uU3luY0J1aWxkaW5nV2l0aFJhdGVBbmFseXNpc1N1Y2Nlc3MoYnVpbGRpbmcgOiBCdWlsZGluZykge1xyXG4gICAgbGV0IHByb2plY3RJZCA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdG9wKCk7XHJcbiAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW05hdmlnYXRpb25Sb3V0ZXMuQVBQX1BST0pFQ1QsIHByb2plY3RJZCwgTmF2aWdhdGlvblJvdXRlcy5BUFBfQ09TVF9TVU1NQVJZXSk7XHJcbiAgfVxyXG5cclxuICBvblN5bmNCdWlsZGluZ1dpdGhSYXRlQW5hbHlzaXNGYWlsdXJlKGVycm9yOmFueSkge1xyXG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICB9XHJcblxyXG4gIG9uQ3JlYXRlQnVpbGRpbmdGYWlsdXJlKGVycm9yIDogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0SGVhZGluZ3MoKSB7XHJcbiAgICByZXR1cm4gSGVhZGluZ3M7XHJcbiAgfVxyXG5cclxuICBnZXRCdXR0b24oKSB7XHJcbiAgICByZXR1cm4gQnV0dG9uO1xyXG4gIH1cclxufVxyXG4iXX0=
