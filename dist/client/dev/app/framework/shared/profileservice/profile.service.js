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
var ProfileService = (function () {
    function ProfileService() {
        this.MessageSource = new Subject_1.Subject();
        this.profileUpdateObservable$ = this.MessageSource.asObservable();
    }
    ProfileService.prototype.onProfileUpdate = function (profile) {
        this.MessageSource.next(profile);
    };
    ProfileService = __decorate([
        core_1.Injectable()
    ], ProfileService);
    return ProfileService;
}());
exports.ProfileService = ProfileService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2hhcmVkL3Byb2ZpbGVzZXJ2aWNlL3Byb2ZpbGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLHNDQUEyQztBQUMzQyx3Q0FBdUM7QUFJdkM7SUFEQTtRQUVFLGtCQUFhLEdBQUcsSUFBSSxpQkFBTyxFQUFlLENBQUM7UUFDM0MsNkJBQXdCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUsvRCxDQUFDO0lBSEMsd0NBQWUsR0FBZixVQUFnQixPQUFvQjtRQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBTlUsY0FBYztRQUQxQixpQkFBVSxFQUFFO09BQ0EsY0FBYyxDQU8xQjtJQUFELHFCQUFDO0NBUEQsQUFPQyxJQUFBO0FBUFksd0NBQWMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9zaGFyZWQvcHJvZmlsZXNlcnZpY2UvcHJvZmlsZS5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcy9TdWJqZWN0JztcclxuaW1wb3J0IHsgVXNlclByb2ZpbGUgfSBmcm9tICcuLi8uLi8uLi91c2VyL21vZGVscy91c2VyJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFByb2ZpbGVTZXJ2aWNlIHtcclxuICBNZXNzYWdlU291cmNlID0gbmV3IFN1YmplY3Q8VXNlclByb2ZpbGU+KCk7XHJcbiAgcHJvZmlsZVVwZGF0ZU9ic2VydmFibGUkID0gdGhpcy5NZXNzYWdlU291cmNlLmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICBvblByb2ZpbGVVcGRhdGUocHJvZmlsZTogVXNlclByb2ZpbGUpIHtcclxuICAgIHRoaXMuTWVzc2FnZVNvdXJjZS5uZXh0KHByb2ZpbGUpO1xyXG4gIH1cclxufVxyXG4iXX0=
