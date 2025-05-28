import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription,observeOn, asyncScheduler } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {  CountryData } from 'src/app/core/models/Olympic';
import { map } from 'rxjs/operators';
import { LegendPosition } from '@swimlane/ngx-charts';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})



export class HomeComponent implements OnInit, OnDestroy {
 multi: { name: string; value: number }[] = [];
view: [number, number] = [700, 400];
private subscriptions:Subscription[]= [];


numberOfCountries!: number;
numberOfOlympics!: number;
below: LegendPosition = LegendPosition.Below;
  
  olympics$!: Observable<CountryData[]>;

  multi$!: Observable<{ name: string; value: number }[]>;
  numberOfCountries$!: Observable<number>;
  numberOfOlympics$!: Observable<number>;

  constructor(private olympicService: OlympicService,private  http: HttpClient,private router: Router) {}


ngOnInit(): void {
  this.olympics$ = this.olympicService.getOlympics().pipe(
    map(data => data ?? []) // <-- évite les undefined
  );

  this.multi$ = this.olympics$.pipe(
    map(data => data.map(country => ({
      name: country.country,
      value: country.participations.reduce((sum, p) => sum + p.medalsCount, 0)
    })))
  );

  this.numberOfCountries$ = this.olympics$.pipe(
    map(data => data.length)
  );

  this.numberOfOlympics$ = this.olympics$.pipe(
    map(data =>
      data.reduce((total, c) => total + (c.participations?.length || 0), 0)
    )
  );
}

  onSelect(event: any): void {
  console.log('Clicked slice:', event);
  const countryName = event.name;
  

  this.router.navigate(['/details', countryName]);
}


  ngOnDestroy(): void {
     this.subscriptions.forEach(subs=>subs.unsubscribe());
  }
}

