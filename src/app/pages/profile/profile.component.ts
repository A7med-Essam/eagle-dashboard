import { Component, OnInit } from "@angular/core";
import { ProfileService } from "app/shared/services/profile.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  constructor(private _ProfileService: ProfileService) {}
  contractModal: boolean = false;
  ngOnInit(): void {
    this.getCustomerProfile();
    this.getCustomerContracts();
  }

  contracts: any[] = [];
  getCustomerContracts() {
    this._ProfileService.getCustomerContracts().subscribe({
      next: (res) => {
        this.contracts = res.data;
      },
    });
  }

  updateCustomerProfile(user: HTMLInputElement) {
    if (user.value) {
      this._ProfileService.updateCustomerProfile(user.value).subscribe({
        next: (res) => {
          this.user = res.data;
        },
      });
    }
  }

  user;
  getCustomerProfile() {
    this._ProfileService.getCustomerProfile().subscribe({
      next: (res) => {
        this.user = res.data;
      },
    });
  }
}
