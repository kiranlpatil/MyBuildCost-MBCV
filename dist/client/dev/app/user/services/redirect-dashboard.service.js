"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var RedirectRecruiterDashboardService = (function () {
    function RedirectRecruiterDashboardService() {
        this._showRedirectSource = new Subject_1.Subject();
        this.showTest$ = this._showRedirectSource.asObservable();
    }
    RedirectRecruiterDashboardService.prototype.change = function (isShow) {
        this._showRedirectSource.next(isShow);
    };
    RedirectRecruiterDashboardService = __decorate([
        core_1.Injectable()
    ], RedirectRecruiterDashboardService);
    return RedirectRecruiterDashboardService;
}());
exports.RedirectRecruiterDashboardService = RedirectRecruiterDashboardService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91c2VyL3NlcnZpY2VzL3JlZGlyZWN0LWRhc2hib2FyZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsc0NBQTJDO0FBQzNDLHdDQUF1QztBQUd2QztJQURBO1FBSUUsd0JBQW1CLEdBQUcsSUFBSSxpQkFBTyxFQUFXLENBQUM7UUFHN0MsY0FBUyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQVF0RCxDQUFDO0lBTEMsa0RBQU0sR0FBTixVQUFPLE1BQWU7UUFDcEIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBWFUsaUNBQWlDO1FBRDdDLGlCQUFVLEVBQUU7T0FDQSxpQ0FBaUMsQ0FjN0M7SUFBRCx3Q0FBQztDQWRELEFBY0MsSUFBQTtBQWRZLDhFQUFpQyIsImZpbGUiOiJhcHAvdXNlci9zZXJ2aWNlcy9yZWRpcmVjdC1kYXNoYm9hcmQuc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMvU3ViamVjdCc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBSZWRpcmVjdFJlY3J1aXRlckRhc2hib2FyZFNlcnZpY2Uge1xyXG5cclxuICAvLyBPYnNlcnZhYmxlIHN0cmluZyBzb3VyY2VzXHJcbiAgX3Nob3dSZWRpcmVjdFNvdXJjZSA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XHJcblxyXG4gIC8vIE9ic2VydmFibGUgc3RyaW5nIHN0cmVhbXNcclxuICBzaG93VGVzdCQgPSB0aGlzLl9zaG93UmVkaXJlY3RTb3VyY2UuYXNPYnNlcnZhYmxlKCk7XHJcblxyXG4gIC8vIFNlcnZpY2UgbWVzc2FnZSBjb21tYW5kc1xyXG4gIGNoYW5nZShpc1Nob3c6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuX3Nob3dSZWRpcmVjdFNvdXJjZS5uZXh0KGlzU2hvdyk7XHJcbiAgfVxyXG5cclxuXHJcbn1cclxuIl19
