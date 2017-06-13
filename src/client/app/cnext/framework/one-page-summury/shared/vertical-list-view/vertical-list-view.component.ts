import {Component, Input} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'cn-vertical-list-view',
  templateUrl: 'vertical-list-view.component.html',
  styleUrls: ['vertical-list-view.component.css']
})

export class VericalListViewComponent {

  @Input() data: any;
  @Input() type: string = '';
  private readMore: boolean[] = new Array();
  private isReadMore: boolean[] = new Array();

  /*ngOnChanges() {
   if (data!= undefined) {
   if (data.remark) {

   }
   }
   }*/

}
