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
                    errorInstance.err_msg = JSON.parse(err._body).message;
                    errorInstance.err_code = err.status;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvc2VydmljZXMvaHR0cC9jdXN0b20uaHR0cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBMkM7QUFDM0MsOEJBQXFDO0FBQ3JDLHNDQUErRztBQUMvRyx1Q0FBaUY7QUFDakYsZ0VBQTZEO0FBRzdEO0lBQWdDLDhCQUFJO0lBR2xDLG9CQUFZLE9BQTBCLEVBQUUsY0FBOEIsRUFDbEQsY0FBOEIsRUFDOUIsYUFBNEI7UUFGaEQsWUFHRSxrQkFBTSxPQUFPLEVBQUUsY0FBYyxDQUFDLFNBQy9CO1FBSG1CLG9CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixtQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUpoRCxrQkFBWSxHQUFXLGFBQWEsQ0FBQzs7SUFNckMsQ0FBQztJQUVELDRCQUFPLEdBQVAsVUFBUSxHQUFxQixFQUFFLE9BQTRCO1FBQ3pELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFNLE9BQU8sWUFBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsd0JBQUcsR0FBSCxVQUFJLEdBQVcsRUFBRSxPQUE0QjtRQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBTSxHQUFHLFlBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELHlCQUFJLEdBQUosVUFBSyxHQUFXLEVBQUUsSUFBUyxFQUFFLE9BQTRCO1FBQ3ZELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFNLElBQUksWUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELHdCQUFHLEdBQUgsVUFBSSxHQUFXLEVBQUUsSUFBWSxFQUFFLE9BQTRCO1FBQ3pELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFNLEdBQUcsWUFBQyxHQUFHLEVB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SUEvRFUsVUFBVTtRQUR0QixpQkFBVSxFQUFFO3lDQUlVLHdCQUFpQixFQUFrQixxQkFBYztZQUNsQyxzQkFBYztZQUNmLCtCQUFhO09BTHJDLFVBQVUsQ0FnRXRCO0lBQUQsaUJBQUM7Q0FoRUQsQUFnRUMsQ0FoRStCLFdBQUksR0FnRW5DO0FBaEVZLGdDQUFVIiwiZmlsZSI6ImFwcC9zaGFyZWQvc2VydmljZXMvaHR0cC9jdXN0b20uaHR0cC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvUngnO1xyXG5pbXBvcnQgeyBDb25uZWN0aW9uQmFja2VuZCwgSHR0cCwgUmVxdWVzdCwgUmVxdWVzdE9wdGlvbnMsIFJlcXVlc3RPcHRpb25zQXJncywgUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9odHRwJztcclxuaW1wb3J0IHsgRXJyb3JJbnN0YW5jZSwgTWVzc2FnZSwgTWVzc2FnZXMsIE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi8uLi8uLi9pbmRleCc7XHJcbmltcG9ydCB7IExvYWRlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9sb2FkZXIvbG9hZGVycy5zZXJ2aWNlJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEN1c3RvbUh0dHAgZXh0ZW5kcyBIdHRwIHtcclxuICBzb21lUHJvcGVydHk6IHN0cmluZyA9ICdzb21lIHN0cmluZyc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGJhY2tlbmQ6IENvbm5lY3Rpb25CYWNrZW5kLCBkZWZhdWx0T3B0aW9uczogUmVxdWVzdE9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBtZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBsb2FkZXJTZXJ2aWNlOiBMb2FkZXJTZXJ2aWNlKSB7XHJcbiAgICBzdXBlcihiYWNrZW5kLCBkZWZhdWx0T3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICByZXF1ZXN0KHVybDogc3RyaW5nIHwgUmVxdWVzdCwgb3B0aW9ucz86IFJlcXVlc3RPcHRpb25zQXJncyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5pbnRlcmNlcHQoc3VwZXIucmVxdWVzdCh1cmwsIG9wdGlvbnMpKTtcclxuICB9XHJcblxyXG4gIGdldCh1cmw6IHN0cmluZywgb3B0aW9ucz86IFJlcXVlc3RPcHRpb25zQXJncyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5pbnRlcmNlcHQoc3VwZXIuZ2V0KHVybCwgb3B0aW9ucykpO1xyXG4gIH1cclxuXHJcbiAgcG9zdCh1cmw6IHN0cmluZywgYm9keTogYW55LCBvcHRpb25zPzogUmVxdWVzdE9wdGlvbnNBcmdzKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLmludGVyY2VwdChzdXBlci5wb3N0KHVybCwgYm9keSwgb3B0aW9ucykpO1xyXG4gIH1cclxuXHJcbiAgcHV0KHVybDogc3RyaW5nLCBib2R5OiBzdHJpbmcsIG9wdGlvbnM/OiBSZXF1ZXN0T3B0aW9uc0FyZ3MpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaW50ZXJjZXB0KHN1cGVyLnB1dCh1cmwsIGJvZHksIG9wdGlvbnMpKTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZSh1cmw6IHN0cmluZywgb3B0aW9ucz86IFJlcXVlc3RPcHRpb25zQXJncyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICByZXR1cm4gdGhpcy5pbnRlcmNlcHQoc3VwZXIuZGVsZXRlKHVybCwgb3B0aW9ucykpO1xyXG4gIH1cclxuXHJcbiAgaW50ZXJjZXB0KG9ic2VydmFibGU6IE9ic2VydmFibGU8YW55Pik6IE9ic2VydmFibGU8UmVzcG9uc2U+IHtcclxuICAgLy8gdGhpcy5sb2FkZXJTZXJ2aWNlLnN0YXJ0KCk7XHJcbiAgICByZXR1cm4gb2JzZXJ2YWJsZS5kbygoKSA9PiBjb25zb2xlLmxvZygnJykpXHJcbiAgICAgIC5jYXRjaCgoZXJyLCBzb3VyY2UpID0+IHtcclxuXHJcbi8vICAgICAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gICAgICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgICAgICBtZXNzYWdlLmlzRXJyb3IgPSB0cnVlO1xyXG4gICAgICAgIHZhciBlcnJvckluc3RhbmNlID0gbmV3IEVycm9ySW5zdGFuY2UoKTtcclxuICAgICAgICBpZiAoZXJyLmVycl9tc2cgJiYgZXJyLmVycl9jb2RlKSB7XHJcbiAgICAgICAgICBlcnJvckluc3RhbmNlLmVycl9tc2cgPSBlcnIuZXJyX21zZztcclxuICAgICAgICAgIGVycm9ySW5zdGFuY2UuZXJyX2NvZGUgPSBlcnIuZXJyX2NvZGU7XHJcbiAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdyhlcnJvckluc3RhbmNlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGVyci5zdGF0dXMpIHtcclxuICAgICAgICAgIGlmIChlcnIuc3RhdHVzID09PSA0MDEgfHwgZXJyLnN0YXR1cyA9PT0gNDAzIHx8IGVyci5zdGF0dXMgPT09IDQwMCApIHtcclxuICAgICAgICAgICAgZXJyb3JJbnN0YW5jZS5lcnJfY29kZSA9IGVyci5zdGF0dXM7XHJcbiAgICAgICAgICAgIGVycm9ySW5zdGFuY2UuZXJyX21zZyA9IEpTT04ucGFyc2UoZXJyLl9ib2R5KS5lcnJvci5tZXNzYWdlO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChlcnIuc3RhdHVzID09PSA0MDQpIHtcclxuICAgICAgICAgICAgZXJyb3JJbnN0YW5jZS5lcnJfbXNnID0gTWVzc2FnZXMuTVNHX0VSUk9SX1NFUlZFUl9FUlJPUjtcclxuICAgICAgICAgICAgZXJyb3JJbnN0YW5jZS5lcnJfY29kZSA9IGVyci5zdGF0dXM7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGVyci5zdGF0dXMgPT09IDApIHtcclxuICAgICAgICAgICAgZXJyb3JJbnN0YW5jZS5lcnJfbXNnID0gTWVzc2FnZXMuTVNHX0VSUk9SX1NPTUVUSElOR19XUk9ORztcclxuICAgICAgICAgICAgZXJyb3JJbnN0YW5jZS5lcnJfY29kZSA9IGVyci5zdGF0dXM7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlcnJvckluc3RhbmNlLmVycl9tc2cgPSBKU09OLnBhcnNlKGVyci5fYm9keSkubWVzc2FnZTtcclxuICAgICAgICAgICAgZXJyb3JJbnN0YW5jZS5lcnJfY29kZSA9IGVyci5zdGF0dXM7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdyhlcnJvckluc3RhbmNlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZXJyb3JJbnN0YW5jZS5lcnJfbXNnID0gTWVzc2FnZXMuTVNHX0VSUk9SX1NPTUVUSElOR19XUk9ORztcclxuICAgICAgICAgIGVycm9ySW5zdGFuY2UuZXJyX2NvZGUgPSBlcnIuc3RhdHVzO1xyXG4gICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUudGhyb3coZXJyb3JJbnN0YW5jZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbiJdfQ==
