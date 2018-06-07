import {Component, Input, OnInit} from '@angular/core';
import { Headings, Messages } from "../constants";
import { NavigationRoutes } from "../index";
import { Router } from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'bi-create-project-confirmation-modal',
  templateUrl: 'create-project-confirmation-modal.component.html',
  styleUrls: ['update-confirmation-modal.component.css']
})

export class CreateProjectConfirmationModalComponent implements OnInit {
  @Input() trialProjectExist:boolean;
  @Input() subscriptionAvailable:boolean;


  constructor(private _router: Router) {

  }

  ngOnInit() {

  }

  getMessage() {
    return Messages;
  }

  getHeadings() {
    return Headings;
  }

  onCancel() {
    this._router.navigate([NavigationRoutes.APP_DASHBOARD]);

  }

  onContinue() {
      this._router.navigate([NavigationRoutes.APP_RETAIN_PROJECT]);
  }


}
