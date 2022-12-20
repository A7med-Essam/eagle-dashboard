import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CarPriceService } from "app/shared/services/car-price.service";
import { CarService } from "app/shared/services/car.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "app-car-price",
  templateUrl: "./car-price.component.html",
  styleUrls: ["./car-price.component.scss"],
  providers: [ConfirmationService],
})
export class CarPriceComponent implements OnInit {
  pagination: any;
  carPrice: any[] = [];
  currentCarPrice: any;
  editModal: boolean = false;
  addModal: boolean = false;
  carPriceForm: FormGroup = new FormGroup({});

  constructor(
    private _ToastrService: ToasterService,
    private _FormBuilder: FormBuilder,
    private _ConfirmationService: ConfirmationService,
    private _CarService: CarService,
    private _CarPriceService: CarPriceService
  ) {
    const currentYear = new Date().getFullYear() + 1;
    for (let i = 2015; i <= currentYear; i++) {
      this.carModel.push({ name: `Model ${i}`, value: `${i}` });
    }

    this.gearType = [
      { name: "Automatic", value: "AUTOMATIC" },
      { name: "Manual", value: "MANUAL" },
    ];
  }

  ngOnInit() {
    this.getCarPrice();
    this.setCarPriceForm();
    this.getCarGrade();
    this.setFilterForm();
    this.getCarName();
  }

  getCarPrice(page = 1) {
    this._CarPriceService.getCarPrice(page).subscribe({
      next: (res) => {
        this.carPrice = res.data.data;
        this.pagination = res.data;
      },
    });
  }

  // Pagination
  loadPage(page: number) {
    this.getCarPrice(page);
  }

  setCarPriceForm(car?: any) {
    let grade = car ? car?.car_grade : null;
    this.carPriceForm = this._FormBuilder.group({
      car_name: new FormControl(car?.car_name, [Validators.required]),
      car_model: new FormControl(car?.car_model, [Validators.required]),
      car_grade: new FormControl(grade, [Validators.required]),
      car_gear: new FormControl(car?.car_gear, [Validators.required]),
      zero_min: new FormControl(car?.zero_min, [Validators.required]),
      bad_min: new FormControl(car?.bad_min, [Validators.required]),
      good_min: new FormControl(car?.good_min, [Validators.required]),
      car_subtype_id: new FormControl(car?.car_subtype_id),
    });
  }

  // Delete
  deleteCarPrice(id: number) {
    this._CarPriceService.deleteCarPrice(id).subscribe({
      next: (res) => {
        // this.getCarPrice();
        this.carPrice = this.carPrice.filter((data) => data.id != id);
        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // Confirmation
  deleteConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteCarPrice(id);
      },
    });
  }

  openUpdateModal(car) {
    this.currentCarPrice = car;
    this.editModal = true;
    this.setCarPriceForm(car);
  }

  addCarPrice(car) {
    this._CarPriceService.addCarPrice(car.value).subscribe({
      next: (res) => {
        if (res.status == 1) {
          this._ToastrService.setToaster(res.message, "success", "success");
          this.addModal = false;
          this.getCarPrice();
          this.setCarPriceForm();
          this.carPriceForm.reset();
        } else {
          this._ToastrService.setToaster(res.message, "error", "danger");
        }
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  editCarPrice(car) {
    this.getCarSub(car?.value?.car_subtype_id);
    this.carPriceForm.addControl(
      "car_expected_price_id",
      new FormControl(this.currentCarPrice.id, [Validators.required])
    );
    this._CarPriceService.updateCarPrice(car.value).subscribe({
      next: (res) => {
        this._ToastrService.setToaster(res.message, "success", "success");
        this.editModal = false;
        // this.getCarPrice();
        this.carPrice.map((e) => {
          if (e.id == res.data.id) {
            Object.assign(e, res.data);
          }
        });
        this.setCarPriceForm();
        this.carPriceForm.reset();
      },
      error: (err) => {
        this._ToastrService.setToaster(err.error.message, "error", "danger");
      },
    });
  }

  // Car Settings
  carGrade: any[] = [];
  carName: any[] = [];
  carModel: any[] = [];
  gearType: any[] = [];
  getCarGrade() {
    this._CarService.getGrade().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.carGrade.push({ name: `Grade ${e.grade}`, value: e.grade });
        });
      },
    });
  }

  getCarName() {
    this._CarService.getCarName().subscribe({
      next: (res) => {
        res.data.forEach((e: any) => {
          this.carName.push({ name: e.car_name, value: e.car_name, id: e.id });
        });
      },
    });
  }

  filterCarPrice(form) {
    if (!form.value.car_model) delete form.value.car_model;
    if (!form.value.car_grade) delete form.value.car_grade;
    if (!form.value.car_name) delete form.value.car_name;
    this._CarPriceService.filterCarPrice(form.value).subscribe({
      next: (res) => {
        this.filterModal = false;
        this.carPrice = res.data.data;
        this.pagination = res.data;
        this.filterStatus = true;
        this.setFilterForm();
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }
  filterModal: boolean = false;
  filterForm: FormGroup = new FormGroup({});
  setFilterForm() {
    this.filterForm = this._FormBuilder.group({
      car_name: new FormControl(null),
      car_subtype_id: new FormControl(null),
      car_model: new FormControl(null),
      car_grade: new FormControl(null),
    });
  }

  resetFilter() {
    this.getCarPrice();
    this.setFilterForm();
  }

  displayAddModal() {
    this.addModal = true;
    this.carPriceForm.reset();
  }

  carSub: any[] = [];
  getCarSub(car) {
    this._CarService.getCarSub(car).subscribe({
      next: (res) => (this.carSub = res.data),
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  refreshCarPrice() {
    this._CarPriceService.refreshCarPrice().subscribe({
      next: (res) =>
        this._ToastrService.setToaster(res.message, "success", "success"),
    });
  }

  filterStatus: boolean = false;
  export() {
    this._CarPriceService.export().subscribe({
      next: (res) => {
        const link = document.createElement("a");
        link.href = res.data;
        link.click();
        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  exportWithFilter() {
    let filteredRows = [];
    this.carPrice.forEach((e) => {
      filteredRows.push(e.id);
    });
    this._CarPriceService
      .exportWithFilter({ carPriceIds: filteredRows })
      .subscribe({
        next: (res) => {
          const link = document.createElement("a");
          link.href = res.data;
          link.click();
        },
        error: (err) =>
          this._ToastrService.setToaster(err.error.message, "error", "danger"),
      });
  }
}
