"use strict";
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
var constants_1 = require("../../../shared/constants");
var login_1 = require("../../../user/models/login");
var session_service_1 = require("../../../shared/services/session.service");
var analytic_service_1 = require("../../../shared/services/analytic.service");
var router_1 = require("@angular/router");
var CandidateSignUpVerificationComponent = (function () {
    function CandidateSignUpVerificationComponent(_router, analyticService) {
        this._router = _router;
        this.analyticService = analyticService;
        this.showModalStyle = false;
        this.signUpVerificationMessage = this.getMessages().MSG_MOBILE_VERIFICATION_MESSAGE;
        this.signUpVerificationHeading = this.getMessages().MSG_MOBILE_VERIFICATION_TITLE;
        this.actionName = this.getMessages().FROM_REGISTRATION;
        this.loginModel = new login_1.Login();
        this.userID = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.USER_ID);
        this.mobileNumber = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.MOBILE_NUMBER);
        fbq('track', 'PageView');
        this.analyticService.googleAnalyse(this._router);
    }
    CandidateSignUpVerificationComponent.prototype.getStyleModal = function () {
        if (this.showModalStyle) {
            return 'block';
        }
        else {
            return 'none';
        }
    };
    CandidateSignUpVerificationComponent.prototype.toggleModal = function () {
        this.showModalStyle = !this.showModalStyle;
    };
    CandidateSignUpVerificationComponent.prototype.getMessages = function () {
        return constants_1.Messages;
    };
    CandidateSignUpVerificationComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'cn-candidate-sign-up-verification',
            templateUrl: 'candidate-sign-up-verification.component.html',
            styleUrls: ['candidate-sign-up-verification.component.css'],
        }),
        __metadata("design:paramtypes", [router_1.Router, analytic_service_1.AnalyticService])
    ], CandidateSignUpVerificationComponent);
    return CandidateSignUpVerificationComponent;
}());
exports.CandidateSignUpVerificationComponent = CandidateSignUpVerificationComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvcmVnaXN0cmF0aW9uL2NhbmRpZGF0ZS1zaWduLXVwLXZlcmlmaWNhdGlvbi9jYW5kaWRhdGUtc2lnbi11cC12ZXJpZmljYXRpb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQTBDO0FBQzFDLHVEQUFxRTtBQUNyRSxvREFBbUQ7QUFDbkQsNEVBQWlGO0FBQ2pGLDhFQUE0RTtBQUM1RSwwQ0FBeUM7QUFTekM7SUFVRSw4Q0FBb0IsT0FBZSxFQUFVLGVBQWdDO1FBQXpELFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFIckUsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFJdEMsSUFBSSxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQywrQkFBK0IsQ0FBQztRQUNwRixJQUFJLENBQUMseUJBQXlCLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLDZCQUE2QixDQUFDO1FBQ2xGLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLGlCQUFpQixDQUFDO1FBQ3ZELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxhQUFLLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsTUFBTSxHQUFDLHVDQUFxQixDQUFDLGVBQWUsQ0FBQywwQkFBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFFLElBQUksQ0FBQyxZQUFZLEdBQUMsdUNBQXFCLENBQUMsZUFBZSxDQUFDLDBCQUFjLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdEYsR0FBRyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELDREQUFhLEdBQWI7UUFDRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUN4QixNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQztJQUNILENBQUM7SUFFRCwwREFBVyxHQUFYO1FBQ0UsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDN0MsQ0FBQztJQUNELDBEQUFXLEdBQVg7UUFDRSxNQUFNLENBQUMsb0JBQVEsQ0FBQztJQUNsQixDQUFDO0lBbENVLG9DQUFvQztRQU5oRCxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSxtQ0FBbUM7WUFDN0MsV0FBVyxFQUFFLCtDQUErQztZQUM1RCxTQUFTLEVBQUUsQ0FBQyw4Q0FBOEMsQ0FBQztTQUM1RCxDQUFDO3lDQVc2QixlQUFNLEVBQTJCLGtDQUFlO09BVmxFLG9DQUFvQyxDQW9DaEQ7SUFBRCwyQ0FBQztDQXBDRCxBQW9DQyxJQUFBO0FBcENZLG9GQUFvQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3JlZ2lzdHJhdGlvbi9jYW5kaWRhdGUtc2lnbi11cC12ZXJpZmljYXRpb24vY2FuZGlkYXRlLXNpZ24tdXAtdmVyaWZpY2F0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTZXNzaW9uU3RvcmFnZSwgTWVzc2FnZXMgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvY29uc3RhbnRzJztcclxuaW1wb3J0IHsgTG9naW4gfSBmcm9tICcuLi8uLi8uLi91c2VyL21vZGVscy9sb2dpbic7XHJcbmltcG9ydCB7IFNlc3Npb25TdG9yYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9zZXNzaW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBbmFseXRpY1NlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvc2VydmljZXMvYW5hbHl0aWMuc2VydmljZSc7XHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmRlY2xhcmUgdmFyIGZicTogYW55O1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICBzZWxlY3RvcjogJ2NuLWNhbmRpZGF0ZS1zaWduLXVwLXZlcmlmaWNhdGlvbicsXHJcbiAgdGVtcGxhdGVVcmw6ICdjYW5kaWRhdGUtc2lnbi11cC12ZXJpZmljYXRpb24uY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydjYW5kaWRhdGUtc2lnbi11cC12ZXJpZmljYXRpb24uY29tcG9uZW50LmNzcyddLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2FuZGlkYXRlU2lnblVwVmVyaWZpY2F0aW9uQ29tcG9uZW50IHtcclxuICBzaWduVXBWZXJpZmljYXRpb25NZXNzYWdlOnN0cmluZztcclxuICBzaWduVXBWZXJpZmljYXRpb25IZWFkaW5nOnN0cmluZztcclxuICBhY3Rpb25OYW1lOnN0cmluZztcclxuICB1c2VySUQ6c3RyaW5nO1xyXG4gIG1vYmlsZU51bWJlcjphbnk7XHJcbiAgcHJpdmF0ZSBsb2dpbk1vZGVsOkxvZ2luO1xyXG4gIHByaXZhdGUgc2hvd01vZGFsU3R5bGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3JvdXRlcjogUm91dGVyLCBwcml2YXRlIGFuYWx5dGljU2VydmljZTogQW5hbHl0aWNTZXJ2aWNlKSB7XHJcbiAgICB0aGlzLnNpZ25VcFZlcmlmaWNhdGlvbk1lc3NhZ2UgPSB0aGlzLmdldE1lc3NhZ2VzKCkuTVNHX01PQklMRV9WRVJJRklDQVRJT05fTUVTU0FHRTtcclxuICAgIHRoaXMuc2lnblVwVmVyaWZpY2F0aW9uSGVhZGluZyA9IHRoaXMuZ2V0TWVzc2FnZXMoKS5NU0dfTU9CSUxFX1ZFUklGSUNBVElPTl9USVRMRTtcclxuICAgIHRoaXMuYWN0aW9uTmFtZSA9IHRoaXMuZ2V0TWVzc2FnZXMoKS5GUk9NX1JFR0lTVFJBVElPTjtcclxuICAgIHRoaXMubG9naW5Nb2RlbCA9IG5ldyBMb2dpbigpO1xyXG4gICAgdGhpcy51c2VySUQ9U2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5VU0VSX0lEKTtcclxuICAgIHRoaXMubW9iaWxlTnVtYmVyPVNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuTU9CSUxFX05VTUJFUik7XHJcbiAgICBmYnEoJ3RyYWNrJywgJ1BhZ2VWaWV3Jyk7XHJcbiAgICB0aGlzLmFuYWx5dGljU2VydmljZS5nb29nbGVBbmFseXNlKHRoaXMuX3JvdXRlcik7XHJcbiAgfVxyXG5cclxuICBnZXRTdHlsZU1vZGFsKCkge1xyXG4gICAgaWYgKHRoaXMuc2hvd01vZGFsU3R5bGUpIHtcclxuICAgICAgcmV0dXJuICdibG9jayc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gJ25vbmUnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdG9nZ2xlTW9kYWwoKSB7XHJcbiAgICB0aGlzLnNob3dNb2RhbFN0eWxlID0gIXRoaXMuc2hvd01vZGFsU3R5bGU7XHJcbiAgfVxyXG4gIGdldE1lc3NhZ2VzKCkge1xyXG4gICAgcmV0dXJuIE1lc3NhZ2VzO1xyXG4gIH1cclxuXHJcbn1cclxuIl19
