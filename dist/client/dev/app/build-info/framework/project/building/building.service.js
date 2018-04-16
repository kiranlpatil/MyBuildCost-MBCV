"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var index_1 = require("../../../../shared/index");
var http_delegate_service_1 = require("../../../../shared/services/http-delegate.service");
var BuildingService = (function (_super) {
    __extends(BuildingService, _super);
    function BuildingService(messageService, httpDelegateService) {
        var _this = _super.call(this) || this;
        _this.messageService = messageService;
        _this.httpDelegateService = httpDelegateService;
        return _this;
    }
    BuildingService.prototype.createBuilding = function (projectId, building) {
        var url = index_1.API.PROJECT + '/' + projectId + '/' + index_1.API.BUILDING;
        return this.httpDelegateService.postAPI(url, building);
    };
    BuildingService.prototype.getBuilding = function (projectId, buildingId) {
        var url = index_1.API.PROJECT + '/' + projectId + '/' + index_1.API.BUILDING + '/' + buildingId;
        return this.httpDelegateService.getAPI(url);
    };
    BuildingService.prototype.updateBuilding = function (projectId, buildingId, building) {
        var url = index_1.API.PROJECT + '/' + projectId + '/' + index_1.API.BUILDING + '/' + buildingId;
        return this.httpDelegateService.putAPI(url, building);
    };
    BuildingService.prototype.deleteBuilding = function (projectId, buildingId) {
        var url = index_1.API.PROJECT + '/' + projectId + '/' + index_1.API.BUILDING + '/' + buildingId;
        return this.httpDelegateService.deleteAPI(url);
    };
    BuildingService.prototype.getBuildingDetailsForClone = function (projectId, buildingId) {
        var url = index_1.API.PROJECT + '/' + projectId + '/' + index_1.API.BUILDING + '/' + buildingId + '/' + index_1.API.CLONE;
        return this.httpDelegateService.getAPI(url);
    };
    BuildingService.prototype.cloneBuildingCostHeads = function (projectId, clonedBuildingId, cloneCostHead) {
        var updateData = { 'costHead': cloneCostHead };
        var url = index_1.API.PROJECT + '/' + projectId + '/' + index_1.API.BUILDING + '/' + clonedBuildingId + '/' + index_1.API.CLONE;
        return this.httpDelegateService.putAPI(url, updateData);
    };
    BuildingService.prototype.syncBuildingWithRateAnalysis = function (projectId, buildingId) {
        var url = index_1.API.PROJECT + '/' + projectId + '/' + index_1.API.BUILDING + '/' + buildingId + '/' + index_1.API.SYNC_RATE_ANALYSIS;
        return this.httpDelegateService.getAPI(url);
    };
    BuildingService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [index_1.MessageService, http_delegate_service_1.HttpDelegateService])
    ], BuildingService);
    return BuildingService;
}(index_1.BaseService));
exports.BuildingService = BuildingService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2J1aWxkaW5nL2J1aWxkaW5nLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0NBQTJDO0FBRzNDLGtEQUE0RTtBQUM1RSwyRkFBd0Y7QUFLeEY7SUFBcUMsbUNBQVc7SUFFOUMseUJBQXNCLGNBQThCLEVBQVksbUJBQXlDO1FBQXpHLFlBQ0UsaUJBQU8sU0FDUjtRQUZxQixvQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFBWSx5QkFBbUIsR0FBbkIsbUJBQW1CLENBQXNCOztJQUV6RyxDQUFDO0lBRUQsd0NBQWMsR0FBZCxVQUFnQixTQUFrQixFQUFFLFFBQW1CO1FBQ3JELElBQUksR0FBRyxHQUFFLFdBQUcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxHQUFHLFNBQVMsR0FBRyxHQUFHLEdBQUcsV0FBRyxDQUFDLFFBQVEsQ0FBQztRQUM1RCxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELHFDQUFXLEdBQVgsVUFBYSxTQUFrQixFQUFFLFVBQW1CO1FBQ2xELElBQUksR0FBRyxHQUFHLFdBQUcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxHQUFHLFNBQVMsR0FBRyxHQUFHLEdBQUcsV0FBRyxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsVUFBVSxDQUFDO1FBQ2hGLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCx3Q0FBYyxHQUFkLFVBQWdCLFNBQWtCLEVBQUUsVUFBbUIsRUFBRSxRQUFtQjtRQUMxRSxJQUFJLEdBQUcsR0FBRyxXQUFHLENBQUMsT0FBTyxHQUFHLEdBQUcsR0FBRyxTQUFTLEdBQUcsR0FBRyxHQUFHLFdBQUcsQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLFVBQVUsQ0FBQztRQUNoRixNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELHdDQUFjLEdBQWQsVUFBZSxTQUFrQixFQUFFLFVBQW1CO1FBQ3BELElBQUksR0FBRyxHQUFHLFdBQUcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxHQUFHLFNBQVMsR0FBRyxHQUFHLEdBQUcsV0FBRyxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsVUFBVSxDQUFDO1FBQ2hGLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxvREFBMEIsR0FBMUIsVUFBNEIsU0FBa0IsRUFBRSxVQUFtQjtRQUNqRSxJQUFJLEdBQUcsR0FBRyxXQUFHLENBQUMsT0FBTyxHQUFHLEdBQUcsR0FBRyxTQUFTLEdBQUcsR0FBRyxHQUFFLFdBQUcsQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLFVBQVUsR0FBRyxHQUFHLEdBQUcsV0FBRyxDQUFDLEtBQUssQ0FBQztRQUNqRyxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsZ0RBQXNCLEdBQXRCLFVBQXdCLFNBQWtCLEVBQUUsZ0JBQXlCLEVBQUUsYUFBbUI7UUFDeEYsSUFBSSxVQUFVLEdBQUcsRUFBQyxVQUFVLEVBQUcsYUFBYSxFQUFDLENBQUM7UUFDOUMsSUFBSSxHQUFHLEdBQUksV0FBRyxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsU0FBUyxHQUFJLEdBQUcsR0FBRSxXQUFHLENBQUMsUUFBUSxHQUFHLEdBQUcsR0FBRyxnQkFBZ0IsR0FBRyxHQUFHLEdBQUUsV0FBRyxDQUFDLEtBQUssQ0FBQztRQUN4RyxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVELHNEQUE0QixHQUE1QixVQUE4QixTQUFrQixFQUFFLFVBQW1CO1FBQ25FLElBQUksR0FBRyxHQUFHLFdBQUcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxHQUFHLFNBQVMsR0FBRyxHQUFHLEdBQUcsV0FBRyxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsVUFBVSxHQUFHLEdBQUcsR0FBRyxXQUFHLENBQUMsa0JBQWtCLENBQUM7UUFDL0csTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQXhDVSxlQUFlO1FBRDNCLGlCQUFVLEVBQUU7eUNBRzJCLHNCQUFjLEVBQWtDLDJDQUFtQjtPQUY5RixlQUFlLENBMEMzQjtJQUFELHNCQUFDO0NBMUNELEFBMENDLENBMUNvQyxtQkFBVyxHQTBDL0M7QUExQ1ksMENBQWUiLCJmaWxlIjoiYXBwL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvYnVpbGRpbmcvYnVpbGRpbmcuc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7IEJ1aWxkaW5nIH0gZnJvbSAnLi4vLi4vbW9kZWwvYnVpbGRpbmcnO1xyXG5pbXBvcnQgeyBBUEksIEJhc2VTZXJ2aWNlLCBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IEh0dHBEZWxlZ2F0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zaGFyZWQvc2VydmljZXMvaHR0cC1kZWxlZ2F0ZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUHJvamVjdCB9IGZyb20gJy4uLy4uL21vZGVsL3Byb2plY3QnO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEJ1aWxkaW5nU2VydmljZSBleHRlbmRzIEJhc2VTZXJ2aWNlIHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSwgcHJvdGVjdGVkIGh0dHBEZWxlZ2F0ZVNlcnZpY2UgOiBIdHRwRGVsZWdhdGVTZXJ2aWNlKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlQnVpbGRpbmcoIHByb2plY3RJZCA6IHN0cmluZywgYnVpbGRpbmcgOiBCdWlsZGluZyk6IE9ic2VydmFibGU8QnVpbGRpbmc+IHtcclxuICAgIGxldCB1cmwgPUFQSS5QUk9KRUNUICsgJy8nICsgcHJvamVjdElkICsgJy8nICsgQVBJLkJVSUxESU5HO1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cERlbGVnYXRlU2VydmljZS5wb3N0QVBJKHVybCwgYnVpbGRpbmcpO1xyXG4gIH1cclxuXHJcbiAgZ2V0QnVpbGRpbmcoIHByb2plY3RJZCA6IHN0cmluZywgYnVpbGRpbmdJZCA6IHN0cmluZyk6IE9ic2VydmFibGU8QnVpbGRpbmc+IHtcclxuICAgIHZhciB1cmwgPSBBUEkuUFJPSkVDVCArICcvJyArIHByb2plY3RJZCArICcvJyArIEFQSS5CVUlMRElORyArICcvJyArIGJ1aWxkaW5nSWQ7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwRGVsZWdhdGVTZXJ2aWNlLmdldEFQSSh1cmwpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlQnVpbGRpbmcoIHByb2plY3RJZCA6IHN0cmluZywgYnVpbGRpbmdJZCA6IHN0cmluZywgYnVpbGRpbmcgOiBCdWlsZGluZyk6IE9ic2VydmFibGU8QnVpbGRpbmc+IHtcclxuICAgIHZhciB1cmwgPSBBUEkuUFJPSkVDVCArICcvJyArIHByb2plY3RJZCArICcvJyArIEFQSS5CVUlMRElORyArICcvJyArIGJ1aWxkaW5nSWQ7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwRGVsZWdhdGVTZXJ2aWNlLnB1dEFQSSh1cmwsIGJ1aWxkaW5nKTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZUJ1aWxkaW5nKHByb2plY3RJZCA6IHN0cmluZywgYnVpbGRpbmdJZCA6IHN0cmluZyk6IE9ic2VydmFibGU8UHJvamVjdD4ge1xyXG4gICAgdmFyIHVybCA9IEFQSS5QUk9KRUNUICsgJy8nICsgcHJvamVjdElkICsgJy8nICsgQVBJLkJVSUxESU5HICsgJy8nICsgYnVpbGRpbmdJZDtcclxuICAgIHJldHVybiB0aGlzLmh0dHBEZWxlZ2F0ZVNlcnZpY2UuZGVsZXRlQVBJKHVybCk7XHJcbiAgfVxyXG5cclxuICBnZXRCdWlsZGluZ0RldGFpbHNGb3JDbG9uZSggcHJvamVjdElkIDogc3RyaW5nLCBidWlsZGluZ0lkIDogc3RyaW5nKTogT2JzZXJ2YWJsZTxCdWlsZGluZz4ge1xyXG4gICAgdmFyIHVybCA9IEFQSS5QUk9KRUNUICsgJy8nICsgcHJvamVjdElkICsgJy8nICtBUEkuQlVJTERJTkcgKyAnLycgKyBidWlsZGluZ0lkICsgJy8nICsgQVBJLkNMT05FO1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cERlbGVnYXRlU2VydmljZS5nZXRBUEkodXJsKTtcclxuICB9XHJcblxyXG4gIGNsb25lQnVpbGRpbmdDb3N0SGVhZHMoIHByb2plY3RJZCA6IHN0cmluZywgY2xvbmVkQnVpbGRpbmdJZCA6IHN0cmluZywgY2xvbmVDb3N0SGVhZCA6IGFueSkge1xyXG4gICAgbGV0IHVwZGF0ZURhdGEgPSB7J2Nvc3RIZWFkJyA6IGNsb25lQ29zdEhlYWR9O1xyXG4gICAgdmFyIHVybCA9ICBBUEkuUFJPSkVDVCArICcvJyArIHByb2plY3RJZCAgKyAnLycrIEFQSS5CVUlMRElORyArICcvJyArIGNsb25lZEJ1aWxkaW5nSWQgKyAnLycgK0FQSS5DTE9ORTtcclxuICAgIHJldHVybiB0aGlzLmh0dHBEZWxlZ2F0ZVNlcnZpY2UucHV0QVBJKHVybCwgdXBkYXRlRGF0YSk7XHJcbiAgfVxyXG5cclxuICBzeW5jQnVpbGRpbmdXaXRoUmF0ZUFuYWx5c2lzKCBwcm9qZWN0SWQgOiBzdHJpbmcsIGJ1aWxkaW5nSWQgOiBzdHJpbmcpOiBPYnNlcnZhYmxlPEJ1aWxkaW5nPiB7XHJcbiAgICB2YXIgdXJsID0gQVBJLlBST0pFQ1QgKyAnLycgKyBwcm9qZWN0SWQgKyAnLycgKyBBUEkuQlVJTERJTkcgKyAnLycgKyBidWlsZGluZ0lkICsgJy8nICsgQVBJLlNZTkNfUkFURV9BTkFMWVNJUztcclxuICAgIHJldHVybiB0aGlzLmh0dHBEZWxlZ2F0ZVNlcnZpY2UuZ2V0QVBJKHVybCk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=
