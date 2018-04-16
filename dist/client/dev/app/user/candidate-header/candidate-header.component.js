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
var router_1 = require("@angular/router");
var candidate_1 = require("../models/candidate");
var constants_1 = require("../../shared/constants");
var session_service_1 = require("../../shared/services/session.service");
var CandidateHeaderComponent = (function () {
    function CandidateHeaderComponent(_router, _eref) {
        this._router = _router;
        this._eref = _eref;
        this.isClassVisible = false;
        this.isOpenProfile = false;
        this.highlightedSection = new candidate_1.Section();
        this.MY_LOGO = constants_1.ImagePath.MY_WHITE_LOGO;
        this.MOBILE_LOGO = constants_1.ImagePath.MOBILE_WHITE_LOGO;
        this.user_first_name = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.FIRST_NAME);
        this.user_last_name = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.LAST_NAME);
    }
    CandidateHeaderComponent.prototype.onClick = function (event) {
        if (!this._eref.nativeElement.contains(event.target)) {
            this.isOpenProfile = false;
        }
    };
    CandidateHeaderComponent.prototype.getImagePath = function (imagePath) {
        if (imagePath !== undefined) {
            return constants_1.AppSettings.IP + imagePath.replace('"', '');
        }
        return null;
    };
    CandidateHeaderComponent.prototype.logOut = function () {
        window.sessionStorage.clear();
        window.localStorage.clear();
        var host = constants_1.AppSettings.HTTP_CLIENT + constants_1.AppSettings.HOST_NAME;
        window.location.href = host;
    };
    CandidateHeaderComponent.prototype.navigateToWithId = function (nav) {
        var userId = session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.USER_ID);
        this._router.navigate([nav, userId]);
    };
    CandidateHeaderComponent.prototype.navigateTo = function (nav) {
        this._router.navigate([nav]);
        this.closeMenu();
    };
    CandidateHeaderComponent.prototype.onSkip = function () {
        this.highlightedSection.name = 'none';
    };
    CandidateHeaderComponent.prototype.toggleMenu = function () {
        this.isClassVisible = !this.isClassVisible;
        this.isOpenProfile = false;
    };
    CandidateHeaderComponent.prototype.openDropdownProfile = function () {
        this.isOpenProfile = !this.isOpenProfile;
    };
    CandidateHeaderComponent.prototype.closeMenu = function () {
        this.isClassVisible = false;
    };
    CandidateHeaderComponent.prototype.goToGuidedTour = function () {
        this.highlightedSection.name = 'GuideTour';
        this.closeMenu();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", candidate_1.Candidate)
    ], CandidateHeaderComponent.prototype, "candidate", void 0);
    __decorate([
        core_1.HostListener('document:click', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], CandidateHeaderComponent.prototype, "onClick", null);
    CandidateHeaderComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'cn-candidate-header',
            templateUrl: 'candidate-header.component.html',
            styleUrls: ['candidate-header.component.css'],
        }),
        __metadata("design:paramtypes", [router_1.Router, core_1.ElementRef])
    ], CandidateHeaderComponent);
    return CandidateHeaderComponent;
}());
exports.CandidateHeaderComponent = CandidateHeaderComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC91c2VyL2NhbmRpZGF0ZS1oZWFkZXIvY2FuZGlkYXRlLWhlYWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBMkU7QUFDM0UsMENBQXlDO0FBQ3pDLGlEQUF5RDtBQUN6RCxvREFBZ0Y7QUFDaEYseUVBQThFO0FBUzlFO0lBa0JFLGtDQUFvQixPQUFlLEVBQVUsS0FBaUI7UUFBMUMsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFVLFVBQUssR0FBTCxLQUFLLENBQVk7UUFoQnZELG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBQ2hDLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBTTlCLHVCQUFrQixHQUFZLElBQUksbUJBQU8sRUFBRSxDQUFDO1FBVWxELElBQUksQ0FBQyxPQUFPLEdBQUcscUJBQVMsQ0FBQyxhQUFhLENBQUM7UUFDdkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxxQkFBUyxDQUFDLGlCQUFpQixDQUFDO1FBQy9DLElBQUksQ0FBQyxlQUFlLEdBQUcsdUNBQXFCLENBQUMsZUFBZSxDQUFDLDBCQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEYsSUFBSSxDQUFDLGNBQWMsR0FBRyx1Q0FBcUIsQ0FBQyxlQUFlLENBQUMsMEJBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN4RixDQUFDO0lBWjJDLDBDQUFPLEdBQVAsVUFBUSxLQUFVO1FBQzVELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFFN0IsQ0FBQztJQUNILENBQUM7SUFTRCwrQ0FBWSxHQUFaLFVBQWEsU0FBaUI7UUFDNUIsRUFBRSxDQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsTUFBTSxDQUFDLHVCQUFXLENBQUMsRUFBRSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELHlDQUFNLEdBQU47UUFDRSxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDNUIsSUFBSSxJQUFJLEdBQUcsdUJBQVcsQ0FBQyxXQUFXLEdBQUcsdUJBQVcsQ0FBQyxTQUFTLENBQUM7UUFDekQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxtREFBZ0IsR0FBaEIsVUFBaUIsR0FBVTtRQUN6QixJQUFJLE1BQU0sR0FBRyx1Q0FBcUIsQ0FBQyxlQUFlLENBQUMsMEJBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6RSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCw2Q0FBVSxHQUFWLFVBQVcsR0FBVTtRQUNuQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFRCx5Q0FBTSxHQUFOO1FBQ0UsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksR0FBQyxNQUFNLENBQUM7SUFDdEMsQ0FBQztJQUVELDZDQUFVLEdBQVY7UUFDRSxJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUMzQyxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztJQUM3QixDQUFDO0lBRUQsc0RBQW1CLEdBQW5CO1FBQ0UsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDM0MsQ0FBQztJQUVELDRDQUFTLEdBQVQ7UUFDRSxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztJQUM5QixDQUFDO0lBRUQsaURBQWMsR0FBZDtRQUNFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO1FBQzNDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBcEVRO1FBQVIsWUFBSyxFQUFFO2tDQUFZLHFCQUFTOytEQUFDO0lBVWM7UUFBM0MsbUJBQVksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7OzJEQUsxQztJQWhCVSx3QkFBd0I7UUFQcEMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixRQUFRLEVBQUUscUJBQXFCO1lBQy9CLFdBQVcsRUFBRSxpQ0FBaUM7WUFDOUMsU0FBUyxFQUFFLENBQUMsZ0NBQWdDLENBQUM7U0FDOUMsQ0FBQzt5Q0FvQjZCLGVBQU0sRUFBaUIsaUJBQVU7T0FsQm5ELHdCQUF3QixDQXNFcEM7SUFBRCwrQkFBQztDQXRFRCxBQXNFQyxJQUFBO0FBdEVZLDREQUF3QiIsImZpbGUiOiJhcHAvdXNlci9jYW5kaWRhdGUtaGVhZGVyL2NhbmRpZGF0ZS1oZWFkZXIuY29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IENhbmRpZGF0ZSwgU2VjdGlvbiB9IGZyb20gJy4uL21vZGVscy9jYW5kaWRhdGUnO1xyXG5pbXBvcnQgeyBBcHBTZXR0aW5ncywgSW1hZ2VQYXRoLCBTZXNzaW9uU3RvcmFnZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBTZXNzaW9uU3RvcmFnZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zaGFyZWQvc2VydmljZXMvc2Vzc2lvbi5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgc2VsZWN0b3I6ICdjbi1jYW5kaWRhdGUtaGVhZGVyJyxcclxuICB0ZW1wbGF0ZVVybDogJ2NhbmRpZGF0ZS1oZWFkZXIuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWydjYW5kaWRhdGUtaGVhZGVyLmNvbXBvbmVudC5jc3MnXSxcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBDYW5kaWRhdGVIZWFkZXJDb21wb25lbnQge1xyXG4gIEBJbnB1dCgpIGNhbmRpZGF0ZTogQ2FuZGlkYXRlO1xyXG4gIHB1YmxpYyBpc0NsYXNzVmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHB1YmxpYyBpc09wZW5Qcm9maWxlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgUFJPRklMRV9JTUdfUEFUSDogc3RyaW5nO1xyXG4gIHVzZXJfZmlyc3RfbmFtZTogc3RyaW5nO1xyXG4gIHVzZXJfbGFzdF9uYW1lOiBzdHJpbmc7XHJcbiAgTVlfTE9HTzogc3RyaW5nO1xyXG4gIE1PQklMRV9MT0dPOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBoaWdobGlnaHRlZFNlY3Rpb246IFNlY3Rpb24gPSBuZXcgU2VjdGlvbigpO1xyXG5cclxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDpjbGljaycsIFsnJGV2ZW50J10pIG9uQ2xpY2soZXZlbnQ6IGFueSkge1xyXG4gICAgaWYgKCF0aGlzLl9lcmVmLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xyXG4gICAgICB0aGlzLmlzT3BlblByb2ZpbGUgPSBmYWxzZTtcclxuXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBfZXJlZjogRWxlbWVudFJlZikge1xyXG4gICAgdGhpcy5NWV9MT0dPID0gSW1hZ2VQYXRoLk1ZX1dISVRFX0xPR087XHJcbiAgICB0aGlzLk1PQklMRV9MT0dPID0gSW1hZ2VQYXRoLk1PQklMRV9XSElURV9MT0dPO1xyXG4gICAgdGhpcy51c2VyX2ZpcnN0X25hbWUgPSBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLkZJUlNUX05BTUUpO1xyXG4gICAgdGhpcy51c2VyX2xhc3RfbmFtZSA9IFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuTEFTVF9OQU1FKTtcclxuICB9XHJcblxyXG4gIGdldEltYWdlUGF0aChpbWFnZVBhdGg6IHN0cmluZykge1xyXG4gICAgaWYgKGltYWdlUGF0aCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiBBcHBTZXR0aW5ncy5JUCArIGltYWdlUGF0aC5yZXBsYWNlKCdcIicsICcnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgbG9nT3V0KCkge1xyXG4gICAgd2luZG93LnNlc3Npb25TdG9yYWdlLmNsZWFyKCk7XHJcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLmNsZWFyKCk7XHJcbiAgICBsZXQgaG9zdCA9IEFwcFNldHRpbmdzLkhUVFBfQ0xJRU5UICsgQXBwU2V0dGluZ3MuSE9TVF9OQU1FO1xyXG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGhvc3Q7XHJcbiAgfVxyXG5cclxuICBuYXZpZ2F0ZVRvV2l0aElkKG5hdjpzdHJpbmcpIHtcclxuICAgIHZhciB1c2VySWQgPSBTZXNzaW9uU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblZhbHVlKFNlc3Npb25TdG9yYWdlLlVTRVJfSUQpO1xyXG4gICAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoW25hdiwgdXNlcklkXSk7XHJcbiAgfVxyXG5cclxuICBuYXZpZ2F0ZVRvKG5hdjpzdHJpbmcpIHtcclxuICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbbmF2XSk7XHJcbiAgICB0aGlzLmNsb3NlTWVudSgpO1xyXG4gIH1cclxuXHJcbiAgb25Ta2lwKCkge1xyXG4gICAgdGhpcy5oaWdobGlnaHRlZFNlY3Rpb24ubmFtZT0nbm9uZSc7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVNZW51KCkge1xyXG4gICAgdGhpcy5pc0NsYXNzVmlzaWJsZSA9ICF0aGlzLmlzQ2xhc3NWaXNpYmxlO1xyXG4gICAgdGhpcy5pc09wZW5Qcm9maWxlID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBvcGVuRHJvcGRvd25Qcm9maWxlKCkge1xyXG4gICAgdGhpcy5pc09wZW5Qcm9maWxlID0gIXRoaXMuaXNPcGVuUHJvZmlsZTtcclxuICB9XHJcblxyXG4gIGNsb3NlTWVudSgpIHtcclxuICAgIHRoaXMuaXNDbGFzc1Zpc2libGUgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIGdvVG9HdWlkZWRUb3VyKCkge1xyXG4gICAgdGhpcy5oaWdobGlnaHRlZFNlY3Rpb24ubmFtZSA9ICdHdWlkZVRvdXInO1xyXG4gICAgdGhpcy5jbG9zZU1lbnUoKTtcclxuICB9XHJcbn1cclxuIl19
