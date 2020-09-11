import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ModalMethods} from '../../../_shared/modal.methods';
import {ModalService} from '../../../service/common/modal.service';
import {EntityModel} from '../../../_model';
import {ButtonTypeEnum, ModalEnum} from '../../../_enum';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent extends ModalMethods implements OnChanges {
  @Input() public entity: EntityModel;
  @Input() public showEdit = true;
  @Input() public showDelete = true;
  @Input() public optionTitle: string;
  @Input() public afterModalCloseOpen: ModalEnum;

  @Output() private clickDelete = new EventEmitter<EntityModel>();
  @Output() private clickEdit = new EventEmitter<EntityModel>();
  public buttonType = ButtonTypeEnum;

  constructor(
    public modalService: ModalService,
  ) {
    super(modalService, ModalEnum.OPTIONS);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.entity && changes.entity.currentValue) {
      this.entity = changes.entity.currentValue;
    }

    if (changes.showEdits && changes.showEdit.currentValue) {
      this.showEdit = changes.showEdit.currentValue;
    }

    if (changes.showDelete && changes.showDelete.currentValue) {
      this.showDelete = changes.showDelete.currentValue;
    }

    if (changes.optionTitle && changes.optionTitle.currentValue) {
      this.optionTitle = changes.optionTitle.currentValue;
    }

    if (changes.afterModalCloseOpen && changes.afterModalCloseOpen.currentValue) {
      this.afterModalCloseOpen = changes.afterModalCloseOpen.currentValue;
    }
  }

  public onDelete(): void {
    this.clickDelete.emit(this.entity);
  }

  public onEdit(): void {
    this.clickEdit.emit(this.entity);
  }

  public onModalClose(): void {
    this.modalService.currentModalValue = this.afterModalCloseOpen || null;
  }

}
