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
var project_service_1 = require("../project.service");
var project_1 = require("./../../model/project");
var index_1 = require("../../../../shared/index");
var ProjectDetailsComponent = (function () {
    function ProjectDetailsComponent(projectService, messageService, activatedRoute) {
        this.projectService = projectService;
        this.messageService = messageService;
        this.activatedRoute = activatedRoute;
        this.projectModel = new project_1.Project();
        this.isShowErrorMessage = true;
        this.errorMessage = false;
    }
    ProjectDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CURRENT_VIEW, constants_1.CurrentView.PROJECT_DETAILS);
        this.activatedRoute.params.subscribe(function (params) {
            _this.projectId = params['projectId'];
            if (_this.projectId) {
                _this.getProject();
            }
        });
    };
    ProjectDetailsComponent.prototype.getProject = function () {
        var _this = this;
        this.projectService.getProject(this.projectId).subscribe(function (project) { return _this.onGetProjectSuccess(project); }, function (error) { return _this.onGetProjectFailure(error); });
    };
    ProjectDetailsComponent.prototype.onGetProjectSuccess = function (project) {
        this.projectModel = project.data[0];
    };
    ProjectDetailsComponent.prototype.onGetProjectFailure = function (error) {
        console.log(error);
    };
    ProjectDetailsComponent.prototype.updateProject = function (projectModel) {
        var _this = this;
        var projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
        this.projectService.updateProject(projectId, projectModel)
            .subscribe(function (user) { return _this.onUpdateProjectSuccess(user); }, function (error) { return _this.onUpdateProjectFailure(error); });
    };
    ProjectDetailsComponent.prototype.onUpdateProjectSuccess = function (result) {
        if (result !== null) {
            var message = new index_1.Message();
            message.isError = false;
            message.custom_message = constants_1.Messages.MSG_SUCCESS_UPDATE_PROJECT_DETAILS;
            this.messageService.message(message);
        }
    };
    ProjectDetailsComponent.prototype.onUpdateProjectFailure = function (error) {
        var message = new index_1.Message();
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
    ProjectDetailsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-project-details',
            templateUrl: 'project-details.component.html',
            styleUrls: ['project-details.component.css']
        }),
        __metadata("design:paramtypes", [project_service_1.ProjectService,
            index_1.MessageService, router_1.ActivatedRoute])
    ], ProjectDetailsComponent);
    return ProjectDetailsComponent;
}());
exports.ProjectDetailsComponent = ProjectDetailsComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L3Byb2plY3QtZGV0YWlscy9wcm9qZWN0LWRldGFpbHMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQWtEO0FBQ2xELDBDQUFpRDtBQUNqRCwwREFBb0U7QUFDcEUsc0RBQW9EO0FBQ3BELGlEQUFnRDtBQUNoRCxrREFBeUc7QUFTekc7SUFPRSxpQ0FBb0IsY0FBOEIsRUFDOUIsY0FBOEIsRUFBVSxjQUE2QjtRQURyRSxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDOUIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQWU7UUFMekYsaUJBQVksR0FBWSxJQUFJLGlCQUFPLEVBQUUsQ0FBQztRQUMvQix1QkFBa0IsR0FBWSxJQUFJLENBQUM7UUFDbkMsaUJBQVksR0FBWSxLQUFLLENBQUM7SUFJckMsQ0FBQztJQUVELDBDQUFRLEdBQVI7UUFBQSxpQkFRQztRQVBDLDZCQUFxQixDQUFDLGVBQWUsQ0FBQyxzQkFBYyxDQUFDLFlBQVksRUFBQyx1QkFBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQy9GLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFBLE1BQU07WUFDMUMsS0FBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDcEMsRUFBRSxDQUFBLENBQUMsS0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLEtBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNwQixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsNENBQVUsR0FBVjtRQUFBLGlCQUtDO1FBSkMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FDdEQsVUFBQSxPQUFPLElBQUksT0FBQSxL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amVjdC1kZXRhaWxzLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgQ3VycmVudFZpZXcsIE1lc3NhZ2VzfSBmcm9tICcuLi8uLi8uLi8uLi9zaGFyZWQvY29uc3RhbnRzJztcclxuaW1wb3J0IHsgUHJvamVjdFNlcnZpY2UgfSBmcm9tICcuLi9wcm9qZWN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQcm9qZWN0IH0gZnJvbSAnLi8uLi8uLi9tb2RlbC9wcm9qZWN0JztcclxuaW1wb3J0IHsgTWVzc2FnZSwgTWVzc2FnZVNlcnZpY2UsU2Vzc2lvblN0b3JhZ2UsIFNlc3Npb25TdG9yYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAnYmktcHJvamVjdC1kZXRhaWxzJyxcclxuICB0ZW1wbGF0ZVVybDogJ3Byb2plY3QtZGV0YWlscy5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJ3Byb2plY3QtZGV0YWlscy5jb21wb25lbnQuY3NzJ11cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9qZWN0RGV0YWlsc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIHByb2plY3RJZCA6IHN0cmluZztcclxuICBwcm9qZWN0TW9kZWw6IFByb2plY3QgPSBuZXcgUHJvamVjdCgpO1xyXG4gIHB1YmxpYyBpc1Nob3dFcnJvck1lc3NhZ2U6IGJvb2xlYW4gPSB0cnVlO1xyXG4gIHB1YmxpYyBlcnJvck1lc3NhZ2U6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwcm9qZWN0U2VydmljZTogUHJvamVjdFNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBtZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UsIHByaXZhdGUgYWN0aXZhdGVkUm91dGU6QWN0aXZhdGVkUm91dGUpIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1ZJRVcsQ3VycmVudFZpZXcuUFJPSkVDVF9ERVRBSUxTKTtcclxuICAgIHRoaXMuYWN0aXZhdGVkUm91dGUucGFyYW1zLnN1YnNjcmliZShwYXJhbXMgPT4ge1xyXG4gICAgIHRoaXMucHJvamVjdElkID0gcGFyYW1zWydwcm9qZWN0SWQnXTtcclxuICAgICAgaWYodGhpcy5wcm9qZWN0SWQpIHtcclxuICAgICAgICB0aGlzLmdldFByb2plY3QoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRQcm9qZWN0KCkge1xyXG4gICAgdGhpcy5wcm9qZWN0U2VydmljZS5nZXRQcm9qZWN0KHRoaXMucHJvamVjdElkKS5zdWJzY3JpYmUoXHJcbiAgICAgIHByb2plY3QgPT4gdGhpcy5vbkdldFByb2plY3RTdWNjZXNzKHByb2plY3QpLFxyXG4gICAgICBlcnJvciA9PiB0aGlzLm9uR2V0UHJvamVjdEZhaWx1cmUoZXJyb3IpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgb25HZXRQcm9qZWN0U3VjY2Vzcyhwcm9qZWN0IDogYW55KSB7XHJcbiAgICB0aGlzLnByb2plY3RNb2RlbCA9IHByb2plY3QuZGF0YVswXTtcclxuICB9XHJcblxyXG4gIG9uR2V0UHJvamVjdEZhaWx1cmUoZXJyb3IgOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICB9XHJcblxyXG5cclxuICB1cGRhdGVQcm9qZWN0KHByb2plY3RNb2RlbCA6IFByb2plY3QpIHtcclxuICAgICAgbGV0IHByb2plY3RJZD1TZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfUFJPSkVDVF9JRCk7XHJcbiAgICAgIHRoaXMucHJvamVjdFNlcnZpY2UudXBkYXRlUHJvamVjdChwcm9qZWN0SWQsIHByb2plY3RNb2RlbClcclxuICAgICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgICAgdXNlciA9PiB0aGlzLm9uVXBkYXRlUHJvamVjdFN1Y2Nlc3ModXNlciksXHJcbiAgICAgICAgICBlcnJvciA9PiB0aGlzLm9uVXBkYXRlUHJvamVjdEZhaWx1cmUoZXJyb3IpKTtcclxuICB9XHJcblxyXG4gIG9uVXBkYXRlUHJvamVjdFN1Y2Nlc3MocmVzdWx0OiBhbnkpIHtcclxuICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcclxuICAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX1VQREFURV9QUk9KRUNUX0RFVEFJTFM7XHJcbiAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uVXBkYXRlUHJvamVjdEZhaWx1cmUoZXJyb3I6IGFueSkge1xyXG5cclxuICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuXHJcbiAgICBpZiAoZXJyb3IuZXJyX2NvZGUgPT09IDQwNCB8fCBlcnJvci5lcnJfY29kZSA9PT0gMCkge1xyXG4gICAgICBtZXNzYWdlLmVycm9yX21zZyA9IGVycm9yLmVycl9tc2c7XHJcbiAgICAgIG1lc3NhZ2UuaXNFcnJvciA9IHRydWU7XHJcbiAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuaXNTaG93RXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gZXJyb3IuZXJyX21zZztcclxuICAgICAgbWVzc2FnZS5lcnJvcl9tc2cgPSBlcnJvci5lcnJfbXNnO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSB0cnVlO1xyXG4gICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==
