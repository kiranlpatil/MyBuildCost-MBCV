"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var http_1 = require("@angular/http");
var base_service_1 = require("../../shared/services/http/base.service");
var UsageTrackingService = (function (_super) {
    __extends(UsageTrackingService, _super);
    function UsageTrackingService(http) {
        var _this = _super.call(this) || this;
        _this.http = http;
        return _this;
    }
    UsageTrackingService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], UsageTrackingService);
    return UsageTrackingService;
}(base_service_1.BaseService));
exports.UsageTrackingService = UsageTrackingService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay91c2FnZS10cmFja2luZy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNDQUF5QztBQUN6QyxzQ0FBcUM7QUFDckMsd0VBQW9FO0FBSXBFO0lBQTBDLHdDQUFXO0lBRW5ELDhCQUFvQixJQUFVO1FBQTlCLFlBQ0UsaUJBQU8sU0FDUjtRQUZtQixVQUFJLEdBQUosSUFBSSxDQUFNOztJQUU5QixDQUFDO0lBSlUsb0JBQW9CO1FBRmhDLGlCQUFVLEVBQUU7eUNBSWUsV0FBSTtPQUZuQixvQkFBb0IsQ0FLaEM7SUFBRCwyQkFBQztDQUxELEFBS0MsQ0FMeUMsMEJBQVcsR0FLcEQ7QUFMWSxvREFBb0IiLCJmaWxlIjoiYXBwL2J1aWxkLWluZm8vZnJhbWV3b3JrL3VzYWdlLXRyYWNraW5nLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IEh0dHAgfSBmcm9tIFwiQGFuZ3VsYXIvaHR0cFwiO1xyXG5pbXBvcnQge0Jhc2VTZXJ2aWNlfSBmcm9tIFwiLi4vLi4vc2hhcmVkL3NlcnZpY2VzL2h0dHAvYmFzZS5zZXJ2aWNlXCI7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcblxyXG5leHBvcnQgY2xhc3MgVXNhZ2VUcmFja2luZ1NlcnZpY2UgZXh0ZW5kcyBCYXNlU2VydmljZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cCkge1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcbn1cclxuIl19
