import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SharedService {
  constructor() {}

  fadeIn(e: HTMLElement) {
    e.classList.add("fadeIn");
    e.classList.remove("fadeOut");
    e.classList.remove("d-none");
  }

  fadeOut(e: HTMLElement) {
    e.classList.add("fadeOut");
    e.classList.remove("fadeIn");
    setTimeout(() => {
      e.classList.add("d-none");
    }, 800);
  }
}
