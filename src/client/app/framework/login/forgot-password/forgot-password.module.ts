import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ForgotPasswordRoutes} from "./forgot-password.routes";
import {ForgotPasswordComponent} from "./forgot-password.component";
import {UserModule} from "../../../user/user.module";
import {SharedModule} from "../../../shared/shared.module";
import {ForgotPasswordService} from "./forgot-password.service";

@NgModule({
  imports: [CommonModule,
    UserModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule ,
    RouterModule.forChild(ForgotPasswordRoutes)
  ],
  declarations: [ForgotPasswordComponent],
  providers: [ForgotPasswordService]
})

export class ForgotPasswordModule {

}
