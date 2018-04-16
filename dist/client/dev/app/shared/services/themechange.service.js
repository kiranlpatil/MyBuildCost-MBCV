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
var ThemeChangeService = (function () {
    function ThemeChangeService() {
        this.themeSource = new Subject_1.Subject();
        this.showTheme$ = this.themeSource.asObservable();
    }
    ThemeChangeService.prototype.change = function (theme) {
        this.themeSource.next(theme);
    };
    ThemeChangeService = __decorate([
        core_1.Injectable()
    ], ThemeChangeService);
    return ThemeChangeService;
}());
exports.ThemeChangeService = ThemeChangeService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvc2VydmljZXMvdGhlbWVjaGFuZ2Uuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLHNDQUF5QztBQUN6Qyx3Q0FBcUM7QUFJckM7SUFEQTtRQUdFLGdCQUFXLEdBQUcsSUFBSSxpQkFBTyxFQUFVLENBQUM7UUFFcEMsZUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUM7SUFLL0MsQ0FBQztJQUhDLG1DQUFNLEdBQU4sVUFBTyxLQUFhO1FBQ2xCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFSVSxrQkFBa0I7UUFEOUIsaUJBQVUsRUFBRTtPQUNBLGtCQUFrQixDQVM5QjtJQUFELHlCQUFDO0NBVEQsQUFTQyxJQUFBO0FBVFksZ0RBQWtCIiwiZmlsZSI6ImFwcC9zaGFyZWQvc2VydmljZXMvdGhlbWVjaGFuZ2Uuc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHtTdWJqZWN0fSBmcm9tIFwicnhqcy9TdWJqZWN0XCI7XHJcblxyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGhlbWVDaGFuZ2VTZXJ2aWNlIHtcclxuXHJcbiAgdGhlbWVTb3VyY2UgPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XHJcbiAgLy9zaG93VGhlbWUkIE9ic2VydmFibGUgdG8gb2JzZXJ2ZSB0aGVtZVNvdXJjZVxyXG4gIHNob3dUaGVtZSQgPSB0aGlzLnRoZW1lU291cmNlLmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICBjaGFuZ2UodGhlbWU6IHN0cmluZykge1xyXG4gICAgdGhpcy50aGVtZVNvdXJjZS5uZXh0KHRoZW1lKTtcclxuICB9XHJcbn1cclxuXHJcbiJdfQ==
