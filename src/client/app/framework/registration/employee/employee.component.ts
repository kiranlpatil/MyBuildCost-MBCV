/**
 * Created by techprimelab on 3/9/2017.
 */
import {  Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from './employee.service';
import { Employee } from './employee';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../shared/customvalidations/validation.service';
import {
  Message,
  MessageService,
  CommonService,
  NavigationRoutes,
  AppSettings
} from '../../shared/index';
import { ImagePath, LocalStorage, ProjectAsset } from '../../shared/constants';
import { LocalStorageService } from '../../shared/localstorage.service';
import {LoaderService} from "../../shared/loader/loader.service";
import {Http,Response} from "@angular/http";
import {Location} from "../location";

@Component({
  moduleId: module.id,
  selector: 'cn-EmployeeRegistration',
  templateUrl: 'employee.component.html',
  styleUrls: ['employee.component.css'],
})

export class EmployeeComponent {
  model = new Employee();
  storedcountry:string;
  storedstate:string;
  storedcity:string;
  locationDetails : any;

  countries:string[]=new Array(0);
  states:string[]=new Array(0);
  cities:string[]=new Array(0);
  countryModel:string;
  stateModel:string;
  cityModel:string;
  isPasswordConfirm: boolean;
  isFormSubmitted = false;
  userForm: FormGroup;
  error_msg: string;
  isShowErrorMessage: boolean = true;
  BODY_BACKGROUND:string;


  constructor(private commanService: CommonService, private _router: Router,private http: Http,
              private employeeService: EmployeeService, private messageService: MessageService, private formBuilder: FormBuilder,private loaderService:LoaderService) {

    this.userForm = this.formBuilder.group({
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'mobile_number': ['', [Validators.required, ValidationService.mobileNumberValidator]],
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'password': ['', [Validators.required, Validators.minLength(8)]],
      'conform_password': ['', [Validators.required, Validators.minLength(8)]],
      'birth_year':['', [Validators.required,ValidationService.birthYearValidator]],
      'country':[''],
      'state':[''],
      'city':[''],
      'pin':['',  [Validators.required,ValidationService.pinValidator]]
    });

    this.BODY_BACKGROUND = ImagePath.BODY_BACKGROUND;
  }

  ngOnInit()
  {

      this.http.get("address")
        .map((res: Response) => res.json())
        .subscribe(
          data => {debugger
            this.locationDetails=data.address;
            for(var  i = 0; i <data.address.length; i++){
              this.countries.push(data.address[i].country);
             console.log(data.address[0].country);

            }
          },
          err => console.error(err),
          () => console.log()
        );



  }
  selectCountryModel(newval:any) {debugger
    for(let item of this.locationDetails){
      if(item.country===newval){
          let tempStates: string[]= new Array(0);
          for(let state of item.states){
            tempStates.push(state.name);
          }
        this.states=tempStates;
      }
    }
    this.storedcountry=newval;
  }
  selectStateModel(newval:any) {debugger
    for(let item of this.locationDetails){
      if(item.country===this.storedcountry){
        for(let state of item.states){
          if(state.name===newval){
            let tempCities: string[]= new Array(0);
            for(let city of state.cities) {
              tempCities.push(city);
            }
            this.cities=tempCities;
          }
        }
      }
    }
    this.storedstate=newval;
  }



  selectCityModel(newval : string){
    this.storedcity=newval;

  }





  onSubmit() {debugger
    this.model = this.userForm.value;
    this.model.current_theme = AppSettings.LIGHT_THEM;
    this.model.isCandidate =true;
    if (!this.makePasswordConfirm()) {
      this.isFormSubmitted = true;
      // this.loaderService.start();
      this.employeeService.addEmployee(this.model)
        .subscribe(
          user => this.onRegistrationSuccess(user),
          error => this.onRegistrationError(error));
    }
  }

  onRegistrationSuccess(user: any) {
    //this.loaderService.stop();
    LocalStorageService.setLocalValue(LocalStorage.USER_ID, user.data._id);
    LocalStorageService.setLocalValue(LocalStorage.EMAIL_ID, user.data.email);
    LocalStorageService.setLocalValue(LocalStorage.MOBILE_NUMBER, user.data.mobile_number);
    LocalStorageService.setLocalValue(LocalStorage.CHANGE_MAIL_VALUE, 'from_registration');
    this.userForm.reset();
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

}
