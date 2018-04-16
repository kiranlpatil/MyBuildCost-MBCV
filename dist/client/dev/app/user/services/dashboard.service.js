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
var index_1 = require("../../shared/index");
var DashboardService = (function (_super) {
    __extends(DashboardService, _super);
    function DashboardService(http, messageService) {
        var _this = _super.call(this) || this;
        _this.http = http;
        _this.messageService = messageService;
        return _this;
    }
    DashboardService.prototype.getUserProfile = function () {
        var url = index_1.API.USER_PROFILE + '/' + index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.USER_ID);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(url, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DashboardService.prototype.updateProfile = function (model) {
        var url = index_1.API.USER_PROFILE + '/' + index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.USER_ID);
        var body = JSON.stringify(model);
        return this.http.put(url, body)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DashboardService.prototype.makeDocumentUpload = function (files, params) {
        var url = index_1.AppSettings.API_ENDPOINT + index_1.API.UPDATE_PICTURE + '/' + index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.USER_ID);
        return new Promise(function (resolve, reject) {
            var formData = new FormData();
            var xhr = new XMLHttpRequest();
            formData.append('file', files[0], files[0].name);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    }
                    else {
                        reject(xhr.response);
                    }
                }
            };
            xhr.open('PUT', url, true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.ACCESS_TOKEN));
            xhr.send(formData);
        });
    };
    DashboardService.prototype.changeRecruiterAccountDetails = function (model) {
        var url = index_1.API.CHANGE_COMPANY_ACCOUNT_DETAILS + '/' + index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.USER_ID);
        var body = JSON.stringify(model);
        return this.http.put(url, body)
            .map(this.extractData)
            .catch(this.handleError);
    };
    DashboardService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, index_1.MessageService])
    ], DashboardService);
    return DashboardService;
}(index_1.BaseService));
exports.DashboardService = DashboardService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91c2VyL3NlcnZpY2VzL2Rhc2hib2FyZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNDQUEyQztBQUMzQyxzQ0FBOEQ7QUFFOUQsNENBQTBIO0FBSTFIO0lBQXNDLG9DQUFXO0lBRS9DLDBCQUFzQixJQUFVLEVBQVksY0FBOEI7UUFBMUUsWUFDRSxpQkFBTyxTQUNSO1FBRnFCLFVBQUksR0FBSixJQUFJLENBQU07UUFBWSxvQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7O0lBRTFFLENBQUM7SUFFRCx5Q0FBYyxHQUFkO1FBQ0UsSUFBSSxHQUFHLEdBQUcsV0FBRyxDQUFDLFlBQVksR0FBRyxHQUFHLEdBQUcsNkJBQXFCLENBQUMsZUFBZSxDQUFDLHNCQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakcsSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLENBQUMsRUFBQyxjQUFjLEVBQUUsa0JBQWtCLEVBQUMsQ0FBQyxDQUFDO1FBQ2hFLElBQUksT0FBTyxHQUFHLElBQUkscUJBQWMsQ0FBQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDO2FBQy9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2FBQ3JCLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELHdDQUFhLEdBQWIsVUFBYyxLQUFzQjtRQUNsQyxJQUFJLEdBQUcsR0FBRyxXQUFHLENBQUMsWUFBWSxHQUFHLEdBQUcsR0FBRyw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqRyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO2FBQzVCLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2FBQ3JCLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELDZDQUFrQixHQUFsQixVQUFtQixLQUFrQixFQUFFLE1BQXFCO1FBQzFELElBQUksR0FBRyxHQUFHLG1CQUFXLENBQUMsWUFBWSxHQUFHLFdBQUcsQ0FBQyxjQUFjLEdBQUcsR0FBRyxHQUFHLDZCQUFxQixDQUFDLGVBQWUsQ0FBQyxzQkFBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlILE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQVksRUFBRSxNQUFXO1lBQzNDLElBQUksUUFBUSxHQUFRLElBQUksUUFBUSxFQUFFLENBQUM7WUFDbkMsSUFBSSxHQUFHLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUMvQixRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpELEdBQUcsQ0FBQyxrQkFBa0IsR0FBRztnQkFDdkIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ3ZCLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNwQyxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNOLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3ZCLENBQUM7Z0JBQ0gsQ0FBQztZQUNILENBQUMsQ0FBQztZQUNGLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzQixHQUFHLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxFQUFFLFNBQVMsR0FBRyw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3RILEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0Qsd0RBQTZCLEdBQTdCLFVBQThCLEtBQVM7UUFDckMsSUFBSSxHQUFHLEdBQUcsV0FBRyxDQUFDLDhCQUE4QixHQUFHLEdBQUcsR0FBRyw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuSCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO2FBQzVCLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2FBQ3JCLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFFN0IsQ0FBQztJQW5EVSxnQkFBZ0I7UUFENUIsaUJBQVUsRUFBRTt5Q0FHaUIsV0FBSSxFQUE0QixzQkFBYztPQUYvRCxnQkFBZ0IsQ0FvRDVCO0lBQUQsdUJBQUM7Q0FwREQsQUFvREMsQ0FwRHFDLG1CQUFXLEdBb0RoRDtBQXBEWSw0Q0FBZ0IiLCJmaWxlIjoiYXBwL3VzZXIvc2VydmljZXMvZGFzaGJvYXJkLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEhlYWRlcnMsIEh0dHAsIFJlcXVlc3RPcHRpb25zIH0gZnJvbSAnQGFuZ3VsYXIvaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQgeyBBUEksIEFwcFNldHRpbmdzLCBCYXNlU2VydmljZSwgU2Vzc2lvblN0b3JhZ2UsIFNlc3Npb25TdG9yYWdlU2VydmljZSwgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zaGFyZWQvaW5kZXgnO1xyXG5pbXBvcnQgeyBDYW5kaWRhdGVEZXRhaWwgfSBmcm9tICcuLi9tb2RlbHMvY2FuZGlkYXRlLWRldGFpbHMnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgRGFzaGJvYXJkU2VydmljZSBleHRlbmRzIEJhc2VTZXJ2aWNlIHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGh0dHA6IEh0dHAsIHByb3RlY3RlZCBtZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgfVxyXG5cclxuICBnZXRVc2VyUHJvZmlsZSgpOiBPYnNlcnZhYmxlPGFueT4geyAvL3RvZG9cclxuICAgIHZhciB1cmwgPSBBUEkuVVNFUl9QUk9GSUxFICsgJy8nICsgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5VU0VSX0lEKTtcclxuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9KTtcclxuICAgIGxldCBvcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHtoZWFkZXJzOiBoZWFkZXJzfSk7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwsIG9wdGlvbnMpXHJcbiAgICAgIC5tYXAodGhpcy5leHRyYWN0RGF0YSlcclxuICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlUHJvZmlsZShtb2RlbDogQ2FuZGlkYXRlRGV0YWlsKTogT2JzZXJ2YWJsZTxDYW5kaWRhdGVEZXRhaWw+IHtcclxuICAgIHZhciB1cmwgPSBBUEkuVVNFUl9QUk9GSUxFICsgJy8nICsgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5VU0VSX0lEKTtcclxuICAgIGxldCBib2R5ID0gSlNPTi5zdHJpbmdpZnkobW9kZWwpO1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wdXQodXJsLCBib2R5KVxyXG4gICAgICAubWFwKHRoaXMuZXh0cmFjdERhdGEpXHJcbiAgICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9yKTtcclxuICB9XHJcblxyXG4gIG1ha2VEb2N1bWVudFVwbG9hZChmaWxlczogQXJyYXk8RmlsZT4sIHBhcmFtczogQXJyYXk8c3RyaW5nPikge1xyXG4gICAgdmFyIHVybCA9IEFwcFNldHRpbmdzLkFQSV9FTkRQT0lOVCArIEFQSS5VUERBVEVfUElDVFVSRSArICcvJyArIFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuVVNFUl9JRCk7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6IGFueSwgcmVqZWN0OiBhbnkpID0+IHtcclxuICAgICAgdmFyIGZvcm1EYXRhOiBhbnkgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlc1swXSwgZmlsZXNbMF0ubmFtZSk7XHJcblxyXG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xyXG4gICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZWplY3QoeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICAgIHhoci5vcGVuKCdQVVQnLCB1cmwsIHRydWUpO1xyXG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsICdCZWFyZXIgJyArIFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQUNDRVNTX1RPS0VOKSk7XHJcbiAgICAgIHhoci5zZW5kKGZvcm1EYXRhKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBjaGFuZ2VSZWNydWl0ZXJBY2NvdW50RGV0YWlscyhtb2RlbDphbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgdmFyIHVybCA9IEFQSS5DSEFOR0VfQ09NUEFOWV9BQ0NPVU5UX0RFVEFJTFMgKyAnLycgKyBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLlVTRVJfSUQpO1xyXG4gICAgdmFyIGJvZHkgPSBKU09OLnN0cmluZ2lmeShtb2RlbCk7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLnB1dCh1cmwsIGJvZHkpXHJcbiAgICAgIC5tYXAodGhpcy5leHRyYWN0RGF0YSlcclxuICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IpO1xyXG5cclxuICB9XHJcbn1cclxuIl19
