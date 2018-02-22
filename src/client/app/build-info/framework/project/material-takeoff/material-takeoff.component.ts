import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialTakeoffService } from './material-takeoff.service';

@Component({
  moduleId: module.id,
  selector: 'bi-material-takeoff-report',
  templateUrl: 'material-takeoff.component.html'
})

export class MaterialTakeoffComponent {

  constructor(private materialTakeoffService: MaterialTakeoffService, private _router: Router) {

  }
}
