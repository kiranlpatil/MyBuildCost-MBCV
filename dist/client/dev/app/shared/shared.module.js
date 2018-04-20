"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var loader_component_1 = require("./loader/loader.component");
var loaders_service_1 = require("./loader/loaders.service");
var control_messages_component_1 = require("./customvalidations/control-messages.component");
var validation_service_1 = require("./customvalidations/validation.service");
var session_service_1 = require("./services/session.service");
var message_service_1 = require("./services/message.service");
var shared_service_1 = require("./services/shared-service");
var themechange_service_1 = require("./services/themechange.service");
var common_service_1 = require("./services/common.service");
var base_service_1 = require("./services/http/base.service");
var custom_http_1 = require("./services/http/custom.http");
var tool_tip_component_1 = require("./tool-tip-component/tool-tip-component");
var footer_component_1 = require("../framework/shared/footer/footer.component");
var usage_tracking_service_1 = require("../build-info/framework/usage-tracking.service");
var error_service_1 = require("./services/error.service");
var SharedModule = (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            declarations: [loader_component_1.LoaderComponent, control_messages_component_1.ControlMessagesComponent, tool_tip_component_1.TooltipComponent, footer_component_1.FooterComponent],
            exports: [loader_component_1.LoaderComponent, control_messages_component_1.ControlMessagesComponent, tool_tip_component_1.TooltipComponent, footer_component_1.FooterComponent],
            providers: [loaders_service_1.LoaderService, usage_tracking_service_1.UsageTrackingService, validation_service_1.ValidationService, session_service_1.SessionStorageService, message_service_1.MessageService, shared_service_1.SharedService,
                themechange_service_1.ThemeChangeService, common_service_1.CommonService, base_service_1.BaseService, custom_http_1.CustomHttp, error_service_1.ErrorService, session_service_1.SessionStorageService]
        })
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvc2hhcmVkLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLHNDQUF5QztBQUN6QywwQ0FBK0M7QUFDL0MsOERBQTREO0FBQzVELDREQUF5RDtBQUN6RCw2RkFBMEY7QUFDMUYsNkVBQTJFO0FBQzNFLDhEQUFtRTtBQUNuRSw4REFBNEQ7QUFDNUQsNERBQTBEO0FBQzFELHNFQUFvRTtBQUNwRSw0REFBMEQ7QUFDMUQsNkRBQTJEO0FBQzNELDJEQUF5RDtBQUN6RCw4RUFBMkU7QUFDM0UsZ0ZBQThFO0FBQzlFLHlGQUFzRjtBQUN0RiwwREFBd0Q7QUFVeEQ7SUFBQTtJQUVBLENBQUM7SUFGWSxZQUFZO1FBUnhCLGVBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRSxDQUFDLHFCQUFZLENBQUM7WUFDdkIsWUFBWSxFQUFFLENBQUMsa0NBQWUsRUFBRSxxREFBd0IsRUFBRSxxQ0FBZ0IsRUFBRSxrQ0FBZSxDQUFDO1lBQzVGLE9BQU8sRUFBRSxDQUFDLGtDQUFlLEVBQUUscURBQXdCLEVBQUUscUNBQWdCLEVBQUUsa0NBQWUsQ0FBQztZQUN2RixTQUFTLEVBQUUsQ0FBQywrQkFBYSxFQUFFLDZDQUFvQixFQUFDLHNDQUFpQixFQUFFLHVDQUFxQixFQUFFLGdDQUFjLEVBQUUsOEJBQWE7Z0JBQ3JILHdDQUFrQixFQUFFLDhCQUFhLEVBQUUsMEJBQVcsRUFBRSx3QkFBVSxFQUFFLDRCQUFZLEVBQUUsdUNBQXFCLENBQUM7U0FDbkcsQ0FBQztPQUVXLFlBQVksQ0FFeEI7SUFBRCxtQkFBQztDQUZELEFBRUMsSUFBQTtBQUZZLG9DQUFZIiwiZmlsZSI6ImFwcC9zaGFyZWQvc2hhcmVkLm1vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IExvYWRlckNvbXBvbmVudCB9IGZyb20gJy4vbG9hZGVyL2xvYWRlci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBMb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi9sb2FkZXIvbG9hZGVycy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29udHJvbE1lc3NhZ2VzQ29tcG9uZW50IH0gZnJvbSAnLi9jdXN0b212YWxpZGF0aW9ucy9jb250cm9sLW1lc3NhZ2VzLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFZhbGlkYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi9jdXN0b212YWxpZGF0aW9ucy92YWxpZGF0aW9uLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTZXNzaW9uU3RvcmFnZVNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL3Nlc3Npb24uc2VydmljZSc7XHJcbmltcG9ydCB7IE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9tZXNzYWdlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTaGFyZWRTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9zaGFyZWQtc2VydmljZSc7XHJcbmltcG9ydCB7IFRoZW1lQ2hhbmdlU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvdGhlbWVjaGFuZ2Uuc2VydmljZSc7XHJcbmltcG9ydCB7IENvbW1vblNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2NvbW1vbi5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQmFzZVNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL2h0dHAvYmFzZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ3VzdG9tSHR0cCB9IGZyb20gJy4vc2VydmljZXMvaHR0cC9jdXN0b20uaHR0cCc7XHJcbmltcG9ydCB7IFRvb2x0aXBDb21wb25lbnQgfSBmcm9tICcuL3Rvb2wtdGlwLWNvbXBvbmVudC90b29sLXRpcC1jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBGb290ZXJDb21wb25lbnQgfSBmcm9tICcuLi9mcmFtZXdvcmsvc2hhcmVkL2Zvb3Rlci9mb290ZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgVXNhZ2VUcmFja2luZ1NlcnZpY2UgfSBmcm9tICcuLi9idWlsZC1pbmZvL2ZyYW1ld29yay91c2FnZS10cmFja2luZy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRXJyb3JTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9lcnJvci5zZXJ2aWNlJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXHJcbiAgZGVjbGFyYXRpb25zOiBbTG9hZGVyQ29tcG9uZW50LCBDb250cm9sTWVzc2FnZXNDb21wb25lbnQsIFRvb2x0aXBDb21wb25lbnQsIEZvb3RlckNvbXBvbmVudF0sXHJcbiAgZXhwb3J0czogW0xvYWRlckNvbXBvbmVudCwgQ29udHJvbE1lc3NhZ2VzQ29tcG9uZW50LCBUb29sdGlwQ29tcG9uZW50LCBGb290ZXJDb21wb25lbnRdLFxyXG4gIHByb3ZpZGVyczogW0xvYWRlclNlcnZpY2UsIFVzYWdlVHJhY2tpbmdTZXJ2aWNlLFZhbGlkYXRpb25TZXJ2aWNlLCBTZXNzaW9uU3RvcmFnZVNlcnZpY2UsIE1lc3NhZ2VTZXJ2aWNlLCBTaGFyZWRTZXJ2aWNlLFxyXG4gICAgVGhlbWVDaGFuZ2VTZXJ2aWNlLCBDb21tb25TZXJ2aWNlLCBCYXNlU2VydmljZSwgQ3VzdG9tSHR0cCwgRXJyb3JTZXJ2aWNlLCBTZXNzaW9uU3RvcmFnZVNlcnZpY2VdXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgU2hhcmVkTW9kdWxlIHtcclxuXHJcbn1cclxuIl19
