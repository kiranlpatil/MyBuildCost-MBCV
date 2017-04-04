/**
 * Created by techprimelab on 3/9/2017.
 */

import {    NgModule  } from '@angular/core';
import {  RecruiterComponent  } from './recruiter.component';
import {  CommonModule  } from '@angular/common';
import {  RecruiterService  } from './recruiter.service';

@NgModule({
  imports: [CommonModule],
  declarations: [RecruiterComponent],
  exports: [RecruiterComponent],
  providers: [RecruiterService]
})
export class RecruiterModule { }
