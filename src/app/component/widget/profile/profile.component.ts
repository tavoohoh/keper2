import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @Input() public show: boolean;
  @Output() private closeProfile = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}

  public close(): void {
    this.closeProfile.emit();
  }
}
