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
var LoginauthGuard = (function () {
    function LoginauthGuard(_router) {
        this._router = _router;
    }
    LoginauthGuard.prototype.canActivate = function () {
        return this.validateLogin();
    };
    LoginauthGuard.prototype.validateLogin = function () {
        return true;
    };
    LoginauthGuard = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [router_1.Router])
    ], LoginauthGuard);
    return LoginauthGuard;
}());
exports.LoginauthGuard = LoginauthGuard;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvbG9naW4vbG9naW4tYXV0aC1ndWFyZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXlDO0FBQ3pDLDBDQUFtRDtBQU9uRDtJQUVFLHdCQUFvQixPQUFlO1FBQWYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtJQUVuQyxDQUFDO0lBRUQsb0NBQVcsR0FBWDtRQUNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUNELHNDQUFhLEdBQWI7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQVhVLGNBQWM7UUFGMUIsaUJBQVUsRUFBRTt5Q0FJa0IsZUFBTTtPQUZ4QixjQUFjLENBWTFCO0lBQUQscUJBQUM7Q0FaRCxBQVlDLElBQUE7QUFaWSx3Q0FBYyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2xvZ2luL2xvZ2luLWF1dGgtZ3VhcmQuc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHtDYW5BY3RpdmF0ZSxSb3V0ZXJ9IGZyb20gXCJAYW5ndWxhci9yb3V0ZXJcIjtcclxuaW1wb3J0IHtTZXNzaW9uU3RvcmFnZVNlcnZpY2V9IGZyb20gXCIuLi8uLi9zaGFyZWQvc2VydmljZXMvc2Vzc2lvbi5zZXJ2aWNlXCI7XHJcbmltcG9ydCB7U2Vzc2lvblN0b3JhZ2UsIE5hdmlnYXRpb25Sb3V0ZXN9IGZyb20gXCIuLi8uLi9zaGFyZWQvY29uc3RhbnRzXCI7XHJcblxyXG5cclxuQEluamVjdGFibGUoKVxyXG5cclxuZXhwb3J0IGNsYXNzIExvZ2luYXV0aEd1YXJkIGltcGxlbWVudHMgQ2FuQWN0aXZhdGUge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yb3V0ZXI6IFJvdXRlcikge1xyXG5cclxuICB9XHJcblxyXG4gIGNhbkFjdGl2YXRlKCk6Ym9vbGVhbiB7XHJcbiAgIHJldHVybiB0aGlzLnZhbGlkYXRlTG9naW4oKTtcclxuICB9XHJcbiAgdmFsaWRhdGVMb2dpbigpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG4iXX0=
