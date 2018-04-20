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
var dashboard_user_profile_service_1 = require("./dashboard-user-profile.service");
var user_1 = require("./../../../user/models/user");
var forms_1 = require("@angular/forms");
var validation_service_1 = require("../../../shared/customvalidations/validation.service");
var constants_1 = require("../../../shared/constants");
var index_1 = require("../../../shared/index");
var router_1 = require("@angular/router");
var DashboardProfileComponent = (function () {
    function DashboardProfileComponent(dashboardUserProfileService, _router, formBuilder, messageService, profileService) {
        this.dashboardUserProfileService = dashboardUserProfileService;
        this._router = _router;
        this.formBuilder = formBuilder;
        this.messageService = messageService;
        this.profileService = profileService;
        this.submitted = false;
        this.isShowErrorMessage = true;
        this.error_msg = false;
        this.showModalStyle = false;
        this.showStyleMobile = false;
        this.model = new user_1.UserProfile();
        this.userForm = this.formBuilder.group({
            'first_name': ['', forms_1.Validators.required],
            'email': ['', [forms_1.Validators.required, validation_service_1.ValidationService.emailValidator]],
            'mobile_number': ['', [forms_1.Validators.required, validation_service_1.ValidationService.mobileNumberValidator]],
            'company_name': ['', [forms_1.Validators.required, validation_service_1.ValidationService.alphabatesValidator]],
            'state': ['', [forms_1.Validators.required, validation_service_1.ValidationService.alphabatesValidator]],
            'city': ['', [forms_1.Validators.required, validation_service_1.ValidationService.alphabatesValidator]]
        });
    }
    DashboardProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dashboardUserProfileService.getUserProfile()
            .subscribe(function (body) { return _this.setUserDetails(body); }, function (error) { return _this.failUserDetails(error); });
    };
    DashboardProfileComponent.prototype.setUserDetails = function (body) {
        var user = body.data;
        this.model.first_name = user.first_name;
        this.model.email = user.email;
        this.model.mobile_number = user.mobile_number;
        this.model.company_name = user.company_name;
        this.model.state = user.state;
        this.model.city = user.city;
        this.first_letter = (user.first_name).toString().charAt(0);
    };
    DashboardProfileComponent.prototype.failUserDetails = function (error) {
        console.log('Error : ' + JSON.stringify(error));
    };
    DashboardProfileComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        this.model = this.userForm.value;
        this.dashboardUserProfileService.updateProfile(this.model)
            .subscribe(function (user) { return _this.onProfileUpdateSuccess(user); }, function (error) { return _this.onProfileUpdateError(error); });
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.FIRST_NAME, this.model.first_name);
        this.profileService.onProfileUpdate(this.model);
    };
    DashboardProfileComponent.prototype.onProfileUpdateSuccess = function (result) {
        if (result !== null) {
            var message = new index_1.Message();
            message.isError = false;
            message.custom_message = index_1.Messages.MSG_SUCCESS_DASHBOARD_PROFILE;
            this.messageService.message(message);
            this.profileService.onProfileUpdate(result);
        }
    };
    DashboardProfileComponent.prototype.onProfileUpdateError = function (error) {
        var message = new index_1.Message();
        if (error.err_code === 404 || error.err_code === 0) {
            message.error_msg = error.err_msg;
            message.isError = true;
            this.messageService.message(message);
        }
        else {
            this.isShowErrorMessage = false;
            this.error_msg = error.err_msg;
            message.error_msg = error.err_msg;
            message.isError = true;
            this.messageService.message(message);
        }
    };
    DashboardProfileComponent.prototype.showHideEmailModal = function () {
        this.showModalStyle = !this.showModalStyle;
    };
    DashboardProfileComponent.prototype.getStyleEmail = function () {
        if (this.showModalStyle) {
            return 'block';
        }
        else {
            return 'none';
        }
    };
    DashboardProfileComponent.prototype.getStyleMobile = function () {
        if (this.showStyleMobile) {
            return 'block';
        }
        else {
            return 'none';
        }
    };
    DashboardProfileComponent.prototype.onPictureUpload = function (imagePath) {
    };
    DashboardProfileComponent.prototype.navigateTo = function (nav) {
        this._router.navigate([nav]);
    };
    DashboardProfileComponent.prototype.showHideMobileModal = function () {
        this.showStyleMobile = !this.showStyleMobile;
    };
    DashboardProfileComponent.prototype.onMobileNumberChangeComplete = function () {
        this.model.mobile_number = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.MOBILE_NUMBER);
        this.showStyleMobile = !this.showStyleMobile;
    };
    DashboardProfileComponent.prototype.getLabels = function () {
        return constants_1.Label;
    };
    DashboardProfileComponent.prototype.getHeadings = function () {
        return constants_1.Headings;
    };
    DashboardProfileComponent.prototype.getMessages = function () {
        return index_1.Messages;
    };
    DashboardProfileComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'dashboard-user-profile',
            templateUrl: 'dashboard-user-profile.component.html',
            styleUrls: ['dashboard-user-profile.component.css'],
        }),
        __metadata("design:paramtypes", [dashboard_user_profile_service_1.DashboardUserProfileService, router_1.Router,
            forms_1.FormBuilder,
            index_1.MessageService, index_1.ProfileService])
    ], DashboardProfileComponent);
    return DashboardProfileComponent;
}());
exports.DashboardProfileComponent = DashboardProfileComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGFzaGJvYXJkL3VzZXItcHJvZmlsZS9kYXNoYm9hcmQtdXNlci1wcm9maWxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFrRDtBQUNsRCxtRkFBK0U7QUFDL0Usb0RBQTBEO0FBQzFELHdDQUFvRTtBQUNwRSwyRkFBeUY7QUFDekYsdURBQTREO0FBQzVELCtDQUFpSTtBQUNqSSwwQ0FBdUM7QUFTdkM7SUFXRSxtQ0FBcUIsMkJBQXlELEVBQVUsT0FBZSxFQUNuRixXQUF3QixFQUN4QixjQUE4QixFQUFVLGNBQThCO1FBRnJFLGdDQUEyQixHQUEzQiwyQkFBMkIsQ0FBOEI7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ25GLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQVZuRixjQUFTLEdBQVksS0FBSyxDQUFDO1FBQzNCLHVCQUFrQixHQUFZLElBQUksQ0FBQztRQUNuQyxjQUFTLEdBQVksS0FBSyxDQUFDO1FBQ2xDLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBQ2hDLG9CQUFlLEdBQVksS0FBSyxDQUFDO1FBQ2pDLFVBQUssR0FBZ0IsSUFBSSxrQkFBVyxFQUFFLENBQUM7UUFPckMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztZQUNyQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLEVBQUUsa0JBQVUsQ0FBQyxRQUFRLENBQUM7WUFDdkMsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsa0JBQVUsQ0FBQyxRQUFRLEVBQUUsc0NBQWlCLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDdEUsZUFBZSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsa0JBQVUsQ0FBQyxRQUFRLEVBQUUsc0NBQWlCLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUNy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Q0FBc0MsQ0FBQztTQUNwRCxDQUFDO3lDQWFtRCw0REFBMkIsRUFBbUIsZUFBTTtZQUN0RSxtQkFBVztZQUNSLHNCQUFjLEVBQTBCLHNCQUFjO09BYi9FLHlCQUF5QixDQW1JckM7SUFBRCxnQ0FBQztDQW5JRCxBQW1JQyxJQUFBO0FBbklZLDhEQUF5QiIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2Rhc2hib2FyZC91c2VyLXByb2ZpbGUvZGFzaGJvYXJkLXVzZXItcHJvZmlsZS5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBEYXNoYm9hcmRVc2VyUHJvZmlsZVNlcnZpY2UgfSBmcm9tICcuL2Rhc2hib2FyZC11c2VyLXByb2ZpbGUuc2VydmljZSc7XHJcbmltcG9ydCB7IFVzZXJQcm9maWxlIH0gZnJvbSAnLi8uLi8uLi8uLi91c2VyL21vZGVscy91c2VyJztcclxuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvY3VzdG9tdmFsaWRhdGlvbnMvdmFsaWRhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTGFiZWwsIEhlYWRpbmdzIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IFNlc3Npb25TdG9yYWdlLCBTZXNzaW9uU3RvcmFnZVNlcnZpY2UsIE1lc3NhZ2UsIE1lc3NhZ2VzLCBNZXNzYWdlU2VydmljZSwgUHJvZmlsZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvaW5kZXgnO1xyXG5pbXBvcnQge1JvdXRlcn0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICBzZWxlY3RvcjogJ2Rhc2hib2FyZC11c2VyLXByb2ZpbGUnLFxyXG4gIHRlbXBsYXRlVXJsOiAnZGFzaGJvYXJkLXVzZXItcHJvZmlsZS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJ2Rhc2hib2FyZC11c2VyLXByb2ZpbGUuY29tcG9uZW50LmNzcyddLFxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIERhc2hib2FyZFByb2ZpbGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICB1c2VyRm9ybTogRm9ybUdyb3VwO1xyXG4gIHB1YmxpYyBzdWJtaXR0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBwdWJsaWMgaXNTaG93RXJyb3JNZXNzYWdlOiBib29sZWFuID0gdHJ1ZTtcclxuICBwdWJsaWMgZXJyb3JfbXNnOiBib29sZWFuID0gZmFsc2U7XHJcbiAgc2hvd01vZGFsU3R5bGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBzaG93U3R5bGVNb2JpbGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBtb2RlbDogVXNlclByb2ZpbGUgPSBuZXcgVXNlclByb2ZpbGUoKTtcclxuICBmaXJzdF9sZXR0ZXI6c3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlICBkYXNoYm9hcmRVc2VyUHJvZmlsZVNlcnZpY2UgOiBEYXNoYm9hcmRVc2VyUHJvZmlsZVNlcnZpY2UsIHByaXZhdGUgX3JvdXRlcjogUm91dGVyLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgZm9ybUJ1aWxkZXI6IEZvcm1CdWlsZGVyLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlLCBwcml2YXRlIHByb2ZpbGVTZXJ2aWNlOiBQcm9maWxlU2VydmljZSxcclxuICAgICAgICAgICAgICApIHtcclxuICAgIHRoaXMudXNlckZvcm0gPSB0aGlzLmZvcm1CdWlsZGVyLmdyb3VwKHtcclxuICAgICAgJ2ZpcnN0X25hbWUnOiBbJycsIFZhbGlkYXRvcnMucmVxdWlyZWRdLFxyXG4gICAgICAnZW1haWwnOiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkLCBWYWxpZGF0aW9uU2VydmljZS5lbWFpbFZhbGlkYXRvcl1dLFxyXG4gICAgICAnbW9iaWxlX251bWJlcic6IFsnJywgW1ZhbGlkYXRvcnMucmVxdWlyZWQsIFZhbGlkYXRpb25TZXJ2aWNlLm1vYmlsZU51bWJlclZhbGlkYXRvcl1dLFxyXG4gICAgICAnY29tcGFueV9uYW1lJzogWycnLCBbVmFsaWRhdG9ycy5yZXF1aXJlZCwgVmFsaWRhdGlvblNlcnZpY2UuYWxwaGFiYXRlc1ZhbGlkYXRvcl1dLFxyXG4gICAgICAnc3RhdGUnOiBbJycsW1ZhbGlkYXRvcnMucmVxdWlyZWQsIFZhbGlkYXRpb25TZXJ2aWNlLmFscGhhYmF0ZXNWYWxpZGF0b3JdXSxcclxuICAgICAgJ2NpdHknOiBbJycsIFtWYWxpZGF0b3JzLnJlcXVpcmVkLCBWYWxpZGF0aW9uU2VydmljZS5hbHBoYWJhdGVzVmFsaWRhdG9yXV1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLmRhc2hib2FyZFVzZXJQcm9maWxlU2VydmljZS5nZXRVc2VyUHJvZmlsZSgpXHJcbiAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgKGJvZHk6IGFueSkgPT4gdGhpcy5zZXRVc2VyRGV0YWlscyhib2R5KSxcclxuICAgICAgICAoZXJyb3I6IGFueSkgPT4gdGhpcy5mYWlsVXNlckRldGFpbHMoZXJyb3IpKTtcclxuICB9XHJcblxyXG4gIHNldFVzZXJEZXRhaWxzKGJvZHkgOiBhbnkpIHtcclxuICAgIHZhciB1c2VyID0gYm9keS5kYXRhO1xyXG4gICAgdGhpcy5tb2RlbC5maXJzdF9uYW1lID0gdXNlci5maXJzdF9uYW1lO1xyXG4gICAgdGhpcy5tb2RlbC5lbWFpbCA9IHVzZXIuZW1haWw7XHJcbiAgICB0aGlzLm1vZGVsLm1vYmlsZV9udW1iZXIgPSB1c2VyLm1vYmlsZV9udW1iZXI7XHJcbiAgICB0aGlzLm1vZGVsLmNvbXBhbnlfbmFtZSA9IHVzZXIuY29tcGFueV9uYW1lO1xyXG4gICAgdGhpcy5tb2RlbC5zdGF0ZSA9IHVzZXIuc3RhdGU7XHJcbiAgICB0aGlzLm1vZGVsLmNpdHkgPSB1c2VyLmNpdHk7XHJcbiAgICB0aGlzLmZpcnN0X2xldHRlciA9KHVzZXIuZmlyc3RfbmFtZSkudG9TdHJpbmcoKS5jaGFyQXQoMCk7XHJcbiAgfVxyXG5cclxuICBmYWlsVXNlckRldGFpbHMoZXJyb3IgOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKCdFcnJvciA6ICcrSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICB9XHJcblxyXG4gIG9uU3VibWl0KCkge1xyXG4gICAgdGhpcy5zdWJtaXR0ZWQgPSB0cnVlO1xyXG4gICAgLy9pZih0aGlzLnVzZXJGb3JtLnZhbGlkKSB7XHJcbiAgICAgIHRoaXMubW9kZWwgPSB0aGlzLnVzZXJGb3JtLnZhbHVlO1xyXG4gICAgICB0aGlzLmRhc2hib2FyZFVzZXJQcm9maWxlU2VydmljZS51cGRhdGVQcm9maWxlKHRoaXMubW9kZWwpXHJcbiAgICAgICAgLnN1YnNjcmliZShcclxuICAgICAgICAgIHVzZXIgPT4gdGhpcy5vblByb2ZpbGVVcGRhdGVTdWNjZXNzKHVzZXIpLFxyXG4gICAgICAgICAgZXJyb3IgPT4gdGhpcy5vblByb2ZpbGVVcGRhdGVFcnJvcihlcnJvcikpO1xyXG4gICAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkZJUlNUX05BTUUsIHRoaXMubW9kZWwuZmlyc3RfbmFtZSk7XHJcbiAgICAgIHRoaXMucHJvZmlsZVNlcnZpY2Uub25Qcm9maWxlVXBkYXRlKHRoaXMubW9kZWwpO1xyXG4gICAgLy99XHJcbiAgfVxyXG5cclxuICBvblByb2ZpbGVVcGRhdGVTdWNjZXNzKHJlc3VsdDogYW55KSB7XHJcblxyXG4gICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xyXG4gICAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfREFTSEJPQVJEX1BST0ZJTEU7XHJcbiAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgICAgdGhpcy5wcm9maWxlU2VydmljZS5vblByb2ZpbGVVcGRhdGUocmVzdWx0KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uUHJvZmlsZVVwZGF0ZUVycm9yKGVycm9yOiBhbnkpIHtcclxuXHJcbiAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcblxyXG4gICAgaWYgKGVycm9yLmVycl9jb2RlID09PSA0MDQgfHwgZXJyb3IuZXJyX2NvZGUgPT09IDApIHtcclxuICAgICAgbWVzc2FnZS5lcnJvcl9tc2cgPSBlcnJvci5lcnJfbXNnO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSB0cnVlO1xyXG4gICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmlzU2hvd0Vycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG4gICAgIHRoaXMuZXJyb3JfbXNnID0gZXJyb3IuZXJyX21zZztcclxuICAgICAgbWVzc2FnZS5lcnJvcl9tc2cgPSBlcnJvci5lcnJfbXNnO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSB0cnVlO1xyXG4gICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzaG93SGlkZUVtYWlsTW9kYWwoKSB7XHJcbiAgICB0aGlzLnNob3dNb2RhbFN0eWxlID0gIXRoaXMuc2hvd01vZGFsU3R5bGU7XHJcbiAgfVxyXG5cclxuICBnZXRTdHlsZUVtYWlsKCkge1xyXG4gICAgaWYgKHRoaXMuc2hvd01vZGFsU3R5bGUpIHtcclxuICAgICAgcmV0dXJuICdibG9jayc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gJ25vbmUnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0U3R5bGVNb2JpbGUoKSB7XHJcbiAgICBpZiAodGhpcy5zaG93U3R5bGVNb2JpbGUpIHtcclxuICAgICAgcmV0dXJuICdibG9jayc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gJ25vbmUnO1xyXG4gICAgfVxyXG4gIH1cclxuICBvblBpY3R1cmVVcGxvYWQoaW1hZ2VQYXRoOiBzdHJpbmcpIHtcclxuICAgIH1cclxuICBuYXZpZ2F0ZVRvKG5hdjpzdHJpbmcpIHtcclxuICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbbmF2XSk7XHJcbiAgfVxyXG4gIHNob3dIaWRlTW9iaWxlTW9kYWwoKSB7XHJcbiAgICB0aGlzLnNob3dTdHlsZU1vYmlsZSA9ICF0aGlzLnNob3dTdHlsZU1vYmlsZTtcclxuICB9XHJcbiAgb25Nb2JpbGVOdW1iZXJDaGFuZ2VDb21wbGV0ZSgpIHtcclxuICAgIHRoaXMubW9kZWwubW9iaWxlX251bWJlciA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuTU9CSUxFX05VTUJFUik7XHJcbiAgICB0aGlzLnNob3dTdHlsZU1vYmlsZSA9ICF0aGlzLnNob3dTdHlsZU1vYmlsZTtcclxuICB9XHJcblxyXG4gIGdldExhYmVscygpIHtcclxuICAgIHJldHVybiBMYWJlbDtcclxuICB9XHJcblxyXG4gIGdldEhlYWRpbmdzKCkge1xyXG4gICAgcmV0dXJuIEhlYWRpbmdzO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWVzc2FnZXMoKSB7XHJcbiAgICByZXR1cm4gTWVzc2FnZXM7XHJcbiAgfVxyXG59XHJcbiJdfQ==
