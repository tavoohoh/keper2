import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DayModel} from '../../../_model/day.model';
import {WeekDayConst} from '../../../_constant/weekday.const';

@Component({
  selector: 'app-weekdays',
  templateUrl: './weekdays.component.html',
  styleUrls: ['./weekdays.component.scss'],
})
export class WeekdaysComponent implements OnInit {
  public weekdays: Array<DayModel>;
  public selectedDay: DayModel;
  @Output() private selectedDayEvent = new EventEmitter<DayModel>(null);

  constructor() { }

  ngOnInit(): void {
    this.weekdays = this.setWeek();
  }

  public onSelectDay($selectedDay: DayModel): void {
    this.selectedDay = $selectedDay;
    this.selectedDayEvent.emit($selectedDay);
  }

  private setWeek(): Array<DayModel> {
    const todayDate = new Date();

    const setDay = (date: Date | string, dayDifference: number, isSubtracting = false): DayModel => {
      const day = new Date(date);
      day.setDate(isSubtracting ? day.getDate() - dayDifference : day.getDate() + dayDifference);

      return {
        monthDay: day.getDate(),
        weekday: WeekDayConst[day.getDay()]
      };
    };

    const today = setDay(todayDate, 0);
    this.selectedDay = today;

    return [
      setDay(todayDate, 3, true),
      setDay(todayDate, 2, true),
      setDay(todayDate, 1, true),
      today,
      setDay(todayDate, 1),
      setDay(todayDate, 2),
      setDay(todayDate, 3)
    ];
  }

}
