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
var contact_1 = require("./contact");
var contact_service_1 = require("./contact.service");
var index_1 = require("../../../shared/index");
var forms_1 = require("@angular/forms");
var validation_service_1 = require("../../../shared/customvalidations/validation.service");
var loaders_service_1 = require("../../../shared/loader/loaders.service");
var ContactComponent = (function () {
    function ContactComponent(commonService, _router, loaderService, contactService, messageService, formBuilder) {
        this.commonService = commonService;
        this._router = _router;
        this.loaderService = loaderService;
        this.contactService = contactService;
        this.messageService = messageService;
        this.formBuilder = formBuilder;
        this.model = new contact_1.Contact();
        this.submitted = false;
        this.isShowErrorMessage = true;
        this.contactUsText = index_1.Messages.MSG_CONTACT_US;
        this.contactAddress = index_1.Messages.CONTACT_US_ADDRESS;
        this.contactNumber1 = index_1.Messages.CONTACT_US_CONTACT_NUMBER_1;
        this.contactNumber2 = index_1.Messages.CONTACT_US_CONTACT_NUMBER_2;
        this.contactEmail1 = index_1.Messages.CONTACT_US_EMAIL_1;
        this.contactEmail2 = index_1.Messages.CONTACT_US_EMAIL_2;
        this.userForm = this.formBuilder.group({
            'first_name': ['', forms_1.Validators.required],
            'email': ['', [forms_1.Validators.required, validation_service_1.ValidationService.emailValidator]],
            'message': ['', forms_1.Validators.required]
        });
    }
    ContactComponent.prototype.ngOnInit = function () {
        document.body.scrollTop = 0;
    };
    ContactComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        this.model = this.userForm.value;
        this.contactService.contact(this.model)
            .subscribe(function (body) { return _this.onContactSuccess(body); }, function (error) { return _this.onContactFailure(error); });
    };
    ContactComponent.prototype.onContactSuccess = function (body) {
        this.userForm.reset();
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = index_1.Messages.MSG_SUCCESS_CONTACT;
        this.messageService.message(message);
    };
    ContactComponent.prototype.onContactFailure = function (error) {
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
    ContactComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'tpl-contact',
            templateUrl: 'contact.component.html',
            styleUrls: ['contact.component.css'],
        }),
        __metadata("design:paramtypes", [index_1.CommonService, router_1.Router, loaders_service_1.LoaderService,
            contact_service_1.ContactService, index_1.MessageService, forms_1.FormBuilder])
    ], ContactComponent);
    return ContactComponent;
}());
exports.ContactComponent = ContactComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGFzaGJvYXJkL2NvbnRhY3QvY29udGFjdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBa0Q7QUFDbEQsMENBQXlDO0FBQ3pDLHFDQUFvQztBQUNwQyxxREFBbUQ7QUFDbkQsK0NBQXlGO0FBQ3pGLHdDQUFvRTtBQUNwRSwyRkFBeUY7QUFDekYsMEVBQXVFO0FBUXZFO0lBY0UsMEJBQW9CLGFBQTRCLEVBQVUsT0FBZSxFQUFVLGFBQTRCLEVBQzNGLGNBQThCLEVBQVUsY0FBOEIsRUFBVSxXQUF3QjtRQUR4RyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUMzRixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQWQ1SCxVQUFLLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFDdEIsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUdsQix1QkFBa0IsR0FBWSxJQUFJLENBQUM7UUFDbkMsa0JBQWEsR0FBVSxnQkFBUSxDQUFDLGNBQWMsQ0FBQztRQUMvQyxtQkFBYyxHQUFVLGdCQUFRLENBQUMsa0JBQWtCLENBQUM7UUFDcEQsbUJBQWMsR0FBVSxnQkFBUSxDQUFDLDJCQUEyQixDQUFDO1FBQzdELG1CQUFjLEdBQVUsZ0JBQVEsQ0FBQywyQkFBMkIsQ0FBQztRQUM3RCxrQkFBYSxHQUFVLGdCQUFRLENBQUMsa0JBQWtCLENBQUM7UUFDbkQsa0JBQWEsR0FBVSxnQkFBUSxDQUFDLGtCQUFrQixDQUFDO1FBTWpELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7WUFDckMsWUFBWSxFQUFFLENBQUMsRUFBRSxFQUFFLGtCQUFVLENBQUMsUUFBUSxDQUFDO1lBQ3ZDLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGtCQUFVLENBQUMsUUFBUSxFQUFFLHNDQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3RFLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxrQkFBVSxDQUFDLFFBQVEsQ0FBQztTQUNyQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsbUNBQVEsR0FBUjtRQUNFLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsbUNBQVEsR0FBUjtRQUFBLGlCQU9DO1FBTkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztRQUNqQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQ3BDLFNBQVMsQ0FDUixVQUFBLElBQUksSUFBSSxPQUFBLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBM0IsQ0FBMkIsRUFDbkMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEVBQTVCLENBQTRCLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsMkNBQWdCLEdBQWhCLFVBQWlCLElBQWE7UUFDNUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN0QixJQUFJLE9BQU8sR0FBRyxJQUFJLGVBQU8sRUFBRSxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLE9BQU8sQ0FBQyxjQUFjLEdBQUcsZ0JBQVEsQ0FBQyxtQkFBbUIsQ0FBQztRQUN0RCxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsMkNBQWdCLEdBQWhCLFVBQWlCLEtBQVU7UUFDekIsSUFBSSxPQUFPLEdBQUcsSUFBSSxlQUFPLEVBQUUsQ0FBQztRQUM1QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkQsT0FBTyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1lBQ2xDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7WUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1lBQy9CLE9BQU8sQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztZQUNsQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QyxDQUFDO0lBQ0gsQ0FBQztJQTFEVSxnQkFBZ0I7UUFONUIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsYUFBYTtZQUN2QixXQUFXLEVBQUUsd0JBQXdCO1lBQ3JDLFNBQVMsRUFBRSxDQUFDLHVCQUF1QixDQUFDO1NBQ3JDLENBQUM7eUNBZW1DLHFCQUFhLEVBQW1CLGVBQU0sRUFBeUIsK0JBQWE7WUFDM0UsZ0NBQWMsRUFBMEIsc0JBQWMsRUFBdUIsbUJBQVc7T0FmakgsZ0JBQWdCLENBMkQ1QjtJQUFELHVCQUFDO0NBM0RELEFBMkRDLElBQUE7QUEzRFksNENBQWdCIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvZGFzaGJvYXJkL2NvbnRhY3QvY29udGFjdC5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBDb250YWN0IH0gZnJvbSAnLi9jb250YWN0JztcclxuaW1wb3J0IHsgQ29udGFjdFNlcnZpY2UgfSBmcm9tICcuL2NvbnRhY3Quc2VydmljZSc7XHJcbmltcG9ydCB7IENvbW1vblNlcnZpY2UsIE1lc3NhZ2UsIE1lc3NhZ2VzLCBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IFZhbGlkYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL2N1c3RvbXZhbGlkYXRpb25zL3ZhbGlkYXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7IExvYWRlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvbG9hZGVyL2xvYWRlcnMuc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAndHBsLWNvbnRhY3QnLFxyXG4gIHRlbXBsYXRlVXJsOiAnY29udGFjdC5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJ2NvbnRhY3QuY29tcG9uZW50LmNzcyddLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ29udGFjdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgbW9kZWwgPSBuZXcgQ29udGFjdCgpO1xyXG4gIHN1Ym1pdHRlZCA9IGZhbHNlO1xyXG4gIHVzZXJGb3JtOiBGb3JtR3JvdXA7XHJcbiAgZXJyb3JfbXNnOiBzdHJpbmc7XHJcbiAgaXNTaG93RXJyb3JNZXNzYWdlOiBib29sZWFuID0gdHJ1ZTtcclxuICBjb250YWN0VXNUZXh0OiBzdHJpbmc9IE1lc3NhZ2VzLk1TR19DT05UQUNUX1VTO1xyXG4gIGNvbnRhY3RBZGRyZXNzOiBzdHJpbmc9IE1lc3NhZ2VzLkNPTlRBQ1RfVVNfQUREUkVTUztcclxuICBjb250YWN0TnVtYmVyMTogc3RyaW5nPSBNZXNzYWdlcy5DT05UQUNUX1VTX0NPTlRBQ1RfTlVNQkVSXzE7XHJcbiAgY29udGFjdE51bWJlcjI6IHN0cmluZz0gTWVzc2FnZXMuQ09OVEFDVF9VU19DT05UQUNUX05VTUJFUl8yO1xyXG4gIGNvbnRhY3RFbWFpbDE6IHN0cmluZz0gTWVzc2FnZXMuQ09OVEFDVF9VU19FTUFJTF8xO1xyXG4gIGNvbnRhY3RFbWFpbDI6IHN0cmluZz0gTWVzc2FnZXMuQ09OVEFDVF9VU19FTUFJTF8yO1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb21tb25TZXJ2aWNlOiBDb21tb25TZXJ2aWNlLCBwcml2YXRlIF9yb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBsb2FkZXJTZXJ2aWNlOiBMb2FkZXJTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgY29udGFjdFNlcnZpY2U6IENvbnRhY3RTZXJ2aWNlLCBwcml2YXRlIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSwgcHJpdmF0ZSBmb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIpIHtcclxuXHJcbiAgICB0aGlzLnVzZXJGb3JtID0gdGhpcy5mb3JtQnVpbGRlci5ncm91cCh7XHJcbiAgICAgICdmaXJzdF9uYW1lJzogWycnLCBWYWxpZGF0b3JzLnJlcXVpcmVkXSxcclxuICAgICAgJ2VtYWlsJzogWycnLCBbVmFsaWRhdG9ycy5yZXF1aXJlZCwgVmFsaWRhdGlvblNlcnZpY2UuZW1haWxWYWxpZGF0b3JdXSxcclxuICAgICAgJ21lc3NhZ2UnOiBbJycsIFZhbGlkYXRvcnMucmVxdWlyZWRdXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSAwO1xyXG4gIH1cclxuXHJcbiAgb25TdWJtaXQoKSB7XHJcbiAgICB0aGlzLnN1Ym1pdHRlZCA9IHRydWU7XHJcbiAgICB0aGlzLm1vZGVsID0gdGhpcy51c2VyRm9ybS52YWx1ZTtcclxuICAgIHRoaXMuY29udGFjdFNlcnZpY2UuY29udGFjdCh0aGlzLm1vZGVsKVxyXG4gICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgIGJvZHkgPT4gdGhpcy5vbkNvbnRhY3RTdWNjZXNzKGJvZHkpLFxyXG4gICAgICAgIGVycm9yID0+IHRoaXMub25Db250YWN0RmFpbHVyZShlcnJvcikpO1xyXG4gIH1cclxuXHJcbiAgb25Db250YWN0U3VjY2Vzcyhib2R5OiBDb250YWN0KSB7XHJcbiAgICB0aGlzLnVzZXJGb3JtLnJlc2V0KCk7XHJcbiAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgIG1lc3NhZ2UuY3VzdG9tX21lc3NhZ2UgPSBNZXNzYWdlcy5NU0dfU1VDQ0VTU19DT05UQUNUO1xyXG4gICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gIH1cclxuXHJcbiAgb25Db250YWN0RmFpbHVyZShlcnJvcjogYW55KSB7XHJcbiAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICBpZiAoZXJyb3IuZXJyX2NvZGUgPT09IDQwNCB8fCBlcnJvci5lcnJfY29kZSA9PT0gMCkge1xyXG4gICAgICBtZXNzYWdlLmVycm9yX21zZyA9IGVycm9yLmVycl9tc2c7XHJcbiAgICAgIG1lc3NhZ2UuaXNFcnJvciA9IHRydWU7XHJcbiAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuaXNTaG93RXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuZXJyb3JfbXNnID0gZXJyb3IuZXJyX21zZztcclxuICAgICAgbWVzc2FnZS5lcnJvcl9tc2cgPSBlcnJvci5lcnJfbXNnO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSB0cnVlO1xyXG4gICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==
