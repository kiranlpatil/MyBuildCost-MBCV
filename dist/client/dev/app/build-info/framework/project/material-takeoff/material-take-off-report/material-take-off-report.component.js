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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L21hdGVyaWFsLXRha2VvZmYvbWF0ZXJpYWwtdGFrZS1vZmYtcmVwb3J0L21hdGVyaWFsLXRha2Utb2ZmLXJlcG9ydC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBaUQ7QUFDakQsNkRBQTBFO0FBVTFFO0lBUEE7UUFVRSxtQkFBYyxHQUFhLEtBQUssQ0FBQztJQWtCbkMsQ0FBQztJQWJDLG1FQUEwQixHQUExQjtRQUNFLE1BQU0sQ0FBQyxtQ0FBdUIsQ0FBQztJQUNqQyxDQUFDO0lBRUQsdURBQWMsR0FBZCxVQUFlLHNCQUErQixFQUFFLGdCQUF5QjtRQUN2RSxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsY0FBYyxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLHNCQUFzQixJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ3RILElBQUksQ0FBQyxTQUFTLEdBQUcsc0JBQXNCLENBQUM7WUFDeEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQztZQUNwQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUM3QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztRQUM5QixDQUFDO0lBQ0gsQ0FBQztJQWxCUTtRQUFSLFlBQUssRUFBRTs7aUZBQTZCO0lBRjFCLDhCQUE4QjtRQVAxQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSw2QkFBNkI7WUFDdkMsV0FBVyxFQUFFLHlDQUF5QztZQUN0RCxTQUFTLEVBQUUsQ0FBQyw4QkFBOEIsQ0FBQztTQUM1QyxDQUFDO09BRVcsOEJBQThCLENBcUIxQztJQUFELHFDQUFDO0NBckJELEFBcUJDLElBQUE7QUFyQlksd0VBQThCIiwiZmlsZSI6ImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L21hdGVyaWFsLXRha2VvZmYvbWF0ZXJpYWwtdGFrZS1vZmYtcmVwb3J0L21hdGVyaWFsLXRha2Utb2ZmLXJlcG9ydC5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE1hdGVyaWFsVGFrZU9mZkVsZW1lbnRzIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICBzZWxlY3RvcjogJ2JpLW1hdGVyaWFsLXRha2Utb2ZmLXJlcG9ydCcsXHJcbiAgdGVtcGxhdGVVcmw6ICdtYXRlcmlhbC10YWtlLW9mZi1yZXBvcnQuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydtYXRlcmlhbC10YWtlLW9mZi1yZXBvcnQuY3NzJ10sXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxUYWtlT2ZmUmVwb3J0Q29tcG9uZW50ICB7XHJcblxyXG4gIEBJbnB1dCgpIG1hdGVyaWFsVGFrZU9mZlJlcG9ydCA6IGFueTtcclxuICB2aWV3U3ViQ29udGVudCA6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBoZWFkZXJJbmRleCA6IG51bWJlcjtcclxuICBkYXRhSW5kZXggOiBudW1iZXI7XHJcblxyXG5cclxuICBnZXRNYXRlcmlhbFRha2VPZmZFbGVtZW50cygpIHtcclxuICAgIHJldHVybiBNYXRlcmlhbFRha2VPZmZFbGVtZW50cztcclxuICB9XHJcblxyXG4gIHNob3dTdWJDb250ZW50KHNlY29uZGFyeVZpZXdEYXRhSW5kZXggOiBudW1iZXIsIHRhYmxlSGVhZGVySW5kZXggOiBudW1iZXIpIHtcclxuICAgIGlmKHRoaXMudmlld1N1YkNvbnRlbnQgIT09IHRydWUgfHwgdGhpcy5kYXRhSW5kZXggIT09IHNlY29uZGFyeVZpZXdEYXRhSW5kZXggfHwgdGhpcy5oZWFkZXJJbmRleCAhPT0gdGFibGVIZWFkZXJJbmRleCkge1xyXG4gICAgICB0aGlzLmRhdGFJbmRleCA9IHNlY29uZGFyeVZpZXdEYXRhSW5kZXg7XHJcbiAgICAgIHRoaXMuaGVhZGVySW5kZXggPSB0YWJsZUhlYWRlckluZGV4O1xyXG4gICAgICB0aGlzLnZpZXdTdWJDb250ZW50ID0gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudmlld1N1YkNvbnRlbnQgPSBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19
