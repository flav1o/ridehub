import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';
import { LocationsServiceService, Feature } from 'src/app/services/rides/locations-service.service';
import { createRidesService } from 'src/app/services/rides/create-ride.service';
import { Rides } from 'src/app/interfaces/rides/ride';
import { AlertModal } from 'src/app/interfaces/components/alert-modal';
import { GeoCodingService } from 'src/app/services/rides/geo-coding.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { VehiclesService } from 'src/app/services/vehicles/get-vehicle.service';
import { Vehicle } from 'src/app/interfaces/vehicles/vehicle';
import { HomeComponent } from 'src/app/pages/home/home.component';

@Component({
  selector: 'app-create-ride-modal',
  templateUrl: './create-ride-modal.component.html',
  styleUrls: ['./create-ride-modal.component.scss']
})
export class CreateRideModalComponent implements OnInit {
  alertStatus: AlertModal;
  vehicles: Array<Vehicle>;

  constructor(
    private _ride: createRidesService,
    private _locationservice: LocationsServiceService,
    public componentToggler: ComponentTogglerService,
    private _getCoords: GeoCodingService,
    private _userData: UserDataService,
    private _vehicle: VehiclesService,
    private _reloadMap: HomeComponent
  ) { }

  ngOnInit(): void {
    console.log(this._userData.user.id_utilizador);

    this._vehicle.getVehicle(this._userData.user.id_utilizador).subscribe(
      data => this.vehicles = data,
      error => console.log(error)
    )
  }

  addressesStarting: string[] = [];
  addressesEnding: string[] = [];
  selectedStartingAddress: any = null;
  selectedEndingAddress: any = null;

  search(event: any, inputTypeNumber: number) {

    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this._locationservice
        .search_word(searchTerm)
        .subscribe((features: Feature[]) => {
          if (inputTypeNumber == 0) {
            this.addressesStarting = features.map(feat => feat.place_name);
          } else {
            this.addressesEnding = features.map(feat => feat.place_name);
          }
        });
    } else {
      this.addressesStarting = [];
      this.addressesEnding = [];
    }
    console.log("STARTING: ", this.selectedStartingAddress)
    console.log("destination: ", this.selectedEndingAddress)
  }

  onSelect(address: string, inputTypeNumber: number) {
    if (inputTypeNumber == 0) {
      this.selectedStartingAddress = address;
      this.addressesStarting = [];
    } else {
      this.selectedEndingAddress = address;
      this.addressesEnding = [];
    }
  }

  getYearPlusSixMonths = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentMonthPlusSix = currentMonth + 6;
    const YearPlusSixMonths = currentYear + (currentMonthPlusSix / 12);

    return { YearPlusSixMonths, currentYear };
  }


  async confirmRide(createRideForm): Promise<void> {
    //Verify time difference
    const today = new Date();
    const date = createRideForm.form.value.data.split('T')[0]
    const formTimeStamp = new Date(date.split('-')[0], date.split('-')[1] - 1, date.split('-')[2]);
    const todayTimestamp = today.getTime();

    const currentMonths = Number(createRideForm.form.value.data.split('-')[1]) / 12;
    const currentYearPlusMonths = Number(createRideForm.form.value.data.split('-')[0]) + currentMonths

    if (
      createRideForm.form.status === 'INVALID' ||
      Number(formTimeStamp) < Number(todayTimestamp) ||
      currentYearPlusMonths >= this.getYearPlusSixMonths().YearPlusSixMonths
    ) {
      this.alertStatus = { success: true, message: 'Verify your inputs!' }
      this.componentToggler.alertModal = true;
      return;
    }

    const rideData: Rides = await createRideForm.form.value;
    rideData.estado = 'W'
    rideData.id_utilizador = this._userData.user.id_utilizador
    rideData.lugares_disponiveis += 1;
    rideData.id_chat = 'undefined';

    this.getStartCoords(rideData)
  }

  getStartCoords(rideData: Rides): void {
    this._getCoords.parseToCoords(rideData.origem).subscribe((x) => {
      rideData.geo_origem = x['features'][0]['center'][0] + ',' + x['features'][0]['center'][1];
      rideData.origem = this.selectedStartingAddress;

      this.getDestinationCoords(rideData);
    })
  }

  getDestinationCoords(rideData: Rides): void {
    this._getCoords.parseToCoords(rideData.destino).subscribe((x) => {
      rideData.geo_destino = x['features'][0]['center'][0] + ',' + x['features'][0]['center'][1];
      rideData.destino = this.selectedEndingAddress;
      this.createRide(rideData);
    });
  }

  createRide(rideData: Rides) {
    this._ride.createRide(rideData).subscribe(
      data => this.onSuccess(),
      error => console.log(error),
    );
  }

  @ViewChild('divToAnim') divToAnim: ElementRef;
  onSuccess(): void {
    this.divToAnim.nativeElement.classList.remove('slide-in-bottom');
    this.divToAnim.nativeElement.classList.add('slide-out-bottom');
    this._reloadMap.createMap();

    setTimeout(() => {
      this.componentToggler.rideModal = false;
    }, 500);
  }
}
