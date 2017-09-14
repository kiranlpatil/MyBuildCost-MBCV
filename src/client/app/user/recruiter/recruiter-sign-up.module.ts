/**
 * Created by techprimelab on 3/9/2017.
 */

import {NgModule} from "@angular/core";
import {RecruiterSignUpComponent} from "./recruiter-sign-up.component";
import {CommonModule} from "@angular/common";
import {RecruiterSignUpService} from "./recruiter-sign-up.service";

@NgModule({
  imports: [CommonModule],
  declarations: [RecruiterSignUpComponent],
  exports: [RecruiterSignUpComponent],
  providers: [RecruiterSignUpService]
})
export class RecruiterSignUpModule {
}
