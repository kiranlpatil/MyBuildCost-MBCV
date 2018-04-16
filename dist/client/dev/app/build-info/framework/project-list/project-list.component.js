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
var project_service_1 = require("../project/project.service");
var ProjectListComponent = (function () {
    function ProjectListComponent(projectService, _router) {
        this.projectService = projectService;
        this._router = _router;
    }
    ProjectListComponent.prototype.ngOnInit = function () {
        this.getAllProjects();
    };
    ProjectListComponent.prototype.createProject = function () {
        this._router.navigate([constants_1.NavigationRoutes.APP_CREATE_PROJECT]);
    };
    ProjectListComponent.prototype.getAllProjects = function () {
        var _this = this;
        this.projectService.getAllProjects().subscribe(function (projects) { return _this.onGetAllProjectSuccess(projects); }, function (error) { return _this.onGetAllProjectFailure(error); });
    };
    ProjectListComponent.prototype.onGetAllProjectSuccess = function (projects) {
        this.projects = projects.data;
    };
    ProjectListComponent.prototype.onGetAllProjectFailure = function (error) {
        console.log(error);
    };
    ProjectListComponent.prototype.getButton = function () {
        return constants_1.Button;
    };
    ProjectListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-project-list',
            templateUrl: 'project-list.component.html',
            styleUrls: ['project-list.component.css']
        }),
        __metadata("design:paramtypes", [project_service_1.ProjectService, router_1.Router])
    ], ProjectListComponent);
    return ProjectListComponent;
}());
exports.ProjectListComponent = ProjectListComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0LWxpc3QvcHJvamVjdC1saXN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFrRDtBQUNsRCwwQ0FBeUM7QUFDekMsdURBQXFFO0FBQ3JFLDhEQUE0RDtBQVU1RDtJQUlFLDhCQUFvQixjQUE4QixFQUFVLE9BQWU7UUFBdkQsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUTtJQUMzRSxDQUFDO0lBRUQsdUNBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsNENBQWEsR0FBYjtRQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsNEJBQWdCLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCw2Q0FBYyxHQUFkO1FBQUEsaUJBS0M7UUFKQyxJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsRUFBRSxDQUFDLFNBQVMsQ0FDNUMsVUFBQSxRQUFRLElBQUksT0FBQSxLQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDLEVBQXJDLENBQXFDLEVBQ2pELFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxFQUFsQyxDQUFrQyxDQUM1QyxDQUFDO0lBQ0osQ0FBQztJQUVELHFEQUFzQixHQUF0QixVQUF1QixRQUFjO1FBQ25DLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNoQyxDQUFDO0lBRUQscURBQXNCLEdBQXRCLFVBQXVCLEtBQVc7UUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQsd0NBQVMsR0FBVDtRQUNFLE1BQU0sQ0FBQyxrQkFBTSxDQUFDO0lBQ2hCLENBQUM7SUFoQ1Usb0JBQW9CO1FBUGhDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLGlCQUFpQjtZQUMzQixXQUFXLEVBQUUsNkJBQTZCO1lBQzFDLFNBQVMsRUFBRSxDQUFDLDRCQUE0QixDQUFDO1NBQzFDLENBQUM7eUNBTW9DLGdDQUFjLEVBQW1CLGVBQU07T0FKaEUsb0JBQW9CLENBaUNoQztJQUFELDJCQUFDO0NBakNELEFBaUNDLElBQUE7QUFqQ1ksb0RBQW9CIiwiZmlsZSI6ImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0LWxpc3QvcHJvamVjdC1saXN0LmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IE5hdmlnYXRpb25Sb3V0ZXMsIEJ1dHRvbiB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBQcm9qZWN0U2VydmljZSB9IGZyb20gJy4uL3Byb2plY3QvcHJvamVjdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUHJvamVjdCB9IGZyb20gJy4vLi4vbW9kZWwvcHJvamVjdCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAnYmktcHJvamVjdC1saXN0JyxcclxuICB0ZW1wbGF0ZVVybDogJ3Byb2plY3QtbGlzdC5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJ3Byb2plY3QtbGlzdC5jb21wb25lbnQuY3NzJ11cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9qZWN0TGlzdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIHByb2plY3RzIDogQXJyYXk8UHJvamVjdD47XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJvamVjdFNlcnZpY2U6IFByb2plY3RTZXJ2aWNlLCBwcml2YXRlIF9yb3V0ZXI6IFJvdXRlcikge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLmdldEFsbFByb2plY3RzKCk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVQcm9qZWN0KCkge1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9DUkVBVEVfUFJPSkVDVF0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0QWxsUHJvamVjdHMoKSB7XHJcbiAgICB0aGlzLnByb2plY3RTZXJ2aWNlLmdldEFsbFByb2plY3RzKCkuc3Vic2NyaWJlKFxyXG4gICAgICBwcm9qZWN0cyA9PiB0aGlzLm9uR2V0QWxsUHJvamVjdFN1Y2Nlc3MocHJvamVjdHMpLFxyXG4gICAgICBlcnJvciA9PiB0aGlzLm9uR2V0QWxsUHJvamVjdEZhaWx1cmUoZXJyb3IpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgb25HZXRBbGxQcm9qZWN0U3VjY2Vzcyhwcm9qZWN0cyA6IGFueSkge1xyXG4gICAgdGhpcy5wcm9qZWN0cyA9IHByb2plY3RzLmRhdGE7XHJcbiAgfVxyXG5cclxuICBvbkdldEFsbFByb2plY3RGYWlsdXJlKGVycm9yIDogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgfVxyXG5cclxuICBnZXRCdXR0b24oKSB7XHJcbiAgICByZXR1cm4gQnV0dG9uO1xyXG4gIH1cclxufVxyXG4iXX0=
