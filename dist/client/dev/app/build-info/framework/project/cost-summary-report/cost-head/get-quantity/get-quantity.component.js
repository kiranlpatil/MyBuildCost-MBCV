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
var index_1 = require("../../../../../../shared/index");
var quantity_item_1 = require("../../../../model/quantity-item");
var cost_summary_service_1 = require("../../cost-summary.service");
var constants_1 = require("../../../../../../shared/constants");
var loaders_service_1 = require("../../../../../../shared/loader/loaders.service");
var router_1 = require("@angular/router");
var common_service_1 = require("../../../../../../../app/shared/services/common.service");
var quantity_details_1 = require("../../../../model/quantity-details");
var GetQuantityComponent = (function () {
    function GetQuantityComponent(costSummaryService, loaderService, messageService, _router, commonService) {
        this.costSummaryService = costSummaryService;
        this.loaderService = loaderService;
        this.messageService = messageService;
        this._router = _router;
        this.commonService = commonService;
        this.showWorkItemTabName = new core_1.EventEmitter();
        this.closeQuantityView = new core_1.EventEmitter();
        this.categoriesTotalAmount = new core_1.EventEmitter();
        this.quantityTotal = 0;
        this.quantityNumbersTotal = 0;
        this.lengthTotal = 0;
        this.breadthTotal = 0;
        this.heightTotal = 0;
        this.deleteConfirmationQuantityItem = constants_1.ProjectElements.QUANTITY_ITEM;
    }
    GetQuantityComponent.prototype.ngOnInit = function () {
        this.updateAllQuantity();
        this.workItemId = parseFloat(index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_WORKITEM_ID));
    };
    GetQuantityComponent.prototype.updateQuantity = function (choice) {
        switch (choice) {
            case 'updateNos':
                {
                    this.quantityNumbersTotal = 0;
                    for (var quantityIndex in this.quantityItems) {
                        this.quantityNumbersTotal = this.commonService.decimalConversion(this.quantityNumbersTotal +
                            this.quantityItems[quantityIndex].nos);
                    }
                    this.getQuantityTotal(this.quantityItems);
                }
                break;
            case 'updateLength':
                {
                    this.lengthTotal = 0;
                    for (var quantityIndex in this.quantityItems) {
                        this.lengthTotal = this.commonService.decimalConversion(this.lengthTotal +
                            this.quantityItems[quantityIndex].length);
                    }
                    this.getQuantityTotal(this.quantityItems);
                }
                break;
            case 'updateBreadth':
                {
                    this.breadthTotal = 0;
                    for (var quantityIndex in this.quantityItems) {
                        this.breadthTotal = this.commonService.decimalConversion(this.breadthTotal +
                            this.quantityItems[quantityIndex].breadth);
                    }
                    this.getQuantityTotal(this.quantityItems);
                }
                break;
            case 'updateHeight':
                {
                    this.heightTotal = 0;
                    for (var quantityIndex in this.quantityItems) {
                        this.heightTotal = this.commonService.decimalConversion(this.heightTotal +
                            this.quantityItems[quantityIndex].height);
                    }
                    this.getQuantityTotal(this.quantityItems);
                }
                break;
        }
    };
    GetQuantityComponent.prototype.getQuantityTotal = function (quantityItems) {
        this.quantityTotal = 0;
        this.quantityItems = quantityItems;
        for (var quantityIndex in this.quantityItems) {
            var number = this.quantityItems[quantityIndex].nos;
            var length = this.quantityItems[quantityIndex].length;
            var height = this.quantityItems[quantityIndex].height;
            this.quantityItems[quantityIndex].quantity = this.commonService.decimalConversion(number * length * height);
            this.quantityTotal = this.commonService.decimalConversion(this.quantityTotal +
                this.quantityItems[quantityIndex].quantity);
        }
    };
    GetQuantityComponent.prototype.updateAllQuantity = function () {
        this.updateQuantity('updateNos');
        this.updateQuantity('updateLength');
        this.updateQuantity('updateBreadth');
        this.updateQuantity('updateHeight');
    };
    GetQuantityComponent.prototype.addQuantityItem = function () {
        var quantity = new quantity_item_1.QuantityItem();
        quantity.item = '';
        quantity.remarks = '';
        quantity.nos = 0;
        quantity.length = 0;
        quantity.breadth = 0;
        quantity.height = 0;
        quantity.quantity = 0;
        quantity.unit = 'sqft';
        this.quantityItems.push(quantity);
    };
    GetQuantityComponent.prototype.updateQuantityItem = function (quantityItems) {
        var _this = this;
        if (this.validateQuantityItem(quantityItems) && (this.keyQuantity !== ''
            && this.keyQuantity !== null && this.keyQuantity !== undefined)) {
            var quantityObj = new quantity_details_1.QuantityDetails();
            quantityObj.name = this.keyQuantity;
            quantityObj.quantityItems = quantityItems;
            this.loaderService.start();
            var costHeadId = parseFloat(index_1.SessionStorageService.getSessionValue(index_1.SessionStorage.CURRENT_COST_HEAD_ID));
            this.costSummaryService.updateQuantityItems(this.baseUrl, costHeadId, this.categoryRateAnalysisId, this.workItemId, quantityObj).subscribe(function (success) { return _this.onUpdateQuantityItemsSuccess(success); }, function (error) { return _this.onUpdateQuantityItemsFailure(error); });
        }
        else {
            var message = new index_1.Message();
            message.isError = false;
            if (this.keyQuantity !== null && this.keyQuantity !== undefined) {
                message.custom_message = index_1.Messages.MSG_ERROR_VALIDATION_QUANTITY_REQUIRED;
            }
            else {
                message.custom_message = index_1.Messages.MSG_ERROR_VALIDATION_QUANTITY_NAME_REQUIRED;
            }
            this.messageService.message(message);
        }
    };
    GetQuantityComponent.prototype.validateQuantityItem = function (quantityItems) {
        for (var _i = 0, quantityItems_1 = quantityItems; _i < quantityItems_1.length; _i++) {
            var quantityItemData = quantityItems_1[_i];
            if ((quantityItemData.item === '' || quantityItemData.item === undefined || quantityItemData.item.trim() === '') ||
                (quantityItemData.nos === undefined || quantityItemData.nos === null) ||
                (quantityItemData.length === undefined || quantityItemData.length === null) ||
                (quantityItemData.height === undefined || quantityItemData.height === null)) {
                return false;
            }
        }
        return true;
    };
    GetQuantityComponent.prototype.onUpdateQuantityItemsSuccess = function (success) {
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = index_1.Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM;
        this.messageService.message(message);
        var workItemId = this.workItemId;
        var workItemData = this.workItemsList.filter(function (workItemData) {
            return workItemData.rateAnalysisId === workItemId;
        });
        this.commonService.calculateTotalOfQuantityItemDetails(workItemData[0]);
        if (workItemData[0].quantity.total !== 0) {
            workItemData[0].quantity.isEstimated = true;
            if (workItemData[0].quantity.isEstimated && workItemData[0].rate.isEstimated) {
                workItemData[0].amount = this.commonService.calculateAmountOfWorkItem(workItemData[0].quantity.total, workItemData[0].rate.total);
            }
        }
        else {
            workItemData[0].quantity.isEstimated = false;
            workItemData[0].amount = 0;
        }
        var categoriesTotal = this.commonService.totalCalculationOfCategories(this.categoryDetails, this.categoryRateAnalysisId, this.workItemsList);
        this.categoriesTotalAmount.emit(categoriesTotal);
        this.showWorkItemTabName.emit('');
        this.loaderService.stop();
    };
    GetQuantityComponent.prototype.onUpdateQuantityItemsFailure = function (error) {
        var message = new index_1.Message();
        message.isError = true;
        message.custom_message = index_1.Messages.MSG_SUCCESS_SAVED_COST_HEAD_ITEM_ERROR;
        this.messageService.message(message);
        this.loaderService.stop();
    };
    GetQuantityComponent.prototype.setQuantityItemNameForDelete = function (quantityIndex) {
        this.quantityIndex = quantityIndex;
    };
    GetQuantityComponent.prototype.deleteQuantityItem = function (quantityIndex) {
        this.quantityIndex = quantityIndex;
        this.quantityItems.splice(this.quantityIndex, 1);
        var message = new index_1.Message();
        message.isError = false;
        message.custom_message = index_1.Messages.MSG_SUCCESS_DELETE_QUANTITY_ITEM;
        this.messageService.message(message);
        this.updateAllQuantity();
    };
    GetQuantityComponent.prototype.closeQuantityTab = function () {
        var quantityItemsArray = this.quantityItems;
        for (var quantityIndex in quantityItemsArray) {
            if ((quantityItemsArray[quantityIndex].item === null || quantityItemsArray[quantityIndex].item === '') &&
                (quantityItemsArray[quantityIndex].nos === 0 || quantityItemsArray[quantityIndex].nos === null) ||
                (quantityItemsArray[quantityIndex].length === 0 || quantityItemsArray[quantityIndex].length === null) ||
                (quantityItemsArray[quantityIndex].height === 0 || quantityItemsArray[quantityIndex].height === null)) {
                quantityItemsArray.splice(parseInt(quantityIndex), quantityItemsArray.length);
            }
            else {
                this.quantityItems = quantityItemsArray;
                this.closeQuantityView.emit('');
            }
        }
        this.closeQuantityView.emit('');
    };
    GetQuantityComponent.prototype.getButton = function () {
        return constants_1.Button;
    };
    GetQuantityComponent.prototype.getTableHeadings = function () {
        return constants_1.TableHeadings;
    };
    GetQuantityComponent.prototype.getLabel = function () {
        return constants_1.Label;
    };
    GetQuantityComponent.prototype.getHeadings = function () {
        return constants_1.Headings;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], GetQuantityComponent.prototype, "quantityItems", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], GetQuantityComponent.prototype, "quantityDetails", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], GetQuantityComponent.prototype, "categoryDetails", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], GetQuantityComponent.prototype, "categoryRateAnalysisId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], GetQuantityComponent.prototype, "workItemRateAnalysisId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], GetQuantityComponent.prototype, "workItemsList", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], GetQuantityComponent.prototype, "baseUrl", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], GetQuantityComponent.prototype, "keyQuantity", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], GetQuantityComponent.prototype, "showWorkItemTabName", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], GetQuantityComponent.prototype, "closeQuantityView", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], GetQuantityComponent.prototype, "categoriesTotalAmount", void 0);
    GetQuantityComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-get-quantity',
            templateUrl: 'get-quantity.component.html',
            styleUrls: ['get-quantity.component.css'],
        }),
        __metadata("design:paramtypes", [cost_summary_service_1.CostSummaryService, loaders_service_1.LoaderService,
            index_1.MessageService, router_1.Router, common_service_1.CommonService])
    ], GetQuantityComponent);
    return GetQuantityComponent;
}());
exports.GetQuantityComponent = GetQuantityComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1oZWFkL2dldC1xdWFudGl0eS9nZXQtcXVhbnRpdHkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQStFO0FBQy9FLHdEQUEySDtBQUMzSCxpRUFBK0Q7QUFDL0QsbUVBQWdFO0FBQ2hFLGdFQUc0QztBQUM1QyxtRkFBZ0Y7QUFHaEYsMENBQXlDO0FBQ3pDLDBGQUF3RjtBQUN4Rix1RUFBcUU7QUFTckU7SUF5QkUsOEJBQW9CLGtCQUF1QyxFQUFXLGFBQTRCLEVBQzlFLGNBQThCLEVBQVUsT0FBZ0IsRUFBVSxhQUE0QjtRQUQ5Rix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQXFCO1FBQVcsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDOUUsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBaEJ4Ryx3QkFBbUIsR0FBRyxJQUFJLG1CQUFZLEVBQVUsQ0FBQztRQUNqRCxzQkFBaUIsR0FBRyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztRQUN2QywwQkFBcUIsR0FBRyxJQUFJLG1CQUFZLEVBQVUsQ0FBQztRQU03RCxrQkFBYSxHQUFXLENBQUMsQ0FBQztRQUMxQix5QkFBb0IsR0FBVyxDQUFDLENBQUM7UUFDakMsZ0JBQVcsR0FBVyxDQUFDLENBQUM7UUFDeEIsaUJBQVksR0FBVyxDQUFDLENBQUM7UUFDekIsZ0JBQVcsR0FBVyxDQUFDLENBQUM7UUFDeEIsbUNBQThCLEdBQUcsMkJBQWUsQ0FBQyxhQUFhLENBQUM7SUFJL0QsQ0FBQztJQUVELHVDQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyw2QkFBcUIsQ0FBQyxlQUFlLENBQUMsc0JB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QUMxQyxDQUFDO3lDQTJCeUMseUNBQWtCLEVBQTBCLCtCQUFhO1lBQzlELHNCQUFjLEVBQW9CLGVBQU0sRUFBeUIsOEJBQWE7T0ExQnZHLG9CQUFvQixDQW9QaEM7SUFBRCwyQkFBQztDQXBQRCxBQW9QQyxJQUFBO0FBcFBZLG9EQUFvQiIsImZpbGUiOiJhcHAvYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9jb3N0LXN1bW1hcnktcmVwb3J0L2Nvc3QtaGVhZC9nZXQtcXVhbnRpdHkvZ2V0LXF1YW50aXR5LmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBPbkluaXQsIElucHV0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU2Vzc2lvblN0b3JhZ2UsIFNlc3Npb25TdG9yYWdlU2VydmljZSwgIE1lc3NhZ2UsIE1lc3NhZ2VzLCBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IFF1YW50aXR5SXRlbSB9IGZyb20gJy4uLy4uLy4uLy4uL21vZGVsL3F1YW50aXR5LWl0ZW0nO1xyXG5pbXBvcnQgeyBDb3N0U3VtbWFyeVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jb3N0LXN1bW1hcnkuc2VydmljZSc7XHJcbmltcG9ydCB7XHJcbiAgUHJvamVjdEVsZW1lbnRzLCBCdXR0b24sIFRhYmxlSGVhZGluZ3MsIExhYmVsLCBIZWFkaW5ncyxcclxuICBWYWx1ZUNvbnN0YW50XHJcbn0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IExvYWRlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi9zaGFyZWQvbG9hZGVyL2xvYWRlcnMuc2VydmljZSc7XHJcbmltcG9ydCB7IENhdGVnb3J5IH0gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWwvY2F0ZWdvcnknO1xyXG5pbXBvcnQgeyBXb3JrSXRlbSB9IGZyb20gJy4uLy4uLy4uLy4uL21vZGVsL3dvcmstaXRlbSc7XHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IENvbW1vblNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi8uLi9hcHAvc2hhcmVkL3NlcnZpY2VzL2NvbW1vbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUXVhbnRpdHlEZXRhaWxzIH0gZnJvbSAnLi4vLi4vLi4vLi4vbW9kZWwvcXVhbnRpdHktZGV0YWlscyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAnYmktZ2V0LXF1YW50aXR5JyxcclxuICB0ZW1wbGF0ZVVybDogJ2dldC1xdWFudGl0eS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJ2dldC1xdWFudGl0eS5jb21wb25lbnQuY3NzJ10sXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgR2V0UXVhbnRpdHlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpIHF1YW50aXR5SXRlbXMgOiAgQXJyYXk8UXVhbnRpdHlJdGVtPjtcclxuICBASW5wdXQoKSBxdWFudGl0eURldGFpbHMgOiAgQXJyYXk8UXVhbnRpdHlEZXRhaWxzPjtcclxuICBASW5wdXQoKSBjYXRlZ29yeURldGFpbHMgOiAgQXJyYXk8Q2F0ZWdvcnk+O1xyXG4gIEBJbnB1dCgpIGNhdGVnb3J5UmF0ZUFuYWx5c2lzSWQgOiBudW1iZXI7XHJcbiAgQElucHV0KCkgd29ya0l0ZW1SYXRlQW5hbHlzaXNJZCA6IG51bWJlcjtcclxuICBASW5wdXQoKSB3b3JrSXRlbXNMaXN0IDogQXJyYXk8V29ya0l0ZW0+O1xyXG4gIEBJbnB1dCgpIGJhc2VVcmwgOiBzdHJpbmc7XHJcbiAgQElucHV0KCkga2V5UXVhbnRpdHkgOiBzdHJpbmc7XHJcblxyXG4gIEBPdXRwdXQoKSBzaG93V29ya0l0ZW1UYWJOYW1lID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XHJcbiAgQE91dHB1dCgpIGNsb3NlUXVhbnRpdHlWaWV3ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBjYXRlZ29yaWVzVG90YWxBbW91bnQgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcclxuXHJcbiAgcHJvamVjdElkIDogc3RyaW5nO1xyXG4gIGJ1aWxkaW5nSWQ6IHN0cmluZztcclxuICB3b3JrSXRlbUlkOiBudW1iZXI7XHJcbiAgcXVhbnRpdHlJbmRleDogbnVtYmVyO1xyXG4gIHF1YW50aXR5VG90YWw6IG51bWJlciA9IDA7XHJcbiAgcXVhbnRpdHlOdW1iZXJzVG90YWw6IG51bWJlciA9IDA7XHJcbiAgbGVuZ3RoVG90YWw6IG51bWJlciA9IDA7XHJcbiAgYnJlYWR0aFRvdGFsOiBudW1iZXIgPSAwO1xyXG4gIGhlaWdodFRvdGFsOiBudW1iZXIgPSAwO1xyXG4gIGRlbGV0ZUNvbmZpcm1hdGlvblF1YW50aXR5SXRlbSA9IFByb2plY3RFbGVtZW50cy5RVUFOVElUWV9JVEVNO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvc3RTdW1tYXJ5U2VydmljZSA6IENvc3RTdW1tYXJ5U2VydmljZSwgIHByaXZhdGUgbG9hZGVyU2VydmljZTogTG9hZGVyU2VydmljZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIG1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSwgcHJpdmF0ZSBfcm91dGVyIDogUm91dGVyLCBwcml2YXRlIGNvbW1vblNlcnZpY2U6IENvbW1vblNlcnZpY2UpIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy51cGRhdGVBbGxRdWFudGl0eSgpO1xyXG4gICB0aGlzLndvcmtJdGVtSWQgPSBwYXJzZUZsb2F0KFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9XT1JLSVRFTV9JRCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVF1YW50aXR5KGNob2ljZTpzdHJpbmcgKSB7XHJcbiAgICBzd2l0Y2goY2hvaWNlKSB7XHJcbiAgICAgIGNhc2UgJ3VwZGF0ZU5vcyc6IHtcclxuICAgICAgICB0aGlzLnF1YW50aXR5TnVtYmVyc1RvdGFsID0wO1xyXG4gICAgICAgIGZvcihsZXQgcXVhbnRpdHlJbmRleCBpbiB0aGlzLnF1YW50aXR5SXRlbXMpIHtcclxuICAgICAgICAgIHRoaXMucXVhbnRpdHlOdW1iZXJzVG90YWw9IHRoaXMuY29tbW9uU2VydmljZS5kZWNpbWFsQ29udmVyc2lvbih0aGlzLnF1YW50aXR5TnVtYmVyc1RvdGFsICtcclxuICAgICAgICAgICAgdGhpcy5xdWFudGl0eUl0ZW1zW3F1YW50aXR5SW5kZXhdLm5vcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ2V0UXVhbnRpdHlUb3RhbCh0aGlzLnF1YW50aXR5SXRlbXMpO1xyXG4gICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ3VwZGF0ZUxlbmd0aCc6IHtcclxuICAgICAgICB0aGlzLmxlbmd0aFRvdGFsID0gMDtcclxuICAgICAgICBmb3IobGV0IHF1YW50aXR5SW5kZXggaW4gdGhpcy5xdWFudGl0eUl0ZW1zKSAge1xyXG4gICAgICAgICAgdGhpcy5sZW5ndGhUb3RhbCA9IHRoaXMuY29tbW9uU2VydmljZS5kZWNpbWFsQ29udmVyc2lvbih0aGlzLmxlbmd0aFRvdGFsICtcclxuICAgICAgICAgICAgdGhpcy5xdWFudGl0eUl0ZW1zW3F1YW50aXR5SW5kZXhdLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ2V0UXVhbnRpdHlUb3RhbCh0aGlzLnF1YW50aXR5SXRlbXMpO1xyXG4gICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ3VwZGF0ZUJyZWFkdGgnIDoge1xyXG4gICAgICAgIHRoaXMuYnJlYWR0aFRvdGFsPSAwO1xyXG4gICAgICAgIGZvcihsZXQgcXVhbnRpdHlJbmRleCBpbiB0aGlzLnF1YW50aXR5SXRlbXMpICB7XHJcbiAgICAgICAgICB0aGlzLmJyZWFkdGhUb3RhbCA9IHRoaXMuY29tbW9uU2VydmljZS5kZWNpbWFsQ29udmVyc2lvbih0aGlzLmJyZWFkdGhUb3RhbCArXHJcbiAgICAgICAgICAgIHRoaXMucXVhbnRpdHlJdGVtc1txdWFudGl0eUluZGV4XS5icmVhZHRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5nZXRRdWFudGl0eVRvdGFsKHRoaXMucXVhbnRpdHlJdGVtcyk7XHJcbiAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAndXBkYXRlSGVpZ2h0JyA6IHtcclxuICAgICAgICB0aGlzLmhlaWdodFRvdGFsPTA7XHJcbiAgICAgICAgZm9yKGxldCBxdWFudGl0eUluZGV4IGluIHRoaXMucXVhbnRpdHlJdGVtcykgIHtcclxuICAgICAgICAgIHRoaXMuaGVpZ2h0VG90YWwgPSB0aGlzLmNvbW1vblNlcnZpY2UuZGVjaW1hbENvbnZlcnNpb24odGhpcy5oZWlnaHRUb3RhbCArXHJcbiAgICAgICAgICAgIHRoaXMucXVhbnRpdHlJdGVtc1txdWFudGl0eUluZGV4XS5oZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdldFF1YW50aXR5VG90YWwodGhpcy5xdWFudGl0eUl0ZW1zKTtcclxuICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0UXVhbnRpdHlUb3RhbChxdWFudGl0eUl0ZW1zIDogYW55KSB7XHJcbiAgICB0aGlzLnF1YW50aXR5VG90YWwgPSAwO1xyXG4gICAgdGhpcy5xdWFudGl0eUl0ZW1zID0gcXVhbnRpdHlJdGVtcztcclxuXHJcbiAgICBmb3IobGV0IHF1YW50aXR5SW5kZXggaW4gdGhpcy5xdWFudGl0eUl0ZW1zKSB7XHJcbiAgICAgIHZhciBudW1iZXIgPSB0aGlzLnF1YW50aXR5SXRlbXNbcXVhbnRpdHlJbmRleF0ubm9zO1xyXG4gICAgICB2YXIgbGVuZ3RoID0gdGhpcy5xdWFudGl0eUl0ZW1zW3F1YW50aXR5SW5kZXhdLmxlbmd0aDtcclxuICAgICAgdmFyIGhlaWdodCA9IHRoaXMucXVhbnRpdHlJdGVtc1txdWFudGl0eUluZGV4XS5oZWlnaHQ7XHJcblxyXG4gICAgICB0aGlzLnF1YW50aXR5SXRlbXNbcXVhbnRpdHlJbmRleF0ucXVhbnRpdHkgPSB0aGlzLmNvbW1vblNlcnZpY2UuZGVjaW1hbENvbnZlcnNpb24oIG51bWJlciAqIGxlbmd0aCAqIGhlaWdodCApO1xyXG4gICAgICB0aGlzLnF1YW50aXR5VG90YWwgPSB0aGlzLmNvbW1vblNlcnZpY2UuZGVjaW1hbENvbnZlcnNpb24odGhpcy5xdWFudGl0eVRvdGFsICtcclxuICAgICAgICB0aGlzLnF1YW50aXR5SXRlbXNbcXVhbnRpdHlJbmRleF0ucXVhbnRpdHkpO1xyXG4gICAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgdXBkYXRlQWxsUXVhbnRpdHkoKSB7XHJcbiAgICB0aGlzLnVwZGF0ZVF1YW50aXR5KCd1cGRhdGVOb3MnKTtcclxuICAgIHRoaXMudXBkYXRlUXVhbnRpdHkoJ3VwZGF0ZUxlbmd0aCcpO1xyXG4gICAgdGhpcy51cGRhdGVRdWFudGl0eSgndXBkYXRlQnJlYWR0aCcpO1xyXG4gICAgdGhpcy51cGRhdGVRdWFudGl0eSgndXBkYXRlSGVpZ2h0Jyk7XHJcbiAgfVxyXG5cclxuICBhZGRRdWFudGl0eUl0ZW0oKSB7XHJcbiAgICBsZXQgcXVhbnRpdHkgPSBuZXcgUXVhbnRpdHlJdGVtKCk7XHJcbiAgICBxdWFudGl0eS5pdGVtID0gJyc7XHJcbiAgICBxdWFudGl0eS5yZW1hcmtzID0gJyc7XHJcbiAgICBxdWFudGl0eS5ub3MgPSAwO1xyXG4gICAgcXVhbnRpdHkubGVuZ3RoID0gMDtcclxuICAgIHF1YW50aXR5LmJyZWFkdGggPSAwO1xyXG4gICAgcXVhbnRpdHkuaGVpZ2h0ID0gMDtcclxuICAgIHF1YW50aXR5LnF1YW50aXR5ID0gMDtcclxuICAgIHF1YW50aXR5LnVuaXQgPSAnc3FmdCc7XHJcbiAgICB0aGlzLnF1YW50aXR5SXRlbXMucHVzaChxdWFudGl0eSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVRdWFudGl0eUl0ZW0ocXVhbnRpdHlJdGVtcyA6IEFycmF5PFF1YW50aXR5SXRlbT4pIHtcclxuXHJcbiAgICBpZih0aGlzLnZhbGlkYXRlUXVhbnRpdHlJdGVtKHF1YW50aXR5SXRlbXMpICYmICh0aGlzLmtleVF1YW50aXR5ICE9PSAnJ1xyXG4gICAgICAgICYmIHRoaXMua2V5UXVhbnRpdHkgIT09IG51bGwgJiYgdGhpcy5rZXlRdWFudGl0eSAhPT0gdW5kZWZpbmVkKSkge1xyXG5cclxuICAgICAgbGV0IHF1YW50aXR5T2JqIDogUXVhbnRpdHlEZXRhaWxzID0gbmV3IFF1YW50aXR5RGV0YWlscygpO1xyXG4gICAgICBxdWFudGl0eU9iai5uYW1lID0gdGhpcy5rZXlRdWFudGl0eTtcclxuICAgICAgcXVhbnRpdHlPYmoucXVhbnRpdHlJdGVtcyA9IHF1YW50aXR5SXRlbXM7XHJcbiAgICAgIHRoaXMubG9hZGVyU2VydmljZS5zdGFydCgpO1xyXG4gICAgICBsZXQgY29zdEhlYWRJZCA9IHBhcnNlRmxvYXQoU2Vzc2lvblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25WYWx1ZShTZXNzaW9uU3RvcmFnZS5DVVJSRU5UX0NPU1RfSEVBRF9JRCkpO1xyXG4gICAgICB0aGlzLmNvc3RTdW1tYXJ5U2VydmljZS51cGRhdGVRdWFudGl0eUl0ZW1zKHRoaXMuYmFzZVVybCwgY29zdEhlYWRJZCwgdGhpcy5jYXRlZ29yeVJhdGVBbmFseXNpc0lkLFxyXG4gICAgICAgIHRoaXMud29ya0l0ZW1JZCwgcXVhbnRpdHlPYmopLnN1YnNjcmliZShcclxuICAgICAgICBzdWNjZXNzID0+IHRoaXMub25VcGRhdGVRdWFudGl0eUl0ZW1zU3VjY2VzcyhzdWNjZXNzKSxcclxuICAgICAgICBlcnJvciA9PiB0aGlzLm9uVXBkYXRlUXVhbnRpdHlJdGVtc0ZhaWx1cmUoZXJyb3IpXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgICBpZih0aGlzLmtleVF1YW50aXR5ICE9PSBudWxsICYmIHRoaXMua2V5UXVhbnRpdHkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIG1lc3NhZ2UuY3VzdG9tX21lc3NhZ2UgPSBNZXNzYWdlcy5NU0dfRVJST1JfVkFMSURBVElPTl9RVUFOVElUWV9SRVFVSVJFRDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fUVVBTlRJVFlfTkFNRV9SRVFVSVJFRDtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YWxpZGF0ZVF1YW50aXR5SXRlbShxdWFudGl0eUl0ZW1zIDogQXJyYXk8UXVhbnRpdHlJdGVtPikge1xyXG4gICAgZm9yKGxldCBxdWFudGl0eUl0ZW1EYXRhIG9mIHF1YW50aXR5SXRlbXMpIHtcclxuICAgICAgaWYoKHF1YW50aXR5SXRlbURhdGEuaXRlbSA9PT0gJycgfHwgcXVhbnRpdHlJdGVtRGF0YS5pdGVtID09PSB1bmRlZmluZWQgfHwgIHF1YW50aXR5SXRlbURhdGEuaXRlbS50cmltKCkgPT09ICcnKSB8fFxyXG4gICAgICAgIChxdWFudGl0eUl0ZW1EYXRhLm5vcyA9PT0gdW5kZWZpbmVkIHx8IHF1YW50aXR5SXRlbURhdGEubm9zID09PSBudWxsKSB8fFxyXG4gICAgICAgIChxdWFudGl0eUl0ZW1EYXRhLmxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IHF1YW50aXR5SXRlbURhdGEubGVuZ3RoID09PSBudWxsKSB8fFxyXG4gICAgICAgIChxdWFudGl0eUl0ZW1EYXRhLmhlaWdodCA9PT0gdW5kZWZpbmVkIHx8IHF1YW50aXR5SXRlbURhdGEuaGVpZ2h0ID09PSBudWxsKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBvblVwZGF0ZVF1YW50aXR5SXRlbXNTdWNjZXNzKHN1Y2Nlc3MgOiBzdHJpbmcpIHtcclxuICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX1NBVkVEX0NPU1RfSEVBRF9JVEVNO1xyXG4gICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG5cclxuICAgIGxldCB3b3JrSXRlbUlkID0gdGhpcy53b3JrSXRlbUlkO1xyXG4gICAgbGV0IHdvcmtJdGVtRGF0YSA9IHRoaXMud29ya0l0ZW1zTGlzdC5maWx0ZXIoXHJcbiAgICAgIGZ1bmN0aW9uKCB3b3JrSXRlbURhdGE6IGFueSl7XHJcbiAgICAgICAgcmV0dXJuIHdvcmtJdGVtRGF0YS5yYXRlQW5hbHlzaXNJZCA9PT0gd29ya0l0ZW1JZDtcclxuICAgICAgfSk7XHJcblxyXG4gICAgdGhpcy5jb21tb25TZXJ2aWNlLmNhbGN1bGF0ZVRvdGFsT2ZRdWFudGl0eUl0ZW1EZXRhaWxzKHdvcmtJdGVtRGF0YVswXSk7XHJcbiAgICAgICAgaWYod29ya0l0ZW1EYXRhWzBdLnF1YW50aXR5LnRvdGFsICE9PSAwKSB7XHJcbiAgICAgICAgICB3b3JrSXRlbURhdGFbMF0ucXVhbnRpdHkuaXNFc3RpbWF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgaWYod29ya0l0ZW1EYXRhWzBdLnF1YW50aXR5LmlzRXN0aW1hdGVkICYmIHdvcmtJdGVtRGF0YVswXS5yYXRlLmlzRXN0aW1hdGVkKSB7XHJcbiAgICAgICAgICAgIHdvcmtJdGVtRGF0YVswXS5hbW91bnQgPSB0aGlzLmNvbW1vblNlcnZpY2UuY2FsY3VsYXRlQW1vdW50T2ZXb3JrSXRlbSh3b3JrSXRlbURhdGFbMF0ucXVhbnRpdHkudG90YWwsXHJcbiAgICAgICAgICAgICAgd29ya0l0ZW1EYXRhWzBdLnJhdGUudG90YWwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB3b3JrSXRlbURhdGFbMF0ucXVhbnRpdHkuaXNFc3RpbWF0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgIHdvcmtJdGVtRGF0YVswXS5hbW91bnQgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgIGxldCBjYXRlZ29yaWVzVG90YWw9IHRoaXMuY29tbW9uU2VydmljZS50b3RhbENhbGN1bGF0aW9uT2ZDYXRlZ29yaWVzKHRoaXMuY2F0ZWdvcnlEZXRhaWxzLFxyXG4gICAgICB0aGlzLmNhdGVnb3J5UmF0ZUFuYWx5c2lzSWQsIHRoaXMud29ya0l0ZW1zTGlzdCk7XHJcbiAgICB0aGlzLmNhdGVnb3JpZXNUb3RhbEFtb3VudC5lbWl0KGNhdGVnb3JpZXNUb3RhbCk7XHJcbiAgICB0aGlzLnNob3dXb3JrSXRlbVRhYk5hbWUuZW1pdCgnJyk7XHJcbiAgICAgIHRoaXMubG9hZGVyU2VydmljZS5zdG9wKCk7XHJcbiAgfVxyXG5cclxuICBvblVwZGF0ZVF1YW50aXR5SXRlbXNGYWlsdXJlKGVycm9yOiBhbnkpIHtcclxuICAgIHZhciBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoKTtcclxuICAgIG1lc3NhZ2UuaXNFcnJvciA9IHRydWU7XHJcbiAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX1NVQ0NFU1NfU0FWRURfQ09TVF9IRUFEX0lURU1fRVJST1I7XHJcbiAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgc2V0UXVhbnRpdHlJdGVtTmFtZUZvckRlbGV0ZShxdWFudGl0eUluZGV4OiBudW1iZXIpIHtcclxuICAgICB0aGlzLnF1YW50aXR5SW5kZXg9IHF1YW50aXR5SW5kZXg7XHJcbiAgfVxyXG5cclxuICBkZWxldGVRdWFudGl0eUl0ZW0ocXVhbnRpdHlJbmRleDogbnVtYmVyKSB7XHJcblxyXG4gICAgIHRoaXMucXVhbnRpdHlJbmRleD0gcXVhbnRpdHlJbmRleDtcclxuICAgICB0aGlzLnF1YW50aXR5SXRlbXMuc3BsaWNlKHRoaXMucXVhbnRpdHlJbmRleCwxKTtcclxuICAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICAgbWVzc2FnZS5pc0Vycm9yID0gZmFsc2U7XHJcbiAgICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0RFTEVURV9RVUFOVElUWV9JVEVNO1xyXG4gICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuICAgICB0aGlzLnVwZGF0ZUFsbFF1YW50aXR5KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgY2xvc2VRdWFudGl0eVRhYigpIHtcclxuICAgIGxldCBxdWFudGl0eUl0ZW1zQXJyYXkgPSB0aGlzLnF1YW50aXR5SXRlbXM7XHJcbiAgICBmb3IobGV0IHF1YW50aXR5SW5kZXggaW4gcXVhbnRpdHlJdGVtc0FycmF5KSB7XHJcbiAgICAgIGlmKChxdWFudGl0eUl0ZW1zQXJyYXlbcXVhbnRpdHlJbmRleF0uaXRlbSA9PT0gbnVsbCB8fCBxdWFudGl0eUl0ZW1zQXJyYXlbcXVhbnRpdHlJbmRleF0uaXRlbSA9PT0gJycgKSYmXHJcbiAgICAgICAgKHF1YW50aXR5SXRlbXNBcnJheVtxdWFudGl0eUluZGV4XS5ub3MgPT09IDAgfHwgcXVhbnRpdHlJdGVtc0FycmF5W3F1YW50aXR5SW5kZXhdLm5vcyA9PT0gbnVsbCkgfHxcclxuICAgICAgICAocXVhbnRpdHlJdGVtc0FycmF5W3F1YW50aXR5SW5kZXhdLmxlbmd0aCA9PT0gMCB8fCBxdWFudGl0eUl0ZW1zQXJyYXlbcXVhbnRpdHlJbmRleF0ubGVuZ3RoID09PSBudWxsKSB8fFxyXG4gICAgICAgIChxdWFudGl0eUl0ZW1zQXJyYXlbcXVhbnRpdHlJbmRleF0uaGVpZ2h0ID09PSAwIHx8IHF1YW50aXR5SXRlbXNBcnJheVtxdWFudGl0eUluZGV4XS5oZWlnaHQgPT09IG51bGwpKSB7XHJcblxyXG4gICAgICBxdWFudGl0eUl0ZW1zQXJyYXkuc3BsaWNlKHBhcnNlSW50KHF1YW50aXR5SW5kZXgpLHF1YW50aXR5SXRlbXNBcnJheS5sZW5ndGgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMucXVhbnRpdHlJdGVtcyA9IHF1YW50aXR5SXRlbXNBcnJheTtcclxuICAgICAgICB0aGlzLmNsb3NlUXVhbnRpdHlWaWV3LmVtaXQoJycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLmNsb3NlUXVhbnRpdHlWaWV3LmVtaXQoJycpO1xyXG4gIH1cclxuXHJcbiAvKiBkZWxldGVFbGVtZW50KGVsZW1lbnRUeXBlIDogc3RyaW5nKSB7XHJcbiAgICBpZihlbGVtZW50VHlwZSA9PT0gUHJvamVjdEVsZW1lbnRzLlFVQU5USVRZX0lURU0pIHtcclxuICAgICAgdGhpcy5kZWxldGVRdWFudGl0eUl0ZW0oKTtcclxuICAgIH1cclxuICB9Ki9cclxuXHJcbiAgZ2V0QnV0dG9uKCkge1xyXG4gICAgcmV0dXJuIEJ1dHRvbjtcclxuICB9XHJcblxyXG4gIGdldFRhYmxlSGVhZGluZ3MoKSB7XHJcbiAgICByZXR1cm4gVGFibGVIZWFkaW5ncztcclxuICB9XHJcblxyXG4gIGdldExhYmVsKCkge1xyXG4gICAgcmV0dXJuIExhYmVsO1xyXG4gIH1cclxuXHJcbiAgZ2V0SGVhZGluZ3MoKSB7XHJcbiAgICByZXR1cm4gSGVhZGluZ3M7XHJcbiAgfVxyXG59XHJcbiJdfQ==
