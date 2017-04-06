import {   Component, OnInit, OnDestroy  } from '@angular/core';
import {  Router  } from '@angular/router';
import {  Contact  } from './contact';
import {  ContactService  } from './contact.service';
import {  Message, Messages, MessageService, CommonService  } from '../../shared/index';
import {  FormGroup, FormBuilder, Validators  } from '@angular/forms';
import {  ValidationService  } from '../../shared/customvalidations/validation.service';
import {  LoaderService  } from '../../shared/loader/loader.service';

@Component({
    moduleId: module.id,
    selector: 'tpl-contact',
    templateUrl: 'contact.component.html',
    styleUrls: ['contact.component.css'],
})
export class ContactComponent implements OnInit,OnDestroy {
    model = new Contact();
    //loading = false;
    submitted = false;
    userForm:FormGroup;
    error_msg:string;
    isShowErrorMessage:boolean = true;

    constructor(private commanService:CommonService, private _router:Router,private loaderService:LoaderService,
                private contactService:ContactService, private messageService:MessageService, private formBuilder:FormBuilder) {

        this.userForm = this.formBuilder.group({
            'first_name': ['', Validators.required],
            'email': ['', [Validators.required, ValidationService.emailValidator]],
            'message': ['', Validators.required]
        });
    }

    ngOnInit() {
        document.body.scrollTop = 0;
    }

    ngOnDestroy() {
     // this.loaderService.stop();
    }

    onSubmit() {
        this.submitted = true;
     // this.loaderService.start();
      this.model = this.userForm.value;
        this.contactService.contact(this.model)
            .subscribe(
                body => this.contactSuccess(body),
                error => this.contactFail(error));
    }

    contactSuccess(body:Contact) {
        this.userForm.reset();
        var message = new Message();
     // this.loaderService.stop();
      message.isError = false;
        message.custom_message = Messages.MSG_SUCCESS_CONTACT;
        this.messageService.message(message);
    }

    contactFail(error:any) {
     // this.loaderService.stop();
        if (error.err_code === 404 || error.err_code === 0) {
            var message = new Message();
            message.error_msg = error.err_msg;
            message.isError = true;
            this.messageService.message(message);
        } else {
            var message = new Message();
            this.isShowErrorMessage = false;
            this.error_msg = error.err_msg;
            message.error_msg = error.err_msg;
            message.isError = true;
            this.messageService.message(message);
        }
    }

    goBack() {
        this.commanService.goBack();
    }

    closeErrorMessage() {
        this.isShowErrorMessage = true;
    }

}
