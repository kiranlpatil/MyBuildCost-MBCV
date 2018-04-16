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
var SharedService = (function () {
    function SharedService() {
        this.isToasterVisible = true;
        var ua = navigator.userAgent;
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini|Mobile|mobile|Chrome|CriOS/i.test(ua)) {
            this.isChrome = true;
        }
        else {
            this.isChrome = false;
        }
        this.detectIE();
    }
    SharedService.prototype.detectIE = function () {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            this.isChrome = false;
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            this.isChrome = false;
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }
        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            this.isChrome = false;
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }
        return false;
    };
    SharedService.prototype.setToasterVisiblity = function (isToasterVisible) {
        this.isToasterVisible = isToasterVisible;
    };
    SharedService.prototype.getToasterVisiblity = function () {
        return this.isToasterVisible;
    };
    SharedService.prototype.getUserBrowser = function () {
        return this.isChrome;
    };
    SharedService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], SharedService);
    return SharedService;
}());
exports.SharedService = SharedService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvc2VydmljZXMvc2hhcmVkLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBeUM7QUFJekM7SUFLRTtRQUZPLHFCQUFnQixHQUFZLElBQUksQ0FBQztRQUd0QyxJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDO1FBRTdCLEVBQUUsQ0FBQSxDQUFDLGtGQUFrRixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBLENBQUM7WUFDOUYsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDdkIsQ0FBQztRQUVELElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDeEIsQ0FBQztRQUVELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUVsQixDQUFDO0lBRUQsZ0NBQVEsR0FBUjtRQUNFLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO1FBRXBDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0IsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUV0QixNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3JFLENBQUM7UUFFRCxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBRXRCLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNqRSxDQUFDO1FBRUQsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNiLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBRXRCLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDckUsQ0FBQztRQUdELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRU0sMkNBQW1CLEdBQTFCLFVBQTJCLGdCQUF3QjtRQUNqRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7SUFDM0MsQ0FBQztJQUVNLDJDQUFtQixHQUExQjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7SUFDL0IsQ0FBQztJQUVNLHNDQUFjLEdBQXJCO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQTNEVSxhQUFhO1FBRnpCLGlCQUFVLEVBQUU7O09BRUEsYUFBYSxDQTREekI7SUFBRCxvQkFBQztDQTVERCxBQTREQyxJQUFBO0FBNURZLHNDQUFhIiwiZmlsZSI6ImFwcC9zaGFyZWQvc2VydmljZXMvc2hhcmVkLXNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcblxyXG5leHBvcnQgY2xhc3MgU2hhcmVkU2VydmljZSB7XHJcblxyXG4gIHB1YmxpYyBpc0Nocm9tZTogYm9vbGVhbjtcclxuICBwdWJsaWMgaXNUb2FzdGVyVmlzaWJsZTogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgbGV0IHVhID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcclxuXHJcbiAgICBpZigvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8T3BlcmEgTWluaXxNb2JpbGV8bW9iaWxlfENocm9tZXxDcmlPUy9pLnRlc3QodWEpKXtcclxuICAgICAgdGhpcy5pc0Nocm9tZSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMuaXNDaHJvbWUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRldGVjdElFKCk7XHJcblxyXG4gIH1cclxuXHJcbiAgZGV0ZWN0SUUgKCkgOiBhbnkge1xyXG4gICAgbGV0IHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XHJcblxyXG4gICAgbGV0IG1zaWUgPSB1YS5pbmRleE9mKCdNU0lFICcpO1xyXG4gICAgaWYgKG1zaWUgPiAwKSB7XHJcbiAgICAgIHRoaXMuaXNDaHJvbWUgPSBmYWxzZTtcclxuICAgICAgLy8gSUUgMTAgb3Igb2xkZXIgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXHJcbiAgICAgIHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcobXNpZSArIDUsIHVhLmluZGV4T2YoJy4nLCBtc2llKSksIDEwKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgdHJpZGVudCA9IHVhLmluZGV4T2YoJ1RyaWRlbnQvJyk7XHJcbiAgICBpZiAodHJpZGVudCA+IDApIHtcclxuICAgICAgdGhpcy5pc0Nocm9tZSA9IGZhbHNlO1xyXG4gICAgICAvLyBJRSAxMSA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcclxuICAgICAgbGV0IHJ2ID0gdWEuaW5kZXhPZigncnY6Jyk7XHJcbiAgICAgIHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcocnYgKyAzLCB1YS5pbmRleE9mKCcuJywgcnYpKSwgMTApO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBlZGdlID0gdWEuaW5kZXhPZignRWRnZS8nKTtcclxuICAgIGlmIChlZGdlID4gMCkge1xyXG4gICAgICB0aGlzLmlzQ2hyb21lID0gZmFsc2U7XHJcbiAgICAgIC8vIEVkZ2UgKElFIDEyKykgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXHJcbiAgICAgIHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcoZWRnZSArIDUsIHVhLmluZGV4T2YoJy4nLCBlZGdlKSksIDEwKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBvdGhlciBicm93c2VyXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0VG9hc3RlclZpc2libGl0eShpc1RvYXN0ZXJWaXNpYmxlOmJvb2xlYW4pIHtcclxuICAgIHRoaXMuaXNUb2FzdGVyVmlzaWJsZSA9IGlzVG9hc3RlclZpc2libGU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0VG9hc3RlclZpc2libGl0eSgpOmJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNUb2FzdGVyVmlzaWJsZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRVc2VyQnJvd3NlcigpOmJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNDaHJvbWU7XHJcbiAgfVxyXG59Il19
