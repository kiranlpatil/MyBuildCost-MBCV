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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1oZWFkL2dldC1xdWFudGl0eS9nZXQtcXVhbnRpdHkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQStFO0FBQy9FLHdEQUEySDtBQUMzSCxpRUFBK0Q7QUFDL0QsbUVBQWdFO0FBQ2hFLGdFQUc0QztBQUM1QyxtRkFBZ0Y7QUFHaEYsMENBQXlDO0FBQ3pDLDBGQUF3RjtBQUN4Rix1RUFBcUU7QUFTckU7SUF3QkUsOEJBQW9CLGtCQUF1QyxFQUFXLGFBQTRCLEVBQzlFLGNBQThCLEVBQVUsT0FBZ0IsRUFBVSxhQUE0QjtRQUQ5Rix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQXFCO1FBQVcsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDOUUsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBZnhHLHdCQUFtQixHQUFHLElBQUksbUJBQVksRUFBVSxDQUFDO1FBQ2pELHNCQUFpQixHQUFHLElBQUksbUJBQVksRUFBRSxDQUFDO1FBQ3ZDLDBCQUFxQixHQUFHLElBQUksbUJBQVksRUFBVSxDQUFDO1FBTTdELGtCQUFhLEdBQVcsQ0FBQyxDQUFDO1FBQzFCLHlCQUFvQixHQUFXLENBQUMsQ0FBQztRQUNqQyxnQkFBVyxHQUFXLENBQUMsQ0FBQztRQUN4QixpQkFBWSxHQUFXLENBQUMsQ0FBQztRQUN6QixnQkFBVyxHQUFXLENBQUMsQ0FBQztJQUl4QixDQUFDO0lBRUQsdUNBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLDZCQUFxQixDQUFDLGVBQWUsQ0FBQyxzQkFBYyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztJQUN2RyxDQUFD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RTtZQUNuQixRQUFRLEVBQUUsaUJBQWlCO1lBQzNCLFdBQVcsRUFBRSw2QkFBNkI7WUFDMUMsU0FBUyxFQUFFLENBQUMsNEJBQTRCLENBQUM7U0FDMUMsQ0FBQzt5Q0EwQnlDLHlDQUFrQixFQUEwQiwrQkFBYTtZQUM5RCxzQkFBYyxFQUFvQixlQUFNLEVBQXlCLDhCQUFhO09BekJ2RyxvQkFBb0IsQ0FnT2hDO0lBQUQsMkJBQUM7Q0FoT0QsQUFnT0MsSUFBQTtBQWhPWSxvREFBb0IiLCJmaWxlIjoiYXBwL2J1aWxkLWluZm8vZnJhbWV3b3JrL3Byb2plY3QvY29zdC1zdW1tYXJ5LXJlcG9ydC9jb3N0LWhlYWQvZ2V0LXF1YW50aXR5L2dldC1xdWFudGl0eS5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgT25Jbml0LCBJbnB1dCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFNlc3Npb25TdG9yYWdlLCBTZXNzaW9uU3RvcmFnZVNlcnZpY2UsICBNZXNzYWdlLCBNZXNzYWdlcywgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi9zaGFyZWQvaW5kZXgnO1xyXG5pbXBvcnQgeyBRdWFudGl0eUl0ZW0gfSBmcm9tICcuLi8uLi8uLi8uLi9tb2RlbC9xdWFudGl0eS1pdGVtJztcclxuaW1wb3J0IHsgQ29zdFN1bW1hcnlTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY29zdC1zdW1tYXJ5LnNlcnZpY2UnO1xyXG5pbXBvcnQge1xyXG4gIFByb2plY3RFbGVtZW50cywgQnV0dG9uLCBUYWJsZUhlYWRpbmdzLCBMYWJlbCwgSGVhZGluZ3MsXHJcbiAgVmFsdWVDb25zdGFudFxyXG59IGZyb20gJy4uLy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBMb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vc2hhcmVkL2xvYWRlci9sb2FkZXJzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDYXRlZ29yeSB9IGZyb20gJy4uLy4uLy4uLy4uL21vZGVsL2NhdGVnb3J5JztcclxuaW1wb3J0IHsgV29ya0l0ZW0gfSBmcm9tICcuLi8uLi8uLi8uLi9tb2RlbC93b3JrLWl0ZW0nO1xyXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBDb21tb25TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vLi4vYXBwL3NoYXJlZC9zZXJ2aWNlcy9jb21tb24uc2VydmljZSc7XHJcbmltcG9ydCB7IFF1YW50aXR5RGV0YWlscyB9IGZyb20gJy4uLy4uLy4uLy4uL21vZGVsL3F1YW50aXR5LWRldGFpbHMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcclxuICBzZWxlY3RvcjogJ2JpLWdldC1xdWFudGl0eScsXHJcbiAgdGVtcGxhdGVVcmw6ICdnZXQtcXVhbnRpdHkuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydnZXQtcXVhbnRpdHkuY29tcG9uZW50LmNzcyddLFxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIEdldFF1YW50aXR5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBASW5wdXQoKSBxdWFudGl0eUl0ZW1zIDogIEFycmF5PFF1YW50aXR5SXRlbT47XHJcbiAgQElucHV0KCkgcXVhbnRpdHlEZXRhaWxzIDogIEFycmF5PFF1YW50aXR5RGV0YWlscz47XHJcbiAgQElucHV0KCkgY2F0ZWdvcnlEZXRhaWxzIDogIEFycmF5PENhdGVnb3J5PjtcclxuICBASW5wdXQoKSBjYXRlZ29yeVJhdGVBbmFseXNpc0lkIDogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIHdvcmtJdGVtUmF0ZUFuYWx5c2lzSWQgOiBudW1iZXI7XHJcbiAgQElucHV0KCkgd29ya0l0ZW1zTGlzdCA6IEFycmF5PFdvcmtJdGVtPjtcclxuICBASW5wdXQoKSBiYXNlVXJsIDogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGtleVF1YW50aXR5IDogc3RyaW5nO1xyXG5cclxuICBAT3V0cHV0KCkgc2hvd1dvcmtJdGVtVGFiTmFtZSA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xyXG4gIEBPdXRwdXQoKSBjbG9zZVF1YW50aXR5VmlldyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgY2F0ZWdvcmllc1RvdGFsQW1vdW50ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XHJcblxyXG4gIHByb2plY3RJZCA6IHN0cmluZztcclxuICBidWlsZGluZ0lkOiBzdHJpbmc7XHJcbiAgd29ya0l0ZW1JZDogbnVtYmVyO1xyXG4gIHF1YW50aXR5SW5kZXg6IG51bWJlcjtcclxuICBxdWFudGl0eVRvdGFsOiBudW1iZXIgPSAwO1xyXG4gIHF1YW50aXR5TnVtYmVyc1RvdGFsOiBudW1iZXIgPSAwO1xyXG4gIGxlbmd0aFRvdGFsOiBudW1iZXIgPSAwO1xyXG4gIGJyZWFkdGhUb3RhbDogbnVtYmVyID0gMDtcclxuICBoZWlnaHRUb3RhbDogbnVtYmVyID0gMDtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb3N0U3VtbWFyeVNlcnZpY2UgOiBDb3N0U3VtbWFyeVNlcnZpY2UsICBwcml2YXRlIGxvYWRlclNlcnZpY2U6IExvYWRlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBtZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UsIHByaXZhdGUgX3JvdXRlciA6IFJvdXRlciwgcHJpdmF0ZSBjb21tb25TZXJ2aWNlOiBDb21tb25TZXJ2aWNlKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMudXBkYXRlQWxsUXVhbnRpdHkoKTtcclxuICAgdGhpcy53b3JrSXRlbUlkID0gcGFyc2VGbG9hdChTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkNVUlJFTlRfV09SS0lURU1fSUQpKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVRdWFudGl0eShjaG9pY2U6c3RyaW5nICkge1xyXG4gICAgc3dpdGNoKGNob2ljZSkge1xyXG4gICAgICBjYXNlICd1cGRhdGVOb3MnOiB7XHJcbiAgICAgICAgdGhpcy5xdWFudGl0eU51bWJlcnNUb3RhbCA9MDtcclxuICAgICAgICBmb3IobGV0IHF1YW50aXR5SW5kZXggaW4gdGhpcy5xdWFudGl0eUl0ZW1zKSB7XHJcbiAgICAgICAgICB0aGlzLnF1YW50aXR5TnVtYmVyc1RvdGFsPSB0aGlzLmNvbW1vblNlcnZpY2UuZGVjaW1hbENvbnZlcnNpb24odGhpcy5xdWFudGl0eU51bWJlcnNUb3RhbCArXHJcbiAgICAgICAgICAgIHRoaXMucXVhbnRpdHlJdGVtc1txdWFudGl0eUluZGV4XS5ub3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdldFF1YW50aXR5VG90YWwodGhpcy5xdWFudGl0eUl0ZW1zKTtcclxuICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICd1cGRhdGVMZW5ndGgnOiB7XHJcbiAgICAgICAgdGhpcy5sZW5ndGhUb3RhbCA9IDA7XHJcbiAgICAgICAgZm9yKGxldCBxdWFudGl0eUluZGV4IGluIHRoaXMucXVhbnRpdHlJdGVtcykgIHtcclxuICAgICAgICAgIHRoaXMubGVuZ3RoVG90YWwgPSB0aGlzLmNvbW1vblNlcnZpY2UuZGVjaW1hbENvbnZlcnNpb24odGhpcy5sZW5ndGhUb3RhbCArXHJcbiAgICAgICAgICAgIHRoaXMucXVhbnRpdHlJdGVtc1txdWFudGl0eUluZGV4XS5sZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdldFF1YW50aXR5VG90YWwodGhpcy5xdWFudGl0eUl0ZW1zKTtcclxuICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICd1cGRhdGVCcmVhZHRoJyA6IHtcclxuICAgICAgICB0aGlzLmJyZWFkdGhUb3RhbD0gMDtcclxuICAgICAgICBmb3IobGV0IHF1YW50aXR5SW5kZXggaW4gdGhpcy5xdWFudGl0eUl0ZW1zKSAge1xyXG4gICAgICAgICAgdGhpcy5icmVhZHRoVG90YWwgPSB0aGlzLmNvbW1vblNlcnZpY2UuZGVjaW1hbENvbnZlcnNpb24odGhpcy5icmVhZHRoVG90YWwgK1xyXG4gICAgICAgICAgICB0aGlzLnF1YW50aXR5SXRlbXNbcXVhbnRpdHlJbmRleF0uYnJlYWR0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ2V0UXVhbnRpdHlUb3RhbCh0aGlzLnF1YW50aXR5SXRlbXMpO1xyXG4gICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ3VwZGF0ZUhlaWdodCcgOiB7XHJcbiAgICAgICAgdGhpcy5oZWlnaHRUb3RhbD0wO1xyXG4gICAgICAgIGZvcihsZXQgcXVhbnRpdHlJbmRleCBpbiB0aGlzLnF1YW50aXR5SXRlbXMpICB7XHJcbiAgICAgICAgICB0aGlzLmhlaWdodFRvdGFsID0gdGhpcy5jb21tb25TZXJ2aWNlLmRlY2ltYWxDb252ZXJzaW9uKHRoaXMuaGVpZ2h0VG90YWwgK1xyXG4gICAgICAgICAgICB0aGlzLnF1YW50aXR5SXRlbXNbcXVhbnRpdHlJbmRleF0uaGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5nZXRRdWFudGl0eVRvdGFsKHRoaXMucXVhbnRpdHlJdGVtcyk7XHJcbiAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldFF1YW50aXR5VG90YWwocXVhbnRpdHlJdGVtcyA6IGFueSkge1xyXG4gICAgdGhpcy5xdWFudGl0eVRvdGFsID0gMDtcclxuICAgIHRoaXMucXVhbnRpdHlJdGVtcyA9IHF1YW50aXR5SXRlbXM7XHJcblxyXG4gICAgZm9yKGxldCBxdWFudGl0eUluZGV4IGluIHRoaXMucXVhbnRpdHlJdGVtcykge1xyXG4gICAgICB2YXIgbnVtYmVyID0gdGhpcy5xdWFudGl0eUl0ZW1zW3F1YW50aXR5SW5kZXhdLm5vcztcclxuICAgICAgdmFyIGxlbmd0aCA9IHRoaXMucXVhbnRpdHlJdGVtc1txdWFudGl0eUluZGV4XS5sZW5ndGg7XHJcbiAgICAgIHZhciBoZWlnaHQgPSB0aGlzLnF1YW50aXR5SXRlbXNbcXVhbnRpdHlJbmRleF0uaGVpZ2h0O1xyXG5cclxuICAgICAgdGhpcy5xdWFudGl0eUl0ZW1zW3F1YW50aXR5SW5kZXhdLnF1YW50aXR5ID0gdGhpcy5jb21tb25TZXJ2aWNlLmRlY2ltYWxDb252ZXJzaW9uKCBudW1iZXIgKiBsZW5ndGggKiBoZWlnaHQgKTtcclxuICAgICAgdGhpcy5xdWFudGl0eVRvdGFsID0gdGhpcy5jb21tb25TZXJ2aWNlLmRlY2ltYWxDb252ZXJzaW9uKHRoaXMucXVhbnRpdHlUb3RhbCArXHJcbiAgICAgICAgdGhpcy5xdWFudGl0eUl0ZW1zW3F1YW50aXR5SW5kZXhdLnF1YW50aXR5KTtcclxuICAgICAgfVxyXG5cclxuICB9XHJcblxyXG4gIHVwZGF0ZUFsbFF1YW50aXR5KCkge1xyXG4gICAgdGhpcy51cGRhdGVRdWFudGl0eSgndXBkYXRlTm9zJyk7XHJcbiAgICB0aGlzLnVwZGF0ZVF1YW50aXR5KCd1cGRhdGVMZW5ndGgnKTtcclxuICAgIHRoaXMudXBkYXRlUXVhbnRpdHkoJ3VwZGF0ZUJyZWFkdGgnKTtcclxuICAgIHRoaXMudXBkYXRlUXVhbnRpdHkoJ3VwZGF0ZUhlaWdodCcpO1xyXG4gIH1cclxuXHJcbiAgYWRkUXVhbnRpdHlJdGVtKCkge1xyXG4gICAgbGV0IHF1YW50aXR5ID0gbmV3IFF1YW50aXR5SXRlbSgpO1xyXG4gICAgcXVhbnRpdHkuaXRlbSA9ICcnO1xyXG4gICAgcXVhbnRpdHkucmVtYXJrcyA9ICcnO1xyXG4gICAgcXVhbnRpdHkubm9zID0gMDtcclxuICAgIHF1YW50aXR5Lmxlbmd0aCA9IDA7XHJcbiAgICBxdWFudGl0eS5icmVhZHRoID0gMDtcclxuICAgIHF1YW50aXR5LmhlaWdodCA9IDA7XHJcbiAgICBxdWFudGl0eS5xdWFudGl0eSA9IDA7XHJcbiAgICBxdWFudGl0eS51bml0ID0gJ3NxZnQnO1xyXG4gICAgdGhpcy5xdWFudGl0eUl0ZW1zLnB1c2gocXVhbnRpdHkpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlUXVhbnRpdHlJdGVtKHF1YW50aXR5SXRlbXMgOiBBcnJheTxRdWFudGl0eUl0ZW0+KSB7XHJcblxyXG4gICAgaWYodGhpcy52YWxpZGF0ZVF1YW50aXR5SXRlbShxdWFudGl0eUl0ZW1zKSAmJiAodGhpcy5rZXlRdWFudGl0eSAhPT0gJydcclxuICAgICAgICAmJiB0aGlzLmtleVF1YW50aXR5ICE9PSBudWxsICYmIHRoaXMua2V5UXVhbnRpdHkgIT09IHVuZGVmaW5lZCkpIHtcclxuXHJcbiAgICAgIGxldCBxdWFudGl0eU9iaiA6IFF1YW50aXR5RGV0YWlscyA9IG5ldyBRdWFudGl0eURldGFpbHMoKTtcclxuICAgICAgcXVhbnRpdHlPYmoubmFtZSA9IHRoaXMua2V5UXVhbnRpdHk7XHJcbiAgICAgIHF1YW50aXR5T2JqLnF1YW50aXR5SXRlbXMgPSBxdWFudGl0eUl0ZW1zO1xyXG4gICAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RhcnQoKTtcclxuICAgICAgbGV0IGNvc3RIZWFkSWQgPSBwYXJzZUZsb2F0KFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQ1VSUkVOVF9DT1NUX0hFQURfSUQpKTtcclxuICAgICAgdGhpcy5jb3N0U3VtbWFyeVNlcnZpY2UudXBkYXRlUXVhbnRpdHlJdGVtcyh0aGlzLmJhc2VVcmwsIGNvc3RIZWFkSWQsIHRoaXMuY2F0ZWdvcnlSYXRlQW5hbHlzaXNJZCxcclxuICAgICAgICB0aGlzLndvcmtJdGVtSWQsIHF1YW50aXR5T2JqKS5zdWJzY3JpYmUoXHJcbiAgICAgICAgc3VjY2VzcyA9PiB0aGlzLm9uVXBkYXRlUXVhbnRpdHlJdGVtc1N1Y2Nlc3Moc3VjY2VzcyksXHJcbiAgICAgICAgZXJyb3IgPT4gdGhpcy5vblVwZGF0ZVF1YW50aXR5SXRlbXNGYWlsdXJlKGVycm9yKVxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgICAgaWYodGhpcy5rZXlRdWFudGl0eSAhPT0gbnVsbCAmJiB0aGlzLmtleVF1YW50aXR5ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBtZXNzYWdlLmN1c3RvbV9tZXNzYWdlID0gTWVzc2FnZXMuTVNHX0VSUk9SX1ZBTElEQVRJT05fUVVBTlRJVFlfUkVRVUlSRUQ7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19FUlJPUl9WQUxJREFUSU9OX1FVQU5USVRZX05BTUVfUkVRVUlSRUQ7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFsaWRhdGVRdWFudGl0eUl0ZW0ocXVhbnRpdHlJdGVtcyA6IEFycmF5PFF1YW50aXR5SXRlbT4pIHtcclxuICAgIGZvcihsZXQgcXVhbnRpdHlJdGVtRGF0YSBvZiBxdWFudGl0eUl0ZW1zKSB7XHJcbiAgICAgIGlmKChxdWFudGl0eUl0ZW1EYXRhLml0ZW0gPT09ICcnIHx8IHF1YW50aXR5SXRlbURhdGEuaXRlbSA9PT0gdW5kZWZpbmVkIHx8ICBxdWFudGl0eUl0ZW1EYXRhLml0ZW0udHJpbSgpID09PSAnJykgfHxcclxuICAgICAgICAocXVhbnRpdHlJdGVtRGF0YS5ub3MgPT09IHVuZGVmaW5lZCB8fCBxdWFudGl0eUl0ZW1EYXRhLm5vcyA9PT0gbnVsbCkgfHxcclxuICAgICAgICAocXVhbnRpdHlJdGVtRGF0YS5sZW5ndGggPT09IHVuZGVmaW5lZCB8fCBxdWFudGl0eUl0ZW1EYXRhLmxlbmd0aCA9PT0gbnVsbCkgfHxcclxuICAgICAgICAocXVhbnRpdHlJdGVtRGF0YS5oZWlnaHQgPT09IHVuZGVmaW5lZCB8fCBxdWFudGl0eUl0ZW1EYXRhLmhlaWdodCA9PT0gbnVsbCkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgb25VcGRhdGVRdWFudGl0eUl0ZW1zU3VjY2VzcyhzdWNjZXNzIDogc3RyaW5nKSB7XHJcbiAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICBtZXNzYWdlLmlzRXJyb3IgPSBmYWxzZTtcclxuICAgIG1lc3NhZ2UuY3VzdG9tX21lc3NhZ2UgPSBNZXNzYWdlcy5NU0dfU1VDQ0VTU19TQVZFRF9DT1NUX0hFQURfSVRFTTtcclxuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UubWVzc2FnZShtZXNzYWdlKTtcclxuXHJcbiAgICBsZXQgd29ya0l0ZW1JZCA9IHRoaXMud29ya0l0ZW1JZDtcclxuICAgIGxldCB3b3JrSXRlbURhdGEgPSB0aGlzLndvcmtJdGVtc0xpc3QuZmlsdGVyKFxyXG4gICAgICBmdW5jdGlvbiggd29ya0l0ZW1EYXRhOiBhbnkpe1xyXG4gICAgICAgIHJldHVybiB3b3JrSXRlbURhdGEucmF0ZUFuYWx5c2lzSWQgPT09IHdvcmtJdGVtSWQ7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIHRoaXMuY29tbW9uU2VydmljZS5jYWxjdWxhdGVUb3RhbE9mUXVhbnRpdHlJdGVtRGV0YWlscyh3b3JrSXRlbURhdGFbMF0pO1xyXG4gICAgICAgIGlmKHdvcmtJdGVtRGF0YVswXS5xdWFudGl0eS50b3RhbCAhPT0gMCkge1xyXG4gICAgICAgICAgd29ya0l0ZW1EYXRhWzBdLnF1YW50aXR5LmlzRXN0aW1hdGVkID0gdHJ1ZTtcclxuICAgICAgICAgIGlmKHdvcmtJdGVtRGF0YVswXS5xdWFudGl0eS5pc0VzdGltYXRlZCAmJiB3b3JrSXRlbURhdGFbMF0ucmF0ZS5pc0VzdGltYXRlZCkge1xyXG4gICAgICAgICAgICB3b3JrSXRlbURhdGFbMF0uYW1vdW50ID0gdGhpcy5jb21tb25TZXJ2aWNlLmNhbGN1bGF0ZUFtb3VudE9mV29ya0l0ZW0od29ya0l0ZW1EYXRhWzBdLnF1YW50aXR5LnRvdGFsLFxyXG4gICAgICAgICAgICAgIHdvcmtJdGVtRGF0YVswXS5yYXRlLnRvdGFsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgd29ya0l0ZW1EYXRhWzBdLnF1YW50aXR5LmlzRXN0aW1hdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICB3b3JrSXRlbURhdGFbMF0uYW1vdW50ID0gMDtcclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICBsZXQgY2F0ZWdvcmllc1RvdGFsPSB0aGlzLmNvbW1vblNlcnZpY2UudG90YWxDYWxjdWxhdGlvbk9mQ2F0ZWdvcmllcyh0aGlzLmNhdGVnb3J5RGV0YWlscyxcclxuICAgICAgdGhpcy5jYXRlZ29yeVJhdGVBbmFseXNpc0lkLCB0aGlzLndvcmtJdGVtc0xpc3QpO1xyXG4gICAgdGhpcy5jYXRlZ29yaWVzVG90YWxBbW91bnQuZW1pdChjYXRlZ29yaWVzVG90YWwpO1xyXG4gICAgdGhpcy5zaG93V29ya0l0ZW1UYWJOYW1lLmVtaXQoJycpO1xyXG4gICAgICB0aGlzLmxvYWRlclNlcnZpY2Uuc3RvcCgpO1xyXG4gIH1cclxuXHJcbiAgb25VcGRhdGVRdWFudGl0eUl0ZW1zRmFpbHVyZShlcnJvcjogYW55KSB7XHJcbiAgICB2YXIgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKCk7XHJcbiAgICBtZXNzYWdlLmlzRXJyb3IgPSB0cnVlO1xyXG4gICAgbWVzc2FnZS5jdXN0b21fbWVzc2FnZSA9IE1lc3NhZ2VzLk1TR19TVUNDRVNTX1NBVkVEX0NPU1RfSEVBRF9JVEVNX0VSUk9SO1xyXG4gICAgdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlLnN0b3AoKTtcclxuICB9XHJcblxyXG4gIHNldFF1YW50aXR5SXRlbU5hbWVGb3JEZWxldGUocXVhbnRpdHlJbmRleDogbnVtYmVyKSB7XHJcbiAgICAgdGhpcy5xdWFudGl0eUluZGV4PSBxdWFudGl0eUluZGV4O1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlUXVhbnRpdHlJdGVtKHF1YW50aXR5SW5kZXg6IG51bWJlcikge1xyXG5cclxuICAgICB0aGlzLnF1YW50aXR5SW5kZXg9IHF1YW50aXR5SW5kZXg7XHJcbiAgICAgdGhpcy5xdWFudGl0eUl0ZW1zLnNwbGljZSh0aGlzLnF1YW50aXR5SW5kZXgsMSk7XHJcbiAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSgpO1xyXG4gICAgIG1lc3NhZ2UuaXNFcnJvciA9IGZhbHNlO1xyXG4gICAgIG1lc3NhZ2UuY3VzdG9tX21lc3NhZ2UgPSBNZXNzYWdlcy5NU0dfU1VDQ0VTU19ERUxFVEVfUVVBTlRJVFlfSVRFTTtcclxuICAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLm1lc3NhZ2UobWVzc2FnZSk7XHJcbiAgICAgdGhpcy51cGRhdGVBbGxRdWFudGl0eSgpO1xyXG4gICAgICB9XHJcblxyXG4gIGNsb3NlUXVhbnRpdHlUYWIoKSB7XHJcbiAgICB0aGlzLmNsb3NlUXVhbnRpdHlWaWV3LmVtaXQoJycpO1xyXG4gIH1cclxuXHJcbiAgZ2V0QnV0dG9uKCkge1xyXG4gICAgcmV0dXJuIEJ1dHRvbjtcclxuICB9XHJcblxyXG4gIGdldFRhYmxlSGVhZGluZ3MoKSB7XHJcbiAgICByZXR1cm4gVGFibGVIZWFkaW5ncztcclxuICB9XHJcblxyXG4gIGdldExhYmVsKCkge1xyXG4gICAgcmV0dXJuIExhYmVsO1xyXG4gIH1cclxuXHJcbiAgZ2V0SGVhZGluZ3MoKSB7XHJcbiAgICByZXR1cm4gSGVhZGluZ3M7XHJcbiAgfVxyXG59XHJcbiJdfQ==
