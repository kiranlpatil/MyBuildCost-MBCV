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
var index_1 = require("../../../shared/index");
var ChangeEmailService = (function (_super) {
    __extends(ChangeEmailService, _super);
    function ChangeEmailService(http, messageService) {
        var _this = _super.call(this) || this;
        _this.http = http;
        _this.messageService = messageService;
        return _this;
    }
    ChangeEmailService.prototype.changeEmail = function (model) {
        var url = index_1.API.CHANGE_EMAIL + '/' + index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.USER_ID);
        var body = JSON.stringify(model);
        return this.http.put(url, body)
            .map(this.extractData)
            .catch(this.handleError);
    };
    ChangeEmailService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, index_1.MessageService])
    ], ChangeEmailService);
    return ChangeEmailService;
}(index_1.BaseService));
exports.ChangeEmailService = ChangeEmailService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91c2VyL3NldHRpbmdzL2NoYW5nZS1lbWFpbC9jaGFuZ2UtZW1haWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBMkM7QUFDM0Msc0NBQXFDO0FBR3JDLCtDQUFnSDtBQUloSDtJQUF3QyxzQ0FBVztJQUVqRCw0QkFBc0IsSUFBVSxFQUFZLGNBQThCO1FBQTFFLFlBQ0UsaUJBQU8sU0FDUjtRQUZxQixVQUFJLEdBQUosSUFBSSxDQUFNO1FBQVksb0JBQWMsR0FBZCxjQUFjLENBQWdCOztJQUUxRSxDQUFDO0lBRUQsd0NBQVcsR0FBWCxVQUFZLEtBQWtCO1FBQzVCLElBQUksR0FBRyxHQUFHLFdBQUcsQ0FBQyxZQUFZLEdBQUcsR0FBRyxHQUFHLDZCQUFxQixDQUFDLGVBQWUsQ0FBQyxzQkFBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pHLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7YUFDNUIsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7YUFDckIsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUU3QixDQUFDO0lBYlUsa0JBQWtCO1FBRDlCLGlCQUFVLEVBQUU7eUNBR2lCLFdBQUksRUFBNEIsc0JBQWM7T0FGL0Qsa0JBQWtCLENBYzlCO0lBQUQseUJBQUM7Q0FkRCxBQWNDLENBZHVDLG1CQUFXLEdBY2xEO0FBZFksZ0RBQWtCIiwiZmlsZSI6ImFwcC91c2VyL3NldHRpbmdzL2NoYW5nZS1lbWFpbC9jaGFuZ2UtZW1haWwuc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cCB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHsgQ2hhbmdlRW1haWwgfSBmcm9tICcuLi8uLi9tb2RlbHMvY2hhbmdlLWVtYWlsJztcclxuaW1wb3J0IHsgQVBJLCBCYXNlU2VydmljZSwgU2Vzc2lvblN0b3JhZ2UsIFNlc3Npb25TdG9yYWdlU2VydmljZSwgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvaW5kZXgnO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIENoYW5nZUVtYWlsU2VydmljZSBleHRlbmRzIEJhc2VTZXJ2aWNlIHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGh0dHA6IEh0dHAsIHByb3RlY3RlZCBtZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VFbWFpbChtb2RlbDogQ2hhbmdlRW1haWwpOiBPYnNlcnZhYmxlPENoYW5nZUVtYWlsPiB7XHJcbiAgICB2YXIgdXJsID0gQVBJLkNIQU5HRV9FTUFJTCArICcvJyArIFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuVVNFUl9JRCk7XHJcbiAgICB2YXIgYm9keSA9IEpTT04uc3RyaW5naWZ5KG1vZGVsKTtcclxuICAgIHJldHVybiB0aGlzLmh0dHAucHV0KHVybCwgYm9keSlcclxuICAgICAgLm1hcCh0aGlzLmV4dHJhY3REYXRhKVxyXG4gICAgICAuY2F0Y2godGhpcy5oYW5kbGVFcnJvcik7XHJcblxyXG4gIH1cclxufVxyXG4iXX0=
