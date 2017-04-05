
import { Component } from '@angular/core';
import { JobLocation } from '../model/job-location';
import { JobLocationService } from './job-location.service';
import { Message } from '../../../framework/shared/message';
import { MessageService } from '../../../framework/shared/message.service';
import { myJobLocationService } from '../myjob-location.service';

@Component({
  moduleId: module.id,
  selector: 'cn-job-location',
  templateUrl: 'job-location.component.html',
  styleUrls: ['job-location.component.css']
})

export class JobLocationComponent {
  private jobLocationtion = new JobLocation();
  private storedcountry:string;
  private storedstate:string;
  private storedcity:string;
  private pin:number;
  private locationDetails : any;
  private countries:string[]=new Array();
  private  states:string[]=new Array();
  private cities:string[]=new Array();



  constructor(
              private joblocationService:JobLocationService,
              private myjoblocationService:myJobLocationService,
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
      console.log(data.address[0].country);
    }
  }

  selectCountryModel(country:any) {

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
    this.jobLocationtion.country=this.storedcountry;
  }
  selectStateModel(selectedstate:any) {
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
    this.jobLocationtion.state=this.storedstate;
  }



  selectCityModel(city : string) {
    this.storedcity=city;
    this.jobLocationtion.city=city;
  }


  isPinSelected(pin:any) {
    this.jobLocationtion.pin=pin;
    this.myjoblocationService.change(this.jobLocationtion);

  }
  onError(error:any) {
    var message = new Message();
    message.error_msg = error.err_msg;
    message.isError = true;
    this.messageService.message(message);
  }


}
