import { Component, OnInit, ViewChild } from "@angular/core";
import { LeadsService } from "app/shared/services/leads.service";
import { SharedService } from "app/shared/services/shared.service";

@Component({
  selector: "app-contract-reminder",
  templateUrl: "./contract-reminder.component.html",
  styleUrls: ["./contract-reminder.component.scss"],
})
export class ContractReminderComponent implements OnInit {
  @ViewChild("Main") Main: any;
  @ViewChild("Show") Show: any;
  currentContract: any;
  reminders: any[] = [];

  constructor(
    private _LeadsService: LeadsService,
    private _SharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getContracts();
  }

  getContracts() {
    this._LeadsService.getContracts().subscribe({
      next: (res) => {
        this.collectContracts(res, "all_contracts_ends_today");
        this.collectContracts(res, "all_contracts_ends_tmw");
        this.collectContracts(res, "all_contracts_ends_after_two_today");
        this.collectContracts(res, "all_contracts_ends_after_three_today");
        this.collectContracts(res, "all_contracts_ends_after_four_today");
        this.collectContracts(res, "all_contracts_ends_after_five_today");
      },
    });
  }

  collectContracts(res: any, type: string) {
    res.data[type].contracts.forEach((contract) => {
      this.reminders.push(contract);
    });
  }

  getById(id: any) {
    this.displayDetails();
    [this.currentContract] = this.reminders.filter(
      (contract) => contract.id == id
    );
  }

  backDetailsBtn() {
    this._SharedService.fadeOut(this.Show.nativeElement);
    this.fadeInTable();
  }

  fadeInTable() {
    setTimeout(() => {
      this._SharedService.fadeIn(this.Main.nativeElement);
    }, 800);
  }

  displayDetails() {
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Show.nativeElement);
    }, 800);
  }
}
