import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {LoginComponent} from "./login/login.component";
import {LoginService} from "./login/login.service";
import {UserHeaderComponent} from "./user-header/user-header.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FacebookService} from "./login/facebook/facebook.service";
import {ResetPasswordComponent} from "./forgot-password/reset-password/reset-password.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {ForgotPasswordService} from "./forgot-password/forgot-password.service";
import {ResetPasswordService} from "./forgot-password/reset-password/reset-password.service";

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  declarations: [UserHeaderComponent, LoginComponent, ResetPasswordComponent, ForgotPasswordComponent],
  exports: [UserHeaderComponent, LoginComponent, ResetPasswordComponent, ForgotPasswordComponent],
  providers: [LoginService, FacebookService, ForgotPasswordService, ResetPasswordService]
})

export class user {

}
