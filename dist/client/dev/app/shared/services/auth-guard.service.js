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
var session_service_1 = require("./session.service");
var constants_1 = require("../constants");
var AuthGuardService = (function () {
    function AuthGuardService(_router) {
        this._router = _router;
    }
    AuthGuardService.prototype.canActivate = function () {
        return this.validateLogin();
    };
    AuthGuardService.prototype.validateLogin = function () {
        if (parseInt(session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.IS_LOGGED_IN)) === 1) {
            if (session_service_1.SessionStorageService.getSessionValue(constants_1.SessionStorage.ACCESS_TOKEN)) {
                return true;
            }
            else {
                this._router.navigate(['/signin']);
                return false;
            }
        }
        else {
            this._router.navigate(['/signin']);
            return false;
        }
    };
    AuthGuardService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [router_1.Router])
    ], AuthGuardService);
    return AuthGuardService;
}());
exports.AuthGuardService = AuthGuardService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zaGFyZWQvc2VydmljZXMvYXV0aC1ndWFyZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXlDO0FBQ3pDLDBDQUFtRDtBQUNuRCxxREFBd0Q7QUFDeEQsMENBQTRDO0FBSTVDO0lBRUUsMEJBQW9CLE9BQWU7UUFBZixZQUFPLEdBQVAsT0FBTyxDQUFRO0lBRW5DLENBQUM7SUFFRCxzQ0FBVyxHQUFYO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBQ0Qsd0NBQWEsR0FBYjtRQUNFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyx1Q0FBcUIsQ0FBQyxlQUFlLENBQUMsMEJBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkYsRUFBRSxDQUFDLENBQUMsdUNBQXFCLENBQUMsZUFBZSxDQUFDLDBCQUFjLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2RSxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2QsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNmLENBQUM7UUFDSCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7SUFDSCxDQUFDO0lBckJVLGdCQUFnQjtRQUY1QixpQkFBVSxFQUFFO3lDQUlrQixlQUFNO09BRnhCLGdCQUFnQixDQXNCNUI7SUFBRCx1QkFBQztDQXRCRCxBQXNCQyxJQUFBO0FBdEJZLDRDQUFnQiIsImZpbGUiOiJhcHAvc2hhcmVkL3NlcnZpY2VzL2F1dGgtZ3VhcmQuc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHtDYW5BY3RpdmF0ZSxSb3V0ZXJ9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHtTZXNzaW9uU3RvcmFnZVNlcnZpY2V9IGZyb20gXCIuL3Nlc3Npb24uc2VydmljZVwiO1xyXG5pbXBvcnQge1Nlc3Npb25TdG9yYWdlfSBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcblxyXG5leHBvcnQgY2xhc3MgQXV0aEd1YXJkU2VydmljZSBpbXBsZW1lbnRzIENhbkFjdGl2YXRlIHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcm91dGVyOiBSb3V0ZXIpIHtcclxuXHJcbiAgfVxyXG5cclxuICBjYW5BY3RpdmF0ZSgpOmJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMudmFsaWRhdGVMb2dpbigpO1xyXG4gIH1cclxuICB2YWxpZGF0ZUxvZ2luKCkge1xyXG4gICAgaWYgKHBhcnNlSW50KFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuSVNfTE9HR0VEX0lOKSkgPT09IDEpIHtcclxuICAgICAgaWYgKFNlc3Npb25TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uVmFsdWUoU2Vzc2lvblN0b3JhZ2UuQUNDRVNTX1RPS0VOKSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuX3JvdXRlci5uYXZpZ2F0ZShbJy9zaWduaW4nXSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9yb3V0ZXIubmF2aWdhdGUoWycvc2lnbmluJ10pO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==
