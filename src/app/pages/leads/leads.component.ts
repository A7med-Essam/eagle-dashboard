import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CarService } from "app/shared/services/car.service";
import { GuardService } from "app/shared/services/guard.service";
import { InsuranceAndPolicyService } from "app/shared/services/insurance-and-policy.service";
import { LeadsService } from "app/shared/services/leads.service";
import { SharedService } from "app/shared/services/shared.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { UsersService } from "app/shared/services/users.service";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "leads-cmp",
  moduleId: module.id,
  templateUrl: "leads.component.html",
  providers: [ConfirmationService],
})
export class LeadsComponent implements OnInit {
  pagination: any;
  leads: any[] = [];
  insurance: any[] = [];
  grade: any[] = [];
  gearType: any[] = [];
  carModel: any[] = [];
  carType: any[] = [];
  carName: any[] = [];
  carColor: any[] = [];
  allReplies: any[] = [];
  insuranceCompanies: any[] = [];
  policies: any[] = [];
  selectedGrade: any;
  selectedCarModel: any;
  selectedGearType: any;
  selectedInsurance: any;
  selectedInsuranceCompany: any;
  selectedPolicy: any;
  currentLead: any;
  currentEditRow: any;

  filterModal: boolean = false;
  addCarNameModal: boolean = false;
  addCarColorModal: boolean = false;
  addCarTypeModal: boolean = false;
  allRepliesModal: boolean = false;
  addReplayModal: boolean = false;
  clientInsuranceCompanyModal: boolean = false;
  assignModal: boolean = false;

  @ViewChild("LeadsTable") LeadsTable: any;
  @ViewChild("ShowLead") ShowLead: any;
  @ViewChild("CreateForm") CreateForm: any;
  @ViewChild("EditForm") EditForm: any;
  @ViewChild("AssignUsersForm") AssignUsersForm: HTMLFormElement;

  leadForm: FormGroup = new FormGroup({});
  filterForm: FormGroup = new FormGroup({});
  AssignForm: FormGroup = new FormGroup({});

  users: Array<any> = [];

  constructor(
    private _LeadsService: LeadsService,
    private _SharedService: SharedService,
    private _ToastrService: ToasterService,
    private _CarService: CarService,
    private _UsersService: UsersService,
    private _ConfirmationService: ConfirmationService,
    private _InsuranceAndPolicyService: InsuranceAndPolicyService,
    private _GuardService: GuardService,
    private _FormBuilder: FormBuilder
  ) {
    this.gearType = [
      { name: "Automatic", value: "AUTOMATIC" },
      { name: "Manual", value: "MANUAL" },
    ];

    const currentYear = new Date().getFullYear() + 1;
    for (let i = 2015; i <= currentYear; i++) {
      this.carModel.push({ name: `Model ${i}`, value: `${i}` });
    }
    this.selectedGrade = this.grade[0];
    this.selectedInsurance = this.insurance[0];
    this.selectedInsuranceCompany = this.insuranceCompanies[0];
    this.selectedCarModel = this.carModel[0];
    this.selectedGearType = this.gearType[0];
  }

  ngOnInit() {
    this.getAllLeads();
    this.setLeadForm();
    this.setFilterForm();
    this.getCarName();
    this.getCarColor();
    this.getCarType();
    this.getGrade();
    this.getInsurance();
    this.getAdmins();
    this.setAdminForm();
    this.getInsuranceCompanies();
    this.setPermissions();
  }

  // Leads Settings
  getAllLeads(page = 1) {
    this._LeadsService.getLeads(page).subscribe({
      next: (res) => {
        this.leads = res.data.data;
        this.pagination = res.data;
      },
      error: (err) => {
        this._ToastrService.setToaster(
          "You don't have permission to access this page",
          "error",
          "danger"
        );
      },
    });
  }

  loadPage(page: number) {
    this.getAllLeads(page);
  }

  resetFilter() {
    this.getAllLeads();
  }

  getLeadById(id: any) {
    [this.currentLead] = this.leads.filter((lead) => lead.id == id);
    this.displayLeadDetails();
    this._LeadsService.getLeadsById(id).subscribe({
      next: (res) => {
        this.currentLead = res.data;
      },
    });
  }

