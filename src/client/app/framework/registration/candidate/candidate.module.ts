/**
 * Created by techprimelab on 3/9/2017.
 */

import {    NgModule  } from '@angular/core';
import {  CandidateComponent  } from './candidate.component';
import {  CommonModule  } from '@angular/common';
import {  CandidateService  } from './candidate.service';

@NgModule({
  imports: [CommonModule],
  declarations: [CandidateComponent],
  exports: [CandidateComponent],
  providers: [CandidateService]
})
export class CandidateModule { }
