import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CarService } from "app/shared/services/car.service";
import { InsuranceAndPolicyService } from "app/shared/services/insurance-and-policy.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "Insurance-cmp",
  moduleId: module.id,
  templateUrl: "Insurance.component.html",
  providers: [ConfirmationService],
})
export class InsuranceComponent {
  insuranceCompanies: any[] = [];
  policies: any[] = [];
  selectedPolicy: any;
  currentInsuranceCompany: any;

  constructor(
    private _ToastrService: ToasterService,
    private _FormBuilder: FormBuilder,
    private _ConfirmationService: ConfirmationService,
    private _InsuranceAndPolicyService: InsuranceAndPolicyService
  ) {}
  insuranceModal: boolean = false;
  policyModal: boolean = false;
  editInsuranceModal: boolean = false;
  addInsuranceModal: boolean = false;
  insuranceCompanyForm: FormGroup = new FormGroup({});

  ngOnInit() {
    this.getInsuranceCompanies();
    this.getPolcies();
    this.setInsuranceCompanyForm();
    this.getClientInsuranceCompany();
  }

  setInsuranceCompanyForm(company?: any) {
    this.insuranceCompanyForm = this._FormBuilder.group({
      name: new FormControl(company?.name),
      mobile: new FormControl(company?.mobile),
      responsible_name: new FormControl(company?.responsible_name),
      email: new FormControl(company?.email),
      details: new FormControl(company?.details),
    });
  }

  // Show
  getInsuranceCompanies() {
    this._InsuranceAndPolicyService.getInsuranceCompanies().subscribe({
      next: (res) => (this.insuranceCompanies = res.data),
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // Delete
  deleteInsurance(id: number) {
    // this._CarService.deleteInsurance(id).subscribe({
    //   next: (res) => {
    //     this.getInsurance();
    //     this._ToastrService.setToaster(res.message, "success", "success");
    //   },
    //   error: (err) =>
    //     this._ToastrService.setToaster(err.error.message, "error", "danger"),
    // });
  }

  // Create
  addInsurance(status: HTMLInputElement) {
    // this._CarService.createInsurance(status.value).subscribe({
    //   next: (res) => {
    //     this.getInsurance();
    //     this._ToastrService.setToaster(res.message, "success", "success");
    //     this.insuranceModal = false;
    //     status.value = "";
    //   },
    //   error: (err) =>
    //     this._ToastrService.setToaster(err.error.message, "error", "danger"),
    // });
  }

  // Confirmation
  deleteInsuranceConfirm(id: any) {
    // this._ConfirmationService.confirm({
    //   message: "Are you sure that you want to perform this action?",
    //   accept: () => {
    //     this.deleteInsurance(id);
    //   },
    // });
  }

  openAddPolicyModal(insuranceCompany) {
    this.currentInsuranceCompany = insuranceCompany;
    this.policyModal = true;
  }

  getPolcies() {
    this._InsuranceAndPolicyService.getPolicies().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.policies.push({ name: e.type, value: e.id });
        });
      },
    });
  }

  addPolicyToInsuranceCompany(policy) {
    this._InsuranceAndPolicyService
      .addPolicyToInsuranceCompany({
        policy_id: policy.value,
        insurance_company_id: this.currentInsuranceCompany.id,
      })
      .subscribe({
        next: (res) => {
          this._ToastrService.setToaster(res.message, "success", "success");
          this.policyModal = false;
        },
        error: (err) =>
          this._ToastrService.setToaster(err.error.message, "error", "danger"),
      });
  }

  openUpdatePolicyModal(insuranceCompany) {
    this.currentInsuranceCompany = insuranceCompany;
    this.editInsuranceModal = true;
    this.setInsuranceCompanyForm(insuranceCompany);
  }

  addInsuranceCompany(insuranceCompany) {
    this._InsuranceAndPolicyService
      .addInsuranceCompanies(insuranceCompany.value)
      .subscribe({
        next: (res) => {
          if (res.status == 1) {
            this._ToastrService.setToaster(res.message, "success", "success");
            this.addInsuranceModal = false;
            this.getInsuranceCompanies();
          } else {
            this._ToastrService.setToaster(res.message, "error", "danger");
          }
        },
        error: (err) => {
          this._ToastrService.setToaster(err.error.message, "error", "danger");
        },
      });
  }

  editInsuranceCompany(insuranceCompanyForm) {
    this.insuranceCompanyForm.addControl(
      "insurance_id",
      new FormControl(this.currentInsuranceCompany.id, [Validators.required])
    );
    this._InsuranceAndPolicyService
      .editInsuranceCompanies(insuranceCompanyForm.value)
      .subscribe({
        next: (res) => {
          this._ToastrService.setToaster(res.message, "success", "success");
          this.editInsuranceModal = false;
          this.getInsuranceCompanies();
        },
        error: (err) => {
          this._ToastrService.setToaster(err.error.message, "error", "danger");
        },
      });
  }

  clientInsuranceCompany: any[] = [];
  getClientInsuranceCompany() {
    this._InsuranceAndPolicyService.getClientInsuranceCompany().subscribe({
      next: (res) => {
        this.clientInsuranceCompany = res.data;
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }
}
