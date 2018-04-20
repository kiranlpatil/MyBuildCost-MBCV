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
var constants_1 = require("../../../../../shared/constants");
var MaterialTakeOffReportComponent = (function () {
    function MaterialTakeOffReportComponent() {
        this.viewSubContent = false;
    }
    MaterialTakeOffReportComponent.prototype.getMaterialTakeOffElements = function () {
        return constants_1.MaterialTakeOffElements;
    };
    MaterialTakeOffReportComponent.prototype.showSubContent = function (secondaryViewDataIndex, tableHeaderIndex) {
        if (this.viewSubContent !== true || this.dataIndex !== secondaryViewDataIndex || this.headerIndex !== tableHeaderIndex) {
            this.dataIndex = secondaryViewDataIndex;
            this.headerIndex = tableHeaderIndex;
            this.viewSubContent = true;
        }
        else {
            this.viewSubContent = false;
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MaterialTakeOffReportComponent.prototype, "materialTakeOffReport", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], MaterialTakeOffReportComponent.prototype, "building", void 0);
    MaterialTakeOffReportComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-material-take-off-report',
            templateUrl: 'material-take-off-report.component.html',
            styleUrls: ['material-take-off-report.css'],
        })
    ], MaterialTakeOffReportComponent);
    return MaterialTakeOffReportComponent;
}());
exports.MaterialTakeOffReportComponent = MaterialTakeOffReportComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L21hdGVyaWFsLXRha2VvZmYvbWF0ZXJpYWwtdGFrZS1vZmYtcmVwb3J0L21hdGVyaWFsLXRha2Utb2ZmLXJlcG9ydC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBaUQ7QUFDakQsNkRBQTBFO0FBVTFFO0lBUEE7UUFXRSxtQkFBYyxHQUFhLEtBQUssQ0FBQztJQWtCbkMsQ0FBQztJQWJDLG1FQUEwQixHQUExQjtRQUNFLE1BQU0sQ0FBQyxtQ0FBdUIsQ0FBQztJQUNqQyxDQUFDO0lBRUQsdURBQWMsR0FBZCxVQUFlLHNCQUErQixFQUFFLGdCQUF5QjtRQUN2RSxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsY0FBYyxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLHNCQUFzQixJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ3RILElBQUksQ0FBQyxTQUFTLEdBQUcsc0JBQXNCLENBQUM7WUFDeEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQztZQUNwQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUM3QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztRQUM5QixDQUFDO0lBQ0gsQ0FBQztJQW5CUTtRQUFSLFlBQUssRUFBRTs7aUZBQTZCO0lBQzVCO1FBQVIsWUFBSyxFQUFFOztvRUFBbUI7SUFIaEIsOEJBQThCO1FBUDFDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLDZCQUE2QjtZQUN2QyxXQUFXLEVBQUUseUNBQXlDO1lBQ3RELFNBQVMsRUFBRSxDQUFDLDhCQUE4QixDQUFDO1NBQzVDLENBQUM7T0FFVyw4QkFBOEIsQ0FzQjFDO0lBQUQscUNBQUM7Q0F0QkQsQUFzQkMsSUFBQTtBQXRCWSx3RUFBOEIiLCJmaWxlIjoiYXBwL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvbWF0ZXJpYWwtdGFrZW9mZi9tYXRlcmlhbC10YWtlLW9mZi1yZXBvcnQvbWF0ZXJpYWwtdGFrZS1vZmYtcmVwb3J0LmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTWF0ZXJpYWxUYWtlT2ZmRWxlbWVudHMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zaGFyZWQvY29uc3RhbnRzJztcclxuXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAnYmktbWF0ZXJpYWwtdGFrZS1vZmYtcmVwb3J0JyxcclxuICB0ZW1wbGF0ZVVybDogJ21hdGVyaWFsLXRha2Utb2ZmLXJlcG9ydC5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJ21hdGVyaWFsLXRha2Utb2ZmLXJlcG9ydC5jc3MnXSxcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBNYXRlcmlhbFRha2VPZmZSZXBvcnRDb21wb25lbnQgIHtcclxuXHJcbiAgQElucHV0KCkgbWF0ZXJpYWxUYWtlT2ZmUmVwb3J0IDogYW55O1xyXG4gIEBJbnB1dCgpIGJ1aWxkaW5nIDogc3RyaW5nO1xyXG4gIHZpZXdTdWJDb250ZW50IDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGhlYWRlckluZGV4IDogbnVtYmVyO1xyXG4gIGRhdGFJbmRleCA6IG51bWJlcjtcclxuXHJcblxyXG4gIGdldE1hdGVyaWFsVGFrZU9mZkVsZW1lbnRzKCkge1xyXG4gICAgcmV0dXJuIE1hdGVyaWFsVGFrZU9mZkVsZW1lbnRzO1xyXG4gIH1cclxuXHJcbiAgc2hvd1N1YkNvbnRlbnQoc2Vjb25kYXJ5Vmlld0RhdGFJbmRleCA6IG51bWJlciwgdGFibGVIZWFkZXJJbmRleCA6IG51bWJlcikge1xyXG4gICAgaWYodGhpcy52aWV3U3ViQ29udGVudCAhPT0gdHJ1ZSB8fCB0aGlzLmRhdGFJbmRleCAhPT0gc2Vjb25kYXJ5Vmlld0RhdGFJbmRleCB8fCB0aGlzLmhlYWRlckluZGV4ICE9PSB0YWJsZUhlYWRlckluZGV4KSB7XHJcbiAgICAgIHRoaXMuZGF0YUluZGV4ID0gc2Vjb25kYXJ5Vmlld0RhdGFJbmRleDtcclxuICAgICAgdGhpcy5oZWFkZXJJbmRleCA9IHRhYmxlSGVhZGVySW5kZXg7XHJcbiAgICAgIHRoaXMudmlld1N1YkNvbnRlbnQgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy52aWV3U3ViQ29udGVudCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=
