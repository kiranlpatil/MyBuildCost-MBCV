import {Component, Input} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'cn-additional-details',
  templateUrl: 'additional-details.component.html',
  styleUrls: ['additional-details.component.css']
})

export class AdditionalDetailsComponent {
  @Input() data: string = '';
}
