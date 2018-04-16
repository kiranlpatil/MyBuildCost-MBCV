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
var router_1 = require("@angular/router");
var change_mobile_service_1 = require("./change-mobile.service");
var change_mobile_1 = require("../../models/change-mobile");
var index_1 = require("../../../shared/index");
var forms_1 = require("@angular/forms");
var validation_service_1 = require("../../../shared/customvalidations/validation.service");
var session_service_1 = require("../../../shared/services/session.service");
var constants_1 = require("../../../shared/constants");
var loaders_service_1 = require("../../../shared/loader/loaders.service");
var ChangeMobileComponent = (function () {
    function ChangeMobileComponent(commonService, _router, MobileService, messageService, formBuilder, loaderService) {
        this.commonService = commonService;
        this._router = _router;
        this.MobileService = MobileService;
        this.messageService = messageService;
        this.formBuilder = formBuilder;
        this.loaderService = loaderService;
        this.onMobileNumberChangeComplete = new core_1.EventEmitter();
        this.model = new change_mobile_1.ChangeMobile();
        this.isShowErrorMessage = false;
        this.showModalStyle = false;
        this.showModalStyleVerification = false;
        this.mobileNumberNotMatch = constants_1.Messages.MSG_MOBILE_NUMBER_NOT_MATCH;
        this.mobileNumberChangeSucess = constants_1.Messages.MSG_MOBILE_NUMBER_Change_SUCCESS;
        this.userForm = this.formBuilder.group({
            'new_mobile_number': ['', [forms_1.Validators.required, validation_service_1.ValidationService.mobileNumberValidator]],
            'confirm_mobile_number': ['', [forms_1.Validators.required, validation_service_1.ValidationService.mobileNumberValidator]],
            'current_mobile_number': ['', [forms_1.Validators.required, validation_service_1.ValidationService.mobileNumberValidator]]
        });
        this.MOBILE_ICON = index_1.ImagePath.MOBILE_ICON_GREY;
        this.NEW_MOBILE_ICON = index_1.ImagePath.NEW_MOBILE_ICON_GREY;
        this.CONFIRM_MOBILE_ICON = index_1.ImagePath.CONFIRM_MOBILE_ICON_GREY;
    }
    ChangeMobileComponent.prototype.makeMobileConfirm = function () {
        if (this.model.confirm_mobile_number !== this.model.new_mobile_number) {
            this.isMobileNoConfirm = true;
            return true;
        }
        else {
            this.isMobileNoConfirm = false;
            return false;
        }
    };
    ChangeMobileComponent.prototype.ngOnInit = function () {
        this.model.current_mobile_number = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.MOBILE_NUMBER);
    };
    ChangeMobileComponent.prototype.onChangeInputValue = function () {
        this.isMobileNoConfirm = false;
        this.isShowErrorMessage = false;
    };
    ChangeMobileComponent.prototype.onSubmit = function () {
        var _this = this;
        this.model = this.userForm.value;
        if (!this.makeMobileConfirm()) {
            this.MobileService.changeMobile(this.model)
                .subscribe(function (body) { return _this.changeMobileSuccess(body); }, function (error) { return _this.changeMobileFailure(error); });
        }
        document.body.scrollTop = 0;
    };
    ChangeMobileComponent.prototype.changeMobileSuccess = function (body) {
        session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.VERIFIED_MOBILE_NUMBER, this.model.new_mobile_number);
        session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.VERIFY_PHONE_VALUE, 'from_settings');
        this.raiseOtpVerification();
    };
    ChangeMobileComponent.prototype.raiseOtpVerification = function () {
        this.verificationMessage = this.getMessages().MSG_MOBILE_NUMBER_CHANGE_VERIFICATION_MESSAGE;
        this.verificationMessageHeading = this.getMessages().MSG_MOBILE_NUMBER_CHANGE_VERIFICATION_TITLE;
        this.actioName = this.getMessages().FROM_ACCOUNT_DETAIL;
        this.showModalStyleVerification = true;
        this.model.id = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.USER_ID);
    };
    ChangeMobileComponent.prototype.changeMobileFailure = function (error) {
        if (error.err_code === 404 || error.err_code === 0 || error.err_code === 401) {
            var message = new index_1.Message();
            message.error_msg = error.err_msg;
            message.isError = true;
            this.messageService.message(message);
        }
        else {
            this.isShowErrorMessage = true;
            this.error_msg = error.err_msg;
        }
    };
    ChangeMobileComponent.prototype.goBack = function () {
        this.commonService.goBack();
    };
    ChangeMobileComponent.prototype.getMessages = function () {
        return constants_1.Messages;
    };
    ChangeMobileComponent.prototype.toggleModal = function () {
        this.showModalStyle = !this.showModalStyle;
    };
    ChangeMobileComponent.prototype.showHideModalVerification = function () {
        this.showModalStyleVerification = !this.showModalStyleVerification;
        this.model.current_mobile_number = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.MOBILE_NUMBER);
        this.onMobileNumberChangeComplete.emit();
    };
    ChangeMobileComponent.prototype.logOut = function () {
        window.sessionStorage.clear();
        window.localStorage.clear();
        this._router.navigate([index_1.NavigationRoutes.APP_START]);
    };
    ChangeMobileComponent.prototype.getStyle = function () {
        if (this.showModalStyle) {
            return 'block';
        }
        else {
            return 'none';
        }
    };
    ChangeMobileComponent.prototype.getStyleVerification = function () {
        if (this.showModalStyleVerification) {
            return 'block';
        }
        else {
            return 'none';
        }
    };
    ChangeMobileComponent.prototype.onMobileNumberChange = function () {
        session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.MOBILE_NUMBER, constants_1.SessionStorage.VERIFIED_MOBILE_NUMBER);
        this.userForm.reset();
        this.showModalStyleVerification = !this.showModalStyleVerification;
        this.model.current_mobile_number = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.VERIFIED_MOBILE_NUMBER);
        session_service_1.SessionStorageService.setSessionValue(constants_1.SessionStorage.MOBILE_NUMBER, this.model.current_mobile_number);
        this.onMobileNumberChangeComplete.emit();
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], ChangeMobileComponent.prototype, "onMobileNumberChangeComplete", void 0);
    ChangeMobileComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'cn-change-mobile',
            templateUrl: 'change-mobile.component.html',
            styleUrls: ['change-mobile.component.css'],
        }),
        __metadata("design:paramtypes", [index_1.CommonService, router_1.Router,
            change_mobile_service_1.ChangeMobileService, index_1.MessageService, forms_1.FormBuilder,
            loaders_service_1.LoaderService])
    ], ChangeMobileComponent);
    return ChangeMobileComponent;
}());
exports.ChangeMobileComponent = ChangeMobileComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91c2VyL3NldHRpbmdzL2NoYW5nZS1tb2JpbGUvY2hhbmdlLW1vYmlsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBd0U7QUFDeEUsMENBQXlDO0FBQ3pDLGlFQUE4RDtBQUM5RCw0REFBMEQ7QUFDMUQsK0NBQTRHO0FBQzVHLHdDQUFvRTtBQUNwRSwyRkFBeUY7QUFDekYsNEVBQWlGO0FBQ2pGLHVEQUFxRTtBQUNyRSwwRUFBdUU7QUFVdkU7SUFtQkUsK0JBQW9CLGFBQTRCLEVBQVUsT0FBZSxFQUNyRCxhQUFrQyxFQUFVLGNBQThCLEVBQVUsV0FBd0IsRUFDNUcsYUFBNEI7UUFGNUIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ3JELGtCQUFhLEdBQWIsYUFBYSxDQUFxQjtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQzVHLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBcEJ0QyxpQ0FBNEIsR0FBMEIsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFHbkYsVUFBSyxHQUFHLElBQUksNEJBQVksRUFBRSxDQUFDO1FBTTNCLHVCQUFrQixHQUFZLEtBQUssQ0FBQztRQUNwQyxtQkFBYyxHQUFZLEtBQUssQ0FBQztRQUNoQywrQkFBMEIsR0FBWSxLQUFLLENBQUM7UUFJNUMseUJBQW9CLEdBQVMsb0JBQVEsQ0FBQywyQkFBMkIsQ0FBQztRQUNsRSw2QkFBd0IsR0FBUyxvQkFBUSxDQUFDLGdDQUFnQyxDQUFDO1FBTXpFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7WUFDckMsbUJBQW1CLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxrQkFBVSxDQUFDLFFBQVEsRUFBRSxzQ0FBaUIsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ3pGLHVCQUF1QixFQUFFLENBQUMs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QUFDLDRCQUE0QixDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNDLENBQUM7SUF4SVM7UUFBVCxhQUFNLEVBQUU7a0NBQStCLG1CQUFZOytFQUErQjtJQUR4RSxxQkFBcUI7UUFQakMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsa0JBQWtCO1lBQzVCLFdBQVcsRUFBRSw4QkFBOEI7WUFDM0MsU0FBUyxFQUFFLENBQUMsNkJBQTZCLENBQUM7U0FDM0MsQ0FBQzt5Q0FxQm1DLHFCQUFhLEVBQW1CLGVBQU07WUFDdEMsMkNBQW1CLEVBQTBCLHNCQUFjLEVBQXVCLG1CQUFXO1lBQzdGLCtCQUFhO09BckJyQyxxQkFBcUIsQ0EwSWpDO0lBQUQsNEJBQUM7Q0ExSUQsQUEwSUMsSUFBQTtBQTFJWSxzREFBcUIiLCJmaWxlIjoiYXBwL3VzZXIvc2V0dGluZ3MvY2hhbmdlLW1vYmlsZS9jaGFuZ2UtbW9iaWxlLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBDaGFuZ2VNb2JpbGVTZXJ2aWNlIH0gZnJvbSAnLi9jaGFuZ2UtbW9iaWxlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDaGFuZ2VNb2JpbGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvY2hhbmdlLW1vYmlsZSc7XHJcbmltcG9ydCB7IENvbW1vblNlcnZpY2UsIEltYWdlUGF0aCwgTWVzc2FnZSwgTWVzc2FnZVNlcnZpY2UsIE5hdmlnYXRpb25Sb3V0ZXMgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvaW5kZXgnO1xyXG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBWYWxpZGF0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9jdXN0b212YWxpZGF0aW9ucy92YWxpZGF0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTZXNzaW9uU3RvcmFnZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvc2VydmljZXMvc2Vzc2lvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU2Vzc2lvblN0b3JhZ2UsIE1lc3NhZ2VzIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IExvYWRlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvbG9hZGVyL2xvYWRlcnMuc2VydmljZSc7XHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICBzZWxlY3RvcjogJ2NuLWNoYW5nZS1tb2JpbGUnLFxyXG4gIHRlbXBsYXRlVXJsOiAnY2hhbmdlLW1vYmlsZS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJ2NoYW5nZS1tb2JpbGUuY29tcG9uZW50LmNzcyddLFxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIENoYW5nZU1vYmlsZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQE91dHB1dCgpIG9uTW9iaWxlTnVtYmVyQ2hhbmdlQ29tcGxldGU6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgaXNNb2JpbGVOb0NvbmZpcm06IGJvb2xlYW47XHJcbiAgbW9kZWwgPSBuZXcgQ2hhbmdlTW9iaWxlKCk7XHJcbiAgdXNlckZvcm06IEZvcm1Hcm91cDtcclxuICBlcnJvcl9tc2c6IHN0cmluZztcclxuICB2ZXJpZmljYXRpb25NZXNzYWdlOiBzdHJpbmc7XHJcbiAgdmVyaWZpY2F0aW9uTWVzc2FnZUhlYWRpbmc6IHN0cmluZztcclxuICBhY3Rpb05hbWU6IHN0cmluZztcclxuICBpc1Nob3dFcnJvck1lc3NhZ2U6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBzaG93TW9kYWxTdHlsZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHNob3dNb2RhbFN0eWxlVmVyaWZpY2F0aW9uOiBib29sZWFuID0gZmFsc2U7XHJcbiAgTU9CSUxFX0lDT046IHN0cmluZztcclxuICBORVdfTU9CSUxFX0lDT046IHN0cmluZztcclxuICBDT05GSVJNX01PQklMRV9JQ09OOiBzdHJpbmc7XHJcbiAgbW9iaWxlTnVtYmVyTm90TWF0Y2g6c3RyaW5nPSBNZXNzYWdlcy5NU0dfTU9CSUxFX05VTUJFUl9OT1RfTUFUQ0g7XHJcbiAgbW9iaWxlTnVtYmVyQ2hhbmdlU3VjZXNzOnN0cmluZyA9TWVzc2FnZXMuTVNHX01PQklMRV9OVU1CRVJfQ2hhbmdlX1NVQ0NFU1M7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29tbW9uU2VydmljZTogQ29tbW9uU2VydmljZSwgcHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBNb2JpbGVTZXJ2aWNlOiBDaGFuZ2VNb2JpbGVTZXJ2aWNlLCBwcml2YXRlIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSwgcHJpdmF0ZSBmb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBsb2FkZXJTZXJ2aWNlOiBMb2FkZXJTZXJ2aWNlKSB7XHJcblxyXG4gICAgdGhpcy51c2VyRm9ybSA9IHRoaXMuZm9ybUJ1aWxkZXIuZ3JvdXAoe1xyXG4gICAgICAnbmV3X21vYmlsZV9udW1iZXInOiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkLCBWYWxpZGF0aW9uU2VydmljZS5tb2JpbGVOdW1iZXJWYWxpZGF0b3JdXSxcclxuICAgICAgJ2NvbmZpcm1fbW9iaWxlX251bWJlcic6IFsnJywgW1ZhbGlkYXRvcnMucmVxdWlyZWQsIFZhbGlkYXRpb25TZXJ2aWNlLm1vYmlsZU51bWJlclZhbGlkYXRvcl1dLFxyXG4gICAgICAnY3VycmVudF9tb2JpbGVfbnVtYmVyJzogWycnLCBbVmFsaWRhdG9ycy5yZXF1aXJlZCwgVmFsaWRhdGlvblNlcnZpY2UubW9iaWxlTnVtYmVyVmFsaWRhdG9yXV1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuTU9CSUxFX0lDT04gPSBJbWFnZVBhdGguTU9CSUxFX0lDT05fR1JFWTtcclxuICAgIHRoaXMuTkVXX01PQklMRV9JQ09OID0gSW1hZ2VQYXRoLk5FV19NT0JJTEVfSUNPTl9HUkVZO1xyXG4gICAgdGhpcy5DT05GSVJNX01PQklMRV9JQ09OID0gSW1hZ2VQYXRoLkNPTkZJUk1fTU9CSUxFX0lDT05fR1JFWTtcclxuICB9XHJcblxyXG4gIG1ha2VNb2JpbGVDb25maXJtKCk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHRoaXMubW9kZWwuY29uZmlybV9tb2JpbGVfbnVtYmVyICE9PSB0aGlzLm1vZGVsLm5ld19tb2JpbGVfbnVtYmVyKSB7XHJcbiAgICAgIHRoaXMuaXNNb2JpbGVOb0NvbmZpcm0gPSB0cnVlO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuaXNNb2JpbGVOb0NvbmZpcm0gPSBmYWxzZTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLm1vZGVsLmN1cnJlbnRfbW9iaWxlX251bWJlciA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuTU9CSUxFX05VTUJFUik7XHJcbiAgfVxyXG5cclxuICBvbkNoYW5nZUlucHV0VmFsdWUoKSB7XHJcbiAgICB0aGlzLmlzTW9iaWxlTm9Db25maXJtPWZhbHNlO1xyXG4gICAgdGhpcy5pc1Nob3dFcnJvck1lc3NhZ2U9ZmFsc2U7XHJcbiAgfVxyXG5cclxuICBvblN1Ym1pdCgpIHtcclxuICAgIHRoaXMubW9kZWwgPSB0aGlzLnVzZXJGb3JtLnZhbHVlO1xyXG4gICAgaWYgKCF0aGlzLm1ha2VNb2JpbGVDb25maXJtKCkpIHtcclxuICAgICAgdGhpcy5Nb2JpbGVTZXJ2aWNlLmNoYW5nZU1vYmlsZSh0aGlzLm1vZGVsKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgICBib2R5ID0+IHRoaXMuY2hhbmdlTW9iaWxlU3VjY2Vzcyhib2R5KSxcclxuICAgICAgICAgIGVycm9yID0+IHRoaXMuY2hhbmdlTW9iaWxlRmFpbHVyZShlcnJvcikpO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSAwO1xyXG4gIH1cclxuXHJcbiAgY2hhbmdlTW9iaWxlU3VjY2Vzcyhib2R5OiBDaGFuZ2VNb2JpbGUpIHtcclxuICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuVkVSSUZJRURfTU9CSUxFX05VTUJFUiwgdGhpcy5tb2RlbC5uZXdfbW9iaWxlX251bWJlcik7XHJcbiAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLlZFUklGWV9QSE9ORV9WQUxVRSwgJ2Zyb21fc2V0dGluZ3MnKTtcclxuICAgIHRoaXMucmFpc2VPdHBWZXJpZmljYXRpb24oKTtcclxuICB9XHJcblxyXG4gICByYWlzZU90cFZlcmlmaWNhdGlvbigpIHtcclxuICAgICB0aGlzLnZlcmlmaWNhdGlvbk1lc3NhZ2U9dGhpcy5nZXRNZXNzYWdlcygpLk1TR19NT0JJTEVfTlVNQkVSX0NIQU5HRV9WRVJJRklDQVRJT05fTUVTU0FHRTtcclxuICAgICB0aGlzLnZlcmlmaWNhdGlvbk1lc3NhZ2VIZWFkaW5nPXRoaXMuZ2V0TWVzc2FnZXMoKS5NU0dfTU9CSUxFX05VTUJFUl9DSEFOR0VfVkVSSUZJQ0FUSU9OX1RJVExFO1xyXG4gICAgIHRoaXMuYWN0aW9OYW1lPXRoaXMuZ2V0TWVzc2FnZXMoKS5GUk9NX0FDQ09VTlRfREVUQUlMO1xyXG4gICAgIHRoaXMuc2hvd01vZGFsU3R5bGVWZXJpZmljYXRpb249dHJ1ZTtcclxuICAgICB0aGlzLm1vZGVsLmlkPVNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuVVNFUl9JRCk7XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VNb2JpbGVGYWlsdXJlKGVycm9yOiBhbnkpIHtcclxuICAgIGlmIChlcnJvci5lcnJfY29kZSA9PT0gNDA0IHx8IGVycm9yLmVycl9jb2RlID09PSAwIHx8IGVycm9yLmVycl9jb2RlPT09NDAxKSB7XHJcbiAgICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgICAgbWVzc2FnZS5lcnJvcl9tc2cgPSBlcnJvci5lcnJfbXNnO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSB0cnVlO1xyXG4gICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmlzU2hvd0Vycm9yTWVzc2FnZSA9IHRydWU7XHJcbiAgICAgIHRoaXMuZXJyb3JfbXNnID0gZXJyb3IuZXJyX21zZztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdvQmFjaygpIHtcclxuICAgIHRoaXMuY29tbW9uU2VydmljZS5nb0JhY2soKTtcclxuICB9XHJcblxyXG4gIGdldE1lc3NhZ2VzKCkge1xyXG4gICAgcmV0dXJuIE1lc3NhZ2VzO1xyXG4gIH1cclxuXHJcbiAgdG9nZ2xlTW9kYWwoKSB7XHJcbiAgICB0aGlzLnNob3dNb2RhbFN0eWxlID0gIXRoaXMuc2hvd01vZGFsU3R5bGU7XHJcbiAgfVxyXG5cclxuICBzaG93SGlkZU1vZGFsVmVyaWZpY2F0aW9uKCkge1xyXG4gICAgdGhpcy5zaG93TW9kYWxTdHlsZVZlcmlmaWNhdGlvbiA9ICF0aGlzLnNob3dNb2RhbFN0eWxlVmVyaWZpY2F0aW9uO1xyXG4gICAgdGhpcy5tb2RlbC5jdXJyZW50X21vYmlsZV9udW1iZXI9U2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5NT0JJTEVfTlVNQkVSKTtcclxuICAgIHRoaXMub25Nb2JpbGVOdW1iZXJDaGFuZ2VDb21wbGV0ZS5lbWl0KCk7XHJcbiAgfVxyXG5cclxuICBsb2dPdXQoKSB7XHJcbiAgICB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UuY2xlYXIoKTtcclxuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UuY2xlYXIoKTtcclxuICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbTmF2aWdhdGlvblJvdXRlcy5BUFBfU1RBUlRdKTtcclxuICB9XHJcblxyXG4gIGdldFN0eWxlKCkge1xyXG4gICAgaWYgKHRoaXMuc2hvd01vZGFsU3R5bGUpIHtcclxuICAgICAgcmV0dXJuICdibG9jayc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gJ25vbmUnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0U3R5bGVWZXJpZmljYXRpb24oKSB7XHJcbiAgICBpZiAodGhpcy5zaG93TW9kYWxTdHlsZVZlcmlmaWNhdGlvbikge1xyXG4gICAgICByZXR1cm4gJ2Jsb2NrJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAnbm9uZSc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbk1vYmlsZU51bWJlckNoYW5nZSgpIHtcclxuICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuTU9CSUxFX05VTUJFUiwgU2Vzc2lvblN0b3JhZ2UuVkVSSUZJRURfTU9CSUxFX05VTUJFUik7XHJcbiAgICB0aGlzLnVzZXJGb3JtLnJlc2V0KCk7XHJcbiAgICB0aGlzLnNob3dNb2RhbFN0eWxlVmVyaWZpY2F0aW9uPSF0aGlzLnNob3dNb2RhbFN0eWxlVmVyaWZpY2F0aW9uO1xyXG4gICAgdGhpcy5tb2RlbC5jdXJyZW50X21vYmlsZV9udW1iZXI9U2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5WRVJJRklFRF9NT0JJTEVfTlVNQkVSKTtcclxuICAgIFNlc3Npb25TdG9yYWdlU2VydmljZS5zZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuTU9CSUxFX05VTUJFUix0aGlzLm1vZGVsLmN1cnJlbnRfbW9iaWxlX251bWJlcik7XHJcbiAgICB0aGlzLm9uTW9iaWxlTnVtYmVyQ2hhbmdlQ29tcGxldGUuZW1pdCgpO1xyXG4gIH1cclxufVxyXG4iXX0=
