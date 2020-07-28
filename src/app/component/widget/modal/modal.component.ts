import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() public smallModal: boolean;
  @Input() public openModal: boolean;
  @Input() public title: string;
  @Output() private modalClose = new EventEmitter<void>();
  @Output() private modalConfirm = new EventEmitter<void>();

  public close(): void {
    this.modalClose.emit();
  }

  public confirm(): void {
    this.modalConfirm.emit();
  }

}
