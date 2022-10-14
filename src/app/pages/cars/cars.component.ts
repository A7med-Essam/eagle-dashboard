import { Component, OnInit } from "@angular/core";
import { CarService } from "app/shared/services/car.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "cars-cmp",
  moduleId: module.id,
  templateUrl: "cars.component.html",
  providers: [ConfirmationService],
})
export class CarsComponent implements OnInit {
  carName: any[] = [];
  carColor: any[] = [];
  carType: any[] = [];

  constructor(
    private _ToastrService: ToasterService,
    private _ConfirmationService: ConfirmationService,
    private _CarService: CarService
  ) {}
  addCarNameModal: boolean = false;
  addCarColorModal: boolean = false;
  addCarTypeModal: boolean = false;

  ngOnInit() {
    this.getCarName();
    this.getCarColor();
    this.getCarType();
  }

  // Show
  getCarName() {
    // this.carName = [];
    this._CarService.getCarName().subscribe({
      next: (res) => (this.carName = res.data),
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  getCarColor() {
    // this.carColor = [];
    this._CarService.getCarColor().subscribe({
      next: (res) => (this.carColor = res.data),
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  getCarType() {
    // this.carType = [];
    this._CarService.getCarType().subscribe({
      next: (res) => (this.carType = res.data),
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // Delete

  deleteCarName(id: number) {
    this._CarService.deleteCarName(id).subscribe({
      next: (res) => {
        this.getCarName();
        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  deleteCarColor(id: number) {
    this._CarService.deleteCarColor(id).subscribe({
      next: (res) => {
        this.getCarColor();
        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  deleteCarType(id: number) {
    this._CarService.deleteCarType(id).subscribe({
      next: (res) => {
        this.getCarType();
        this._ToastrService.setToaster(res.message, "success", "success");
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // Create

  addCarName(car: HTMLInputElement) {
    this._CarService.createCarName(car.value).subscribe({
      next: (res) => {
        this.getCarName();
        this._ToastrService.setToaster(res.message, "success", "success");
        this.addCarNameModal = false;
        car.value = "";
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  addCarColor(car: HTMLInputElement) {
    this._CarService.createCarColor(car.value).subscribe({
      next: (res) => {
        this.getCarColor();
        this._ToastrService.setToaster(res.message, "success", "success");
        this.addCarColorModal = false;
        car.value = "";
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  addCarType(car: HTMLInputElement) {
    this._CarService.createCarType(car.value).subscribe({
      next: (res) => {
        this.getCarType();
        this._ToastrService.setToaster(res.message, "success", "success");
        this.addCarTypeModal = false;
        car.value = "";
      },
      error: (err) =>
        this._ToastrService.setToaster(err.error.message, "error", "danger"),
    });
  }

  // Delete Confirmation
  deleteCarNameConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteCarName(id);
      },
    });
  }

  deleteCarColorConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteCarColor(id);
      },
    });
  }

  deleteCarTypeConfirm(id: any) {
    this._ConfirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        this.deleteCarType(id);
      },
    });
  }
}
