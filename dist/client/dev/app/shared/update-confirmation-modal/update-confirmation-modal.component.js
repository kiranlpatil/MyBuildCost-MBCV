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
var UpdateConfirmationModalComponent = (function () {
    function UpdateConfirmationModalComponent() {
        this.updateElementEvent = new core_1.EventEmitter();
    }
    UpdateConfirmationModalComponent.prototype.updateElement = function () {
        this.updateElementEvent.emit(this.elementType);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], UpdateConfirmationModalComponent.prototype, "elementType", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], UpdateConfirmationModalComponent.prototype, "updateElementEvent", void 0);
    UpdateConfirmationModalComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-update-confirmation-modal',
            templateUrl: 'update-confirmation-modal.component.html',
            styleUrls: ['update-confirmation-modal.component.css']
        }),
        __metadata("design:paramtypes", [])
    ], UpdateConfirmationModalComponent);
    return UpdateConfirmationModalComponent;
}());
exports.UpdateConfirmationModalComponent = UpdateConfirmationModalComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvdXBkYXRlLWNvbmZpcm1hdGlvbi1tb2RhbC91cGRhdGUtY29uZmlybWF0aW9uLW1vZGFsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUF1RTtBQVN2RTtJQUtFO1FBRlUsdUJBQWtCLEdBQUcsSUFBSSxtQkFBWSxFQUFVLENBQUM7SUFJMUQsQ0FBQztJQUVELHdEQUFhLEdBQWI7UUFDRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBVFE7UUFBUixZQUFLLEVBQUU7O3lFQUFxQjtJQUNuQjtRQUFULGFBQU0sRUFBRTs7Z0ZBQWlEO0lBSC9DLGdDQUFnQztRQVA1QyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSw4QkFBOEI7WUFDeEMsV0FBVyxFQUFFLDBDQUEwQztZQUN2RCxTQUFTLEVBQUUsQ0FBQyx5Q0FBeUMsQ0FBQztTQUN2RCxDQUFDOztPQUVXLGdDQUFnQyxDQVk1QztJQUFELHVDQUFDO0NBWkQsQUFZQyxJQUFBO0FBWlksNEVBQWdDIiwiZmlsZSI6ImFwcC9zaGFyZWQvdXBkYXRlLWNvbmZpcm1hdGlvbi1tb2RhbC91cGRhdGUtY29uZmlybWF0aW9uLW1vZGFsLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAnYmktdXBkYXRlLWNvbmZpcm1hdGlvbi1tb2RhbCcsXHJcbiAgdGVtcGxhdGVVcmw6ICd1cGRhdGUtY29uZmlybWF0aW9uLW1vZGFsLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsndXBkYXRlLWNvbmZpcm1hdGlvbi1tb2RhbC5jb21wb25lbnQuY3NzJ11cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBVcGRhdGVDb25maXJtYXRpb25Nb2RhbENvbXBvbmVudCB7XHJcblxyXG4gIEBJbnB1dCgpIGVsZW1lbnRUeXBlOiBzdHJpbmc7XHJcbiAgQE91dHB1dCgpIHVwZGF0ZUVsZW1lbnRFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgfVxyXG5cclxuICB1cGRhdGVFbGVtZW50KCkge1xyXG4gICAgdGhpcy51cGRhdGVFbGVtZW50RXZlbnQuZW1pdCh0aGlzLmVsZW1lbnRUeXBlKTtcclxuICB9XHJcbn1cclxuIl19
