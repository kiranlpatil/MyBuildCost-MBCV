import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ResetPasswordRoutes} from "./reset-password.routes";
import {ResetPasswordComponent} from "./reset-password.component";
import {UserModule} from "../../../../user/user.module";
import {SharedModule} from "../../../../shared/shared.module";
import {ResetPasswordService} from "./reset-password.service";

@NgModule({
  imports: [CommonModule, UserModule,SharedModule,FormsModule, ReactiveFormsModule , RouterModule.forChild(ResetPasswordRoutes)],
  declarations: [ResetPasswordComponent],
  providers: [ResetPasswordService]
})

export class ResetPasswordModule {

}
