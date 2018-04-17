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
var forgot_password_1 = require("../../../user/models/forgot-password");
var forgot_password_service_1 = require("./forgot-password.service");
var index_1 = require("../../../shared/index");
var forms_1 = require("@angular/forms");
var validation_service_1 = require("../../../shared/customvalidations/validation.service");
var constants_1 = require("../../../shared/constants");
var ForgotPasswordComponent = (function () {
    function ForgotPasswordComponent(_router, forgotPasswordService, messageService, formBuilder, route) {
        this._router = _router;
        this.forgotPasswordService = forgotPasswordService;
        this.messageService = messageService;
        this.formBuilder = formBuilder;
        this.route = route;
        this.model = new forgot_password_1.ForgotPassword();
        this.forgotPasswordMessage = index_1.Messages.MSG_FORGOT_PASSWORD;
        this.isShowLoader = false;
        this.userForm = this.formBuilder.group({
            'email': ['', [validation_service_1.ValidationService.requireEmailValidator, validation_service_1.ValidationService.emailValidator]]
        });
        this.MY_LOGO_PATH = constants_1.ImagePath.MY_WHITE_LOGO;
        this.UNDER_LICENCE = constants_1.ProjectAsset.UNDER_LICENECE;
        this.MY_TAG_LINE = constants_1.ProjectAsset.TAG_LINE;
        this.EMAIL_ICON = constants_1.ImagePath.EMAIL_ICON;
        this.BODY_BACKGROUND = constants_1.ImagePath.BODY_BACKGROUND;
        this.forgotPasswordButtonLabel = 'Request Reset Link';
    }
    ForgotPasswordComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.emailForForgetPassword = params['email'];
        });
    };
    ForgotPasswordComponent.prototype.onSubmit = function () {
        var _this = this;
        this.model = this.userForm.value;
        this.error_msg = '';
        if (this.model.email == '') {
            this.submitStatus = true;
            return;
        }
        if (!this.userForm.valid) {
            this.submitStatus = true;
            return;
        }
        this.isShowLoader = true;
        this.forgotPasswordService.forgotPassword(this.model)
            .subscribe(function (body) {
            _this.onForgotPasswordSuccess(body);
            _this.isShowLoader = false;
        }, function (error) {
            _this.isShowLoader = false;
            _this.onForgotPasswordFailure(error);
        });
    };
    ForgotPasswordComponent.prototype.onForgotPasswordSuccess = function (body) {
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = index_1.Messages.MSG_SUCCESS_FORGOT_PASSWORD;
        this.messageService.message(message);
        this.forgotPasswordButtonLabel = 'Resend Email';
    };
    ForgotPasswordComponent.prototype.onForgotPasswordFailure = function (error) {
        if (error.err_code === 404 || error.err_code === 0) {
            var message = new index_1.Message();
            message.error_msg = error.err_msg;
            message.isError = true;
            this.messageService.message(message);
        }
        else {
            this.error_msg = error.err_msg;
        }
    };
    ForgotPasswordComponent.prototype.goBack = function () {
        this._router.navigate([index_1.NavigationRoutes.APP_LOGIN]);
    };
    ForgotPasswordComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'cn-forgot-password',
            templateUrl: 'forgot-password.component.html',
            styleUrls: ['forgot-password.component.css'],
        }),
        __metadata("design:paramtypes", [router_1.Router,
            forgot_password_service_1.ForgotPasswordService,
            index_1.MessageService,
            forms_1.FormBuilder,
            router_1.ActivatedRoute])
    ], ForgotPasswordComponent);
    return ForgotPasswordComponent;
}());
exports.ForgotPasswordComponent = ForgotPasswordComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvbG9naW4vZm9yZ290LXBhc3N3b3JkL2ZvcmdvdC1wYXNzd29yZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBZ0Q7QUFDaEQsMENBQStEO0FBQy9ELHdFQUFzRTtBQUN0RSxxRUFBa0U7QUFDbEUsK0NBQTRGO0FBQzVGLHdDQUF3RDtBQUN4RCwyRkFBeUY7QUFDekYsdURBQW9FO0FBVXBFO0lBZ0JFLGlDQUFvQixPQUFlLEVBQ2YscUJBQTRDLEVBQzVDLGNBQThCLEVBQzlCLFdBQXdCLEVBQ3hCLEtBQXFCO1FBSnJCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZiwwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBQzVDLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQW5CekMsVUFBSyxHQUFHLElBQUksZ0NBQWMsRUFBRSxDQUFDO1FBVTdCLDBCQUFxQixHQUFXLGdCQUFRLENBQUMsbUJBQW1CLENBQUM7UUFFN0QsaUJBQVksR0FBWSxLQUFLLENBQUM7UUFRNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztZQUNyQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxzQ0FBaUIsQ0FBQyxxQkFBcUIsRUFBRSxzQ0FBaUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUMzRixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsWUFBWSxHQUFHLHFCQUFTLENBQUMsYUFBYSxDQUFDO1FBQzVDLElBQUksQ0FBQyxhQUFhLEdBQUcsd0JBQVksQ0FBQyxjQUFjLENBQUM7UUFDakQsSUFBSSxDQUFDLFdBQVcsR0FBRyx3QkFBWSxDQUFDLFFBQVEsQ0FBQztRQUN6QyxJQUFJLENBQUMsVUFBVSxHQUFHLHFCQUFTLENBQUMsVUFBVSxDQUFDO1FBQ3ZDLElB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OUIsV0FBVyxFQUFFLGdDQUFnQztZQUM3QyxTQUFTLEVBQUUsQ0FBQywrQkFBK0IsQ0FBQztTQUM3QyxDQUFDO3lDQWtCNkIsZUFBTTtZQUNRLCtDQUFxQjtZQUM1QixzQkFBYztZQUNqQixtQkFBVztZQUNqQix1QkFBYztPQXBCOUIsdUJBQXVCLENBdUZuQztJQUFELDhCQUFDO0NBdkZELEFBdUZDLElBQUE7QUF2RlksMERBQXVCIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvbG9naW4vZm9yZ290LXBhc3N3b3JkL2ZvcmdvdC1wYXNzd29yZC5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtBY3RpdmF0ZWRSb3V0ZSwgUGFyYW1zLCBSb3V0ZXJ9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IEZvcmdvdFBhc3N3b3JkIH0gZnJvbSAnLi4vLi4vLi4vdXNlci9tb2RlbHMvZm9yZ290LXBhc3N3b3JkJztcclxuaW1wb3J0IHsgRm9yZ290UGFzc3dvcmRTZXJ2aWNlIH0gZnJvbSAnLi9mb3Jnb3QtcGFzc3dvcmQuc2VydmljZSc7XHJcbmltcG9ydCB7IE1lc3NhZ2UsIE1lc3NhZ2VzLCBNZXNzYWdlU2VydmljZSwgTmF2aWdhdGlvblJvdXRlcyB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IFZhbGlkYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL2N1c3RvbXZhbGlkYXRpb25zL3ZhbGlkYXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7IEltYWdlUGF0aCwgUHJvamVjdEFzc2V0IH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICBzZWxlY3RvcjogJ2NuLWZvcmdvdC1wYXNzd29yZCcsXHJcbiAgdGVtcGxhdGVVcmw6ICdmb3Jnb3QtcGFzc3dvcmQuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydmb3Jnb3QtcGFzc3dvcmQuY29tcG9uZW50LmNzcyddLFxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIEZvcmdvdFBhc3N3b3JkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0e1xyXG4gIG1vZGVsID0gbmV3IEZvcmdvdFBhc3N3b3JkKCk7XHJcbiAgdXNlckZvcm06IEZvcm1Hcm91cDtcclxuICBlcnJvcl9tc2c6IHN0cmluZztcclxuICBNWV9MT0dPX1BBVEg6IHN0cmluZztcclxuICBNWV9UQUdfTElORTogc3RyaW5nO1xyXG4gIFVOREVSX0xJQ0VOQ0U6IHN0cmluZztcclxuICBlbWFpbEZvckZvcmdldFBhc3N3b3JkOiBzdHJpbmc7XHJcbiAgRU1BSUxfSUNPTjogc3RyaW5nO1xyXG4gIEJPRFlfQkFDS0dST1VORDogc3RyaW5nO1xyXG4gIGZvcmdvdFBhc3N3b3JkQnV0dG9uTGFiZWw6IHN0cmluZztcclxuICBmb3Jnb3RQYXNzd29yZE1lc3NhZ2U6IHN0cmluZyA9IE1lc3NhZ2VzLk1TR19GT1JHT1RfUEFTU1dPUkQ7XHJcbiAgc3VibWl0U3RhdHVzOiBib29sZWFuO1xyXG4gIGlzU2hvd0xvYWRlcjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBmb3Jnb3RQYXNzd29yZFNlcnZpY2U6IEZvcmdvdFBhc3N3b3JkU2VydmljZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIGZvcm1CdWlsZGVyOiBGb3JtQnVpbGRlcixcclxuICAgICAgICAgICAgICBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSApIHtcclxuICAgIHRoaXMudXNlckZvcm0gPSB0aGlzLmZvcm1CdWlsZGVyLmdyb3VwKHtcclxuICAgICAgJ2VtYWlsJzogWycnLCBbVmFsaWRhdGlvblNlcnZpY2UucmVxdWlyZUVtYWlsVmFsaWRhdG9yLCBWYWxpZGF0aW9uU2VydmljZS5lbWFpbFZhbGlkYXRvcl1dXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLk1ZX0xPR09fUEFUSCA9IEltYWdlUGF0aC5NWV9XSElURV9MT0dPO1xyXG4gICAgdGhpcy5VTkRFUl9MSUNFTkNFID0gUHJvamVjdEFzc2V0LlVOREVSX0xJQ0VORUNFO1xyXG4gICAgdGhpcy5NWV9UQUdfTElORSA9IFByb2plY3RBc3NldC5UQUdfTElORTtcclxuICAgIHRoaXMuRU1BSUxfSUNPTiA9IEltYWdlUGF0aC5FTUFJTF9JQ09OO1xyXG4gICAgdGhpcy5CT0RZX0JBQ0tHUk9VTkQgPSBJbWFnZVBhdGguQk9EWV9CQUNLR1JPVU5EO1xyXG4gICAgdGhpcy5mb3Jnb3RQYXNzd29yZEJ1dHRvbkxhYmVsID0gJ1JlcXVlc3QgUmVzZXQgTGluayc7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMucm91dGUucGFyYW1zLnN1YnNjcmliZSgocGFyYW1zOiBQYXJhbXMpID0+IHtcclxuICAgICAgdGhpcy5lbWFpbEZvckZvcmdldFBhc3N3b3JkID0gcGFyYW1zWydlbWFpbCddO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBvblN1Ym1pdCgpIHtcclxuICAgIHRoaXMubW9kZWwgPSB0aGlzLnVzZXJGb3JtLnZhbHVlO1xyXG4gICAgdGhpcy5lcnJvcl9tc2c9Jyc7XHJcbiAgICBpZiAodGhpcy5tb2RlbC5lbWFpbCA9PSAnJykge1xyXG4gICAgICB0aGlzLnN1Ym1pdFN0YXR1cyA9IHRydWU7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmICghdGhpcy51c2VyRm9ybS52YWxpZCkge1xyXG4gICAgICB0aGlzLnN1Ym1pdFN0YXR1cyA9IHRydWU7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuaXNTaG93TG9hZGVyID0gdHJ1ZTtcclxuICAgIHRoaXMuZm9yZ290UGFzc3dvcmRTZXJ2aWNlLmZvcmdvdFBhc3N3b3JkKHRoaXMubW9kZWwpXHJcbiAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgYm9keSA9PiB7XHJcbiAgICAgICAgICB0aGlzLm9uRm9yZ290UGFzc3dvcmRTdWNjZXNzKGJvZHkpO1xyXG4gICAgICAgICAgdGhpcy5pc1Nob3dMb2FkZXIgPSBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yID0+IHtcclxuICAgICAgICAgIHRoaXMuaXNTaG93TG9hZGVyID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLm9uRm9yZ290UGFzc3dvcmRGYWlsdXJlKGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkZvcmdvdFBhc3N3b3JkU3VjY2Vzcyhib2R5OiBGb3Jnb3RQYXNzd29yZCkge1xyXG4gICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgbWVzc2FnZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfRk9SR09UX1BBU1NXT1JEO1xyXG4gICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgdGhpcy5mb3Jnb3RQYXNzd29yZEJ1dHRvbkxhYmVsID0gJ1Jlc2VuZCBFbWFpbCc7XHJcbiAgfVxyXG5cclxuICBvbkZvcmdvdFBhc3N3b3JkRmFpbHVyZShlcnJvcjogYW55KSB7XHJcbiAgICBpZiAoZXJyb3IuZXJyX2NvZGUgPT09IDQwNCB8fCBlcnJvci5lcnJfY29kZSA9PT0gMCkge1xyXG4gICAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICAgIG1lc3NhZ2UuZXJyb3JfbXNnID0gZXJyb3IuZXJyX21zZztcclxuICAgICAgbWVzc2FnZS5pc0Vycm9yID0gdHJ1ZTtcclxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5lcnJvcl9tc2cgPSBlcnJvci5lcnJfbXNnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ29CYWNrKCkge1xyXG4gICAgdGhpcy5fcm91dGVyLm5hdmlnYXRlKFtOYXZpZ2F0aW9uUm91dGVzLkFQUF9MT0dJTl0pO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcblxyXG4iXX0=
