import {Component, Input, OnInit} from '@angular/core';
import {Headings, Messages, SessionStorage} from "../constants";
import {NavigationRoutes, SessionStorageService} from "../index";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'bi-create-project-confirmation-modal',
  templateUrl: 'create-project-confirmation-modal.component.html',
  styleUrls: ['update-confirmation-modal.component.css']
})

export class CreateProjectConfirmationModalComponent implements OnInit {
  @Input() trialProjectExist:boolean;
  @Input() subscriptionAvailable:boolean;
  projectname:string;

  constructor(private _router: Router,private activatedRoute:ActivatedRoute) {

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
      let projectName = SessionStorageService.getSessionValue(SessionStorage.CURRENT_PROJECT_NAME);
      this._router.navigate([NavigationRoutes.APP_RETAIN_PROJECT,projectName]);
  }


}
