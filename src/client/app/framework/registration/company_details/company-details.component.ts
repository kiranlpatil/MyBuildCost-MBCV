/**
 * Created by techprimelab on 3/9/2017.
 */
import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {CompanyDetailsService} from "./company-details.service";
import {CompanyDetails} from "./company-details";
import {Employer} from "./../employer/employer";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Message,
  MessageService,
  ProfileService,
  CommonService,
  Messages,
  AppSettings
} from "../../shared/index";
import {ImagePath, LocalStorage} from "../../shared/constants";
import {LocalStorageService} from "../../shared/localstorage.service";
import {LoaderService} from "../../shared/loader/loader.service";
import {Http} from "@angular/http";

@Component({
  moduleId: module.id,
  selector: 'cn-CompanyDetails',
  templateUrl: 'company-details.component.html',
  styleUrls: ['company-details.component.css'],
})

export class CompanyDetailsComponent {
  model = new CompanyDetails();
  model1 = new Employer();
  companyDetailsForm: FormGroup;
  company_name: any;
  filesToUpload: Array<File>;
  setOfDocuments:string[]=new Array();
  image_path: any;
  error_msg: string;
  isShowErrorMessage: boolean = true;
  BODY_BACKGROUND: string;
  submitted = false;


  constructor(private commanService: CommonService, private _router: Router, private http: Http,
              private companyDetailsService: CompanyDetailsService,private profileService: ProfileService,
              private messageService: MessageService, private formBuilder: FormBuilder, private loaderService: LoaderService) {

    this.companyDetailsForm = this.formBuilder.group({
      'description1': [''],
      'description2': [''],
      'description3': [''],
      'setOfDocuments':['']
    });

    //this.filesToUpload = [];
    if (this.image_path === undefined) {
      debugger
      this.image_path = ImagePath.PROFILE_IMG_ICON;
    }

    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
  }

  ngOnInit() {
    //this.model1.company_name = LocalStorageService.getLocalValue(LocalStorage.COMPANY_NAME);
    this.model1.company_size = LocalStorageService.getLocalValue(LocalStorage.COMPANY_SIZE);
    this.company_name = LocalStorageService.getLocalValue(LocalStorage.EMAIL_ID);
  }


  onSubmit() {
    debugger
    this.submitted = true;
    this.model = this.companyDetailsForm.value;
    this.model.setOfDocuments = this.setOfDocuments;
    console.log("files to upload in comnydtl", this.filesToUpload);

    this.companyDetailsService.companyDetails(this.model)
      .subscribe(
        success => this.onCompanyDetailsSuccess(success),
        error => this.onCompanyDetailsError(error));
  }


  goBack() {
    this.commanService.goBack();
    this._router.navigate(['/']);
  }

  fileChangeEvent(fileInput: any) {
    debugger
      this.filesToUpload = <Array<File>> fileInput.target.files;

    console.log("path of files to upload:", this.filesToUpload);
    this.companyDetailsService.makeDocumentUplaod(this.filesToUpload, []).then((result: any) => {
      if (result !== null) {
        //this.model.document1 = result.data.document;
        this.setOfDocuments.push(result.data.document) ;
        this.fileChangeSucess(result);
      }
    }, (error:any) => {
      this.fileChangeFail("Error in document uploading", error);
    });

  }
  fileChangeEvent2(fileInput: any) {
    debugger
      this.filesToUpload = <Array<File>> fileInput.target.files;

    console.log("path of files to upload:", this.filesToUpload);
    this.companyDetailsService.makeDocumentUplaod(this.filesToUpload, []).then((result: any) => {
      if (result !== null) {
        //this.model.document1 = result.data.document;
        this.setOfDocuments.push(result.data.document) ;
        this.fileChangeSucess(result);
      }
    }, (error) => {
      this.fileChangeFail("Error in document uploading", error);
    });

  }
  fileChangeEvent3(fileInput: any) {
    debugger
      this.filesToUpload = <Array<File>> fileInput.target.files;

    console.log("path of files to upload:", this.filesToUpload);
    this.companyDetailsService.makeDocumentUplaod(this.filesToUpload, []).then((result: any) => {
      if (result !== null) {
        this.setOfDocuments.push(result.data.document) ;
        console.log("setOfDocuments is:",this.setOfDocuments);
        this.fileChangeSucess(result);
      }
    }, (error) => {
      this.fileChangeFail("Error in document uploading", error);
    });

  }

  fileChangeSucess(result: any) {
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
    message.custom_message = Messages.MSG_SUCCESS_DASHBOARD_PROFILE_PIC;
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
      message.error_msg = Messages.MSG_ERROR_DASHBOARD_PROFILE_PIC;
      this.messageService.message(message);
    }

  }

  closeErrorMessage() {
    this.isShowErrorMessage = true;
  }

}








