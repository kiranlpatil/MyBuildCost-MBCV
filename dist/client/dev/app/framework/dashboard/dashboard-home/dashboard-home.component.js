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
var router_1 = require("@angular/router");
var core_1 = require("@angular/core");
var loaders_service_1 = require("../../../shared/loader/loaders.service");
var index_1 = require("../../../shared/index");
var DashboardHomeComponent = (function () {
    function DashboardHomeComponent(_router, loaderService) {
        this._router = _router;
        this.loaderService = loaderService;
    }
    DashboardHomeComponent.prototype.ngOnInit = function () {
        document.body.scrollTop = 0;
    };
    DashboardHomeComponent.prototype.goToCreateProject = function () {
        this._router.navigate([index_1.NavigationRoutes.APP_CREATE_PROJECT]);
    };
    DashboardHomeComponent.prototype.goToAddBuilding = function () {
        this._router.navigate([index_1.NavigationRoutes.APP_CREATE_BUILDING]);
    };
    DashboardHomeComponent.prototype.goToViewProject = function () {
        this._router.navigate([index_1.NavigationRoutes.APP_LIST_PROJECT]);
    };
    DashboardHomeComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-dashboard-home',
            templateUrl: 'dashboard-home.component.html',
            styleUrls: ['dashboard-home.component.css']
        }),
        __metadata("design:paramtypes", [router_1.Router, loaders_service_1.LoaderService])
    ], DashboardHomeComponent);
    return DashboardHomeComponent;
}());
exports.DashboardHomeComponent = DashboardHomeComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGFzaGJvYXJkL2Rhc2hib2FyZC1ob21lL2Rhc2hib2FyZC1ob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLDBDQUF5QztBQUN6QyxzQ0FBa0Q7QUFDbEQsMEVBQXVFO0FBQ3ZFLCtDQUF5RDtBQU96RDtJQUVFLGdDQUFvQixPQUFlLEVBQVUsYUFBNEI7UUFBckQsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFlO0lBRXpFLENBQUM7SUFFRCx5Q0FBUSxHQUFSO1FBQ0UsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxrREFBaUIsR0FBakI7UUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLHdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsZ0RBQWUsR0FBZjtRQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsd0JBQWdCLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxnREFBZSxHQUFmO1FBQ0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyx3QkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQXBCVSxzQkFBc0I7UUFObEMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsbUJBQW1CO1lBQzdCLFdBQVcsRUFBRSwrQkFBK0I7WUFDNUMsU0FBUyxFQUFFLENBQUMsOEJBQThCLENBQUM7U0FDNUMsQ0FBQzt5Q0FHNkIsZUFBTSxFQUF5QiwrQkFBYTtPQUY5RCxzQkFBc0IsQ0FxQmxDO0lBQUQsNkJBQUM7Q0FyQkQsQUFxQkMsSUFBQTtBQXJCWSx3REFBc0IiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXNoYm9hcmQvZGFzaGJvYXJkLWhvbWUvZGFzaGJvYXJkLWhvbWUuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTG9hZGVyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9sb2FkZXIvbG9hZGVycy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTmF2aWdhdGlvblJvdXRlcyB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICdteS1kYXNoYm9hcmQtaG9tZScsXHJcbiAgdGVtcGxhdGVVcmw6ICdkYXNoYm9hcmQtaG9tZS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJ2Rhc2hib2FyZC1ob21lLmNvbXBvbmVudC5jc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGFzaGJvYXJkSG9tZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3JvdXRlcjogUm91dGVyLCBwcml2YXRlIGxvYWRlclNlcnZpY2U6IExvYWRlclNlcnZpY2UpIHtcclxuXHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gMDtcclxuICB9XHJcblxyXG4gIGdvVG9DcmVhdGVQcm9qZWN0KCkge1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9DUkVBVEVfUFJPSkVDVF0pO1xyXG4gIH1cclxuXHJcbiAgZ29Ub0FkZEJ1aWxkaW5nKCkge1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9DUkVBVEVfQlVJTERJTkddKTtcclxuICB9XHJcblxyXG4gIGdvVG9WaWV3UHJvamVjdCgpIHtcclxuICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbTmF2aWdhdGlvblJvdXRlcy5BUFBfTElTVF9QUk9KRUNUXSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==
