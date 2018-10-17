import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { ValidationService } from '../../shared/customvalidations/validation.service';
import {CommonModule} from "@angular/common";
import {UserModule} from "../../user/user.module";
import {SharedModule} from "../../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {LoginRoutes} from "./login.routes";


@NgModule({
  imports: [CommonModule, UserModule,SharedModule,FormsModule, ReactiveFormsModule , RouterModule.forChild(LoginRoutes)],
  declarations: [LoginComponent],
  exports: [LoginComponent],
  providers: [ValidationService]
})
export class LoginModule {
}