  displayLeadDetails() {
    this._SharedService.fadeOut(this.LeadsTable.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.ShowLead.nativeElement);
    }, 800);
  }

  deleteLead(id: any) {
    this._LeadsService.deleteLeads(id).subscribe({
      next: (res) => {
        this.getAllLeads();
        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  createLead(form: any) {
    form.value.insuranceCompany
      ? (form.value.insurance_in_out = "in")
      : (form.value.insurance_in_out = "out");

    if (this.currentClientInsurancePolicy) {
      form.value.company_policy_id = this.currentClientInsurancePolicy.id;
    }
    delete this.leadForm.value.insuranceCompany;

    this._LeadsService.createLeads(form.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this.getAllLeads();
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.CreateForm.nativeElement);
          this.fadeInLeadsTable();
          this.currentClientInsurancePolicy = null;
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  addLead() {
    this.setLeadForm();
    this._SharedService.fadeOut(this.LeadsTable.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.CreateForm.nativeElement);
    }, 800);
  }

  editLead(lead: any) {
    this._SharedService.fadeOut(this.LeadsTable.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.EditForm.nativeElement);
    }, 800);
    this.setLeadForm(lead);
    this.currentEditRow = lead;
  }

  updateLead(form: any) {
    this.leadForm.addControl(
      "lead_id",
      new FormControl(this.currentEditRow.id, Validators.required)
    );
    this._LeadsService.updateLeads(form.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this.getAllLeads();
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.EditForm.nativeElement);
          this.fadeInLeadsTable();
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  filterLeads(form: any) {
    this._LeadsService.filterLeads(form.value).subscribe({
      next: (res) => {
        this.filterModal = false;
        this.leads = res.data.data;
        this.pagination = res.data;
        this.setFilterForm();
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  exportLeads() {
    this._LeadsService.exportLeads().subscribe({
      next: (res) => {
        const link = document.createElement("a");
        link.href = res.data;
        link.click();
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  getAllReplies(id: number) {
    this._LeadsService.getRepliesByLeadsId(id).subscribe({
      next: (res) => {
        this.allReplies = res.data;
        this.allRepliesModal = true;
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  getAssignedUsers() {
    const usersId =
      this.AssignUsersForm.nativeElement.querySelectorAll("input");
    const leadUsers = this.currentLead.lead_users;
    const formArray: FormArray = this.AssignForm.get("user_ids") as FormArray;
    if (leadUsers) {
      this.assignModal = true;
      for (let i = 0; i < usersId.length; i++) {
        for (let j = 0; j < leadUsers.length; j++) {
          if (Number(usersId[i].value) == leadUsers[j].user_id) {
            if (!formArray.value.includes(leadUsers[j].user_id.toString())) {
              usersId[i].checked = true;
              formArray.push(new FormControl(usersId[i].value));
            }
          }
        }
      }
    }
  }

  addReplay(replay: HTMLTextAreaElement) {
    this._LeadsService
      .replayLeads({ lead_id: this.currentLead.id, replay: replay.value })
      .subscribe({
        next: (res) => {
          this.addReplayModal = false;
          this._ToastrService.setToaster(res.message, "success", "success");
        },
        error: (err) =>
          this._ToastrService.setToaster(err.error.message, "error", "danger"),
      });
  }

  assignUsers(users: FormGroup) {
    this._LeadsService
      .assignUsers({
        lead_id: this.currentLead.id,
        user_ids: users.value.user_ids,
      })
      .subscribe({
        next: (res) => {
          this._ToastrService.setToaster(res.message, "success", "success");
          this.assignModal = false;
          this.getLeadById(this.currentLead.id);
        },
        error: (err) =>
          this._ToastrService.setToaster(err.error.message, "error", "danger"),
      });
  }

  getAdmins() {
    this._UsersService.getAdmins().subscribe({
      next: (res) => (this.users = res.data),
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  onCheckChange(event, status: string = "edit") {
    const formArray: FormArray = this.AssignForm.get("user_ids") as FormArray;
    if (event.target.checked) {
      formArray.push(new FormControl(event.target.value));
    } else {
      let i: number = 0;
      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value == event.target.value) {
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  deleteConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteLead(id);
      },
    });
  }

  // Set Reactive Forms
  setLeadForm(lead?: any) {
    let km = null;
    if (lead) {
      km = Number(lead.kilometer.slice(0, -1));
    }
    this.leadForm = this._FormBuilder.group({
      customer_name: new FormControl(lead?.customer_name),
      customer_mobile: new FormControl(lead?.customer_mobile),
      car_name: new FormControl(lead?.car_name),
      car_color: new FormControl(lead?.car_color),
      car_type: new FormControl(lead?.car_type),
      gear_type: new FormControl(lead?.gear_type),
      car_model: new FormControl(lead?.car_model),
      grade: new FormControl(lead?.grade),
      kilometer: new FormControl(km),
      insurance: new FormControl(lead?.insurance),
      insurance_in_out: new FormControl(lead?.insurance_in_out),
      company_policy_id: new FormControl(lead?.company_policy_id),
      insuranceCompany: new FormControl(lead?.insuranceCompany),
    });
  }

  setFilterForm() {
    this.filterForm = this._FormBuilder.group({
      customer_name: new FormControl(null),
      customer_mobile: new FormControl(null),
      car_name: new FormControl(null),
      car_color: new FormControl(null),
      car_type: new FormControl(null),
      gear_type: new FormControl(null),
      car_model: new FormControl(null),
      grade: new FormControl(null),
      kilometer: new FormControl(null),
      insurance: new FormControl(null),
      issue_date: new FormControl(null),
    });
  }

  setAdminForm() {
    this.AssignForm = this._FormBuilder.group({
      user_ids: new FormArray([]),
    });
  }

  // Car Settings
  getCarName() {
    // this.carName = [{ name: "Select Car Name", value: "" }];
    this._CarService.getCarName().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.carName.push({ name: e.car_name, value: e.car_name });
        });
      },
      error: (err) => {
        // this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  getCarColor() {
    // this.carColor = [{ name: "Select Car Color", value: "" }];
    this._CarService.getCarColor().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.carColor.push({ name: e.car_color, value: e.car_color });
        });
      },
      error: (err) => {
        // this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  getCarType() {
    // this.carType = [{ name: "Select Car Type", value: "" }];
    this._CarService.getCarType().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.carType.push({ name: e.car_type, value: e.car_type });
        });
      },
      error: (err) => {
        // this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  getGrade() {
    // this.grade = [{ name: "Select Grade", value: "" }];
    this._CarService.getGrade().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.grade.push({ name: `Grade ${e.grade}`, value: e.grade });
        });
      },
      error: (err) => {
        // this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  getInsurance() {
    // this.insurance = [{ name: "Select Insurance", value: "" }];
    this._CarService.getInsurance().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.insurance.push({ name: e.status, value: e.status });
        });
      },
      error: (err) => {
        // this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  addCarName(car: HTMLInputElement) {
    this._CarService.createCarName(car.value).subscribe({
      next: (res) => {
        this.getCarName();
        this.addCarNameModal = false;
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  addCarColor(car: HTMLInputElement) {
    this._CarService.createCarColor(car.value).subscribe({
      next: (res) => {
        this.getCarColor();
        this.addCarColorModal = false;
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  addCarType(car: HTMLInputElement) {
    this._CarService.createCarType(car.value).subscribe({
      next: (res) => {
        this.getCarType();
        this.addCarTypeModal = false;
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // back buttons
  backDetailsBtn() {
    this._SharedService.fadeOut(this.ShowLead.nativeElement);
    this.fadeInLeadsTable();
  }

  backCreateBtn() {
    this._SharedService.fadeOut(this.CreateForm.nativeElement);
    this.fadeInLeadsTable();
  }

  backEditBtn() {
    this._SharedService.fadeOut(this.EditForm.nativeElement);
    this.fadeInLeadsTable();
  }

  fadeInLeadsTable() {
    setTimeout(() => {
      this._SharedService.fadeIn(this.LeadsTable.nativeElement);
    }, 800);
  }

  // Insurance Company - Policy
  getInsuranceCompanies() {
    this.insuranceCompanies = [
      // { name: "Select Insurance Company", policies: "" },
    ];
    this._InsuranceAndPolicyService.getInsuranceCompanies().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.insuranceCompanies.push(...res.data);
        });
      },
    });
  }

  onCompanyChange(e) {
    // this.policies = [{ name: "Select Policy", value: null }];
    e.value.forEach((e: any) => {
      this.policies.push({ name: e.policy.type, value: e.id });
    });
  }

  currentClientInsurancePolicy: any;
  addClientInsuranceCompany(company: HTMLInputElement) {
    this._InsuranceAndPolicyService
      .addClientInsuranceCompany({ name: company.value })
      .subscribe({
        next: (res) => {
          this.clientInsuranceCompanyModal = false;
          this.currentClientInsurancePolicy = res.data;
        },
        error: (err) =>
          this._ToastrService.setToaster(err.error.message, "error", "danger"),
      });
  }

  // Permissions
  read: boolean = true;
  create: boolean = true;
  update: boolean = true;
  delete: boolean = true;
  makeReplay: boolean = true;
  seeReplay: boolean = true;
  setPermissions() {
    this.read = this._GuardService.hasLeadsPermission_Read();
    this.create = this._GuardService.hasLeadsPermission_Create();
    this.update = this._GuardService.hasLeadsPermission_Update();
    this.delete = this._GuardService.hasLeadsPermission_Delete();
    this.makeReplay = this._GuardService.hasLeadsPermission_MakeReplay();
    this.seeReplay = this._GuardService.hasLeadsPermission_SeeReplay();
    if (this._GuardService.isSuperAdmin()) {
      this.read = true;
      this.create = true;
      this.update = true;
      this.delete = true;
      this.makeReplay = true;
      this.seeReplay = true;
    }
  }
}
