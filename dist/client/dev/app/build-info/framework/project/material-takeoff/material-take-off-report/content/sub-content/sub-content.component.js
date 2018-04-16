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
var SubContentComponent = (function () {
    function SubContentComponent() {
    }
    SubContentComponent.prototype.getMaterialTakeOffElements = function () {
        return constants_1.MaterialTakeOffElements;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SubContentComponent.prototype, "content", void 0);
    SubContentComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'bi-sub-content',
            templateUrl: 'sub-content.component.html'
        })
    ], SubContentComponent);
    return SubContentComponent;
}());
exports.SubContentComponent = SubContentComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9idWlsZC1pbmZvL2ZyYW1ld29yay9wcm9qZWN0L21hdGVyaWFsLXRha2VvZmYvbWF0ZXJpYWwtdGFrZS1vZmYtcmVwb3J0L2NvbnRlbnQvc3ViLWNvbnRlbnQvc3ViLWNvbnRlbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQWlEO0FBQ2pELG1FQUFnRjtBQVNoRjtJQUFBO0lBUUEsQ0FBQztJQUpDLHdEQUEwQixHQUExQjtRQUNFLE1BQU0sQ0FBQyxtQ0FBdUIsQ0FBQztJQUNqQyxDQUFDO0lBSlE7UUFBUixZQUFLLEVBQUU7O3dEQUFjO0lBRlgsbUJBQW1CO1FBTi9CLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsUUFBUSxFQUFFLGdCQUFnQjtZQUMxQixXQUFXLEVBQUUsNEJBQTRCO1NBQzFDLENBQUM7T0FFVyxtQkFBbUIsQ0FRL0I7SUFBRCwwQkFBQztDQVJELEFBUUMsSUFBQTtBQVJZLGtEQUFtQiIsImZpbGUiOiJhcHAvYnVpbGQtaW5mby9mcmFtZXdvcmsvcHJvamVjdC9tYXRlcmlhbC10YWtlb2ZmL21hdGVyaWFsLXRha2Utb2ZmLXJlcG9ydC9jb250ZW50L3N1Yi1jb250ZW50L3N1Yi1jb250ZW50LmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTWF0ZXJpYWxUYWtlT2ZmRWxlbWVudHMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi8uLi8uLi9zaGFyZWQvY29uc3RhbnRzJztcclxuXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAnYmktc3ViLWNvbnRlbnQnLFxyXG4gIHRlbXBsYXRlVXJsOiAnc3ViLWNvbnRlbnQuY29tcG9uZW50Lmh0bWwnXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgU3ViQ29udGVudENvbXBvbmVudCB7XHJcblxyXG4gIEBJbnB1dCgpIGNvbnRlbnQ6IGFueTtcclxuXHJcbiAgZ2V0TWF0ZXJpYWxUYWtlT2ZmRWxlbWVudHMoKSB7XHJcbiAgICByZXR1cm4gTWF0ZXJpYWxUYWtlT2ZmRWxlbWVudHM7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=
