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
var index_1 = require("../../../shared/index");
var constants_1 = require("../../../shared/constants");
var router_1 = require("@angular/router");
var CreateNewProjectComponent = (function () {
    function CreateNewProjectComponent(_router) {
        this._router = _router;
        this.BODY_BACKGROUND_TRANSPARENT = index_1.ImagePath.BODY_BACKGROUND_TRANSPARENT;
        this.MY_LOGO = index_1.ImagePath.MY_WHITE_LOGO;
    }
    CreateNewProjectComponent.prototype.goToCreateProject = function () {
        this._router.navigate([index_1.NavigationRoutes.APP_CREATE_PROJECT]);
    };
    CreateNewProjectComponent.prototype.getHeadings = function () {
        return constants_1.Headings;
    };
    CreateNewProjectComponent.prototype.getLabels = function () {
        return constants_1.Label;
    };
    CreateNewProjectComponent.prototype.getButton = function () {
        return constants_1.Button;
    };
    CreateNewProjectComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-create-new-project',
            templateUrl: 'create-new-project.component.html',
            styleUrls: ['create-new-project.component.css'],
        }),
        __metadata("design:paramtypes", [router_1.Router])
    ], CreateNewProjectComponent);
    return CreateNewProjectComponent;
}());
exports.CreateNewProjectComponent = CreateNewProjectComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9jcmVhdGUtbmV3LXByb2plY3QvY3JlYXRlLW5ldy1wcm9qZWN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUEwQztBQUMxQywrQ0FBb0U7QUFDcEUsdURBQW9FO0FBQ3BFLDBDQUF5QztBQVF6QztJQUlFLG1DQUFvQixPQUFlO1FBQWYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNqQyxJQUFJLENBQUMsMkJBQTJCLEdBQUcsaUJBQVMsQ0FBQywyQkFBMkIsQ0FBQztRQUN6RSxJQUFJLENBQUMsT0FBTyxHQUFHLGlCQUFTLENBQUMsYUFBYSxDQUFDO0lBQ3pDLENBQUM7SUFFRCxxREFBaUIsR0FBakI7UUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLHdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsK0NBQVcsR0FBWDtRQUNFLE1BQU0sQ0FBQyxvQkFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFRCw2Q0FBUyxHQUFUO1FBQ0UsTUFBTSxDQUFDLGlCQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsNkNBQVMsR0FBVDtRQUNFLE1BQU0sQ0FBQyxrQkFBTSxDQUFDO0lBQ2hCLENBQUM7SUF2QlUseUJBQXlCO1FBTnJDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLHVCQUF1QjtZQUNqQyxXQUFXLEVBQUUsbUNBQW1DO1lBQ2hELFNBQVMsRUFBRSxDQUFDLGtDQUFrQyxDQUFDO1NBQ2hELENBQUM7eUNBSzZCLGVBQU07T0FKeEIseUJBQXlCLENBd0JyQztJQUFELGdDQUFDO0NBeEJELEFBd0JDLElBQUE7QUF4QlksOERBQXlCIiwiZmlsZSI6ImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9jcmVhdGUtbmV3LXByb2plY3QvY3JlYXRlLW5ldy1wcm9qZWN0LmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBJbWFnZVBhdGgsIE5hdmlnYXRpb25Sb3V0ZXMgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvaW5kZXgnO1xyXG5pbXBvcnQgeyBIZWFkaW5ncywgQnV0dG9uLCBMYWJlbCB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICBzZWxlY3RvcjogJ2JpLWNyZWF0ZS1uZXctcHJvamVjdCcsXHJcbiAgdGVtcGxhdGVVcmw6ICdjcmVhdGUtbmV3LXByb2plY3QuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydjcmVhdGUtbmV3LXByb2plY3QuY29tcG9uZW50LmNzcyddLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ3JlYXRlTmV3UHJvamVjdENvbXBvbmVudCB7XHJcbiAgQk9EWV9CQUNLR1JPVU5EX1RSQU5TUEFSRU5UOiBzdHJpbmc7XHJcbiAgTVlfTE9HTzogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb3V0ZXI6IFJvdXRlcikge1xyXG4gICAgdGhpcy5CT0RZX0JBQ0tHUk9VTkRfVFJBTlNQQVJFTlQgPSBJbWFnZVBhdGguQk9EWV9CQUNLR1JPVU5EX1RSQU5TUEFSRU5UO1xyXG4gICAgdGhpcy5NWV9MT0dPID0gSW1hZ2VQYXRoLk1ZX1dISVRFX0xPR087XHJcbiAgfVxyXG5cclxuICBnb1RvQ3JlYXRlUHJvamVjdCgpIHtcclxuICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbTmF2aWdhdGlvblJvdXRlcy5BUFBfQ1JFQVRFX1BST0pFQ1RdKTtcclxuICB9XHJcblxyXG4gIGdldEhlYWRpbmdzKCkge1xyXG4gICAgcmV0dXJuIEhlYWRpbmdzO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGFiZWxzKCkge1xyXG4gICAgcmV0dXJuIExhYmVsO1xyXG4gIH1cclxuXHJcbiAgZ2V0QnV0dG9uKCkge1xyXG4gICAgcmV0dXJuIEJ1dHRvbjtcclxuICB9XHJcbn1cclxuIl19
