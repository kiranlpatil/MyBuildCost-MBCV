
import {    NgModule  } from '@angular/core';
import {  RegistrationComponent  } from './registration.component';
import {  CommonModule  } from '@angular/common';
import {  RegistrationService  } from './registration.service';

@NgModule({
  imports: [CommonModule],
  declarations: [RegistrationComponent],
  exports: [RegistrationComponent],
  providers: [RegistrationService]
})
export class RegistrationModule { }
