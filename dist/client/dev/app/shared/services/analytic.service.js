"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var AnalyticService = (function () {
    function AnalyticService() {
    }
    AnalyticService.prototype.googleAnalyse = function (router) {
        router.events.subscribe(function (event) {
            if (event instanceof router_1.NavigationEnd) {
                ga('set', 'page', event.urlAfterRedirects);
                ga('send', 'pageview');
            }
        });
    };
    AnalyticService = __decorate([
        core_1.Injectable()
    ], AnalyticService);
    return AnalyticService;
}());
exports.AnalyticService = AnalyticService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvc2VydmljZXMvYW5hbHl0aWMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLHNDQUF5QztBQUN6QywwQ0FBc0Q7QUFLdEQ7SUFBQTtJQVNBLENBQUM7SUFSQyx1Q0FBYSxHQUFiLFVBQWMsTUFBYztRQUMxQixNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFBLEtBQUs7WUFDM0IsRUFBRSxDQUFDLENBQUMsS0FBSyxZQUFZLHNCQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDM0MsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN6QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBUlUsZUFBZTtRQUYzQixpQkFBVSxFQUFFO09BRUEsZUFBZSxDQVMzQjtJQUFELHNCQUFDO0NBVEQsQUFTQyxJQUFBO0FBVFksMENBQWUiLCJmaWxlIjoiYXBwL3NoYXJlZC9zZXJ2aWNlcy9hbmFseXRpYy5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQge05hdmlnYXRpb25FbmQsIFJvdXRlcn0gZnJvbSBcIkBhbmd1bGFyL3JvdXRlclwiO1xyXG5kZWNsYXJlIGxldCBnYTogRnVuY3Rpb247XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcblxyXG5leHBvcnQgY2xhc3MgQW5hbHl0aWNTZXJ2aWNlIHtcclxuICBnb29nbGVBbmFseXNlKHJvdXRlcjogUm91dGVyKSB7XHJcbiAgICByb3V0ZXIuZXZlbnRzLnN1YnNjcmliZShldmVudCA9PiB7XHJcbiAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25FbmQpIHtcclxuICAgICAgICBnYSgnc2V0JywgJ3BhZ2UnLCBldmVudC51cmxBZnRlclJlZGlyZWN0cyk7XHJcbiAgICAgICAgZ2EoJ3NlbmQnLCAncGFnZXZpZXcnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==
