import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { EmployeeService } from "app/shared/services/employee.service";
import { SharedService } from "app/shared/services/shared.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-employees",
  templateUrl: "./employees.component.html",
  styleUrls: ["./employees.component.scss"],
  providers: [ConfirmationService],
})
export class EmployeesComponent implements OnInit {
  pagination: any;
  employees: any[] = [];
  jobTitle: any[] = [];
  status: any[] = [];
  religion: any[] = [];
  gender: any[] = [];
  nationality: any[] = [];
  militaryStatus: any[] = [];
  maritalStatus: any[] = [];
  contract: any[] = [];

  filterModal: boolean = false;
  selectedRow: any;
  currentEditRow: any;

  @ViewChild("Main") Main: any;
  @ViewChild("Show") Show: any;
  @ViewChild("CreateForm") CreateForm: any;
  @ViewChild("EditForm") EditForm: any;

  employeesForm: FormGroup = new FormGroup({});
  filterForm: FormGroup = new FormGroup({});

  constructor(
    private _EmployeeService: EmployeeService,
    private _SharedService: SharedService,
    private _ToastrService: ToasterService,
    private _ConfirmationService: ConfirmationService,
    private _FormBuilder: FormBuilder
  ) {
    this.gender = [
      { name: "Select your gender", value: "" },
      { name: "Male", value: "male" },
      { name: "Female", value: "female" },
    ];

    this.contract = [
      { name: "Select contract", value: "" },
      { name: "Limited", value: "limited" },
      { name: "Un Limited", value: "un limited" },
    ];

    this.militaryStatus = [
      { name: "Select military status", value: "" },
      { name: "Exempted", value: "Exempted" },
      { name: "Fulfiled", value: "Fulfiled" },
      { name: "Postponed", value: "Postponed" },
    ];

    this.status = [
      { name: "Select status", value: "" },
      { name: "Active", value: "ACTIVE" },
      { name: "Deactive", value: "DEACTIVE" },
    ];

    this.religion = [
      { name: "Select your religion", value: "" },
      { name: "MUSLIM", value: "MUSLIM" },
      { name: "CHRISTIAN", value: "CHRISTIAN" },
    ];

    this.nationality = [
      { name: "Select your nationality", value: "" },
      { name: "EGYPTIAN", value: "EGYPTIAN" },
      { name: "SAUDI", value: "SAUDI" },
      { name: "HINDI", value: "HINDI" },
      { name: "YAMNI", value: "YAMNI" },
      { name: "PAKISTANI", value: "PAKISTANI" },
    ];

    this.maritalStatus = [
      { name: "Select marital status", value: "" },
      { name: "SINGLE", value: "SINGLE" },
      { name: "MARRIED", value: "MARRIED" },
    ];

    this.jobTitle = [
      { name: "Select your job title", value: "" },
      { name: "Sales", value: "Sales" },
      { name: "Operation", value: "Operation" },
      { name: "Accounting", value: "Accounting" },
      { name: "Assistant Account", value: "Assistant Account" },
      { name: "Assistant Sales", value: "Assistant Sales" },
      { name: "Assistant Operation", value: "Assistant Operation" },
      { name: "Assistant CEO", value: "Assistant CEO" },
      { name: "Housekeeping", value: "Housekeeping" },
      { name: "newcomer", value: "newcomer" },
    ];
  }

  ngOnInit() {
    this.getEmployees();
    this.setEmployeesForm();
    this.setFilterForm();
  }

