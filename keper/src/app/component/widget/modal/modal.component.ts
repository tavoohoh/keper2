import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnChanges, OnInit {
  @ViewChild('modalContainer') modalContainer: ElementRef;

  @Input() public title: string;
  @Input() public subtitle: string;
  @Input() public smallModal: boolean;
  @Input() public openModal: boolean;
  @Input() public disabledCancel: boolean;
  @Input() public disabledConfirm: boolean;
  @Input() public hideCancel: boolean;
  @Input() public hideConfirm: boolean;
  @Output() public modalClose = new EventEmitter<void>();
  @Output() public modalConfirm = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.openModal && changes.openModal.currentValue) {
      this.openModal = changes.openModal.currentValue;
    }
  }

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
