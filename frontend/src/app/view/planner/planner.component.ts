import {Component, Input} from '@angular/core';

@Component({
  selector: 'planner-comp',
  standalone: true,
  imports: [
  ],
  templateUrl: `./planner.component.html`,
  styleUrl: `./planner.component.scss`
})

export class PlannerComponent {
  @Input() name = '';
  shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

startOfWeek(date: Date) {
  // Calculate the difference between the date's day of the month and its day of the week
  var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);

  // Set the date to the start of the week by setting it to the calculated difference
  return new Date(date.setDate(diff));
}

curr_day = new Date();

endOfWeek() {
    let month = this.curr_day.getMonth() + 1;
    const monthStr = this.shortMonths[month - 1];
    const dayNum = this.startOfWeek(this.curr_day).getDate() + 6;
    const year = this.curr_day.getFullYear();
    return `Sun ${monthStr} ${dayNum} ${year}`;
  }
}