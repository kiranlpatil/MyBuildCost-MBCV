import {Component, Input} from "@angular/core";
import {Messages} from "../../../../../shared/constants";

@Component({
  moduleId: module.id,
  selector: 'cn-vertical-list-view',
  templateUrl: 'vertical-list-view.component.html',
  styleUrls: ['vertical-list-view.component.css']
})

export class VericalListViewComponent {

  @Input() data: any;
  @Input() type: string = '';
  @Input() calledFrom: string = '';
   readMore: boolean[] = new Array();
  isReadMore: boolean[] = new Array();

  getMessages() {
    return Messages;
  }
}
