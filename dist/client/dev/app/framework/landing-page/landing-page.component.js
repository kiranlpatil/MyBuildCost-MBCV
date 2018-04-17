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
var index_1 = require("../../shared/index");
var router_1 = require("@angular/router");
var LandingPageComponent = (function () {
    function LandingPageComponent(_router) {
        this._router = _router;
        this.BODY_BACKGROUND = index_1.ImagePath.BODY_BACKGROUND;
        this.MY_LOGO = index_1.ImagePath.MY_WHITE_LOGO;
    }
    LandingPageComponent.prototype.goToSignUp = function () {
        this._router.navigate([index_1.NavigationRoutes.APP_REGISTRATION]);
    };
    LandingPageComponent.prototype.goToSignIn = function () {
        this._router.navigate([index_1.NavigationRoutes.APP_LOGIN]);
    };
    LandingPageComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'landing-page',
            templateUrl: 'landing-page.component.html',
            styleUrls: ['landing-page.component.css'],
        }),
        __metadata("design:paramtypes", [router_1.Router])
    ], LandingPageComponent);
    return LandingPageComponent;
}());
exports.LandingPageComponent = LandingPageComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvbGFuZGluZy1wYWdlL2xhbmRpbmctcGFnZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBMEM7QUFDMUMsNENBQWlFO0FBQ2pFLDBDQUF5QztBQVF6QztJQUdFLDhCQUFvQixPQUFlO1FBQWYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNqQyxJQUFJLENBQUMsZUFBZSxHQUFHLGlCQUFTLENBQUMsZUFBZSxDQUFDO1FBQ2pELElBQUksQ0FBQyxPQUFPLEdBQUcsaUJBQVMsQ0FBQyxhQUFhLENBQUM7SUFDekMsQ0FBQztJQUNELHlDQUFVLEdBQVY7UUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBRSxDQUFDLHdCQUFnQixDQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBQ0QseUNBQVUsR0FBVjtRQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsd0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBWlUsb0JBQW9CO1FBTmhDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLGNBQWM7WUFDeEIsV0FBVyxFQUFFLDZCQUE2QjtZQUMxQyxTQUFTLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQztTQUMxQyxDQUFDO3lDQUk2QixlQUFNO09BSHhCLG9CQUFvQixDQWFoQztJQUFELDJCQUFDO0NBYkQsQUFhQyxJQUFBO0FBYlksb0RBQW9CIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvbGFuZGluZy1wYWdlL2xhbmRpbmctcGFnZS5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSW1hZ2VQYXRoLCBOYXZpZ2F0aW9uUm91dGVzIH0gZnJvbSAnLi4vLi4vc2hhcmVkL2luZGV4JztcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICdsYW5kaW5nLXBhZ2UnLFxyXG4gIHRlbXBsYXRlVXJsOiAnbGFuZGluZy1wYWdlLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnbGFuZGluZy1wYWdlLmNvbXBvbmVudC5jc3MnXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIExhbmRpbmdQYWdlQ29tcG9uZW50IHtcclxuICBCT0RZX0JBQ0tHUk9VTkQ6IHN0cmluZztcclxuICBNWV9MT0dPOiBzdHJpbmc7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIpIHtcclxuICAgIHRoaXMuQk9EWV9CQUNLR1JPVU5EID0gSW1hZ2VQYXRoLkJPRFlfQkFDS0dST1VORDtcclxuICAgIHRoaXMuTVlfTE9HTyA9IEltYWdlUGF0aC5NWV9XSElURV9MT0dPO1xyXG4gIH1cclxuICBnb1RvU2lnblVwKCkge1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKCBbTmF2aWdhdGlvblJvdXRlcy4gQVBQX1JFR0lTVFJBVElPTl0pO1xyXG4gIH1cclxuICBnb1RvU2lnbkluKCkge1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9MT0dJTl0pO1xyXG4gIH1cclxufVxyXG4iXX0=
