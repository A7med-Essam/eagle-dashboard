import { Component, OnInit, ViewChild } from "@angular/core";
import { LeadsService } from "app/shared/services/leads.service";
import { SharedService } from "app/shared/services/shared.service";

@Component({
  selector: "app-reminder",
  templateUrl: "./reminder.component.html",
  styleUrls: ["./reminder.component.scss"],
})
export class ReminderComponent implements OnInit {
  constructor(
    private _LeadsService: LeadsService,
    private _SharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getAllReminderLeads();
    // this.getAllLeads();
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

  // leads;

  // getAllLeads() {
  //   this._LeadsService.getLeadsWithoutPaginate().subscribe({
  //     next: (res) => {
  //       this.leads = res.data;
  //       console.log(this.leads);
  //     },
  //   });
  // }
  currentLead;
  getLeadById(id: any) {
    this.displayLeadDetails();
    this._LeadsService.getLeadsById(id).subscribe({
      next: (res) => {
        this.currentLead = res.data;
        console.log(this.currentLead);
      },
    });
  }

  backDetailsBtn() {
    this._SharedService.fadeOut(this.Show.nativeElement);
    this.fadeInLeadsTable();
  }

  @ViewChild("Main") Main: any;
  @ViewChild("Show") Show: any;
  fadeInLeadsTable() {
    setTimeout(() => {
      this._SharedService.fadeIn(this.Main.nativeElement);
    }, 800);
  }
  displayLeadDetails() {
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Show.nativeElement);
    }, 800);
  }
}
