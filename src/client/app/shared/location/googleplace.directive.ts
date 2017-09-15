import {Directive, ElementRef, EventEmitter, Output} from "@angular/core";
import {NgModel} from "@angular/forms";
import {MyGoogleAddress} from "../models/my-google-address";

declare var google: any;

@Directive({
  selector: '[mygoogleplace]',
  providers: [NgModel],
  host: {
    '(input)': 'onInputChange()'
  }
})
export class MyGoogleDirective {
  @Output() setAddress: EventEmitter<MyGoogleAddress> = new EventEmitter();
  address: MyGoogleAddress = new MyGoogleAddress();
  modelValue: any;
  autocomplete: any;
  private place: any;
  private _el: HTMLElement;


  constructor(el: ElementRef, private model: NgModel) {
    this._el = el.nativeElement;
    this.modelValue = this.model;
    var input = this._el;
    var options = {
      types: ['(cities)'],
      componentRestrictions: {country: 'in'}
    };
    this.autocomplete = new google.maps.places.Autocomplete(input, options);
    google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
      this.place = this.autocomplete.getPlace();
      this.invokeEvent(this.place);
    });
  }


  private find(address_components: any[], query: string, val: string = null) {

    for (let attr of address_components) {
      for (let type of attr.types) {
        if (type === query) {
          return val ? attr[val] : attr;
        }
      }
    }
    return null;
  }

  findCity(address_components: any[]) {
    return this.find(address_components, 'locality', 'long_name');
  }

  findState(address_components: any[]) {
    return this.find(address_components, 'administrative_area_level_1', 'long_name');
  }

  findCountry(address_components: any[]) {
    return this.find(address_components, 'country', 'long_name');
  }


  invokeEvent(place: Object) {
    let city = this.findCity(this.place.address_components);
    let state = this.findState(this.place.address_components);
    let country = this.findCountry(this.place.address_components);
    if (state === undefined) {
      state = city;
    }
    let myaddress: MyGoogleAddress = new MyGoogleAddress();
    myaddress.city = city;
    myaddress.state = state;
    myaddress.country = country;
    myaddress.formatted_address=this.place.formatted_address;
    this.setAddress.emit(myaddress);
  }


  onInputChange() {
  }
}
