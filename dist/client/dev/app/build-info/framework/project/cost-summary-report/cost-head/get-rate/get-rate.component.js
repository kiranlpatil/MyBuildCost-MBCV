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
                this.rate.rateItems[rateItemsIndex].quantity = this.rate.rateItems[rateItemsIndex].quantity *
                    this.quantityIncrement;
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
                    if (rateItem.itemName === this.selectedRateItem.itemName) {
                        rateItem.rate = rateItemData.rate;
                        this.calculateTotal();
                        break;
                    }
                }
                break;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1oZWFkL2dldC1yYXRlL2dldC1yYXRlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFzRztBQUN0RyxnRUFBcUg7QUFDckgsd0RBR3dDO0FBQ3hDLHFFQUFrRTtBQUNsRSwrQ0FBOEM7QUFDOUMsbUZBQWdGO0FBR2hGLDBGQUF3RjtBQVd4RjtJQStCRSwwQkFBb0Isa0JBQXNDLEVBQVcsYUFBNEIsRUFDN0UsY0FBOEIsRUFBVSxhQUE0QjtRQURwRSx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQVcsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDN0UsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFwQjlFLDBCQUFxQixHQUFHLElBQUksbUJBQVksRUFBVSxDQUFDO1FBQ25ELHdCQUFtQixHQUFHLElBQUksbUJBQVksRUFBVSxDQUFDO1FBQ2pELHdCQUFtQixHQUFHLElBQUksbUJBQVksRUFBRSxDQUFDO1FBQ3pDLGtCQUFhLEdBQUcsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFFN0MsZ0JBQVcsR0FBWSxDQUFDLENBQUM7UUFDekIsMEJBQXFCLEdBQVksQ0FBQyxDQUFDO1FBQ25DLHdCQUFtQixHQUFZLENBQUMsQ0FBQztRQUNqQyxtQ0FBOEIsR0FBWSxDQUFDLENBQUM7UUFDNUMsc0JBQWlCLEdBQVcsQ0FBQyxDQUFDO1FBQzlCLDBCQUFxQixHQUFXLENBQUMsQ0FBQztRQUNsQywwQkFBcUIsR0FBVyxDQUFDLENBQUM7SUFVbEMsQ0FBQztJQUNELG1DQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELHNDQUFXLEdBQVgsVUFBWSxLQUFXO1FBRXJCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENB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QUM7eUNBaUN3Qyx5Q0FBa0IsRUFBMEIsK0JBQWE7WUFDN0Qsc0JBQWMsRUFBeUIsOEJBQWE7T0FoQzdFLGdCQUFnQixDQTJQNUI7SUFBRCx1QkFBQztDQTNQRCxBQTJQQyxJQUFBO0FBM1BZLDRDQUFnQiIsImZpbGUiOiJhcHAvYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9jb3N0LXN1bW1hcnktcmVwb3J0L2Nvc3QtaGVhZC9nZXQtcmF0ZS9nZXQtcmF0ZS5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgVmlld0NoaWxkLCBFbGVtZW50UmVmLCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTWVzc2FnZXMsIEJ1dHRvbiwgVGFibGVIZWFkaW5ncywgTGFiZWwsIEhlYWRpbmdzLCBWYWx1ZUNvbnN0YW50IH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7XHJcbiAgU2Vzc2lvblN0b3JhZ2UsIFNlc3Npb25TdG9yYWdlU2VydmljZSxcclxuICBNZXNzYWdlLCBNZXNzYWdlU2VydmljZVxyXG59IGZyb20gJy4uLy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IENvc3RTdW1tYXJ5U2VydmljZSB9IGZyb20gJy4vLi4vLi4vY29zdC1zdW1tYXJ5LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBSYXRlIH0gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWwvcmF0ZSc7XHJcbmltcG9ydCB7IExvYWRlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi9zaGFyZWQvbG9hZGVyL2xvYWRlcnMuc2VydmljZSc7XHJcbmltcG9ydCB7IFdvcmtJdGVtIH0gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWwvd29yay1pdGVtJztcclxuaW1wb3J0IHsgQ2F0ZWdvcnkgfSBmcm9tICcuLi8uLi8uLi8uLi9tb2RlbC9jYXRlZ29yeSc7XHJcbmltcG9ydCB7IENvbW1vblNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi8uLi9hcHAvc2hhcmVkL3NlcnZpY2VzL2NvbW1vbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmF0ZUl0ZW0gfSBmcm9tICcuLi8uLi8uLi8uLi9tb2RlbC9yYXRlLWl0ZW0nO1xyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICdiaS1nZXQtcmF0ZScsXHJcbiAgdGVtcGxhdGVVcmw6ICdnZXQtcmF0ZS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJ2dldC1yYXRlLmNvbXBvbmVudC5jc3MnXSxcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBHZXRSYXRlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgQElucHV0KCkgcmF0ZTogUmF0ZTtcclxuICBASW5wdXQoKSBjYXRlZ29yeURldGFpbHMgOiAgQXJyYXk8Q2F0ZWdvcnk+O1xyXG4gIEBJbnB1dCgpIGNhdGVnb3J5UmF0ZUFuYWx5c2lzSWQgOiBudW1iZXI7XHJcbiAgQElucHV0KCkgd29ya0l0ZW1SYXRlQW5hbHlzaXNJZCA6IG51bWJlcjtcclxuICBASW5wdXQoKSB3b3JrSXRlbXNMaXN0IDogQXJyYXk8V29ya0l0ZW0+O1xyXG4gIEBJbnB1dCgpIHJhdGVQZXJVbml0QW1vdW50IDogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIGJhc2VVcmwgOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgcmF0ZVZpZXc6IHN0cmluZztcclxuICBASW5wdXQoKSBkaXNhYmxlUmF0ZUZpZWxkOiBib29sZWFuO1xyXG5cclxuICBAT3V0cHV0KCkgY2F0ZWdvcmllc1RvdGFsQW1vdW50ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XHJcbiAgQE91dHB1dCgpIHNob3dXb3JrSXRlbVRhYk5hbWUgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcclxuICBAT3V0cHV0KCkgcmVmcmVzaENhdGVnb3J5TGlzdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgY2xvc2VSYXRlVmlldyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgdG90YWxBbW91bnQgOiBudW1iZXIgPSAwO1xyXG4gIHRvdGFsQW1vdW50T2ZNYXRlcmlhbCA6IG51bWJlciA9IDA7XHJcbiAgdG90YWxBbW91bnRPZkxhYm91ciA6IG51bWJlciA9IDA7XHJcbiAgdG90YWxBbW91bnRPZk1hdGVyaWFsQW5kTGFib3VyIDogbnVtYmVyID0gMDtcclxuICBxdWFudGl0eUluY3JlbWVudDogbnVtYmVyID0gMTtcclxuICBwcmV2aW91c1RvdGFsUXVhbnRpdHk6IG51bWJlciA9IDE7XHJcbiAgdG90YWxJdGVtUmF0ZVF1YW50aXR5OiBudW1iZXIgPSAwO1xyXG4gIGFycmF5T2ZSYXRlSXRlbXM6IEFycmF5PFJhdGVJdGVtPjtcclxuICBzZWxlY3RlZFJhdGVJdGVtOlJhdGVJdGVtO1xyXG4gIHNlbGVjdGVkUmF0ZUl0ZW1JbmRleDpudW1iZXI7XHJcbiAgc2VsZWN0ZWRSYXRlSXRlbUtleSA6IHN0cmluZztcclxuICB0eXBlIDogc3RyaW5nO1xyXG4gIHNlbGVjdGVkSXRlbU5hbWU6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb3N0U3VtbWFyeVNlcnZpY2U6IENvc3RTdW1tYXJ5U2VydmljZSwgIHByaXZhdGUgbG9hZGVyU2VydmljZTogTG9hZGVyU2VydmljZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSwgcHJpdmF0ZSBjb21tb25TZXJ2aWNlOiBDb21tb25TZXJ2aWNlKSB7XHJcbiAgfVxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5jYWxjdWxhdGVUb3RhbCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0SXRlbU5hbWUoZXZlbnQgOiBhbnkpIHtcclxuXHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0LnZhbHVlICE9PSAnJykge1xyXG4gICAgICB0aGlzLnNlbGVjdGVkSXRlbU5hbWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICAgIGV2ZW50LnRhcmdldC52YWx1ZSA9ICcnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0SXRlbU5hbWUoZXZlbnQgOiBhbnkpIHtcclxuICAgIGlmIChldmVudC50YXJnZXQudmFsdWUgPT09ICcnKSB7XHJcbiAgICAgIGV2ZW50LnRhcmdldC52YWx1ZSA9IHRoaXMuc2VsZWN0ZWRJdGVtTmFtZTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICBjYWxjdWxhdGVUb3RhbChjaG9pY2U/OnN0cmluZykge1xyXG4gICAgdGhpcy5yYXRlUGVyVW5pdEFtb3VudCA9IDA7XHJcbiAgICB0aGlzLnRvdGFsQW1vdW50ID0gMDtcclxuICAgIHRoaXMudG90YWxBbW91bnRPZkxhYm91ciA9IDA7XHJcbiAgICB0aGlzLnRvdGFsQW1vdW50T2ZNYXRlcmlhbD0wO1xyXG4gICAgdGhpcy50b3RhbEFtb3VudE9mTWF0ZXJpYWxBbmRMYWJvdXIgPSAwO1xyXG5cclxuICAgIGZvciAobGV0IHJhdGVJdGVtc0luZGV4IGluIHRoaXMucmF0ZS5yYXRlSXRlbXMpIHtcclxuICAgICAgaWYoY2hvaWNlID09PSAnY2hhbmdlVG90YWxRdWFudGl0eScpIHtcclxuICAgICAgICB0aGlzLnJhdGUucmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS5xdWFudGl0eSA9dGhpcy5yYXRlLnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0ucXVhbnRpdHkgKlxyXG4gICAgICAgICAgdGhpcy5xdWFudGl0eUluY3JlbWVudDtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnR5cGUgPSB0aGlzLnJhdGUucmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS50eXBlO1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XHJcbiAgICAgICAgICBjYXNlICdNJyA6XHJcbiAgICAgICAgICAgICAgdGhpcy5yYXRlLnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0udG90YWxBbW91bnQgPSB0aGlzLnJhdGUucmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS5xdWFudGl0eSAqXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhdGUucmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS5yYXRlO1xyXG5cclxuICAgICAgICAgICAgICB0aGlzLnRvdGFsQW1vdW50T2ZNYXRlcmlhbCA9IHRoaXMudG90YWxBbW91bnRPZk1hdGVyaWFsICsgdGhpcy5yYXRlLnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0udG90YWxBbW91bnQ7XHJcblxyXG4gICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICBjYXNlICdMJyA6XHJcbiAgICAgICAgICAgICAgdGhpcy5yYXRlLnJhdGVJdGVtc1tyYXRlSXRlbXNJbmRleF0udG90YWxBbW91bnQgPSB0aGlzLnJhdGUucmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS5xdWFudGl0eSAqXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhdGUucmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS5yYXRlO1xyXG5cclxuICAgICAgICAgICAgICB0aGlzLnRvdGFsQW1vdW50T2ZMYWJvdXIgPSB0aGlzLnRvdGFsQW1vdW50T2ZMYWJvdXIgKyB0aGlzLnJhdGUucmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS50b3RhbEFtb3VudDtcclxuXHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgY2FzZSAnTSArIEwnIDpcclxuICAgICAgICAgICAgICB0aGlzLnJhdGUucmF0ZUl0ZW1zW3JhdGVJdGVtc0luZGV4XS50b3RhbEFtb3VudCA9IHRoaXMucmF0ZS5yYXRlSXRlbXNbcmF0ZUl0ZW1zSW5kZXhdLnF1YW50aXR5ICpcclxuICAgICAgICAgICAgICAgIHRoaXMucmF0ZS5yYXRlSXRlbXNbcmF0ZUl0ZW1zSW5kZXhdLnJhdGU7XHJcblxyXG4gICAgICAgICAgICAgIHRoaXMudG90YWxBbW91bnRPZk1hdGVyaWFsQW5kTGFib3VyID0gdGhpcy50b3RhbEFtb3VudE9mTWF0ZXJpYWxBbmRMYWJvdXIgK1xyXG4gICAgICAgICAgICAgICAgIHRoaXMucmF0ZS5yYXRlSXRlbXNbcmF0ZUl0ZW1zSW5kZXhdLnRvdGFsQW1vdW50O1xyXG5cclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgIHRoaXMudG90YWxBbW91bnQgPSB0aGlzLnRvdGFsQW1vdW50T2ZNYXRlcmlhbCArIHRoaXMudG90YWxBbW91bnRPZkxhYm91ciArdGhpcy50b3RhbEFtb3VudE9mTWF0ZXJpYWxBbmRMYWJvdXI7XHJcbiAgICB9XHJcbiAgICB0aGlzLnJhdGVQZXJVbml0QW1vdW50ID0gdGhpcy50b3RhbEFtb3VudCAvIHRoaXMucmF0ZS5xdWFudGl0eTtcclxuICAgIHRoaXMucmF0ZS50b3RhbD0gdGhpcy5yYXRlUGVyVW5pdEFtb3VudDtcclxuICAgIH1cclxuICB1cGRhdGVSYXRlKHJhdGVJdGVtc0FycmF5OiBSYXRlKSB7XHJcbiAgICBpZiAodGhpcy52YWxpZGF0ZVJhdGVJdGVtKHJhdGVJdGVtc0FycmF5LnJhdGVJdGVtcykpIHtcclxuICAgICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0YXJ0KCk7XHJcbiAgICAgIGxldCBjb3N0SGVhZElkID0gcGFyc2VJbnQoU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX0NPU1RfSEVBRF9JRCkpO1xyXG4gICAgICBsZXQgd29ya0l0ZW1JZCA9IHBhcnNlSW50KFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9XT1JLSVRFTV9JRCkpO1xyXG5cclxuICAgICAgbGV0IHJhdGUgPSBuZXcgUmF0ZSgpO1xyXG4gICAgICByYXRlLnJhdGVGcm9tUmF0ZUFuYWx5c2lzID0gcmF0ZUl0ZW1zQXJyYXkucmF0ZUZyb21SYXRlQW5hbHlzaXM7XHJcbiAgICAgIHJhdGUudG90YWwgPSB0aGlzLmNvbW1vblNlcnZpY2UuZGVjaW1hbENvbnZlcnNpb24ocmF0ZUl0ZW1zQXJyYXkudG90YWwpO1xyXG4gICAgICByYXRlLnF1YW50aXR5ID0gcmF0ZUl0ZW1zQXJyYXkucXVhbnRpdHk7XHJcbiAgICAgIHJhdGUudW5pdCA9IHJhdGVJdGVtc0FycmF5LnVuaXQ7XHJcbiAgICAgIHJhdGUucmF0ZUl0ZW1zID0gcmF0ZUl0ZW1zQXJyYXkucmF0ZUl0ZW1zO1xyXG4gICAgICByYXRlLmltYWdlVVJMID0gcmF0ZUl0ZW1zQXJyYXkuaW1hZ2VVUkw7XHJcbiAgICAgIHJhdGUubm90ZXMgPSByYXRlSXRlbXNBcnJheS5ub3RlcztcclxuXHJcbiAgICAgIHRoaXMuY29zdFN1bW1hcnlTZXJ2aWNlLnVwZGF0ZVJhdGUodGhpcy5iYXNlVXJsLCBjb3N0SGVhZElkLCB0aGlzLmNhdGVnb3J5UmF0ZUFuYWx5c2lzSWQsIHdvcmtJdGVtSWQsIHJhdGUpLnN1YnNjcmliZShcclxuICAgICAgICBzdWNjZXNzID0+IHRoaXMub25VcGRhdGVSYXRlU3VjY2VzcyhzdWNjZXNzKSxcclxuICAgICAgICBlcnJvciA9PiB0aGlzLm9uVXBkYXRlUmF0ZUZhaWx1cmUoZXJyb3IpXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fUVVBTlRJVFlfUkVRVUlSRUQ7XHJcbiAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhbGlkYXRlUmF0ZUl0ZW0ocmF0ZUl0ZW1zIDogQXJyYXk8UmF0ZUl0ZW0+KSB7XHJcbiAgICBmb3IobGV0IHJhdGVJdGVtRGF0YSBvZiByYXRlSXRlbXMpIHtcclxuICAgICAgaWYoKHJhdGVJdGVtRGF0YS5pdGVtTmFtZSA9PT0gbnVsbCB8fCByYXRlSXRlbURhdGEuaXRlbU5hbWUgPT09IHVuZGVmaW5lZCB8fCByYXRlSXRlbURhdGEuaXRlbU5hbWUudHJpbSgpID09PSAnJykgfHxcclxuICAgICAgICAocmF0ZUl0ZW1EYXRhLnJhdGUgPT09IHVuZGVmaW5lZCB8fCByYXRlSXRlbURhdGEucmF0ZSA9PT0gbnVsbCkgfHxcclxuICAgICAgICAocmF0ZUl0ZW1EYXRhLnF1YW50aXR5ID09PSB1bmRlZmluZWQgfHwgcmF0ZUl0ZW1EYXRhLnF1YW50aXR5ID09PSBudWxsKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBvblVwZGF0ZVJhdGVTdWNjZXNzKHN1Y2Nlc3MgOiBzdHJpbmcpIHtcclxuICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX1VQREFURV9SQVRFO1xyXG4gICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG5cclxuICAgIGZvcihsZXQgd29ya0l0ZW1EYXRhIG9mIHRoaXMud29ya0l0ZW1zTGlzdCkge1xyXG4gICAgICBpZih3b3JrSXRlbURhdGEucmF0ZUFuYWx5c2lzSWQgPT09IHRoaXMud29ya0l0ZW1SYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgIHdvcmtJdGVtRGF0YS5yYXRlLnRvdGFsID0gdGhpcy5yYXRlUGVyVW5pdEFtb3VudDtcclxuICAgICAgICBpZih3b3JrSXRlbURhdGEucmF0ZS50b3RhbCAhPT0gMCkge1xyXG4gICAgICAgICAgd29ya0l0ZW1EYXRhLnJhdGUuaXNFc3RpbWF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgaWYod29ya0l0ZW1EYXRhLnF1YW50aXR5LmlzRXN0aW1hdGVkICYmIHdvcmtJdGVtRGF0YS5yYXRlLmlzRXN0aW1hdGVkKSB7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtRGF0YS5hbW91bnQgPSB0aGlzLmNvbW1vblNlcnZpY2UuY2FsY3VsYXRlQW1vdW50T2ZXb3JrSXRlbSh3b3JrSXRlbURhdGEucXVhbnRpdHkudG90YWwsXHJcbiAgICAgICAgICAgICAgd29ya0l0ZW1EYXRhLnJhdGUudG90YWwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB3b3JrSXRlbURhdGEucmF0ZS5pc0VzdGltYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgd29ya0l0ZW1EYXRhLmFtb3VudCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGNhdGVnb3JpZXNUb3RhbD0gdGhpcy5jb21tb25TZXJ2aWNlLnRvdGFsQ2FsY3VsYXRpb25PZkNhdGVnb3JpZXModGhpcy5jYXRlZ29yeURldGFpbHMsXHJcbiAgICAgIHRoaXMuY2F0ZWdvcnlSYXRlQW5hbHlzaXNJZCwgdGhpcy53b3JrSXRlbXNMaXN0KTtcclxuICAgIHRoaXMuY2F0ZWdvcmllc1RvdGFsQW1vdW50LmVtaXQoY2F0ZWdvcmllc1RvdGFsKTtcclxuICAgIHRoaXMuc2hvd1dvcmtJdGVtVGFiTmFtZS5lbWl0KCcnKTtcclxuICAgICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICB9XHJcblxyXG4gIG9uVXBkYXRlUmF0ZUZhaWx1cmUoZXJyb3I6IGFueSkge1xyXG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICB9XHJcblxyXG4gIG9uVG90YWxRdWFudGl0eUNoYW5nZShuZXdUb3RhbFF1YW50aXR5OiBudW1iZXIpIHtcclxuXHJcbiAgICBpZiAobmV3VG90YWxRdWFudGl0eSA9PT0gMCB8fCBuZXdUb3RhbFF1YW50aXR5ID09PSBudWxsKSB7XHJcblxyXG4gICAgICAgIG5ld1RvdGFsUXVhbnRpdHk9MTtcclxuICAgICAgICB0aGlzLnRvdGFsSXRlbVJhdGVRdWFudGl0eSA9IG5ld1RvdGFsUXVhbnRpdHk7XHJcbiAgICAgICAgdGhpcy5yYXRlLnF1YW50aXR5ID0gbmV3VG90YWxRdWFudGl0eTtcclxuICAgICAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICAgICAgbWVzc2FnZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICAgICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19RVUFOVElUWV9TSE9VTERfTk9UX1pFUk9fT1JfTlVMTDtcclxuICAgICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucXVhbnRpdHlJbmNyZW1lbnQgPSBuZXdUb3RhbFF1YW50aXR5IC8gdGhpcy5wcmV2aW91c1RvdGFsUXVhbnRpdHk7XHJcbiAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVRvdGFsKCdjaGFuZ2VUb3RhbFF1YW50aXR5Jyk7XHJcbiAgICAgICAgICB0aGlzLnRvdGFsSXRlbVJhdGVRdWFudGl0eSA9IG5ld1RvdGFsUXVhbnRpdHk7XHJcbiAgICAgICAgICB0aGlzLnJhdGUucXVhbnRpdHkgPSBuZXdUb3RhbFF1YW50aXR5O1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGdldFByZXZpb3VzUXVhbnRpdHkocHJldmlvdXNUb3RhbFF1YW50aXR5OiBudW1iZXIpIHtcclxuICAgIHRoaXMucHJldmlvdXNUb3RhbFF1YW50aXR5ID0gcHJldmlvdXNUb3RhbFF1YW50aXR5O1xyXG4gIH1cclxuXHJcbiAgZ2V0UmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWUocmF0ZUl0ZW06IGFueSwgcmF0ZUl0ZW1LZXkgOiBzdHJpbmcsIGluZGV4Om51bWJlcikge1xyXG4gICAgdGhpcy5zZWxlY3RlZFJhdGVJdGVtID0gcmF0ZUl0ZW07XHJcbiAgICB0aGlzLnNlbGVjdGVkUmF0ZUl0ZW1JbmRleCA9IGluZGV4O1xyXG4gICAgdGhpcy5zZWxlY3RlZFJhdGVJdGVtS2V5ID0gcmF0ZUl0ZW1LZXk7XHJcblxyXG4gICAgdGhpcy5jb3N0U3VtbWFyeVNlcnZpY2UuZ2V0UmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWUoIHRoaXMuYmFzZVVybCxyYXRlSXRlbS5vcmlnaW5hbEl0ZW1OYW1lKS5zdWJzY3JpYmUoXHJcbiAgICAgIHJhdGVJdGVtc0RhdGEgPT4gdGhpcy5vbkdldFJhdGVJdGVtc0J5T3JpZ2luYWxOYW1lU3VjY2VzcyhyYXRlSXRlbXNEYXRhLmRhdGEpLFxyXG4gICAgICBlcnJvciA9PiB0aGlzLm9uR2V0UmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWVGYWlsdXJlKGVycm9yKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIG9uR2V0UmF0ZUl0ZW1zQnlPcmlnaW5hbE5hbWVTdWNjZXNzKHJhdGVJdGVtc0RhdGE6IGFueSkge1xyXG4gICAgdGhpcy5hcnJheU9mUmF0ZUl0ZW1zID0gcmF0ZUl0ZW1zRGF0YTtcclxuXHJcbiAgICBmb3IobGV0IHJhdGVJdGVtRGF0YSBvZiByYXRlSXRlbXNEYXRhKSB7XHJcbiAgICAgIGlmKHJhdGVJdGVtRGF0YS5pdGVtTmFtZSA9PT0gdGhpcy5zZWxlY3RlZFJhdGVJdGVtLml0ZW1OYW1lKSB7XHJcbiAgICAgICAgIGZvcihsZXQgcmF0ZUl0ZW0gb2YgdGhpcy5yYXRlLnJhdGVJdGVtcykge1xyXG4gICAgICAgICAgIGlmKHJhdGVJdGVtLml0ZW1OYW1lID09PSB0aGlzLnNlbGVjdGVkUmF0ZUl0ZW0uaXRlbU5hbWUpIHtcclxuICAgICAgICAgICAgIHJhdGVJdGVtLnJhdGUgPSByYXRlSXRlbURhdGEucmF0ZTtcclxuICAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlVG90YWwoKTtcclxuICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yKGxldCB3b3JrSXRlbURhdGEgb2YgdGhpcy53b3JrSXRlbXNMaXN0KSB7XHJcbiAgICAgIGlmKHdvcmtJdGVtRGF0YS5yYXRlQW5hbHlzaXNJZCA9PT0gdGhpcy53b3JrSXRlbVJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgd29ya0l0ZW1EYXRhLnJhdGUgPSB0aGlzLnJhdGU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNsb3NlUmF0ZVRhYigpIHtcclxuICAgIHRoaXMuY2xvc2VSYXRlVmlldy5lbWl0KCk7XHJcbiAgfVxyXG5cclxuICBvbkdldFJhdGVJdGVtc0J5T3JpZ2luYWxOYW1lRmFpbHVyZShlcnJvcjogYW55KSB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgfVxyXG5cclxuICBnZXRCdXR0b24oKSB7XHJcbiAgICByZXR1cm4gQnV0dG9uO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGFibGVIZWFkaW5ncygpIHtcclxuICAgIHJldHVybiBUYWJsZUhlYWRpbmdzO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGFiZWwoKSB7XHJcbiAgICByZXR1cm4gTGFiZWw7XHJcbiAgfVxyXG5cclxuICBnZXRIZWFkaW5ncygpIHtcclxuICAgIHJldHVybiBIZWFkaW5ncztcclxuICB9XHJcbn1cclxuIl19
