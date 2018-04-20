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
var TableRowComponent = (function () {
    function TableRowComponent() {
    }
    TableRowComponent.prototype.getMaterialTakeOffElements = function () {
        return constants_1.MaterialTakeOffElements;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], TableRowComponent.prototype, "rows", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], TableRowComponent.prototype, "customClass", void 0);
    TableRowComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-table-row',
            templateUrl: 'row.component.html',
            styleUrls: ['row.component.css'],
        })
    ], TableRowComponent);
    return TableRowComponent;
}());
exports.TableRowComponent = TableRowComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L21hdGVyaWFsLXRha2VvZmYvbWF0ZXJpYWwtdGFrZS1vZmYtcmVwb3J0L3Jvdy9yb3cuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQWlEO0FBQ2pELGdFQUE2RTtBQVM3RTtJQUFBO0lBUUEsQ0FBQztJQUhDLHNEQUEwQixHQUExQjtRQUNFLE1BQU0sQ0FBQyxtQ0FBdUIsQ0FBQztJQUNqQyxDQUFDO0lBTFE7UUFBUixZQUFLLEVBQUU7O21EQUFXO0lBQ1Y7UUFBUixZQUFLLEVBQUU7OzBEQUFxQjtJQUhsQixpQkFBaUI7UUFQN0IsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsY0FBYztZQUN4QixXQUFXLEVBQUUsb0JBQW9CO1lBQ2pDLFNBQVMsRUFBRSxDQUFDLG1CQUFtQixDQUFDO1NBQ2pDLENBQUM7T0FFVyxpQkFBaUIsQ0FRN0I7SUFBRCx3QkFBQztDQVJELEFBUUMsSUFBQTtBQVJZLDhDQUFpQiIsImZpbGUiOiJhcHAvYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9tYXRlcmlhbC10YWtlb2ZmL21hdGVyaWFsLXRha2Utb2ZmLXJlcG9ydC9yb3cvcm93LmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTWF0ZXJpYWxUYWtlT2ZmRWxlbWVudHMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi9zaGFyZWQvY29uc3RhbnRzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICdiaS10YWJsZS1yb3cnLFxyXG4gIHRlbXBsYXRlVXJsOiAncm93LmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsncm93LmNvbXBvbmVudC5jc3MnXSxcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWJsZVJvd0NvbXBvbmVudCB7XHJcblxyXG4gIEBJbnB1dCgpIHJvd3M6IGFueTtcclxuICBASW5wdXQoKSBjdXN0b21DbGFzczogc3RyaW5nO1xyXG5cclxuICBnZXRNYXRlcmlhbFRha2VPZmZFbGVtZW50cygpIHtcclxuICAgIHJldHVybiBNYXRlcmlhbFRha2VPZmZFbGVtZW50cztcclxuICB9XHJcbn1cclxuIl19
