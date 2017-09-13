import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {LoginComponent} from "./login/login.component";
import {LoginService} from "./login/login.service";
import {LoginRoutes} from "./login/login.routes";
import {UserHeaderComponent} from "./main-header/user-header.component";
import {CommonModule} from "@angular/common";
import {formGroupNameProvider} from "@angular/forms/src/directives/reactive_directives/form_group_name";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FacebookService} from "./login/facebook/facebook.service";

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  declarations: [UserHeaderComponent, LoginComponent ],
  exports: [UserHeaderComponent, LoginComponent],
  providers: [LoginService, FacebookService]
})

export class user {

}
