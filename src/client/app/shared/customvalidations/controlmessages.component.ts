import {Component, Input} from "@angular/core";
import {FormControl} from "@angular/forms";
import {ValidationService} from "./validation.service";

@Component({
  selector: 'cn-control-messages',
  template: `
    <div *ngIf='errorMessage !== null'>{{errorMessage}}</div>`
})
export class ControlMessagesComponent {
  @Input() control: FormControl;
  @Input() submitStatus: boolean;

  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
      if (this.control.errors.hasOwnProperty(propertyName) && this.submitStatus) {
        return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }

    return null;
  }
}
