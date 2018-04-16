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
var constants_1 = require("../../../../shared/constants");
var validation_service_1 = require("../../../../shared/customvalidations/validation.service");
var building_1 = require("../../model/building");
var BuildingFormComponent = (function () {
    function BuildingFormComponent(formBuilder) {
        this.formBuilder = formBuilder;
        this.buildingModel = new building_1.Building();
        this.onSubmitEvent = new core_1.EventEmitter();
        this.isShowErrorMessage = false;
        this.errorMessage = false;
        this.buildingForm = this.formBuilder.group({
            name: ['', validation_service_1.ValidationService.requiredBuildingName],
            totalSlabArea: ['', validation_service_1.ValidationService.requiredSlabArea],
            totalCarpetAreaOfUnit: ['', validation_service_1.ValidationService.requiredCarpetArea],
            totalSaleableAreaOfUnit: ['', validation_service_1.ValidationService.requiredSalebleArea],
            plinthArea: ['', validation_service_1.ValidationService.requiredPlinthArea],
            totalNumOfFloors: ['', validation_service_1.ValidationService.requiredTotalNumOfFloors],
            numOfParkingFloors: ['', validation_service_1.ValidationService.requiredNumOfParkingFloors],
            carpetAreaOfParking: ['', validation_service_1.ValidationService.requiredCarpetAreaOfParking],
            numOfOneBHK: [''],
            numOfTwoBHK: [''],
            numOfThreeBHK: [''],
            numOfFourBHK: [''],
            numOfFiveBHK: [''],
            numOfLifts: ['']
        });
    }
    BuildingFormComponent.prototype.submitForm = function () {
        if (this.buildingForm.valid) {
            this.buildingModel = this.buildingForm.value;
            this.onSubmitEvent.emit(this.buildingModel);
        }
        else {
            this.isShowErrorMessage = true;
        }
    };
    BuildingFormComponent.prototype.getLabels = function () {
        return constants_1.Label;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], BuildingFormComponent.prototype, "submitActionLabel", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", building_1.Building)
    ], BuildingFormComponent.prototype, "buildingModel", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], BuildingFormComponent.prototype, "onSubmitEvent", void 0);
    BuildingFormComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-building-form',
            templateUrl: 'building-form.component.html',
            styleUrls: ['building-form.component.css']
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder])
    ], BuildingFormComponent);
    return BuildingFormComponent;
}());
exports.BuildingFormComponent = BuildingFormComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9zaGFyZWQvYnVpbGRpbmctZm9ybS9idWlsZGluZy1mb3JtLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUF1RTtBQUN2RSx3Q0FBd0Q7QUFDeEQsMERBQXFEO0FBQ3JELDhGQUE0RjtBQUM1RixpREFBZ0Q7QUFTaEQ7SUFVRSwrQkFBcUIsV0FBd0I7UUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFQcEMsa0JBQWEsR0FBWSxJQUFJLG1CQUFRLEVBQUUsQ0FBQztRQUN2QyxrQkFBYSxHQUFHLElBQUksbUJBQVksRUFBWSxDQUFDO1FBR2hELHVCQUFrQixHQUFZLEtBQUssQ0FBQztRQUNwQyxpQkFBWSxHQUFZLEtBQUssQ0FBQztRQUluQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO1lBQ3pDLElBQUksRUFBRyxDQUFDLEVBQUUsRUFBRSxzQ0FBaUIsQ0FBQyxvQkFBb0IsQ0FBQztZQUNuRCxhQUFhLEVBQUUsQ0FBQyxFQUFFLEVBQUUsc0NBQWlCLENBQUMsZ0JBQWdCLENBQUM7WUFDdkQscUJBQXFCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsc0NBQWlCLENBQUMsa0JBQWtCLENBQUM7WUFDakUsdUJBQXVCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsc0NBQWlCLENBQUMsbUJBQW1CLENBQUM7WUFDcEUsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFLHNDQUFpQixDQUFDLGtCQUFrQixDQUFDO1lBQ3RELGdCQUFnQixFQUFFLENBQUMsRUFBRSxFQUFFLHNDQUFpQixDQUFDLHdCQUF3QixDQUFDO1lBQ2xFLGtCQUFrQixFQUFFLENBQUMsRUFBRSxFQUFFLHNDQUFpQixDQUFDLDBCQUEwQixDQUFDO1lBQ3RFLG1CQUFtQixFQUFFLENBQUMsRUFBRSxFQUFFLHNDQUFpQixDQUFDLDJCQUEyQixDQUFDO1lBQ3hFLFdBQVcsRUFBRyxDQUFDLEVBQUUsQ0FBQztZQUNsQixXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDakIsYUFBYSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ25CLFlBQVksRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNsQixZQUFZLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDbEIsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDO1NBQ2pCLENBQUMsQ0FBQztJQUVMLENBQUM7SUFFRCwwQ0FBVSxHQUFWO1FBQ0UsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7WUFDN0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7UUFDakMsQ0FBQztJQUNILENBQUM7SUFFRCx5Q0FBUyxHQUFUO1FBQ0UsTUFBTSxDQUFDLGlCQUFLLENBQUM7SUFDZixDQUFDO0lBeENRO1FBQVIsWUFBSyxFQUFFOztvRUFBMkI7SUFDMUI7UUFBUixZQUFLLEVBQUU7a0NBQWdCLG1CQUFRO2dFQUFpQjtJQUN2QztRQUFULGFBQU0sRUFBRTs7Z0VBQThDO0lBSjVDLHFCQUFxQjtRQVBqQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSxrQkFBa0I7WUFDNUIsV0FBVyxFQUFFLDhCQUE4QjtZQUMzQyxTQUFTLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQztTQUMzQyxDQUFDO3lDQVlrQyxtQkFBVztPQVZsQyxxQkFBcUIsQ0E0Q2pDO0lBQUQsNEJBQUM7Q0E1Q0QsQUE0Q0MsSUFBQTtBQTVDWSxzREFBcUIiLCJmaWxlIjoiYXBwL2J1aWxkLWluZm8vZnJhbWV3b3JrL3NoYXJlZC9idWlsZGluZy1mb3JtL2J1aWxkaW5nLWZvcm0uY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgTGFiZWwgfSBmcm9tICcuLi8uLi8uLi8uLi9zaGFyZWQvY29uc3RhbnRzJztcclxuaW1wb3J0IHsgVmFsaWRhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zaGFyZWQvY3VzdG9tdmFsaWRhdGlvbnMvdmFsaWRhdGlvbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQnVpbGRpbmcgfSBmcm9tICcuLi8uLi9tb2RlbC9idWlsZGluZyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAnYmktYnVpbGRpbmctZm9ybScsXHJcbiAgdGVtcGxhdGVVcmw6ICdidWlsZGluZy1mb3JtLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnYnVpbGRpbmctZm9ybS5jb21wb25lbnQuY3NzJ11cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBCdWlsZGluZ0Zvcm1Db21wb25lbnQge1xyXG5cclxuICBASW5wdXQoKSBzdWJtaXRBY3Rpb25MYWJlbDogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGJ1aWxkaW5nTW9kZWw/OkJ1aWxkaW5nPSBuZXcgQnVpbGRpbmcoKTtcclxuICBAT3V0cHV0KCkgb25TdWJtaXRFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8QnVpbGRpbmc+KCk7XHJcblxyXG4gIGJ1aWxkaW5nRm9ybTogIEZvcm1Hcm91cDtcclxuICBwdWJsaWMgaXNTaG93RXJyb3JNZXNzYWdlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHVibGljIGVycm9yTWVzc2FnZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBjb25zdHJ1Y3RvciggcHJpdmF0ZSBmb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIpIHtcclxuXHJcbiAgICB0aGlzLmJ1aWxkaW5nRm9ybSA9IHRoaXMuZm9ybUJ1aWxkZXIuZ3JvdXAoe1xyXG4gICAgICBuYW1lIDogWycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZEJ1aWxkaW5nTmFtZV0sXHJcbiAgICAgIHRvdGFsU2xhYkFyZWEgOlsnJywgVmFsaWRhdGlvblNlcnZpY2UucmVxdWlyZWRTbGFiQXJlYV0sXHJcbiAgICAgIHRvdGFsQ2FycGV0QXJlYU9mVW5pdCA6WycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZENhcnBldEFyZWFdLFxyXG4gICAgICB0b3RhbFNhbGVhYmxlQXJlYU9mVW5pdCA6WycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZFNhbGVibGVBcmVhXSxcclxuICAgICAgcGxpbnRoQXJlYSA6WycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZFBsaW50aEFyZWFdLFxyXG4gICAgICB0b3RhbE51bU9mRmxvb3JzIDpbJycsIFZhbGlkYXRpb25TZXJ2aWNlLnJlcXVpcmVkVG90YWxOdW1PZkZsb29yc10sXHJcbiAgICAgIG51bU9mUGFya2luZ0Zsb29ycyA6WycnLCBWYWxpZGF0aW9uU2VydmljZS5yZXF1aXJlZE51bU9mUGFya2luZ0Zsb29yc10sXHJcbiAgICAgIGNhcnBldEFyZWFPZlBhcmtpbmcgOlsnJywgVmFsaWRhdGlvblNlcnZpY2UucmVxdWlyZWRDYXJwZXRBcmVhT2ZQYXJraW5nXSxcclxuICAgICAgbnVtT2ZPbmVCSEsgOiBbJyddLFxyXG4gICAgICBudW1PZlR3b0JISyA6WycnXSxcclxuICAgICAgbnVtT2ZUaHJlZUJISyA6WycnXSxcclxuICAgICAgbnVtT2ZGb3VyQkhLIDpbJyddLFxyXG4gICAgICBudW1PZkZpdmVCSEsgOlsnJ10sXHJcbiAgICAgIG51bU9mTGlmdHMgOlsnJ11cclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIHN1Ym1pdEZvcm0oKSB7XHJcbiAgICBpZih0aGlzLmJ1aWxkaW5nRm9ybS52YWxpZCkge1xyXG4gICAgICB0aGlzLmJ1aWxkaW5nTW9kZWwgPSB0aGlzLmJ1aWxkaW5nRm9ybS52YWx1ZTtcclxuICAgICAgdGhpcy5vblN1Ym1pdEV2ZW50LmVtaXQodGhpcy5idWlsZGluZ01vZGVsKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuaXNTaG93RXJyb3JNZXNzYWdlID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldExhYmVscygpIHtcclxuICAgIHJldHVybiBMYWJlbDtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==
