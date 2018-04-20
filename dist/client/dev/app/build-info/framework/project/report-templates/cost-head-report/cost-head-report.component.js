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
var index_1 = require("../../../../../shared/index");
var CostHeadReportComponent = (function () {
    function CostHeadReportComponent() {
        this.generatedDate = new Date();
    }
    CostHeadReportComponent.prototype.ngOnInit = function () {
        this.projectName = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_NAME);
        this.buildingName = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_BUILDING_NAME);
        this.comapnyName = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.COMPANY_NAME);
        this.costHeadName = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_COST_HEAD_NAME);
    };
    CostHeadReportComponent.prototype.downloadToPDF = function () {
        var contentDiv = document.createElement('div');
        var content = this.content.nativeElement.innerHTML;
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
        core_1.ViewChild('content', { read: core_1.ElementRef }),
        __metadata("design:type", core_1.ElementRef)
    ], CostHeadReportComponent.prototype, "content", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CostHeadReportComponent.prototype, "categoryDetails", void 0);
    CostHeadReportComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-cost-head-report-pdf',
            templateUrl: 'cost-head-report.component.html'
        })
    ], CostHeadReportComponent);
    return CostHeadReportComponent;
}());
exports.CostHeadReportComponent = CostHeadReportComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L3JlcG9ydC10ZW1wbGF0ZXMvY29zdC1oZWFkLXJlcG9ydC9jb3N0LWhlYWQtcmVwb3J0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFnRjtBQUNoRixxREFBb0Y7QUFRcEY7SUFOQTtRQWdCRSxrQkFBYSxHQUFTLElBQUksSUFBSSxFQUFFLENBQUM7SUFzQm5DLENBQUM7SUFwQkMsMENBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxXQUFXLEdBQUcsNkJBQXFCLENBQUMsZUFBZSxDQUFDLHNCQUFjLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUM5RixJQUFJLENBQUMsWUFBWSxHQUFHLDZCQUFxQixDQUFDLGVBQWUsQ0FBQyxzQkFBYyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDaEcsSUFBSSxDQUFDLFdBQVcsR0FBRyw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN0RixJQUFJLENBQUMsWUFBWSxHQUFHLDZCQUFxQixDQUFDLGVBQWUsQ0FBQyxzQkFBYyxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDbkcsQ0FBQztJQUVELCtDQUFhLEdBQWI7UUFDRSxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9DLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztRQUNuRCxVQUFVLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztRQUMvQixVQUFVLENBQUMsWUFBWSxDQUFDLElBQUksRUFBQyxXQUFXLENBQUMsQ0FBQztRQUMxQyxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQzFELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM3QyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNmLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztJQUMvRCxDQUFDO0lBN0J5QztRQUF6QyxnQkFBUyxDQUFDLFNBQVMsRUFBRSxFQUFDLElBQUksRUFBRSxpQkFBVSxFQUFDLENBQUM7a0NBQVUsaUJBQVU7NERBQUM7SUFDckQ7UUFBUixZQUFLLEVBQUU7O29FQUFzQjtJQUhuQix1QkFBdUI7UUFObkMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUseUJBQXlCO1lBQ25DLFdBQVcsRUFBRSxpQ0FBaUM7U0FDL0MsQ0FBQztPQUVXLHVCQUF1QixDQWdDbkM7SUFBRCw4QkFBQztDQWhDRCxBQWdDQyxJQUFBO0FBaENZLDBEQUF1QiIsImZpbGUiOiJhcHAvYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9yZXBvcnQtdGVtcGxhdGVzL2Nvc3QtaGVhZC1yZXBvcnQvY29zdC1oZWFkLXJlcG9ydC5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIElucHV0LCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTZXNzaW9uU3RvcmFnZSwgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2hhcmVkL2luZGV4JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICdiaS1jb3N0LWhlYWQtcmVwb3J0LXBkZicsXHJcbiAgdGVtcGxhdGVVcmw6ICdjb3N0LWhlYWQtcmVwb3J0LmNvbXBvbmVudC5odG1sJ1xyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIENvc3RIZWFkUmVwb3J0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0ICB7XHJcblxyXG4gIEBWaWV3Q2hpbGQoJ2NvbnRlbnQnLCB7cmVhZDogRWxlbWVudFJlZn0pIGNvbnRlbnQ6IEVsZW1lbnRSZWY7XHJcbiAgQElucHV0KCkgY2F0ZWdvcnlEZXRhaWxzOiBhbnk7XHJcblxyXG4gIGNvc3RIZWFkIDogYW55O1xyXG4gIHByb2plY3ROYW1lIDogc3RyaW5nO1xyXG4gIGJ1aWxkaW5nTmFtZSA6IHN0cmluZztcclxuICBjb21hcG55TmFtZSA6IHN0cmluZztcclxuICBjb3N0SGVhZE5hbWUgOiBzdHJpbmc7XHJcbiAgZ2VuZXJhdGVkRGF0ZTogRGF0ZSA9IG5ldyBEYXRlKCk7XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5wcm9qZWN0TmFtZSA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9QUk9KRUNUX05BTUUpO1xyXG4gICAgdGhpcy5idWlsZGluZ05hbWUgPSBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfQlVJTERJTkdfTkFNRSk7XHJcbiAgICB0aGlzLmNvbWFwbnlOYW1lID0gU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DT01QQU5ZX05BTUUpO1xyXG4gICAgdGhpcy5jb3N0SGVhZE5hbWUgPSBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfQ09TVF9IRUFEX05BTUUpO1xyXG4gIH1cclxuXHJcbiAgZG93bmxvYWRUb1BERigpIHtcclxuICAgIGxldCBjb250ZW50RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBsZXQgY29udGVudCA9IHRoaXMuY29udGVudC5uYXRpdmVFbGVtZW50LmlubmVySFRNTDtcclxuICAgIGNvbnRlbnREaXYuaW5uZXJIVE1MID0gY29udGVudDtcclxuICAgIGNvbnRlbnREaXYuc2V0QXR0cmlidXRlKCdpZCcsJ3ByaW50LWRpdicpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RwbC1hcHAnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgd2luZG93LmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGVudERpdik7XHJcbiAgICB3aW5kb3cuZG9jdW1lbnQuY2xvc2UoKTtcclxuICAgIHdpbmRvdy5wcmludCgpO1xyXG4gICAgdmFyIGVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcHJpbnQtZGl2Jyk7XHJcbiAgICBlbGVtLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHBsLWFwcCcpLnN0eWxlLmRpc3BsYXkgPSAnaW5pdGlhbCc7XHJcbiAgfVxyXG59XHJcbiJdfQ==
