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
var project_service_1 = require("../../project/project.service");
var SharePrintPageComponent = (function () {
    function SharePrintPageComponent(projectService, _router) {
        this.projectService = projectService;
        this._router = _router;
    }
    SharePrintPageComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-share-print-page',
            templateUrl: 'share-print-page.component.html',
            styleUrls: ['./share-print-page.component.css']
        }),
        __metadata("design:paramtypes", [project_service_1.ProjectService, router_1.Router])
    ], SharePrintPageComponent);
    return SharePrintPageComponent;
}());
exports.SharePrintPageComponent = SharePrintPageComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0LWhlYWRlci9zaGFyZS1wcmludC1wYWdlL3NoYXJlLXByaW50LXBhZ2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQWtEO0FBQ2xELDBDQUF5QztBQUN6QyxpRUFBK0Q7QUFTL0Q7SUFFRyxpQ0FBb0IsY0FBOEIsRUFBVSxPQUFlO1FBQXZELG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQVE7SUFDNUUsQ0FBQztJQUhVLHVCQUF1QjtRQVBuQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSxxQkFBcUI7WUFDL0IsV0FBVyxFQUFFLGlDQUFpQztZQUM5QyxTQUFTLEVBQUMsQ0FBQyxrQ0FBa0MsQ0FBQztTQUMvQyxDQUFDO3lDQUlxQyxnQ0FBYyxFQUFtQixlQUFNO09BRmpFLHVCQUF1QixDQUluQztJQUFELDhCQUFDO0NBSkQsQUFJQyxJQUFBO0FBSlksMERBQXVCIiwiZmlsZSI6ImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0LWhlYWRlci9zaGFyZS1wcmludC1wYWdlL3NoYXJlLXByaW50LXBhZ2UuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgUHJvamVjdFNlcnZpY2UgfSBmcm9tICcuLi8uLi9wcm9qZWN0L3Byb2plY3Quc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAnYmktc2hhcmUtcHJpbnQtcGFnZScsXHJcbiAgdGVtcGxhdGVVcmw6ICdzaGFyZS1wcmludC1wYWdlLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6WycuL3NoYXJlLXByaW50LXBhZ2UuY29tcG9uZW50LmNzcyddXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgU2hhcmVQcmludFBhZ2VDb21wb25lbnQge1xyXG5cclxuICAgY29uc3RydWN0b3IocHJpdmF0ZSBwcm9qZWN0U2VydmljZTogUHJvamVjdFNlcnZpY2UsIHByaXZhdGUgX3JvdXRlcjogUm91dGVyKSB7XHJcbiAgfVxyXG59XHJcbiJdfQ==
