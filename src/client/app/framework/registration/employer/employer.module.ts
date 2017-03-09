/**
 * Created by techprimelab on 3/9/2017.
 */

import {  NgModule } from '@angular/core';
import { EmployerComponent } from './employer.component';
import { CommonModule } from '@angular/common';
import { EmployerService } from './employer.service';

@NgModule({
  imports: [CommonModule],
  declarations: [EmployerComponent],
  exports: [EmployerComponent],
  providers: [EmployerService]
})
export class EmployerModule { }
