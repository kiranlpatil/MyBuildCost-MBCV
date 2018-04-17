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
var index_2 = require("../../../../shared/index");
var MaterialTakeOffService = (function (_super) {
    __extends(MaterialTakeOffService, _super);
    function MaterialTakeOffService(httpDelegateService) {
        var _this = _super.call(this) || this;
        _this.httpDelegateService = httpDelegateService;
        return _this;
    }
    MaterialTakeOffService.prototype.getMaterialFiltersList = function (projectId) {
        var url = index_2.API.REPORT_MATERIAL_TAKE_OFF + '/' + index_2.API.PROJECT + '/' + projectId + '/' + index_2.API.MATERIAL_FILTERS_LIST;
        return this.httpDelegateService.getAPI(url);
    };
    MaterialTakeOffService.prototype.getMaterialTakeOffReport = function (projectId, materialTakeOffFilters) {
        var url = index_2.API.REPORT_MATERIAL_TAKE_OFF + '/' + index_2.API.PROJECT + '/' + projectId;
        return this.httpDelegateService.postAPI(url, materialTakeOffFilters);
    };
    MaterialTakeOffService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_delegate_service_1.HttpDelegateService])
    ], MaterialTakeOffService);
    return MaterialTakeOffService;
}(index_1.BaseService));
exports.MaterialTakeOffService = MaterialTakeOffService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L21hdGVyaWFsLXRha2VvZmYvbWF0ZXJpYWwtdGFrZW9mZi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNDQUEyQztBQUUzQyxrREFBdUU7QUFDdkUsMkZBQXdGO0FBQ3hGLGtEQUErQztBQU8vQztJQUE0QywwQ0FBVztJQUVyRCxnQ0FBc0IsbUJBQXlDO1FBQS9ELFlBQ0UsaUJBQU8sU0FDUjtRQUZxQix5QkFBbUIsR0FBbkIsbUJBQW1CLENBQXNCOztJQUUvRCxDQUFDO0lBRUQsdURBQXNCLEdBQXRCLFVBQXVCLFNBQWlCO1FBQ3RDLElBQUksR0FBRyxHQUFHLFdBQUcsQ0FBQyx3QkFBd0IsR0FBRyxHQUFHLEdBQUcsV0FBRyxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUUsU0FBUyxHQUFFLEdBQUcsR0FBRyxXQUFHLENBQUMscUJBQXFCLENBQUM7UUFDN0csTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELHlEQUF3QixHQUF4QixVQUF5QixTQUFrQixFQUFFLHNCQUErQztRQUMxRixJQUFJLEdBQUcsR0FBRyxXQUFHLENBQUMsd0JBQXdCLEdBQUcsR0FBRyxHQUFHLFdBQUcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxHQUFFLFNBQVMsQ0FBQztRQUM1RSxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBZFUsc0JBQXNCO1FBRGxDLGlCQUFVLEVBQUU7eUNBR2lDLDJDQUFtQjtPQUZwRCxzQkFBc0IsQ0FlbEM7SUFBRCw2QkFBQztDQWZELEFBZUMsQ0FmMkMsbUJBQVcsR0FldEQ7QUFmWSx3REFBc0IiLCJmaWxlIjoiYXBwL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvbWF0ZXJpYWwtdGFrZW9mZi9tYXRlcmlhbC10YWtlb2ZmLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHAsIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XHJcbmltcG9ydCB7IEJhc2VTZXJ2aWNlLCBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IEh0dHBEZWxlZ2F0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zaGFyZWQvc2VydmljZXMvaHR0cC1kZWxlZ2F0ZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQVBJIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2hhcmVkL2luZGV4JztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7IFByb2plY3QgfSBmcm9tICcuLi8uLi9tb2RlbC9wcm9qZWN0JztcclxuaW1wb3J0IHsgTWF0ZXJpYWxUYWtlT2ZmRmlsdGVycyB9IGZyb20gJy4uLy4uL21vZGVsL21hdGVyaWFsLXRha2Utb2ZmLWZpbHRlcnMnO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIE1hdGVyaWFsVGFrZU9mZlNlcnZpY2UgZXh0ZW5kcyBCYXNlU2VydmljZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBodHRwRGVsZWdhdGVTZXJ2aWNlIDogSHR0cERlbGVnYXRlU2VydmljZSkge1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcblxyXG4gIGdldE1hdGVyaWFsRmlsdGVyc0xpc3QocHJvamVjdElkOiBzdHJpbmcpIHtcclxuICAgIGxldCB1cmwgPSBBUEkuUkVQT1JUX01BVEVSSUFMX1RBS0VfT0ZGICsgJy8nICsgQVBJLlBST0pFQ1QgKyAnLycgK3Byb2plY3RJZCsgJy8nICsgQVBJLk1BVEVSSUFMX0ZJTFRFUlNfTElTVDtcclxuICAgIHJldHVybiB0aGlzLmh0dHBEZWxlZ2F0ZVNlcnZpY2UuZ2V0QVBJKHVybCk7XHJcbiAgfVxyXG5cclxuICBnZXRNYXRlcmlhbFRha2VPZmZSZXBvcnQocHJvamVjdElkIDogc3RyaW5nLCBtYXRlcmlhbFRha2VPZmZGaWx0ZXJzIDogTWF0ZXJpYWxUYWtlT2ZmRmlsdGVycyk6IE9ic2VydmFibGU8UHJvamVjdD4ge1xyXG4gICAgbGV0IHVybCA9IEFQSS5SRVBPUlRfTUFURVJJQUxfVEFLRV9PRkYgKyAnLycgKyBBUEkuUFJPSkVDVCArICcvJyArcHJvamVjdElkO1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cERlbGVnYXRlU2VydmljZS5wb3N0QVBJKHVybCwgbWF0ZXJpYWxUYWtlT2ZmRmlsdGVycyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==
