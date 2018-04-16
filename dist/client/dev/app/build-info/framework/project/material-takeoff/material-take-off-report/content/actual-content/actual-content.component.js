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
var constants_1 = require("../../../../../../../shared/constants");
var ActualContentComponent = (function () {
    function ActualContentComponent() {
    }
    ActualContentComponent.prototype.getMaterialTakeOffElements = function () {
        return constants_1.MaterialTakeOffElements;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ActualContentComponent.prototype, "content", void 0);
    ActualContentComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-actual-content',
            templateUrl: 'actual-content.component.html'
        })
    ], ActualContentComponent);
    return ActualContentComponent;
}());
exports.ActualContentComponent = ActualContentComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L21hdGVyaWFsLXRha2VvZmYvbWF0ZXJpYWwtdGFrZS1vZmYtcmVwb3J0L2NvbnRlbnQvYWN0dWFsLWNvbnRlbnQvYWN0dWFsLWNvbnRlbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQWlEO0FBQ2pELG1FQUFnRjtBQVFoRjtJQUFBO0lBUUEsQ0FBQztJQUpDLDJEQUEwQixHQUExQjtRQUNFLE1BQU0sQ0FBQyxtQ0FBdUIsQ0FBQztJQUNqQyxDQUFDO0lBSlE7UUFBUixZQUFLLEVBQUU7OzJEQUFjO0lBRlgsc0JBQXNCO1FBTmxDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLG1CQUFtQjtZQUM3QixXQUFXLEVBQUUsK0JBQStCO1NBQzdDLENBQUM7T0FFVyxzQkFBc0IsQ0FRbEM7SUFBRCw2QkFBQztDQVJELEFBUUMsSUFBQTtBQVJZLHdEQUFzQiIsImZpbGUiOiJhcHAvYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9tYXRlcmlhbC10YWtlb2ZmL21hdGVyaWFsLXRha2Utb2ZmLXJlcG9ydC9jb250ZW50L2FjdHVhbC1jb250ZW50L2FjdHVhbC1jb250ZW50LmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTWF0ZXJpYWxUYWtlT2ZmRWxlbWVudHMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi8uLi9zaGFyZWQvY29uc3RhbnRzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICdiaS1hY3R1YWwtY29udGVudCcsXHJcbiAgdGVtcGxhdGVVcmw6ICdhY3R1YWwtY29udGVudC5jb21wb25lbnQuaHRtbCdcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBBY3R1YWxDb250ZW50Q29tcG9uZW50IHtcclxuXHJcbiAgQElucHV0KCkgY29udGVudDogYW55O1xyXG5cclxuICBnZXRNYXRlcmlhbFRha2VPZmZFbGVtZW50cygpIHtcclxuICAgIHJldHVybiBNYXRlcmlhbFRha2VPZmZFbGVtZW50cztcclxuICB9XHJcblxyXG59XHJcbiJdfQ==
