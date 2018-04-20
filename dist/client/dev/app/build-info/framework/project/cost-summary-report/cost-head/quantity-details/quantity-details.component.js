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
    QuantityDetailsComponent.prototype.setCategoriesTotal = function (categoriesTotal) {
        this.categoriesTotalAmount.emit(categoriesTotal);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1oZWFkL3F1YW50aXR5LWRldGFpbHMvcXVhbnRpdHktZGV0YWlscy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBK0U7QUFJL0UsZ0VBQTZFO0FBQzdFLDhCQUFnQztBQUVoQyx3REFBZ0g7QUFDaEgsbUVBQWdFO0FBQ2hFLG1GQUFnRjtBQVNoRjtJQW9CRSxrQ0FBb0Isa0JBQXNDLEVBQVUsY0FBOEIsRUFDOUUsYUFBNEI7UUFENUIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5RSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQVh0QywwQkFBcUIsR0FBRyxJQUFJLG1CQUFZLEVBQVUsQ0FBQztRQUNuRCx3QkFBbUIsR0FBRyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztRQUVuRCx1QkFBa0IsR0FBUSxFQUFFLENBQUM7UUFJN0Isb0JBQWUsR0FBWSxJQUFJLENBQUM7UUFDaEMsd0JBQW1CLEdBQVcsSUFBSSxDQUFDO0lBSW5DLENBQUM7SUFFQSwyQ0FBUSxHQUFSO1FBQ0MsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBRXBDLENBQUM7SUFFRCw4Q0FBVyxHQUFYLFVBQVksY0FBZ0M7UUFDMUMsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLG1CQUFtQixLQUFNLGlCQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1lBQzdELEVBQUUsQ0FBQSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDeEUsSUFBSSxDQUFDLFdBQVcsR0FB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RDtRQUFULGFBQU0sRUFBRTs7eUVBQTBDO0lBWHhDLHdCQUF3QjtRQVBwQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSxxQkFBcUI7WUFDL0IsV0FBVyxFQUFFLGlDQUFpQztZQUM5QyxTQUFTLEVBQUUsQ0FBQyxnQ0FBZ0MsQ0FBQztTQUM5QyxDQUFDO3lDQXNCd0MseUNBQWtCLEVBQTBCLHNCQUFjO1lBQy9ELCtCQUFhO09BckJyQyx3QkFBd0IsQ0FnSHBDO0lBQUQsK0JBQUM7Q0FoSEQsQUFnSEMsSUFBQTtBQWhIWSw0REFBd0IiLCJmaWxlIjoiYXBwL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvY29zdC1zdW1tYXJ5LXJlcG9ydC9jb3N0LWhlYWQvcXVhbnRpdHktZGV0YWlscy9xdWFudGl0eS1kZXRhaWxzLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ2F0ZWdvcnkgfSBmcm9tICcuLi8uLi8uLi8uLi9tb2RlbC9jYXRlZ29yeSc7XHJcbmltcG9ydCB7IFF1YW50aXR5SXRlbSB9IGZyb20gJy4uLy4uLy4uLy4uL21vZGVsL3F1YW50aXR5LWl0ZW0nO1xyXG5pbXBvcnQgeyBXb3JrSXRlbSB9IGZyb20gJy4uLy4uLy4uLy4uL21vZGVsL3dvcmstaXRlbSc7XHJcbmltcG9ydCB7IEJ1dHRvbiwgTGFiZWwsIE1lc3NhZ2VzIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcbmltcG9ydCAqIGFzIGxvZHNoIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IFF1YW50aXR5RGV0YWlscyB9IGZyb20gJy4uLy4uLy4uLy4uL21vZGVsL3F1YW50aXR5LWRldGFpbHMnO1xyXG5pbXBvcnQgeyBNZXNzYWdlLCBNZXNzYWdlU2VydmljZSwgU2Vzc2lvblN0b3JhZ2UsIFNlc3Npb25TdG9yYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IENvc3RTdW1tYXJ5U2VydmljZSB9IGZyb20gJy4uLy4uL2Nvc3Qtc3VtbWFyeS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTG9hZGVyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9sb2FkZXIvbG9hZGVycy5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICdiaS1xdWFudGl0eS1kZXRhaWxzJyxcclxuICB0ZW1wbGF0ZVVybDogJ3F1YW50aXR5LWRldGFpbHMuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydxdWFudGl0eS1kZXRhaWxzLmNvbXBvbmVudC5jc3MnXSxcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWFudGl0eURldGFpbHNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICBASW5wdXQoKSBxdWFudGl0eURldGFpbHMgOiBBcnJheTxRdWFudGl0eURldGFpbHM+O1xyXG4gIEBJbnB1dCgpIHdvcmtJdGVtIDogQXJyYXk8V29ya0l0ZW0+O1xyXG4gIEBJbnB1dCgpIHdvcmtJdGVtc0xpc3QgOiBBcnJheTxXb3JrSXRlbT47XHJcbiAgQElucHV0KCkgY2F0ZWdvcnlEZXRhaWxzIDogIEFycmF5PENhdGVnb3J5PjtcclxuICBASW5wdXQoKSBjYXRlZ29yeVJhdGVBbmFseXNpc0lkIDogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIHdvcmtJdGVtUmF0ZUFuYWx5c2lzSWQgOiBudW1iZXI7XHJcbiAgQElucHV0KCkgYmFzZVVybCA6IHN0cmluZztcclxuXHJcbiAgQE91dHB1dCgpIGNhdGVnb3JpZXNUb3RhbEFtb3VudCA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xyXG4gIEBPdXRwdXQoKSByZWZyZXNoV29ya0l0ZW1MaXN0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBxdWFudGl0eUl0ZW1zQXJyYXk6IGFueSA9IHt9O1xyXG4gIHdvcmtJdGVtRGF0YTogQXJyYXk8V29ya0l0ZW0+O1xyXG4gIGtleVF1YW50aXR5OiBzdHJpbmc7XHJcbiAgcXVhbnRpdHlOYW1lOiBzdHJpbmc7XHJcbiAgc2hvd1F1YW50aXR5VGFiIDogc3RyaW5nID0gbnVsbDtcclxuICBzaG93V29ya0l0ZW1UYWJOYW1lOiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvc3RTdW1tYXJ5U2VydmljZTogQ29zdFN1bW1hcnlTZXJ2aWNlLCBwcml2YXRlIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIGxvYWRlclNlcnZpY2U6IExvYWRlclNlcnZpY2UpIHtcclxuICB9XHJcblxyXG4gICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMud29ya0l0ZW1EYXRhID0gdGhpcy53b3JrSXRlbTtcclxuXHJcbiAgfVxyXG5cclxuICBnZXRRdWFudGl0eShxdWFudGl0eURldGFpbCA6IFF1YW50aXR5RGV0YWlscykge1xyXG4gICAgaWYodGhpcy5zaG93V29ya0l0ZW1UYWJOYW1lICE9PSAgTGFiZWwuV09SS0lURU1fUVVBTlRJVFlfVEFCKSB7XHJcbiAgICAgIGlmKHF1YW50aXR5RGV0YWlsLnF1YW50aXR5SXRlbXMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgdGhpcy5xdWFudGl0eUl0ZW1zQXJyYXkgPSBsb2RzaC5jbG9uZURlZXAocXVhbnRpdHlEZXRhaWwucXVhbnRpdHlJdGVtcyk7XHJcbiAgICAgICAgdGhpcy5rZXlRdWFudGl0eSA9IHF1YW50aXR5RGV0YWlsLm5hbWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5xdWFudGl0eUl0ZW1zQXJyYXkgPSBbXTtcclxuICAgICAgICBxdWFudGl0eURldGFpbC5uYW1lID0gdGhpcy5rZXlRdWFudGl0eTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnNob3dXb3JrSXRlbVRhYk5hbWUgPSBMYWJlbC5XT1JLSVRFTV9RVUFOVElUWV9UQUI7XHJcbiAgICB9ZWxzZSB7XHJcbiAgICAgIHRoaXMuc2hvd1dvcmtJdGVtVGFiTmFtZT1udWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0UXVhbnRpdHlOYW1lRm9yRGVsZXRlKHF1YW50aXR5TmFtZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnF1YW50aXR5TmFtZSA9IHF1YW50aXR5TmFtZTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZVF1YW50aXR5RGV0YWlsc0J5TmFtZSgpIHtcclxuICAgIGlmKHRoaXMucXVhbnRpdHlOYW1lICE9PSBudWxsICYmIHRoaXMucXVhbnRpdHlOYW1lICE9PSB1bmRlZmluZWQgJiYgdGhpcy5xdWFudGl0eU5hbWUgIT09ICcnKSB7XHJcbiAgICAgIHRoaXMubG9hZGVyU2VydmljZS5zdGFydCgpO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9DT1NUX0hFQURfSUQpKTtcclxuICAgICAgdGhpcy5jb3N0U3VtbWFyeVNlcnZpY2UuZGVsZXRlUXVhbnRpdHlEZXRhaWxzQnlOYW1lKHRoaXMuYmFzZVVybCwgY29zdEhlYWRJZCwgdGhpcy5jYXRlZ29yeVJhdGVBbmFseXNpc0lkLFxyXG4gICAgICAgIHRoaXMud29ya0l0ZW1SYXRlQW5hbHlzaXNJZCwgdGhpcy5xdWFudGl0eU5hbWUpLnN1YnNjcmliZShcclxuICAgICAgICBzdWNjZXNzID0+IHRoaXMub25EZWxldGVRdWFudGl0eURldGFpbHNCeU5hbWVTdWNjZXNzKHN1Y2Nlc3MpLFxyXG4gICAgICAgIGVycm9yID0+IHRoaXMub25EZWxldGVRdWFudGl0eURldGFpbHNCeU5hbWVGYWlsdXJlKGVycm9yKVxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19FUlJPUl9WQUxJREFUSU9OX1FVQU5USVRZX05BTUVfUkVRVUlSRUQ7XHJcbiAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uRGVsZXRlUXVhbnRpdHlEZXRhaWxzQnlOYW1lU3VjY2VzcyhzdWNjZXNzOiBhbnkpIHtcclxuICAgIGZvciAobGV0IHF1YW50aXR5SW5kZXggaW4gdGhpcy5xdWFudGl0eURldGFpbHMpIHtcclxuICAgICAgaWYgKHRoaXMucXVhbnRpdHlEZXRhaWxzW3F1YW50aXR5SW5kZXhdLm5hbWUgPT09IHRoaXMucXVhbnRpdHlOYW1lKSB7XHJcbiAgICAgICAgdGhpcy5xdWFudGl0eURldGFpbHMuc3BsaWNlKHBhcnNlSW50KHF1YW50aXR5SW5kZXgpLDEpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgIG1lc3NhZ2UuY3VzdG9tX21lc3NhZ2UgPSBNZXNzYWdlcy5NU0dfU1VDQ0VTU19ERUxFVEVfUVVBTlRJVFlfREVUQUlMUztcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIHRoaXMucmVmcmVzaFdvcmtJdGVtTGlzdC5lbWl0KCk7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgb25EZWxldGVRdWFudGl0eURldGFpbHNCeU5hbWVGYWlsdXJlKGVycm9yOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKCdEZWxldGUgUXVhbnRpdHkgZXJyb3InKTtcclxuICB9XHJcblxyXG5cclxuICBjaGFuZ2VRdWFudGl0eU5hbWUoa2V5UXVhbnRpdHk6IHN0cmluZykge1xyXG4gICAgaWYoa2V5UXVhbnRpdHkgIT09IG51bGwgJiYga2V5UXVhbnRpdHkgIT09IHVuZGVmaW5lZCAmJiBrZXlRdWFudGl0eSAhPT0gJycpIHtcclxuICAgICAgdGhpcy5rZXlRdWFudGl0eSA9IGtleVF1YW50aXR5O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0TGFiZWwoKSB7XHJcbiAgICByZXR1cm4gTGFiZWw7XHJcbiAgfVxyXG5cclxuICBnZXRCdXR0b24oKSB7XHJcbiAgICByZXR1cm4gQnV0dG9uO1xyXG4gIH1cclxuXHJcbiAgc2V0U2hvd1dvcmtJdGVtVGFiKCB0YWJOYW1lIDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnNob3dXb3JrSXRlbVRhYk5hbWUgPSB0YWJOYW1lO1xyXG4gICAgdGhpcy5yZWZyZXNoV29ya0l0ZW1MaXN0LmVtaXQoKTtcclxuICB9XHJcblxyXG4gIHNldENhdGVnb3JpZXNUb3RhbCggY2F0ZWdvcmllc1RvdGFsIDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmNhdGVnb3JpZXNUb3RhbEFtb3VudC5lbWl0KGNhdGVnb3JpZXNUb3RhbCk7XHJcbiAgfVxyXG5cclxuICBjbG9zZVF1YW50aXR5VmlldygpIHtcclxuICAgIHRoaXMuc2hvd1F1YW50aXR5VGFiID0gbnVsbDtcclxuICAgIHRoaXMuc2hvd1dvcmtJdGVtVGFiTmFtZSA9IG51bGw7XHJcbiAgfVxyXG59XHJcbiJdfQ==
