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
var ActivateEmailComponent = (function () {
    function ActivateEmailComponent(_router) {
        this._router = _router;
        this.activationMessage = constants_1.Messages.MSG_EMAIL_ACTIVATION;
        this.MY_LOGO_PATH = constants_1.ImagePath.MY_WHITE_LOGO;
        this.UNDER_LICENCE = constants_1.ProjectAsset.UNDER_LICENECE;
        this.MY_TAG_LINE = constants_1.ProjectAsset.TAG_LINE;
        this.BODY_BACKGROUND = constants_1.ImagePath.BODY_BACKGROUND;
    }
    ActivateEmailComponent.prototype.navigateTo = function () {
        this._router.navigate([constants_1.NavigationRoutes.APP_LOGIN]);
    };
    ActivateEmailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'cn-activate-email',
            templateUrl: 'activate-email.component.html',
            styleUrls: ['activate-email.component.css'],
        }),
        __metadata("design:paramtypes", [router_1.Router])
    ], ActivateEmailComponent);
    return ActivateEmailComponent;
}());
exports.ActivateEmailComponent = ActivateEmailComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91c2VyL3NldHRpbmdzL2FjdGl2YXRlLWVtYWlsL2FjdGl2YXRlLWVtYWlsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUEwQztBQUMxQywwQ0FBeUM7QUFDekMsdURBQWdHO0FBUWhHO0lBU0UsZ0NBQW9CLE9BQWU7UUFBZixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBRm5DLHNCQUFpQixHQUFXLG9CQUFRLENBQUMsb0JBQW9CLENBQUM7UUFHeEQsSUFBSSxDQUFDLFlBQVksR0FBRyxxQkFBUyxDQUFDLGFBQWEsQ0FBQztRQUM1QyxJQUFJLENBQUMsYUFBYSxHQUFHLHdCQUFZLENBQUMsY0FBYyxDQUFDO1FBQ2pELElBQUksQ0FBQyxXQUFXLEdBQUcsd0JBQVksQ0FBQyxRQUFRLENBQUM7UUFDekMsSUFBSSxDQUFDLGVBQWUsR0FBRyxxQkFBUyxDQUFDLGVBQWUsQ0FBQztJQUNuRCxDQUFDO0lBRUQsMkNBQVUsR0FBVjtRQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsNEJBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBbEJVLHNCQUFzQjtRQU5sQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSxtQkFBbUI7WUFDN0IsV0FBVyxFQUFFLCtCQUErQjtZQUM1QyxTQUFTLEVBQUUsQ0FBQyw4QkFBOEIsQ0FBQztTQUM1QyxDQUFDO3lDQVU2QixlQUFNO09BVHhCLHNCQUFzQixDQW1CbEM7SUFBRCw2QkFBQztDQW5CRCxBQW1CQyxJQUFBO0FBbkJZLHdEQUFzQiIsImZpbGUiOiJhcHAvdXNlci9zZXR0aW5ncy9hY3RpdmF0ZS1lbWFpbC9hY3RpdmF0ZS1lbWFpbC5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgSW1hZ2VQYXRoLCBOYXZpZ2F0aW9uUm91dGVzLCBQcm9qZWN0QXNzZXQsIE1lc3NhZ2VzIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAnY24tYWN0aXZhdGUtZW1haWwnLFxyXG4gIHRlbXBsYXRlVXJsOiAnYWN0aXZhdGUtZW1haWwuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydhY3RpdmF0ZS1lbWFpbC5jb21wb25lbnQuY3NzJ10sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBY3RpdmF0ZUVtYWlsQ29tcG9uZW50IHtcclxuICB0b2tlbjogc3RyaW5nO1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgTVlfTE9HT19QQVRIOiBzdHJpbmc7XHJcbiAgTVlfVEFHX0xJTkU6IHN0cmluZztcclxuICBVTkRFUl9MSUNFTkNFOiBzdHJpbmc7XHJcbiAgQk9EWV9CQUNLR1JPVU5EOiBzdHJpbmc7XHJcbiAgYWN0aXZhdGlvbk1lc3NhZ2U6IHN0cmluZyA9IE1lc3NhZ2VzLk1TR19FTUFJTF9BQ1RJVkFUSU9OO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb3V0ZXI6IFJvdXRlcikge1xyXG4gICAgdGhpcy5NWV9MT0dPX1BBVEggPSBJbWFnZVBhdGguTVlfV0hJVEVfTE9HTztcclxuICAgIHRoaXMuVU5ERVJfTElDRU5DRSA9IFByb2plY3RBc3NldC5VTkRFUl9MSUNFTkVDRTtcclxuICAgIHRoaXMuTVlfVEFHX0xJTkUgPSBQcm9qZWN0QXNzZXQuVEFHX0xJTkU7XHJcbiAgICB0aGlzLkJPRFlfQkFDS0dST1VORCA9IEltYWdlUGF0aC5CT0RZX0JBQ0tHUk9VTkQ7XHJcbiAgfVxyXG5cclxuICBuYXZpZ2F0ZVRvKCkge1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9MT0dJTl0pO1xyXG4gIH1cclxufVxyXG4iXX0=
