import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  token: string

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    public componentToggler: ComponentTogglerService,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.createMap();
  }

  script;
  ngOnDestroy(): void{
    this.renderer.removeChild(document.body, this.script)
  }

  @ViewChild("map") map: ElementRef;
  createMap(): void {
    this.script = this.renderer.createElement('script')
    this.map.nativeElement.innerHTML = "";

    this.script.src = "../../../assets/js/home-map.js"
    this.script.defer = true;
    this.script.async = true;

    this.renderer.appendChild(document.body, this.script)

    this.token = localStorage.getItem('userToken')
  }

  toggleCreateRide(event: Event, clicked: boolean): void {
    if (clicked) this.componentToggler.rideModal = true;
    if (!clicked) this.componentToggler.rideModal = false;
    event.stopPropagation();

    this.renderer.removeChild(document.body, this.script)
  }

  toggleOff(event): void {
    this.componentToggler.rideModal = false;
  }
}
