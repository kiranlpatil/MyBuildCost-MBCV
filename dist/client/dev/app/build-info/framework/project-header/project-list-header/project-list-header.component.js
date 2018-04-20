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
var project_service_1 = require("../../project/project.service");
var index_1 = require("../../../../shared/index");
var ProjectListHeaderComponent = (function () {
    function ProjectListHeaderComponent(projectService, _router) {
        this.projectService = projectService;
        this._router = _router;
    }
    ProjectListHeaderComponent.prototype.ngOnInit = function () {
        this.currentView = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_VIEW);
        if (index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_NAME) === undefined ||
            index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_NAME) === null) {
            this.selectedProjectName = 'My Projects';
        }
        else {
            this.selectedProjectName = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_NAME);
        }
        this.getAllProjects();
    };
    ProjectListHeaderComponent.prototype.getAllProjects = function () {
        var _this = this;
        this.projectService.getAllProjects().subscribe(function (projects) { return _this.onGetAllProjectsSuccess(projects); }, function (error) { return _this.onGetAllProjectsFailure(error); });
    };
    ProjectListHeaderComponent.prototype.onGetAllProjectsSuccess = function (projects) {
        this.projects = projects.data;
    };
    ProjectListHeaderComponent.prototype.onGetAllProjectsFailure = function (error) {
        console.log(error);
    };
    ProjectListHeaderComponent.prototype.selectedProject = function (projectName) {
        if (projectName === 'My Projects') {
            sessionStorage.removeItem(index_1.SessionStorage.CURRENT_PROJECT_ID);
            sessionStorage.removeItem(index_1.SessionStorage.CURRENT_PROJECT_NAME);
            this._router.navigate([constants_1.NavigationRoutes.APP_DASHBOARD]);
        }
        else {
            index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CURRENT_PROJECT_NAME, projectName);
            var projectList = void 0;
            projectList = this.projects.filter(function (project) {
                return project.name === projectName;
            });
            index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID, projectList[0]._id);
            this._router.navigate([constants_1.NavigationRoutes.APP_PROJECT, projectList[0]._id, constants_1.NavigationRoutes.APP_COST_SUMMARY]);
        }
    };
    ProjectListHeaderComponent.prototype.getMenus = function () {
        return constants_1.Menus;
    };
    ProjectListHeaderComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-project-selector',
            templateUrl: 'project-list-header.component.html',
            styleUrls: ['./project-list-header.component.css']
        }),
        __metadata("design:paramtypes", [project_service_1.ProjectService, router_1.Router])
    ], ProjectListHeaderComponent);
    return ProjectListHeaderComponent;
}());
exports.ProjectListHeaderComponent = ProjectListHeaderComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0LWhlYWRlci9wcm9qZWN0LWxpc3QtaGVhZGVyL3Byb2plY3QtbGlzdC1oZWFkZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQWtEO0FBQ2xELDBDQUF5QztBQUN6QywwREFBdUU7QUFDdkUsaUVBQStEO0FBQy9ELGtEQUFnRjtBQVVoRjtJQU1FLG9DQUFvQixjQUE4QixFQUFVLE9BQWU7UUFBdkQsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUTtJQUMzRSxDQUFDO0lBRUQsNkNBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxXQUFXLEdBQUcsNkJBQXFCLENBQUMsZUFBZSxDQUFDLHNCQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdEYsRUFBRSxDQUFBLENBQUMsNkJBQXFCLENBQUMsZUFBZSxDQUFDLHNCQUFjLENBQUMsb0JBQW9CLENBQUMsS0FBSyxTQUFTO1lBQ3pGLDZCQUFxQixDQUFDLGVBQWUsQ0FBQyxzQkFBYyxDQUFDLG9CQUFvQixDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN0RixJQUFJLENBQUMsbUJBQW1CLEdBQUMsYUFBYSxDQUFDO1FBQ3pDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxtQkFBbUIsR0FBQyw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3RHLENBQUM7UUFDRCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELG1EQUFjLEdBQWQ7UUFBQSxpQkFLQztRQUpDLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFFLENBQUMsU0FBUyxDQUM1QyxVQUFBLFFBQVEsSUFBSSxPQUFBLEtBQUksQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsRUFBdEMsQ0FBc0MsRUFDbEQsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFJLENBQUMsdUJBQXVCLENBQUMsS0FBSyxDQUFDLEVBQW5DLENBQW1DLENBQzdDLENBQUM7SUFDSixDQUFDO0lBRUQsNERBQXVCLEdBQXZCLFVBQXdCLFFBQWM7UUFDcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ2hDLENBQUM7SUFFRCw0REFBdUIsR0FBdkIsVUFBd0IsS0FBVztRQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxvREFBZSxHQUFmLFVBQWdCLFdBQWtCO1FBQy9CLEVBQUUsQ0FBQSxDQUFDLFdBQVcsS0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLGNBQWMsQ0FBQyxVQUFVLENBQUMsc0JBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQzdELGNBQWMsQ0FBQyxVQUFVLENBQUMsc0JBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQy9ELElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsNEJBQWdCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUMxRCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTiw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxvQkFBb0IsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUN4RixJQUFJLFdBQVcsU0FBaUIsQ0FBQztZQUNqQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQ2hDLFVBQVUsT0FBZ0I7Z0JBQ3hCLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLFdBQVcsQ0FBQztZQUN0QyxDQUFDLENBQUMsQ0FBQztZQUNMLDZCQUFxQixDQUFDLGVBQWUsQ0FBQyxzQkFBYyxDQUFDLGtCQUFrQixFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM3RixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLDRCQUFnQixDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLDRCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztRQUMvRyxDQUFDO0lBQ0gsQ0FBQztJQUVELDZDQUFRLEdBQVI7UUFDRSxNQUFNLENBQUMsaUJBQUssQ0FBQztJQUNmLENBQUM7SUF0RFUsMEJBQTBCO1FBUHRDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLHFCQUFxQjtZQUMvQixXQUFXLEVBQUUsb0NBQW9DO1lBQ2pELFNBQVMsRUFBQyxDQUFDLHFDQUFxQyxDQUFDO1NBQ2xELENBQUM7eUNBUW9DLGdDQUFjLEVBQW1CLGVBQU07T0FOaEUsMEJBQTBCLENBdUR0QztJQUFELGlDQUFDO0NBdkRELEFBdURDLElBQUE7QUF2RFksZ0VBQTBCIiwiZmlsZSI6ImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0LWhlYWRlci9wcm9qZWN0LWxpc3QtaGVhZGVyL3Byb2plY3QtbGlzdC1oZWFkZXIuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgTmF2aWdhdGlvblJvdXRlcywgTWVudXMgfSBmcm9tICcuLi8uLi8uLi8uLi9zaGFyZWQvY29uc3RhbnRzJztcclxuaW1wb3J0IHsgUHJvamVjdFNlcnZpY2UgfSBmcm9tICcuLi8uLi9wcm9qZWN0L3Byb2plY3Quc2VydmljZSc7XHJcbmltcG9ydCB7IFNlc3Npb25TdG9yYWdlLFNlc3Npb25TdG9yYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IFByb2plY3QgfSBmcm9tICcuLy4uLy4uL21vZGVsL3Byb2plY3QnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICBzZWxlY3RvcjogJ2JpLXByb2plY3Qtc2VsZWN0b3InLFxyXG4gIHRlbXBsYXRlVXJsOiAncHJvamVjdC1saXN0LWhlYWRlci5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOlsnLi9wcm9qZWN0LWxpc3QtaGVhZGVyLmNvbXBvbmVudC5jc3MnXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIFByb2plY3RMaXN0SGVhZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgcHJvamVjdHMgOiBBcnJheTxQcm9qZWN0PjtcclxuICBzZWxlY3RlZFByb2plY3ROYW1lIDogc3RyaW5nO1xyXG4gIGN1cnJlbnRWaWV3IDogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByb2plY3RTZXJ2aWNlOiBQcm9qZWN0U2VydmljZSwgcHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIpIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5jdXJyZW50VmlldyA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9WSUVXKTtcclxuICAgIGlmKFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX05BTUUpID09PSB1bmRlZmluZWQgfHxcclxuICAgICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfTkFNRSkgPT09IG51bGwpIHtcclxuICAgICAgdGhpcy5zZWxlY3RlZFByb2plY3ROYW1lPSdNeSBQcm9qZWN0cyc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNlbGVjdGVkUHJvamVjdE5hbWU9U2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfTkFNRSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmdldEFsbFByb2plY3RzKCk7XHJcbiAgfVxyXG5cclxuICBnZXRBbGxQcm9qZWN0cygpIHtcclxuICAgIHRoaXMucHJvamVjdFNlcnZpY2UuZ2V0QWxsUHJvamVjdHMoKS5zdWJzY3JpYmUoXHJcbiAgICAgIHByb2plY3RzID0+IHRoaXMub25HZXRBbGxQcm9qZWN0c1N1Y2Nlc3MocHJvamVjdHMpLFxyXG4gICAgICBlcnJvciA9PiB0aGlzLm9uR2V0QWxsUHJvamVjdHNGYWlsdXJlKGVycm9yKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIG9uR2V0QWxsUHJvamVjdHNTdWNjZXNzKHByb2plY3RzIDogYW55KSB7XHJcbiAgICB0aGlzLnByb2plY3RzID0gcHJvamVjdHMuZGF0YTtcclxuICB9XHJcblxyXG4gIG9uR2V0QWxsUHJvamVjdHNGYWlsdXJlKGVycm9yIDogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgfVxyXG5cclxuICBzZWxlY3RlZFByb2plY3QocHJvamVjdE5hbWU6c3RyaW5nKSB7XHJcbiAgICAgaWYocHJvamVjdE5hbWU9PT0nTXkgUHJvamVjdHMnKSB7XHJcbiAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX0lEKTtcclxuICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfTkFNRSk7XHJcbiAgICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbTmF2aWdhdGlvblJvdXRlcy5BUFBfREFTSEJPQVJEXSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfUFJPSkVDVF9OQU1FLCBwcm9qZWN0TmFtZSk7XHJcbiAgICAgIGxldCBwcm9qZWN0TGlzdCA6IEFycmF5PFByb2plY3Q+O1xyXG4gICAgICBwcm9qZWN0TGlzdCA9IHRoaXMucHJvamVjdHMuZmlsdGVyKFxyXG4gICAgICAgIGZ1bmN0aW9uKCBwcm9qZWN0OiBQcm9qZWN0KXtcclxuICAgICAgICAgIHJldHVybiBwcm9qZWN0Lm5hbWUgPT09IHByb2plY3ROYW1lO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfUFJPSkVDVF9JRCwgcHJvamVjdExpc3RbMF0uX2lkKTtcclxuICAgICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9QUk9KRUNULCBwcm9qZWN0TGlzdFswXS5faWQsIE5hdmlnYXRpb25Sb3V0ZXMuQVBQX0NPU1RfU1VNTUFSWV0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0TWVudXMoKSB7XHJcbiAgICByZXR1cm4gTWVudXM7XHJcbiAgfVxyXG59XHJcbiJdfQ==
