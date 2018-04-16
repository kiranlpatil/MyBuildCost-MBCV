"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var login_component_1 = require("./login.component");
var login_service_1 = require("./login.service");
var validation_service_1 = require("../../shared/customvalidations/validation.service");
var LoginModule = (function () {
    function LoginModule() {
    }
    LoginModule = __decorate([
        core_1.NgModule({
            declarations: [login_component_1.LoginComponent],
            exports: [login_component_1.LoginComponent],
            providers: [login_service_1.LoginService, validation_service_1.ValidationService]
        })
    ], LoginModule);
    return LoginModule;
}());
exports.LoginModule = LoginModule;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvbG9naW4vbG9naW4ubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsc0NBQXlDO0FBQ3pDLHFEQUFtRDtBQUNuRCxpREFBK0M7QUFDL0Msd0ZBQXNGO0FBUXRGO0lBQUE7SUFDQSxDQUFDO0lBRFksV0FBVztRQUx2QixlQUFRLENBQUM7WUFDUixZQUFZLEVBQUUsQ0FBQyxnQ0FBYyxDQUFDO1lBQzlCLE9BQU8sRUFBRSxDQUFDLGdDQUFjLENBQUM7WUFDekIsU0FBUyxFQUFFLENBQUMsNEJBQVksRUFBRSxzQ0FBaUIsQ0FBQztTQUM3QyxDQUFDO09BQ1csV0FBVyxDQUN2QjtJQUFELGtCQUFDO0NBREQsQUFDQyxJQUFBO0FBRFksa0NBQVciLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9sb2dpbi9sb2dpbi5tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBMb2dpbkNvbXBvbmVudCB9IGZyb20gJy4vbG9naW4uY29tcG9uZW50JztcclxuaW1wb3J0IHsgTG9naW5TZXJ2aWNlIH0gZnJvbSAnLi9sb2dpbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi9zaGFyZWQvY3VzdG9tdmFsaWRhdGlvbnMvdmFsaWRhdGlvbi5zZXJ2aWNlJztcclxuXHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGRlY2xhcmF0aW9uczogW0xvZ2luQ29tcG9uZW50XSxcclxuICBleHBvcnRzOiBbTG9naW5Db21wb25lbnRdLFxyXG4gIHByb3ZpZGVyczogW0xvZ2luU2VydmljZSwgVmFsaWRhdGlvblNlcnZpY2VdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMb2dpbk1vZHVsZSB7XHJcbn1cclxuIl19
