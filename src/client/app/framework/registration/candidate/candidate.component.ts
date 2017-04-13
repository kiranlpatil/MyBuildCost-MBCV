import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {CandidateService} from "./candidate.service";
import {Candidate} from "./candidate";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "../../shared/customvalidations/validation.service";
import {Message, MessageService, CommonService, NavigationRoutes, AppSettings} from "../../shared/index";
import {ImagePath, LocalStorage, ValueConstant} from "../../shared/constants";
import {LocalStorageService} from "../../shared/localstorage.service";
import {LoaderService} from "../../shared/loader/loader.service";
import {Http, Response} from "@angular/http";
import {DateService} from "../../../cnext/framework/date.service";

@Component({
  moduleId: module.id,
  selector: 'cn-candidate-registration',
  templateUrl: 'candidate.component.html',
  styleUrls: ['candidate.component.css'],
})

export class CandidateComponent implements OnInit {
  countries: string[] = new Array(0);
  states: string[] = new Array(0);
  cities: string[] = new Array(0);
  myPassword: string = '';
  private model = new Candidate();
  private storedcountry: string;
  private storedstate: string;
  private storedcity: string;
  private locationDetails: any;
  private isPasswordConfirm: boolean;
  private isFormSubmitted = false;
  private userForm: FormGroup;
  private error_msg: string;
  private isShowErrorMessage: boolean = true;
  private BODY_BACKGROUND: string;
  private passingyear: string;
  private isShowMessage: boolean = false;
  private isStateSelected: boolean = false;
  private isCountrySelected: boolean = false;
  private validBirthYearList = new Array();
  private year: any;
  private currentDate: any;


  constructor(private commanService: CommonService, private _router: Router, private http: Http, private dateservice: DateService,
              private candidateService: CandidateService, private messageService: MessageService, private formBuilder: FormBuilder, private loaderService: LoaderService) {

    this.userForm = this.formBuilder.group({
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'mobile_number': ['', [Validators.required, ValidationService.mobileNumberValidator]],
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'password': ['', [Validators.required, ValidationService.passwordValidator]],
      'conform_password': ['', Validators.required],
      'birth_year': ['', [Validators.required, ValidationService.birthYearValidator]],
      'location': [
        {
          'country': ['', Validators.required],
          'state': ['', Validators.required],
          'city': ['', Validators.required],
          'pin': ['']
        }
        , Validators.required],
      'pin': ['', [Validators.required, ValidationService.pinValidator]],
      'captcha': ['', Validators.required]
    });


    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
    this.currentDate = new Date();
    this.year = this.currentDate.getUTCFullYear() - 18;
  }

  ngOnInit() {
    this.validBirthYearList = this.dateservice.createBirthYearList(this.year);
    this.http.get('address')
      .map((res: Response) => res.json())
      .subscribe(
        data => {
          this.locationDetails = data.address;
          for (var i = 0; i < data.address.length; i++) {
            this.countries.push(data.address[i].country);
            console.log(data.address[0].country);

          }
        },
        err => console.error(err),
        () => console.log()
      );

  }


  selectYearModel(newval: any) {
    this.passingyear = newval;
    this.model.birth_year = newval;
  }

  selectCountryModel(newval: string) {
    for (let item of this.locationDetails) {
      if (item.country === newval) {
        let tempStates: string[] = new Array(0);
        for (let state of item.states) {
          tempStates.push(state.name);
        }
        this.states = tempStates;
      }
    }
    this.storedcountry = newval;
    this.isCountrySelected = false;
  }

  selectStateModel(newval: string) {

    for (let item of this.locationDetails) {
      if (item.country === this.storedcountry) {
        for (let state of item.states) {
          if (state.name === newval) {
            let tempCities: string[] = new Array(0);
            for (let city of state.cities) {
              tempCities.push(city);
            }
            this.cities = tempCities;
          }
        }
      }
    }
    this.storedstate = newval;
    this.isStateSelected = false;
  }

  selectCityModel(newval: string) {

    this.storedcity = newval;
    console.log("city is", newval);
    console.log("storedcity city is", this.storedcity);
  }

  onSubmit() {

    this.model = this.userForm.value;
    this.model.current_theme = AppSettings.LIGHT_THEM;
    this.model.isCandidate = true;
    this.model.location.country = this.storedcountry;
    this.model.location.state = this.storedstate;
    this.model.location.city = this.storedcity;
    this.model.location.pin = this.model.pin;

    if (!this.makePasswordConfirm()) {

      this.isFormSubmitted = true;
      // this.loaderService.start();
      this.candidateService.addCandidate(this.model)
        .subscribe(
          candidate => this.onRegistrationSuccess(candidate),
          error => this.onRegistrationError(error));
    }
  }

  onRegistrationSuccess(candidate: any) {
    LocalStorageService.setLocalValue(LocalStorage.USER_ID, candidate.data._id);
    LocalStorageService.setLocalValue(LocalStorage.EMAIL_ID, this.userForm.value.email);
    LocalStorageService.setLocalValue(LocalStorage.MOBILE_NUMBER, this.userForm.value.mobile_number);
    LocalStorageService.setLocalValue(LocalStorage.CHANGE_MAIL_VALUE, 'from_registration');
    LocalStorageService.setLocalValue(LocalStorage.FROM_CANDIDATE_REGISTRATION, 'true');

    // this.userForm.reset();
    this._router.navigate([NavigationRoutes.VERIFY_USER]);
  }

  onRegistrationError(error: any) {
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

  showMessage() {
    // this.isShowMessage =true;
    this.isShowMessage = false;
  }

  selectStateMessage() {

    if (this.storedstate) {
      console.log("stord state is:", this.storedstate);
    } else {
      this.isStateSelected = true;

    }
  }

  selectCountryMessage() {

    if (this.storedcountry) {
      console.log("stord state is:", this.storedcountry);
    } else {
      this.isCountrySelected = true;

    }
  }

  goBack() {
    this.commanService.goBack();
    this._router.navigate(['/']);
  }

  makePasswordConfirm(): boolean {
    if (this.model.conform_password !== this.model.password) {
      this.isPasswordConfirm = true;
      return true;
    } else {
      this.isPasswordConfirm = false;
      return false;
    }
  }

  closeErrorMessage() {
    this.isShowErrorMessage = true;
  }


  selectPassword(newval: any) {
    if (this.myPassword.match(/(?=.*\d)(?=.*[a-z])(?=.*[$@_#!%*?&])(?=.*[A-Z]).{8,}/)) {
      this.isShowMessage = false;
    }
  }

}
