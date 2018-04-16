"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LocalStorageService = (function () {
    function LocalStorageService() {
    }
    LocalStorageService.getLocalValue = function (key) {
        return localStorage.getItem(key);
    };
    LocalStorageService.removeLocalValue = function (key) {
        localStorage.removeItem(key);
    };
    LocalStorageService.setLocalValue = function (key, value) {
        localStorage.setItem(key, value);
    };
    LocalStorageService.ACCESS_TOKEN = 'access_token';
    return LocalStorageService;
}());
exports.LocalStorageService = LocalStorageService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvc2VydmljZXMvbG9jYWwtc3RvcmFnZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7SUFBQTtJQWVBLENBQUM7SUFaZSxpQ0FBYSxHQUEzQixVQUE0QixHQUFRO1FBQ2xDLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFYSxvQ0FBZ0IsR0FBOUIsVUFBK0IsR0FBUTtRQUNyQyxZQUFZLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFYSxpQ0FBYSxHQUEzQixVQUE0QixHQUFRLEVBQUUsS0FBVTtRQUM5QyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBWmEsZ0NBQVksR0FBRyxjQUFjLENBQUM7SUFjOUMsMEJBQUM7Q0FmRCxBQWVDLElBQUE7QUFmWSxrREFBbUIiLCJmaWxlIjoiYXBwL3NoYXJlZC9zZXJ2aWNlcy9sb2NhbC1zdG9yYWdlLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgTG9jYWxTdG9yYWdlU2VydmljZSB7XHJcbiAgcHVibGljIHN0YXRpYyBBQ0NFU1NfVE9LRU4gPSAnYWNjZXNzX3Rva2VuJztcclxuXHJcbiAgcHVibGljIHN0YXRpYyBnZXRMb2NhbFZhbHVlKGtleTogYW55KSB7XHJcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgcmVtb3ZlTG9jYWxWYWx1ZShrZXk6IGFueSkge1xyXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgc2V0TG9jYWxWYWx1ZShrZXk6IGFueSwgdmFsdWU6IGFueSkge1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=
