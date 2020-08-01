import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
})
export class ItemCardComponent {
  @Input() public title: string;
  @Input() public content1: string;
  @Input() public content2: string;
  @Input() public isSmall: boolean;
  @Input() public hasOpts: boolean;
  @Output() private optionsEvent = new EventEmitter<void>(null);

  public onOption(): void {
    this.optionsEvent.emit();
  }
}
