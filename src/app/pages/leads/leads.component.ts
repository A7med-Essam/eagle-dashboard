import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CarService } from "app/shared/services/car.service";
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
  selectedGrade: any;
  selectedCarModel: any;
  selectedGearType: any;
  selectedInsurance: any;
  currentLead: any;
  currentEditRow: any;

  filterModal: boolean = false;
  addCarNameModal: boolean = false;
  addCarColorModal: boolean = false;
  addCarTypeModal: boolean = false;
  allRepliesModal: boolean = false;
  addReplayModal: boolean = false;
  assignModal: boolean = false;

  @ViewChild("LeadsTable") LeadsTable: any;
  @ViewChild("ShowLead") ShowLead: any;
  @ViewChild("CreateForm") CreateForm: any;
  @ViewChild("EditForm") EditForm: any;

  leadForm: FormGroup = new FormGroup({});
  filterForm: FormGroup = new FormGroup({});

  constructor(
    private _LeadsService: LeadsService,
    private _SharedService: SharedService,
    private _ToastrService: ToasterService,
    private _CarService: CarService,
    private _UsersService: UsersService,
    private _ConfirmationService: ConfirmationService,
    private _FormBuilder: FormBuilder
  ) {
    this.insurance = [
      { name: "Select Insurance", value: "" },
      { name: "Yes", value: "YES" },
      { name: "No", value: "NO" },
    ];

    this.gearType = [
      { name: "Select Gear Type", value: "" },
      { name: "Automatic", value: "AUTOMATIC" },
      { name: "Normal", value: "NORMAL" },
    ];

    this.grade = [
      { name: "Select Grade", value: "" },
      { name: "Grade 1", value: "1" },
      { name: "Grade 2", value: "2" },
      { name: "Grade 3", value: "3" },
      { name: "Grade 4", value: "4" },
      { name: "Grade 5", value: "5" },
      { name: "TOP LINE", value: "TOP LINE" },
    ];

    const currentYear = new Date().getFullYear() + 1;
    this.carModel.push({ name: "Select Model", value: "" });
    for (let i = 2015; i <= currentYear; i++) {
      this.carModel.push({ name: `Model ${i}`, value: i });
    }
    this.selectedGrade = this.grade[0];
    this.selectedInsurance = this.insurance[0];
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
    this.getAdmins();
    this.setAdminForm();
  }

  getAllLeads(page = 1) {
    this._LeadsService.getLeads(page).subscribe({
      next: (res) => {
        this.leads = res.data.data;
        this.pagination = res.data;
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  loadPage(page: number) {
    this.getAllLeads(page);
  }

  getLeadById(id: any) {
    [this.currentLead] = this.leads.filter((lead) => lead.id == id);
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
    this._LeadsService.createLeads(form.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this.getAllLeads();
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.CreateForm.nativeElement);
          setTimeout(() => {
            this._SharedService.fadeIn(this.LeadsTable.nativeElement);
          }, 800);
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

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

  getCarName() {
    this.carName = [{ name: "Select Car Name", value: "" }];
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
    this.carColor = [{ name: "Select Car Color", value: "" }];
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
    this.carType = [{ name: "Select Car Type", value: "" }];
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
          setTimeout(() => {
            this._SharedService.fadeIn(this.LeadsTable.nativeElement);
          }, 800);
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  resetFilter() {
    this.getAllLeads();
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
    this.allRepliesModal = true;
    this._LeadsService.getRepliesByLeadsId(id).subscribe({
      next: (res) => {
        this.allReplies = res.data;
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
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

  assignUsers(users) {
    this._LeadsService
      .assignUsers({ lead_id: this.currentLead.id, user_ids: users.user_ids })
      .subscribe({
        next: (res) => {
          this._ToastrService.setToaster(res.message, "success", "success");
          this.assignModal = false;
        },
        error: (err) =>
          this._ToastrService.setToaster(err.error.message, "error", "danger"),
      });
  }

  users: Array<any> = [];
  getAdmins() {
    this._UsersService.getAdmins().subscribe({
      next: (res) => (this.users = res.data),
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  AssignForm: FormGroup = new FormGroup({});

  onCheckChange(event, status: string = "edit") {
    const formArray: FormArray = this.AssignForm.get("user_ids") as FormArray;
    if (event.target.checked)
      formArray.push(new FormControl(event.target.value));
    else {
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

  setAdminForm() {
    this.AssignForm = this._FormBuilder.group({
      user_ids: new FormArray([]),
    });
  }

  deleteConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteLead(id);
      },
    });
  }
}
