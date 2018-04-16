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
var candidate_1 = require("../models/candidate");
var CandidateDashboardHeaderComponent = (function () {
    function CandidateDashboardHeaderComponent() {
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", candidate_1.Candidate)
    ], CandidateDashboardHeaderComponent.prototype, "candidate", void 0);
    CandidateDashboardHeaderComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'cn-candidate-dashboard-header',
            templateUrl: 'candidate-dashboard-header.component.html',
            styleUrls: ['candidate-dashboard-header.component.css'],
        })
    ], CandidateDashboardHeaderComponent);
    return CandidateDashboardHeaderComponent;
}());
exports.CandidateDashboardHeaderComponent = CandidateDashboardHeaderComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91c2VyL2NhbmRpZGF0ZS1kYXNoYm9hcmQtaGVhZGVyL2NhbmRpZGF0ZS1kYXNoYm9hcmQtaGVhZGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFpRDtBQUNqRCxpREFBZ0Q7QUFTaEQ7SUFBQTtJQUdBLENBQUM7SUFGVTtRQUFSLFlBQUssRUFBRTtrQ0FBWSxxQkFBUzt3RUFBQztJQURuQixpQ0FBaUM7UUFQN0MsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUsK0JBQStCO1lBQ3pDLFdBQVcsRUFBRSwyQ0FBMkM7WUFDeEQsU0FBUyxFQUFFLENBQUMsMENBQTBDLENBQUM7U0FDeEQsQ0FBQztPQUVXLGlDQUFpQyxDQUc3QztJQUFELHdDQUFDO0NBSEQsQUFHQyxJQUFBO0FBSFksOEVBQWlDIiwiZmlsZSI6ImFwcC91c2VyL2NhbmRpZGF0ZS1kYXNoYm9hcmQtaGVhZGVyL2NhbmRpZGF0ZS1kYXNoYm9hcmQtaGVhZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ2FuZGlkYXRlIH0gZnJvbSAnLi4vbW9kZWxzL2NhbmRpZGF0ZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHNlbGVjdG9yOiAnY24tY2FuZGlkYXRlLWRhc2hib2FyZC1oZWFkZXInLFxyXG4gIHRlbXBsYXRlVXJsOiAnY2FuZGlkYXRlLWRhc2hib2FyZC1oZWFkZXIuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydjYW5kaWRhdGUtZGFzaGJvYXJkLWhlYWRlci5jb21wb25lbnQuY3NzJ10sXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgQ2FuZGlkYXRlRGFzaGJvYXJkSGVhZGVyQ29tcG9uZW50IHtcclxuICBASW5wdXQoKSBjYW5kaWRhdGU6IENhbmRpZGF0ZTtcclxuXHJcbn1cclxuIl19
