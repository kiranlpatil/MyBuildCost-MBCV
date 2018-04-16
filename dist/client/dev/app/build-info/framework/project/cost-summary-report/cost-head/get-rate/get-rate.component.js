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
        this.quantityIncrement = 1;
        this.previousTotalQuantity = 1;
        this.totalItemRateQuantity = 0;
    }
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
    GetRateComponent.prototype.calculateTotal = function (choice) {
        this.ratePerUnitAmount = 0;
        this.totalAmount = 0;
        this.totalAmountOfLabour = 0;
        this.totalAmountOfMaterial = 0;
        this.totalAmountOfMaterialAndLabour = 0;
        for (var rateItemsIndex in this.rate.rateItems) {
            if (choice === 'changeTotalQuantity') {
                this.rate.rateItems[rateItemsIndex].quantity = this.commonService.decimalConversion(this.rate.rateItems[rateItemsIndex].quantity *
                    this.quantityIncrement);
            }
            this.type = this.rate.rateItems[rateItemsIndex].type;
            switch (this.type) {
                case 'M':
                    this.rate.rateItems[rateItemsIndex].totalAmount = this.commonService.decimalConversion(this.rate.rateItems[rateItemsIndex].quantity * this.rate.rateItems[rateItemsIndex].rate);
                    this.totalAmountOfMaterial = Math.round(this.totalAmountOfMaterial + this.rate.rateItems[rateItemsIndex].totalAmount);
                    break;
                case 'L':
                    this.rate.rateItems[rateItemsIndex].totalAmount = this.commonService.decimalConversion(this.rate.rateItems[rateItemsIndex].quantity * this.rate.rateItems[rateItemsIndex].rate);
                    this.totalAmountOfLabour = Math.round(this.totalAmountOfLabour + this.rate.rateItems[rateItemsIndex].totalAmount);
                    break;
                case 'M + L':
                    this.rate.rateItems[rateItemsIndex].totalAmount = this.commonService.decimalConversion(this.rate.rateItems[rateItemsIndex].quantity * this.rate.rateItems[rateItemsIndex].rate);
                    this.totalAmountOfMaterialAndLabour = Math.round(this.totalAmountOfMaterialAndLabour +
                        this.rate.rateItems[rateItemsIndex].totalAmount);
                    break;
            }
            this.totalAmount = this.totalAmountOfMaterial + this.totalAmountOfLabour + this.totalAmountOfMaterialAndLabour;
            this.totalAmount = Math.round(this.totalAmount);
        }
        this.ratePerUnitAmount = this.commonService.decimalConversion(this.totalAmount / this.rate.quantity);
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
        this.showWorkItemTabName.emit('');
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
    GetRateComponent.prototype.getRateItemsByOriginalName = function (rateItem, rateItemKey, index) {
        var _this = this;
        this.selectedRateItem = rateItem;
        this.selectedRateItemIndex = index;
        this.selectedRateItemKey = rateItemKey;
        this.costSummaryService.getRateItemsByOriginalName(this.baseUrl, rateItem.originalItemName).subscribe(function (rateItemsData) { return _this.onGetRateItemsByOriginalNameSuccess(rateItemsData.data); }, function (error) { return _this.onGetRateItemsByOriginalNameFailure(error); });
    };
    GetRateComponent.prototype.onGetRateItemsByOriginalNameSuccess = function (rateItemsData) {
        this.arrayOfRateItems = rateItemsData;
        for (var _i = 0, rateItemsData_1 = rateItemsData; _i < rateItemsData_1.length; _i++) {
            var rateItemData = rateItemsData_1[_i];
            if (rateItemData.itemName === this.selectedRateItem.itemName) {
                for (var _a = 0, _b = this.rate.rateItems; _a < _b.length; _a++) {
                    var rateItem = _b[_a];
                    if (rateItem.type === this.selectedRateItemKey && rateItem.itemName === this.selectedRateItem.itemName) {
                        rateItem.rate = rateItemData.rate;
                        this.calculateTotal();
                    }
                }
            }
        }
        for (var _c = 0, _d = this.workItemsList; _c < _d.length; _c++) {
            var workItemData = _d[_c];
            if (workItemData.rateAnalysisId === this.workItemRateAnalysisId) {
                workItemData.rate = this.rate;
            }
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
    ], GetRateComponent.prototype, "totalAmount", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], GetRateComponent.prototype, "ratePerUnitAmount", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], GetRateComponent.prototype, "totalAmountOfMaterial", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], GetRateComponent.prototype, "totalAmountOfLabour", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], GetRateComponent.prototype, "totalAmountOfMaterialAndLabour", void 0);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1oZWFkL2dldC1yYXRlL2dldC1yYXRlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUE0RjtBQUM1RixnRUFBcUg7QUFDckgsd0RBR3dDO0FBQ3hDLHFFQUFrRTtBQUNsRSwrQ0FBOEM7QUFDOUMsbUZBQWdGO0FBR2hGLDBGQUF3RjtBQVd4RjtJQStCRSwwQkFBb0Isa0JBQXNDLEVBQVcsYUFBNEIsRUFDN0UsY0FBOEIsRUFBVSxhQUE0QjtRQURwRSx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQVcsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDN0UsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFoQjlFLDBCQUFxQixHQUFHLElBQUksbUJBQVksRUFBVSxDQUFDO1FBQ25ELHdCQUFtQixHQUFHLElBQUksbUJBQVksRUFBVSxDQUFDO1FBQ2pELHdCQUFtQixHQUFHLElBQUksbUJBQVksRUFBRSxDQUFDO1FBQ3pDLGtCQUFhLEdBQUcsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFFN0Msc0JBQWlCLEdBQVcsQ0FBQyxDQUFDO1FBQzlCLDBCQUFxQixHQUFXLENBQUMsQ0FBQztRQUNsQywwQkFBcUIsR0FBVyxDQUFDLENBQUM7SUFVbEMsQ0FBQztJQUVELHNDQUFXLEdBQVgsVUFBWSxLQUFXO1FBRXJCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQzNDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUMxQixDQUFDO0lBQ0gsQ0FBQztJQUVELHNDQUFX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RDtRQUFULGFBQU0sRUFBRTs7aUVBQWtEO0lBQ2pEO1FBQVQsYUFBTSxFQUFFOztpRUFBMEM7SUFDekM7UUFBVCxhQUFNLEVBQUU7OzJEQUFvQztJQW5CbEMsZ0JBQWdCO1FBUDVCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLGFBQWE7WUFDdkIsV0FBVyxFQUFFLHlCQUF5QjtZQUN0QyxTQUFTLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQztTQUN0QyxDQUFDO3lDQWlDd0MseUNBQWtCLEVBQTBCLCtCQUFhO1lBQzdELHNCQUFjLEVBQXlCLDhCQUFhO09BaEM3RSxnQkFBZ0IsQ0F3UDVCO0lBQUQsdUJBQUM7Q0F4UEQsQUF3UEMsSUFBQTtBQXhQWSw0Q0FBZ0IiLCJmaWxlIjoiYXBwL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvY29zdC1zdW1tYXJ5LXJlcG9ydC9jb3N0LWhlYWQvZ2V0LXJhdGUvZ2V0LXJhdGUuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgVmlld0NoaWxkLCBFbGVtZW50UmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTWVzc2FnZXMsIEJ1dHRvbiwgVGFibGVIZWFkaW5ncywgTGFiZWwsIEhlYWRpbmdzLCBWYWx1ZUNvbnN0YW50IH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7XHJcbiAgU2Vzc2lvblN0b3JhZ2UsIFNlc3Npb25TdG9yYWdlU2VydmljZSxcclxuICBNZXNzYWdlLCBNZXNzYWdlU2VydmljZVxyXG59IGZyb20gJy4uLy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IENvc3RTdW1tYXJ5U2VydmljZSB9IGZyb20gJy4vLi4vLi4vY29zdC1zdW1tYXJ5LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBSYXRlIH0gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWwvcmF0ZSc7XHJcbmltcG9ydCB7IExvYWRlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi9zaGFyZWQvbG9hZGVyL2xvYWRlcnMuc2VydmljZSc7XHJcbmltcG9ydCB7IFdvcmtJdGVtIH0gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWwvd29yay1pdGVtJztcclxuaW1wb3J0IHsgQ2F0ZWdvcnkgfSBmcm9tICcuLi8uLi8uLi8uLi9tb2RlbC9jYXRlZ29yeSc7XHJcbmltcG9ydCB7IENvbW1vblNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi8uLi9hcHAvc2hhcmVkL3NlcnZpY2VzL2NvbW1vbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmF0ZUl0ZW0gfSBmcm9tICcuLi8uLi8uLi8uLi9tb2RlbC9yYXRlLWl0ZW0nO1xyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICdiaS1nZXQtcmF0ZScsXHJcbiAgdGVtcGxhdGVVcmw6ICdnZXQtcmF0ZS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJ2dldC1yYXRlLmNvbXBvbmVudC5jc3MnXSxcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBHZXRSYXRlQ29tcG9uZW50IHtcclxuXHJcbiAgQElucHV0KCkgcmF0ZTogUmF0ZTtcclxuICBASW5wdXQoKSBjYXRlZ29yeURldGFpbHMgOiAgQXJyYXk8Q2F0ZWdvcnk+O1xyXG4gIEBJbnB1dCgpIGNhdGVnb3J5UmF0ZUFuYWx5c2lzSWQgOiBudW1iZXI7XHJcbiAgQElucHV0KCkgd29ya0l0ZW1SYXRlQW5hbHlzaXNJZCA6IG51bWJlcjtcclxuICBASW5wdXQoKSB3b3JrSXRlbXNMaXN0IDogQXJyYXk8V29ya0l0ZW0+O1xyXG4gIEBJbnB1dCgpIHRvdGFsQW1vdW50OiBudW1iZXI7XHJcbiAgQElucHV0KCkgcmF0ZVBlclVuaXRBbW91bnQgOiBudW1iZXI7XHJcbiAgQElucHV0KCkgdG90YWxBbW91bnRPZk1hdGVyaWFsOiBudW1iZXI7XHJcbiAgQElucHV0KCkgdG90YWxBbW91bnRPZkxhYm91cjogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIHRvdGFsQW1vdW50T2ZNYXRlcmlhbEFuZExhYm91cjogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIGJhc2VVcmwgOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgcmF0ZVZpZXc6IHN0cmluZztcclxuICBASW5wdXQoKSBkaXNhYmxlUmF0ZUZpZWxkOiBib29sZWFuO1xyXG5cclxuICBAT3V0cHV0KCkgY2F0ZWdvcmllc1RvdGFsQW1vdW50ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XHJcbiAgQE91dHB1dCgpIHNob3dXb3JrSXRlbVRhYk5hbWUgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcclxuICBAT3V0cHV0KCkgcmVmcmVzaENhdGVnb3J5TGlzdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgY2xvc2VSYXRlVmlldyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgcXVhbnRpdHlJbmNyZW1lbnQ6IG51bWJlciA9IDE7XHJcbiAgcHJldmlvdXNUb3RhbFF1YW50aXR5OiBudW1iZXIgPSAxO1xyXG4gIHRvdGFsSXRlbVJhdGVRdWFudGl0eTogbnVtYmVyID0gMDtcclxuICBhcnJheU9mUmF0ZUl0ZW1zOiBBcnJheTxSYXRlSXRlbT47XHJcbiAgc2VsZWN0ZWRSYXRlSXRlbTpSYXRlSXRlbTtcclxuICBzZWxlY3RlZFJhdGVJdGVtSW5kZXg6bnVtYmVyO1xyXG4gIHNlbGVjdGVkUmF0ZUl0ZW1LZXkgOiBzdHJpbmc7XHJcbiAgdHlwZSA6IHN0cmluZztcclxuICBzZWxlY3RlZEl0ZW1OYW1lOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29zdFN1bW1hcnlTZXJ2aWNlOiBDb3N0U3VtbWFyeVNlcnZpY2UsICBwcml2YXRlIGxvYWRlclNlcnZpY2U6IExvYWRlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBtZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UsIHByaXZhdGUgY29tbW9uU2VydmljZTogQ29tbW9uU2VydmljZSkge1xyXG4gIH1cclxuXHJcbiAgZ2V0SXRlbU5hbWUoZXZlbnQgOiBhbnkpIHtcclxuXHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0LnZhbHVlICE9PSAnJykge1xyXG4gICAgICB0aGlzLnNlbGVjdGVkSXRlbU5hbWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICAgIGV2ZW50LnRhcmdldC52YWx1ZSA9ICcnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0SXRlbU5hbWUoZXZlbnQgOiBhbnkpIHtcclxuICAgIGlmIChldmVudC50YXJnZXQudmFsdWUgPT09ICcnKSB7XHJcbiAgICAgIGV2ZW50LnRhcmdldC52YWx1ZSA9IHRoaXMuc2VsZWN0ZWRJdGVtTmFtZTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICBjYWxjdWxhdGVUb3RhbChjaG9pY2U/OnN0cmluZykge1xyXG4gICAgdGhpcy5yYXRlUGVyVW5pdEFtb3VudCA9IDA7XHJcbiAgICB0aGlzLnRvdGFsQW1vdW50ID0gMDtcclxuICAgIHRoaXMudG90YWxBbW91bnRPZkxhYm91ciA9IDA7XHJcbiAgICB0aGlzLnRvdGFsQW1vdW50T2ZNYXRlcmlhbD0wO1xyXG4gICAgdGhpcy50b3RhbEFtb3VudE9mTWF0ZXJpYWxBbmRMYWJvdXIgPSAwO1xyXG5cclxuICAgIGZvciAobGV0IHJhdGVJdGVtc0luZGV4IGluIHRoaXMucmF0ZS5yYXRlSXRlbXMpIHtcclxuICAgICAgaWYoY2hvaWNlID09PSAnY2hhbmdlVG90YWxRdWFudGl0eScpIHtcclxuICAgICAgICB0aGlzLnJhdGUucmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS5xdWFudGl0eSA9IHRoaXMuY29tbW9uU2VydmljZS5kZWNpbWFsQ29udmVyc2lvbih0aGlzLnJhdGUucmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS5xdWFudGl0eSAqXHJcbiAgICAgICAgICB0aGlzLnF1YW50aXR5SW5jcmVtZW50KTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnR5cGUgPSB0aGlzLnJhdGUucmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS50eXBlO1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XHJcbiAgICAgICAgICBjYXNlICdNJyA6XHJcbiAgICAgICAgICAgICAgdGhpcy5yYXRlLnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0udG90YWxBbW91bnQgPSB0aGlzLmNvbW1vblNlcnZpY2UuZGVjaW1hbENvbnZlcnNpb24oXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhdGUucmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS5xdWFudGl0eSAqIHRoaXMucmF0ZS5yYXRlSXRlbXNbcmF0ZUl0ZW1zSW5kZXhdLnJhdGUpO1xyXG5cclxuICAgICAgICAgICAgICB0aGlzLnRvdGFsQW1vdW50T2ZNYXRlcmlhbCA9IE1hdGgucm91bmQodGhpcy50b3RhbEFtb3VudE9mTWF0ZXJpYWwgKyB0aGlzLnJhdGUucmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS50b3RhbEFtb3VudCk7XHJcblxyXG4gICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICBjYXNlICdMJyA6XHJcbiAgICAgICAgICAgICAgdGhpcy5yYXRlLnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0udG90YWxBbW91bnQgPSB0aGlzLmNvbW1vblNlcnZpY2UuZGVjaW1hbENvbnZlcnNpb24oXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhdGUucmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS5xdWFudGl0eSAqIHRoaXMucmF0ZS5yYXRlSXRlbXNbcmF0ZUl0ZW1zSW5kZXhdLnJhdGUpO1xyXG5cclxuICAgICAgICAgICAgICB0aGlzLnRvdGFsQW1vdW50T2ZMYWJvdXIgPSBNYXRoLnJvdW5kKHRoaXMudG90YWxBbW91bnRPZkxhYm91ciArIHRoaXMucmF0ZS5yYXRlSXRlbXNbcmF0ZUl0ZW1zSW5kZXhdLnRvdGFsQW1vdW50KTtcclxuXHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgY2FzZSAnTSArIEwnIDpcclxuICAgICAgICAgICAgICB0aGlzLnJhdGUucmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS50b3RhbEFtb3VudCA9IHRoaXMuY29tbW9uU2VydmljZS5kZWNpbWFsQ29udmVyc2lvbihcclxuICAgICAgICAgICAgICAgIHRoaXMucmF0ZS5yYXRlSXRlbXNbcmF0ZUl0ZW1zSW5kZXhdLnF1YW50aXR5ICogdGhpcy5yYXRlLnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0ucmF0ZSk7XHJcblxyXG4gICAgICAgICAgICAgIHRoaXMudG90YWxBbW91bnRPZk1hdGVyaWFsQW5kTGFib3VyID0gTWF0aC5yb3VuZCh0aGlzLnRvdGFsQW1vdW50T2ZNYXRlcmlhbEFuZExhYm91ciArXHJcbiAgICAgICAgICAgICAgICAgdGhpcy5yYXRlLnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0udG90YWxBbW91bnQpO1xyXG5cclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgIHRoaXMudG90YWxBbW91bnQgPSB0aGlzLnRvdGFsQW1vdW50T2ZNYXRlcmlhbCArIHRoaXMudG90YWxBbW91bnRPZkxhYm91ciArdGhpcy50b3RhbEFtb3VudE9mTWF0ZXJpYWxBbmRMYWJvdXI7XHJcbiAgICAgICAgdGhpcy50b3RhbEFtb3VudCA9IE1hdGgucm91bmQodGhpcy50b3RhbEFtb3VudCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnJhdGVQZXJVbml0QW1vdW50ID0gdGhpcy5jb21tb25TZXJ2aWNlLmRlY2ltYWxDb252ZXJzaW9uKHRoaXMudG90YWxBbW91bnQgLyB0aGlzLnJhdGUucXVhbnRpdHkpO1xyXG5cclxuICB9XHJcbiAgdXBkYXRlUmF0ZShyYXRlSXRlbXNBcnJheTogUmF0ZSkge1xyXG4gICAgaWYgKHRoaXMudmFsaWRhdGVSYXRlSXRlbShyYXRlSXRlbXNBcnJheS5yYXRlSXRlbXMpKSB7XHJcbiAgICAgIHRoaXMubG9hZGVyU2VydmljZS5zdGFydCgpO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlSW50KFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9DT1NUX0hFQURfSUQpKTtcclxuICAgICAgbGV0IHdvcmtJdGVtSWQgPSBwYXJzZUludChTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfV09SS0lURU1fSUQpKTtcclxuXHJcbiAgICAgIGxldCByYXRlID0gbmV3IFJhdGUoKTtcclxuICAgICAgcmF0ZS5yYXRlRnJvbVJhdGVBbmFseXNpcyA9IHJhdGVJdGVtc0FycmF5LnJhdGVGcm9tUmF0ZUFuYWx5c2lzO1xyXG4gICAgICByYXRlLnRvdGFsID0gdGhpcy5jb21tb25TZXJ2aWNlLmRlY2ltYWxDb252ZXJzaW9uKHJhdGVJdGVtc0FycmF5LnRvdGFsKTtcclxuICAgICAgcmF0ZS5xdWFudGl0eSA9IHJhdGVJdGVtc0FycmF5LnF1YW50aXR5O1xyXG4gICAgICByYXRlLnVuaXQgPSByYXRlSXRlbXNBcnJheS51bml0O1xyXG4gICAgICByYXRlLnJhdGVJdGVtcyA9IHJhdGVJdGVtc0FycmF5LnJhdGVJdGVtcztcclxuICAgICAgcmF0ZS5pbWFnZVVSTCA9IHJhdGVJdGVtc0FycmF5LmltYWdlVVJMO1xyXG4gICAgICByYXRlLm5vdGVzID0gcmF0ZUl0ZW1zQXJyYXkubm90ZXM7XHJcblxyXG4gICAgICB0aGlzLmNvc3RTdW1tYXJ5U2VydmljZS51cGRhdGVSYXRlKHRoaXMuYmFzZVVybCwgY29zdEhlYWRJZCwgdGhpcy5jYXRlZ29yeVJhdGVBbmFseXNpc0lkLCB3b3JrSXRlbUlkLCByYXRlKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgc3VjY2VzcyA9PiB0aGlzLm9uVXBkYXRlUmF0ZVN1Y2Nlc3Moc3VjY2VzcyksXHJcbiAgICAgICAgZXJyb3IgPT4gdGhpcy5vblVwZGF0ZVJhdGVGYWlsdXJlKGVycm9yKVxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19FUlJPUl9WQUxJREFUSU9OX1FVQU5USVRZX1JFUVVJUkVEO1xyXG4gICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YWxpZGF0ZVJhdGVJdGVtKHJhdGVJdGVtcyA6IEFycmF5PFJhdGVJdGVtPikge1xyXG4gICAgZm9yKGxldCByYXRlSXRlbURhdGEgb2YgcmF0ZUl0ZW1zKSB7XHJcbiAgICAgIGlmKChyYXRlSXRlbURhdGEuaXRlbU5hbWUgPT09IG51bGwgfHwgcmF0ZUl0ZW1EYXRhLml0ZW1OYW1lID09PSB1bmRlZmluZWQgfHwgcmF0ZUl0ZW1EYXRhLml0ZW1OYW1lLnRyaW0oKSA9PT0gJycpIHx8XHJcbiAgICAgICAgKHJhdGVJdGVtRGF0YS5yYXRlID09PSB1bmRlZmluZWQgfHwgcmF0ZUl0ZW1EYXRhLnJhdGUgPT09IG51bGwpIHx8XHJcbiAgICAgICAgKHJhdGVJdGVtRGF0YS5xdWFudGl0eSA9PT0gdW5kZWZpbmVkIHx8IHJhdGVJdGVtRGF0YS5xdWFudGl0eSA9PT0gbnVsbCkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgb25VcGRhdGVSYXRlU3VjY2VzcyhzdWNjZXNzIDogc3RyaW5nKSB7XHJcbiAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgIG1lc3NhZ2UuY3VzdG9tX21lc3NhZ2UgPSBNZXNzYWdlcy5NU0dfU1VDQ0VTU19VUERBVEVfUkFURTtcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuXHJcbiAgICBmb3IobGV0IHdvcmtJdGVtRGF0YSBvZiB0aGlzLndvcmtJdGVtc0xpc3QpIHtcclxuICAgICAgaWYod29ya0l0ZW1EYXRhLnJhdGVBbmFseXNpc0lkID09PSB0aGlzLndvcmtJdGVtUmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICB3b3JrSXRlbURhdGEucmF0ZS50b3RhbCA9IHRoaXMucmF0ZVBlclVuaXRBbW91bnQ7XHJcbiAgICAgICAgaWYod29ya0l0ZW1EYXRhLnJhdGUudG90YWwgIT09IDApIHtcclxuICAgICAgICAgIHdvcmtJdGVtRGF0YS5yYXRlLmlzRXN0aW1hdGVkID0gdHJ1ZTtcclxuICAgICAgICAgIGlmKHdvcmtJdGVtRGF0YS5xdWFudGl0eS5pc0VzdGltYXRlZCAmJiB3b3JrSXRlbURhdGEucmF0ZS5pc0VzdGltYXRlZCkge1xyXG4gICAgICAgICAgICB3b3JrSXRlbURhdGEuYW1vdW50ID0gdGhpcy5jb21tb25TZXJ2aWNlLmNhbGN1bGF0ZUFtb3VudE9mV29ya0l0ZW0od29ya0l0ZW1EYXRhLnF1YW50aXR5LnRvdGFsLFxyXG4gICAgICAgICAgICAgIHdvcmtJdGVtRGF0YS5yYXRlLnRvdGFsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgd29ya0l0ZW1EYXRhLnJhdGUuaXNFc3RpbWF0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgIHdvcmtJdGVtRGF0YS5hbW91bnQgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBjYXRlZ29yaWVzVG90YWw9IHRoaXMuY29tbW9uU2VydmljZS50b3RhbENhbGN1bGF0aW9uT2ZDYXRlZ29yaWVzKHRoaXMuY2F0ZWdvcnlEZXRhaWxzLFxyXG4gICAgICB0aGlzLmNhdGVnb3J5UmF0ZUFuYWx5c2lzSWQsIHRoaXMud29ya0l0ZW1zTGlzdCk7XHJcbiAgICB0aGlzLmNhdGVnb3JpZXNUb3RhbEFtb3VudC5lbWl0KGNhdGVnb3JpZXNUb3RhbCk7XHJcblxyXG4gICAgdGhpcy5zaG93V29ya0l0ZW1UYWJOYW1lLmVtaXQoJycpO1xyXG4gICAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgb25VcGRhdGVSYXRlRmFpbHVyZShlcnJvcjogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgb25Ub3RhbFF1YW50aXR5Q2hhbmdlKG5ld1RvdGFsUXVhbnRpdHk6IG51bWJlcikge1xyXG5cclxuICAgIGlmIChuZXdUb3RhbFF1YW50aXR5ID09PSAwIHx8IG5ld1RvdGFsUXVhbnRpdHkgPT09IG51bGwpIHtcclxuXHJcbiAgICAgICAgbmV3VG90YWxRdWFudGl0eT0xO1xyXG4gICAgICAgIHRoaXMudG90YWxJdGVtUmF0ZVF1YW50aXR5ID0gbmV3VG90YWxRdWFudGl0eTtcclxuICAgICAgICB0aGlzLnJhdGUucXVhbnRpdHkgPSBuZXdUb3RhbFF1YW50aXR5O1xyXG4gICAgICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgICAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgICAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1FVQU5USVRZX1NIT1VMRF9OT1RfWkVST19PUl9OVUxMO1xyXG4gICAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5xdWFudGl0eUluY3JlbWVudCA9IG5ld1RvdGFsUXVhbnRpdHkgLyB0aGlzLnByZXZpb3VzVG90YWxRdWFudGl0eTtcclxuICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVG90YWwoJ2NoYW5nZVRvdGFsUXVhbnRpdHknKTtcclxuICAgICAgICAgIHRoaXMudG90YWxJdGVtUmF0ZVF1YW50aXR5ID0gbmV3VG90YWxRdWFudGl0eTtcclxuICAgICAgICAgIHRoaXMucmF0ZS5xdWFudGl0eSA9IG5ld1RvdGFsUXVhbnRpdHk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZ2V0UHJldmlvdXNRdWFudGl0eShwcmV2aW91c1RvdGFsUXVhbnRpdHk6IG51bWJlcikge1xyXG4gICAgdGhpcy5wcmV2aW91c1RvdGFsUXVhbnRpdHkgPSBwcmV2aW91c1RvdGFsUXVhbnRpdHk7XHJcbiAgfVxyXG5cclxuICBnZXRSYXRlSXRlbXNCeU9yaWdpbmFsTmFtZShyYXRlSXRlbTogYW55LCByYXRlSXRlbUtleSA6IHN0cmluZywgaW5kZXg6bnVtYmVyKSB7XHJcbiAgICB0aGlzLnNlbGVjdGVkUmF0ZUl0ZW0gPSByYXRlSXRlbTtcclxuICAgIHRoaXMuc2VsZWN0ZWRSYXRlSXRlbUluZGV4ID0gaW5kZXg7XHJcbiAgICB0aGlzLnNlbGVjdGVkUmF0ZUl0ZW1LZXkgPSByYXRlSXRlbUtleTtcclxuXHJcbiAgICB0aGlzLmNvc3RTdW1tYXJ5U2VydmljZS5nZXRSYXRlSXRlbXNCeU9yaWdpbmFsTmFtZSggdGhpcy5iYXNlVXJsLHJhdGVJdGVtLm9yaWdpbmFsSXRlbU5hbWUpLnN1YnNjcmliZShcclxuICAgICAgcmF0ZUl0ZW1zRGF0YSA9PiB0aGlzLm9uR2V0UmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWVTdWNjZXNzKHJhdGVJdGVtc0RhdGEuZGF0YSksXHJcbiAgICAgIGVycm9yID0+IHRoaXMub25HZXRSYXRlSXRlbXNCeU9yaWdpbmFsTmFtZUZhaWx1cmUoZXJyb3IpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgb25HZXRSYXRlSXRlbXNCeU9yaWdpbmFsTmFtZVN1Y2Nlc3MocmF0ZUl0ZW1zRGF0YTogYW55KSB7XHJcbiAgICB0aGlzLmFycmF5T2ZSYXRlSXRlbXMgPSByYXRlSXRlbXNEYXRhO1xyXG5cclxuICAgIGZvcihsZXQgcmF0ZUl0ZW1EYXRhIG9mIHJhdGVJdGVtc0RhdGEpIHtcclxuICAgICAgaWYocmF0ZUl0ZW1EYXRhLml0ZW1OYW1lID09PSB0aGlzLnNlbGVjdGVkUmF0ZUl0ZW0uaXRlbU5hbWUpIHtcclxuICAgICAgICAgZm9yKGxldCByYXRlSXRlbSBvZiB0aGlzLnJhdGUucmF0ZUl0ZW1zKSB7XHJcbiAgICAgICAgICAgaWYocmF0ZUl0ZW0udHlwZSA9PT0gdGhpcy5zZWxlY3RlZFJhdGVJdGVtS2V5ICYmIHJhdGVJdGVtLml0ZW1OYW1lID09PSB0aGlzLnNlbGVjdGVkUmF0ZUl0ZW0uaXRlbU5hbWUpIHtcclxuICAgICAgICAgICAgIHJhdGVJdGVtLnJhdGUgPSByYXRlSXRlbURhdGEucmF0ZTtcclxuICAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVG90YWwoKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yKGxldCB3b3JrSXRlbURhdGEgb2YgdGhpcy53b3JrSXRlbXNMaXN0KSB7XHJcbiAgICAgIGlmKHdvcmtJdGVtRGF0YS5yYXRlQW5hbHlzaXNJZCA9PT0gdGhpcy53b3JrSXRlbVJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgd29ya0l0ZW1EYXRhLnJhdGUgPSB0aGlzLnJhdGU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNsb3NlUmF0ZVRhYigpIHtcclxuICAgIHRoaXMuY2xvc2VSYXRlVmlldy5lbWl0KCk7XHJcbiAgfVxyXG5cclxuICBvbkdldFJhdGVJdGVtc0J5T3JpZ2luYWxOYW1lRmFpbHVyZShlcnJvcjogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgfVxyXG5cclxuICBnZXRCdXR0b24oKSB7XHJcbiAgICByZXR1cm4gQnV0dG9uO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGFibGVIZWFkaW5ncygpIHtcclxuICAgIHJldHVybiBUYWJsZUhlYWRpbmdzO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGFiZWwoKSB7XHJcbiAgICByZXR1cm4gTGFiZWw7XHJcbiAgfVxyXG5cclxuICBnZXRIZWFkaW5ncygpIHtcclxuICAgIHJldHVybiBIZWFkaW5ncztcclxuICB9XHJcbn1cclxuIl19
