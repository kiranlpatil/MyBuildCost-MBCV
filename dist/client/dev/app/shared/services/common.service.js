"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var constants_1 = require("../constants");
var CommonService = (function () {
    function CommonService() {
    }
    CommonService.prototype.goBack = function () {
        window.history.go(-1);
    };
    CommonService.prototype.removeDuplicateItmes = function (itemList, selectedItemList) {
        if (selectedItemList.length !== 0) {
            for (var selectedItem = 0; selectedItem < selectedItemList.length; selectedItem++) {
                for (var itemIndex = 0; itemIndex < itemList.length; itemIndex++) {
                    if (itemList[itemIndex].rateAnalysisId === selectedItemList[selectedItem].rateAnalysisId) {
                        itemList.splice(itemIndex, 1);
                    }
                }
            }
        }
        return itemList;
    };
    CommonService.prototype.totalCalculationOfCategories = function (categoryDetails, categoryRateAnalysisId, workItemsList) {
        var categoryDetailsTotalAmount = 0;
        for (var _i = 0, categoryDetails_1 = categoryDetails; _i < categoryDetails_1.length; _i++) {
            var categoryData = categoryDetails_1[_i];
            if (categoryData.rateAnalysisId === categoryRateAnalysisId) {
                var categoryTotalAmount = 0;
                for (var _a = 0, workItemsList_1 = workItemsList; _a < workItemsList_1.length; _a++) {
                    var workItemData = workItemsList_1[_a];
                    categoryTotalAmount = categoryTotalAmount + workItemData.amount;
                }
                categoryData.amount = categoryTotalAmount;
            }
            categoryDetailsTotalAmount = categoryDetailsTotalAmount + categoryData.amount;
        }
        return categoryDetailsTotalAmount;
    };
    CommonService.prototype.calculateTotalOfQuantityItemDetails = function (workItemData) {
        var quantityItemDetailsTotal = 0;
        for (var _i = 0, _a = workItemData.quantity.quantityItemDetails; _i < _a.length; _i++) {
            var quantityItemDetail = _a[_i];
            this.calculateTotalOfQuantityItems(quantityItemDetail);
            quantityItemDetailsTotal = quantityItemDetailsTotal + quantityItemDetail.total;
        }
        workItemData.quantity.total = quantityItemDetailsTotal;
    };
    CommonService.prototype.calculateTotalOfQuantityItems = function (quantityItemDetail) {
        var quantityItemTotal = 0;
        for (var _i = 0, _a = quantityItemDetail.quantityItems; _i < _a.length; _i++) {
            var quantityItemData = _a[_i];
            quantityItemTotal = quantityItemTotal + quantityItemData.quantity;
        }
        quantityItemDetail.total = quantityItemTotal;
    };
    CommonService.prototype.calculateAmountOfWorkItem = function (totalQuantity, totalRate) {
        return (totalQuantity * totalRate);
    };
    CommonService.prototype.decimalConversion = function (value) {
        return parseFloat((value).toFixed(constants_1.ValueConstant.NUMBER_OF_FRACTION_DIGIT));
    };
    CommonService = __decorate([
        core_1.Injectable()
    ], CommonService);
    return CommonService;
}());
exports.CommonService = CommonService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvc2VydmljZXMvY29tbW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxzQ0FBMkM7QUFHM0MsMENBQTZDO0FBSTdDO0lBQUE7SUEwREEsQ0FBQztJQXhEQyw4QkFBTSxHQUFOO1FBQ0UsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRUQsNENBQW9CLEdBQXBCLFVBQXFCLFFBQXFCLEVBQUUsZ0JBQTRCO1FBQ3RFLEVBQUUsQ0FBQSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLEdBQUcsQ0FBQSxDQUFDLElBQUksWUFBWSxHQUFDLENBQUMsRUFBRSxZQUFZLEdBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxFQUFFLENBQUM7Z0JBQzdFLEdBQUcsQ0FBQSxDQUFDLElBQUksU0FBUyxHQUFDLENBQUMsRUFBRSxTQUFTLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDO29CQUM5RCxFQUFFLENBQUEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsY0FBYyxLQUFLLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7d0JBQ3hGLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMvQixDQUFDO2dCQUNILENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztRQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVELG9EQUE0QixHQUE1QixVQUE2QixlQUFpQyxFQUFFLHNCQUE4QixFQUFFLGFBQStCO1FBQzdILElBQUksMEJBQTBCLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLEdBQUcsQ0FBQSxDQUFxQixVQUFlLEVBQWYsbUNBQWUsRUFBZiw2QkFBZSxFQUFmLElBQWU7WUFBbkMsSUFBSSxZQUFZLHdCQUFBO1lBQ2xCLEVBQUUsQ0FBQSxDQUFDLFlBQVksQ0FBQyxjQUFjLEtBQUssc0JBQXNCLENBQUMsQ0FBQyxDQUFDO2dCQUMxRCxJQUFJLG1CQUFtQixHQUFHLENBQUMsQ0FBQztnQkFDNUIsR0FBRyxDQUFBLENBQXFCLFVBQWEsRUFBYiwrQkFBYSxFQUFiLDJCQUFhLEVBQWIsSUFBYTtvQkFBakMsSUFBSSxZQUFZLHNCQUFBO29CQUNsQixtQkFBbUIsR0FBRSxtQkFBbUIsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO2lCQUNoRTtnQkFDRCxZQUFZLENBQUMsTUFBTSxHQUFHLG1CQUFtQixDQUFDO1lBQzVDLENBQUM7WUFDRCwwQkFBMEIsR0FBRywwQkFBMEIsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO1NBQy9FO1FBQ0QsTUFBTSxDQUFDLDBCQUEwQixDQUFDO0lBQ3BDLENBQUM7SUFFRCwyREFBbUMsR0FBbkMsVUFBb0MsWUFBdUI7UUFDekQsSUFBSSx3QkFBd0IsR0FBRyxDQUFDLENBQUM7UUFDakMsR0FBRyxDQUFBLENBQTJCLFVBQXlDLEVBQXpDLEtBQUEsWUFBWSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBekMsY0FBeUMsRUFBekMsSUFBeUM7WUFBbkUsSUFBSSxrQkFBa0IsU0FBQTtZQUN4QixJQUFJLENBQUMsNkJBQTZCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUN2RCx3QkFBd0IsR0FBRyx3QkFBd0IsR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQUM7U0FDaEY7UUFDRCxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyx3QkFBd0IsQ0FBQztJQUN6RCxDQUFDO0lBRUQscURBQTZCLEdBQTdCLFVBQThCLGtCQUFvQztRQUNoRSxJQUFJLGlCQUFpQixHQUFHLENBQUMsQ0FBQztRQUMxQixHQUFHLENBQUEsQ0FBeUIsVUFBZ0MsRUFBaEMsS0FBQSxrQkFBa0IsQ0FBQyxhQUFhLEVBQWhDLGNBQWdDLEVBQWhDLElBQWdDO1lBQXhELElBQUksZ0JBQWdCLFNBQUE7WUFDdEIsaUJBQWlCLEdBQUcsaUJBQWlCLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDO1NBQ25FO1FBQ0Qsa0JBQWtCLENBQUMsS0FBSyxHQUFHLGlCQUFpQixDQUFDO0lBQy9DLENBQUM7SUFFRCxpREFBeUIsR0FBekIsVUFBMEIsYUFBc0IsRUFBRSxTQUFrQjtRQUNsRSxNQUFNLENBQUMsQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELHlDQUFpQixHQUFqQixVQUFrQixLQUFjO1FBQzlCLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMseUJBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQXpEVSxhQUFhO1FBRHpCLGlCQUFVLEVBQUU7T0FDQSxhQUFhLENBMER6QjtJQUFELG9CQUFDO0NBMURELEFBMERDLElBQUE7QUExRFksc0NBQWEiLCJmaWxlIjoiYXBwL3NoYXJlZC9zZXJ2aWNlcy9jb21tb24uc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ2F0ZWdvcnkgfSBmcm9tICcuLi8uLi8uLi9hcHAvYnVpbGQtaW5mby9mcmFtZXdvcmsvbW9kZWwvY2F0ZWdvcnknO1xyXG5pbXBvcnQgeyBXb3JrSXRlbSB9IGZyb20gJy4uLy4uLy4uL2FwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9tb2RlbC93b3JrLWl0ZW0nO1xyXG5pbXBvcnQgeyBWYWx1ZUNvbnN0YW50IH0gZnJvbSAnLi4vY29uc3RhbnRzJztcclxuaW1wb3J0IHsgUXVhbnRpdHlEZXRhaWxzIH0gZnJvbSAnLi4vLi4vYnVpbGQtaW5mby9mcmFtZXdvcmsvbW9kZWwvcXVhbnRpdHktZGV0YWlscyc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBDb21tb25TZXJ2aWNlIHtcclxuXHJcbiAgZ29CYWNrKCkge1xyXG4gICAgd2luZG93Lmhpc3RvcnkuZ28oLTEpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlRHVwbGljYXRlSXRtZXMoaXRlbUxpc3QgOiBBcnJheTxhbnk+LCBzZWxlY3RlZEl0ZW1MaXN0OiBBcnJheTxhbnk+KTphbnkge1xyXG4gICAgaWYoc2VsZWN0ZWRJdGVtTGlzdC5sZW5ndGggIT09IDApIHtcclxuICAgICAgZm9yKGxldCBzZWxlY3RlZEl0ZW09MDsgc2VsZWN0ZWRJdGVtPHNlbGVjdGVkSXRlbUxpc3QubGVuZ3RoOyBzZWxlY3RlZEl0ZW0rKykge1xyXG4gICAgICAgIGZvcihsZXQgaXRlbUluZGV4PTA7IGl0ZW1JbmRleCA8IGl0ZW1MaXN0Lmxlbmd0aDsgaXRlbUluZGV4KyspIHtcclxuICAgICAgICAgIGlmKGl0ZW1MaXN0W2l0ZW1JbmRleF0ucmF0ZUFuYWx5c2lzSWQgPT09IHNlbGVjdGVkSXRlbUxpc3Rbc2VsZWN0ZWRJdGVtXS5yYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgICAgICBpdGVtTGlzdC5zcGxpY2UoaXRlbUluZGV4LDEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGl0ZW1MaXN0O1xyXG4gIH1cclxuXHJcbiAgdG90YWxDYWxjdWxhdGlvbk9mQ2F0ZWdvcmllcyhjYXRlZ29yeURldGFpbHMgOiBBcnJheTxDYXRlZ29yeT4sIGNhdGVnb3J5UmF0ZUFuYWx5c2lzSWQgOm51bWJlciwgd29ya0l0ZW1zTGlzdCA6IEFycmF5PFdvcmtJdGVtPikge1xyXG4gICAgbGV0IGNhdGVnb3J5RGV0YWlsc1RvdGFsQW1vdW50ID0gMDtcclxuICAgIGZvcihsZXQgY2F0ZWdvcnlEYXRhIG9mIGNhdGVnb3J5RGV0YWlscykge1xyXG4gICAgICBpZihjYXRlZ29yeURhdGEucmF0ZUFuYWx5c2lzSWQgPT09IGNhdGVnb3J5UmF0ZUFuYWx5c2lzSWQpIHtcclxuICAgICAgICBsZXQgY2F0ZWdvcnlUb3RhbEFtb3VudCA9IDA7XHJcbiAgICAgICAgZm9yKGxldCB3b3JrSXRlbURhdGEgb2Ygd29ya0l0ZW1zTGlzdCkge1xyXG4gICAgICAgICAgY2F0ZWdvcnlUb3RhbEFtb3VudCA9Y2F0ZWdvcnlUb3RhbEFtb3VudCArIHdvcmtJdGVtRGF0YS5hbW91bnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGVnb3J5RGF0YS5hbW91bnQgPSBjYXRlZ29yeVRvdGFsQW1vdW50O1xyXG4gICAgICB9XHJcbiAgICAgIGNhdGVnb3J5RGV0YWlsc1RvdGFsQW1vdW50ID0gY2F0ZWdvcnlEZXRhaWxzVG90YWxBbW91bnQgKyBjYXRlZ29yeURhdGEuYW1vdW50O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNhdGVnb3J5RGV0YWlsc1RvdGFsQW1vdW50O1xyXG4gIH1cclxuXHJcbiAgY2FsY3VsYXRlVG90YWxPZlF1YW50aXR5SXRlbURldGFpbHMod29ya0l0ZW1EYXRhIDogV29ya0l0ZW0pIHtcclxuICAgIGxldCBxdWFudGl0eUl0ZW1EZXRhaWxzVG90YWwgPSAwO1xyXG4gICAgZm9yKGxldCBxdWFudGl0eUl0ZW1EZXRhaWwgb2Ygd29ya0l0ZW1EYXRhLnF1YW50aXR5LnF1YW50aXR5SXRlbURldGFpbHMpIHtcclxuICAgICAgdGhpcy5jYWxjdWxhdGVUb3RhbE9mUXVhbnRpdHlJdGVtcyhxdWFudGl0eUl0ZW1EZXRhaWwpO1xyXG4gICAgICBxdWFudGl0eUl0ZW1EZXRhaWxzVG90YWwgPSBxdWFudGl0eUl0ZW1EZXRhaWxzVG90YWwgKyBxdWFudGl0eUl0ZW1EZXRhaWwudG90YWw7XHJcbiAgICB9XHJcbiAgICB3b3JrSXRlbURhdGEucXVhbnRpdHkudG90YWwgPSBxdWFudGl0eUl0ZW1EZXRhaWxzVG90YWw7XHJcbiAgfVxyXG5cclxuICBjYWxjdWxhdGVUb3RhbE9mUXVhbnRpdHlJdGVtcyhxdWFudGl0eUl0ZW1EZXRhaWwgOiBRdWFudGl0eURldGFpbHMpIHtcclxuICAgIGxldCBxdWFudGl0eUl0ZW1Ub3RhbCA9IDA7XHJcbiAgICBmb3IobGV0IHF1YW50aXR5SXRlbURhdGEgb2YgcXVhbnRpdHlJdGVtRGV0YWlsLnF1YW50aXR5SXRlbXMpIHtcclxuICAgICAgcXVhbnRpdHlJdGVtVG90YWwgPSBxdWFudGl0eUl0ZW1Ub3RhbCArIHF1YW50aXR5SXRlbURhdGEucXVhbnRpdHk7XHJcbiAgICB9XHJcbiAgICBxdWFudGl0eUl0ZW1EZXRhaWwudG90YWwgPSBxdWFudGl0eUl0ZW1Ub3RhbDtcclxuICB9XHJcblxyXG4gIGNhbGN1bGF0ZUFtb3VudE9mV29ya0l0ZW0odG90YWxRdWFudGl0eSA6IG51bWJlciwgdG90YWxSYXRlIDogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gKHRvdGFsUXVhbnRpdHkgKiB0b3RhbFJhdGUpO1xyXG4gIH1cclxuXHJcbiAgZGVjaW1hbENvbnZlcnNpb24odmFsdWUgOiBudW1iZXIpIHtcclxuICAgIHJldHVybiBwYXJzZUZsb2F0KCh2YWx1ZSkudG9GaXhlZChWYWx1ZUNvbnN0YW50Lk5VTUJFUl9PRl9GUkFDVElPTl9ESUdJVCkpO1xyXG4gIH1cclxufVxyXG4iXX0=
