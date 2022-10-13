import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CarService } from "app/shared/services/car.service";
import { LeadsService } from "app/shared/services/leads.service";
import { SharedService } from "app/shared/services/shared.service";
import { ToasterService } from "app/shared/services/toaster.service";

@Component({
  selector: "leads-cmp",
  moduleId: module.id,
  templateUrl: "leads.component.html",
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
  }

  getAllLeads(page = 1) {
    this._LeadsService.getLeads(page).subscribe({
      next: (res) => {
        this.leads = res.data.data;
        this.pagination = res.data;
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
    this._CarService.getCarName().subscribe((res) => {
      res.data.forEach((e: any) => {
        this.carName.push({ name: e.car_name, value: e.car_name });
      });
    });
  }

  getCarColor() {
    this.carColor = [{ name: "Select Car Color", value: "" }];
    this._CarService.getCarColor().subscribe((res) => {
      res.data.forEach((e: any) => {
        this.carColor.push({ name: e.car_color, value: e.car_color });
      });
    });
  }

  getCarType() {
    this.carType = [{ name: "Select Car Type", value: "" }];
    this._CarService.getCarType().subscribe((res) => {
      res.data.forEach((e: any) => {
        this.carType.push({ name: e.car_type, value: e.car_type });
      });
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
    });
  }

  addCarName(car: HTMLInputElement) {
    this._CarService.createCarName(car.value).subscribe({
      next: (res) => {
        this.getCarName();
        this.addCarNameModal = false;
      },
    });
  }

  addCarColor(car: HTMLInputElement) {
    this._CarService.createCarColor(car.value).subscribe({
      next: (res) => {
        this.getCarColor();
        this.addCarColorModal = false;
      },
    });
  }

  addCarType(car: HTMLInputElement) {
    this._CarService.createCarType(car.value).subscribe({
      next: (res) => {
        this.getCarType();
        this.addCarTypeModal = false;
      },
    });
  }

  exportLeads() {
    this._LeadsService.exportLeads().subscribe({
      next: (res) => {
        const link = document.createElement("a");
        link.href = res.data;
        link.click();
      },
    });
  }
}
