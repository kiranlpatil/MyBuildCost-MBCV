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
var loaders_service_1 = require("./loaders.service");
var LoaderComponent = (function () {
    function LoaderComponent(loaderService) {
        var _this = this;
        this.loaderService = loaderService;
        loaderService.status.subscribe(function (status) {
            _this.status = status;
        });
    }
    LoaderComponent = __decorate([
        core_1.Component({
            selector: 'cn-app-loader',
            template: "\n    <div *ngIf='status' class='loader-container'>\n      <img src=\"assets/build-info/loader/main-loading.svg\" height=\"20\" width=\"160\" style=\"margin-top: 400px;\"/>\n    </div>"
        }),
        __metadata("design:paramtypes", [loaders_service_1.LoaderService])
    ], LoaderComponent);
    return LoaderComponent;
}());
exports.LoaderComponent = LoaderComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvbG9hZGVyL2xvYWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBMEM7QUFDMUMscURBQWtEO0FBU2xEO0lBSUUseUJBQTJCLGFBQTRCO1FBQXZELGlCQUtDO1FBTDBCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQ3JELGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQUMsTUFBZTtZQUM3QyxLQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUVMLENBQUM7SUFUVSxlQUFlO1FBUDNCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsZUFBZTtZQUN6QixRQUFRLEVBQUUsMExBR0Q7U0FDVixDQUFDO3lDQUswQywrQkFBYTtPQUo1QyxlQUFlLENBVzNCO0lBQUQsc0JBQUM7Q0FYRCxBQVdDLElBQUE7QUFYWSwwQ0FBZSIsImZpbGUiOiJhcHAvc2hhcmVkL2xvYWRlci9sb2FkZXIuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IExvYWRlclNlcnZpY2UgfSBmcm9tICcuL2xvYWRlcnMuc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2NuLWFwcC1sb2FkZXInLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8ZGl2ICpuZ0lmPSdzdGF0dXMnIGNsYXNzPSdsb2FkZXItY29udGFpbmVyJz5cclxuICAgICAgPGltZyBzcmM9XCJhc3NldHMvYnVpbGQtaW5mby9sb2FkZXIvbWFpbi1sb2FkaW5nLnN2Z1wiIGhlaWdodD1cIjIwXCIgd2lkdGg9XCIxNjBcIiBzdHlsZT1cIm1hcmdpbi10b3A6IDQwMHB4O1wiLz5cclxuICAgIDwvZGl2PmBcclxufSlcclxuZXhwb3J0IGNsYXNzIExvYWRlckNvbXBvbmVudCB7XHJcblxyXG4gIHN0YXR1czogYm9vbGVhbjtcclxuXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKHByaXZhdGUgbG9hZGVyU2VydmljZTogTG9hZGVyU2VydmljZSkge1xyXG4gICAgbG9hZGVyU2VydmljZS5zdGF0dXMuc3Vic2NyaWJlKChzdGF0dXM6IGJvb2xlYW4pID0+IHtcclxuICAgICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxufVxyXG4iXX0=
