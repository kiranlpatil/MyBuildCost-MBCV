import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from './admin.service';
import { LoaderService } from '../../../shared/loader/loaders.service';
import { API, AppSettings, ErrorInstance } from '../../../shared/index';
import { Messages, SessionStorage } from '../../../shared/constants';
import { ErrorService } from '../../../shared/services/error.service';
import { SessionStorageService } from '../../../shared/services/session.service';

@Component({
  moduleId: module.id,
  selector: 'mbc-admin',
  templateUrl: 'admin.component.html'
})
export class AdminComponent implements OnInit{

  displayLinks: boolean = false;
  isAdmin: boolean = false;

  constructor(private _router: Router, private adminService : AdminService, private loaderService: LoaderService,
              private errorService: ErrorService) {
  }

  ngOnInit() {
    let userId =  SessionStorageService.getSessionValue(SessionStorage.USER_ID);
    if( userId === AppSettings.SAMPLE_PROJECT_USER_ID) {
      this.isAdmin = true;
    }
  }

  createExcelFiles() {
    this.loaderService.start();
    this.adminService.createAllExcelFiles().subscribe(
      success => this.createAllExcelFilesSuccess(success),
      error => this.createAllExcelFilesFailure(error));
  }

  createAllExcelFilesSuccess(success: any) {
    this.loaderService.stop();
    if(success.status)
    this.displayLinks = true;
  }

  createAllExcelFilesFailure(error: any) {
    this.loaderService.stop();
    var errorInstance = new ErrorInstance();
    errorInstance.err_msg = Messages.EXPORT_FAILED;
    errorInstance.err_code = 404;
    this.errorService.onError(errorInstance);
  }

  goBack() {
    window.history.back();
  }
}
