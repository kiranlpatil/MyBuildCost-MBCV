
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyDetailsService } from './company-details.service';
import { CompanyDetails } from './company-details';
import {  FormBuilder, FormGroup, Validators  } from '@angular/forms';
import {
  Message,
  MessageService,
  NavigationRoutes,
  ProfileService,
  CommonService,
  Messages,
  AppSettings
 } from '../../shared/index';
import { ImagePath, LocalStorage } from '../../shared/constants';
import { LocalStorageService } from '../../shared/localstorage.service';
import { LoaderService } from '../../shared/loader/loader.service';
import { Http } from '@angular/http';

@Component({
  moduleId: module.id,
  selector: 'cn-company-details',
  templateUrl: 'company-details.component.html',
  styleUrls: ['company-details.component.css'],
})

export class CompanyDetailsComponent {
  private model = new CompanyDetails();
  private companyDetailsForm: FormGroup;
  private company_name: any;
  private filesToUpload: Array<File>;
  private setOfDocuments:string[]=new Array();
  private image_path: any;
  private error_msg: string;
  private isShowErrorMessage: boolean = true;
  private BODY_BACKGROUND: string;
  private submitted = false;
  private fileName1:string;
  private fileName2:string;
  private fileName3:string;
  private buttonId:string;


  constructor(private commanService: CommonService, private _router: Router, private http: Http,
              private companyDetailsService: CompanyDetailsService,private profileService: ProfileService,
              private messageService: MessageService, private formBuilder: FormBuilder, private loaderService: LoaderService) {
    this.companyDetailsForm = this.formBuilder.group({
      'about_company':['',Validators.required],
      'description1': ['',Validators.required],
      'description2': ['',Validators.required],
      'description3': ['',Validators.required],
    });

    //this.filesToUpload = [];
    if (this.image_path === undefined) {

      this.image_path = ImagePath.PROFILE_IMG_ICON;
    }

    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
    this.company_name = LocalStorageService.getLocalValue(LocalStorage.EMAIL_ID);
  }

  ngOnInit() {
    this.company_name = LocalStorageService.getLocalValue(LocalStorage.COMPANY_NAME);

  }


  onSubmit() {

    this.submitted = true;
    this.model = this.companyDetailsForm.value;
    this.model.setOfDocuments = this.setOfDocuments;
    console.log('files to upload in setOfDocuments', this.setOfDocuments);

    this.companyDetailsService.companyDetails(this.model)
      .subscribe(
        success => this.onCompanyDetailsSuccess(success),
        error => this.onCompanyDetailsError(error));
  }


  goBack() {
    this.commanService.goBack();
    this._router.navigate(['/']);
  }

  goToLanding() {
    this._router.navigate(['/landing']);
  }

  fileChangeEvent(fileInput: any) {

    this.filesToUpload = <Array<File>> fileInput.target.files;
    this.buttonId = fileInput.target.id;
    if(this.buttonId ==='file-upload1') {
      this.fileName1=this.filesToUpload[0].name;
    }
    else if(this.buttonId ==='file-upload2') {
      this.fileName2=this.filesToUpload[0].name;
    } else {
      this.fileName3=this.filesToUpload[0].name;
    }

      this.companyDetailsService.makeDocumentUplaod(this.filesToUpload, []).then((result: any) => {
        if (result !== null) {
          if(this.buttonId ==='file-upload1') {
            this.setOfDocuments[0]=result.data.document;
          } else if(this.buttonId ==='file-upload2') {
            this.setOfDocuments[1]=result.data.document;
          } else {
            this.setOfDocuments[2]=result.data.document;
          }

          console.log('setOfDocuments is:',this.setOfDocuments);

          this.fileChangeSuccess(result);
        }
      }, (error:any) => {
        this.fileChangeFail(error);
      });

  }


  fileChangeSuccess(result: any) {
    this.model = result.data;
    var socialLogin: string = LocalStorageService.getLocalValue(LocalStorage.IS_SOCIAL_LOGIN);
    if (!this.model.picture || this.model.picture === undefined) {
      this.image_path = ImagePath.PROFILE_IMG_ICON;
    } else if (socialLogin === AppSettings.IS_SOCIAL_LOGIN_YES) {
      this.image_path = this.model.picture;
    } else {
      this.image_path = AppSettings.IP + this.model.picture.substring(4).replace('"', '');
    }
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_UPLOAD_DOCUMENT;
    this.messageService.message(message);
    this.profileService.onProfileUpdate(result);
  }

  fileChangeFail(error: any) {
    var message = new Message();
    message.isError = true;
    if (error.err_code === 404 || error.err_code === 0) {
      message.error_msg = error.err_msg;
      this.messageService.message(message);
    } else {
      message.error_msg = Messages.MSG_ERROR_UPLOAD_DOCUMENT;
      this.messageService.message(message);
    }

  }

  closeErrorMessage() {
    this.isShowErrorMessage = true;
  }

  onCompanyDetailsSuccess(success: any) {
    //this.loaderService.stop();

    this.companyDetailsForm.reset();
    this._router.navigate([NavigationRoutes.APP_RECRUITER_DASHBOARD]);
  }

  onCompanyDetailsError(error: any) {
    // this.loaderService.stop();
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

}








