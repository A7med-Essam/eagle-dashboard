import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { InsuranceAndPolicyService } from "app/shared/services/insurance-and-policy.service";
import { LeadsService } from "app/shared/services/leads.service";
import { SharedService } from "app/shared/services/shared.service";
import { ToasterService } from "app/shared/services/toaster.service";

@Component({
  selector: "operations-cmp",
  moduleId: module.id,
  templateUrl: "operations.component.html",
})
export class OperationsComponent implements OnInit {
  // leads: any[] = [];
  // AssignForm: FormGroup = new FormGroup({});
  // assignModal: boolean = false;
  // pagination: any;
  // @ViewChild("LeadsTable") LeadsTable: any;
  // insuranceCompanies: any;
  constructor() // private _LeadsService: LeadsService,
  // private _ToastrService: ToasterService,
  // private _SharedService: SharedService,
  // private _InsuranceAndPolicyService: InsuranceAndPolicyService,
  // private _FormBuilder: FormBuilder
  {}

  ngOnInit() {
    // this.getAllLeads();
    // this.getInsuranceCompanies();
    // this.setAssignForm();
  }

  // getAllLeads(page = 1) {
  //   this._LeadsService.getLeads(page).subscribe({
  //     next: (res) => {
  //       this.leads = res.data.data;
  //       this.pagination = res.data;
  //     },
  //     error: (err) => {
  //       this._ToastrService.setToaster(err.error.message, "error", "danger");
  //     },
  //   });
  // }

  // loadPage(page: number) {
  //   this.getAllLeads(page);
  // }

  // fadeInLeadsTable() {
  //   setTimeout(() => {
  //     this._SharedService.fadeIn(this.LeadsTable.nativeElement);
  //   }, 800);
  // }

  // fadeOutLeadsTable() {
  //   this._SharedService.fadeOut(this.LeadsTable.nativeElement);
  // }

  // getInsuranceCompanies() {
  //   this._InsuranceAndPolicyService.getInsuranceCompanies().subscribe({
  //     next: (res) => {
  //       this.insuranceCompanies = res.data;
  //       console.log(res);
  //     },
  //   });
  // }

  // assignLeads(insuranceInfo) {
  //   this._InsuranceAndPolicyService.assignLeads(insuranceInfo).subscribe({
  //     next: (res) => {
  //       this._ToastrService.setToaster(res.message, "success", "success");
  //       this.assignModal = false;
  //     },
  //     error: (err) =>
  //       this._ToastrService.setToaster(err.error.message, "error", "danger"),
  //   });
  // }

  // setAssignForm() {
  //   this.AssignForm = this._FormBuilder.group({
  //     InsuranceCompany: new FormControl(null),
  //     Policy: new FormControl(null),
  //     CarPrice: new FormControl(null),
  //   });
  // }
}
