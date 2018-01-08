import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'bi-project-header',
  templateUrl: 'project-header.component.html'
})

export class ProjectHeaderComponent {

  constructor(private _router: Router) {
  }

  navigateTo(nav:string) {
    this._router.navigate([nav]);
  }
}
