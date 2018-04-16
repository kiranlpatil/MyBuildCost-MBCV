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
var index_2 = require("../../../../shared/index");
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
        var projectId = index_2.SessionStorageService.getSessionValue(index_2.SessionStorage.CURRENT_PROJECT_ID);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L3Byb2plY3QtZGV0YWlscy9wcm9qZWN0LWRldGFpbHMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQWtEO0FBQ2xELDBDQUFpRDtBQUNqRCwwREFBd0Q7QUFDeEQsc0RBQW9EO0FBQ3BELGlEQUFnRDtBQUNoRCxrREFBbUU7QUFDbkUsa0RBQWlGO0FBU2pGO0lBT0UsaUNBQW9CLGNBQThCLEVBQzlCLGNBQThCLEVBQVUsY0FBNkI7UUFEckUsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBTHpGLGlCQUFZLEdBQVksSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFDL0IsdUJBQWtCLEdBQVksSUFBSSxDQUFDO1FBQ25DLGlCQUFZLEdBQVksS0FBSyxDQUFDO0lBSXJDLENBQUM7SUFFRCwwQ0FBUSxHQUFSO1FBQUEsaUJBT0M7UUFOQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBQSxNQUFNO1lBQzFDLEtBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3BDLEVBQUUsQ0FBQSxDQUFDLEtBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixLQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDcEIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELDRDQUFVLEdBQVY7UUFBQSxpQkFLQztRQUpDLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQ3RELFVBQUEsT0FBTyxJQUFJLE9BQUEsS0FBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxFQUFqQyxDQUFpQyxFQUM1QyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsRUFBL0IsQ0FBK0IsQ0FDekMsQ0FBQztJQUNKLENBQUM7SUFFRCxxREFBbUIsR0FBbkIsVUFBb0IsT0FBYTtRQUMvQixJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELHFEQUFtQixHQUFuQixVQUFvQixLQUFXO1FBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUdELCtDQUFhLEdBQWIsVUFBYyxZQUFzQjtRQUFwQyxpQkFNQztRQUxHLElBQUksU0FBUyxHQUFDLDZCQUFxQixDQUFDLGVBQWUsQ0FBQyxzQkFBYyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDdkYsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQzthQUN2RCxTQUFTLENBQ1IsVUFBQSxJQUFJLElBQUksT0FBQSxLQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEVBQWpDLENBQWlDLEVBQ3pDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxFQUFsQyxDQUFrQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELHdEQUFzQixHQUF0QixVQUF1QixNQUFXO1FBQ2hDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLElBQUksT0FBTyxHQUFHLElBQUksZUFBTyxFQUFFLENBQUM7WUFDNUIsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDeEIsT0FBTyxDQUFDLGNBQWMsR0FBRyxvQkFBUSxDQUFDLGtDQUFrQyxDQUFDO1lBQ3JFLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7SUFDSCxDQUFDO0lBRUQsd0RBQXNCLEdBQXRCLFVBQXVCLEtBQVU7UUFFL0IsSUFBSSxPQUFPLEdBQUcsSUFBSSxlQUFPLEVBQUUsQ0FBQztRQUU1QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkQsT0FBTyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1lBQ2xDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7WUFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1lBQ2xDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztZQUNsQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QyxDQUFDO0lBQ0gsQ0FBQztJQXBFVSx1QkFBdUI7UUFQbkMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsb0JBQW9CO1lBQzlCLFdBQVcsRUFBRSxnQ0FBZ0M7WUFDN0MsU0FBUyxFQUFFLENBQUMsK0JBQStCLENBQUM7U0FDN0MsQ0FBQzt5Q0FTb0MsZ0NBQWM7WUFDZCxzQkFBYyxFQUF5Qix1QkFBYztPQVI5RSx1QkFBdUIsQ0FxRW5DO0lBQUQsOEJBQUM7Q0FyRUQsQUFxRUMsSUFBQTtBQXJFWSwwREFBdUIiLCJmaWxlIjoiYXBwL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvcHJvamVjdC1kZXRhaWxzL3Byb2plY3QtZGV0YWlscy5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IE1lc3NhZ2VzIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IFByb2plY3RTZXJ2aWNlIH0gZnJvbSAnLi4vcHJvamVjdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUHJvamVjdCB9IGZyb20gJy4vLi4vLi4vbW9kZWwvcHJvamVjdCc7XHJcbmltcG9ydCB7IE1lc3NhZ2UsIE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2hhcmVkL2luZGV4JztcclxuaW1wb3J0IHsgU2Vzc2lvblN0b3JhZ2UsIFNlc3Npb25TdG9yYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAnYmktcHJvamVjdC1kZXRhaWxzJyxcclxuICB0ZW1wbGF0ZVVybDogJ3Byb2plY3QtZGV0YWlscy5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJ3Byb2plY3QtZGV0YWlscy5jb21wb25lbnQuY3NzJ11cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9qZWN0RGV0YWlsc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIHByb2plY3RJZCA6IHN0cmluZztcclxuICBwcm9qZWN0TW9kZWw6IFByb2plY3QgPSBuZXcgUHJvamVjdCgpO1xyXG4gIHB1YmxpYyBpc1Nob3dFcnJvck1lc3NhZ2U6IGJvb2xlYW4gPSB0cnVlO1xyXG4gIHB1YmxpYyBlcnJvck1lc3NhZ2U6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwcm9qZWN0U2VydmljZTogUHJvamVjdFNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBtZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UsIHByaXZhdGUgYWN0aXZhdGVkUm91dGU6QWN0aXZhdGVkUm91dGUpIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5hY3RpdmF0ZWRSb3V0ZS5wYXJhbXMuc3Vic2NyaWJlKHBhcmFtcyA9PiB7XHJcbiAgICAgdGhpcy5wcm9qZWN0SWQgPSBwYXJhbXNbJ3Byb2plY3RJZCddO1xyXG4gICAgICBpZih0aGlzLnByb2plY3RJZCkge1xyXG4gICAgICAgIHRoaXMuZ2V0UHJvamVjdCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFByb2plY3QoKSB7XHJcbiAgICB0aGlzLnByb2plY3RTZXJ2aWNlLmdldFByb2plY3QodGhpcy5wcm9qZWN0SWQpLnN1YnNjcmliZShcclxuICAgICAgcHJvamVjdCA9PiB0aGlzLm9uR2V0UHJvamVjdFN1Y2Nlc3MocHJvamVjdCksXHJcbiAgICAgIGVycm9yID0+IHRoaXMub25HZXRQcm9qZWN0RmFpbHVyZShlcnJvcilcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkdldFByb2plY3RTdWNjZXNzKHByb2plY3QgOiBhbnkpIHtcclxuICAgIHRoaXMucHJvamVjdE1vZGVsID0gcHJvamVjdC5kYXRhWzBdO1xyXG4gIH1cclxuXHJcbiAgb25HZXRQcm9qZWN0RmFpbHVyZShlcnJvciA6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gIH1cclxuXHJcblxyXG4gIHVwZGF0ZVByb2plY3QocHJvamVjdE1vZGVsIDogUHJvamVjdCkge1xyXG4gICAgICBsZXQgcHJvamVjdElkPVNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuICAgICAgdGhpcy5wcm9qZWN0U2VydmljZS51cGRhdGVQcm9qZWN0KHByb2plY3RJZCwgcHJvamVjdE1vZGVsKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgICB1c2VyID0+IHRoaXMub25VcGRhdGVQcm9qZWN0U3VjY2Vzcyh1c2VyKSxcclxuICAgICAgICAgIGVycm9yID0+IHRoaXMub25VcGRhdGVQcm9qZWN0RmFpbHVyZShlcnJvcikpO1xyXG4gIH1cclxuXHJcbiAgb25VcGRhdGVQcm9qZWN0U3VjY2VzcyhyZXN1bHQ6IGFueSkge1xyXG4gICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xyXG4gICAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfVVBEQVRFX1BST0pFQ1RfREVUQUlMUztcclxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25VcGRhdGVQcm9qZWN0RmFpbHVyZShlcnJvcjogYW55KSB7XHJcblxyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG5cclxuICAgIGlmIChlcnJvci5lcnJfY29kZSA9PT0gNDA0IHx8IGVycm9yLmVycl9jb2RlID09PSAwKSB7XHJcbiAgICAgIG1lc3NhZ2UuZXJyb3JfbXNnID0gZXJyb3IuZXJyX21zZztcclxuICAgICAgbWVzc2FnZS5pc0Vycm9yID0gdHJ1ZTtcclxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5pc1Nob3dFcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxuICAgICAgdGhpcy5lcnJvck1lc3NhZ2UgPSBlcnJvci5lcnJfbXNnO1xyXG4gICAgICBtZXNzYWdlLmVycm9yX21zZyA9IGVycm9yLmVycl9tc2c7XHJcbiAgICAgIG1lc3NhZ2UuaXNFcnJvciA9IHRydWU7XHJcbiAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19
