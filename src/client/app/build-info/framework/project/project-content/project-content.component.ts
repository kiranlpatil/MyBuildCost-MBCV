import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppSettings, Messages, Label, Button, Headings, NavigationRoutes } from '../../../../shared/constants';

@Component({
  moduleId: module.id,
  selector: 'bi-project-content',
  templateUrl: 'project-content.component.html'
})

export class ProjectContentComponent implements OnInit {


  constructor(private _router: Router, private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    console.log('Inside Project Content Component');
  }

  navigateTo(nav:string) {
    this._router.navigate([nav]);
  }

  getMessages() {
    return Messages;
  }

  getLabels() {
    return Label;
  }

  getButtons() {
    return Button;
  }

  getHeadings() {
    return Headings;
  }
}
