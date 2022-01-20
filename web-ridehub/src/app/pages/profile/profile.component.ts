import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Evaluations } from 'src/app/interfaces/evaluations/evaluations';
import { Rides } from 'src/app/interfaces/rides/ride';
import { User } from 'src/app/interfaces/users/user';
import { ComponentTogglerService } from 'src/app/services/component-toggler.service';
import { CreateEvaluationsService } from 'src/app/services/evaluations/create-evaluations.service';
import { RidesService } from 'src/app/services/rides/get-rides.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { GetUsersService } from 'src/app/services/users/get-users.service';
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import { ClipboardService } from 'ngx-clipboard'

SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {

  constructor(
    public componentToggler: ComponentTogglerService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    public reviews: CreateEvaluationsService,
    public _userData: UserDataService,
    public users: GetUsersService,
    private _ridesService: RidesService,
    private _clipboardService: ClipboardService
  ) { }

  userID: number;
  profileID: number;
  userInformation: User;
  userReviews: Evaluations[] = [];
  driverRides = [];
  activeRides = [];

  ngOnInit(): void {
    this.userID = this._userData.user.id_utilizador;
    this.profileID = +this._activatedRoute.snapshot.paramMap.get('id')
    this.reviews.getEvaluation(this.profileID).subscribe(
      data => {
        this.userReviews = data;
      },
      error => {
        console.log(error)
      }
    );

    this.users.getUsers(this.profileID).subscribe(
      data => {
        this.userInformation = data;
        console.log(this.userInformation)
      },
      error => console.log(error)
    )

    this.users.getDriverRides(this.profileID).subscribe(
      data => {
        this.driverRides.push(...data)
      },
      error => console.log(error)
    )

    if(this.userID === this.profileID){
      this.users.getActiveRides(this.userID).subscribe(
        data => {
          this.activeRides.push(...data)
          console.log("aqui", this.activeRides)
        },
        error => console.log(error)
      )
    }

  }

  signOut(): void {
    localStorage.clear();
    this._userData.userToken = "";
    this._router.navigate(['/login']);
  }

  callReportModal(): void{
    this.componentToggler.reportModal = true;
  }

  goRide(rideID): void{
    this._router.navigate([`/ride-lobby/${rideID}`]);
  }

  openSocial(link): void{
    window.open(link, '_blank').focus();
  }

  copyContent() {
    this._clipboardService.copyFromContent(this.userInformation.snapchat)
  }
}

