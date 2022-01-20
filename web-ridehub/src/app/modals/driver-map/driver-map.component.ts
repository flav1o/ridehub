import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RidesService } from 'src/app/services/rides/get-rides.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { Router } from '@angular/router';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';
import { NumberOccupants } from 'src/app/interfaces/rides/number-occupants';

@Component({
  selector: 'app-driver-map',
  templateUrl: './driver-map.component.html',
  styleUrls: ['./driver-map.component.scss']
})
export class DriverMapComponent implements OnInit {

  constructor(
    private renderer: Renderer2,
    private _getRideInfo: RidesService,
    private _userData: UserDataService,
    private _router: Router,
    public componentToggler: ComponentTogglerService,

  ) { }

  @Input() rideDetails;
  @ViewChild("map") map: ElementRef;
  @ViewChild("stateButton") stateButton: ElementRef;
  rideNumberOccupants: NumberOccupants

  ngOnInit(): void {
    console.log(this.rideDetails)

    if(this.rideDetails.id_owner !== this._userData.user.id_utilizador || !this.rideDetails)
      this._router.navigate(['/home']);

    localStorage.setItem('rideID', this.rideDetails.id_ride);

    this._getRideInfo.getRideNumberOccupants(this.rideDetails.id_ride).subscribe(
      data => {
        this.rideNumberOccupants = data;
      },
      error => console.log(error)
    )
  }

  script = this.renderer.createElement('script')

  ngAfterViewInit(): void {
    this.createMap();
    if (this.rideNumberOccupants.estado === "O")
      this.stateButton.nativeElement.innerText = "Finish";
  }

  ngOnDestroy(): void{
    this.renderer.removeChild(document.body, this.script)
  }

  createMap(): void{
    this.map.nativeElement.innerHTML = ""

    this.script.src = "../../../assets/js/driver-map.js"
    this.script.defer = true;
    this.script.async = true;

    this.renderer.appendChild(document.body, this.script)
  }

  goBack(): void{
    this.componentToggler.rideMap = false;
  }

  toggleRide(): void {

    if (this.rideNumberOccupants.estado === "O") {
      this.rideNumberOccupants.estado = "F";
      this.componentToggler.rideMap = false;
    }

    if (this.rideNumberOccupants.estado === "W"){
      this.rideNumberOccupants.estado = "O";
      this.stateButton.nativeElement.innerText = "Finish"
    }

    this._getRideInfo.toggleRideState(this.rideDetails.id_ride, this.rideNumberOccupants.estado).subscribe(
      data => console.log(data),
      error => console.log(error)
    )
  }
}
