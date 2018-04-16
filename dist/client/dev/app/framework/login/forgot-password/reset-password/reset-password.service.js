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
var message_service_1 = require("../../../../shared/services/message.service");
var session_service_1 = require("../../../../shared/services/session.service");
var base_service_1 = require("../../../../shared/services/http/base.service");
var index_1 = require("../../../../shared/index");
var ResetPasswordService = (function (_super) {
    __extends(ResetPasswordService, _super);
    function ResetPasswordService(http, messageService) {
        var _this = _super.call(this) || this;
        _this.http = http;
        _this.messageService = messageService;
        return _this;
    }
    ResetPasswordService.prototype.newPassword = function (model) {
        var url = index_1.API.RESET_PASSWORD + '/' + session_service_1.SessionStorageService.getSessionValue(index_1.SessionStorage.USER_ID);
        var body = JSON.stringify(model);
        return this.http.put(url, body)
            .map(this.extractDataWithoutToken)
            .catch(this.handleError);
    };
    ResetPasswordService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, message_service_1.MessageService])
    ], ResetPasswordService);
    return ResetPasswordService;
}(base_service_1.BaseService));
exports.ResetPasswordService = ResetPasswordService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvbG9naW4vZm9yZ290LXBhc3N3b3JkL3Jlc2V0LXBhc3N3b3JkL3Jlc2V0LXBhc3N3b3JkLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0NBQTJDO0FBQzNDLHNDQUFxQztBQUVyQywrRUFBNkU7QUFDN0UsK0VBQW9GO0FBQ3BGLDhFQUE0RTtBQUM1RSxrREFBK0Q7QUFLL0Q7SUFBMEMsd0NBQVc7SUFFbkQsOEJBQXNCLElBQVUsRUFBWSxjQUE4QjtRQUExRSxZQUNFLGlCQUFPLFNBQ1I7UUFGcUIsVUFBSSxHQUFKLElBQUksQ0FBTTtRQUFZLG9CQUFjLEdBQWQsY0FBYyxDQUFnQjs7SUFFMUUsQ0FBQztJQUVELDBDQUFXLEdBQVgsVUFBWSxLQUFvQjtRQUM5QixJQUFJLEdBQUcsR0FBRyxXQUFHLENBQUMsY0FBYyxHQUFHLEdBQUcsR0FBRyx1Q0FBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO2FBQzVCLEdBQUcsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUM7YUFDakMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBWlUsb0JBQW9CO1FBRGhDLGlCQUFVLEVBQUU7eUNBR2lCLFdBQUksRUFBNEIsZ0NBQWM7T0FGL0Qsb0JBQW9CLENBYWhDO0lBQUQsMkJBQUM7Q0FiRCxBQWFDLENBYnlDLDBCQUFXLEdBYXBEO0FBYlksb0RBQW9CIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvbG9naW4vZm9yZ290LXBhc3N3b3JkL3Jlc2V0LXBhc3N3b3JkL3Jlc2V0LXBhc3N3b3JkLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHAgfSBmcm9tICdAYW5ndWxhci9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7IE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2hhcmVkL3NlcnZpY2VzL21lc3NhZ2Uuc2VydmljZSc7XHJcbmltcG9ydCB7IFNlc3Npb25TdG9yYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9zZXNzaW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBCYXNlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9odHRwL2Jhc2Uuc2VydmljZSc7XHJcbmltcG9ydCB7IEFQSSwgU2Vzc2lvblN0b3JhZ2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zaGFyZWQvaW5kZXgnO1xyXG5pbXBvcnQgeyBSZXNldFBhc3N3b3JkIH0gZnJvbSAnLi4vLi4vLi4vLi4vdXNlci9tb2RlbHMvcmVzZXQtcGFzc3dvcmQnO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFJlc2V0UGFzc3dvcmRTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2Uge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaHR0cDogSHR0cCwgcHJvdGVjdGVkIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSkge1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcblxyXG4gIG5ld1Bhc3N3b3JkKG1vZGVsOiBSZXNldFBhc3N3b3JkKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHZhciB1cmwgPSBBUEkuUkVTRVRfUEFTU1dPUkQgKyAnLycgKyBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLlVTRVJfSUQpO1xyXG4gICAgdmFyIGJvZHkgPSBKU09OLnN0cmluZ2lmeShtb2RlbCk7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIGJvZHkpXHJcbiAgICAgIC5tYXAodGhpcy5leHRyYWN0RGF0YVdpdGhvdXRUb2tlbilcclxuICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IpO1xyXG4gIH1cclxufVxyXG4iXX0=
