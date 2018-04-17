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
var ProfileDetailsService = (function () {
    function ProfileDetailsService() {
        this._isCall = new Subject_1.Subject();
        this.makeCall$ = this._isCall.asObservable();
    }
    ProfileDetailsService.prototype.change = function (isAnswerTrue) {
        this._isCall.next(isAnswerTrue);
    };
    ProfileDetailsService = __decorate([
        core_1.Injectable()
    ], ProfileDetailsService);
    return ProfileDetailsService;
}());
exports.ProfileDetailsService = ProfileDetailsService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9maWxlLWRldGFpbC1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsc0NBQXlDO0FBQ3pDLHdDQUFxQztBQUdyQztJQURBO1FBSUUsWUFBTyxHQUFHLElBQUksaUJBQU8sRUFBVyxDQUFDO1FBR2pDLGNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBTTFDLENBQUM7SUFIQyxzQ0FBTSxHQUFOLFVBQU8sWUFBcUI7UUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQVhVLHFCQUFxQjtRQURqQyxpQkFBVSxFQUFFO09BQ0EscUJBQXFCLENBWWpDO0lBQUQsNEJBQUM7Q0FaRCxBQVlDLElBQUE7QUFaWSxzREFBcUIiLCJmaWxlIjoiYXBwL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2ZpbGUtZGV0YWlsLXNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7U3ViamVjdH0gZnJvbSBcInJ4anMvU3ViamVjdFwiO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgUHJvZmlsZURldGFpbHNTZXJ2aWNlIHtcclxuXHJcbiAgLy8gT2JzZXJ2YWJsZSBzdHJpbmcgc291cmNlc1xyXG4gIF9pc0NhbGwgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xyXG5cclxuICAvLyBPYnNlcnZhYmxlIHN0cmluZyBzdHJlYW1zXHJcbiAgbWFrZUNhbGwkID0gdGhpcy5faXNDYWxsLmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICAvLyBTZXJ2aWNlIG1lc3NhZ2UgY29tbWFuZHNcclxuICBjaGFuZ2UoaXNBbnN3ZXJUcnVlOiBib29sZWFuKSB7XHJcbiAgICB0aGlzLl9pc0NhbGwubmV4dChpc0Fuc3dlclRydWUpO1xyXG4gIH1cclxufVxyXG4iXX0=
