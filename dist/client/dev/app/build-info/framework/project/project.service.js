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
var index_1 = require("../../../shared/index");
var http_delegate_service_1 = require("../../../shared/services/http-delegate.service");
var ProjectService = (function (_super) {
    __extends(ProjectService, _super);
    function ProjectService(messageService, httpDelegateService) {
        var _this = _super.call(this) || this;
        _this.messageService = messageService;
        _this.httpDelegateService = httpDelegateService;
        return _this;
    }
    ProjectService.prototype.getAllProjects = function () {
        var url = index_1.API.USER_ALL_PROJECTS;
        return this.httpDelegateService.getAPI(url);
    };
    ProjectService.prototype.createProject = function (project) {
        var url = index_1.API.PROJECT;
        return this.httpDelegateService.postAPI(url, project);
    };
    ProjectService.prototype.getProject = function (projectId) {
        var url = index_1.API.PROJECT + '/' + projectId;
        return this.httpDelegateService.getAPI(url);
    };
    ProjectService.prototype.updateProject = function (projectId, modelProject) {
        var url = index_1.API.PROJECT + '/' + projectId;
        return this.httpDelegateService.putAPI(url, modelProject);
    };
    ProjectService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [index_1.MessageService,
            http_delegate_service_1.HttpDelegateService])
    ], ProjectService);
    return ProjectService;
}(index_1.BaseService));
exports.ProjectService = ProjectService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L3Byb2plY3Quc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBMkM7QUFHM0MsK0NBQWdIO0FBQ2hILHdGQUFxRjtBQUdyRjtJQUFvQyxrQ0FBVztJQUU3Qyx3QkFBc0IsY0FBOEIsRUFDOUIsbUJBQXlDO1FBRC9ELFlBRUUsaUJBQU8sU0FDUjtRQUhxQixvQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDOUIseUJBQW1CLEdBQW5CLG1CQUFtQixDQUFzQjs7SUFFL0QsQ0FBQztJQUVELHVDQUFjLEdBQWQ7UUFDRSxJQUFJLEdBQUcsR0FBRyxXQUFHLENBQUMsaUJBQWlCLENBQUM7UUFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELHNDQUFhLEdBQWIsVUFBYyxPQUFpQjtRQUM3QixJQUFJLEdBQUcsR0FBRyxXQUFHLENBQUMsT0FBTyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsbUNBQVUsR0FBVixVQUFXLFNBQWdCO1FBQ3pCLElBQUksR0FBRyxHQUFHLFdBQUcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQztRQUN4QyxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsc0NBQWEsR0FBYixVQUFlLFNBQWtCLEVBQUUsWUFBc0I7UUFDdkQsSUFBSSxHQUFHLEdBQUcsV0FBRyxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsU0FBUyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBekJVLGNBQWM7UUFEMUIsaUJBQVUsRUFBRTt5Q0FHMkIsc0JBQWM7WUFDUiwyQ0FBbUI7T0FIcEQsY0FBYyxDQTJCMUI7SUFBRCxxQkFBQztDQTNCRCxBQTJCQyxDQTNCbUMsbUJBQVcsR0EyQjlDO0FBM0JZLHdDQUFjIiwiZmlsZSI6ImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L3Byb2plY3Quc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7IFByb2plY3QgfSBmcm9tICcuLy4uL21vZGVsL3Byb2plY3QnO1xyXG5pbXBvcnQgeyBBUEksIEJhc2VTZXJ2aWNlLCBNZXNzYWdlU2VydmljZSwgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLCBTZXNzaW9uU3RvcmFnZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IEh0dHBEZWxlZ2F0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvc2VydmljZXMvaHR0cC1kZWxlZ2F0ZS5zZXJ2aWNlJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFByb2plY3RTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBodHRwRGVsZWdhdGVTZXJ2aWNlIDogSHR0cERlbGVnYXRlU2VydmljZSkge1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcblxyXG4gIGdldEFsbFByb2plY3RzKCk6IE9ic2VydmFibGU8UHJvamVjdD4ge1xyXG4gICAgdmFyIHVybCA9IEFQSS5VU0VSX0FMTF9QUk9KRUNUUztcclxuICAgIHJldHVybiB0aGlzLmh0dHBEZWxlZ2F0ZVNlcnZpY2UuZ2V0QVBJKHVybCk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVQcm9qZWN0KHByb2plY3QgOiBQcm9qZWN0KTogT2JzZXJ2YWJsZTxQcm9qZWN0PiB7XHJcbiAgICBsZXQgdXJsID0gQVBJLlBST0pFQ1Q7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwRGVsZWdhdGVTZXJ2aWNlLnBvc3RBUEkodXJsLCBwcm9qZWN0KTtcclxuICB9XHJcblxyXG4gIGdldFByb2plY3QocHJvamVjdElkOnN0cmluZyk6IE9ic2VydmFibGU8UHJvamVjdD4ge1xyXG4gICAgdmFyIHVybCA9IEFQSS5QUk9KRUNUICsgJy8nICsgcHJvamVjdElkO1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cERlbGVnYXRlU2VydmljZS5nZXRBUEkodXJsKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVByb2plY3QoIHByb2plY3RJZCA6IHN0cmluZywgbW9kZWxQcm9qZWN0IDogUHJvamVjdCk6IE9ic2VydmFibGU8UHJvamVjdD4ge1xyXG4gICAgbGV0IHVybCA9IEFQSS5QUk9KRUNUICsgJy8nICsgcHJvamVjdElkO1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cERlbGVnYXRlU2VydmljZS5wdXRBUEkodXJsLCBtb2RlbFByb2plY3QpO1xyXG4gIH1cclxuXHJcbn1cclxuIl19
