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
var Rx_1 = require("rxjs/Rx");
var http_1 = require("@angular/http");
var index_1 = require("./../../index");
var loaders_service_1 = require("../../loader/loaders.service");
var CustomHttp = (function (_super) {
    __extends(CustomHttp, _super);
    function CustomHttp(backend, defaultOptions, messageService, loaderService) {
        var _this = _super.call(this, backend, defaultOptions) || this;
        _this.messageService = messageService;
        _this.loaderService = loaderService;
        _this.someProperty = 'some string';
        return _this;
    }
    CustomHttp.prototype.request = function (url, options) {
        return this.intercept(_super.prototype.request.call(this, url, options));
    };
    CustomHttp.prototype.get = function (url, options) {
        return this.intercept(_super.prototype.get.call(this, url, options));
    };
    CustomHttp.prototype.post = function (url, body, options) {
        return this.intercept(_super.prototype.post.call(this, url, body, options));
    };
    CustomHttp.prototype.put = function (url, body, options) {
        return this.intercept(_super.prototype.put.call(this, url, body, options));
    };
    CustomHttp.prototype.delete = function (url, options) {
        return this.intercept(_super.prototype.delete.call(this, url, options));
    };
    CustomHttp.prototype.intercept = function (observable) {
        return observable.do(function () { return console.log(''); })
            .catch(function (err, source) {
            var message = new index_1.Message();
            message.isError = true;
            var errorInstance = new index_1.ErrorInstance();
            if (err.err_msg && err.err_code) {
                errorInstance.err_msg = err.err_msg;
                errorInstance.err_code = err.err_code;
                return Rx_1.Observable.throw(errorInstance);
            }
            else if (err.status) {
                if (err.status === 401 || err.status === 403 || err.status === 400) {
                    errorInstance.err_code = err.status;
                    errorInstance.err_msg = JSON.parse(err._body).error.message;
                }
                else if (err.status === 404) {
                    errorInstance.err_msg = index_1.Messages.MSG_ERROR_SERVER_ERROR;
                    errorInstance.err_code = err.status;
                }
                else if (err.status === 0) {
                    errorInstance.err_msg = index_1.Messages.MSG_ERROR_SOMETHING_WRONG;
                    errorInstance.err_code = err.status;
                }
                else {
                    errorInstance.err_msg = JSON.parse(err._body).error.message;
                }
                return Rx_1.Observable.throw(errorInstance);
            }
            else {
                errorInstance.err_msg = index_1.Messages.MSG_ERROR_SOMETHING_WRONG;
                errorInstance.err_code = err.status;
                return Rx_1.Observable.throw(errorInstance);
            }
        });
    };
    CustomHttp = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.ConnectionBackend, http_1.RequestOptions,
            index_1.MessageService,
            loaders_service_1.LoaderService])
    ], CustomHttp);
    return CustomHttp;
}(http_1.Http));
exports.CustomHttp = CustomHttp;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvc2VydmljZXMvaHR0cC9jdXN0b20uaHR0cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBeUM7QUFDekMsOEJBQW1DO0FBQ25DLHNDQUE2RztBQUM3Ryx1Q0FBK0U7QUFDL0UsZ0VBQTJEO0FBRzNEO0lBQWdDLDhCQUFJO0lBR2xDLG9CQUFZLE9BQTBCLEVBQUUsY0FBOEIsRUFDbEQsY0FBOEIsRUFDOUIsYUFBNEI7UUFGaEQsWUFHRSxrQkFBTSxPQUFPLEVBQUUsY0FBYyxDQUFDLFNBQy9CO1FBSG1CLG9CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixtQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUpoRCxrQkFBWSxHQUFXLGFBQWEsQ0FBQzs7SUFNckMsQ0FBQztJQUVELDRCQUFPLEdBQVAsVUFBUSxHQUFxQixFQUFFLE9BQTRCO1FBQ3pELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFNLE9BQU8sWUFBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsd0JBQUcsR0FBSCxVQUFJLEdBQVcsRUFBRSxPQUE0QjtRQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBTSxHQUFHLFlBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELHlCQUFJLEdBQUosVUFBSyxHQUFXLEVBQUUsSUFBUyxFQUFFLE9BQTRCO1FBQ3ZELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFNLElBQUksWUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELHdCQUFHLEdBQUgsVUFBSSxHQUFXLEVBQUUsSUFBWSxFQUFFLE9BQTRCO1FBQ3pELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFNLEdBQUcsWUFBQyxHQUFHLEVB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QWlCLEVBQWtCLHFCQUFjO1lBQ2xDLHNCQUFjO1lBQ2YsK0JBQWE7T0FMckMsVUFBVSxDQStEdEI7SUFBRCxpQkFBQztDQS9ERCxBQStEQyxDQS9EK0IsV0FBSSxHQStEbkM7QUEvRFksZ0NBQVUiLCJmaWxlIjoiYXBwL3NoYXJlZC9zZXJ2aWNlcy9odHRwL2N1c3RvbS5odHRwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gXCJyeGpzL1J4XCI7XHJcbmltcG9ydCB7Q29ubmVjdGlvbkJhY2tlbmQsIEh0dHAsIFJlcXVlc3QsIFJlcXVlc3RPcHRpb25zLCBSZXF1ZXN0T3B0aW9uc0FyZ3MsIFJlc3BvbnNlfSBmcm9tIFwiQGFuZ3VsYXIvaHR0cFwiO1xyXG5pbXBvcnQge0Vycm9ySW5zdGFuY2UsIE1lc3NhZ2UsIE1lc3NhZ2VzLCBNZXNzYWdlU2VydmljZX0gZnJvbSBcIi4vLi4vLi4vaW5kZXhcIjtcclxuaW1wb3J0IHtMb2FkZXJTZXJ2aWNlfSBmcm9tIFwiLi4vLi4vbG9hZGVyL2xvYWRlcnMuc2VydmljZVwiO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ3VzdG9tSHR0cCBleHRlbmRzIEh0dHAge1xyXG4gIHNvbWVQcm9wZXJ0eTogc3RyaW5nID0gJ3NvbWUgc3RyaW5nJztcclxuXHJcbiAgY29uc3RydWN0b3IoYmFja2VuZDogQ29ubmVjdGlvbkJhY2tlbmQsIGRlZmF1bHRPcHRpb25zOiBSZXF1ZXN0T3B0aW9ucyxcclxuICAgICAgICAgICAgICBwcml2YXRlIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIGxvYWRlclNlcnZpY2U6IExvYWRlclNlcnZpY2UpIHtcclxuICAgIHN1cGVyKGJhY2tlbmQsIGRlZmF1bHRPcHRpb25zKTtcclxuICB9XHJcblxyXG4gIHJlcXVlc3QodXJsOiBzdHJpbmcgfCBSZXF1ZXN0LCBvcHRpb25zPzogUmVxdWVzdE9wdGlvbnNBcmdzKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLmludGVyY2VwdChzdXBlci5yZXF1ZXN0KHVybCwgb3B0aW9ucykpO1xyXG4gIH1cclxuXHJcbiAgZ2V0KHVybDogc3RyaW5nLCBvcHRpb25zPzogUmVxdWVzdE9wdGlvbnNBcmdzKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLmludGVyY2VwdChzdXBlci5nZXQodXJsLCBvcHRpb25zKSk7XHJcbiAgfVxyXG5cclxuICBwb3N0KHVybDogc3RyaW5nLCBib2R5OiBhbnksIG9wdGlvbnM/OiBSZXF1ZXN0T3B0aW9uc0FyZ3MpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaW50ZXJjZXB0KHN1cGVyLnBvc3QodXJsLCBib2R5LCBvcHRpb25zKSk7XHJcbiAgfVxyXG5cclxuICBwdXQodXJsOiBzdHJpbmcsIGJvZHk6IHN0cmluZywgb3B0aW9ucz86IFJlcXVlc3RPcHRpb25zQXJncyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5pbnRlcmNlcHQoc3VwZXIucHV0KHVybCwgYm9keSwgb3B0aW9ucykpO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlKHVybDogc3RyaW5nLCBvcHRpb25zPzogUmVxdWVzdE9wdGlvbnNBcmdzKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLmludGVyY2VwdChzdXBlci5kZWxldGUodXJsLCBvcHRpb25zKSk7XHJcbiAgfVxyXG5cclxuICBpbnRlcmNlcHQob2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxhbnk+KTogT2JzZXJ2YWJsZTxSZXNwb25zZT4ge1xyXG4gICAvLyB0aGlzLmxvYWRlclNlcnZpY2Uuc3RhcnQoKTtcclxuICAgIHJldHVybiBvYnNlcnZhYmxlLmRvKCgpID0+IGNvbnNvbGUubG9nKCcnKSlcclxuICAgICAgLmNhdGNoKChlcnIsIHNvdXJjZSkgPT4ge1xyXG5cclxuLy8gICAgICAgIHRoaXMubG9hZGVyU2VydmljZS5zdG9wKCk7XHJcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgICAgIG1lc3NhZ2UuaXNFcnJvciA9IHRydWU7XHJcbiAgICAgICAgdmFyIGVycm9ySW5zdGFuY2UgPSBuZXcgRXJyb3JJbnN0YW5jZSgpO1xyXG4gICAgICAgIGlmIChlcnIuZXJyX21zZyAmJiBlcnIuZXJyX2NvZGUpIHtcclxuICAgICAgICAgIGVycm9ySW5zdGFuY2UuZXJyX21zZyA9IGVyci5lcnJfbXNnO1xyXG4gICAgICAgICAgZXJyb3JJbnN0YW5jZS5lcnJfY29kZSA9IGVyci5lcnJfY29kZTtcclxuICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KGVycm9ySW5zdGFuY2UpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXJyLnN0YXR1cykge1xyXG4gICAgICAgICAgaWYgKGVyci5zdGF0dXMgPT09IDQwMSB8fCBlcnIuc3RhdHVzID09PSA0MDMgfHwgZXJyLnN0YXR1cyA9PT0gNDAwICkge1xyXG4gICAgICAgICAgICBlcnJvckluc3RhbmNlLmVycl9jb2RlID0gZXJyLnN0YXR1cztcclxuICAgICAgICAgICAgZXJyb3JJbnN0YW5jZS5lcnJfbXNnID0gSlNPTi5wYXJzZShlcnIuX2JvZHkpLmVycm9yLm1lc3NhZ2U7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGVyci5zdGF0dXMgPT09IDQwNCkge1xyXG4gICAgICAgICAgICBlcnJvckluc3RhbmNlLmVycl9tc2cgPSBNZXNzYWdlcy5NU0dfRVJST1JfU0VSVkVSX0VSUk9SO1xyXG4gICAgICAgICAgICBlcnJvckluc3RhbmNlLmVycl9jb2RlID0gZXJyLnN0YXR1cztcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZXJyLnN0YXR1cyA9PT0gMCkge1xyXG4gICAgICAgICAgICBlcnJvckluc3RhbmNlLmVycl9tc2cgPSBNZXNzYWdlcy5NU0dfRVJST1JfU09NRVRISU5HX1dST05HO1xyXG4gICAgICAgICAgICBlcnJvckluc3RhbmNlLmVycl9jb2RlID0gZXJyLnN0YXR1cztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGVycm9ySW5zdGFuY2UuZXJyX21zZyA9IEpTT04ucGFyc2UoZXJyLl9ib2R5KS5lcnJvci5tZXNzYWdlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coZXJyb3JJbnN0YW5jZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGVycm9ySW5zdGFuY2UuZXJyX21zZyA9IE1lc3NhZ2VzLk1TR19FUlJPUl9TT01FVEhJTkdfV1JPTkc7XHJcbiAgICAgICAgICBlcnJvckluc3RhbmNlLmVycl9jb2RlID0gZXJyLnN0YXR1cztcclxuICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KGVycm9ySW5zdGFuY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG4iXX0=
