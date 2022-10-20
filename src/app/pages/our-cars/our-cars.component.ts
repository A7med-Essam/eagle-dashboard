import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CarService } from "app/shared/services/car.service";
import { OurCarService } from "app/shared/services/our-car.service";
import { SharedService } from "app/shared/services/shared.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-our-cars",
  templateUrl: "./our-cars.component.html",
  styleUrls: ["./our-cars.component.scss"],
  providers: [ConfirmationService],
})
export class OurCarsComponent implements OnInit {
  pagination: any;
  ourCars: any[] = [];
  carGrade: any[] = [];
  carColor: any[] = [];
  carName: any[] = [];
  carModel: any[] = [];
  filterModal: boolean = false;
  selectedRow: any;
  currentEditRow: any;

  @ViewChild("Main") Main: any;
  @ViewChild("Show") Show: any;
  @ViewChild("CreateForm") CreateForm: any;
  @ViewChild("EditForm") EditForm: any;

  ourCarsForm: FormGroup = new FormGroup({});
  filterForm: FormGroup = new FormGroup({});

  constructor(
    private _OurCarService: OurCarService,
    private _SharedService: SharedService,
    private _ToastrService: ToasterService,
    private _ConfirmationService: ConfirmationService,
    private _CarService: CarService,
    private _FormBuilder: FormBuilder
  ) {
    const currentYear = new Date().getFullYear() + 1;
    this.carModel.push({ name: "Select Model", value: "" });
    for (let i = 2015; i <= currentYear; i++) {
      this.carModel.push({ name: `Model ${i}`, value: `${i}` });
    }
  }

  ngOnInit() {
    this.getOurCars();
    this.setOurCarsForm();
    this.setFilterForm();
    this.getCarColor();
    this.getCarGrade();
    this.getCarName();
  }

  // Curd Settings
  getOurCars(page = 1) {
    this._OurCarService.getOurCars(page).subscribe({
      next: (res) => {
        this.ourCars = res.data;
        this.pagination = res.data;
        // console.log(this.ourCars);
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  getById(id: any) {
    [this.selectedRow] = this.ourCars.filter((car) => car.id == id);
    this.displayDetails();
    // this._OurCarService.getourCarsById(id).subscribe({
    //   next: (res) => {
    //     this.currentLead = res.data;
    //   },
    // });
  }

  createRow(form: any) {
    console.log(form);
    this._OurCarService.createOurCars(form.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this.getOurCars();
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.CreateForm.nativeElement);
          this.fadeInOurCarsTable();
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  editRow(form: any) {
    this.ourCarsForm.addControl(
      "cid",
      new FormControl(this.currentEditRow.id, Validators.required)
    );
    this._OurCarService.updateOurCars(form.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this.getOurCars();
          this._ToastrService.setToaster(res.message, "success", "success");
          this._SharedService.fadeOut(this.EditForm.nativeElement);
          this.fadeInOurCarsTable();
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  deleteRow(id: any) {
    this._OurCarService.deleteOurCars(id).subscribe({
      next: (res) => {
        this.getOurCars();
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
  setOurCarsForm(car?: any) {
    let date = car ? new Date(car?.license_end) : null;
    this.ourCarsForm = this._FormBuilder.group({
      name: new FormControl(car?.name),
      model: new FormControl(car?.model),
      grade: new FormControl(Number(car?.grade)),
      color: new FormControl(car?.color),
      plate_no: new FormControl(car?.plate_no),
      motor_no: new FormControl(car?.motor_no),
      chassis_no: new FormControl(car?.chassis_no),
      license_end: new FormControl(date),
    });
  }

  setFilterForm() {
    this.filterForm = this._FormBuilder.group({
      name: new FormControl(null),
      model: new FormControl(null),
      grade: new FormControl(null),
      color: new FormControl(null),
      plate_no: new FormControl(null),
      motor_no: new FormControl(null),
      chassis_no: new FormControl(null),
      license_end: new FormControl(null),
    });
  }

  // back buttons
  backDetailsBtn() {
    this._SharedService.fadeOut(this.Show.nativeElement);
    this.fadeInOurCarsTable();
  }

  backCreateBtn() {
    this._SharedService.fadeOut(this.CreateForm.nativeElement);
    this.fadeInOurCarsTable();
  }

  backEditBtn() {
    this._SharedService.fadeOut(this.EditForm.nativeElement);
    this.fadeInOurCarsTable();
  }

  fadeInOurCarsTable() {
    setTimeout(() => {
      this._SharedService.fadeIn(this.Main.nativeElement);
    }, 800);
  }

  // display animation
  displayCreateForm() {
    this.setOurCarsForm();
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.CreateForm.nativeElement);
    }, 800);
  }

  displayEditForm(car: any) {
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.EditForm.nativeElement);
    }, 800);
    this.setOurCarsForm(car);
    this.currentEditRow = car;
  }

  displayDetails() {
    this._SharedService.fadeOut(this.Main.nativeElement);
    setTimeout(() => {
      this._SharedService.fadeIn(this.Show.nativeElement);
    }, 800);
  }

  // Filter
  filter(form: any) {
    this._OurCarService.filterOurCars(form.value).subscribe({
      next: (res) => {
        this.filterModal = false;
        this.ourCars = res.data;
        this.pagination = res.data;
        this.setFilterForm();
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  resetFilter() {
    this.getOurCars();
  }

  // Pagination
  loadPage(page: number) {
    this.getOurCars(page);
  }

  // Export
  export() {
    this._OurCarService.exportOurCars().subscribe({
      next: (res) => {
        const link = document.createElement("a");
        link.href = res.data;
        link.click();
      },
      // error: (err) =>
      //   this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // Car Settings
  getCarColor() {
    this.carColor = [{ name: "Select Car Color", value: "" }];
    this._CarService.getCarColor().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.carColor.push({ name: e.car_color, value: e.car_color });
        });
      },
    });
  }

  getCarGrade() {
    this.carGrade = [{ name: "Select Grade", value: "" }];
    this._CarService.getGrade().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.carGrade.push({ name: `Grade ${e.grade}`, value: e.id });
        });
      },
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
}
