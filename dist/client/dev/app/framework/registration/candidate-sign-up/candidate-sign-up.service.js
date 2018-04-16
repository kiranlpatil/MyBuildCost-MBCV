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
var index_1 = require("../../../shared/index");
var http_1 = require("@angular/http");
var CandidateSignUpService = (function (_super) {
    __extends(CandidateSignUpService, _super);
    function CandidateSignUpService(http) {
        var _this = _super.call(this) || this;
        _this.http = http;
        return _this;
    }
    CandidateSignUpService.prototype.addCandidate = function (candidate) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        var body = JSON.stringify(candidate);
        return this.http.post(index_1.API.CANDIDATE_PROFILE, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    };
    CandidateSignUpService.prototype.sendMailToRecruiter = function (data) {
        var url = index_1.API.SEND_NOTIFICATION_TO_RECRUITER;
        var body = JSON.stringify(data);
        return this.http.post(url, body)
            .map(this.extractData)
            .catch(this.handleError);
    };
    CandidateSignUpService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], CandidateSignUpService);
    return CandidateSignUpService;
}(index_1.BaseService));
exports.CandidateSignUpService = CandidateSignUpService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvcmVnaXN0cmF0aW9uL2NhbmRpZGF0ZS1zaWduLXVwL2NhbmRpZGF0ZS1zaWduLXVwLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0NBQTJDO0FBRzNDLCtDQUF5RDtBQUN6RCxzQ0FBOEQ7QUFHOUQ7SUFBNEMsMENBQVc7SUFDckQsZ0NBQW9CLElBQVU7UUFBOUIsWUFDRSxpQkFBTyxTQUNSO1FBRm1CLFVBQUksR0FBSixJQUFJLENBQU07O0lBRTlCLENBQUM7SUFFRCw2Q0FBWSxHQUFaLFVBQWEsU0FBMEI7UUFDckMsSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLENBQUMsRUFBQyxjQUFjLEVBQUUsa0JBQWtCLEVBQUMsQ0FBQyxDQUFDO1FBQ2hFLElBQUksT0FBTyxHQUFHLElBQUkscUJBQWMsQ0FBQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDO2FBQ3hELEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2FBQ3JCLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELG9EQUFtQixHQUFuQixVQUFvQixJQUFTO1FBQzNCLElBQUksR0FBRyxHQUFHLFdBQUcsQ0FBQyw4QkFBOEIsQ0FBRTtRQUM5QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO2FBQzdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2FBQ3JCLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQXBCVSxzQkFBc0I7UUFEbEMsaUJBQVUsRUFBRTt5Q0FFZSxXQUFJO09BRG5CLHNCQUFzQixDQXNCbEM7SUFBRCw2QkFBQztDQXRCRCxBQXNCQyxDQXRCMkMsbUJBQVcsR0FzQnREO0FBdEJZLHdEQUFzQiIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3JlZ2lzdHJhdGlvbi9jYW5kaWRhdGUtc2lnbi11cC9jYW5kaWRhdGUtc2lnbi11cC5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHsgQ2FuZGlkYXRlRGV0YWlsIH0gZnJvbSAnLi4vLi4vLi4vdXNlci9tb2RlbHMvY2FuZGlkYXRlLWRldGFpbHMnO1xyXG5pbXBvcnQgeyBBUEksIEJhc2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL2luZGV4JztcclxuaW1wb3J0IHsgSGVhZGVycywgSHR0cCwgUmVxdWVzdE9wdGlvbnMgfSBmcm9tICdAYW5ndWxhci9odHRwJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIENhbmRpZGF0ZVNpZ25VcFNlcnZpY2UgZXh0ZW5kcyBCYXNlU2VydmljZSB7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gIH1cclxuXHJcbiAgYWRkQ2FuZGlkYXRlKGNhbmRpZGF0ZTogQ2FuZGlkYXRlRGV0YWlsKTogT2JzZXJ2YWJsZTxDYW5kaWRhdGVEZXRhaWw+IHtcclxuICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9KTtcclxuICAgIGxldCBvcHRpb25zID0gbmV3IFJlcXVlc3RPcHRpb25zKHtoZWFkZXJzOiBoZWFkZXJzfSk7XHJcbiAgICBsZXQgYm9keSA9IEpTT04uc3RyaW5naWZ5KGNhbmRpZGF0ZSk7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QoQVBJLkNBTkRJREFURV9QUk9GSUxFLCBib2R5LCBvcHRpb25zKVxyXG4gICAgICAubWFwKHRoaXMuZXh0cmFjdERhdGEpXHJcbiAgICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9yKTtcclxuICB9XHJcblxyXG4gIHNlbmRNYWlsVG9SZWNydWl0ZXIoZGF0YTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIHZhciB1cmwgPSBBUEkuU0VORF9OT1RJRklDQVRJT05fVE9fUkVDUlVJVEVSIDtcclxuICAgIHZhciBib2R5ID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodXJsLCBib2R5KVxyXG4gICAgICAubWFwKHRoaXMuZXh0cmFjdERhdGEpXHJcbiAgICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9yKTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==
