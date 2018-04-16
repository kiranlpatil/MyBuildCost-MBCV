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
var constants_1 = require("../../../../../../shared/constants");
var lodsh = require("lodash");
var index_1 = require("../../../../../../shared/index");
var cost_summary_service_1 = require("../../cost-summary.service");
var loaders_service_1 = require("../../../../../../shared/loader/loaders.service");
var QuantityDetailsComponent = (function () {
    function QuantityDetailsComponent(costSummaryService, messageService, loaderService) {
        this.costSummaryService = costSummaryService;
        this.messageService = messageService;
        this.loaderService = loaderService;
        this.categoriesTotalAmount = new core_1.EventEmitter();
        this.refreshWorkItemList = new core_1.EventEmitter();
        this.quantityItemsArray = {};
        this.showQuantityTab = null;
        this.showWorkItemTabName = null;
    }
    QuantityDetailsComponent.prototype.ngOnInit = function () {
        this.workItemData = this.workItem;
    };
    QuantityDetailsComponent.prototype.getQuantity = function (quantityDetail) {
        if (this.showWorkItemTabName !== constants_1.Label.WORKITEM_QUANTITY_TAB) {
            if (quantityDetail.quantityItems.length !== 0) {
                this.quantityItemsArray = lodsh.cloneDeep(quantityDetail.quantityItems);
                this.keyQuantity = quantityDetail.name;
            }
            else {
                this.quantityItemsArray = [];
                quantityDetail.name = this.keyQuantity;
            }
            this.showWorkItemTabName = constants_1.Label.WORKITEM_QUANTITY_TAB;
        }
        else {
            this.showWorkItemTabName = null;
        }
    };
    QuantityDetailsComponent.prototype.setQuantityNameForDelete = function (quantityName) {
        this.quantityName = quantityName;
    };
    QuantityDetailsComponent.prototype.deleteQuantityDetailsByName = function () {
        var _this = this;
        if (this.quantityName !== null && this.quantityName !== undefined && this.quantityName !== '') {
            this.loaderService.start();
            var costHeadId = parseInt(index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_COST_HEAD_ID));
            this.costSummaryService.deleteQuantityDetailsByName(this.baseUrl, costHeadId, this.categoryRateAnalysisId, this.workItemRateAnalysisId, this.quantityName).subscribe(function (success) { return _this.onDeleteQuantityDetailsByNameSuccess(success); }, function (error) { return _this.onDeleteQuantityDetailsByNameFailure(error); });
        }
        else {
            var message = new index_1.Message();
            message.isError = false;
            message.custom_message = constants_1.Messages.MSG_ERROR_VALIDATION_QUANTITY_NAME_REQUIRED;
            this.messageService.message(message);
        }
    };
    QuantityDetailsComponent.prototype.onDeleteQuantityDetailsByNameSuccess = function (success) {
        for (var quantityIndex in this.quantityDetails) {
            if (this.quantityDetails[quantityIndex].name === this.quantityName) {
                this.quantityDetails.splice(parseInt(quantityIndex), 1);
                break;
            }
        }
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = constants_1.Messages.MSG_SUCCESS_DELETE_QUANTITY_DETAILS;
        this.messageService.message(message);
        this.refreshWorkItemList.emit();
        this.loaderService.stop();
    };
    QuantityDetailsComponent.prototype.onDeleteQuantityDetailsByNameFailure = function (error) {
        console.log('Delete Quantity error');
    };
    QuantityDetailsComponent.prototype.changeQuantityName = function (keyQuantity) {
        if (keyQuantity !== null && keyQuantity !== undefined && keyQuantity !== '') {
            this.keyQuantity = keyQuantity;
        }
    };
    QuantityDetailsComponent.prototype.getLabel = function () {
        return constants_1.Label;
    };
    QuantityDetailsComponent.prototype.getButton = function () {
        return constants_1.Button;
    };
    QuantityDetailsComponent.prototype.setShowWorkItemTab = function (tabName) {
        this.showWorkItemTabName = tabName;
        this.refreshWorkItemList.emit();
    };
    QuantityDetailsComponent.prototype.closeQuantityView = function () {
        this.showQuantityTab = null;
        this.showWorkItemTabName = null;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], QuantityDetailsComponent.prototype, "quantityDetails", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], QuantityDetailsComponent.prototype, "workItem", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], QuantityDetailsComponent.prototype, "workItemsList", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], QuantityDetailsComponent.prototype, "categoryDetails", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], QuantityDetailsComponent.prototype, "categoryRateAnalysisId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], QuantityDetailsComponent.prototype, "workItemRateAnalysisId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], QuantityDetailsComponent.prototype, "baseUrl", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], QuantityDetailsComponent.prototype, "categoriesTotalAmount", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], QuantityDetailsComponent.prototype, "refreshWorkItemList", void 0);
    QuantityDetailsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-quantity-details',
            templateUrl: 'quantity-details.component.html',
            styleUrls: ['quantity-details.component.css'],
        }),
        __metadata("design:paramtypes", [cost_summary_service_1.CostSummaryService, index_1.MessageService,
            loaders_service_1.LoaderService])
    ], QuantityDetailsComponent);
    return QuantityDetailsComponent;
}());
exports.QuantityDetailsComponent = QuantityDetailsComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1oZWFkL3F1YW50aXR5LWRldGFpbHMvcXVhbnRpdHktZGV0YWlscy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBK0U7QUFJL0UsZ0VBQTZFO0FBQzdFLDhCQUFnQztBQUVoQyx3REFBZ0g7QUFDaEgsbUVBQWdFO0FBQ2hFLG1GQUFnRjtBQVNoRjtJQW9CRSxrQ0FBb0Isa0JBQXNDLEVBQVUsY0FBOEIsRUFDOUUsYUFBNEI7UUFENUIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5RSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQVh0QywwQkFBcUIsR0FBRyxJQUFJLG1CQUFZLEVBQVUsQ0FBQztRQUNuRCx3QkFBbUIsR0FBRyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztRQUVuRCx1QkFBa0IsR0FBUSxFQUFFLENBQUM7UUFJN0Isb0JBQWUsR0FBWSxJQUFJLENBQUM7UUFDaEMsd0JBQW1CLEdBQVcsSUFBSSxDQUFDO0lBSW5DLENBQUM7SUFFQSwyQ0FBUSxHQUFSO1FBQ0MsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBRXBDLENBQUM7SUFFRCw4Q0FBVyxHQUFYLFVBQVksY0FBZ0M7UUFDMUMsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLG1CQUFtQixLQUFNLGlCQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1lBQzdELEVBQUUsQ0FBQSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDeEUsSUFBSSxDQUFDLFdBQVcsR0FB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USxFQUFFLHFCQUFxQjtZQUMvQixXQUFXLEVBQUUsaUNBQWlDO1lBQzlDLFNBQVMsRUFBRSxDQUFDLGdDQUFnQyxDQUFDO1NBQzlDLENBQUM7eUNBc0J3Qyx5Q0FBa0IsRUFBMEIsc0JBQWM7WUFDL0QsK0JBQWE7T0FyQnJDLHdCQUF3QixDQTJHcEM7SUFBRCwrQkFBQztDQTNHRCxBQTJHQyxJQUFBO0FBM0dZLDREQUF3QiIsImZpbGUiOiJhcHAvYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9jb3N0LXN1bW1hcnktcmVwb3J0L2Nvc3QtaGVhZC9xdWFudGl0eS1kZXRhaWxzL3F1YW50aXR5LWRldGFpbHMuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDYXRlZ29yeSB9IGZyb20gJy4uLy4uLy4uLy4uL21vZGVsL2NhdGVnb3J5JztcclxuaW1wb3J0IHsgUXVhbnRpdHlJdGVtIH0gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWwvcXVhbnRpdHktaXRlbSc7XHJcbmltcG9ydCB7IFdvcmtJdGVtIH0gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWwvd29yay1pdGVtJztcclxuaW1wb3J0IHsgQnV0dG9uLCBMYWJlbCwgTWVzc2FnZXMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi9zaGFyZWQvY29uc3RhbnRzJztcclxuaW1wb3J0ICogYXMgbG9kc2ggZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgUXVhbnRpdHlEZXRhaWxzIH0gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWwvcXVhbnRpdHktZGV0YWlscyc7XHJcbmltcG9ydCB7IE1lc3NhZ2UsIE1lc3NhZ2VTZXJ2aWNlLCBTZXNzaW9uU3RvcmFnZSwgU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vc2hhcmVkL2luZGV4JztcclxuaW1wb3J0IHsgQ29zdFN1bW1hcnlTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY29zdC1zdW1tYXJ5LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vc2hhcmVkL2xvYWRlci9sb2FkZXJzLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICBzZWxlY3RvcjogJ2JpLXF1YW50aXR5LWRldGFpbHMnLFxyXG4gIHRlbXBsYXRlVXJsOiAncXVhbnRpdHktZGV0YWlscy5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJ3F1YW50aXR5LWRldGFpbHMuY29tcG9uZW50LmNzcyddLFxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIFF1YW50aXR5RGV0YWlsc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIEBJbnB1dCgpIHF1YW50aXR5RGV0YWlscyA6IEFycmF5PFF1YW50aXR5RGV0YWlscz47XHJcbiAgQElucHV0KCkgd29ya0l0ZW0gOiBBcnJheTxXb3JrSXRlbT47XHJcbiAgQElucHV0KCkgd29ya0l0ZW1zTGlzdCA6IEFycmF5PFdvcmtJdGVtPjtcclxuICBASW5wdXQoKSBjYXRlZ29yeURldGFpbHMgOiAgQXJyYXk8Q2F0ZWdvcnk+O1xyXG4gIEBJbnB1dCgpIGNhdGVnb3J5UmF0ZUFuYWx5c2lzSWQgOiBudW1iZXI7XHJcbiAgQElucHV0KCkgd29ya0l0ZW1SYXRlQW5hbHlzaXNJZCA6IG51bWJlcjtcclxuICBASW5wdXQoKSBiYXNlVXJsIDogc3RyaW5nO1xyXG5cclxuICBAT3V0cHV0KCkgY2F0ZWdvcmllc1RvdGFsQW1vdW50ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XHJcbiAgQE91dHB1dCgpIHJlZnJlc2hXb3JrSXRlbUxpc3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIHF1YW50aXR5SXRlbXNBcnJheTogYW55ID0ge307XHJcbiAgd29ya0l0ZW1EYXRhOiBBcnJheTxXb3JrSXRlbT47XHJcbiAga2V5UXVhbnRpdHk6IHN0cmluZztcclxuICBxdWFudGl0eU5hbWU6IHN0cmluZztcclxuICBzaG93UXVhbnRpdHlUYWIgOiBzdHJpbmcgPSBudWxsO1xyXG4gIHNob3dXb3JrSXRlbVRhYk5hbWU6IHN0cmluZyA9IG51bGw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29zdFN1bW1hcnlTZXJ2aWNlOiBDb3N0U3VtbWFyeVNlcnZpY2UsIHByaXZhdGUgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgbG9hZGVyU2VydmljZTogTG9hZGVyU2VydmljZSkge1xyXG4gIH1cclxuXHJcbiAgIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy53b3JrSXRlbURhdGEgPSB0aGlzLndvcmtJdGVtO1xyXG5cclxuICB9XHJcblxyXG4gIGdldFF1YW50aXR5KHF1YW50aXR5RGV0YWlsIDogUXVhbnRpdHlEZXRhaWxzKSB7XHJcbiAgICBpZih0aGlzLnNob3dXb3JrSXRlbVRhYk5hbWUgIT09ICBMYWJlbC5XT1JLSVRFTV9RVUFOVElUWV9UQUIpIHtcclxuICAgICAgaWYocXVhbnRpdHlEZXRhaWwucXVhbnRpdHlJdGVtcy5sZW5ndGggIT09IDApIHtcclxuICAgICAgICB0aGlzLnF1YW50aXR5SXRlbXNBcnJheSA9IGxvZHNoLmNsb25lRGVlcChxdWFudGl0eURldGFpbC5xdWFudGl0eUl0ZW1zKTtcclxuICAgICAgICB0aGlzLmtleVF1YW50aXR5ID0gcXVhbnRpdHlEZXRhaWwubmFtZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnF1YW50aXR5SXRlbXNBcnJheSA9IFtdO1xyXG4gICAgICAgIHF1YW50aXR5RGV0YWlsLm5hbWUgPSB0aGlzLmtleVF1YW50aXR5O1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2hvd1dvcmtJdGVtVGFiTmFtZSA9IExhYmVsLldPUktJVEVNX1FVQU5USVRZX1RBQjtcclxuICAgIH1lbHNlIHtcclxuICAgICAgdGhpcy5zaG93V29ya0l0ZW1UYWJOYW1lPW51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRRdWFudGl0eU5hbWVGb3JEZWxldGUocXVhbnRpdHlOYW1lOiBzdHJpbmcpIHtcclxuICAgIHRoaXMucXVhbnRpdHlOYW1lID0gcXVhbnRpdHlOYW1lO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlUXVhbnRpdHlEZXRhaWxzQnlOYW1lKCkge1xyXG4gICAgaWYodGhpcy5xdWFudGl0eU5hbWUgIT09IG51bGwgJiYgdGhpcy5xdWFudGl0eU5hbWUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnF1YW50aXR5TmFtZSAhPT0gJycpIHtcclxuICAgICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0YXJ0KCk7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gcGFyc2VJbnQoU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX0NPU1RfSEVBRF9JRCkpO1xyXG4gICAgICB0aGlzLmNvc3RTdW1tYXJ5U2VydmljZS5kZWxldGVRdWFudGl0eURldGFpbHNCeU5hbWUodGhpcy5iYXNlVXJsLCBjb3N0SGVhZElkLCB0aGlzLmNhdGVnb3J5UmF0ZUFuYWx5c2lzSWQsXHJcbiAgICAgICAgdGhpcy53b3JrSXRlbVJhdGVBbmFseXNpc0lkLCB0aGlzLnF1YW50aXR5TmFtZSkuc3Vic2NyaWJlKFxyXG4gICAgICAgIHN1Y2Nlc3MgPT4gdGhpcy5vbkRlbGV0ZVF1YW50aXR5RGV0YWlsc0J5TmFtZVN1Y2Nlc3Moc3VjY2VzcyksXHJcbiAgICAgICAgZXJyb3IgPT4gdGhpcy5vbkRlbGV0ZVF1YW50aXR5RGV0YWlsc0J5TmFtZUZhaWx1cmUoZXJyb3IpXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fUVVBTlRJVFlfTkFNRV9SRVFVSVJFRDtcclxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25EZWxldGVRdWFudGl0eURldGFpbHNCeU5hbWVTdWNjZXNzKHN1Y2Nlc3M6IGFueSkge1xyXG4gICAgZm9yIChsZXQgcXVhbnRpdHlJbmRleCBpbiB0aGlzLnF1YW50aXR5RGV0YWlscykge1xyXG4gICAgICBpZiAodGhpcy5xdWFudGl0eURldGFpbHNbcXVhbnRpdHlJbmRleF0ubmFtZSA9PT0gdGhpcy5xdWFudGl0eU5hbWUpIHtcclxuICAgICAgICB0aGlzLnF1YW50aXR5RGV0YWlscy5zcGxpY2UocGFyc2VJbnQocXVhbnRpdHlJbmRleCksMSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0RFTEVURV9RVUFOVElUWV9ERVRBSUxTO1xyXG4gICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgdGhpcy5yZWZyZXNoV29ya0l0ZW1MaXN0LmVtaXQoKTtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5zdG9wKCk7XHJcbiAgfVxyXG5cclxuICBvbkRlbGV0ZVF1YW50aXR5RGV0YWlsc0J5TmFtZUZhaWx1cmUoZXJyb3I6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coJ0RlbGV0ZSBRdWFudGl0eSBlcnJvcicpO1xyXG4gIH1cclxuXHJcblxyXG4gIGNoYW5nZVF1YW50aXR5TmFtZShrZXlRdWFudGl0eTogc3RyaW5nKSB7XHJcbiAgICBpZihrZXlRdWFudGl0eSAhPT0gbnVsbCAmJiBrZXlRdWFudGl0eSAhPT0gdW5kZWZpbmVkICYmIGtleVF1YW50aXR5ICE9PSAnJykge1xyXG4gICAgICB0aGlzLmtleVF1YW50aXR5ID0ga2V5UXVhbnRpdHk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRMYWJlbCgpIHtcclxuICAgIHJldHVybiBMYWJlbDtcclxuICB9XHJcblxyXG4gIGdldEJ1dHRvbigpIHtcclxuICAgIHJldHVybiBCdXR0b247XHJcbiAgfVxyXG5cclxuICBzZXRTaG93V29ya0l0ZW1UYWIoIHRhYk5hbWUgOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuc2hvd1dvcmtJdGVtVGFiTmFtZSA9IHRhYk5hbWU7XHJcbiAgICB0aGlzLnJlZnJlc2hXb3JrSXRlbUxpc3QuZW1pdCgpO1xyXG4gIH1cclxuICBjbG9zZVF1YW50aXR5VmlldygpIHtcclxuICAgIHRoaXMuc2hvd1F1YW50aXR5VGFiID0gbnVsbDtcclxuICAgIHRoaXMuc2hvd1dvcmtJdGVtVGFiTmFtZSA9IG51bGw7XHJcbiAgfVxyXG59XHJcbiJdfQ==
