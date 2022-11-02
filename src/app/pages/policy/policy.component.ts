import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { InsuranceAndPolicyService } from "app/shared/services/insurance-and-policy.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "policy-cmp",
  moduleId: module.id,
  templateUrl: "policy.component.html",
  providers: [ConfirmationService],
})
export class PolicyComponent implements OnInit {
  policies: any[] = [];
  currentPolicy: any;
  editPolicyModal: boolean = false;
  addPolicyModal: boolean = false;
  policyForm: FormGroup = new FormGroup({});

  constructor(
    private _ToastrService: ToasterService,
    private _FormBuilder: FormBuilder,
    private _ConfirmationService: ConfirmationService,
    private _InsuranceAndPolicyService: InsuranceAndPolicyService
  ) {}

  ngOnInit() {
    this.getPolicies();
    this.setPolicyForm();
  }

  getPolicies() {
    this._InsuranceAndPolicyService.getPolicies().subscribe({
      next: (res) => {
        this.policies = res.data;
      },
    });
  }

  setPolicyForm(policy?: any) {
    this.policyForm = this._FormBuilder.group({
      type: new FormControl(policy?.type),
      // price: new FormControl(policy?.price),
    });
  }

  // Delete
  deletePolicy(id: number) {
    this._InsuranceAndPolicyService.deletePolicy(id).subscribe({
      next: (res) => {
        // this.getPolicies();
        this.policies = this.policies.filter((data) => data.id != id);

        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // Confirmation
  deleteInsuranceConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deletePolicy(id);
      },
    });
  }

  openUpdatePolicyModal(Policy) {
    this.currentPolicy = Policy;
    this.editPolicyModal = true;
    this.setPolicyForm(Policy);
  }

  addPolicy(policy) {
    this._InsuranceAndPolicyService.addPolicy(policy.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this._ToastrService.setToaster(res.message, "success", "success");
          this.addPolicyModal = false;
          this.getPolicies();
        } else {
          this._ToastrService.setToaster(res.message, "error", "danger");
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  editPolicy(policy) {
    this.policyForm.addControl(
      "policy_id",
      new FormControl(this.currentPolicy.id, [Validators.required])
    );
    this._InsuranceAndPolicyService.updatePolicy(policy.value).subscribe({
      next: (res) => {
        this._ToastrService.setToaster(res.message, "success", "success");
        this.editPolicyModal = false;
        // this.getPolicies();
        this.policies.map((e) => {
          if (e.id == res.data.id) {
            Object.assign(e, res.data);
          }
        });
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }
}
