import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @ViewChild('modalContainer') modalContainer: ElementRef;

  @Input() public smallModal: boolean;
  @Input() public openModal: boolean;
  @Input() public title: string;
  @Input() public disabledCancel: boolean;
  @Input() public disabledConfirm: boolean;
  @Output() public modalClose = new EventEmitter<void>();
  @Output() public modalConfirm = new EventEmitter<void>();

  ngOnInit(): void {
    // TODO: Add gesture to close the modal
    // const closeGesture = createGesture({
    //   el: this.modalContainer.nativeElement,
    //   threshold: 15,
    //   gestureName: 'close-modal-gesture',
    //   onMove: () => close()
    // });
  }

  public close(): void {
    this.modalClose.emit();
  }

  public confirm(): void {
    this.modalConfirm.emit();
  }

}
