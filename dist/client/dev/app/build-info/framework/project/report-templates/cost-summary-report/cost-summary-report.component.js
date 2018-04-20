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
var session_service_1 = require("../../../../../shared/services/session.service");
var constants_1 = require("../../../../../shared/constants");
var CostSummaryReportComponent = (function () {
    function CostSummaryReportComponent() {
        this.generatedDate = new Date();
        this.company_name = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.COMPANY_NAME);
        this.currentProjectName = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.CURRENT_PROJECT_NAME);
    }
    CostSummaryReportComponent.prototype.downloadToPdf = function (reportType) {
        var content;
        switch (reportType) {
            case 'Budgeted and Estimated cost report':
                content = this.budgetedAndEstimated.nativeElement.innerHTML;
                break;
            case 'Budgeted cost report':
                content = this.budgeted.nativeElement.innerHTML;
                break;
            case 'Estimated cost report':
                content = this.estimated.nativeElement.innerHTML;
                break;
        }
        var contentDiv = document.createElement('div');
        contentDiv.innerHTML = content;
        contentDiv.setAttribute('id', 'print-div');
        document.getElementById('tpl-app').style.display = 'none';
        window.document.body.appendChild(contentDiv);
        window.document.close();
        window.print();
        var elem = document.querySelector('#print-div');
        elem.parentNode.removeChild(elem);
        document.getElementById('tpl-app').style.display = 'initial';
    };
    __decorate([
        core_1.ViewChild('budgetedAndEstimated', { read: core_1.ElementRef }),
        __metadata("design:type", core_1.ElementRef)
    ], CostSummaryReportComponent.prototype, "budgetedAndEstimated", void 0);
    __decorate([
        core_1.ViewChild('budgeted', { read: core_1.ElementRef }),
        __metadata("design:type", core_1.ElementRef)
    ], CostSummaryReportComponent.prototype, "budgeted", void 0);
    __decorate([
        core_1.ViewChild('estimated', { read: core_1.ElementRef }),
        __metadata("design:type", core_1.ElementRef)
    ], CostSummaryReportComponent.prototype, "estimated", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CostSummaryReportComponent.prototype, "buildingReport", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CostSummaryReportComponent.prototype, "costingByUnit", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CostSummaryReportComponent.prototype, "costingByArea", void 0);
    CostSummaryReportComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'cost-summary-report-pdf',
            templateUrl: 'cost-summary-report.component.html',
            styleUrls: ['cost-summary-report.component.css'],
        }),
        __metadata("design:paramtypes", [])
    ], CostSummaryReportComponent);
    return CostSummaryReportComponent;
}());
exports.CostSummaryReportComponent = CostSummaryReportComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L3JlcG9ydC10ZW1wbGF0ZXMvY29zdC1zdW1tYXJ5LXJlcG9ydC9jb3N0LXN1bW1hcnktcmVwb3J0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUF3RTtBQUN4RSxrRkFBdUY7QUFDdkYsNkRBQWlFO0FBU2pFO0lBV0U7UUFGQSxrQkFBYSxHQUFTLElBQUksSUFBSSxFQUFFLENBQUM7UUFHL0IsSUFBSSxDQUFDLFlBQVksR0FBRyx1Q0FBcUIsQ0FBQyxlQUFlLENBQUMsMEJBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN2RixJQUFJLENBQUMsa0JBQWtCLEdBQUcsdUNBQXFCLENBQUMsZUFBZSxDQUFDLDBCQUFjLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUN2RyxDQUFDO0lBRUQsa0RBQWEsR0FBYixVQUFjLFVBQWtCO1FBQzlCLElBQUksT0FBWSxDQUFDO1FBQ2pCLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDbkIsS0FBSyxvQ0FBb0M7Z0JBQ3ZDLE9BQU8sR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztnQkFDNUQsS0FBSyxDQUFDO1lBQ1IsS0FBSyxzQkFBc0I7Z0JBQ3pCLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7Z0JBQ2hELEtBQUssQ0FBQztZQUNSLEtBQUssdUJBQXVCO2dCQUMxQixPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDO2dCQUNqRCxLQUFLLENBQUM7UUFDVixDQUFDO1FBQ0QsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUvQyxVQUFVLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztRQUMvQixVQUFVLENBQUMsWUFBWSxDQUFDLElBQUksRUFBQyxXQUFXLENBQUMsQ0FBQztRQUMxQyxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQzFELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM3QyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNmLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztJQUMvRCxDQUFDO0lBdkNzRDtRQUF0RCxnQkFBUyxDQUFDLHNCQUFzQixFQUFFLEVBQUMsSUFBSSxFQUFFLGlCQUFVLEVBQUMsQ0FBQztrQ0FBdUIsaUJBQVU7NEVBQUM7SUFDN0M7UUFBMUMsZ0JBQVMsQ0FBQyxVQUFVLEVBQUUsRUFBQyxJQUFJLEVBQUUsaUJBQVUsRUFBQyxDQUFDO2tDQUFXLGlCQUFVO2dFQUFDO0lBQ3BCO1FBQTNDLGdCQUFTLENBQUMsV0FBVyxFQUFFLEVBQUMsSUFBSSxFQUFFLGlCQUFVLEVBQUMsQ0FBQztrQ0FBWSxpQkFBVTtpRUFBQztJQUN6RDtRQUFSLFlBQUssRUFBRTs7c0VBQXFCO0lBQ3BCO1FBQVIsWUFBSyxFQUFFOztxRUFBb0I7SUFDbkI7UUFBUixZQUFLLEVBQUU7O3FFQUFvQjtJQU5qQiwwQkFBMEI7UUFQdEMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUseUJBQXlCO1lBQ25DLFdBQVcsRUFBRSxvQ0FBb0M7WUFDakQsU0FBUyxFQUFFLENBQUMsbUNBQW1DLENBQUM7U0FDakQsQ0FBQzs7T0FFVywwQkFBMEIsQ0F5Q3RDO0lBQUQsaUNBQUM7Q0F6Q0QsQUF5Q0MsSUFBQTtBQXpDWSxnRUFBMEIiLCJmaWxlIjoiYXBwL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvcmVwb3J0LXRlbXBsYXRlcy9jb3N0LXN1bW1hcnktcmVwb3J0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbnB1dCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFNlc3Npb25TdG9yYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9zZXNzaW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTZXNzaW9uU3RvcmFnZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9jb25zdGFudHMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICBzZWxlY3RvcjogJ2Nvc3Qtc3VtbWFyeS1yZXBvcnQtcGRmJyxcclxuICB0ZW1wbGF0ZVVybDogJ2Nvc3Qtc3VtbWFyeS1yZXBvcnQuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydjb3N0LXN1bW1hcnktcmVwb3J0LmNvbXBvbmVudC5jc3MnXSxcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBDb3N0U3VtbWFyeVJlcG9ydENvbXBvbmVudCB7XHJcbiAgQFZpZXdDaGlsZCgnYnVkZ2V0ZWRBbmRFc3RpbWF0ZWQnLCB7cmVhZDogRWxlbWVudFJlZn0pIGJ1ZGdldGVkQW5kRXN0aW1hdGVkOiBFbGVtZW50UmVmO1xyXG4gIEBWaWV3Q2hpbGQoJ2J1ZGdldGVkJywge3JlYWQ6IEVsZW1lbnRSZWZ9KSBidWRnZXRlZDogRWxlbWVudFJlZjtcclxuICBAVmlld0NoaWxkKCdlc3RpbWF0ZWQnLCB7cmVhZDogRWxlbWVudFJlZn0pIGVzdGltYXRlZDogRWxlbWVudFJlZjtcclxuICBASW5wdXQoKSBidWlsZGluZ1JlcG9ydDogYW55O1xyXG4gIEBJbnB1dCgpIGNvc3RpbmdCeVVuaXQ6IGFueTtcclxuICBASW5wdXQoKSBjb3N0aW5nQnlBcmVhOiBhbnk7XHJcbiAgY3VycmVudFByb2plY3ROYW1lOiBzdHJpbmc7XHJcbiAgY29tcGFueV9uYW1lOiBzdHJpbmc7XHJcbiAgZ2VuZXJhdGVkRGF0ZTogRGF0ZSA9IG5ldyBEYXRlKCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5jb21wYW55X25hbWUgPSBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNPTVBBTllfTkFNRSk7XHJcbiAgICB0aGlzLmN1cnJlbnRQcm9qZWN0TmFtZSA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX05BTUUpO1xyXG4gIH1cclxuXHJcbiAgZG93bmxvYWRUb1BkZihyZXBvcnRUeXBlOiBzdHJpbmcpIHtcclxuICAgIGxldCBjb250ZW50OiBhbnk7XHJcbiAgICBzd2l0Y2ggKHJlcG9ydFR5cGUpIHtcclxuICAgICAgY2FzZSAnQnVkZ2V0ZWQgYW5kIEVzdGltYXRlZCBjb3N0IHJlcG9ydCc6XHJcbiAgICAgICAgY29udGVudCA9IHRoaXMuYnVkZ2V0ZWRBbmRFc3RpbWF0ZWQubmF0aXZlRWxlbWVudC5pbm5lckhUTUw7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ0J1ZGdldGVkIGNvc3QgcmVwb3J0JzpcclxuICAgICAgICBjb250ZW50ID0gdGhpcy5idWRnZXRlZC5uYXRpdmVFbGVtZW50LmlubmVySFRNTDtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnRXN0aW1hdGVkIGNvc3QgcmVwb3J0JzpcclxuICAgICAgICBjb250ZW50ID0gdGhpcy5lc3RpbWF0ZWQubmF0aXZlRWxlbWVudC5pbm5lckhUTUw7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICBsZXQgY29udGVudERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgLy9sZXQgY29udGVudCA9IHRoaXMuQnVkZ2V0ZWRBbmRFc3RpbWF0ZWQubmF0aXZlRWxlbWVudC5pbm5lckhUTUw7XHJcbiAgICBjb250ZW50RGl2LmlubmVySFRNTCA9IGNvbnRlbnQ7XHJcbiAgICBjb250ZW50RGl2LnNldEF0dHJpYnV0ZSgnaWQnLCdwcmludC1kaXYnKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cGwtYXBwJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIHdpbmRvdy5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbnRlbnREaXYpO1xyXG4gICAgd2luZG93LmRvY3VtZW50LmNsb3NlKCk7XHJcbiAgICB3aW5kb3cucHJpbnQoKTtcclxuICAgIHZhciBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3ByaW50LWRpdicpO1xyXG4gICAgZWxlbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW0pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RwbC1hcHAnKS5zdHlsZS5kaXNwbGF5ID0gJ2luaXRpYWwnO1xyXG4gIH1cclxufVxyXG5cclxuIl19
