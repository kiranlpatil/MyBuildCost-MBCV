import {NgModule} from "@angular/core";
import {LoginComponent} from "./login.component";
import {LoginService} from "./login.service";
import {ValidationService} from "../../shared/customvalidations/validation.service";


@NgModule({
  declarations: [LoginComponent],
  exports: [LoginComponent],
  providers: [LoginService, ValidationService]
})
export class LoginModule {
}
