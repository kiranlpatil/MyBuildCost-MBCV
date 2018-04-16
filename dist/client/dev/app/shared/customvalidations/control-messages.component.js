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
var forms_1 = require("@angular/forms");
var validation_service_1 = require("./validation.service");
var ControlMessagesComponent = (function () {
    function ControlMessagesComponent() {
    }
    Object.defineProperty(ControlMessagesComponent.prototype, "errorMessage", {
        get: function () {
            for (var propertyName in this.control.errors) {
                if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
                    return validation_service_1.ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
                }
                if (this.control.errors.hasOwnProperty(propertyName) && this.submitStatus) {
                    return validation_service_1.ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
                }
                if (this.control.errors.hasOwnProperty(propertyName) && this.isShowErrorMessage) {
                    return validation_service_1.ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
                }
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(),
        __metadata("design:type", forms_1.FormControl)
    ], ControlMessagesComponent.prototype, "control", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ControlMessagesComponent.prototype, "submitStatus", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ControlMessagesComponent.prototype, "isShowErrorMessage", void 0);
    ControlMessagesComponent = __decorate([
        core_1.Component({
            selector: 'control-messages',
            template: "\n    <div *ngIf='errorMessage !== null'>{{ errorMessage }}</div>"
        })
    ], ControlMessagesComponent);
    return ControlMessagesComponent;
}());
exports.ControlMessagesComponent = ControlMessagesComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvY3VzdG9tdmFsaWRhdGlvbnMvY29udHJvbC1tZXNzYWdlcy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBaUQ7QUFDakQsd0NBQTZDO0FBQzdDLDJEQUF5RDtBQU96RDtJQUFBO0lBb0JBLENBQUM7SUFmQyxzQkFBSSxrREFBWTthQUFoQjtZQUNFLEdBQUcsQ0FBQyxDQUFDLElBQUksWUFBWSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDN0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDN0UsTUFBTSxDQUFDLHNDQUFpQixDQUFDLHdCQUF3QixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNyRyxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDMUUsTUFBTSxDQUFDLHNDQUFpQixDQUFDLHdCQUF3QixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNyRyxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO29CQUNoRixNQUFNLENBQUMsc0NBQWlCLENBQUMsd0JBQXdCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JHLENBQUM7WUFDSCxDQUFDO1lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7OztPQUFBO0lBbEJRO1FBQVIsWUFBSyxFQUFFO2tDQUFVLG1CQUFXOzZEQUFDO0lBQ3JCO1FBQVIsWUFBSyxFQUFFOztrRUFBdUI7SUFDdEI7UUFBUixZQUFLLEVBQUU7O3dFQUErQjtJQUg1Qix3QkFBd0I7UUFMcEMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxrQkFBa0I7WUFDNUIsUUFBUSxFQUFFLG1FQUNvRDtTQUMvRCxDQUFDO09BQ1csd0JBQXdCLENBb0JwQztJQUFELCtCQUFDO0NBcEJELEFBb0JDLElBQUE7QUFwQlksNERBQXdCIiwiZmlsZSI6ImFwcC9zaGFyZWQvY3VzdG9tdmFsaWRhdGlvbnMvY29udHJvbC1tZXNzYWdlcy5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBWYWxpZGF0aW9uU2VydmljZSB9IGZyb20gJy4vdmFsaWRhdGlvbi5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnY29udHJvbC1tZXNzYWdlcycsXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxkaXYgKm5nSWY9J2Vycm9yTWVzc2FnZSAhPT0gbnVsbCc+e3sgZXJyb3JNZXNzYWdlIH19PC9kaXY+YFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ29udHJvbE1lc3NhZ2VzQ29tcG9uZW50IHtcclxuICBASW5wdXQoKSBjb250cm9sOiBGb3JtQ29udHJvbDtcclxuICBASW5wdXQoKSBzdWJtaXRTdGF0dXM6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgaXNTaG93RXJyb3JNZXNzYWdlID86IGJvb2xlYW47XHJcblxyXG4gIGdldCBlcnJvck1lc3NhZ2UoKSB7XHJcbiAgICBmb3IgKGxldCBwcm9wZXJ0eU5hbWUgaW4gdGhpcy5jb250cm9sLmVycm9ycykge1xyXG4gICAgICBpZiAodGhpcy5jb250cm9sLmVycm9ycy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpICYmIHRoaXMuY29udHJvbC50b3VjaGVkKSB7XHJcbiAgICAgICAgcmV0dXJuIFZhbGlkYXRpb25TZXJ2aWNlLmdldFZhbGlkYXRvckVycm9yTWVzc2FnZShwcm9wZXJ0eU5hbWUsIHRoaXMuY29udHJvbC5lcnJvcnNbcHJvcGVydHlOYW1lXSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuY29udHJvbC5lcnJvcnMuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSAmJiB0aGlzLnN1Ym1pdFN0YXR1cykge1xyXG4gICAgICAgIHJldHVybiBWYWxpZGF0aW9uU2VydmljZS5nZXRWYWxpZGF0b3JFcnJvck1lc3NhZ2UocHJvcGVydHlOYW1lLCB0aGlzLmNvbnRyb2wuZXJyb3JzW3Byb3BlcnR5TmFtZV0pO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLmNvbnRyb2wuZXJyb3JzLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkgJiYgdGhpcy5pc1Nob3dFcnJvck1lc3NhZ2UpIHtcclxuICAgICAgICByZXR1cm4gVmFsaWRhdGlvblNlcnZpY2UuZ2V0VmFsaWRhdG9yRXJyb3JNZXNzYWdlKHByb3BlcnR5TmFtZSwgdGhpcy5jb250cm9sLmVycm9yc1twcm9wZXJ0eU5hbWVdKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxufVxyXG4iXX0=
