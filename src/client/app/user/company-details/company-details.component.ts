import {Component, OnInit} from "@angular/core";
import {CompanyDetailsService} from "./company-details.service";
import {CompanyDetails} from "../../user/models/company-details";
import {FormBuilder, FormGroup} from "@angular/forms";
import {
  AppSettings,
  CommonService,
  Message,
  Messages,
  MessageService,
  NavigationRoutes,
  ProfileService
} from "../../shared/index";
import {ImagePath, LocalStorage, Tooltip} from "../../shared/constants";
import {LocalStorageService} from "../../shared/services/localstorage.service";
import {LoaderService} from "../../shared/loader/loaders.service";
import {Http} from "@angular/http";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ValidationService} from "../../shared/customvalidations/validation.service";

@Component({
  moduleId: module.id,
  selector: 'cn-company-details',
  templateUrl: 'company-details.component.html',
  styleUrls: ['company-details.component.css'],
})

export class CompanyDetailsComponent implements OnInit {
  company_name: any;
  companyDocumentMessage: string= Messages.MSG_COMPANY_DOCUMENTS;
  uploadFileMessage: string= Messages.MSG_UPLOAD_FILE;
  private model = new CompanyDetails();
  companyDetailsForm: FormGroup;
  private filesToUpload: Array<File>;
  setOfDocuments: string[] = new Array(3);
  private image_path: any;
  error_msg: string;
  isShowErrorMessage: boolean = true;
  private isDescriptionEntered: boolean = false;
  isDocumentUploaded: boolean = true;
  private BODY_BACKGROUND: string;
  private submitted = false;
  fileName1: string;
  fileName2: string;
  fileName3: string;
  private buttonId: string;
  submitStatus: boolean;
  isUploadedImages : boolean[] = [false,false,false];
  isLoaderImages : boolean[] = [true,true,true];
  tooltipMessage: string = '<ul><li>' +
    '<p>1. '+Tooltip.COMPANY_DETAILS_TOOLTIP+'</p></li></ul>';

  constructor(private commonService: CommonService, private _router: Router, private http: Http,
              private companyDetailsService: CompanyDetailsService, private profileService: ProfileService,
              private messageService: MessageService, private formBuilder: FormBuilder, private loaderService: LoaderService, private activatedRoute: ActivatedRoute) {
    this.companyDetailsForm = this.formBuilder.group({
      'about_company': ['', ValidationService.requireCompanyDescriptionValidator],
      'description1': ['', ValidationService.requireDescriptionValidator],
      'description2': ['', ValidationService.requireDescriptionValidator],
      'description3': ['', ValidationService.requireDescriptionValidator]
    });

    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
  }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      let access_token = params['access_token'];
      let id = params['_id'];
      let company_name = params['companyName'];
      this.company_name = company_name;

      LocalStorageService.setLocalValue(LocalStorage.ACCESS_TOKEN, access_token);
      LocalStorageService.setLocalValue(LocalStorage.USER_ID, id);
      LocalStorageService.setLocalValue(LocalStorage.COMPANY_NAME, company_name);
      this.companyDetailsService.activateAccount()
        .subscribe(
          res => (console.log("account activated")),
          error => (console.log("account not activated")));
    });

  }

  onSubmit() {
    if(!this.companyDetailsForm.valid){
      this.submitStatus = true;
      return;
    }
    if (this.setOfDocuments[0] === undefined || this.setOfDocuments[1] === undefined || this.setOfDocuments[2] === undefined) {
      this.isDocumentUploaded = true;
      this.submitStatus = true;
      return;
    } else {
      this.isDocumentUploaded = false;
      this.submitted = true;
      this.model = this.companyDetailsForm.value;
      this.model.setOfDocuments = this.setOfDocuments;
      this.companyDetailsService.companyDetails(this.model)
        .subscribe(
          success => this.onCompanyDetailsSuccess(success),
          error => this.onCompanyDetailsError(error));
    }
  }


  goBack() {
    this.commonService.goBack();
    this._router.navigate(['/']);
  }

  goToLanding() {
    this._router.navigate(['/signin']);
  }

  fileChangeEvent(fileInput: any) {
    this.buttonId = fileInput.target.id;

    this.filesToUpload = <Array<File>> fileInput.target.files;

    if (this.filesToUpload[0].size <= 5242880) {
      if (this.buttonId === 'file-upload1') {
        this.fileName1 = this.filesToUpload[0].name;
        this.isLoaderImages[0]=false;
        this.isUploadedImages[0]=false;
      } else if (this.buttonId === 'file-upload2') {
        this.fileName2 = this.filesToUpload[0].name;
        this.isUploadedImages[1]=false;
        this.isLoaderImages[1]=false;
      } else {
        this.fileName3 = this.filesToUpload[0].name;
        this.isUploadedImages[2]=false;
        this.isLoaderImages[2]=false;
      }
      /*this.dashboardService.makeDocumentUpload(this.filesToUpload, []).then((result: any) => {
        if (result !== null) {
          this.fileChangeSuccess(result);
        }
      }, (error: any) => {
        this.fileChangeFail(error);
      });*/
      this.companyDetailsService.makeDocumentUpload(this.filesToUpload, []).then((result: any) => {
        if (result !== null) {
          if (this.buttonId === 'file-upload1') {
            this.setOfDocuments[0] = result.data.document;
            this.isLoaderImages[0]=true;
            this.isUploadedImages[0]=true;
          } else if (this.buttonId === 'file-upload2') {
            this.isUploadedImages[1]=true;
            this.isLoaderImages[1]=true;
            this.setOfDocuments[1] = result.data.document;
          } else {
            this.isUploadedImages[2]=true;
            this.isLoaderImages[2]=true;
            this.setOfDocuments[2] = result.data.document;
          }
          this.fileChangeSuccess(result);
        }
      }, (error: any) => {
        this.fileChangeFail(error);
      });
    } else {
      var message = new Message();
      message.isError = true;
      message.error_msg = Messages.MSG_ERROR_DOCUMENT_SIZE;
      this.messageService.message(message);
     // this.isLoading = false;
    }
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
    message.custom_message = Messages.MSG_SUCCESS_ATTACH_DOCUMENT;
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
      message.error_msg = Messages.MSG_ERROR_ATTACH_DOCUMENT;
      this.messageService.message(message);
    }

  }

  onCompanyDetailsSuccess(success: any) {
    this.companyDetailsForm.reset();
    var message = new Message();
    message.isError = false;
    message.custom_message = Messages.MSG_SUCCESS_UPLOADED_DOCUMENT;
    this.messageService.message(message);
    localStorage.clear();
    this._router.navigate([NavigationRoutes.ACTIVATE_USER]);
  }

  onCompanyDetailsError(error: any) {
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








