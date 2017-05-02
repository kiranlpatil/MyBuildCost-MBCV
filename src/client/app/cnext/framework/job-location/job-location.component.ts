
import {Component, OnInit, Output,EventEmitter,Input} from '@angular/core';
import { JobLocation } from '../model/job-location';
import { JobLocationService } from './job-location.service';
import { Message } from '../../../framework/shared/message';
import { MessageService } from '../../../framework/shared/message.service';
import { MyJobLocationService } from '../myjob-location.service';

@Component({
  moduleId: module.id,
  selector: 'cn-job-location',
  templateUrl: 'job-location.component.html',
  styleUrls: ['job-location.component.css']
})

export class JobLocationComponent implements OnInit {
  @Output() selectJobLocation=new EventEmitter();
   
  pin:string;
  @Input() jobLocation = new JobLocation();
  private storedcountry:string;
  private storedstate:string;
  private storedcity:string;
  private locationDetails : any;
  private countries:string[]=new Array();
  private  states:string[]=new Array();
  private cities:string[]=new Array();
  private isStateSelected: boolean = false;
  private isCountrySelected: boolean = false;

  constructor(private joblocationService:JobLocationService,
              private messageService: MessageService
               ) {
  }


  ngOnInit() {
    this.joblocationService.getAddress()
      .subscribe(
        data=> { this.onAddressSuccess(data);},
        error => { this.onError(error);});
  }
  onAddressSuccess(data:any) {
    this.locationDetails=data.address;
    for(var  i = 0; i <data.address.length; i++) {
      this.countries.push(data.address[i].country);
    }
  }

  selectCountryModel(country:any) {
    this.states = new Array();
    this.cities = new Array();
    for(let item of this.locationDetails) {
      if(item.country===country) {
        let tempStates: string[]= new Array(0);
        for(let state of item.states) {
          tempStates.push(state.name);
        }
        this.states=tempStates;
      }
    }
    this.storedcountry=country;
    this.isCountrySelected = false;
    this.jobLocation.country=this.storedcountry;
    let tempState: any = document.getElementById("statesAll");
    let tempCity: any = document.getElementById("citiesAll");
    tempState.value = '';
    tempCity.value = '';
  }
  selectStateModel(selectedstate:any) {
    this.cities = new Array();
    for(let item of this.locationDetails) {
      if(item.country===this.storedcountry) {
        for(let state of item.states) {
          if(state.name===selectedstate) {
            let tempCities: string[]= new Array();
            for(let city of state.cities) {
              tempCities.push(city);
            }
            this.cities=tempCities;
          }
        }
      }
    }
    this.storedstate=selectedstate;
    this.isStateSelected = false;
    this.jobLocation.state=this.storedstate;
    let tempCity: any = document.getElementById("citiesAll");
    tempCity.value = '';
  }



  selectCityModel(city : string) {
    this.storedcity=city;
    this.jobLocation.cityName=city;
    this.selectJobLocation.emit(this.jobLocation);
  }
  isPinSelected(pin:any) {
    this.jobLocation.pin=pin;
    this.selectJobLocation.emit(this.jobLocation);

  }

  selectStateMessage() {

    if (this.storedstate) {
      this.isStateSelected = false;
    } else {
      this.isStateSelected = true;

    }
  }

  selectCountryMessage() {

    if (this.storedcountry) {
      this.isCountrySelected = false;
    } else {
      this.isCountrySelected = true;

    }
  }

  onError(error:any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }
}
