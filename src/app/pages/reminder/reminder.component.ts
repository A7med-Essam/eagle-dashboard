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
  }

  pagination: any;
  reminders: any;
  getAllReminderLeads(page = 1) {
    this._LeadsService.allReminderLeads(page).subscribe({
      next: (res) => {
        this.reminders = res.data.data;
        this.pagination = res.data;
      },
    });
  }

  loadPage(page: number) {
    this.getAllReminderLeads(page);
  }
}
