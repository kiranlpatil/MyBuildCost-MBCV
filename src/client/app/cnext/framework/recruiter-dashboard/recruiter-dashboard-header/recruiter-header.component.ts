import {Component, OnInit, Input} from "@angular/core";
import {Router} from "@angular/router";
import {LocalStorageService} from "../../../../framework/shared/localstorage.service";
import {NavigationRoutes, AppSettings, LocalStorage, ImagePath} from "../../../../framework/shared/constants";
import {CandidateInCartService} from "../../candidate-in-cart.service";
import {CandidateNumberDifferentList} from "../job-lister/candidate-diff-list";

@Component({
  moduleId: module.id,
  selector: 'cn-recruiter-header',
  templateUrl: 'recruiter-header.component.html',
  styleUrls: ['recruiter-header.component.css'],
})

export class RecruiterHeaderComponent implements OnInit {
  @Input() jobCount: any;
  @Input() companyName: any;
  private candidatesInList: CandidateNumberDifferentList=new CandidateNumberDifferentList();
  company_name: string;
  uploaded_image_path: string;

  constructor(private _router: Router,
              private candidateInCartService : CandidateInCartService) {
    candidateInCartService.showCandidateCart$.subscribe(
      candidates=>{
        this.candidatesInList =candidates;
      }
    );

  }

  ngOnInit() {

    this.company_name = LocalStorageService.getLocalValue(LocalStorage.COMPANY_NAME);
    this.uploaded_image_path = LocalStorageService.getLocalValue(LocalStorage.PROFILE_PICTURE); //TODO:Get it from get user call.

    if (this.uploaded_image_path === "undefined" || this.uploaded_image_path === null) {
      this.uploaded_image_path = ImagePath.PROFILE_IMG_ICON;
    } else {
      this.uploaded_image_path = this.uploaded_image_path.substring(4, this.uploaded_image_path.length - 1).replace('"', '');
      this.uploaded_image_path = AppSettings.IP + this.uploaded_image_path;
    }
  }

  logOut() {
    window.localStorage.clear();
    this._router.navigate([NavigationRoutes.APP_START]);
  }
}

