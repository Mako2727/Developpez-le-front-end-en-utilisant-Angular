import { Component,OnInit,OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute  } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import {  CountryData } from 'src/app/core/models/Olympic';
import {  Participation } from 'src/app/core/models/Participation';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
  standalone: false,
})


export class DetailComponent implements OnInit, OnDestroy  {
countryName: string = '';
lineData: { 
  name: string; 
  series: { name: string; value: number }[] 
}[] = [];
 totalMedalsCount!: number;
 totalEntries!: number;
 totalAthletes!: number;
scaleMin=0;
private subscriptions:Subscription[]= [];
 public olympics$: Observable<any> = of(null);


  constructor(private olympicService: OlympicService,private  http: HttpClient,private route: ActivatedRoute,private router: Router ) {}
  

ngOnInit(): void {
  this.countryName = this.route.snapshot.paramMap.get('country') || '';
  console.log('Pays sélectionné :', this.countryName);
      
      this.olympics$ = this.olympicService.getOlympics();

      this.subscriptions.push(this.olympics$.subscribe({
        next: (data: CountryData[]) => {
          const selectedCountry = data.find((c: CountryData) => c.country === this.countryName);
          if (selectedCountry) {
            this.lineData = [{
              name: selectedCountry.country,
              series: selectedCountry.participations.map((p: Participation) => ({
                name: p.year.toString(),
                value: p.medalsCount
              }))
            }];

            this.totalMedalsCount = selectedCountry.participations.reduce(
              (sum: number, p: Participation) => sum + p.medalsCount,
              0
            );

            this.totalEntries = selectedCountry.participations.length;

            this.totalAthletes = selectedCountry.participations.reduce(
              (sum: number, p: Participation) => sum + (p.athleteCount || 0),
              0
            );
          } else {
            this.lineData = [];
            this.totalMedalsCount = 0;
            this.totalEntries = 0;
            this.totalAthletes = 0;
          }
        },
        error: (error: any) => {
          console.error('Erreur lors de la souscription à olympics$ :', error);
        }
      }));

  };


  goHome(): void {
   this.router.navigate(['/']);
  }

  
  ngOnDestroy(): void {
     this.subscriptions.forEach(subs=>subs.unsubscribe());
  }
}
