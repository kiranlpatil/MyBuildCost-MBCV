"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SessionStorageService = (function () {
    function SessionStorageService() {
    }
    SessionStorageService.getSessionValue = function (key) {
        return sessionStorage.getItem(key);
    };
    SessionStorageService.removeSessionValue = function (key) {
        sessionStorage.removeItem(key);
    };
    SessionStorageService.setSessionValue = function (key, value) {
        sessionStorage.setItem(key, value);
    };
    return SessionStorageService;
}());
exports.SessionStorageService = SessionStorageService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvc2VydmljZXMvc2Vzc2lvbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7SUFBQTtJQWFBLENBQUM7SUFYZ0IscUNBQWUsR0FBN0IsVUFBOEIsR0FBUTtRQUNwQyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRWEsd0NBQWtCLEdBQWhDLFVBQWlDLEdBQVE7UUFDdkMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRWEscUNBQWUsR0FBN0IsVUFBOEIsR0FBUSxFQUFFLEtBQVU7UUFDaEQsY0FBYyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNKLDRCQUFDO0FBQUQsQ0FiQSxBQWFDLElBQUE7QUFiWSxzREFBcUIiLCJmaWxlIjoiYXBwL3NoYXJlZC9zZXJ2aWNlcy9zZXNzaW9uLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlIHtcclxuXHJcbiAgIHB1YmxpYyBzdGF0aWMgZ2V0U2Vzc2lvblZhbHVlKGtleTogYW55KSB7XHJcbiAgICAgcmV0dXJuIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oa2V5KTtcclxuICAgfVxyXG5cclxuICAgcHVibGljIHN0YXRpYyByZW1vdmVTZXNzaW9uVmFsdWUoa2V5OiBhbnkpIHtcclxuICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XHJcbiAgIH1cclxuXHJcbiAgIHB1YmxpYyBzdGF0aWMgc2V0U2Vzc2lvblZhbHVlKGtleTogYW55LCB2YWx1ZTogYW55KSB7XHJcbiAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcclxuICAgfVxyXG59XHJcbiJdfQ==
