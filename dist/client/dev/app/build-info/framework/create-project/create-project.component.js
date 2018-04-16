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
var constants_1 = require("../../../shared/constants");
var index_1 = require("../../../shared/index");
var project_service_1 = require("../project/project.service");
var CreateProjectComponent = (function () {
    function CreateProjectComponent(_router, projectService, messageService) {
        this._router = _router;
        this.projectService = projectService;
        this.messageService = messageService;
        this.isShowErrorMessage = true;
        this.errorMessage = false;
        this.BODY_BACKGROUND_TRANSPARENT = constants_1.ImagePath.BODY_BACKGROUND_TRANSPARENT;
    }
    CreateProjectComponent.prototype.ngOnInit = function () {
        this.isUserSignIn = parseFloat(index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.IS_USER_SIGN_IN));
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CURRENT_VIEW, 'createProject');
    };
    CreateProjectComponent.prototype.onSubmit = function (projectModel) {
        var _this = this;
        this.projectService.createProject(projectModel)
            .subscribe(function (project) { return _this.onCreateProjectSuccess(project); }, function (error) { return _this.onCreateProjectFailure(error); });
    };
    CreateProjectComponent.prototype.onCreateProjectSuccess = function (project) {
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID, project._id);
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CURRENT_PROJECT_NAME, project.name);
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = index_1.Messages.MSG_SUCCESS_PROJECT_CREATION;
        this.messageService.message(message);
        this._router.navigate([constants_1.NavigationRoutes.APP_CREATE_BUILDING]);
    };
    CreateProjectComponent.prototype.onCreateProjectFailure = function (error) {
        console.log(error);
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
    CreateProjectComponent.prototype.goBack = function () {
        sessionStorage.removeItem(index_1.SessionStorage.CURRENT_VIEW);
        this._router.navigate([constants_1.NavigationRoutes.APP_DASHBOARD]);
    };
    CreateProjectComponent.prototype.getHeadings = function () {
        return constants_1.Headings;
    };
    CreateProjectComponent.prototype.getLabels = function () {
        return constants_1.Label;
    };
    CreateProjectComponent.prototype.getButton = function () {
        return constants_1.Button;
    };
    CreateProjectComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-create-project',
            templateUrl: 'create-project.component.html',
            styleUrls: ['create-project.component.css']
        }),
        __metadata("design:paramtypes", [router_1.Router, project_service_1.ProjectService, index_1.MessageService])
    ], CreateProjectComponent);
    return CreateProjectComponent;
}());
exports.CreateProjectComponent = CreateProjectComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9jcmVhdGUtcHJvamVjdC9jcmVhdGUtcHJvamVjdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBa0Q7QUFDbEQsMENBQXlDO0FBQ3pDLHVEQUFpRztBQUNqRywrQ0FBa0g7QUFDbEgsOERBQTREO0FBVTVEO0lBT0UsZ0NBQW9CLE9BQWUsRUFBVSxjQUErQixFQUFVLGNBQStCO1FBQWpHLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBaUI7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBaUI7UUFMOUcsdUJBQWtCLEdBQVksSUFBSSxDQUFDO1FBQ25DLGlCQUFZLEdBQVksS0FBSyxDQUFDO1FBS25DLElBQUksQ0FBQywyQkFBMkIsR0FBRyxxQkFBUyxDQUFDLDJCQUEyQixDQUFDO0lBQzNFLENBQUM7SUFDRCx5Q0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsNkJBQXFCLENBQUMsZUFBZSxDQUFDLHNCQUFjLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztRQUN0Ryw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxZQUFZLEVBQUMsZUFBZSxDQUFDLENBQUM7SUFDckYsQ0FBQztJQUVELHlDQUFRLEdBQVIsVUFBUyxZQUFzQjtRQUEvQixpQkFLQztRQUpHLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQzthQUM1QyxTQUFTLENBQ1IsVUFBQSxPQUFPLElBQUksT0FBQSxLQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLEVBQXBDLENBQW9DLEVBQy9DLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxFQUFsQyxDQUFrQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELHVEQUFzQixHQUF0QixVQUF1QixPQUFhO1FBQ2xDLDZCQUFxQixDQUFDLGVBQWUsQ0FBQyxzQkFBYyxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0Riw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekYsSUFBSSxPQUFPLEdBQUcsSUFBSSxlQUFPLEVBQUUsQ0FBQztRQUM1QixPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUN4QixPQUFPLENBQUMsY0FBYyxHQUFHLGdCQUFRLENBQUMsNEJBQTRCLENBQUM7UUFDL0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyw0QkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVELHVEQUFzQixHQUF0QixVQUF1QixLQUFXO1FBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkIsSUFBSSxPQUFPLEdBQUcsSUFBSSxlQUFPLEVBQUUsQ0FBQztRQUM1QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkQsT0FBTyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1lBQ2xDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7WUFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1lBQ2xDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztZQUNsQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QyxDQUFDO0lBQ0gsQ0FBQztJQUVELHVDQUFNLEdBQU47UUFDRSxjQUFjLENBQUMsVUFBVSxDQUFDLHNCQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyw0QkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCw0Q0FBVyxHQUFYO1FBQ0UsTUFBTSxDQUFDLG9CQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVELDBDQUFTLEdBQVQ7UUFDRSxNQUFNLENBQUMsaUJBQUssQ0FBQztJQUNmLENBQUM7SUFFRCwwQ0FBUyxHQUFUO1FBQ0UsTUFBTSxDQUFDLGtCQUFNLENBQUM7SUFDaEIsQ0FBQztJQS9EVSxzQkFBc0I7UUFQbEMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsbUJBQW1CO1lBQzdCLFdBQVcsRUFBRSwrQkFBK0I7WUFDNUMsU0FBUyxFQUFFLENBQUMsOEJBQThCLENBQUM7U0FDNUMsQ0FBQzt5Q0FTNkIsZUFBTSxFQUEyQixnQ0FBYyxFQUEyQixzQkFBYztPQVAxRyxzQkFBc0IsQ0FnRWxDO0lBQUQsNkJBQUM7Q0FoRUQsQUFnRUMsSUFBQTtBQWhFWSx3REFBc0IiLCJmaWxlIjoiYXBwL2J1aWxkLWluZm8vZnJhbWV3b3JrL2NyZWF0ZS1wcm9qZWN0L2NyZWF0ZS1wcm9qZWN0LmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IE5hdmlnYXRpb25Sb3V0ZXMsIEltYWdlUGF0aCwgSGVhZGluZ3MsIExhYmVsLCBCdXR0b24gfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvY29uc3RhbnRzJztcclxuaW1wb3J0IHsgU2Vzc2lvblN0b3JhZ2UsIFNlc3Npb25TdG9yYWdlU2VydmljZSwgIE1lc3NhZ2UsIE1lc3NhZ2VzLCBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IFByb2plY3RTZXJ2aWNlIH0gZnJvbSAnLi4vcHJvamVjdC9wcm9qZWN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQcm9qZWN0IH0gZnJvbSAnLi8uLi9tb2RlbC9wcm9qZWN0JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICdiaS1jcmVhdGUtcHJvamVjdCcsXHJcbiAgdGVtcGxhdGVVcmw6ICdjcmVhdGUtcHJvamVjdC5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJ2NyZWF0ZS1wcm9qZWN0LmNvbXBvbmVudC5jc3MnXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIENyZWF0ZVByb2plY3RDb21wb25lbnQgaW1wbGVtZW50cyAgT25Jbml0IHtcclxuXHJcbiAgcHVibGljIGlzU2hvd0Vycm9yTWVzc2FnZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgcHVibGljIGVycm9yTWVzc2FnZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHB1YmxpYyBpc1VzZXJTaWduSW46IG51bWJlcjtcclxuICBCT0RZX0JBQ0tHUk9VTkRfVFJBTlNQQVJFTlQ6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsIHByaXZhdGUgcHJvamVjdFNlcnZpY2UgOiBQcm9qZWN0U2VydmljZSwgcHJpdmF0ZSBtZXNzYWdlU2VydmljZSA6IE1lc3NhZ2VTZXJ2aWNlKSB7XHJcbiAgICB0aGlzLkJPRFlfQkFDS0dST1VORF9UUkFOU1BBUkVOVCA9IEltYWdlUGF0aC5CT0RZX0JBQ0tHUk9VTkRfVFJBTlNQQVJFTlQ7XHJcbiAgfVxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5pc1VzZXJTaWduSW4gPSBwYXJzZUZsb2F0KFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuSVNfVVNFUl9TSUdOX0lOKSk7XHJcbiAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfVklFVywnY3JlYXRlUHJvamVjdCcpO1xyXG4gIH1cclxuXHJcbiAgb25TdWJtaXQocHJvamVjdE1vZGVsIDogUHJvamVjdCkge1xyXG4gICAgICB0aGlzLnByb2plY3RTZXJ2aWNlLmNyZWF0ZVByb2plY3QocHJvamVjdE1vZGVsKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgICBwcm9qZWN0ID0+IHRoaXMub25DcmVhdGVQcm9qZWN0U3VjY2Vzcyhwcm9qZWN0KSxcclxuICAgICAgICAgIGVycm9yID0+IHRoaXMub25DcmVhdGVQcm9qZWN0RmFpbHVyZShlcnJvcikpO1xyXG4gIH1cclxuXHJcbiAgb25DcmVhdGVQcm9qZWN0U3VjY2Vzcyhwcm9qZWN0IDogYW55KSB7XHJcbiAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfUFJPSkVDVF9JRCwgcHJvamVjdC5faWQpO1xyXG4gICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfTkFNRSwgcHJvamVjdC5uYW1lKTtcclxuICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX1BST0pFQ1RfQ1JFQVRJT047XHJcbiAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW05hdmlnYXRpb25Sb3V0ZXMuQVBQX0NSRUFURV9CVUlMRElOR10pO1xyXG4gIH1cclxuXHJcbiAgb25DcmVhdGVQcm9qZWN0RmFpbHVyZShlcnJvciA6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgaWYgKGVycm9yLmVycl9jb2RlID09PSA0MDQgfHwgZXJyb3IuZXJyX2NvZGUgPT09IDApIHtcclxuICAgICAgbWVzc2FnZS5lcnJvcl9tc2cgPSBlcnJvci5lcnJfbXNnO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSB0cnVlO1xyXG4gICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmlzU2hvd0Vycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmVycm9yTWVzc2FnZSA9IGVycm9yLmVycl9tc2c7XHJcbiAgICAgIG1lc3NhZ2UuZXJyb3JfbXNnID0gZXJyb3IuZXJyX21zZztcclxuICAgICAgbWVzc2FnZS5pc0Vycm9yID0gdHJ1ZTtcclxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ29CYWNrKCkge1xyXG4gICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1ZJRVcpO1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9EQVNIQk9BUkRdKTtcclxuICB9XHJcblxyXG4gIGdldEhlYWRpbmdzKCkge1xyXG4gICAgcmV0dXJuIEhlYWRpbmdzO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGFiZWxzKCkge1xyXG4gICAgcmV0dXJuIExhYmVsO1xyXG4gIH1cclxuXHJcbiAgZ2V0QnV0dG9uKCkge1xyXG4gICAgcmV0dXJuIEJ1dHRvbjtcclxuICB9XHJcbn1cclxuIl19
