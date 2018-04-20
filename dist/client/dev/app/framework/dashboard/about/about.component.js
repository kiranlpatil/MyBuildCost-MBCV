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
var index_1 = require("../../../shared/index");
var constants_1 = require("../../../shared/constants");
var AboutComponent = (function () {
    function AboutComponent(commonService) {
        this.commonService = commonService;
        this.aboutUsDiscriptionText = constants_1.Messages.MSG_ABOUT_US_DISCRIPTION;
        this.MY_LOGO = constants_1.ImagePath.MY_WHITE_LOGO;
    }
    AboutComponent.prototype.ngOnInit = function () {
        document.body.scrollTop = 0;
    };
    AboutComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'tpl-about',
            templateUrl: 'about.component.html',
            styleUrls: ['about.component.css'],
        }),
        __metadata("design:paramtypes", [index_1.CommonService])
    ], AboutComponent);
    return AboutComponent;
}());
exports.AboutComponent = AboutComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvZGFzaGJvYXJkL2Fib3V0L2Fib3V0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFrRDtBQUNsRCwrQ0FBc0Q7QUFDdEQsdURBQWdFO0FBUWhFO0lBSUUsd0JBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBRmhELDJCQUFzQixHQUFVLG9CQUFRLENBQUMsd0JBQXdCLENBQUM7UUFHaEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxxQkFBUyxDQUFDLGFBQWEsQ0FBQztJQUN6QyxDQUFDO0lBRUQsaUNBQVEsR0FBUjtRQUNFLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBVlUsY0FBYztRQU4xQixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFFBQVEsRUFBRSxXQUFXO1lBQ3JCLFdBQVcsRUFBRSxzQkFBc0I7WUFDbkMsU0FBUyxFQUFFLENBQUMscUJBQXFCLENBQUM7U0FDbkMsQ0FBQzt5Q0FLbUMscUJBQWE7T0FKckMsY0FBYyxDQVcxQjtJQUFELHFCQUFDO0NBWEQsQUFXQyxJQUFBO0FBWFksd0NBQWMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9kYXNoYm9hcmQvYWJvdXQvYWJvdXQuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9pbmRleCc7XHJcbmltcG9ydCB7IEltYWdlUGF0aCwgTWVzc2FnZXMgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvY29uc3RhbnRzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICd0cGwtYWJvdXQnLFxyXG4gIHRlbXBsYXRlVXJsOiAnYWJvdXQuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydhYm91dC5jb21wb25lbnQuY3NzJ10sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBYm91dENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgTVlfTE9HTzogc3RyaW5nO1xyXG4gIGFib3V0VXNEaXNjcmlwdGlvblRleHQ6IHN0cmluZz0gTWVzc2FnZXMuTVNHX0FCT1VUX1VTX0RJU0NSSVBUSU9OO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbW1vblNlcnZpY2U6IENvbW1vblNlcnZpY2UpIHtcclxuICAgIHRoaXMuTVlfTE9HTyA9IEltYWdlUGF0aC5NWV9XSElURV9MT0dPO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IDA7XHJcbiAgfVxyXG59XHJcbiJdfQ==
