/**
 * Created by techprimelab on 3/9/2017.
 */

import {NgModule} from "@angular/core";
import {CandidateSignUpComponent} from "./candidate-sign-up.component";
import {CommonModule} from "@angular/common";
import {CandidateSignUpService} from "./candidate-sign-up.service";

@NgModule({
  imports: [CommonModule],
  declarations: [CandidateSignUpComponent],
  exports: [CandidateSignUpComponent],
  providers: [CandidateSignUpService]
})
export class CandidateSignUpModule {
}
