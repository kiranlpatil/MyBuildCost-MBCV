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
var LoaderService = (function () {
    function LoaderService() {
        this.status = new Subject_1.Subject();
    }
    LoaderService.prototype.start = function () {
        this.status.next(true);
    };
    LoaderService.prototype.stop = function () {
        this.status.next(false);
    };
    LoaderService = __decorate([
        core_1.Injectable()
    ], LoaderService);
    return LoaderService;
}());
exports.LoaderService = LoaderService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvbG9hZGVyL2xvYWRlcnMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLHNDQUEyQztBQUMzQyx3Q0FBdUM7QUFHdkM7SUFEQTtRQUdFLFdBQU0sR0FBcUIsSUFBSSxpQkFBTyxFQUFFLENBQUM7SUFVM0MsQ0FBQztJQVBRLDZCQUFLLEdBQVo7UUFDRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRU0sNEJBQUksR0FBWDtRQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFYVSxhQUFhO1FBRHpCLGlCQUFVLEVBQUU7T0FDQSxhQUFhLENBWXpCO0lBQUQsb0JBQUM7Q0FaRCxBQVlDLElBQUE7QUFaWSxzQ0FBYSIsImZpbGUiOiJhcHAvc2hhcmVkL2xvYWRlci9sb2FkZXJzLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzL1N1YmplY3QnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTG9hZGVyU2VydmljZSB7XHJcblxyXG4gIHN0YXR1czogU3ViamVjdDxib29sZWFuPiA9IG5ldyBTdWJqZWN0KCk7XHJcblxyXG5cclxuICBwdWJsaWMgc3RhcnQoKTogdm9pZCB7XHJcbiAgICB0aGlzLnN0YXR1cy5uZXh0KHRydWUpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0b3AoKTogdm9pZCB7XHJcbiAgICB0aGlzLnN0YXR1cy5uZXh0KGZhbHNlKTtcclxuICB9XHJcbn1cclxuIl19
