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
var cost_summary_service_1 = require("../../cost-summary-report/cost-summary.service");
var index_1 = require("../../../../../shared/index");
var CostHeadReportComponent = (function () {
    function CostHeadReportComponent(costSummaryService) {
        this.costSummaryService = costSummaryService;
        console.log('constructor');
    }
    CostHeadReportComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log('costHeadId : ' + this.costHeadId);
        var projectId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_PROJECT_ID);
        var buildingId = index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_BUILDING);
        var url = 'project/' + projectId + '/building/' + buildingId;
        this.costSummaryService.getCostHeadDetails(url, this.costHeadId).subscribe(function (categoryDetails) { return _this.onGetCategoriesSuccess(categoryDetails); }, function (error) { return _this.onGetCategoriesFailure(error); });
    };
    CostHeadReportComponent.prototype.onGetCategoriesSuccess = function (costHeadDetails) {
        this.costHead = costHeadDetails.data;
    };
    CostHeadReportComponent.prototype.onGetCategoriesFailure = function (error) {
        console.log('categoryDetails error : ' + JSON.stringify(error));
    };
    CostHeadReportComponent.prototype.downloadToPdf = function () {
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
        doc.save('cost-head-report.pdf');
    };
    __decorate([
        core_1.ViewChild('content'),
        __metadata("design:type", core_1.ElementRef)
    ], CostHeadReportComponent.prototype, "content", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], CostHeadReportComponent.prototype, "costHeadId", void 0);
    CostHeadReportComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-cost-head-report-pdf',
            templateUrl: 'cost-head-report.component.html'
        }),
        __metadata("design:paramtypes", [cost_summary_service_1.CostSummaryService])
    ], CostHeadReportComponent);
    return CostHeadReportComponent;
}());
exports.CostHeadReportComponent = CostHeadReportComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L3JlcG9ydC10ZW1wbGF0ZXMvY29zdC1oZWFkLXJlcG9ydC9jb3N0LWhlYWQtcmVwb3J0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFnRjtBQUNoRiw2QkFBK0I7QUFDL0IsdUZBQW9GO0FBQ3BGLHFEQUFvRjtBQVFwRjtJQU9FLGlDQUFvQixrQkFBdUM7UUFBdkMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFxQjtRQUN6RCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCwwQ0FBUSxHQUFSO1FBQUEsaUJBU0M7UUFSQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsR0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDN0MsSUFBSSxTQUFTLEdBQUcsNkJBQXFCLENBQUMsZUFBZSxDQUFDLHNCQUFjLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUN6RixJQUFJLFVBQVUsR0FBRyw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3hGLElBQUksR0FBRyxHQUFHLFVBQVUsR0FBQyxTQUFTLEdBQUMsWUFBWSxHQUFDLFVBQVUsQ0FBQztRQUN2RCxJQUFJLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQ3hFLFVBQUEsZUFBZSxJQUFJLE9BQUEsS0FBSSxDQUFDLHNCQUFzQixDQUFDLGVBQWUsQ0FBQyxFQUE1QyxDQUE0QyxFQUMvRCxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsRUFBbEMsQ0FBa0MsQ0FDNUMsQ0FBQztJQUNKLENBQUM7SUFFRCx3REFBc0IsR0FBdEIsVUFBdUIsZUFBcUI7UUFDMUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDO0lBQ3ZDLENBQUM7SUFFRCx3REFBc0IsR0FBdEIsVUFBdUIsS0FBYTtRQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixHQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsK0NBQWEsR0FBYjtRQUNFLElBQUksR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFDdEIsSUFBSSxzQkFBc0IsR0FBRztZQUMzQixTQUFTLEVBQUUsVUFBVSxPQUFhLEVBQUUsUUFBYztnQkFDaEQsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNkLENBQUM7U0FDRixDQUFDO1FBRUYsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7UUFDekMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7WUFDdEMsT0FBTyxFQUFFLEVBQUU7WUFDWCxpQkFBaUIsRUFBRSxzQkFBc0I7U0FDMUMsQ0FBQyxDQUFDO1FBRUgsR0FBRyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUEzQ3FCO1FBQXJCLGdCQUFTLENBQUMsU0FBUyxDQUFDO2tDQUFVLGlCQUFVOzREQUFDO0lBQ2pDO1FBQVIsWUFBSyxFQUFFOzsrREFBb0I7SUFIakIsdUJBQXVCO1FBTm5DLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLHlCQUF5QjtZQUNuQyxXQUFXLEVBQUUsaUNBQWlDO1NBQy9DLENBQUM7eUNBU3lDLHlDQUFrQjtPQVBoRCx1QkFBdUIsQ0E4Q25DO0lBQUQsOEJBQUM7Q0E5Q0QsQUE4Q0MsSUFBQTtBQTlDWSwwREFBdUIiLCJmaWxlIjoiYXBwL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvcmVwb3J0LXRlbXBsYXRlcy9jb3N0LWhlYWQtcmVwb3J0L2Nvc3QtaGVhZC1yZXBvcnQuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbnB1dCwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0ICogYXMganNQREYgZnJvbSAnanNwZGYnO1xyXG5pbXBvcnQgeyBDb3N0U3VtbWFyeVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jb3N0LXN1bW1hcnktcmVwb3J0L2Nvc3Qtc3VtbWFyeS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU2Vzc2lvblN0b3JhZ2UsIFNlc3Npb25TdG9yYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAnYmktY29zdC1oZWFkLXJlcG9ydC1wZGYnLFxyXG4gIHRlbXBsYXRlVXJsOiAnY29zdC1oZWFkLXJlcG9ydC5jb21wb25lbnQuaHRtbCdcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBDb3N0SGVhZFJlcG9ydENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIEBWaWV3Q2hpbGQoJ2NvbnRlbnQnKSBjb250ZW50OiBFbGVtZW50UmVmO1xyXG4gIEBJbnB1dCgpIGNvc3RIZWFkSWQ6IG51bWJlcjtcclxuXHJcbiAgY29zdEhlYWQgOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29zdFN1bW1hcnlTZXJ2aWNlIDogQ29zdFN1bW1hcnlTZXJ2aWNlKSB7XHJcbiAgICBjb25zb2xlLmxvZygnY29uc3RydWN0b3InKTtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgY29uc29sZS5sb2coJ2Nvc3RIZWFkSWQgOiAnK3RoaXMuY29zdEhlYWRJZCk7XHJcbiAgICBsZXQgcHJvamVjdElkID0gU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX1BST0pFQ1RfSUQpO1xyXG4gICAgbGV0IGJ1aWxkaW5nSWQgPSBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfQlVJTERJTkcpO1xyXG4gICAgbGV0IHVybCA9ICdwcm9qZWN0LycrcHJvamVjdElkKycvYnVpbGRpbmcvJytidWlsZGluZ0lkO1xyXG4gICAgdGhpcy5jb3N0U3VtbWFyeVNlcnZpY2UuZ2V0Q29zdEhlYWREZXRhaWxzKHVybCwgdGhpcy5jb3N0SGVhZElkKS5zdWJzY3JpYmUoXHJcbiAgICAgIGNhdGVnb3J5RGV0YWlscyA9PiB0aGlzLm9uR2V0Q2F0ZWdvcmllc1N1Y2Nlc3MoY2F0ZWdvcnlEZXRhaWxzKSxcclxuICAgICAgZXJyb3IgPT4gdGhpcy5vbkdldENhdGVnb3JpZXNGYWlsdXJlKGVycm9yKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIG9uR2V0Q2F0ZWdvcmllc1N1Y2Nlc3MoY29zdEhlYWREZXRhaWxzIDogYW55KSB7XHJcbiAgICB0aGlzLmNvc3RIZWFkID0gY29zdEhlYWREZXRhaWxzLmRhdGE7XHJcbiAgfVxyXG5cclxuICBvbkdldENhdGVnb3JpZXNGYWlsdXJlKGVycm9yIDogRXJyb3IpIHtcclxuICAgIGNvbnNvbGUubG9nKCdjYXRlZ29yeURldGFpbHMgZXJyb3IgOiAnK0pTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgfVxyXG5cclxuICBkb3dubG9hZFRvUGRmKCkge1xyXG4gICAgbGV0IGRvYyA9IG5ldyBqc1BERigpO1xyXG4gICAgbGV0IHNwZWNpYWxFbGVtZW50SGFuZGxlcnMgPSB7XHJcbiAgICAgICcjZWRpdG9yJzogZnVuY3Rpb24gKGVsZW1lbnQgOiBhbnksIHJlbmRlcmVyIDogYW55KSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbGV0IGNvbnRlbnQgPSB0aGlzLmNvbnRlbnQubmF0aXZlRWxlbWVudDtcclxuICAgIGRvYy5mcm9tSFRNTChjb250ZW50LmlubmVySFRNTCwgMTAsIDEwLCB7XHJcbiAgICAgICd3aWR0aCc6IDIwLFxyXG4gICAgICAnZWxlbWVudEhhbmRsZXJzJzogc3BlY2lhbEVsZW1lbnRIYW5kbGVyc1xyXG4gICAgfSk7XHJcblxyXG4gICAgZG9jLnNhdmUoJ2Nvc3QtaGVhZC1yZXBvcnQucGRmJyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==
