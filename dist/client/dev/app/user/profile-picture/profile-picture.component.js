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
var user_1 = require("../models/user");
var dashboard_service_1 = require("../services/dashboard.service");
var index_1 = require("../../shared/index");
var ProfilePictureComponent = (function () {
    function ProfilePictureComponent(dashboardService, messageService, profileService) {
        this.dashboardService = dashboardService;
        this.messageService = messageService;
        this.profileService = profileService;
        this.onPictureUpload = new core_1.EventEmitter();
        this.isLoading = false;
        this.model = new user_1.UserProfile();
        this.isShowErrorMessage = true;
        this.filesToUpload = [];
        this.uploaded_image_path = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.PROFILE_PICTURE);
        if (this.uploaded_image_path === 'undefined' || this.uploaded_image_path === null) {
            if (this.isCandidate === 'true') {
                this.image_path = index_1.ImagePath.PROFILE_IMG_ICON;
            }
            else {
                this.image_path = index_1.ImagePath.COMPANY_LOGO_IMG_ICON;
            }
        }
        else {
            this.uploaded_image_path = this.uploaded_image_path.replace('"', '');
            this.image_path = index_1.AppSettings.IP + this.uploaded_image_path;
        }
    }
    ProfilePictureComponent.prototype.fileChangeEvent = function (fileInput) {
        var _this = this;
        this.isLoading = true;
        this.filesToUpload = fileInput.target.files;
        if (this.filesToUpload[0].type === 'image/jpeg' || this.filesToUpload[0].type === 'image/png'
            || this.filesToUpload[0].type === 'image/jpg' || this.filesToUpload[0].type === 'image/gif') {
            if (this.filesToUpload[0].size <= 5242880) {
                this.dashboardService.makeDocumentUpload(this.filesToUpload, []).then(function (result) {
                    if (result !== null) {
                        _this.fileChangeSuccess(result);
                    }
                }, function (error) {
                    _this.fileChangeFailure(error);
                });
            }
            else {
                var message = new index_1.Message();
                message.isError = true;
                message.error_msg = index_1.Messages.MSG_ERROR_IMAGE_SIZE;
                this.messageService.message(message);
                this.isLoading = false;
            }
        }
        else {
            var message = new index_1.Message();
            message.isError = true;
            message.error_msg = index_1.Messages.MSG_ERROR_IMAGE_TYPE;
            this.messageService.message(message);
            this.isLoading = false;
        }
    };
    ProfilePictureComponent.prototype.fileChangeSuccess = function (result) {
        this.model = result.data;
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.PROFILE_PICTURE, result.data.picture);
        var socialLogin = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.IS_SOCIAL_LOGIN);
        this.onPictureUpload.emit(result.data.picture);
        if (!this.model.picture || this.model.picture === undefined) {
            this.image_path = index_1.ImagePath.PROFILE_IMG_ICON;
        }
        else if (socialLogin === index_1.AppSettings.IS_SOCIAL_LOGIN_YES) {
            this.image_path = this.model.picture;
        }
        else {
            this.image_path = index_1.AppSettings.IP + this.model.picture.replace('"', '');
        }
        this.isLoading = false;
        this.profileService.onProfileUpdate(result);
    };
    ProfilePictureComponent.prototype.fileChangeFailure = function (error) {
        this.isLoading = true;
        var message = new index_1.Message();
        message.isError = true;
        if (error.err_code === 404 || error.err_code === 0) {
            message.error_msg = error.err_msg;
            this.messageService.message(message);
        }
        else {
            this.isLoading = false;
            message.error_msg = index_1.Messages.MSG_ERROR_DASHBOARD_PROFILE_PIC;
            this.messageService.message(message);
        }
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ProfilePictureComponent.prototype, "onPictureUpload", void 0);
    ProfilePictureComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'cn-profile-picture',
            templateUrl: 'profile-picture.component.html',
            styleUrls: ['profile-picture.component.css'],
        }),
        __metadata("design:paramtypes", [dashboard_service_1.DashboardService,
            index_1.MessageService, index_1.ProfileService])
    ], ProfilePictureComponent);
    return ProfilePictureComponent;
}());
exports.ProfilePictureComponent = ProfilePictureComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91c2VyL3Byb2ZpbGUtcGljdHVyZS9wcm9maWxlLXBpY3R1cmUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQWdFO0FBQ2hFLHVDQUE2QztBQUM3QyxtRUFBaUU7QUFDakUsNENBUzRCO0FBVTVCO0lBV0UsaUNBQW9CLGdCQUFrQyxFQUNsQyxjQUE4QixFQUFVLGNBQThCO1FBRHRFLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQVUsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBWGhGLG9CQUFlLEdBQUcsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFDL0MsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUNuQixVQUFLLEdBQUcsSUFBSSxrQkFBVyxFQUFFLENBQUM7UUFJMUIsdUJBQWtCLEdBQVksSUFBSSxDQUFDO1FBTXpDLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNqRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEtBQUssV0FBVyxJQUFJLElBQUksQ0FBQyxtQkFBbUIsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2xGLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxpQkFBUyxDQUFDLGdCQUFnQixDQUFDO1lBQy9DLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFJLENBQUMsVUFBVSxHQUFHLGlCQUFTLENBQUMscUJBQXFCLENBQUM7WUFDcEQsQ0FBQztRQUNILENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJ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USxDQUFDLCtCQUErQixDQUFDO1lBQzdELElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7SUFFSCxDQUFDO0lBdkZTO1FBQVQsYUFBTSxFQUFFOztvRUFBc0M7SUFEcEMsdUJBQXVCO1FBUG5DLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLG9CQUFvQjtZQUM5QixXQUFXLEVBQUUsZ0NBQWdDO1lBQzdDLFNBQVMsRUFBRSxDQUFDLCtCQUErQixDQUFDO1NBQzdDLENBQUM7eUNBYXNDLG9DQUFnQjtZQUNsQixzQkFBYyxFQUEwQixzQkFBYztPQVovRSx1QkFBdUIsQ0EwRm5DO0lBQUQsOEJBQUM7Q0ExRkQsQUEwRkMsSUFBQTtBQTFGWSwwREFBdUIiLCJmaWxlIjoiYXBwL3VzZXIvcHJvZmlsZS1waWN0dXJlL3Byb2ZpbGUtcGljdHVyZS5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFVzZXJQcm9maWxlIH0gZnJvbSAnLi4vbW9kZWxzL3VzZXInO1xyXG5pbXBvcnQgeyBEYXNoYm9hcmRTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvZGFzaGJvYXJkLnNlcnZpY2UnO1xyXG5pbXBvcnQge1xyXG4gIEFwcFNldHRpbmdzLFxyXG4gIEltYWdlUGF0aCxcclxuICBTZXNzaW9uU3RvcmFnZSxcclxuICBTZXNzaW9uU3RvcmFnZVNlcnZpY2UsXHJcbiAgTWVzc2FnZSxcclxuICBNZXNzYWdlcyxcclxuICBNZXNzYWdlU2VydmljZSxcclxuICBQcm9maWxlU2VydmljZVxyXG59IGZyb20gJy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICBzZWxlY3RvcjogJ2NuLXByb2ZpbGUtcGljdHVyZScsXHJcbiAgdGVtcGxhdGVVcmw6ICdwcm9maWxlLXBpY3R1cmUuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydwcm9maWxlLXBpY3R1cmUuY29tcG9uZW50LmNzcyddLFxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIFByb2ZpbGVQaWN0dXJlQ29tcG9uZW50IHtcclxuICBAT3V0cHV0KCkgb25QaWN0dXJlVXBsb2FkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIGlzTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHByaXZhdGUgbW9kZWwgPSBuZXcgVXNlclByb2ZpbGUoKTtcclxuICBwcml2YXRlIGZpbGVzVG9VcGxvYWQ6IEFycmF5PEZpbGU+O1xyXG4gIHByaXZhdGUgaW1hZ2VfcGF0aDogc3RyaW5nO1xyXG4gIHByaXZhdGUgdXBsb2FkZWRfaW1hZ2VfcGF0aDogc3RyaW5nO1xyXG4gIHByaXZhdGUgaXNTaG93RXJyb3JNZXNzYWdlOiBib29sZWFuID0gdHJ1ZTtcclxuICBwcml2YXRlIGlzQ2FuZGlkYXRlOiBzdHJpbmc7XHJcblxyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRhc2hib2FyZFNlcnZpY2U6IERhc2hib2FyZFNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBtZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UsIHByaXZhdGUgcHJvZmlsZVNlcnZpY2U6IFByb2ZpbGVTZXJ2aWNlKSB7XHJcbiAgICB0aGlzLmZpbGVzVG9VcGxvYWQgPSBbXTtcclxuICAgIHRoaXMudXBsb2FkZWRfaW1hZ2VfcGF0aCA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuUFJPRklMRV9QSUNUVVJFKTsgLy9UT0RPOkdldCBpdCBmcm9tIGdldCB1c2VyIGNhbGwuXHJcbiAgICBpZiAodGhpcy51cGxvYWRlZF9pbWFnZV9wYXRoID09PSAndW5kZWZpbmVkJyB8fCB0aGlzLnVwbG9hZGVkX2ltYWdlX3BhdGggPT09IG51bGwpIHtcclxuICAgICAgaWYgKHRoaXMuaXNDYW5kaWRhdGUgPT09ICd0cnVlJykge1xyXG4gICAgICAgIHRoaXMuaW1hZ2VfcGF0aCA9IEltYWdlUGF0aC5QUk9GSUxFX0lNR19JQ09OO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuaW1hZ2VfcGF0aCA9IEltYWdlUGF0aC5DT01QQU5ZX0xPR09fSU1HX0lDT047XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudXBsb2FkZWRfaW1hZ2VfcGF0aCA9IHRoaXMudXBsb2FkZWRfaW1hZ2VfcGF0aC5yZXBsYWNlKCdcIicsICcnKTtcclxuICAgICAgdGhpcy5pbWFnZV9wYXRoID0gQXBwU2V0dGluZ3MuSVAgKyB0aGlzLnVwbG9hZGVkX2ltYWdlX3BhdGg7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcblxyXG4gIGZpbGVDaGFuZ2VFdmVudChmaWxlSW5wdXQ6IGFueSkge1xyXG4gICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xyXG4gICAgdGhpcy5maWxlc1RvVXBsb2FkID0gPEFycmF5PEZpbGU+PiBmaWxlSW5wdXQudGFyZ2V0LmZpbGVzO1xyXG4gICAgaWYgKHRoaXMuZmlsZXNUb1VwbG9hZFswXS50eXBlID09PSAnaW1hZ2UvanBlZycgfHwgdGhpcy5maWxlc1RvVXBsb2FkWzBdLnR5cGUgPT09ICdpbWFnZS9wbmcnXHJcbiAgICAgIHx8IHRoaXMuZmlsZXNUb1VwbG9hZFswXS50eXBlID09PSAnaW1hZ2UvanBnJyB8fCB0aGlzLmZpbGVzVG9VcGxvYWRbMF0udHlwZSA9PT0gJ2ltYWdlL2dpZicpIHtcclxuICAgICAgaWYgKHRoaXMuZmlsZXNUb1VwbG9hZFswXS5zaXplIDw9IDUyNDI4ODApIHtcclxuICAgICAgICB0aGlzLmRhc2hib2FyZFNlcnZpY2UubWFrZURvY3VtZW50VXBsb2FkKHRoaXMuZmlsZXNUb1VwbG9hZCwgW10pLnRoZW4oKHJlc3VsdDogYW55KSA9PiB7XHJcbiAgICAgICAgICBpZiAocmVzdWx0ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlsZUNoYW5nZVN1Y2Nlc3MocmVzdWx0KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCAoZXJyb3I6IGFueSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5maWxlQ2hhbmdlRmFpbHVyZShlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgICAgIG1lc3NhZ2UuaXNFcnJvciA9IHRydWU7XHJcbiAgICAgICAgbWVzc2FnZS5lcnJvcl9tc2cgPSBNZXNzYWdlcy5NU0dfRVJST1JfSU1BR0VfU0laRTtcclxuICAgICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSB0cnVlO1xyXG4gICAgICBtZXNzYWdlLmVycm9yX21zZyA9IE1lc3NhZ2VzLk1TR19FUlJPUl9JTUFHRV9UWVBFO1xyXG4gICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmaWxlQ2hhbmdlU3VjY2VzcyhyZXN1bHQ6IGFueSkge1xyXG4gICAgdGhpcy5tb2RlbCA9IHJlc3VsdC5kYXRhO1xyXG4gICAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLnNldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5QUk9GSUxFX1BJQ1RVUkUsIHJlc3VsdC5kYXRhLnBpY3R1cmUpO1xyXG4gICAgdmFyIHNvY2lhbExvZ2luOiBzdHJpbmcgPSBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLklTX1NPQ0lBTF9MT0dJTik7XHJcbiAgICB0aGlzLm9uUGljdHVyZVVwbG9hZC5lbWl0KHJlc3VsdC5kYXRhLnBpY3R1cmUpO1xyXG5cclxuICAgIGlmICghdGhpcy5tb2RlbC5waWN0dXJlIHx8IHRoaXMubW9kZWwucGljdHVyZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuaW1hZ2VfcGF0aCA9IEltYWdlUGF0aC5QUk9GSUxFX0lNR19JQ09OO1xyXG4gICAgfSBlbHNlIGlmIChzb2NpYWxMb2dpbiA9PT0gQXBwU2V0dGluZ3MuSVNfU09DSUFMX0xPR0lOX1lFUykge1xyXG4gICAgICB0aGlzLmltYWdlX3BhdGggPSB0aGlzLm1vZGVsLnBpY3R1cmU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmltYWdlX3BhdGggPSBBcHBTZXR0aW5ncy5JUCArIHRoaXMubW9kZWwucGljdHVyZS5yZXBsYWNlKCdcIicsICcnKTtcclxuICAgIH1cclxuICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLnByb2ZpbGVTZXJ2aWNlLm9uUHJvZmlsZVVwZGF0ZShyZXN1bHQpO1xyXG4gIH1cclxuXHJcbiAgZmlsZUNoYW5nZUZhaWx1cmUoZXJyb3I6IGFueSkge1xyXG4gICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgbWVzc2FnZS5pc0Vycm9yID0gdHJ1ZTtcclxuICAgIGlmIChlcnJvci5lcnJfY29kZSA9PT0gNDA0IHx8IGVycm9yLmVycl9jb2RlID09PSAwKSB7XHJcbiAgICAgIG1lc3NhZ2UuZXJyb3JfbXNnID0gZXJyb3IuZXJyX21zZztcclxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgbWVzc2FnZS5lcnJvcl9tc2cgPSBNZXNzYWdlcy5NU0dfRVJST1JfREFTSEJPQVJEX1BST0ZJTEVfUElDO1xyXG4gICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbn1cclxuIl19
