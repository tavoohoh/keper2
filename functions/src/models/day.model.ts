import {DayEnum} from '../enums/day.enum';

export interface DayModel {
  weekday: DayEnum;
  monthDay: number;
  fullDate?: string;
}
