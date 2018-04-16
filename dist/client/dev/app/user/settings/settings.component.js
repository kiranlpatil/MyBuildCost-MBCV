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
var index_1 = require("../../shared/index");
var forms_1 = require("@angular/forms");
var settings_service_1 = require("./settings.service");
var user_1 = require("../models/user");
var constants_1 = require("../../shared/constants");
var loaders_service_1 = require("../../shared/loader/loaders.service");
var router_1 = require("@angular/router");
var candidate_1 = require("../models/candidate");
var error_service_1 = require("../../shared/services/error.service");
var SettingsComponent = (function () {
    function SettingsComponent(commonService, activatedRoute, errorService, themeChangeService, changeThemeServie, messageService, formBuilder, loaderService) {
        this.commonService = commonService;
        this.activatedRoute = activatedRoute;
        this.errorService = errorService;
        this.themeChangeService = themeChangeService;
        this.changeThemeServie = changeThemeServie;
        this.messageService = messageService;
        this.formBuilder = formBuilder;
        this.loaderService = loaderService;
        this.model = new user_1.UserProfile();
        this.INITIAL_THEME = index_1.AppSettings.INITIAL_THEM;
        this.LIGHT_THEME = index_1.AppSettings.LIGHT_THEM;
        this.candidate = new candidate_1.Candidate();
        this.themeIs = index_1.AppSettings.INITIAL_THEM;
        this.userForm = this.formBuilder.group({
            'current_theme': ['', [forms_1.Validators.required]]
        });
        this.APP_NAME = constants_1.ProjectAsset.APP_NAME;
    }
    SettingsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.params.subscribe(function (params) {
            _this.role = params['role'];
        });
        var socialLogin = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.IS_SOCIAL_LOGIN);
        if (socialLogin === 'YES') {
            this.isSocialLogin = true;
        }
        else {
            this.isSocialLogin = false;
        }
        document.body.scrollTop = 0;
    };
    SettingsComponent.prototype.OnCandidateDataSuccess = function (candidateData) {
        this.candidate = candidateData.data[0];
        this.candidate.basicInformation = candidateData.metadata;
        this.candidate.summary = new candidate_1.Summary();
    };
    SettingsComponent.prototype.OnRecruiterDataSuccess = function (candidateData) {
        this.candidate = candidateData.data[0];
        this.candidate.basicInformation = candidateData.metadata;
        this.candidate.summary = new candidate_1.Summary();
    };
    SettingsComponent.prototype.darkTheme = function () {
        var _this = this;
        this.themeChangeService.change(this.INITIAL_THEME);
        this.changeThemeServie.changeTheme(this.INITIAL_THEME)
            .subscribe(function (body) { return _this.onChangeThemeSuccess(body); }, function (error) { return _this.onChangeThemeFailure(error); });
    };
    SettingsComponent.prototype.lightTheme = function () {
        var _this = this;
        this.themeChangeService.change(this.INITIAL_THEME);
        this.changeThemeServie.changeTheme(this.INITIAL_THEME)
            .subscribe(function (body) { return _this.onChangeThemeSuccess(body); }, function (error) { return _this.onChangeThemeFailure(error); });
    };
    SettingsComponent.prototype.goBack = function () {
        this.commonService.goBack();
    };
    SettingsComponent.prototype.onChangeThemeSuccess = function (body) {
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = index_1.Messages.MSG_SUCCESS_CHANGE_THEME;
        this.messageService.message(message);
        this.themeChangeService.change(body.data.current_theme);
        index_1.SessionStorageService.setSessionValue(index_1.SessionStorage.MY_THEME, body.data.current_theme);
    };
    SettingsComponent.prototype.onChangeThemeFailure = function (error) {
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = index_1.Messages.MSG_ERROR_CHANGE_THEME;
        this.messageService.message(message);
    };
    SettingsComponent.prototype.getHeadings = function () {
        return constants_1.Headings;
    };
    SettingsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'tpl-settings',
            templateUrl: 'settings.component.html',
            styleUrls: ['settings.component.css'],
            providers: [settings_service_1.SettingsService],
        }),
        __metadata("design:paramtypes", [index_1.CommonService, router_1.ActivatedRoute,
            error_service_1.ErrorService,
            index_1.ThemeChangeService, settings_service_1.SettingsService,
            index_1.MessageService, forms_1.FormBuilder, loaders_service_1.LoaderService])
    ], SettingsComponent);
    return SettingsComponent;
}());
exports.SettingsComponent = SettingsComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91c2VyL3NldHRpbmdzL3NldHRpbmdzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFnRDtBQUNoRCw0Q0FTNEI7QUFDNUIsd0NBQWtFO0FBQ2xFLHVEQUFtRDtBQUNuRCx1Q0FBMkM7QUFDM0Msb0RBQThEO0FBQzlELHVFQUFrRTtBQUNsRSwwQ0FBK0M7QUFDL0MsaURBQXVEO0FBQ3ZELHFFQUFpRTtBQVNqRTtJQVdJLDJCQUFvQixhQUE0QixFQUFVLGNBQThCLEVBQ3BFLFlBQTBCLEVBQzFCLGtCQUFzQyxFQUFVLGlCQUFrQyxFQUNsRixjQUE4QixFQUFVLFdBQXdCLEVBQVUsYUFBNEI7UUFIdEcsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDcEUsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUFVLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBaUI7UUFDbEYsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQVUsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQVg1SCxVQUFLLEdBQUcsSUFBSSxrQkFBVyxFQUFFLENBQUM7UUFFMUIsa0JBQWEsR0FBRyxtQkFBVyxDQUFDLFlBQVksQ0FBQztRQUN6QyxnQkFBVyxHQUFHLG1CQUFXLENBQUMsVUFBVSxDQUFDO1FBR3JDLGNBQVMsR0FBYyxJQUFJLHFCQUFTLEVBQUUsQ0FBQztRQU9yQyxJQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFXLENBQUMsWUFBWSxDQUFDO1FBRXhDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7WUFDckMsZUFBZSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsa0JBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUM3QyxDQUFDLENBQUM7UUFFSCxJQUFJ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QWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3hELDZCQUFxQixDQUFDLGVBQWUsQ0FBQyxzQkFBYyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzFGLENBQUM7SUFFRCxnREFBb0IsR0FBcEIsVUFBcUIsS0FBVTtRQUM3QixJQUFJLE9BQU8sR0FBRyxJQUFJLGVBQU8sRUFBRSxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLE9BQU8sQ0FBQyxjQUFjLEdBQUcsZ0JBQVEsQ0FBQyxzQkFBc0IsQ0FBQztRQUN6RCxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQ0QsdUNBQVcsR0FBWDtRQUNFLE1BQU0sQ0FBQyxvQkFBUSxDQUFDO0lBQ2xCLENBQUM7SUF0RlUsaUJBQWlCO1FBUDdCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLGNBQWM7WUFDeEIsV0FBVyxFQUFFLHlCQUF5QjtZQUN0QyxTQUFTLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQztZQUNyQyxTQUFTLEVBQUUsQ0FBQyxrQ0FBZSxDQUFDO1NBQzdCLENBQUM7eUNBWXFDLHFCQUFhLEVBQTBCLHVCQUFjO1lBQ3RELDRCQUFZO1lBQ04sMEJBQWtCLEVBQTZCLGtDQUFlO1lBQ2xFLHNCQUFjLEVBQXVCLG1CQUFXLEVBQXlCLCtCQUFhO09BZGpILGlCQUFpQixDQXVGN0I7SUFBRCx3QkFBQztDQXZGRCxBQXVGQyxJQUFBO0FBdkZZLDhDQUFpQiIsImZpbGUiOiJhcHAvdXNlci9zZXR0aW5ncy9zZXR0aW5ncy5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQge1xyXG4gIEFwcFNldHRpbmdzLFxyXG4gIENvbW1vblNlcnZpY2UsXHJcbiAgU2Vzc2lvblN0b3JhZ2UsXHJcbiAgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLFxyXG4gIE1lc3NhZ2UsXHJcbiAgTWVzc2FnZXMsXHJcbiAgTWVzc2FnZVNlcnZpY2UsXHJcbiAgVGhlbWVDaGFuZ2VTZXJ2aWNlXHJcbn0gZnJvbSBcIi4uLy4uL3NoYXJlZC9pbmRleFwiO1xyXG5pbXBvcnQge0Zvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnN9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xyXG5pbXBvcnQge1NldHRpbmdzU2VydmljZX0gZnJvbSBcIi4vc2V0dGluZ3Muc2VydmljZVwiO1xyXG5pbXBvcnQge1VzZXJQcm9maWxlfSBmcm9tIFwiLi4vbW9kZWxzL3VzZXJcIjtcclxuaW1wb3J0IHtQcm9qZWN0QXNzZXQsIEhlYWRpbmdzfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2NvbnN0YW50c1wiO1xyXG5pbXBvcnQge0xvYWRlclNlcnZpY2V9IGZyb20gXCIuLi8uLi9zaGFyZWQvbG9hZGVyL2xvYWRlcnMuc2VydmljZVwiO1xyXG5pbXBvcnQge0FjdGl2YXRlZFJvdXRlfSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyXCI7XHJcbmltcG9ydCB7Q2FuZGlkYXRlLCBTdW1tYXJ5fSBmcm9tIFwiLi4vbW9kZWxzL2NhbmRpZGF0ZVwiO1xyXG5pbXBvcnQge0Vycm9yU2VydmljZX0gZnJvbSBcIi4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9lcnJvci5zZXJ2aWNlXCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAndHBsLXNldHRpbmdzJyxcclxuICB0ZW1wbGF0ZVVybDogJ3NldHRpbmdzLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnc2V0dGluZ3MuY29tcG9uZW50LmNzcyddLFxyXG4gIHByb3ZpZGVyczogW1NldHRpbmdzU2VydmljZV0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTZXR0aW5nc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgdGhlbWVJczogc3RyaW5nO1xyXG4gIGlzU29jaWFsTG9naW46IGJvb2xlYW47XHJcbiAgbW9kZWwgPSBuZXcgVXNlclByb2ZpbGUoKTtcclxuICB1c2VyRm9ybTogRm9ybUdyb3VwO1xyXG4gIElOSVRJQUxfVEhFTUUgPSBBcHBTZXR0aW5ncy5JTklUSUFMX1RIRU07XHJcbiAgTElHSFRfVEhFTUUgPSBBcHBTZXR0aW5ncy5MSUdIVF9USEVNO1xyXG4gIEFQUF9OQU1FOiBzdHJpbmc7XHJcbiAgcm9sZTogc3RyaW5nO1xyXG4gIGNhbmRpZGF0ZTogQ2FuZGlkYXRlID0gbmV3IENhbmRpZGF0ZSgpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29tbW9uU2VydmljZTogQ29tbW9uU2VydmljZSwgcHJpdmF0ZSBhY3RpdmF0ZWRSb3V0ZTogQWN0aXZhdGVkUm91dGUsXHJcbiAgICAgICAgICAgICAgICBwcml2YXRlIGVycm9yU2VydmljZTogRXJyb3JTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSB0aGVtZUNoYW5nZVNlcnZpY2U6IFRoZW1lQ2hhbmdlU2VydmljZSwgcHJpdmF0ZSBjaGFuZ2VUaGVtZVNlcnZpZTogU2V0dGluZ3NTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBtZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UsIHByaXZhdGUgZm9ybUJ1aWxkZXI6IEZvcm1CdWlsZGVyLCBwcml2YXRlIGxvYWRlclNlcnZpY2U6IExvYWRlclNlcnZpY2UpIHtcclxuXHJcbiAgICB0aGlzLnRoZW1lSXMgPSBBcHBTZXR0aW5ncy5JTklUSUFMX1RIRU07XHJcblxyXG4gICAgdGhpcy51c2VyRm9ybSA9IHRoaXMuZm9ybUJ1aWxkZXIuZ3JvdXAoe1xyXG4gICAgICAnY3VycmVudF90aGVtZSc6IFsnJywgW1ZhbGlkYXRvcnMucmVxdWlyZWRdXVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5BUFBfTkFNRSA9IFByb2plY3RBc3NldC5BUFBfTkFNRTtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgICB0aGlzLmFjdGl2YXRlZFJvdXRlLnBhcmFtcy5zdWJzY3JpYmUocGFyYW1zID0+IHtcclxuICAgICAgICAgIHRoaXMucm9sZSA9IHBhcmFtc1sncm9sZSddO1xyXG4gICAgICB9KTtcclxuICAgIHZhciBzb2NpYWxMb2dpbjogc3RyaW5nID0gU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5JU19TT0NJQUxfTE9HSU4pO1xyXG4gICAgaWYgKHNvY2lhbExvZ2luID09PSAnWUVTJykge1xyXG4gICAgICB0aGlzLmlzU29jaWFsTG9naW4gPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5pc1NvY2lhbExvZ2luID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IDA7XHJcbiAgfVxyXG5cclxuICAgIE9uQ2FuZGlkYXRlRGF0YVN1Y2Nlc3MoY2FuZGlkYXRlRGF0YTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5jYW5kaWRhdGUgPSBjYW5kaWRhdGVEYXRhLmRhdGFbMF07XHJcbiAgICAgICAgdGhpcy5jYW5kaWRhdGUuYmFzaWNJbmZvcm1hdGlvbiA9IGNhbmRpZGF0ZURhdGEubWV0YWRhdGE7XHJcbiAgICAgICAgdGhpcy5jYW5kaWRhdGUuc3VtbWFyeSA9IG5ldyBTdW1tYXJ5KCk7XHJcbiAgICB9XHJcblxyXG4gIE9uUmVjcnVpdGVyRGF0YVN1Y2Nlc3MoY2FuZGlkYXRlRGF0YTogYW55KSB7XHJcbiAgICB0aGlzLmNhbmRpZGF0ZSA9IGNhbmRpZGF0ZURhdGEuZGF0YVswXTtcclxuICAgIHRoaXMuY2FuZGlkYXRlLmJhc2ljSW5mb3JtYXRpb24gPSBjYW5kaWRhdGVEYXRhLm1ldGFkYXRhO1xyXG4gICAgdGhpcy5jYW5kaWRhdGUuc3VtbWFyeSA9IG5ldyBTdW1tYXJ5KCk7XHJcbiAgfVxyXG4gIGRhcmtUaGVtZSgpIHtcclxuICAgIHRoaXMudGhlbWVDaGFuZ2VTZXJ2aWNlLmNoYW5nZSh0aGlzLklOSVRJQUxfVEhFTUUpO1xyXG4gICAgdGhpcy5jaGFuZ2VUaGVtZVNlcnZpZS5jaGFuZ2VUaGVtZSh0aGlzLklOSVRJQUxfVEhFTUUpXHJcbiAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgYm9keSA9PiB0aGlzLm9uQ2hhbmdlVGhlbWVTdWNjZXNzKGJvZHkpLFxyXG4gICAgICAgIGVycm9yID0+IHRoaXMub25DaGFuZ2VUaGVtZUZhaWx1cmUoZXJyb3IpKTtcclxuICB9XHJcblxyXG4gIGxpZ2h0VGhlbWUoKSB7XHJcbiAgICB0aGlzLnRoZW1lQ2hhbmdlU2VydmljZS5jaGFuZ2UodGhpcy5JTklUSUFMX1RIRU1FKTtcclxuICAgIHRoaXMuY2hhbmdlVGhlbWVTZXJ2aWUuY2hhbmdlVGhlbWUodGhpcy5JTklUSUFMX1RIRU1FKVxyXG4gICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgIGJvZHkgPT4gdGhpcy5vbkNoYW5nZVRoZW1lU3VjY2Vzcyhib2R5KSxcclxuICAgICAgICBlcnJvciA9PiB0aGlzLm9uQ2hhbmdlVGhlbWVGYWlsdXJlKGVycm9yKSk7XHJcbiAgfVxyXG5cclxuICBnb0JhY2soKSB7XHJcbiAgICB0aGlzLmNvbW1vblNlcnZpY2UuZ29CYWNrKCk7XHJcbiAgfVxyXG5cclxuICBvbkNoYW5nZVRoZW1lU3VjY2Vzcyhib2R5OiBhbnkpIHtcclxuICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0NIQU5HRV9USEVNRTtcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIHRoaXMudGhlbWVDaGFuZ2VTZXJ2aWNlLmNoYW5nZShib2R5LmRhdGEuY3VycmVudF90aGVtZSk7XHJcbiAgICBTZXNzaW9uU3RvcmFnZVNlcnZpY2Uuc2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLk1ZX1RIRU1FLCBib2R5LmRhdGEuY3VycmVudF90aGVtZSk7XHJcbiAgfVxyXG5cclxuICBvbkNoYW5nZVRoZW1lRmFpbHVyZShlcnJvcjogYW55KSB7XHJcbiAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgIG1lc3NhZ2UuY3VzdG9tX21lc3NhZ2UgPSBNZXNzYWdlcy5NU0dfRVJST1JfQ0hBTkdFX1RIRU1FO1xyXG4gICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gIH1cclxuICBnZXRIZWFkaW5ncygpIHtcclxuICAgIHJldHVybiBIZWFkaW5ncztcclxuICB9XHJcbn1cclxuIl19
