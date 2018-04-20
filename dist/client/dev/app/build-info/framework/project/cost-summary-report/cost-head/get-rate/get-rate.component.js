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
var index_1 = require("../../../../../../shared/index");
var cost_summary_service_1 = require("./../../cost-summary.service");
var rate_1 = require("../../../../model/rate");
var loaders_service_1 = require("../../../../../../shared/loader/loaders.service");
var common_service_1 = require("../../../../../../../app/shared/services/common.service");
var GetRateComponent = (function () {
    function GetRateComponent(costSummaryService, loaderService, messageService, commonService) {
        this.costSummaryService = costSummaryService;
        this.loaderService = loaderService;
        this.messageService = messageService;
        this.commonService = commonService;
        this.categoriesTotalAmount = new core_1.EventEmitter();
        this.showWorkItemTabName = new core_1.EventEmitter();
        this.refreshCategoryList = new core_1.EventEmitter();
        this.closeRateView = new core_1.EventEmitter();
        this.totalAmount = 0;
        this.totalAmountOfMaterial = 0;
        this.totalAmountOfLabour = 0;
        this.totalAmountOfMaterialAndLabour = 0;
        this.quantityIncrement = 1;
        this.previousTotalQuantity = 1;
        this.totalItemRateQuantity = 0;
    }
    GetRateComponent.prototype.ngOnInit = function () {
        this.calculateTotal();
    };
    GetRateComponent.prototype.calculateTotal = function (choice) {
        this.ratePerUnitAmount = 0;
        this.totalAmount = 0;
        this.totalAmountOfLabour = 0;
        this.totalAmountOfMaterial = 0;
        this.totalAmountOfMaterialAndLabour = 0;
        for (var rateItemsIndex in this.rate.rateItems) {
            if (choice === 'changeTotalQuantity') {
                this.rate.rateItems[rateItemsIndex].quantity = parseFloat((this.rate.rateItems[rateItemsIndex].quantity *
                    this.quantityIncrement).toFixed(constants_1.ValueConstant.NUMBER_OF_FRACTION_DIGIT));
            }
            this.type = this.rate.rateItems[rateItemsIndex].type;
            switch (this.type) {
                case 'M':
                    this.rate.rateItems[rateItemsIndex].totalAmount = this.rate.rateItems[rateItemsIndex].quantity *
                        this.rate.rateItems[rateItemsIndex].rate;
                    this.totalAmountOfMaterial = this.totalAmountOfMaterial + this.rate.rateItems[rateItemsIndex].totalAmount;
                    break;
                case 'L':
                    this.rate.rateItems[rateItemsIndex].totalAmount = this.rate.rateItems[rateItemsIndex].quantity *
                        this.rate.rateItems[rateItemsIndex].rate;
                    this.totalAmountOfLabour = this.totalAmountOfLabour + this.rate.rateItems[rateItemsIndex].totalAmount;
                    break;
                case 'M + L':
                    this.rate.rateItems[rateItemsIndex].totalAmount = this.rate.rateItems[rateItemsIndex].quantity *
                        this.rate.rateItems[rateItemsIndex].rate;
                    this.totalAmountOfMaterialAndLabour = this.totalAmountOfMaterialAndLabour +
                        this.rate.rateItems[rateItemsIndex].totalAmount;
                    break;
            }
            this.totalAmount = this.totalAmountOfMaterial + this.totalAmountOfLabour + this.totalAmountOfMaterialAndLabour;
        }
        this.ratePerUnitAmount = this.totalAmount / this.rate.quantity;
        this.rate.total = this.ratePerUnitAmount;
    };
    GetRateComponent.prototype.updateRate = function (rateItemsArray) {
        var _this = this;
        if (this.validateRateItem(rateItemsArray.rateItems)) {
            this.loaderService.start();
            var costHeadId = parseInt(index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_COST_HEAD_ID));
            var workItemId = parseInt(index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_WORKITEM_ID));
            var rate = new rate_1.Rate();
            rate.rateFromRateAnalysis = rateItemsArray.rateFromRateAnalysis;
            rate.total = this.commonService.decimalConversion(rateItemsArray.total);
            rate.quantity = rateItemsArray.quantity;
            rate.unit = rateItemsArray.unit;
            rate.rateItems = rateItemsArray.rateItems;
            rate.imageURL = rateItemsArray.imageURL;
            rate.notes = rateItemsArray.notes;
            this.costSummaryService.updateRate(this.baseUrl, costHeadId, this.categoryRateAnalysisId, workItemId, rate).subscribe(function (success) { return _this.onUpdateRateSuccess(success); }, function (error) { return _this.onUpdateRateFailure(error); });
        }
        else {
            var message = new index_1.Message();
            message.isError = false;
            message.custom_message = constants_1.Messages.MSG_ERROR_VALIDATION_QUANTITY_REQUIRED;
            this.messageService.message(message);
        }
    };
    GetRateComponent.prototype.validateRateItem = function (rateItems) {
        for (var _i = 0, rateItems_1 = rateItems; _i < rateItems_1.length; _i++) {
            var rateItemData = rateItems_1[_i];
            if ((rateItemData.itemName === null || rateItemData.itemName === undefined || rateItemData.itemName.trim() === '') ||
                (rateItemData.rate === undefined || rateItemData.rate === null) ||
                (rateItemData.quantity === undefined || rateItemData.quantity === null)) {
                return false;
            }
        }
        return true;
    };
    GetRateComponent.prototype.onUpdateRateSuccess = function (success) {
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = constants_1.Messages.MSG_SUCCESS_UPDATE_RATE;
        this.messageService.message(message);
        for (var _i = 0, _a = this.workItemsList; _i < _a.length; _i++) {
            var workItemData = _a[_i];
            if (workItemData.rateAnalysisId === this.workItemRateAnalysisId) {
                workItemData.rate.total = this.ratePerUnitAmount;
                if (workItemData.rate.total !== 0) {
                    workItemData.rate.isEstimated = true;
                    if (workItemData.quantity.isEstimated && workItemData.rate.isEstimated) {
                        workItemData.amount = this.commonService.calculateAmountOfWorkItem(workItemData.quantity.total, workItemData.rate.total);
                    }
                }
                else {
                    workItemData.rate.isEstimated = false;
                    workItemData.amount = 0;
                }
                break;
            }
        }
        var categoriesTotal = this.commonService.totalCalculationOfCategories(this.categoryDetails, this.categoryRateAnalysisId, this.workItemsList);
        this.categoriesTotalAmount.emit(categoriesTotal);
        this.loaderService.stop();
    };
    GetRateComponent.prototype.onUpdateRateFailure = function (error) {
        console.log(error);
        this.loaderService.stop();
    };
    GetRateComponent.prototype.onTotalQuantityChange = function (newTotalQuantity) {
        if (newTotalQuantity === 0 || newTotalQuantity === null) {
            newTotalQuantity = 1;
            this.totalItemRateQuantity = newTotalQuantity;
            this.rate.quantity = newTotalQuantity;
            var message = new index_1.Message();
            message.isError = false;
            message.custom_message = constants_1.Messages.MSG_QUANTITY_SHOULD_NOT_ZERO_OR_NULL;
            this.messageService.message(message);
        }
        else {
            this.quantityIncrement = newTotalQuantity / this.previousTotalQuantity;
            this.calculateTotal('changeTotalQuantity');
            this.totalItemRateQuantity = newTotalQuantity;
            this.rate.quantity = newTotalQuantity;
        }
    };
    GetRateComponent.prototype.getPreviousQuantity = function (previousTotalQuantity) {
        this.previousTotalQuantity = previousTotalQuantity;
    };
    GetRateComponent.prototype.getItemName = function (event) {
        if (event.target.value !== '') {
            this.selectedItemName = event.target.value;
            event.target.value = '';
        }
    };
    GetRateComponent.prototype.setItemName = function (event) {
        if (event.target.value === '') {
            event.target.value = this.selectedItemName;
        }
    };
    GetRateComponent.prototype.getRateItemsByOriginalName = function (rateItem, index) {
        var _this = this;
        this.selectedRateItem = rateItem;
        this.selectedRateItemIndex = index;
        this.costSummaryService.getRateItemsByOriginalName(this.baseUrl, rateItem.originalItemName).subscribe(function (rateItemsData) { return _this.onGetRateItemsByOriginalNameSuccess(rateItemsData.data); }, function (error) { return _this.onGetRateItemsByOriginalNameFailure(error); });
    };
    GetRateComponent.prototype.onGetRateItemsByOriginalNameSuccess = function (rateItemsData) {
        this.arrayOfRateItems = rateItemsData;
    };
    GetRateComponent.prototype.setRate = function (rateItemsData) {
        var selectedItemName = this.selectedRateItem.itemName;
        var rateItemData = rateItemsData.filter(function (rateItemData1) {
            return rateItemData1.itemName === selectedItemName;
        });
        if (rateItemData.length !== 0) {
            var rateItems = this.rate.rateItems.filter(function (rateItems) {
                return rateItems.itemName === selectedItemName;
            });
            rateItems[0].rate = rateItemData[0].rate;
            this.calculateTotal();
            var workItemRateAnalysisId_1 = this.workItemRateAnalysisId;
            var workItemData = this.workItemsList.filter(function (workItemData) {
                return workItemData.rateAnalysisId === workItemRateAnalysisId_1;
            });
            workItemData[0].rate = this.rate;
        }
    };
    GetRateComponent.prototype.closeRateTab = function () {
        this.closeRateView.emit();
    };
    GetRateComponent.prototype.onGetRateItemsByOriginalNameFailure = function (error) {
        console.log(error);
    };
    GetRateComponent.prototype.getButton = function () {
        return constants_1.Button;
    };
    GetRateComponent.prototype.getTableHeadings = function () {
        return constants_1.TableHeadings;
    };
    GetRateComponent.prototype.getLabel = function () {
        return constants_1.Label;
    };
    GetRateComponent.prototype.getHeadings = function () {
        return constants_1.Headings;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", rate_1.Rate)
    ], GetRateComponent.prototype, "rate", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], GetRateComponent.prototype, "categoryDetails", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], GetRateComponent.prototype, "categoryRateAnalysisId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], GetRateComponent.prototype, "workItemRateAnalysisId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], GetRateComponent.prototype, "workItemsList", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], GetRateComponent.prototype, "ratePerUnitAmount", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], GetRateComponent.prototype, "baseUrl", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], GetRateComponent.prototype, "rateView", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], GetRateComponent.prototype, "disableRateField", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], GetRateComponent.prototype, "categoriesTotalAmount", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], GetRateComponent.prototype, "showWorkItemTabName", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], GetRateComponent.prototype, "refreshCategoryList", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], GetRateComponent.prototype, "closeRateView", void 0);
    GetRateComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-get-rate',
            templateUrl: 'get-rate.component.html',
            styleUrls: ['get-rate.component.css'],
        }),
        __metadata("design:paramtypes", [cost_summary_service_1.CostSummaryService, loaders_service_1.LoaderService,
            index_1.MessageService, common_service_1.CommonService])
    ], GetRateComponent);
    return GetRateComponent;
}());
exports.GetRateComponent = GetRateComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1oZWFkL2dldC1yYXRlL2dldC1yYXRlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFzRztBQUN0RyxnRUFBcUg7QUFDckgsd0RBR3dDO0FBQ3hDLHFFQUFrRTtBQUNsRSwrQ0FBOEM7QUFDOUMsbUZBQWdGO0FBR2hGLDBGQUF3RjtBQVd4RjtJQStCRSwwQkFBb0Isa0JBQXNDLEVBQVcsYUFBNEIsRUFDN0UsY0FBOEIsRUFBVSxhQUE0QjtRQURwRSx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQVcsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDN0UsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFwQjlFLDBCQUFxQixHQUFHLElBQUksbUJBQVksRUFBVSxDQUFDO1FBQ25ELHdCQUFtQixHQUFHLElBQUksbUJBQVksRUFBVSxDQUFDO1FBQ2pELHdCQUFtQixHQUFHLElBQUksbUJBQVksRUFBRSxDQUFDO1FBQ3pDLGtCQUFhLEdBQUcsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFFN0MsZ0JBQVcsR0FBWSxDQUFDLENBQUM7UUFDekIsMEJBQXFCLEdBQVksQ0FBQyxDQUFDO1FBQ25DLHdCQUFtQixHQUFZLENBQUMsQ0FBQztRQUNqQyxtQ0FBOEIsR0FBWSxDQUFDLENBQUM7UUFDNUMsc0JBQWlCLEdBQVcsQ0FBQyxDQUFDO1FBQzlCLDBCQUFxQixHQUFXLENBQUMsQ0FBQztRQUNsQywwQkFBcUIsR0FBVyxDQUFDLENBQUM7SUFVbEMsQ0FBQztJQUNELG1DQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELHlDQUFjLEdBQWQsVUFBZSxNQUFjO1FBQzNCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUM7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QUFDO3lDQWlDd0MseUNBQWtCLEVBQTBCLCtCQUFhO1lBQzdELHNCQUFjLEVBQXlCLDhCQUFhO09BaEM3RSxnQkFBZ0IsQ0FvUTVCO0lBQUQsdUJBQUM7Q0FwUUQsQUFvUUMsSUFBQTtBQXBRWSw0Q0FBZ0IiLCJmaWxlIjoiYXBwL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvY29zdC1zdW1tYXJ5LXJlcG9ydC9jb3N0LWhlYWQvZ2V0LXJhdGUvZ2V0LXJhdGUuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE1lc3NhZ2VzLCBCdXR0b24sIFRhYmxlSGVhZGluZ3MsIExhYmVsLCBIZWFkaW5ncywgVmFsdWVDb25zdGFudCB9IGZyb20gJy4uLy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9jb25zdGFudHMnO1xyXG5pbXBvcnQge1xyXG4gIFNlc3Npb25TdG9yYWdlLCBTZXNzaW9uU3RvcmFnZVNlcnZpY2UsXHJcbiAgTWVzc2FnZSwgTWVzc2FnZVNlcnZpY2VcclxufSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi9zaGFyZWQvaW5kZXgnO1xyXG5pbXBvcnQgeyBDb3N0U3VtbWFyeVNlcnZpY2UgfSBmcm9tICcuLy4uLy4uL2Nvc3Qtc3VtbWFyeS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmF0ZSB9IGZyb20gJy4uLy4uLy4uLy4uL21vZGVsL3JhdGUnO1xyXG5pbXBvcnQgeyBMb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vc2hhcmVkL2xvYWRlci9sb2FkZXJzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBXb3JrSXRlbSB9IGZyb20gJy4uLy4uLy4uLy4uL21vZGVsL3dvcmstaXRlbSc7XHJcbmltcG9ydCB7IENhdGVnb3J5IH0gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWwvY2F0ZWdvcnknO1xyXG5pbXBvcnQgeyBDb21tb25TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vLi4vYXBwL3NoYXJlZC9zZXJ2aWNlcy9jb21tb24uc2VydmljZSc7XHJcbmltcG9ydCB7IFJhdGVJdGVtIH0gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWwvcmF0ZS1pdGVtJztcclxuXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAnYmktZ2V0LXJhdGUnLFxyXG4gIHRlbXBsYXRlVXJsOiAnZ2V0LXJhdGUuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydnZXQtcmF0ZS5jb21wb25lbnQuY3NzJ10sXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgR2V0UmF0ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIEBJbnB1dCgpIHJhdGU6IFJhdGU7XHJcbiAgQElucHV0KCkgY2F0ZWdvcnlEZXRhaWxzIDogIEFycmF5PENhdGVnb3J5PjtcclxuICBASW5wdXQoKSBjYXRlZ29yeVJhdGVBbmFseXNpc0lkIDogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIHdvcmtJdGVtUmF0ZUFuYWx5c2lzSWQgOiBudW1iZXI7XHJcbiAgQElucHV0KCkgd29ya0l0ZW1zTGlzdCA6IEFycmF5PFdvcmtJdGVtPjtcclxuICBASW5wdXQoKSByYXRlUGVyVW5pdEFtb3VudCA6IG51bWJlcjtcclxuICBASW5wdXQoKSBiYXNlVXJsIDogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHJhdGVWaWV3OiBzdHJpbmc7XHJcbiAgQElucHV0KCkgZGlzYWJsZVJhdGVGaWVsZDogYm9vbGVhbjtcclxuXHJcbiAgQE91dHB1dCgpIGNhdGVnb3JpZXNUb3RhbEFtb3VudCA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xyXG4gIEBPdXRwdXQoKSBzaG93V29ya0l0ZW1UYWJOYW1lID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XHJcbiAgQE91dHB1dCgpIHJlZnJlc2hDYXRlZ29yeUxpc3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGNsb3NlUmF0ZVZpZXcgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIHRvdGFsQW1vdW50IDogbnVtYmVyID0gMDtcclxuICB0b3RhbEFtb3VudE9mTWF0ZXJpYWwgOiBudW1iZXIgPSAwO1xyXG4gIHRvdGFsQW1vdW50T2ZMYWJvdXIgOiBudW1iZXIgPSAwO1xyXG4gIHRvdGFsQW1vdW50T2ZNYXRlcmlhbEFuZExhYm91ciA6IG51bWJlciA9IDA7XHJcbiAgcXVhbnRpdHlJbmNyZW1lbnQ6IG51bWJlciA9IDE7XHJcbiAgcHJldmlvdXNUb3RhbFF1YW50aXR5OiBudW1iZXIgPSAxO1xyXG4gIHRvdGFsSXRlbVJhdGVRdWFudGl0eTogbnVtYmVyID0gMDtcclxuICBhcnJheU9mUmF0ZUl0ZW1zOiBBcnJheTxSYXRlSXRlbT47XHJcbiAgc2VsZWN0ZWRSYXRlSXRlbTpSYXRlSXRlbTtcclxuICBzZWxlY3RlZFJhdGVJdGVtSW5kZXg6bnVtYmVyO1xyXG4gIHNlbGVjdGVkUmF0ZUl0ZW1LZXkgOiBzdHJpbmc7XHJcbiAgdHlwZSA6IHN0cmluZztcclxuICBzZWxlY3RlZEl0ZW1OYW1lOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29zdFN1bW1hcnlTZXJ2aWNlOiBDb3N0U3VtbWFyeVNlcnZpY2UsICBwcml2YXRlIGxvYWRlclNlcnZpY2U6IExvYWRlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBtZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UsIHByaXZhdGUgY29tbW9uU2VydmljZTogQ29tbW9uU2VydmljZSkge1xyXG4gIH1cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuY2FsY3VsYXRlVG90YWwoKTtcclxuICB9XHJcblxyXG4gIGNhbGN1bGF0ZVRvdGFsKGNob2ljZT86c3RyaW5nKSB7XHJcbiAgICB0aGlzLnJhdGVQZXJVbml0QW1vdW50ID0gMDtcclxuICAgIHRoaXMudG90YWxBbW91bnQgPSAwO1xyXG4gICAgdGhpcy50b3RhbEFtb3VudE9mTGFib3VyID0gMDtcclxuICAgIHRoaXMudG90YWxBbW91bnRPZk1hdGVyaWFsPTA7XHJcbiAgICB0aGlzLnRvdGFsQW1vdW50T2ZNYXRlcmlhbEFuZExhYm91ciA9IDA7XHJcblxyXG4gICAgZm9yIChsZXQgcmF0ZUl0ZW1zSW5kZXggaW4gdGhpcy5yYXRlLnJhdGVJdGVtcykge1xyXG4gICAgICBpZihjaG9pY2UgPT09ICdjaGFuZ2VUb3RhbFF1YW50aXR5Jykge1xyXG4gICAgICAgIHRoaXMucmF0ZS5yYXRlSXRlbXNbcmF0ZUl0ZW1zSW5kZXhdLnF1YW50aXR5ID0gcGFyc2VGbG9hdCgoXHJcbiAgICAgICAgICB0aGlzLnJhdGUucmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS5xdWFudGl0eSAqXHJcbiAgICAgICAgICB0aGlzLnF1YW50aXR5SW5jcmVtZW50KS50b0ZpeGVkKFZhbHVlQ29uc3RhbnQuTlVNQkVSX09GX0ZSQUNUSU9OX0RJR0lUKSk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy50eXBlID0gdGhpcy5yYXRlLnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0udHlwZTtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xyXG4gICAgICAgICAgY2FzZSAnTScgOlxyXG4gICAgICAgICAgICAgIHRoaXMucmF0ZS5yYXRlSXRlbXNbcmF0ZUl0ZW1zSW5kZXhdLnRvdGFsQW1vdW50ID0gdGhpcy5yYXRlLnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0ucXVhbnRpdHkgKlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yYXRlLnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0ucmF0ZTtcclxuXHJcbiAgICAgICAgICAgICAgdGhpcy50b3RhbEFtb3VudE9mTWF0ZXJpYWwgPSB0aGlzLnRvdGFsQW1vdW50T2ZNYXRlcmlhbCArIHRoaXMucmF0ZS5yYXRlSXRlbXNbcmF0ZUl0ZW1zSW5kZXhdLnRvdGFsQW1vdW50O1xyXG5cclxuICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgY2FzZSAnTCcgOlxyXG4gICAgICAgICAgICAgIHRoaXMucmF0ZS5yYXRlSXRlbXNbcmF0ZUl0ZW1zSW5kZXhdLnRvdGFsQW1vdW50ID0gdGhpcy5yYXRlLnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0ucXVhbnRpdHkgKlxyXG4gICAgICAgICAgICAgICAgdGhpcy5yYXRlLnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0ucmF0ZTtcclxuXHJcbiAgICAgICAgICAgICAgdGhpcy50b3RhbEFtb3VudE9mTGFib3VyID0gdGhpcy50b3RhbEFtb3VudE9mTGFib3VyICsgdGhpcy5yYXRlLnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0udG90YWxBbW91bnQ7XHJcblxyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIGNhc2UgJ00gKyBMJyA6XHJcbiAgICAgICAgICAgICAgdGhpcy5yYXRlLnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0udG90YWxBbW91bnQgPSB0aGlzLnJhdGUucmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS5xdWFudGl0eSAqXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhdGUucmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS5yYXRlO1xyXG5cclxuICAgICAgICAgICAgICB0aGlzLnRvdGFsQW1vdW50T2ZNYXRlcmlhbEFuZExhYm91ciA9IHRoaXMudG90YWxBbW91bnRPZk1hdGVyaWFsQW5kTGFib3VyICtcclxuICAgICAgICAgICAgICAgICB0aGlzLnJhdGUucmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS50b3RhbEFtb3VudDtcclxuXHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICB0aGlzLnRvdGFsQW1vdW50ID0gdGhpcy50b3RhbEFtb3VudE9mTWF0ZXJpYWwgKyB0aGlzLnRvdGFsQW1vdW50T2ZMYWJvdXIgK3RoaXMudG90YWxBbW91bnRPZk1hdGVyaWFsQW5kTGFib3VyO1xyXG4gICAgfVxyXG4gICAgdGhpcy5yYXRlUGVyVW5pdEFtb3VudCA9IHRoaXMudG90YWxBbW91bnQgLyB0aGlzLnJhdGUucXVhbnRpdHk7XHJcbiAgICB0aGlzLnJhdGUudG90YWw9IHRoaXMucmF0ZVBlclVuaXRBbW91bnQ7XHJcbiAgICB9XHJcbiAgdXBkYXRlUmF0ZShyYXRlSXRlbXNBcnJheTogUmF0ZSkge1xyXG4gICAgaWYgKHRoaXMudmFsaWRhdGVSYXRlSXRlbShyYXRlSXRlbXNBcnJheS5yYXRlSXRlbXMpKSB7XHJcbiAgICAgIHRoaXMubG9hZGVyU2VydmljZS5zdGFydCgpO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9DT1NUX0hFQURfSUQpKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPSBwYXJzZUludChTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfV09SS0lURU1fSUQpKTtcclxuXHJcbiAgICAgIGxldCByYXRlID0gbmV3IFJhdGUoKTtcclxuICAgICAgcmF0ZS5yYXRlRnJvbVJhdGVBbmFseXNpcyA9IHJhdGVJdGVtc0FycmF5LnJhdGVGcm9tUmF0ZUFuYWx5c2lzO1xyXG4gICAgICByYXRlLnRvdGFsID0gdGhpcy5jb21tb25TZXJ2aWNlLmRlY2ltYWxDb252ZXJzaW9uKHJhdGVJdGVtc0FycmF5LnRvdGFsKTtcclxuICAgICAgcmF0ZS5xdWFudGl0eSA9IHJhdGVJdGVtc0FycmF5LnF1YW50aXR5O1xyXG4gICAgICByYXRlLnVuaXQgPSByYXRlSXRlbXNBcnJheS51bml0O1xyXG4gICAgICByYXRlLnJhdGVJdGVtcyA9IHJhdGVJdGVtc0FycmF5LnJhdGVJdGVtcztcclxuICAgICAgcmF0ZS5pbWFnZVVSTCA9IHJhdGVJdGVtc0FycmF5LmltYWdlVVJMO1xyXG4gICAgICByYXRlLm5vdGVzID0gcmF0ZUl0ZW1zQXJyYXkubm90ZXM7XHJcblxyXG4gICAgICB0aGlzLmNvc3RTdW1tYXJ5U2VydmljZS51cGRhdGVSYXRlKHRoaXMuYmFzZVVybCwgY29zdEhlYWRJZCwgdGhpcy5jYXRlZ29yeVJhdGVBbmFseXNpc0lkLCB3b3JrSXRlbUlkLCByYXRlKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgc3VjY2VzcyA9PiB0aGlzLm9uVXBkYXRlUmF0ZVN1Y2Nlc3Moc3VjY2VzcyksXHJcbiAgICAgICAgZXJyb3IgPT4gdGhpcy5vblVwZGF0ZVJhdGVGYWlsdXJlKGVycm9yKVxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19FUlJPUl9WQUxJREFUSU9OX1FVQU5USVRZX1JFUVVJUkVEO1xyXG4gICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YWxpZGF0ZVJhdGVJdGVtKHJhdGVJdGVtcyA6IEFycmF5PFJhdGVJdGVtPikge1xyXG4gICAgZm9yKGxldCByYXRlSXRlbURhdGEgb2YgcmF0ZUl0ZW1zKSB7XHJcbiAgICAgIGlmKChyYXRlSXRlbURhdGEuaXRlbU5hbWUgPT09IG51bGwgfHwgcmF0ZUl0ZW1EYXRhLml0ZW1OYW1lID09PSB1bmRlZmluZWQgfHwgcmF0ZUl0ZW1EYXRhLml0ZW1OYW1lLnRyaW0oKSA9PT0gJycpIHx8XHJcbiAgICAgICAgKHJhdGVJdGVtRGF0YS5yYXRlID09PSB1bmRlZmluZWQgfHwgcmF0ZUl0ZW1EYXRhLnJhdGUgPT09IG51bGwpIHx8XHJcbiAgICAgICAgKHJhdGVJdGVtRGF0YS5xdWFudGl0eSA9PT0gdW5kZWZpbmVkIHx8IHJhdGVJdGVtRGF0YS5xdWFudGl0eSA9PT0gbnVsbCkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgb25VcGRhdGVSYXRlU3VjY2VzcyhzdWNjZXNzIDogc3RyaW5nKSB7XHJcbiAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgIG1lc3NhZ2UuY3VzdG9tX21lc3NhZ2UgPSBNZXNzYWdlcy5NU0dfU1VDQ0VTU19VUERBVEVfUkFURTtcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuXHJcbiAgICBmb3IobGV0IHdvcmtJdGVtRGF0YSBvZiB0aGlzLndvcmtJdGVtc0xpc3QpIHtcclxuICAgICAgaWYod29ya0l0ZW1EYXRhLnJhdGVBbmFseXNpc0lkID09PSB0aGlzLndvcmtJdGVtUmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICB3b3JrSXRlbURhdGEucmF0ZS50b3RhbCA9IHRoaXMucmF0ZVBlclVuaXRBbW91bnQ7XHJcbiAgICAgICAgaWYod29ya0l0ZW1EYXRhLnJhdGUudG90YWwgIT09IDApIHtcclxuICAgICAgICAgIHdvcmtJdGVtRGF0YS5yYXRlLmlzRXN0aW1hdGVkID0gdHJ1ZTtcclxuICAgICAgICAgIGlmKHdvcmtJdGVtRGF0YS5xdWFudGl0eS5pc0VzdGltYXRlZCAmJiB3b3JrSXRlbURhdGEucmF0ZS5pc0VzdGltYXRlZCkge1xyXG4gICAgICAgICAgICB3b3JrSXRlbURhdGEuYW1vdW50ID0gdGhpcy5jb21tb25TZXJ2aWNlLmNhbGN1bGF0ZUFtb3VudE9mV29ya0l0ZW0od29ya0l0ZW1EYXRhLnF1YW50aXR5LnRvdGFsLFxyXG4gICAgICAgICAgICAgIHdvcmtJdGVtRGF0YS5yYXRlLnRvdGFsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgd29ya0l0ZW1EYXRhLnJhdGUuaXNFc3RpbWF0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgIHdvcmtJdGVtRGF0YS5hbW91bnQgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBjYXRlZ29yaWVzVG90YWw9IHRoaXMuY29tbW9uU2VydmljZS50b3RhbENhbGN1bGF0aW9uT2ZDYXRlZ29yaWVzKHRoaXMuY2F0ZWdvcnlEZXRhaWxzLFxyXG4gICAgdGhpcy5jYXRlZ29yeVJhdGVBbmFseXNpc0lkLCB0aGlzLndvcmtJdGVtc0xpc3QpO1xyXG4gICAgdGhpcy5jYXRlZ29yaWVzVG90YWxBbW91bnQuZW1pdChjYXRlZ29yaWVzVG90YWwpO1xyXG4gICAgLy90aGlzLnNob3dXb3JrSXRlbVRhYk5hbWUuZW1pdCgnJyk7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgb25VcGRhdGVSYXRlRmFpbHVyZShlcnJvcjogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgb25Ub3RhbFF1YW50aXR5Q2hhbmdlKG5ld1RvdGFsUXVhbnRpdHk6IG51bWJlcikge1xyXG5cclxuICAgIGlmIChuZXdUb3RhbFF1YW50aXR5ID09PSAwIHx8IG5ld1RvdGFsUXVhbnRpdHkgPT09IG51bGwpIHtcclxuXHJcbiAgICAgICAgbmV3VG90YWxRdWFudGl0eT0xO1xyXG4gICAgICAgIHRoaXMudG90YWxJdGVtUmF0ZVF1YW50aXR5ID0gbmV3VG90YWxRdWFudGl0eTtcclxuICAgICAgICB0aGlzLnJhdGUucXVhbnRpdHkgPSBuZXdUb3RhbFF1YW50aXR5O1xyXG4gICAgICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgICAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgICAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1FVQU5USVRZX1NIT1VMRF9OT1RfWkVST19PUl9OVUxMO1xyXG4gICAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5xdWFudGl0eUluY3JlbWVudCA9IG5ld1RvdGFsUXVhbnRpdHkgLyB0aGlzLnByZXZpb3VzVG90YWxRdWFudGl0eTtcclxuICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVG90YWwoJ2NoYW5nZVRvdGFsUXVhbnRpdHknKTtcclxuICAgICAgICAgIHRoaXMudG90YWxJdGVtUmF0ZVF1YW50aXR5ID0gbmV3VG90YWxRdWFudGl0eTtcclxuICAgICAgICAgIHRoaXMucmF0ZS5xdWFudGl0eSA9IG5ld1RvdGFsUXVhbnRpdHk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0UHJldmlvdXNRdWFudGl0eShwcmV2aW91c1RvdGFsUXVhbnRpdHk6IG51bWJlcikge1xyXG4gICAgdGhpcy5wcmV2aW91c1RvdGFsUXVhbnRpdHkgPSBwcmV2aW91c1RvdGFsUXVhbnRpdHk7XHJcbiAgfVxyXG5cclxuICBnZXRJdGVtTmFtZShldmVudCA6IGFueSkge1xyXG5cclxuICAgIGlmIChldmVudC50YXJnZXQudmFsdWUgIT09ICcnKSB7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtTmFtZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gJyc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRJdGVtTmFtZShldmVudCA6IGFueSkge1xyXG4gICAgaWYgKGV2ZW50LnRhcmdldC52YWx1ZSA9PT0gJycpIHtcclxuICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gdGhpcy5zZWxlY3RlZEl0ZW1OYW1lO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0UmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWUocmF0ZUl0ZW06IGFueSwgaW5kZXg6bnVtYmVyKSB7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRSYXRlSXRlbSA9IHJhdGVJdGVtO1xyXG4gICAgICB0aGlzLnNlbGVjdGVkUmF0ZUl0ZW1JbmRleCA9IGluZGV4O1xyXG5cclxuICAgICAgdGhpcy5jb3N0U3VtbWFyeVNlcnZpY2UuZ2V0UmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWUodGhpcy5iYXNlVXJsLCByYXRlSXRlbS5vcmlnaW5hbEl0ZW1OYW1lKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgcmF0ZUl0ZW1zRGF0YSA9PiB0aGlzLm9uR2V0UmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWVTdWNjZXNzKHJhdGVJdGVtc0RhdGEuZGF0YSksXHJcbiAgICAgICAgZXJyb3IgPT4gdGhpcy5vbkdldFJhdGVJdGVtc0J5T3JpZ2luYWxOYW1lRmFpbHVyZShlcnJvcilcclxuICAgICAgKTtcclxuICB9XHJcblxyXG4gIG9uR2V0UmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWVTdWNjZXNzKHJhdGVJdGVtc0RhdGE6IGFueSkge1xyXG4gICAgICB0aGlzLmFycmF5T2ZSYXRlSXRlbXMgPSByYXRlSXRlbXNEYXRhO1xyXG4gIH1cclxuXHJcbiAgc2V0UmF0ZShyYXRlSXRlbXNEYXRhIDogYW55KSB7XHJcblxyXG4gICAgbGV0IHNlbGVjdGVkSXRlbU5hbWUgPSB0aGlzLnNlbGVjdGVkUmF0ZUl0ZW0uaXRlbU5hbWU7XHJcbiAgICBsZXQgcmF0ZUl0ZW1EYXRhIDogQXJyYXk8UmF0ZUl0ZW0+ID0gcmF0ZUl0ZW1zRGF0YS5maWx0ZXIoXHJcbiAgICAgIGZ1bmN0aW9uKCByYXRlSXRlbURhdGExOiBhbnkpe1xyXG4gICAgICAgIHJldHVybiByYXRlSXRlbURhdGExLml0ZW1OYW1lID09PSBzZWxlY3RlZEl0ZW1OYW1lO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICBpZihyYXRlSXRlbURhdGEubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgIGxldCByYXRlSXRlbXM6IEFycmF5PFJhdGVJdGVtPiA9IHRoaXMucmF0ZS5yYXRlSXRlbXMuZmlsdGVyKFxyXG4gICAgICAgIGZ1bmN0aW9uIChyYXRlSXRlbXM6IGFueSkge1xyXG4gICAgICAgICAgcmV0dXJuIHJhdGVJdGVtcy5pdGVtTmFtZSA9PT0gc2VsZWN0ZWRJdGVtTmFtZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIHJhdGVJdGVtc1swXS5yYXRlID0gcmF0ZUl0ZW1EYXRhWzBdLnJhdGU7XHJcblxyXG4gICAgICB0aGlzLmNhbGN1bGF0ZVRvdGFsKCk7XHJcblxyXG4gICAgICBsZXQgd29ya0l0ZW1SYXRlQW5hbHlzaXNJZCA9IHRoaXMud29ya0l0ZW1SYXRlQW5hbHlzaXNJZDtcclxuICAgICAgbGV0IHdvcmtJdGVtRGF0YTogQXJyYXk8V29ya0l0ZW0+ID0gdGhpcy53b3JrSXRlbXNMaXN0LmZpbHRlcihcclxuICAgICAgICBmdW5jdGlvbiAod29ya0l0ZW1EYXRhOiBhbnkpIHtcclxuICAgICAgICAgIHJldHVybiB3b3JrSXRlbURhdGEucmF0ZUFuYWx5c2lzSWQgPT09IHdvcmtJdGVtUmF0ZUFuYWx5c2lzSWQ7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB3b3JrSXRlbURhdGFbMF0ucmF0ZSA9IHRoaXMucmF0ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNsb3NlUmF0ZVRhYigpIHtcclxuICAgIHRoaXMuY2xvc2VSYXRlVmlldy5lbWl0KCk7XHJcbiAgfVxyXG5cclxuICBvbkdldFJhdGVJdGVtc0J5T3JpZ2luYWxOYW1lRmFpbHVyZShlcnJvcjogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgfVxyXG5cclxuICBnZXRCdXR0b24oKSB7XHJcbiAgICByZXR1cm4gQnV0dG9uO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGFibGVIZWFkaW5ncygpIHtcclxuICAgIHJldHVybiBUYWJsZUhlYWRpbmdzO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGFiZWwoKSB7XHJcbiAgICByZXR1cm4gTGFiZWw7XHJcbiAgfVxyXG5cclxuICBnZXRIZWFkaW5ncygpIHtcclxuICAgIHJldHVybiBIZWFkaW5ncztcclxuICB9XHJcbn1cclxuIl19
