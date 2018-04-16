"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CostSummaryPipe = (function () {
    function CostSummaryPipe() {
    }
    CostSummaryPipe.prototype.transform = function (value, args) {
        if (args === void 0) { args = null; }
        if (value !== undefined) {
            return Object.keys(value);
        }
    };
    CostSummaryPipe = __decorate([
        core_1.Pipe({ name: 'keys', pure: false })
    ], CostSummaryPipe);
    return CostSummaryPipe;
}());
exports.CostSummaryPipe = CostSummaryPipe;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1zdW1tYXJ5LnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxzQ0FBb0Q7QUFHcEQ7SUFBQTtJQU1BLENBQUM7SUFMQyxtQ0FBUyxHQUFULFVBQVUsS0FBVSxFQUFFLElBQWtCO1FBQWxCLHFCQUFBLEVBQUEsV0FBa0I7UUFDdEMsRUFBRSxDQUFBLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsQ0FBQztJQUNILENBQUM7SUFMVSxlQUFlO1FBRjNCLFdBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDO09BRXJCLGVBQWUsQ0FNM0I7SUFBRCxzQkFBQztDQU5ELEFBTUMsSUFBQTtBQU5ZLDBDQUFlIiwiZmlsZSI6ImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L2Nvc3Qtc3VtbWFyeS1yZXBvcnQvY29zdC1zdW1tYXJ5LnBpcGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbkBQaXBlKHtuYW1lOiAna2V5cycsIHB1cmU6IGZhbHNlfSlcclxuXHJcbmV4cG9ydCBjbGFzcyBDb3N0U3VtbWFyeVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcclxuICB0cmFuc2Zvcm0odmFsdWU6IGFueSwgYXJnczogYW55W10gPSBudWxsKTogYW55IHtcclxuICAgIGlmKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHZhbHVlKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19
