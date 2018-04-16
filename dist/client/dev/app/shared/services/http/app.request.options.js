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
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("@angular/http");
var index_1 = require("../../index");
var local_storage_service_1 = require("../local-storage.service");
var constants_1 = require("../../constants");
var AppRequestOptions = (function (_super) {
    __extends(AppRequestOptions, _super);
    function AppRequestOptions() {
        return _super.call(this) || this;
    }
    AppRequestOptions.prototype.merge = function (options) {
        if (options === null) {
            options = new http_1.RequestOptions();
        }
        options.headers = new http_1.Headers();
        options.headers.append('Content-Type', 'application/json');
        options.headers.append('Cache-Control', 'no-cache');
        options.headers.append('Pragma', 'no-cache');
        if (window.location.href.indexOf('?access_token=') !== -1) {
            var url = new URL(window.location.href);
            var access_token = url.searchParams.get('access_token');
            options.headers.append('Authorization', 'Bearer ' + access_token);
        }
        else {
            options.headers.append('Authorization', 'Bearer ' + (local_storage_service_1.LocalStorageService.getLocalValue(constants_1.LocalStorage.ACCESS_TOKEN) ||
                (index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.ACCESS_TOKEN))));
        }
        options.url = index_1.AppSettings.API_ENDPOINT + options.url;
        var result = _super.prototype.merge.call(this, options);
        result.merge = this.merge;
        return result;
    };
    return AppRequestOptions;
}(http_1.RequestOptions));
exports.AppRequestOptions = AppRequestOptions;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvc2VydmljZXMvaHR0cC9hcHAucmVxdWVzdC5vcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHNDQUE0RTtBQUM1RSxxQ0FBaUY7QUFDakYsa0VBQStEO0FBQy9ELDZDQUErQztBQUMvQztJQUF1QyxxQ0FBYztJQUNuRDtlQUNFLGlCQUFPO0lBQ1QsQ0FBQztJQUVELGlDQUFLLEdBQUwsVUFBTSxPQUE0QjtRQUNoQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNyQixPQUFPLEdBQUcsSUFBSSxxQkFBYyxFQUFFLENBQUM7UUFDakMsQ0FBQztRQUNDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUNoQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUMzRCxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDcEQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRS9DLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRCxJQUFJLEdBQUcsR0FBTyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVDLElBQUksWUFBWSxHQUFVLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQy9ELE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxTQUFTLEdBQUcsWUFBWSxDQUFDLENBQUM7UUFDcEUsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFNBQVMsR0FBRSxDQUFDLDJDQUFtQixDQUFDLGFBQWEsQ0FBQyx3QkFBWSxDQUFDLFlBQVksQ0FBQztnQkFDOUcsQ0FBRSw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RSxDQUFDO1FBRUQsT0FBTyxDQUFDLEdBQUcsR0FBRyxtQkFBVyxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO1FBQ3JELElBQUksTUFBTSxHQUFHLGlCQUFNLEtBQUssWUFBQyxPQUFPLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDMUIsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQTVCQSxBQTRCQyxDQTVCc0MscUJBQWMsR0E0QnBEO0FBNUJZLDhDQUFpQiIsImZpbGUiOiJhcHAvc2hhcmVkL3NlcnZpY2VzL2h0dHAvYXBwLnJlcXVlc3Qub3B0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEhlYWRlcnMsIFJlcXVlc3RPcHRpb25zLCBSZXF1ZXN0T3B0aW9uc0FyZ3MgfSBmcm9tICdAYW5ndWxhci9odHRwJztcclxuaW1wb3J0IHsgQXBwU2V0dGluZ3MsIFNlc3Npb25TdG9yYWdlLCBTZXNzaW9uU3RvcmFnZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9pbmRleCc7XHJcbmltcG9ydCB7IExvY2FsU3RvcmFnZVNlcnZpY2UgfSBmcm9tICcuLi9sb2NhbC1zdG9yYWdlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2UgfSBmcm9tICcuLi8uLi9jb25zdGFudHMnO1xyXG5leHBvcnQgY2xhc3MgQXBwUmVxdWVzdE9wdGlvbnMgZXh0ZW5kcyBSZXF1ZXN0T3B0aW9ucyB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gIH1cclxuXHJcbiAgbWVyZ2Uob3B0aW9ucz86IFJlcXVlc3RPcHRpb25zQXJncyk6IFJlcXVlc3RPcHRpb25zIHtcclxuICAgIGlmIChvcHRpb25zID09PSBudWxsKSB7XHJcbiAgICAgIG9wdGlvbnMgPSBuZXcgUmVxdWVzdE9wdGlvbnMoKTtcclxuICAgIH1cclxuICAgICAgb3B0aW9ucy5oZWFkZXJzID0gbmV3IEhlYWRlcnMoKTtcclxuICAgICAgb3B0aW9ucy5oZWFkZXJzLmFwcGVuZCgnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgICAgb3B0aW9ucy5oZWFkZXJzLmFwcGVuZCgnQ2FjaGUtQ29udHJvbCcsICduby1jYWNoZScpO1xyXG4gICAgICBvcHRpb25zLmhlYWRlcnMuYXBwZW5kKCdQcmFnbWEnLCAnbm8tY2FjaGUnKTtcclxuXHJcbiAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignP2FjY2Vzc190b2tlbj0nKSAhPT0gLTEpIHtcclxuICAgICAgbGV0IHVybDphbnkgPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgbGV0IGFjY2Vzc190b2tlbjpzdHJpbmcgPSB1cmwuc2VhcmNoUGFyYW1zLmdldCgnYWNjZXNzX3Rva2VuJyk7XHJcbiAgICAgIG9wdGlvbnMuaGVhZGVycy5hcHBlbmQoJ0F1dGhvcml6YXRpb24nLCAnQmVhcmVyICcgKyBhY2Nlc3NfdG9rZW4pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3B0aW9ucy5oZWFkZXJzLmFwcGVuZCgnQXV0aG9yaXphdGlvbicsICdCZWFyZXIgJyArKExvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0TG9jYWxWYWx1ZShMb2NhbFN0b3JhZ2UuQUNDRVNTX1RPS0VOKSB8fFxyXG4gICAgICAgICggU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5BQ0NFU1NfVE9LRU4pKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIG9wdGlvbnMudXJsID0gQXBwU2V0dGluZ3MuQVBJX0VORFBPSU5UICsgb3B0aW9ucy51cmw7XHJcbiAgICB2YXIgcmVzdWx0ID0gc3VwZXIubWVyZ2Uob3B0aW9ucyk7XHJcbiAgICByZXN1bHQubWVyZ2UgPSB0aGlzLm1lcmdlO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbn1cclxuIl19