  // Curd Settings
  getEmployees(page = 1) {
    this._EmployeeService.getEmployees(page).subscribe({
      next: (res) => {
        this.employees = res.data;
        this.pagination = res.data;
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  getById(id: any) {
    [this.selectedRow] = this.employees.filter((emp) => emp.id == id);
    this.displayDetails();
  }

  createRow(form: any) {
    console.log(form);
    this._EmployeeService.createEmployees(form.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this.getEmployees();
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.CreateForm.nativeElement);
          this.fadeInEmployeesTable();
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  editRow(form: any) {
    this.employeesForm.addControl(
      "eid",
      new FormControl(this.currentEditRow.id, Validators.required)
    );
    this._EmployeeService.updateEmployees(form.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this.getEmployees();
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.EditForm.nativeElement);
          this.fadeInEmployeesTable();
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  deleteRow(id: any) {
    this._EmployeeService.deleteEmployees(id).subscribe({
      next: (res) => {
        this.getEmployees();
        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  deleteConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteRow(id);
      },
    });
  }

  // Set Reactive Forms
  setEmployeesForm(emp?: any) {
    let date = emp ? new Date(emp?.dof) : null;
    let joinDate = emp ? new Date(emp?.join) : null;
    let endDate = emp ? new Date(emp?.end) : null;
    this.employeesForm = this._FormBuilder.group({
      name: new FormControl(emp?.name, [Validators.required]),
      job_title: new FormControl(emp?.job_title, [Validators.required]),
      mobile: new FormControl(emp?.mobile, [Validators.required]),
      nid: new FormControl(emp?.nid, [Validators.required]),
      dof: new FormControl(date, [Validators.required]),
      contract: new FormControl(emp?.contract, [Validators.required]),
      status: new FormControl(emp?.status, [Validators.required]),
      join: new FormControl(joinDate, [Validators.required]),
      annual: new FormControl(emp?.annual, [Validators.required]),
      end: new FormControl(endDate, [Validators.required]),
      email: new FormControl(emp?.email, [
        Validators.required,
        Validators.email,
      ]),
      passport: new FormControl(emp?.passport, [Validators.required]),
      religion: new FormControl(emp?.religion, [Validators.required]),
      gender: new FormControl(emp?.gender, [Validators.required]),
      nationality: new FormControl(emp?.nationality, [Validators.required]),
      address: new FormControl(emp?.address, [Validators.required]),
      military: new FormControl(emp?.military, [Validators.required]),
      marital: new FormControl(emp?.marital, [Validators.required]),
      no_kids: new FormControl(emp?.no_kids, [Validators.required]),
    });
  }

  setFilterForm() {
    this.filterForm = this._FormBuilder.group({
      name: new FormControl(null),
      job_title: new FormControl(null),
      mobile: new FormControl(null),
      nid: new FormControl(null),
      dof: new FormControl(null),
      contract: new FormControl(null),
      status: new FormControl(null),
      join: new FormControl(null),
      annual: new FormControl(null),
      end: new FormControl(null),
      email: new FormControl(null),
      passport: new FormControl(null),
      religion: new FormControl(null),
      gender: new FormControl(null),
      nationality: new FormControl(null),
      address: new FormControl(null),
      military: new FormControl(null),
      marital: new FormControl(null),
      no_kids: new FormControl(null),
    });
  }

  // back buttons
  backDetailsBtn() {
    this._SharedService.fadeOut(this.Show.nativeElement);
    this.fadeInEmployeesTable();
  }

  backCreateBtn() {
    this._SharedService.fadeOut(this.CreateForm.nativeElement);
    this.fadeInEmployeesTable();
  }

  backEditBtn() {
    this._SharedService.fadeOut(this.EditForm.nativeElement);
    this.fadeInEmployeesTable();
  }

  fadeInEmployeesTable() {
    setTimeout(() => {
      this._SharedService.fadeIn(this.Main.nativeElement);
    }, 800);
  }

  // display animation
  displayCreateForm() {
    this.setEmployeesForm();
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.CreateForm.nativeElement);
    }, 800);
  }

  displayEditForm(emp: any) {
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.EditForm.nativeElement);
    }, 800);
    this.setEmployeesForm(emp);
    this.currentEditRow = emp;
  }

  displayDetails() {
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Show.nativeElement);
    }, 800);
  }

  // Filter
  filter(form: any) {
    this._EmployeeService.filterEmployees(form.value).subscribe({
      next: (res) => {
        this.filterModal = false;
        this.employees = res.data;
        this.pagination = res.data;
        this.setFilterForm();
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  resetFilter() {
    this.getEmployees();
  }

  // Pagination
  loadPage(page: number) {
    this.getEmployees(page);
  }

  // Export
  export() {
    this._EmployeeService.exportEmployees().subscribe({
      next: (res) => {
        const link = document.createElement("a");
        link.href = res.data;
        link.click();
      },
      // error: (err) =>
      //   this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }
}
