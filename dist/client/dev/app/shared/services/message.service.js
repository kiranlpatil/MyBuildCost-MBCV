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
var MessageService = (function () {
    function MessageService() {
        this.MessageSource = new Subject_1.Subject();
        this.messageObservable$ = this.MessageSource.asObservable();
    }
    MessageService.prototype.message = function (message) {
        this.MessageSource.next(message);
    };
    MessageService = __decorate([
        core_1.Injectable()
    ], MessageService);
    return MessageService;
}());
exports.MessageService = MessageService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvc2VydmljZXMvbWVzc2FnZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsc0NBQTJDO0FBQzNDLHdDQUF1QztBQUl2QztJQURBO1FBRUUsa0JBQWEsR0FBRyxJQUFJLGlCQUFPLEVBQVcsQ0FBQztRQUN2Qyx1QkFBa0IsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBTXpELENBQUM7SUFIQyxnQ0FBTyxHQUFQLFVBQVEsT0FBZ0I7UUFDdEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQVBVLGNBQWM7UUFEMUIsaUJBQVUsRUFBRTtPQUNBLGNBQWMsQ0FRMUI7SUFBRCxxQkFBQztDQVJELEFBUUMsSUFBQTtBQVJZLHdDQUFjIiwiZmlsZSI6ImFwcC9zaGFyZWQvc2VydmljZXMvbWVzc2FnZS5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcy9TdWJqZWN0JztcclxuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4uL21vZGVscy9tZXNzYWdlJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VTZXJ2aWNlIHtcclxuICBNZXNzYWdlU291cmNlID0gbmV3IFN1YmplY3Q8TWVzc2FnZT4oKTtcclxuICBtZXNzYWdlT2JzZXJ2YWJsZSQgPSB0aGlzLk1lc3NhZ2VTb3VyY2UuYXNPYnNlcnZhYmxlKCk7XHJcblxyXG5cclxuICBtZXNzYWdlKG1lc3NhZ2U6IE1lc3NhZ2UpIHtcclxuICAgIHRoaXMuTWVzc2FnZVNvdXJjZS5uZXh0KG1lc3NhZ2UpO1xyXG4gIH1cclxufVxyXG5cclxuIl19
