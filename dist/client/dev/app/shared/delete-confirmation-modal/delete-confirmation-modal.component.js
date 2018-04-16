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
var DeleteConfirmationModalComponent = (function () {
    function DeleteConfirmationModalComponent() {
        this.deleteElementEvent = new core_1.EventEmitter();
    }
    DeleteConfirmationModalComponent.prototype.deleteElement = function () {
        this.deleteElementEvent.emit(this.elementType);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DeleteConfirmationModalComponent.prototype, "elementType", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], DeleteConfirmationModalComponent.prototype, "deleteElementEvent", void 0);
    DeleteConfirmationModalComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-delete-confirmation-modal',
            templateUrl: 'delete-confirmation-modal.component.html',
            styleUrls: ['delete-confirmation-modal.component.css']
        }),
        __metadata("design:paramtypes", [])
    ], DeleteConfirmationModalComponent);
    return DeleteConfirmationModalComponent;
}());
exports.DeleteConfirmationModalComponent = DeleteConfirmationModalComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvZGVsZXRlLWNvbmZpcm1hdGlvbi1tb2RhbC9kZWxldGUtY29uZmlybWF0aW9uLW1vZGFsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUF1RTtBQVN2RTtJQU1FO1FBSFUsdUJBQWtCLEdBQUcsSUFBSSxtQkFBWSxFQUFVLENBQUM7SUFJMUQsQ0FBQztJQUVELHdEQUFhLEdBQWI7UUFDRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBVFE7UUFBUixZQUFLLEVBQUU7O3lFQUFxQjtJQUNuQjtRQUFULGFBQU0sRUFBRTs7Z0ZBQWlEO0lBSC9DLGdDQUFnQztRQVA1QyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSw4QkFBOEI7WUFDeEMsV0FBVyxFQUFFLDBDQUEwQztZQUN2RCxTQUFTLEVBQUUsQ0FBQyx5Q0FBeUMsQ0FBQztTQUN2RCxDQUFDOztPQUVXLGdDQUFnQyxDQWE1QztJQUFELHVDQUFDO0NBYkQsQUFhQyxJQUFBO0FBYlksNEVBQWdDIiwiZmlsZSI6ImFwcC9zaGFyZWQvZGVsZXRlLWNvbmZpcm1hdGlvbi1tb2RhbC9kZWxldGUtY29uZmlybWF0aW9uLW1vZGFsLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAnYmktZGVsZXRlLWNvbmZpcm1hdGlvbi1tb2RhbCcsXHJcbiAgdGVtcGxhdGVVcmw6ICdkZWxldGUtY29uZmlybWF0aW9uLW1vZGFsLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnZGVsZXRlLWNvbmZpcm1hdGlvbi1tb2RhbC5jb21wb25lbnQuY3NzJ11cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBEZWxldGVDb25maXJtYXRpb25Nb2RhbENvbXBvbmVudCB7XHJcblxyXG4gIEBJbnB1dCgpIGVsZW1lbnRUeXBlOiBzdHJpbmc7XHJcbiAgQE91dHB1dCgpIGRlbGV0ZUVsZW1lbnRFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgfVxyXG5cclxuICBkZWxldGVFbGVtZW50KCkge1xyXG4gICAgdGhpcy5kZWxldGVFbGVtZW50RXZlbnQuZW1pdCh0aGlzLmVsZW1lbnRUeXBlKTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==
