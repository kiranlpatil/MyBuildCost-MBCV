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
var validation_service_1 = require("../../../../shared/customvalidations/validation.service");
var project_1 = require("../../model/project");
var constants_1 = require("../../../../shared/constants");
var ProjectFormComponent = (function () {
    function ProjectFormComponent(formBuilder) {
        this.formBuilder = formBuilder;
        this.projectModel = new project_1.Project();
        this.onSubmitEvent = new core_1.EventEmitter();
        this.isShowErrorMessage = false;
        this.errorMessage = false;
        this.projectForm = this.formBuilder.group({
            name: ['', validation_service_1.ValidationService.requiredProjectName],
            region: ['', validation_service_1.ValidationService.requiredProjectAddress],
            plotArea: ['', validation_service_1.ValidationService.requiredPlotArea],
            plotPeriphery: ['', validation_service_1.ValidationService.requiredPlotPeriphery],
            podiumArea: ['', validation_service_1.ValidationService.requiredPodiumArea],
            openSpace: ['', validation_service_1.ValidationService.requiredOpenSpace],
            slabArea: ['', validation_service_1.ValidationService.requiredSlabArea],
            poolCapacity: ['', validation_service_1.ValidationService.requiredSwimmingPoolCapacity],
            projectDuration: ['', validation_service_1.ValidationService.requiredProjectDuration],
            totalNumOfBuildings: ['', validation_service_1.ValidationService.requiredNumOfBuildings]
        });
    }
    ProjectFormComponent.prototype.submitForm = function () {
        if (this.projectForm.valid) {
            this.projectModel = this.projectForm.value;
            this.onSubmitEvent.emit(this.projectModel);
        }
        else {
            this.isShowErrorMessage = true;
        }
    };
    ProjectFormComponent.prototype.getLabels = function () {
        return constants_1.Label;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ProjectFormComponent.prototype, "submitActionLabel", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", project_1.Project)
    ], ProjectFormComponent.prototype, "projectModel", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ProjectFormComponent.prototype, "onSubmitEvent", void 0);
    ProjectFormComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-project-form',
            templateUrl: 'project-form.component.html',
            styleUrls: ['project-form.component.css']
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder])
    ], ProjectFormComponent);
    return ProjectFormComponent;
}());
exports.ProjectFormComponent = ProjectFormComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9zaGFyZWQvcHJvamVjdC1mb3JtL3Byb2plY3QtZm9ybS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBdUU7QUFDdkUsd0NBQXdEO0FBQ3hELDhGQUE0RjtBQUM1RiwrQ0FBOEM7QUFDOUMsMERBQXFEO0FBU3JEO0lBVUUsOEJBQXFCLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBUHBDLGlCQUFZLEdBQVcsSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFDcEMsa0JBQWEsR0FBRyxJQUFJLG1CQUFZLEVBQVcsQ0FBQztRQUcvQyx1QkFBa0IsR0FBWSxLQUFLLENBQUM7UUFDcEMsaUJBQVksR0FBWSxLQUFLLENBQUM7UUFJbkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztZQUN4QyxJQUFJLEVBQUcsQ0FBQyxFQUFFLEVBQUUsc0NBQWlCLENBQUMsbUJBQW1CLENBQUM7WUFDbEQsTUFBTSxFQUFHLENBQUMsRUFBRSxFQUFFLHNDQUFpQixDQUFDLHNCQUFzQixDQUFDO1lBQ3ZELFFBQVEsRUFBRyxDQUFDLEVBQUUsRUFBRSxzQ0FBaUIsQ0FBQyxnQkFBZ0IsQ0FBQztZQUNuRCxhQUFhLEVBQUcsQ0FBQyxFQUFFLEVBQUUsc0NBQWlCLENBQUMscUJBQXFCLENBQUM7WUFDN0QsVUFBVSxFQUFHLENBQUMsRUFBRSxFQUFDLHNDQUFpQixDQUFDLGtCQUFrQixDQUFDO1lBQ3RELFNBQVMsRUFBRyxDQUFDLEVBQUUsRUFBRSxzQ0FBaUIsQ0FBQyxpQkFBaUIsQ0FBQztZQUNyRCxRQUFRLEVBQUcsQ0FBQyxFQUFFLEVBQUMsc0NBQWlCLENBQUMsZ0JBQWdCLENBQUM7WUFDbEQsWUFBWSxFQUFHLENBQUMsRUFBRSxFQUFDLHNDQUFpQixDQUFDLDRCQUE0QixDQUFDO1lBQ2xFLGVBQWUsRUFBRyxDQUFDLEVBQUUsRUFBRSxzQ0FBaUIsQ0FBQyx1QkFBdUIsQ0FBQztZQUNqRSxtQkFBbUIsRUFBRyxDQUFDLEVBQUUsRUFBRSxzQ0FBaUIsQ0FBQyxzQkFBc0IsQ0FBQztTQUNyRSxDQUFDLENBQUM7SUFFTCxDQUFDO0lBRUQseUNBQVUsR0FBVjtRQUNFLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO1FBQ2pDLENBQUM7SUFDSCxDQUFDO0lBRUQsd0NBQVMsR0FBVDtRQUNFLE1BQU0sQ0FBQyxpQkFBSyxDQUFDO0lBQ2YsQ0FBQztJQXBDUTtRQUFSLFlBQUssRUFBRTs7bUVBQTJCO0lBQzFCO1FBQVIsWUFBSyxFQUFFO2tDQUFlLGlCQUFPOzhEQUFnQjtJQUNwQztRQUFULGFBQU0sRUFBRTs7K0RBQTZDO0lBSjNDLG9CQUFvQjtRQVBoQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsV0FBVyxFQUFFLDZCQUE2QjtZQUMxQyxTQUFTLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQztTQUMxQyxDQUFDO3lDQVlrQyxtQkFBVztPQVZsQyxvQkFBb0IsQ0F3Q2hDO0lBQUQsMkJBQUM7Q0F4Q0QsQUF3Q0MsSUFBQTtBQXhDWSxvREFBb0IiLCJmaWxlIjoiYXBwL2J1aWxkLWluZm8vZnJhbWV3b3JrL3NoYXJlZC9wcm9qZWN0LWZvcm0vcHJvamVjdC1mb3JtLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEZvcm1CdWlsZGVyLCBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IFZhbGlkYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2hhcmVkL2N1c3RvbXZhbGlkYXRpb25zL3ZhbGlkYXRpb24uc2VydmljZSc7XHJcbmltcG9ydCB7IFByb2plY3QgfSBmcm9tICcuLi8uLi9tb2RlbC9wcm9qZWN0JztcclxuaW1wb3J0IHsgTGFiZWwgfSBmcm9tICcuLi8uLi8uLi8uLi9zaGFyZWQvY29uc3RhbnRzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICdiaS1wcm9qZWN0LWZvcm0nLFxyXG4gIHRlbXBsYXRlVXJsOiAncHJvamVjdC1mb3JtLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsncHJvamVjdC1mb3JtLmNvbXBvbmVudC5jc3MnXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIFByb2plY3RGb3JtQ29tcG9uZW50IHtcclxuXHJcbiAgQElucHV0KCkgc3VibWl0QWN0aW9uTGFiZWw6IHN0cmluZztcclxuICBASW5wdXQoKSBwcm9qZWN0TW9kZWw/OlByb2plY3Q9IG5ldyBQcm9qZWN0KCk7XHJcbiAgQE91dHB1dCgpIG9uU3VibWl0RXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyPFByb2plY3Q+KCk7XHJcblxyXG4gIHByb2plY3RGb3JtOiAgRm9ybUdyb3VwO1xyXG4gIHB1YmxpYyBpc1Nob3dFcnJvck1lc3NhZ2U6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBwdWJsaWMgZXJyb3JNZXNzYWdlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCBwcml2YXRlIGZvcm1CdWlsZGVyOiBGb3JtQnVpbGRlcikge1xyXG5cclxuICAgIHRoaXMucHJvamVjdEZvcm0gPSB0aGlzLmZvcm1CdWlsZGVyLmdyb3VwKHtcclxuICAgICAgbmFtZSA6IFsnJywgVmFsaWRhdGlvblNlcnZpY2UucmVxdWlyZWRQcm9qZWN0TmFtZV0sXHJcbiAgICAgIHJlZ2lvbiA6IFsnJywgVmFsaWRhdGlvblNlcnZpY2UucmVxdWlyZWRQcm9qZWN0QWRkcmVzc10sXHJcbiAgICAgIHBsb3RBcmVhIDogWycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZFBsb3RBcmVhXSxcclxuICAgICAgcGxvdFBlcmlwaGVyeSA6IFsnJywgVmFsaWRhdGlvblNlcnZpY2UucmVxdWlyZWRQbG90UGVyaXBoZXJ5XSxcclxuICAgICAgcG9kaXVtQXJlYSA6IFsnJyxWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZFBvZGl1bUFyZWFdLFxyXG4gICAgICBvcGVuU3BhY2UgOiBbJycsIFZhbGlkYXRpb25TZXJ2aWNlLnJlcXVpcmVkT3BlblNwYWNlXSxcclxuICAgICAgc2xhYkFyZWEgOiBbJycsVmFsaWRhdGlvblNlcnZpY2UucmVxdWlyZWRTbGFiQXJlYV0sXHJcbiAgICAgIHBvb2xDYXBhY2l0eSA6IFsnJyxWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZFN3aW1taW5nUG9vbENhcGFjaXR5XSxcclxuICAgICAgcHJvamVjdER1cmF0aW9uIDogWycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZFByb2plY3REdXJhdGlvbl0sXHJcbiAgICAgIHRvdGFsTnVtT2ZCdWlsZGluZ3MgOiBbJycsIFZhbGlkYXRpb25TZXJ2aWNlLnJlcXVpcmVkTnVtT2ZCdWlsZGluZ3NdXHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBzdWJtaXRGb3JtKCkge1xyXG4gICAgaWYodGhpcy5wcm9qZWN0Rm9ybS52YWxpZCkge1xyXG4gICAgdGhpcy5wcm9qZWN0TW9kZWwgPSB0aGlzLnByb2plY3RGb3JtLnZhbHVlO1xyXG4gICAgICB0aGlzLm9uU3VibWl0RXZlbnQuZW1pdCh0aGlzLnByb2plY3RNb2RlbCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmlzU2hvd0Vycm9yTWVzc2FnZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRMYWJlbHMoKSB7XHJcbiAgICByZXR1cm4gTGFiZWw7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=
