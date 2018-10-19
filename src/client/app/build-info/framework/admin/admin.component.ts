import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'mbc-admin',
  templateUrl: 'admin.component.html'
})
export class AdminComponent {

  constructor(private _router: Router) {
  }

}
