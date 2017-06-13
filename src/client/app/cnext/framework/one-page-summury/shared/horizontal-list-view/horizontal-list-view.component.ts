import {Component, Input} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'cn-horizontal-list-view',
  templateUrl: 'horizontal-list-view.component.html',
  styleUrls: ['horizontal-list-view.component.css']
})

export class HorizontalListViewComponent {
  @Input() data: any;
}
