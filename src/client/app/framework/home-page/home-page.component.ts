import {Component, OnInit} from '@angular/core';
import {ImagePath, NavigationRoutes} from '../../shared/index';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ContactUs} from '../../user/models/contactUs';
import {ContactService1} from './home-page.service';
import {ValidationService} from '../../shared/customvalidations/validation.service';

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
  contacted: boolean = false;
  year = new Date().getFullYear();
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
      emailId: ['', [ValidationService.requireEmailValidator, ValidationService.emailValidator]],
      contactNumber: ['', [ValidationService.requireMobileNumberValidator, ValidationService.mobileNumberValidator, Validators.minLength(10), Validators.maxLength(10)]],
      companyName: ['', [ValidationService.requireCompanyNameValidator]],
      type: ['', [ValidationService.requireContactTypeValidator]]
    });




  }

  onSubmit() {
    this.model = this.contactUs;
    if (this.model.emailId === '' || this.model.contactNumber === '' || this.model.companyName === '' || this.model.type === '') {
      this.submitStatus = true;
      return;
    }

    if (!this.contactUsForm.valid) {
      return;
    }

    this.model = this.contactUsForm.value;
    this.isFormSubmitted = true;
    this.contactService.contact(this.model).subscribe(res => {
       console.log(res);
       this.contacted = true;
    });
  }
  addClick() {
    this._router.navigate([NavigationRoutes.APP_LOGIN]);
  }

  onSignUp() {
    this._router.navigate([NavigationRoutes.APP_REGISTRATION]);
  }

  showContactForm() {
    this.submitStatus = false;
    this.isFormSubmitted = false;
    this.contactUs = new ContactUs();
    this.contactUsForm.reset();
    this.intializeForm();
    this.contacted = false;
  }
}



