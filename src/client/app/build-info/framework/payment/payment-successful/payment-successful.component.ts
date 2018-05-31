import { Component } from '@angular/core';
import { Headings, Button, Label,Messages } from '../../../../shared/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationRoutes } from '../../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'bi-payment-success',
  templateUrl: 'payment-successful.component.html'
})

export class PaymentSuccessfulComponent {

  constructor(private activatedRoute:ActivatedRoute, private _router: Router) {
  }

  goToDashboard() {
    this._router.navigate([NavigationRoutes.APP_DASHBOARD]);
  }
}
