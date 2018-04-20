"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var candidate_sign_up_component_1 = require("./candidate-sign-up.component");
var common_1 = require("@angular/common");
var candidate_sign_up_service_1 = require("./candidate-sign-up.service");
var CandidateSignUpModule = (function () {
    function CandidateSignUpModule() {
    }
    CandidateSignUpModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            declarations: [candidate_sign_up_component_1.CandidateSignUpComponent],
            exports: [candidate_sign_up_component_1.CandidateSignUpComponent],
            providers: [candidate_sign_up_service_1.CandidateSignUpService]
        })
    ], CandidateSignUpModule);
    return CandidateSignUpModule;
}());
exports.CandidateSignUpModule = CandidateSignUpModule;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvcmVnaXN0cmF0aW9uL2NhbmRpZGF0ZS1zaWduLXVwL2NhbmRpZGF0ZS1zaWduLXVwLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUlBLHNDQUF5QztBQUN6Qyw2RUFBeUU7QUFDekUsMENBQStDO0FBQy9DLHlFQUFxRTtBQVFyRTtJQUFBO0lBQ0EsQ0FBQztJQURZLHFCQUFxQjtRQU5qQyxlQUFRLENBQUM7WUFDUixPQUFPLEVBQUUsQ0FBQyxxQkFBWSxDQUFDO1lBQ3ZCLFlBQVksRUFBRSxDQUFDLHNEQUF3QixDQUFDO1lBQ3hDLE9BQU8sRUFBRSxDQUFDLHNEQUF3QixDQUFDO1lBQ25DLFNBQVMsRUFBRSxDQUFDLGtEQUFzQixDQUFDO1NBQ3BDLENBQUM7T0FDVyxxQkFBcUIsQ0FDakM7SUFBRCw0QkFBQztDQURELEFBQ0MsSUFBQTtBQURZLHNEQUFxQiIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3JlZ2lzdHJhdGlvbi9jYW5kaWRhdGUtc2lnbi11cC9jYW5kaWRhdGUtc2lnbi11cC5tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ3JlYXRlZCBieSB0ZWNocHJpbWVsYWIgb24gMy85LzIwMTcuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ2FuZGlkYXRlU2lnblVwQ29tcG9uZW50IH0gZnJvbSAnLi9jYW5kaWRhdGUtc2lnbi11cC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBDYW5kaWRhdGVTaWduVXBTZXJ2aWNlIH0gZnJvbSAnLi9jYW5kaWRhdGUtc2lnbi11cC5zZXJ2aWNlJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXHJcbiAgZGVjbGFyYXRpb25zOiBbQ2FuZGlkYXRlU2lnblVwQ29tcG9uZW50XSxcclxuICBleHBvcnRzOiBbQ2FuZGlkYXRlU2lnblVwQ29tcG9uZW50XSxcclxuICBwcm92aWRlcnM6IFtDYW5kaWRhdGVTaWduVXBTZXJ2aWNlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2FuZGlkYXRlU2lnblVwTW9kdWxlIHtcclxufVxyXG4iXX0=
