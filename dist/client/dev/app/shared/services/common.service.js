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
                    categoryTotalAmount = parseFloat((categoryTotalAmount + workItemData.amount).toFixed(constants_1.ValueConstant.NUMBER_OF_FRACTION_DIGIT));
                }
                categoryData.amount = categoryTotalAmount;
            }
            categoryDetailsTotalAmount = Math.round(categoryDetailsTotalAmount + categoryData.amount);
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
        return Math.round(totalQuantity * totalRate);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvc2VydmljZXMvY29tbW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxzQ0FBMkM7QUFHM0MsMENBQTZDO0FBSTdDO0lBQUE7SUEyREEsQ0FBQztJQXpEQyw4QkFBTSxHQUFOO1FBQ0UsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRUQsNENBQW9CLEdBQXBCLFVBQXFCLFFBQXFCLEVBQUUsZ0JBQTRCO1FBQ3RFLEVBQUUsQ0FBQSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLEdBQUcsQ0FBQSxDQUFDLElBQUksWUFBWSxHQUFDLENBQUMsRUFBRSxZQUFZLEdBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxFQUFFLENBQUM7Z0JBQzdFLEdBQUcsQ0FBQSxDQUFDLElBQUksU0FBUyxHQUFDLENBQUMsRUFBRSxTQUFTLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDO29CQUM5RCxFQUFFLENBQUEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsY0FBYyxLQUFLLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7d0JBQ3hGLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMvQixDQUFDO2dCQUNILENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztRQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVELG9EQUE0QixHQUE1QixVQUE2QixlQUFpQyxFQUFFLHNCQUE4QixFQUFFLGFBQStCO1FBQzdILElBQUksMEJBQTBCLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLEdBQUcsQ0FBQSxDQUFxQixVQUFlLEVBQWYsbUNBQWUsRUFBZiw2QkFBZSxFQUFmLElBQWU7WUFBbkMsSUFBSSxZQUFZLHdCQUFBO1lBQ2xCLEVBQUUsQ0FBQSxDQUFDLFlBQVksQ0FBQyxjQUFjLEtBQUssc0JBQXNCLENBQUMsQ0FBQyxDQUFDO2dCQUMxRCxJQUFJLG1CQUFtQixHQUFHLENBQUMsQ0FBQztnQkFDNUIsR0FBRyxDQUFBLENBQXFCLFVBQWEsRUFBYiwrQkFBYSxFQUFiLDJCQUFhLEVBQWIsSUFBYTtvQkFBakMsSUFBSSxZQUFZLHNCQUFBO29CQUNsQixtQkFBbUIsR0FBRyxVQUFVLENBQUMsQ0FBQyxtQkFBbUIsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUMxRSxDQUFDLE9BQU8sQ0FBQyx5QkFBYSxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQztpQkFDcEQ7Z0JBQ0QsWUFBWSxDQUFDLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQztZQUM1QyxDQUFDO1lBQ0QsMEJBQTBCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQywwQkFBMEIsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDM0Y7UUFDRCxNQUFNLENBQUMsMEJBQTBCLENBQUM7SUFDcEMsQ0FBQztJQUVELDJEQUFtQyxHQUFuQyxVQUFvQyxZQUF1QjtRQUN6RCxJQUFJLHdCQUF3QixHQUFHLENBQUMsQ0FBQztRQUNqQyxHQUFHLENBQUEsQ0FBMkIsVUFBeUMsRUFBekMsS0FBQSxZQUFZLENBQUMsUUFBUSxDQUFDLG1CQUFtQixFQUF6QyxjQUF5QyxFQUF6QyxJQUF5QztZQUFuRSxJQUFJLGtCQUFrQixTQUFBO1lBQ3hCLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3ZELHdCQUF3QixHQUFHLHdCQUF3QixHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQztTQUNoRjtRQUNELFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLHdCQUF3QixDQUFDO0lBQ3pELENBQUM7SUFFRCxxREFBNkIsR0FBN0IsVUFBOEIsa0JBQW9DO1FBQ2hFLElBQUksaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLEdBQUcsQ0FBQSxDQUF5QixVQUFnQyxFQUFoQyxLQUFBLGtCQUFrQixDQUFDLGFBQWEsRUFBaEMsY0FBZ0MsRUFBaEMsSUFBZ0M7WUFBeEQsSUFBSSxnQkFBZ0IsU0FBQTtZQUN0QixpQkFBaUIsR0FBRyxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7U0FDbkU7UUFDRCxrQkFBa0IsQ0FBQyxLQUFLLEdBQUcsaUJBQWlCLENBQUM7SUFDL0MsQ0FBQztJQUVELGlEQUF5QixHQUF6QixVQUEwQixhQUFzQixFQUFFLFNBQWtCO1FBQ2xFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQseUNBQWlCLEdBQWpCLFVBQWtCLEtBQWM7UUFDOUIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyx5QkFBYSxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBMURVLGFBQWE7UUFEekIsaUJBQVUsRUFBRTtPQUNBLGFBQWEsQ0EyRHpCO0lBQUQsb0JBQUM7Q0EzREQsQUEyREMsSUFBQTtBQTNEWSxzQ0FBYSIsImZpbGUiOiJhcHAvc2hhcmVkL3NlcnZpY2VzL2NvbW1vbi5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDYXRlZ29yeSB9IGZyb20gJy4uLy4uLy4uL2FwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9tb2RlbC9jYXRlZ29yeSc7XHJcbmltcG9ydCB7IFdvcmtJdGVtIH0gZnJvbSAnLi4vLi4vLi4vYXBwL2J1aWxkLWluZm8vZnJhbWV3b3JrL21vZGVsL3dvcmstaXRlbSc7XHJcbmltcG9ydCB7IFZhbHVlQ29uc3RhbnQgfSBmcm9tICcuLi9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBRdWFudGl0eURldGFpbHMgfSBmcm9tICcuLi8uLi9idWlsZC1pbmZvL2ZyYW1ld29yay9tb2RlbC9xdWFudGl0eS1kZXRhaWxzJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIENvbW1vblNlcnZpY2Uge1xyXG5cclxuICBnb0JhY2soKSB7XHJcbiAgICB3aW5kb3cuaGlzdG9yeS5nbygtMSk7XHJcbiAgfVxyXG5cclxuICByZW1vdmVEdXBsaWNhdGVJdG1lcyhpdGVtTGlzdCA6IEFycmF5PGFueT4sIHNlbGVjdGVkSXRlbUxpc3Q6IEFycmF5PGFueT4pOmFueSB7XHJcbiAgICBpZihzZWxlY3RlZEl0ZW1MaXN0Lmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICBmb3IobGV0IHNlbGVjdGVkSXRlbT0wOyBzZWxlY3RlZEl0ZW08c2VsZWN0ZWRJdGVtTGlzdC5sZW5ndGg7IHNlbGVjdGVkSXRlbSsrKSB7XHJcbiAgICAgICAgZm9yKGxldCBpdGVtSW5kZXg9MDsgaXRlbUluZGV4IDwgaXRlbUxpc3QubGVuZ3RoOyBpdGVtSW5kZXgrKykge1xyXG4gICAgICAgICAgaWYoaXRlbUxpc3RbaXRlbUluZGV4XS5yYXRlQW5hbHlzaXNJZCA9PT0gc2VsZWN0ZWRJdGVtTGlzdFtzZWxlY3RlZEl0ZW1dLnJhdGVBbmFseXNpc0lkKSB7XHJcbiAgICAgICAgICAgIGl0ZW1MaXN0LnNwbGljZShpdGVtSW5kZXgsMSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaXRlbUxpc3Q7XHJcbiAgfVxyXG5cclxuICB0b3RhbENhbGN1bGF0aW9uT2ZDYXRlZ29yaWVzKGNhdGVnb3J5RGV0YWlscyA6IEFycmF5PENhdGVnb3J5PiwgY2F0ZWdvcnlSYXRlQW5hbHlzaXNJZCA6bnVtYmVyLCB3b3JrSXRlbXNMaXN0IDogQXJyYXk8V29ya0l0ZW0+KSB7XHJcbiAgICBsZXQgY2F0ZWdvcnlEZXRhaWxzVG90YWxBbW91bnQgPSAwO1xyXG4gICAgZm9yKGxldCBjYXRlZ29yeURhdGEgb2YgY2F0ZWdvcnlEZXRhaWxzKSB7XHJcbiAgICAgIGlmKGNhdGVnb3J5RGF0YS5yYXRlQW5hbHlzaXNJZCA9PT0gY2F0ZWdvcnlSYXRlQW5hbHlzaXNJZCkge1xyXG4gICAgICAgIGxldCBjYXRlZ29yeVRvdGFsQW1vdW50ID0gMDtcclxuICAgICAgICBmb3IobGV0IHdvcmtJdGVtRGF0YSBvZiB3b3JrSXRlbXNMaXN0KSB7XHJcbiAgICAgICAgICBjYXRlZ29yeVRvdGFsQW1vdW50ID0gcGFyc2VGbG9hdCgoY2F0ZWdvcnlUb3RhbEFtb3VudCArIHdvcmtJdGVtRGF0YS5hbW91bnRcclxuICAgICAgICAgICkudG9GaXhlZChWYWx1ZUNvbnN0YW50Lk5VTUJFUl9PRl9GUkFDVElPTl9ESUdJVCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRlZ29yeURhdGEuYW1vdW50ID0gY2F0ZWdvcnlUb3RhbEFtb3VudDtcclxuICAgICAgfVxyXG4gICAgICBjYXRlZ29yeURldGFpbHNUb3RhbEFtb3VudCA9IE1hdGgucm91bmQoY2F0ZWdvcnlEZXRhaWxzVG90YWxBbW91bnQgKyBjYXRlZ29yeURhdGEuYW1vdW50KTtcclxuICAgIH1cclxuICAgIHJldHVybiBjYXRlZ29yeURldGFpbHNUb3RhbEFtb3VudDtcclxuICB9XHJcblxyXG4gIGNhbGN1bGF0ZVRvdGFsT2ZRdWFudGl0eUl0ZW1EZXRhaWxzKHdvcmtJdGVtRGF0YSA6IFdvcmtJdGVtKSB7XHJcbiAgICBsZXQgcXVhbnRpdHlJdGVtRGV0YWlsc1RvdGFsID0gMDtcclxuICAgIGZvcihsZXQgcXVhbnRpdHlJdGVtRGV0YWlsIG9mIHdvcmtJdGVtRGF0YS5xdWFudGl0eS5xdWFudGl0eUl0ZW1EZXRhaWxzKSB7XHJcbiAgICAgIHRoaXMuY2FsY3VsYXRlVG90YWxPZlF1YW50aXR5SXRlbXMocXVhbnRpdHlJdGVtRGV0YWlsKTtcclxuICAgICAgcXVhbnRpdHlJdGVtRGV0YWlsc1RvdGFsID0gcXVhbnRpdHlJdGVtRGV0YWlsc1RvdGFsICsgcXVhbnRpdHlJdGVtRGV0YWlsLnRvdGFsO1xyXG4gICAgfVxyXG4gICAgd29ya0l0ZW1EYXRhLnF1YW50aXR5LnRvdGFsID0gcXVhbnRpdHlJdGVtRGV0YWlsc1RvdGFsO1xyXG4gIH1cclxuXHJcbiAgY2FsY3VsYXRlVG90YWxPZlF1YW50aXR5SXRlbXMocXVhbnRpdHlJdGVtRGV0YWlsIDogUXVhbnRpdHlEZXRhaWxzKSB7XHJcbiAgICBsZXQgcXVhbnRpdHlJdGVtVG90YWwgPSAwO1xyXG4gICAgZm9yKGxldCBxdWFudGl0eUl0ZW1EYXRhIG9mIHF1YW50aXR5SXRlbURldGFpbC5xdWFudGl0eUl0ZW1zKSB7XHJcbiAgICAgIHF1YW50aXR5SXRlbVRvdGFsID0gcXVhbnRpdHlJdGVtVG90YWwgKyBxdWFudGl0eUl0ZW1EYXRhLnF1YW50aXR5O1xyXG4gICAgfVxyXG4gICAgcXVhbnRpdHlJdGVtRGV0YWlsLnRvdGFsID0gcXVhbnRpdHlJdGVtVG90YWw7XHJcbiAgfVxyXG5cclxuICBjYWxjdWxhdGVBbW91bnRPZldvcmtJdGVtKHRvdGFsUXVhbnRpdHkgOiBudW1iZXIsIHRvdGFsUmF0ZSA6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIE1hdGgucm91bmQodG90YWxRdWFudGl0eSAqIHRvdGFsUmF0ZSk7XHJcbiAgfVxyXG5cclxuICBkZWNpbWFsQ29udmVyc2lvbih2YWx1ZSA6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIHBhcnNlRmxvYXQoKHZhbHVlKS50b0ZpeGVkKFZhbHVlQ29uc3RhbnQuTlVNQkVSX09GX0ZSQUNUSU9OX0RJR0lUKSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==
