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
var ContactService = (function (_super) {
    __extends(ContactService, _super);
    function ContactService(http, messageService) {
        var _this = _super.call(this) || this;
        _this.http = http;
        _this.messageService = messageService;
        return _this;
    }
    ContactService.prototype.contact = function (contactbody) {
        var body = JSON.stringify(contactbody);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(index_1.API.SEND_MAIL, body, options)
            .map(this.extractDataWithoutToken)
            .catch(this.handleError);
    };
    ContactService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, index_1.MessageService])
    ], ContactService);
    return ContactService;
}(index_1.BaseService));
exports.ContactService = ContactService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGFzaGJvYXJkL2NvbnRhY3QvY29udGFjdC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNDQUEyQztBQUMzQyxzQ0FBOEQ7QUFFOUQsK0NBQXlFO0FBS3pFO0lBQW9DLGtDQUFXO0lBQzdDLHdCQUFzQixJQUFVLEVBQVksY0FBOEI7UUFBMUUsWUFDRSxpQkFBTyxTQUNSO1FBRnFCLFVBQUksR0FBSixJQUFJLENBQU07UUFBWSxvQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7O0lBRTFFLENBQUM7SUFHRCxnQ0FBTyxHQUFQLFVBQVEsV0FBb0I7UUFDMUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN2QyxJQUFJLE9BQU8sR0FBRyxJQUFJLGNBQU8sQ0FBQyxFQUFDLGNBQWMsRUFBRSxrQkFBa0IsRUFBQyxDQUFDLENBQUM7UUFDaEUsSUFBSSxPQUFPLEdBQUcsSUFBSSxxQkFBYyxDQUFDLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7UUFDckQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQzthQUNoRCxHQUFHLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDO2FBQ2pDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQWJVLGNBQWM7UUFGMUIsaUJBQVUsRUFBRTt5Q0FHaUIsV0FBSSxFQUE0QixzQkFBYztPQUQvRCxjQUFjLENBZTFCO0lBQUQscUJBQUM7Q0FmRCxBQWVDLENBZm1DLG1CQUFXLEdBZTlDO0FBZlksd0NBQWMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXNoYm9hcmQvY29udGFjdC9jb250YWN0LnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEhlYWRlcnMsIEh0dHAsIFJlcXVlc3RPcHRpb25zIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQgeyBBUEksIEJhc2VTZXJ2aWNlLCBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IENvbnRhY3QgfSBmcm9tICcuL2NvbnRhY3QnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5cclxuZXhwb3J0IGNsYXNzIENvbnRhY3RTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBodHRwOiBIdHRwLCBwcm90ZWN0ZWQgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gIH1cclxuXHJcblxyXG4gIGNvbnRhY3QoY29udGFjdGJvZHk6IENvbnRhY3QpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgdmFyIGJvZHkgPSBKU09OLnN0cmluZ2lmeShjb250YWN0Ym9keSk7XHJcbiAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSk7XHJcbiAgICBsZXQgb3B0aW9ucyA9IG5ldyBSZXF1ZXN0T3B0aW9ucyh7aGVhZGVyczogaGVhZGVyc30pO1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KEFQSS5TRU5EX01BSUwsIGJvZHksIG9wdGlvbnMpXHJcbiAgICAgIC5tYXAodGhpcy5leHRyYWN0RGF0YVdpdGhvdXRUb2tlbilcclxuICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IpO1xyXG4gIH1cclxuXHJcbn1cclxuIl19
