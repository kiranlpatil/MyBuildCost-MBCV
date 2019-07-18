import {Component, OnInit} from '@angular/core';
import {ImagePath, NavigationRoutes} from '../../shared/index';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ContactUs} from '../../user/models/contactUs';
import {ContactService1} from './home-page.service';

declare let $: any;

@Component({
  moduleId: module.id,
  selector: 'home-page',
  templateUrl: 'home-page.component.html',
  styleUrls: ['home-page.component.css'],
})

export class HomePageComponent implements OnInit {
  contactUsForm: FormGroup;
  contactUs: ContactUs;
  model = new ContactUs();
  submitStatus: boolean;
  private isFormSubmitted = false;

  constructor(private _router: Router, private formBuilder: FormBuilder, private contactService: ContactService1) {
  }

  ngOnInit(): void {
    this.contactUs = new ContactUs();
    this.intializeForm();
    $('#video-modal').on('hidden.bs.modal',() => {
      $('video').trigger('pause');
    });
    $('#video-modal').on('show.bs.modal',() => {
      $('video').trigger('play');
    });
  }

  scrollToSection($element: any) {
    $('#navbar').collapse('hide');

    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
  }

  intializeForm() {
    this.contactUsForm = this.formBuilder.group({
      emailId: ['', [Validators.required, Validators.minLength(5)]],
      contactNumber: ['', [Validators.required, Validators.minLength(10)]],
      companyName: ['', [Validators.required, Validators.minLength(5)]],
      type: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.model = this.contactUs;
    if (this.model.emailId === '' || this.model.contactNumber === '' || this.model.companyName === '' || this.model.type === '') {
      this.submitStatus = true;
      return;
    }
    this.model = this.contactUsForm.value;
    this.isFormSubmitted = true;
    this.contactService.contact(this.model).subscribe(res => {
       console.log(res);
    });
  }
  addClick() {
    this._router.navigate([NavigationRoutes.APP_LOGIN]);
  }

  onSignUp() {
    this._router.navigate([NavigationRoutes.APP_REGISTRATION]);
  }
}
