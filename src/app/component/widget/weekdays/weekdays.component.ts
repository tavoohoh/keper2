import {Component, OnInit} from '@angular/core';
import {DayModel} from '../../../_model/day.model';
import {WeekDayConst} from '../../../_constant/weekday.const';

@Component({
  selector: 'app-weekdays',
  templateUrl: './weekdays.component.html',
  styleUrls: ['./weekdays.component.scss'],
})
export class WeekdaysComponent implements OnInit {
  public weekdays: Array<DayModel>;

  constructor() { }

  ngOnInit(): void {
    this.weekdays = this.setWeek();
    console.log('this.weekdays', this.weekdays);
  }

  private setWeek(): Array<DayModel> {
    const today = new Date();

    const setDay = (date: Date | string, dayDifference: number, isSubtracting = false): DayModel => {
      const day = new Date(date);
      day.setDate(isSubtracting ? day.getDate() - dayDifference : day.getDate() + dayDifference);

      return {
        monthDay: day.getDate(),
        weekday: WeekDayConst[day.getDay()]
      };
    };

    return [
      setDay(today, 3, true),
      setDay(today, 2, true),
      setDay(today, 1, true),
      setDay(today, 0),
      setDay(today, 1),
      setDay(today, 2),
      setDay(today, 3)
    ];
  }

}
