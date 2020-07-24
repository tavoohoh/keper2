import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ButtonTypeEnum } from '../../../_enum';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnChanges {
  @Input() public buttonType: ButtonTypeEnum;
  @Input() public buttonText: string;
  @Input() public buttonContext: any;
  @Output() private buttonClick: EventEmitter<any> = new EventEmitter(null);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.buttonType && changes.buttonType.currentValue) {
      this.buttonType = changes.buttonType.currentValue;
    }

    if (changes.buttonText && changes.buttonText.currentValue) {
      this.buttonText = changes.buttonText.currentValue;
    }

    if (changes.buttonContext && changes.buttonContext.currentValue) {
      this.buttonContext = changes.buttonContext.currentValue;
    }
  }

  public onButtonClick(): void {
    this.buttonClick.emit(this.buttonContext);
  }

}
