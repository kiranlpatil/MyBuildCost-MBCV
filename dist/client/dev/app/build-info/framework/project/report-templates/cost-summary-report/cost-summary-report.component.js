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
var session_service_1 = require("../../../../../shared/services/session.service");
var constants_1 = require("../../../../../shared/constants");
var CostSummaryReportComponent = (function () {
    function CostSummaryReportComponent() {
        this.currentProjectName = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.CURRENT_PROJECT_NAME);
    }
    CostSummaryReportComponent.prototype.downloadToPdf = function () {
        var doc = new jsPDF();
        var specialElementHandlers = {
            '#editor': function (element, renderer) {
                return true;
            }
        };
        var content = this.content.nativeElement;
        doc.fromHTML(content.innerHTML, 10, 10, {
            'width': 20,
            'elementHandlers': specialElementHandlers
        });
        doc.save('cost-summary-report.pdf');
    };
    __decorate([
        core_1.ViewChild('content'),
        __metadata("design:type", core_1.ElementRef)
    ], CostSummaryReportComponent.prototype, "content", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CostSummaryReportComponent.prototype, "buildingReport", void 0);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L3JlcG9ydC10ZW1wbGF0ZXMvY29zdC1zdW1tYXJ5LXJlcG9ydC9jb3N0LXN1bW1hcnktcmVwb3J0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFzRTtBQUN0RSw2QkFBK0I7QUFDL0Isa0ZBQXFGO0FBQ3JGLDZEQUErRDtBQVMvRDtJQUlFO1FBQ0UsSUFBSSxDQUFDLGtCQUFrQixHQUFHLHVDQUFxQixDQUFDLGVBQWUsQ0FBQywwQkFBYyxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDdkcsQ0FBQztJQUVELGtEQUFhLEdBQWI7UUFDRSxJQUFJLEdBQUcsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQ3RCLElBQUksc0JBQXNCLEdBQUc7WUFDM0IsU0FBUyxFQUFFLFVBQVUsT0FBYSxFQUFFLFFBQWM7Z0JBQ2hELE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZCxDQUFDO1NBQ0YsQ0FBQztRQUVGLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO1FBQ3pDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBQ3RDLE9BQU8sRUFBRSxFQUFFO1lBQ1gsaUJBQWlCLEVBQUUsc0JBQXNCO1NBQzFDLENBQUMsQ0FBQztRQUVILEdBQUcsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBdEJxQjtRQUFyQixnQkFBUyxDQUFDLFNBQVMsQ0FBQztrQ0FBVSxpQkFBVTsrREFBQztJQUNqQztRQUFSLFlBQUssRUFBRTs7c0VBQXFCO0lBRmxCLDBCQUEwQjtRQU50QyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSx5QkFBeUI7WUFDbkMsV0FBVyxFQUFFLG9DQUFvQztTQUNsRCxDQUFDOztPQUVXLDBCQUEwQixDQXdCdEM7SUFBRCxpQ0FBQztDQXhCRCxBQXdCQyxJQUFBO0FBeEJZLGdFQUEwQiIsImZpbGUiOiJhcHAvYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9yZXBvcnQtdGVtcGxhdGVzL2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1zdW1tYXJ5LXJlcG9ydC5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5wdXQsIFZpZXdDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCAqIGFzIGpzUERGIGZyb20gJ2pzcGRmJztcclxuaW1wb3J0IHtTZXNzaW9uU3RvcmFnZVNlcnZpY2V9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9zaGFyZWQvc2VydmljZXMvc2Vzc2lvbi5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7U2Vzc2lvblN0b3JhZ2V9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi9zaGFyZWQvY29uc3RhbnRzXCI7XHJcbi8qLy8vIDxyZWZlcmVuY2UgcGF0aD0nLi4vLi4vLi4vLi4vLi4vLi4vLi4vdG9vbHMvbWFudWFsX3R5cGluZ3MvcHJvamVjdC9qc3BkZi5kLnRzJy8+Ki9cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICdjb3N0LXN1bW1hcnktcmVwb3J0LXBkZicsXHJcbiAgdGVtcGxhdGVVcmw6ICdjb3N0LXN1bW1hcnktcmVwb3J0LmNvbXBvbmVudC5odG1sJyxcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBDb3N0U3VtbWFyeVJlcG9ydENvbXBvbmVudCB7XHJcbiAgQFZpZXdDaGlsZCgnY29udGVudCcpIGNvbnRlbnQ6IEVsZW1lbnRSZWY7XHJcbiAgQElucHV0KCkgYnVpbGRpbmdSZXBvcnQ6IGFueTtcclxuICBjdXJyZW50UHJvamVjdE5hbWU6IHN0cmluZztcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuY3VycmVudFByb2plY3ROYW1lID0gU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfTkFNRSk7XHJcbiAgfVxyXG5cclxuICBkb3dubG9hZFRvUGRmKCkge1xyXG4gICAgbGV0IGRvYyA9IG5ldyBqc1BERigpO1xyXG4gICAgbGV0IHNwZWNpYWxFbGVtZW50SGFuZGxlcnMgPSB7XHJcbiAgICAgICcjZWRpdG9yJzogZnVuY3Rpb24gKGVsZW1lbnQgOiBhbnksIHJlbmRlcmVyIDogYW55KSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbGV0IGNvbnRlbnQgPSB0aGlzLmNvbnRlbnQubmF0aXZlRWxlbWVudDtcclxuICAgIGRvYy5mcm9tSFRNTChjb250ZW50LmlubmVySFRNTCwgMTAsIDEwLCB7XHJcbiAgICAgICd3aWR0aCc6IDIwLFxyXG4gICAgICAnZWxlbWVudEhhbmRsZXJzJzogc3BlY2lhbEVsZW1lbnRIYW5kbGVyc1xyXG4gICAgfSk7XHJcblxyXG4gICAgZG9jLnNhdmUoJ2Nvc3Qtc3VtbWFyeS1yZXBvcnQucGRmJyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==
