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
var jsPDF = require("jspdf");
var CostSummaryReportComponent = (function () {
    function CostSummaryReportComponent() {
    }
    CostSummaryReportComponent.prototype.downloadToPdf = function () {
        var doc = new jsPDF();
        var specialElementHandlers = {
            '#editor': function (element, renderer) {
                return true;
            }
        };
        var costSummary = this.costSummary.nativeElement;
        doc.fromHTML(costSummary.innerHTML, 10, 10, {
            'width': 20,
            'elementHandlers': specialElementHandlers
        });
        doc.save('cost-summary-report.pdf');
    };
    __decorate([
        core_1.ViewChild('costSummary'),
        __metadata("design:type", core_1.ElementRef)
    ], CostSummaryReportComponent.prototype, "costSummary", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CostSummaryReportComponent.prototype, "buildingsReport", void 0);
    CostSummaryReportComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'cost-summary-report-pdf',
            templateUrl: 'cost-summary-report.component.html',
        }),
        __metadata("design:paramtypes", [])
    ], CostSummaryReportComponent);
    return CostSummaryReportComponent;
}());
exports.CostSummaryReportComponent = CostSummaryReportComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L3JlcG9ydC10ZW1wbGF0ZXMvY29zdC1zdW1tYXJ5LXJlcG9ydC9jb3N0LXN1bW1hcnktcmVwb3J0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFzRTtBQUN0RSw2QkFBK0I7QUFTL0I7SUFHRTtJQUNBLENBQUM7SUFHRCxrREFBYSxHQUFiO1FBQ0UsSUFBSSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUN0QixJQUFJLHNCQUFzQixHQUFHO1lBQzNCLFNBQVMsRUFBRSxVQUFVLE9BQWEsRUFBRSxRQUFjO2dCQUNoRCxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2QsQ0FBQztTQUNGLENBQUM7UUFFRixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQztRQUNqRCxHQUFHLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtZQUMxQyxPQUFPLEVBQUUsRUFBRTtZQUNYLGlCQUFpQixFQUFFLHNCQUFzQjtTQUMxQyxDQUFDLENBQUM7UUFFSCxHQUFHLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDdEMsQ0FBQztJQXJCeUI7UUFBekIsZ0JBQVMsQ0FBQyxhQUFhLENBQUM7a0NBQWMsaUJBQVU7bUVBQUM7SUFDekM7UUFBUixZQUFLLEVBQUU7O3VFQUFzQjtJQUZuQiwwQkFBMEI7UUFOdEMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUseUJBQXlCO1lBQ25DLFdBQVcsRUFBRSxvQ0FBb0M7U0FDbEQsQ0FBQzs7T0FFVywwQkFBMEIsQ0F1QnRDO0lBQUQsaUNBQUM7Q0F2QkQsQUF1QkMsSUFBQTtBQXZCWSxnRUFBMEIiLCJmaWxlIjoiYXBwL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvcmVwb3J0LXRlbXBsYXRlcy9jb3N0LXN1bW1hcnktcmVwb3J0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIEVsZW1lbnRSZWYsIElucHV0LCBWaWV3Q2hpbGR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgKiBhcyBqc1BERiBmcm9tICdqc3BkZic7XHJcbi8qLy8vIDxyZWZlcmVuY2UgcGF0aD0nLi4vLi4vLi4vLi4vLi4vLi4vLi4vdG9vbHMvbWFudWFsX3R5cGluZ3MvcHJvamVjdC9qc3BkZi5kLnRzJy8+Ki9cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICdjb3N0LXN1bW1hcnktcmVwb3J0LXBkZicsXHJcbiAgdGVtcGxhdGVVcmw6ICdjb3N0LXN1bW1hcnktcmVwb3J0LmNvbXBvbmVudC5odG1sJyxcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBDb3N0U3VtbWFyeVJlcG9ydENvbXBvbmVudCB7XHJcbiAgQFZpZXdDaGlsZCgnY29zdFN1bW1hcnknKSBjb3N0U3VtbWFyeTogRWxlbWVudFJlZjtcclxuICBASW5wdXQoKSBidWlsZGluZ3NSZXBvcnQ6IGFueTtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICB9XHJcblxyXG5cclxuICBkb3dubG9hZFRvUGRmKCkge1xyXG4gICAgbGV0IGRvYyA9IG5ldyBqc1BERigpO1xyXG4gICAgbGV0IHNwZWNpYWxFbGVtZW50SGFuZGxlcnMgPSB7XHJcbiAgICAgICcjZWRpdG9yJzogZnVuY3Rpb24gKGVsZW1lbnQgOiBhbnksIHJlbmRlcmVyIDogYW55KSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbGV0IGNvc3RTdW1tYXJ5ID0gdGhpcy5jb3N0U3VtbWFyeS5uYXRpdmVFbGVtZW50O1xyXG4gICAgZG9jLmZyb21IVE1MKGNvc3RTdW1tYXJ5LmlubmVySFRNTCwgMTAsIDEwLCB7XHJcbiAgICAgICd3aWR0aCc6IDIwLFxyXG4gICAgICAnZWxlbWVudEhhbmRsZXJzJzogc3BlY2lhbEVsZW1lbnRIYW5kbGVyc1xyXG4gICAgfSk7XHJcblxyXG4gICAgZG9jLnNhdmUoJ2Nvc3Qtc3VtbWFyeS1yZXBvcnQucGRmJyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==
