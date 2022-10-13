import { Component, OnInit } from "@angular/core";
import { CarService } from "app/shared/services/car.service";

@Component({
  selector: "cars-cmp",
  moduleId: module.id,
  templateUrl: "cars.component.html",
})
export class CarsComponent implements OnInit {
  carName: any[] = [];
  carColor: any[] = [];
  carType: any[] = [];

  constructor(private _CarService: CarService) {}
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
    this.carName = [];
    this._CarService.getCarName().subscribe((res) => {
      this.carName = res.data;
    });
  }

  getCarColor() {
    this.carColor = [];
    this._CarService.getCarColor().subscribe((res) => {
      this.carColor = res.data;
    });
  }

  getCarType() {
    this.carType = [];
    this._CarService.getCarType().subscribe((res) => {
      this.carType = res.data;
    });
  }

  // Delete

  deleteCarName(id: number) {
    this._CarService.deleteCarName(id).subscribe(() => this.getCarName());
  }

  deleteCarColor(id: number) {
    this._CarService.deleteCarColor(id).subscribe(() => this.getCarColor());
  }

  deleteCarType(id: number) {
    this._CarService.deleteCarType(id).subscribe(() => this.getCarType());
  }

  // Create

  addCarName(car: HTMLInputElement) {
    this._CarService.createCarName(car.value).subscribe({
      next: (res) => {
        this.getCarName();
        this.addCarNameModal = false;
        car.value = "";
      },
    });
  }

  addCarColor(car: HTMLInputElement) {
    this._CarService.createCarColor(car.value).subscribe({
      next: (res) => {
        this.getCarColor();
        this.addCarColorModal = false;
        car.value = "";
      },
    });
  }

  addCarType(car: HTMLInputElement) {
    this._CarService.createCarType(car.value).subscribe({
      next: (res) => {
        this.getCarType();
        this.addCarTypeModal = false;
        car.value = "";
      },
    });
  }
}
