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
var session_service_1 = require("../../../../../shared/services/session.service");
var CommonAmenitiesReportComponent = (function () {
    function CommonAmenitiesReportComponent() {
        this.isBudgeted = false;
        this.isEstimated = false;
        this.generatedDate = new Date();
        this.company_name = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.COMPANY_NAME);
        this.currentProjectName = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.CURRENT_PROJECT_NAME);
    }
    CommonAmenitiesReportComponent.prototype.downloadToPdf = function (reportType) {
        var _this = this;
        switch (reportType) {
            case 'Budgeted and Estimated cost report':
                this.isBudgeted = true;
                this.isEstimated = true;
                this.costReportFor = 'Budgeted & Estimated';
                break;
            case 'Budgeted cost report':
                this.isBudgeted = true;
                this.isEstimated = false;
                this.costReportFor = 'Budgeted';
                break;
            case 'Estimated cost report':
                this.isEstimated = true;
                this.isBudgeted = false;
                this.costReportFor = 'Estimated';
                break;
            default:
                this.isBudgeted = false;
                this.isEstimated = false;
        }
        setTimeout(function () {
            _this.print();
        }, 100);
    };
    CommonAmenitiesReportComponent.prototype.print = function () {
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
        core_1.ViewChild('content'),
        __metadata("design:type", core_1.ElementRef)
    ], CommonAmenitiesReportComponent.prototype, "content", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CommonAmenitiesReportComponent.prototype, "amenitiesReport", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CommonAmenitiesReportComponent.prototype, "costingByUnit", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CommonAmenitiesReportComponent.prototype, "costingByArea", void 0);
    CommonAmenitiesReportComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'common-amenities-report-pdf',
            templateUrl: 'common-amenities-report.component.html',
            styleUrls: ['common-amenities-report.component.css']
        }),
        __metadata("design:paramtypes", [])
    ], CommonAmenitiesReportComponent);
    return CommonAmenitiesReportComponent;
}());
exports.CommonAmenitiesReportComponent = CommonAmenitiesReportComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L3JlcG9ydC10ZW1wbGF0ZXMvY29tbW9uLWFtZW5pdGllcy1yZXBvcnQvY29tbW9uLWFtZW5pdGllcy1yZXBvcnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXNFO0FBRXRFLDZEQUErRDtBQUMvRCxrRkFBcUY7QUFTckY7SUFZRTtRQVBBLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFDNUIsZ0JBQVcsR0FBWSxLQUFLLENBQUM7UUFDN0Isa0JBQWEsR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO1FBTS9CLElBQUksQ0FBQyxZQUFZLEdBQUcsdUNBQXFCLENBQUMsZUFBZSxDQUFDLDBCQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdkYsSUFBSSxDQUFDLGtCQUFrQixHQUFHLHVDQUFxQixDQUFDLGVBQWUsQ0FBQywwQkFBYyxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDdkcsQ0FBQztJQUVELHNEQUFhLEdBQWIsVUFBYyxVQUFrQjtRQUFoQyxpQkF3QkM7UUF2QkMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNuQixLQUFLLG9DQUFvQztnQkFDdkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO2dCQUN4QixJQUFJLENBQUMsYUFBYSxHQUFHLHNCQUFzQixDQUFDO2dCQUM1QyxLQUFLLENBQUM7WUFDUixLQUFLLHNCQUFzQjtnQkFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO2dCQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLFVBQVUsQ0FBQztnQkFDaEMsS0FBSyxDQUFDO1lBQ1IsS0FBSyx1QkFBdUI7Z0JBQzFCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO2dCQUN4QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztnQkFDeEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUM7Z0JBQ2pDLEtBQUssQ0FBQztZQUNSO2dCQUNFLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO2dCQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUM3QixDQUFDO1FBQ0QsVUFBVSxDQUFDO1lBQ1QsS0FBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2YsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ1YsQ0FBQztJQUVELDhDQUFLLEdBQUw7UUFDRSxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9DLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztRQUNuRCxVQUFVLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztRQUMvQixVQUFVLENBQUMsWUFBWSxDQUFDLElBQUksRUFBQyxXQUFXLENBQUMsQ0FBQztRQUMxQyxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQzFELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM3QyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNmLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztJQUMvRCxDQUFDO0lBdERtQjtRQUFyQixnQkFBUyxDQUFDLFNBQVMsQ0FBQztrQ0FBVSxpQkFBVTttRUFBQztJQUNqQztRQUFSLFlBQUssRUFBRTs7MkVBQXNCO0lBQ3JCO1FBQVIsWUFBSyxFQUFFOzt5RUFBb0I7SUFDbkI7UUFBUixZQUFLLEVBQUU7O3lFQUFvQjtJQUpmLDhCQUE4QjtRQVAxQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSw2QkFBNkI7WUFDdkMsV0FBVyxFQUFFLHdDQUF3QztZQUNyRCxTQUFTLEVBQUUsQ0FBQyx1Q0FBdUMsQ0FBQztTQUNyRCxDQUFDOztPQUVXLDhCQUE4QixDQXdEMUM7SUFBRCxxQ0FBQztDQXhERCxBQXdEQyxJQUFBO0FBeERZLHdFQUE4QiIsImZpbGUiOiJhcHAvYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9yZXBvcnQtdGVtcGxhdGVzL2NvbW1vbi1hbWVuaXRpZXMtcmVwb3J0L2NvbW1vbi1hbWVuaXRpZXMtcmVwb3J0LmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBJbnB1dCwgVmlld0NoaWxkfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0ICogYXMganNQREYgZnJvbSAnanNwZGYnO1xyXG5pbXBvcnQge1Nlc3Npb25TdG9yYWdlfSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vc2hhcmVkL2NvbnN0YW50c1wiO1xyXG5pbXBvcnQge1Nlc3Npb25TdG9yYWdlU2VydmljZX0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3NoYXJlZC9zZXJ2aWNlcy9zZXNzaW9uLnNlcnZpY2VcIjtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICdjb21tb24tYW1lbml0aWVzLXJlcG9ydC1wZGYnLFxyXG4gIHRlbXBsYXRlVXJsOiAnY29tbW9uLWFtZW5pdGllcy1yZXBvcnQuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydjb21tb24tYW1lbml0aWVzLXJlcG9ydC5jb21wb25lbnQuY3NzJ11cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21tb25BbWVuaXRpZXNSZXBvcnRDb21wb25lbnQge1xyXG5AVmlld0NoaWxkKCdjb250ZW50JykgY29udGVudDogRWxlbWVudFJlZjtcclxuQElucHV0KCkgYW1lbml0aWVzUmVwb3J0OiBhbnk7XHJcbkBJbnB1dCgpIGNvc3RpbmdCeVVuaXQ6IGFueTtcclxuQElucHV0KCkgY29zdGluZ0J5QXJlYTogYW55O1xyXG4gIGlzQnVkZ2V0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBpc0VzdGltYXRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGdlbmVyYXRlZERhdGU6IERhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gIGNvc3RSZXBvcnRGb3I6IHN0cmluZztcclxuICBjdXJyZW50UHJvamVjdE5hbWU6IHN0cmluZztcclxuICBjb21wYW55X25hbWU6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmNvbXBhbnlfbmFtZSA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ09NUEFOWV9OQU1FKTtcclxuICAgIHRoaXMuY3VycmVudFByb2plY3ROYW1lID0gU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfTkFNRSk7XHJcbiAgfVxyXG5cclxuICBkb3dubG9hZFRvUGRmKHJlcG9ydFR5cGU6IHN0cmluZykge1xyXG4gICAgc3dpdGNoIChyZXBvcnRUeXBlKSB7XHJcbiAgICAgIGNhc2UgJ0J1ZGdldGVkIGFuZCBFc3RpbWF0ZWQgY29zdCByZXBvcnQnOlxyXG4gICAgICAgIHRoaXMuaXNCdWRnZXRlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5pc0VzdGltYXRlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5jb3N0UmVwb3J0Rm9yID0gJ0J1ZGdldGVkICYgRXN0aW1hdGVkJztcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnQnVkZ2V0ZWQgY29zdCByZXBvcnQnOlxyXG4gICAgICAgIHRoaXMuaXNCdWRnZXRlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5pc0VzdGltYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY29zdFJlcG9ydEZvciA9ICdCdWRnZXRlZCc7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ0VzdGltYXRlZCBjb3N0IHJlcG9ydCc6XHJcbiAgICAgICAgdGhpcy5pc0VzdGltYXRlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5pc0J1ZGdldGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jb3N0UmVwb3J0Rm9yID0gJ0VzdGltYXRlZCc7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgdGhpcy5pc0J1ZGdldGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pc0VzdGltYXRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgc2V0VGltZW91dCgoKT0+IHtcclxuICAgICAgdGhpcy5wcmludCgpO1xyXG4gICAgfSwgMTAwKTtcclxuICB9XHJcblxyXG4gIHByaW50KCkge1xyXG4gICAgbGV0IGNvbnRlbnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGxldCBjb250ZW50ID0gdGhpcy5jb250ZW50Lm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MO1xyXG4gICAgY29udGVudERpdi5pbm5lckhUTUwgPSBjb250ZW50O1xyXG4gICAgY29udGVudERpdi5zZXRBdHRyaWJ1dGUoJ2lkJywncHJpbnQtZGl2Jyk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHBsLWFwcCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICB3aW5kb3cuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjb250ZW50RGl2KTtcclxuICAgIHdpbmRvdy5kb2N1bWVudC5jbG9zZSgpO1xyXG4gICAgd2luZG93LnByaW50KCk7XHJcbiAgICB2YXIgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwcmludC1kaXYnKTtcclxuICAgIGVsZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cGwtYXBwJykuc3R5bGUuZGlzcGxheSA9ICdpbml0aWFsJztcclxuICB9XHJcbn1cclxuIl19
