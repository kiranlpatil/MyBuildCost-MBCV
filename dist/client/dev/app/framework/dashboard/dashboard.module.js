"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dashboard_component_1 = require("./dashboard.component");
var candidate_dashboard_header_component_1 = require("../../user/candidate-dashboard-header/candidate-dashboard-header.component");
var profile_service_1 = require("../../framework/shared/profileservice/profile.service");
var header_component_1 = require("../shared/header/header.component");
var footer_component_1 = require("../shared/footer/footer.component");
var app_module_1 = require("../../app.module");
var dashboard_service_1 = require("../../user/services/dashboard.service");
var DashboardModule = (function () {
    function DashboardModule() {
    }
    DashboardModule = __decorate([
        core_1.NgModule({
            imports: [app_module_1.AppModule],
            declarations: [dashboard_component_1.DashboardComponent, header_component_1.HeaderComponent, candidate_dashboard_header_component_1.CandidateDashboardHeaderComponent, footer_component_1.FooterComponent],
            exports: [dashboard_component_1.DashboardComponent],
            providers: [dashboard_service_1.DashboardService, profile_service_1.ProfileService]
        })
    ], DashboardModule);
    return DashboardModule;
}());
exports.DashboardModule = DashboardModule;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGFzaGJvYXJkL2Rhc2hib2FyZC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFHQSxzQ0FBeUM7QUFDekMsNkRBQTJEO0FBQzNELG1JQUErSDtBQUMvSCx5RkFBdUY7QUFDdkYsc0VBQW9FO0FBQ3BFLHNFQUFvRTtBQUNwRSwrQ0FBNkM7QUFDN0MsMkVBQXlFO0FBUXpFO0lBQUE7SUFDQSxDQUFDO0lBRFksZUFBZTtRQU4zQixlQUFRLENBQUM7WUFDUixPQUFPLEVBQUUsQ0FBQyxzQkFBUyxDQUFDO1lBQ3BCLFlBQVksRUFBRSxDQUFDLHdDQUFrQixFQUFFLGtDQUFlLEVBQUUsd0VBQWlDLEVBQUUsa0NBQWUsQ0FBQztZQUN2RyxPQUFPLEVBQUUsQ0FBQyx3Q0FBa0IsQ0FBQztZQUM3QixTQUFTLEVBQUUsQ0FBQyxvQ0FBZ0IsRUFBRSxnQ0FBYyxDQUFDO1NBQzlDLENBQUM7T0FDVyxlQUFlLENBQzNCO0lBQUQsc0JBQUM7Q0FERCxBQUNDLElBQUE7QUFEWSwwQ0FBZSIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2Rhc2hib2FyZC9kYXNoYm9hcmQubW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENyZWF0ZWQgYnkgbGVub3ZvIG9uIDExLTA5LTIwMTYuXHJcbiAqL1xyXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBEYXNoYm9hcmRDb21wb25lbnQgfSBmcm9tICcuL2Rhc2hib2FyZC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDYW5kaWRhdGVEYXNoYm9hcmRIZWFkZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi91c2VyL2NhbmRpZGF0ZS1kYXNoYm9hcmQtaGVhZGVyL2NhbmRpZGF0ZS1kYXNoYm9hcmQtaGVhZGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFByb2ZpbGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vZnJhbWV3b3JrL3NoYXJlZC9wcm9maWxlc2VydmljZS9wcm9maWxlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBIZWFkZXJDb21wb25lbnQgfSBmcm9tICcuLi9zaGFyZWQvaGVhZGVyL2hlYWRlci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBGb290ZXJDb21wb25lbnQgfSBmcm9tICcuLi9zaGFyZWQvZm9vdGVyL2Zvb3Rlci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tICcuLi8uLi9hcHAubW9kdWxlJztcclxuaW1wb3J0IHsgRGFzaGJvYXJkU2VydmljZSB9IGZyb20gJy4uLy4uL3VzZXIvc2VydmljZXMvZGFzaGJvYXJkLnNlcnZpY2UnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbQXBwTW9kdWxlXSxcclxuICBkZWNsYXJhdGlvbnM6IFtEYXNoYm9hcmRDb21wb25lbnQsIEhlYWRlckNvbXBvbmVudCwgQ2FuZGlkYXRlRGFzaGJvYXJkSGVhZGVyQ29tcG9uZW50LCBGb290ZXJDb21wb25lbnRdLFxyXG4gIGV4cG9ydHM6IFtEYXNoYm9hcmRDb21wb25lbnRdLFxyXG4gIHByb3ZpZGVyczogW0Rhc2hib2FyZFNlcnZpY2UsIFByb2ZpbGVTZXJ2aWNlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGFzaGJvYXJkTW9kdWxlIHtcclxufVxyXG4iXX0=
