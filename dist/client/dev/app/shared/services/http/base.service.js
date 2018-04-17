"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
var index_1 = require("../../index");
var BaseService = (function () {
    function BaseService() {
    }
    BaseService.prototype.extractData = function (res) {
        var body = res.json();
        if (body.hasOwnProperty('access_token')) {
            index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.ACCESS_TOKEN, body.access_token);
            if (body.data._id && body.data._id !== undefined) {
                index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.USER_ID, body.data._id);
            }
        }
        return body || {};
    };
    BaseService.prototype.extractDataWithoutToken = function (res) {
        var body = res.json();
        return body || {};
    };
    BaseService.prototype.handleError = function (error) {
        return Observable_1.Observable.throw(error);
    };
    return BaseService;
}());
exports.BaseService = BaseService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvc2VydmljZXMvaHR0cC9iYXNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw4Q0FBNkM7QUFDN0MscUNBQW9FO0FBR3BFO0lBQUE7SUFxQkEsQ0FBQztJQW5CQyxpQ0FBVyxHQUFYLFVBQVksR0FBYTtRQUN2QixJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsNkJBQXFCLENBQUMsZUFBZSxDQUFDLHNCQUFjLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN0RixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvRSxDQUFDO1FBQ0gsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCw2Q0FBdUIsR0FBdkIsVUFBd0IsR0FBYTtRQUNuQyxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdEIsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELGlDQUFXLEdBQVgsVUFBWSxLQUFVO1FBQ3BCLE1BQU0sQ0FBQyx1QkFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQ0gsa0JBQUM7QUFBRCxDQXJCQSxBQXFCQyxJQUFBO0FBckJZLGtDQUFXIiwiZmlsZSI6ImFwcC9zaGFyZWQvc2VydmljZXMvaHR0cC9iYXNlLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXNwb25zZSB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHsgU2Vzc2lvblN0b3JhZ2UsIFNlc3Npb25TdG9yYWdlU2VydmljZSB9IGZyb20gJy4uLy4uL2luZGV4JztcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQmFzZVNlcnZpY2Uge1xyXG5cclxuICBleHRyYWN0RGF0YShyZXM6IFJlc3BvbnNlKSB7XHJcbiAgICBsZXQgYm9keSA9IHJlcy5qc29uKCk7XHJcbiAgICBpZiAoYm9keS5oYXNPd25Qcm9wZXJ0eSgnYWNjZXNzX3Rva2VuJykpIHtcclxuICAgICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5BQ0NFU1NfVE9LRU4sIGJvZHkuYWNjZXNzX3Rva2VuKTtcclxuICAgICAgaWYgKGJvZHkuZGF0YS5faWQgJiYgYm9keS5kYXRhLl9pZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5VU0VSX0lELCBib2R5LmRhdGEuX2lkKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJvZHkgfHwge307XHJcbiAgfVxyXG5cclxuICBleHRyYWN0RGF0YVdpdGhvdXRUb2tlbihyZXM6IFJlc3BvbnNlKSB7XHJcbiAgICBsZXQgYm9keSA9IHJlcy5qc29uKCk7XHJcbiAgICByZXR1cm4gYm9keSB8fCB7fTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUVycm9yKGVycm9yOiBhbnkpIHtcclxuICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KGVycm9yKTtcclxuICB9XHJcbn1cclxuIl19
