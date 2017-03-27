
import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {DashboardService} from "../../../framework/dashboard/dashboard.service";
import {Http} from "@angular/http";
import {JobLocation} from "../model/job-location";

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
  private countries:string[]=new Array(0);
  private  states:string[]=new Array(0);
  private cities:string[]=new Array(0);



  constructor(private _router:Router,private http: Http, private dashboardService:DashboardService) {
  }


  ngOnInit(){

    this.http.get("address")
      .map((res: Response) => res.json())
      .subscribe(
        data => {
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

  selectCountryModel(newval:any) {

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
    this.jobLocationtion.country=this.storedcountry;
  }
  selectStateModel(newval:any) {
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
    this.jobLocationtion.state=this.storedstate;
  }



  selectCityModel(newval : string){
    this.storedcity=newval;
    this.jobLocationtion.city=this.storedcity;
  }


  isPinSelected(value:any){
    this.jobLocationtion.pin=this.pin;

  }

}
