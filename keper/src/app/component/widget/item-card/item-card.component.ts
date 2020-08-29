import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CardDesignEnum} from '../../../_enum/card-design.enum';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
})
export class ItemCardComponent {
  @Input() public title: string;
  @Input() public content1: string;
  @Input() public content2: string;
  @Input() public fullSchedule: { days: Array<string>, time: Array<string> };
  @Input() public isSmall: boolean;
  @Input() public hasOpts: boolean;
  @Input() public isAddButton: boolean;
  @Input() public isSingle: boolean;
  @Input() public isClickable: boolean;
  @Input() public cardDesign: CardDesignEnum;
  @Output() private optionsEvent = new EventEmitter<void>(null);
  @Output() private clickedEvent = new EventEmitter<void>(null);

  public onOption(): void {
    if (!this.isClickable) {
      this.optionsEvent.emit();
    }
  }

  public onClicked(): void {
    if (this.isClickable) {
      this.clickedEvent.emit();
    }
  }
}
