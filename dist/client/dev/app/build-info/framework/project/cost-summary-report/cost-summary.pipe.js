"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var constants_1 = require("../../../../shared/constants");
var CostSummaryPipe = (function () {
    function CostSummaryPipe() {
    }
    CostSummaryPipe.prototype.transform = function (value, sort, args) {
        if (args === void 0) { args = null; }
        if (value !== undefined) {
            if (sort === constants_1.MaterialTakeOffElements.SORT) {
                return Object.keys(value).sort(function (a, b) {
                    return a.toLowerCase().localeCompare(b.toLowerCase());
                });
            }
            else {
                return Object.keys(value);
            }
        }
    };
    CostSummaryPipe = __decorate([
        core_1.Pipe({ name: 'keys', pure: false })
    ], CostSummaryPipe);
    return CostSummaryPipe;
}());
exports.CostSummaryPipe = CostSummaryPipe;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1zdW1tYXJ5LnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxzQ0FBb0Q7QUFDcEQsMERBQXVFO0FBR3ZFO0lBQUE7SUFZQSxDQUFDO0lBWEMsbUNBQVMsR0FBVCxVQUFVLEtBQVUsRUFBRSxJQUFhLEVBQUMsSUFBa0I7UUFBbEIscUJBQUEsRUFBQSxXQUFrQjtRQUNwRCxFQUFFLENBQUEsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN2QixFQUFFLENBQUEsQ0FBQyxJQUFJLEtBQUssbUNBQXVCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDekMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7b0JBQzNDLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO2dCQUN4RCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1QixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFYVSxlQUFlO1FBRjNCLFdBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDO09BRXJCLGVBQWUsQ0FZM0I7SUFBRCxzQkFBQztDQVpELEFBWUMsSUFBQTtBQVpZLDBDQUFlIiwiZmlsZSI6ImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1zdW1tYXJ5LnBpcGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE1hdGVyaWFsVGFrZU9mZkVsZW1lbnRzIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2hhcmVkL2NvbnN0YW50cyc7XHJcbkBQaXBlKHtuYW1lOiAna2V5cycsIHB1cmU6IGZhbHNlfSlcclxuXHJcbmV4cG9ydCBjbGFzcyBDb3N0U3VtbWFyeVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcclxuICB0cmFuc2Zvcm0odmFsdWU6IGFueSwgc29ydCA6IHN0cmluZyxhcmdzOiBhbnlbXSA9IG51bGwpOiBhbnkge1xyXG4gICAgaWYodmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBpZihzb3J0ID09PSBNYXRlcmlhbFRha2VPZmZFbGVtZW50cy5TT1JUKSB7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHZhbHVlKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICByZXR1cm4gYS50b0xvd2VyQ2FzZSgpLmxvY2FsZUNvbXBhcmUoYi50b0xvd2VyQ2FzZSgpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModmFsdWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==
