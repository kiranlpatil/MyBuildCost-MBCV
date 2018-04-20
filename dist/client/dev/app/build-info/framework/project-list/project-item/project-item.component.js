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
var index_1 = require("../../../../shared/index");
var project_1 = require("../../model/project");
var ProjectItemComponent = (function () {
    function ProjectItemComponent(_router) {
        this._router = _router;
    }
    ProjectItemComponent.prototype.navigateToSelectedProject = function (projectId, projectName) {
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID, projectId);
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CURRENT_PROJECT_NAME, projectName);
        this._router.navigate([constants_1.NavigationRoutes.APP_PROJECT, projectId, constants_1.NavigationRoutes.APP_COST_SUMMARY]);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", project_1.Project)
    ], ProjectItemComponent.prototype, "project", void 0);
    ProjectItemComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-project-item',
            templateUrl: 'project-item.component.html',
            styleUrls: ['project-item.component.css']
        }),
        __metadata("design:paramtypes", [router_1.Router])
    ], ProjectItemComponent);
    return ProjectItemComponent;
}());
exports.ProjectItemComponent = ProjectItemComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0LWxpc3QvcHJvamVjdC1pdGVtL3Byb2plY3QtaXRlbS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBaUQ7QUFDakQsMENBQXlDO0FBQ3pDLDBEQUFnRTtBQUNoRSxrREFBaUY7QUFDakYsK0NBQThDO0FBUzlDO0lBSUUsOEJBQW9CLE9BQWU7UUFBZixZQUFPLEdBQVAsT0FBTyxDQUFRO0lBQ25DLENBQUM7SUFFRCx3REFBeUIsR0FBekIsVUFBMEIsU0FBZ0IsRUFBQyxXQUFrQjtRQUMzRCw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxrQkFBa0IsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNwRiw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxvQkFBb0IsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN4RixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLDRCQUFnQixDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsNEJBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQ3RHLENBQUM7SUFUUTtRQUFSLFlBQUssRUFBRTtrQ0FBWSxpQkFBTzt5REFBQztJQUZqQixvQkFBb0I7UUFQaEMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsaUJBQWlCO1lBQzNCLFdBQVcsRUFBRSw2QkFBNkI7WUFDMUMsU0FBUyxFQUFFLENBQUMsNEJBQTRCLENBQUM7U0FDMUMsQ0FBQzt5Q0FNNkIsZUFBTTtPQUp4QixvQkFBb0IsQ0FZaEM7SUFBRCwyQkFBQztDQVpELEFBWUMsSUFBQTtBQVpZLG9EQUFvQiIsImZpbGUiOiJhcHAvYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC1saXN0L3Byb2plY3QtaXRlbS9wcm9qZWN0LWl0ZW0uY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBOYXZpZ2F0aW9uUm91dGVzIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IFNlc3Npb25TdG9yYWdlLCBTZXNzaW9uU3RvcmFnZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zaGFyZWQvaW5kZXgnO1xyXG5pbXBvcnQgeyBQcm9qZWN0IH0gZnJvbSAnLi4vLi4vbW9kZWwvcHJvamVjdCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAnYmktcHJvamVjdC1pdGVtJyxcclxuICB0ZW1wbGF0ZVVybDogJ3Byb2plY3QtaXRlbS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJ3Byb2plY3QtaXRlbS5jb21wb25lbnQuY3NzJ11cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9qZWN0SXRlbUNvbXBvbmVudCB7XHJcblxyXG4gIEBJbnB1dCgpIHByb2plY3QgOiAgUHJvamVjdDtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIpIHtcclxuICB9XHJcblxyXG4gIG5hdmlnYXRlVG9TZWxlY3RlZFByb2plY3QocHJvamVjdElkOnN0cmluZyxwcm9qZWN0TmFtZTpzdHJpbmcpIHtcclxuICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lELCBwcm9qZWN0SWQpO1xyXG4gICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfTkFNRSwgcHJvamVjdE5hbWUpO1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9QUk9KRUNULCBwcm9qZWN0SWQsIE5hdmlnYXRpb25Sb3V0ZXMuQVBQX0NPU1RfU1VNTUFSWV0pO1xyXG4gIH1cclxufVxyXG4iXX0=
