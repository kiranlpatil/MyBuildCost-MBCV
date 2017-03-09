/**
 * Created by techprimelab on 3/9/2017.
 */

import {  NgModule } from '@angular/core';
import { EmployeeComponent } from './employee.component';
import { CommonModule } from '@angular/common';
import { EmployeeService } from './employee.service';

@NgModule({
  imports: [CommonModule],
  declarations: [EmployeeComponent],
  exports: [EmployeeComponent],
  providers: [EmployeeService]
})
export class EmployeeModule { }
