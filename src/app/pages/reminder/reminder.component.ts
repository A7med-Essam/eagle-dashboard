import { Component, OnInit } from "@angular/core";
import { LeadsService } from "app/shared/services/leads.service";

@Component({
  selector: "app-reminder",
  templateUrl: "./reminder.component.html",
  styleUrls: ["./reminder.component.scss"],
})
export class ReminderComponent implements OnInit {
  constructor(private _LeadsService: LeadsService) {}

  ngOnInit(): void {
    this.getAllReminderLeads();
    // this.checkDailyLeads();
  }

  pagination: any;
  reminders: any;
  getAllReminderLeads(page = 1) {
    this._LeadsService.allReminderLeads(page).subscribe({
      next: (res) => {
        this.reminders = res.data.data;
        this.reminders.sort(function (x, y) {
          return Number(x.reminded) - Number(y.reminded);
        });
        this.pagination = res.data;
      },
    });
  }

  loadPage(page: number) {
    this.getAllReminderLeads(page);
  }

  // checkDailyLeads() {
  //   this._LeadsService.checkDailyLeads().subscribe({
  //     next(value) {
  //       console.log(value);
  //     },
  //   });
  // }

  updateReminderLeads(reminder) {
    if (!reminder.reminded) {
      reminder.reminded = true;
      this._LeadsService.addReminderLead(reminder).subscribe({
        next(res) {
          this._ToastrService.setToaster(res.message, "success", "success");
        },
      });
    }
  }
}
