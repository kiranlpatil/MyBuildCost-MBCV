import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from './contact';
import { ContactService } from './contact.service';
import { CommonService, Message, Messages, MessageService } from '../../../shared/index';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../../shared/customvalidations/validation.service';
import { LoaderService } from '../../../shared/loader/loaders.service';

@Component({
  moduleId: module.id,
  selector: 'tpl-contact',
  templateUrl: 'contact.component.html',
  styleUrls: ['contact.component.css'],
})
export class ContactComponent implements OnInit {
  model = new Contact();
  submitted = false;
  userForm: FormGroup;
  error_msg: string;
  isShowErrorMessage: boolean = true;
  contactUsText: string= Messages.MSG_CONTACT_US;
  contactAddress: string= Messages.CONTACT_US_ADDRESS;
  contactNumber1: string= Messages.CONTACT_US_CONTACT_NUMBER_1;
  contactNumber2: string= Messages.CONTACT_US_CONTACT_NUMBER_2;
  contactEmail1: string= Messages.CONTACT_US_EMAIL_1;
  contactEmail2: string= Messages.CONTACT_US_EMAIL_2;


  constructor(private commonService: CommonService, private _router: Router, private loaderService: LoaderService,
              private contactService: ContactService, private messageService: MessageService, private formBuilder: FormBuilder) {

    this.userForm = this.formBuilder.group({
      'first_name': ['', Validators.required],
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'message': ['', Validators.required]
    });
  }

  ngOnInit() {
    document.body.scrollTop = 0;
  }

  onSubmit() {
    this.submitted = true;
    this.model = this.userForm.value;
    this.contactService.contact(this.model)
      .subscribe(
        body => this.onContactSuccess(body),
        error => this.onContactFailure(error));
  }

  onContactSuccess(body: Contact) {
    this.userForm.reset();
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_CONTACT;
    this.messageService.message(message);
  }

  onContactFailure(error: any) {
    var message = new Message();
    if (error.err_code === 404 || error.err_code === 0 || error.err_code===500) {
      message.error_msg = error.err_msg;
      message.error_code =  error.err_code;
      message.isError = true;
      this.messageService.message(message);
    } else {
      this.isShowErrorMessage = false;
      this.error_msg = error.err_msg;
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    }
  }
}
