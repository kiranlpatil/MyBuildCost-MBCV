import {Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonService, Message, MessageService} from "../../../shared/index";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "../../../shared/customvalidations/validation.service";
import {ChangeCompanyWebsiteService} from "./change-company-website.service";
import {ChangeCompanyWebsite} from "../../models/change-company-website";
import {Messages} from "../../../shared/constants";


@Component({
  moduleId: module.id,
  selector: 'cn-change-company-website',
  templateUrl: 'change-company-website.component.html',
  styleUrls: ['change-company-website.component.css'],
})

export class ChangeCompanyWebsiteComponent  {
  @Input() companyWebsite:string;
  @Output() onCompanyWebsiteUpdate = new EventEmitter();

  isWebsiteConfirm: boolean;
  model = new ChangeCompanyWebsite();
  userForm: FormGroup;
  error_msg: string;
  isShowErrorMessage: boolean = true;
  isWebsiteSame: boolean;

  constructor(private commonService: CommonService, private changeCompanyWebsiteService: ChangeCompanyWebsiteService,
              private messageService: MessageService, private formBuilder: FormBuilder) {
    console.log(this.model.current_website === undefined);
    this.userForm = this.formBuilder.group({
      'new_company_website': ['', [Validators.required, ValidationService.urlValidator]],
      'current_website': ['']
    });

  }
  ngOnChanges(changes: any) {
    if(changes.companyWebsite.currentValue!=undefined) {
      this.model.current_website = changes.companyWebsite.currentValue;
      console.log(this.model.current_website);
    }
  }
  OnWebsiteSame(): boolean {
    if (this.model.current_website === '') {
      return true;
    } else {
      return (this.model.current_website === this.model.new_company_website);
    }
  }

  onSubmit() {
    this.model = this.userForm.value;
    if (!this.OnWebsiteSame()) {
      this.changeCompanyWebsiteService.changeCompanyWebsite(this.model)
        .subscribe(
          data => this.changeCompanyWebsiteSuccess(data),
          error => this.changeCompanyWebsiteFail(error));
    }else {
      this.isWebsiteSame=true;
    }
    document.body.scrollTop = 0;
  }

  changeCompanyWebsiteSuccess(data:any) {
    this.userForm.reset();
    this.model.current_website=data.data.current_website;
    this.onCompanyWebsiteUpdate.emit(this.model.current_website);
    var message = new Message();
    message.isError = false;
    message.custom_message = data.data.message;
    this.messageService.message(message);

  }

  changeCompanyWebsiteFail(error: any) {
    if (error.err_code === 404 || error.err_code === 0) {
      var message = new Message();
      message.error_msg = error.err_msg;
      message.isError = true;
      this.messageService.message(message);
    } else {
      this.isShowErrorMessage = false;
      this.error_msg = error.err_msg;
    }
  }
  getMessages() {
    return Messages;
  }


}
