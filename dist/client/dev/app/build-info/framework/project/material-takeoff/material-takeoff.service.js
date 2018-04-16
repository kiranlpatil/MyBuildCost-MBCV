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
var index_1 = require("../../../../shared/index");
var http_delegate_service_1 = require("../../../../shared/services/http-delegate.service");
var index_2 = require("../../../../shared/index");
var MaterialTakeoffService = (function (_super) {
    __extends(MaterialTakeoffService, _super);
    function MaterialTakeoffService(http, messageService, httpDelegateService) {
        var _this = _super.call(this) || this;
        _this.http = http;
        _this.messageService = messageService;
        _this.httpDelegateService = httpDelegateService;
        return _this;
    }
    MaterialTakeoffService.prototype.materialFiltersList = function (projectId) {
        var url = index_2.API.REPORT_MATERIAL_TAKE_OFF + '/' + index_2.API.PROJECT + '/' + projectId + '/' + index_2.API.MATERIAL_FILTERS_LIST;
        return this.httpDelegateService.getAPI(url);
    };
    MaterialTakeoffService.prototype.getMaterialTakeOffReport = function (projectId, elementWiseReport, element, building) {
        var url = index_2.API.REPORT_MATERIAL_TAKE_OFF + '/' + index_2.API.PROJECT + '/' + projectId;
        var body = {
            "elementWiseReport": elementWiseReport,
            "element": element,
            "building": building
        };
        return this.httpDelegateService.postAPI(url, body);
    };
    MaterialTakeoffService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, index_1.MessageService, http_delegate_service_1.HttpDelegateService])
    ], MaterialTakeoffService);
    return MaterialTakeoffService;
}(index_1.BaseService));
exports.MaterialTakeoffService = MaterialTakeoffService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L21hdGVyaWFsLXRha2VvZmYvbWF0ZXJpYWwtdGFrZW9mZi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNDQUEyQztBQUMzQyxzQ0FBc0M7QUFDdEMsa0RBQXVFO0FBQ3ZFLDJGQUF3RjtBQUN4RixrREFBK0M7QUFNL0M7SUFBNEMsMENBQVc7SUFFckQsZ0NBQXNCLElBQVUsRUFBWSxjQUE4QixFQUFZLG1CQUF5QztRQUEvSCxZQUNFLGlCQUFPLFNBQ1I7UUFGcUIsVUFBSSxHQUFKLElBQUksQ0FBTTtRQUFZLG9CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUFZLHlCQUFtQixHQUFuQixtQkFBbUIsQ0FBc0I7O0lBRS9ILENBQUM7SUFFRCxvREFBbUIsR0FBbkIsVUFBb0IsU0FBaUI7UUFDbkMsSUFBSSxHQUFHLEdBQUcsV0FBRyxDQUFDLHdCQUF3QixHQUFHLEdBQUcsR0FBRyxXQUFHLENBQUMsT0FBTyxHQUFHLEdBQUcsR0FBRSxTQUFTLEdBQUUsR0FBRyxHQUFHLFdBQUcsQ0FBQyxxQkFBcUIsQ0FBQztRQUM3RyxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQseURBQXdCLEdBQXhCLFVBQXlCLFNBQWtCLEVBQUUsaUJBQTBCLEVBQUUsT0FBZ0IsRUFBRSxRQUFpQjtRQUMxRyxJQUFJLEdBQUcsR0FBRyxXQUFHLENBQUMsd0JBQXdCLEdBQUcsR0FBRyxHQUFHLFdBQUcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxHQUFFLFNBQVMsQ0FBQztRQUM1RSxJQUFJLElBQUksR0FBRztZQUNULG1CQUFtQixFQUFHLGlCQUFpQjtZQUN2QyxTQUFTLEVBQUcsT0FBTztZQUNuQixVQUFVLEVBQUcsUUFBUTtTQUN0QixDQUFDO1FBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFuQlUsc0JBQXNCO1FBRGxDLGlCQUFVLEVBQUU7eUNBR2lCLFdBQUksRUFBNEIsc0JBQWMsRUFBa0MsMkNBQW1CO09BRnBILHNCQUFzQixDQW9CbEM7SUFBRCw2QkFBQztDQXBCRCxBQW9CQyxDQXBCMkMsbUJBQVcsR0FvQnREO0FBcEJZLHdEQUFzQiIsImZpbGUiOiJhcHAvYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9tYXRlcmlhbC10YWtlb2ZmL21hdGVyaWFsLXRha2VvZmYuc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cCwgfSBmcm9tICdAYW5ndWxhci9odHRwJztcclxuaW1wb3J0IHsgQmFzZVNlcnZpY2UsIE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2hhcmVkL2luZGV4JztcclxuaW1wb3J0IHsgSHR0cERlbGVnYXRlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9odHRwLWRlbGVnYXRlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBUEkgfSBmcm9tICcuLi8uLi8uLi8uLi9zaGFyZWQvaW5kZXgnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHsgUHJvamVjdCB9IGZyb20gJy4uLy4uL21vZGVsL3Byb2plY3QnO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIE1hdGVyaWFsVGFrZW9mZlNlcnZpY2UgZXh0ZW5kcyBCYXNlU2VydmljZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBodHRwOiBIdHRwLCBwcm90ZWN0ZWQgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlLCBwcm90ZWN0ZWQgaHR0cERlbGVnYXRlU2VydmljZSA6IEh0dHBEZWxlZ2F0ZVNlcnZpY2UpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgfVxyXG5cclxuICBtYXRlcmlhbEZpbHRlcnNMaXN0KHByb2plY3RJZDogc3RyaW5nKSB7XHJcbiAgICB2YXIgdXJsID0gQVBJLlJFUE9SVF9NQVRFUklBTF9UQUtFX09GRiArICcvJyArIEFQSS5QUk9KRUNUICsgJy8nICtwcm9qZWN0SWQrICcvJyArIEFQSS5NQVRFUklBTF9GSUxURVJTX0xJU1Q7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwRGVsZWdhdGVTZXJ2aWNlLmdldEFQSSh1cmwpO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWF0ZXJpYWxUYWtlT2ZmUmVwb3J0KHByb2plY3RJZCA6IHN0cmluZywgZWxlbWVudFdpc2VSZXBvcnQgOiBzdHJpbmcsIGVsZW1lbnQgOiBzdHJpbmcsIGJ1aWxkaW5nIDogc3RyaW5nKTogT2JzZXJ2YWJsZTxQcm9qZWN0PiB7XHJcbiAgICB2YXIgdXJsID0gQVBJLlJFUE9SVF9NQVRFUklBTF9UQUtFX09GRiArICcvJyArIEFQSS5QUk9KRUNUICsgJy8nICtwcm9qZWN0SWQ7XHJcbiAgICBsZXQgYm9keSA9IHtcclxuICAgICAgXCJlbGVtZW50V2lzZVJlcG9ydFwiIDogZWxlbWVudFdpc2VSZXBvcnQsXHJcbiAgICAgIFwiZWxlbWVudFwiIDogZWxlbWVudCxcclxuICAgICAgXCJidWlsZGluZ1wiIDogYnVpbGRpbmdcclxuICAgIH07XHJcbiAgICByZXR1cm4gdGhpcy5odHRwRGVsZWdhdGVTZXJ2aWNlLnBvc3RBUEkodXJsLCBib2R5KTtcclxuICB9XHJcbn1cclxuIl19
