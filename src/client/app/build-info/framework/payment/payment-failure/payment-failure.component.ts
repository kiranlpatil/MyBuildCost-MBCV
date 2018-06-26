import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import {Button, Headings, Messages, NavigationRoutes} from "../../../../shared/constants";

@Component({
  moduleId: module.id,
  selector: 'bi-payment-failure',
  templateUrl: 'payment-failure.component.html',
  styleUrls: ['payment-failure.component.css']
})

export class PaymentFailureComponent implements OnInit {


  constructor(private _router: Router) {

  }

  ngOnInit() {

  }

  getButton() {
    return Button;
  }
  onDashboardClick() {
    this._router.navigate([NavigationRoutes.APP_DASHBOARD]);

  }

  getHeadings() {
    return Headings;
  }

  getMessages() {
    return Messages;
  }
}
