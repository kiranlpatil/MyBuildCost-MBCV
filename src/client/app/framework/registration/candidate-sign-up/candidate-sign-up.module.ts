/**
 * Created by techprimelab on 3/9/2017.
 */

import { NgModule } from '@angular/core';
import { CandidateSignUpComponent } from './candidate-sign-up.component';
import { CommonModule } from '@angular/common';
import { CandidateSignUpService } from './candidate-sign-up.service';
import {CandidateSignUpRoutes} from "./candidate-sign-up.routes";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../../shared/shared.module";
import {UserModule} from "../../../user/user.module";

@NgModule({
  imports: [CommonModule,
    UserModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule ,
    RouterModule.forChild(CandidateSignUpRoutes)],
  declarations: [CandidateSignUpComponent],
  exports: [CandidateSignUpComponent],
  providers: [CandidateSignUpService]
})
export class CandidateSignUpModule {
}
