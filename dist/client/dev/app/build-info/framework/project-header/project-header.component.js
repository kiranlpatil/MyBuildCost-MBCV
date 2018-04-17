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
var index_1 = require("../../../shared/index");
var constants_1 = require("../../../shared/constants");
var ProjectHeaderComponent = (function () {
    function ProjectHeaderComponent(_router) {
        this._router = _router;
    }
    ProjectHeaderComponent.prototype.ngOnInit = function () {
        this.getCurrentProjectId();
    };
    ProjectHeaderComponent.prototype.getCurrentProjectId = function () {
        return index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
    };
    ProjectHeaderComponent.prototype.goToCreateBuilding = function () {
        this._router.navigate([constants_1.NavigationRoutes.APP_CREATE_BUILDING]);
    };
    ProjectHeaderComponent.prototype.getMenus = function () {
        return constants_1.Menus;
    };
    ProjectHeaderComponent.prototype.getCurrentView = function () {
        return index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_VIEW);
    };
    ProjectHeaderComponent.prototype.currentView = function () {
        return constants_1.CurrentView;
    };
    ProjectHeaderComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-project-header',
            templateUrl: 'project-header.component.html',
            styleUrls: ['./project-header.component.css']
        }),
        __metadata("design:paramtypes", [router_1.Router])
    ], ProjectHeaderComponent);
    return ProjectHeaderComponent;
}());
exports.ProjectHeaderComponent = ProjectHeaderComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0LWhlYWRlci9wcm9qZWN0LWhlYWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBa0Q7QUFDbEQsMENBQXlDO0FBQ3pDLCtDQUE4RTtBQUM5RSx1REFBaUY7QUFTakY7SUFFRSxnQ0FBb0IsT0FBZTtRQUFmLFlBQU8sR0FBUCxPQUFPLENBQVE7SUFDbkMsQ0FBQztJQUVELHlDQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQsb0RBQW1CLEdBQW5CO1FBQ0UsTUFBTSxDQUFDLDZCQUFxQixDQUFDLGVBQWUsQ0FBQyxzQkFBYyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDbEYsQ0FBQztJQUVELG1EQUFrQixHQUFsQjtRQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsNEJBQWdCLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCx5Q0FBUSxHQUFSO1FBQ0UsTUFBTSxDQUFDLGlCQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsK0NBQWMsR0FBZDtRQUNFLE1BQU0sQ0FBQyw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRUQsNENBQVcsR0FBWDtRQUNFLE1BQU0sQ0FBQyx1QkFBVyxDQUFDO0lBQ3JCLENBQUM7SUEzQlUsc0JBQXNCO1FBUGxDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLG1CQUFtQjtZQUM3QixXQUFXLEVBQUUsK0JBQStCO1lBQzVDLFNBQVMsRUFBQyxDQUFDLGdDQUFnQyxDQUFDO1NBQzdDLENBQUM7eUNBSTZCLGVBQU07T0FGeEIsc0JBQXNCLENBNkJsQztJQUFELDZCQUFDO0NBN0JELEFBNkJDLElBQUE7QUE3Qlksd0RBQXNCIiwiZmlsZSI6ImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0LWhlYWRlci9wcm9qZWN0LWhlYWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBTZXNzaW9uU3RvcmFnZSwgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL2luZGV4JztcclxuaW1wb3J0IHsgTWVudXMsIE5hdmlnYXRpb25Sb3V0ZXMsIEN1cnJlbnRWaWV3IH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAnYmktcHJvamVjdC1oZWFkZXInLFxyXG4gIHRlbXBsYXRlVXJsOiAncHJvamVjdC1oZWFkZXIuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczpbJy4vcHJvamVjdC1oZWFkZXIuY29tcG9uZW50LmNzcyddXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgUHJvamVjdEhlYWRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3JvdXRlcjogUm91dGVyKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuZ2V0Q3VycmVudFByb2plY3RJZCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q3VycmVudFByb2plY3RJZCgpIHtcclxuICAgIHJldHVybiBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfUFJPSkVDVF9JRCk7XHJcbiAgfVxyXG5cclxuICBnb1RvQ3JlYXRlQnVpbGRpbmcoKSB7XHJcbiAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW05hdmlnYXRpb25Sb3V0ZXMuQVBQX0NSRUFURV9CVUlMRElOR10pO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWVudXMoKSB7XHJcbiAgICByZXR1cm4gTWVudXM7XHJcbiAgfVxyXG5cclxuICBnZXRDdXJyZW50VmlldygpIHtcclxuICAgIHJldHVybiBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfVklFVyk7XHJcbiAgfVxyXG5cclxuICBjdXJyZW50VmlldygpIHtcclxuICAgIHJldHVybiBDdXJyZW50VmlldztcclxuICB9XHJcblxyXG59XHJcbiJdfQ==
