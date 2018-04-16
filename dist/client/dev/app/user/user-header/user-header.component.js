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
var index_1 = require("../../shared/index");
var constants_1 = require("../../shared/constants");
var UserHeaderComponent = (function () {
    function UserHeaderComponent(loaderService, _router) {
        this.loaderService = loaderService;
        this._router = _router;
        this.BODY_BACKGROUND = index_1.ImagePath.BODY_BACKGROUND;
    }
    UserHeaderComponent.prototype.onLogin = function () {
        this._router.navigate([index_1.NavigationRoutes.APP_LOGIN]);
    };
    UserHeaderComponent.prototype.onSignUp = function () {
        this._router.navigate([index_1.NavigationRoutes.APP_REGISTRATION]);
    };
    UserHeaderComponent.prototype.onApplicantSignUp = function () {
        this._router.navigate(['/applicant-signup']);
    };
    UserHeaderComponent.prototype.onHomePage = function () {
        window.sessionStorage.clear();
        window.localStorage.clear();
        var host = constants_1.AppSettings.HTTP_CLIENT + constants_1.AppSettings.HOST_NAME;
        window.location.href = host;
    };
    UserHeaderComponent.prototype.getImagePath = function () {
        return index_1.ImagePath;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], UserHeaderComponent.prototype, "MainHeaderMenuHideShow", void 0);
    UserHeaderComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'cn-user-header',
            templateUrl: 'user-header.component.html',
            styleUrls: ['user-header.component.css'],
        }),
        __metadata("design:paramtypes", [index_1.LoaderService, router_1.Router])
    ], UserHeaderComponent);
    return UserHeaderComponent;
}());
exports.UserHeaderComponent = UserHeaderComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91c2VyL3VzZXItaGVhZGVyL3VzZXItaGVhZGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFpRDtBQUNqRCwwQ0FBeUM7QUFDekMsNENBQWdGO0FBQ2hGLG9EQUFxRDtBQVFyRDtJQUdFLDZCQUFvQixhQUE0QixFQUFVLE9BQWU7UUFBckQsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ3ZFLElBQUksQ0FBQyxlQUFlLEdBQUcsaUJBQVMsQ0FBQyxlQUFlLENBQUM7SUFDbkQsQ0FBQztJQUVELHFDQUFPLEdBQVA7UUFDSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLHdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELHNDQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLHdCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBQ0QsK0NBQWlCLEdBQWpCO1FBQ0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVDLHdDQUFVLEdBQVY7UUFDRSxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDNUIsSUFBSSxJQUFJLEdBQUcsdUJBQVcsQ0FBQyxXQUFXLEdBQUcsdUJBQVcsQ0FBQyxTQUFTLENBQUM7UUFDM0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQzlCLENBQUM7SUFFSCwwQ0FBWSxHQUFaO1FBQ0UsTUFBTSxDQUFDLGlCQUFTLENBQUM7SUFDbkIsQ0FBQztJQXpCUTtRQUFSLFlBQUssRUFBRTs7dUVBQStCO0lBRjVCLG1CQUFtQjtRQU4vQixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsV0FBVyxFQUFFLDRCQUE0QjtZQUN6QyxTQUFTLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQztTQUN6QyxDQUFDO3lDQUltQyxxQkFBYSxFQUFtQixlQUFNO09BSDlELG1CQUFtQixDQTRCL0I7SUFBRCwwQkFBQztDQTVCRCxBQTRCQyxJQUFBO0FBNUJZLGtEQUFtQiIsImZpbGUiOiJhcHAvdXNlci91c2VyLWhlYWRlci91c2VyLWhlYWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IEltYWdlUGF0aCwgTG9hZGVyU2VydmljZSwgTmF2aWdhdGlvblJvdXRlcyB9IGZyb20gJy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IEFwcFNldHRpbmdzIH0gZnJvbSAnLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAnY24tdXNlci1oZWFkZXInLFxyXG4gIHRlbXBsYXRlVXJsOiAndXNlci1oZWFkZXIuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWyd1c2VyLWhlYWRlci5jb21wb25lbnQuY3NzJ10sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBVc2VySGVhZGVyQ29tcG9uZW50IHtcclxuICBCT0RZX0JBQ0tHUk9VTkQ6IHN0cmluZztcclxuICBASW5wdXQoKSBNYWluSGVhZGVyTWVudUhpZGVTaG93OnN0cmluZztcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGxvYWRlclNlcnZpY2U6IExvYWRlclNlcnZpY2UsIHByaXZhdGUgX3JvdXRlcjogUm91dGVyKSB7XHJcbiAgICB0aGlzLkJPRFlfQkFDS0dST1VORCA9IEltYWdlUGF0aC5CT0RZX0JBQ0tHUk9VTkQ7XHJcbiAgfVxyXG5cclxuICBvbkxvZ2luKCkge1xyXG4gICAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW05hdmlnYXRpb25Sb3V0ZXMuQVBQX0xPR0lOXSk7XHJcbiAgfVxyXG5cclxuICBvblNpZ25VcCgpIHtcclxuICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbTmF2aWdhdGlvblJvdXRlcy5BUFBfUkVHSVNUUkFUSU9OXSk7XHJcbiAgfVxyXG4gIG9uQXBwbGljYW50U2lnblVwKCkge1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFsnL2FwcGxpY2FudC1zaWdudXAnXSk7XHJcbiAgfVxyXG5cclxuICAgIG9uSG9tZVBhZ2UoKSB7XHJcbiAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5jbGVhcigpO1xyXG4gICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLmNsZWFyKCk7XHJcbiAgICAgIGxldCBob3N0ID0gQXBwU2V0dGluZ3MuSFRUUF9DTElFTlQgKyBBcHBTZXR0aW5ncy5IT1NUX05BTUU7XHJcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gaG9zdDtcclxuICAgIH1cclxuXHJcbiAgZ2V0SW1hZ2VQYXRoKCkge1xyXG4gICAgcmV0dXJuIEltYWdlUGF0aDtcclxuICB9XHJcbn1cclxuXHJcbiJdfQ==
