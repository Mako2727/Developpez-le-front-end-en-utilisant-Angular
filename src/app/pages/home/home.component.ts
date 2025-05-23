import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


interface Participation {
  id: number;
  year: number;
  city: string;
  medalsCount: number;
  athleteCount: number;
}

interface CountryData {
  id: number;
  country: string;
  participations: Participation[];
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})



export class HomeComponent implements OnInit {
 multi: { name: string; value: number }[] = [];
  view: [number, number] = [700, 400];

  legend = true;
  explodeSlices = false;
  labels = true;
  doughnut = false;
  gradient = false;

numberOfCountries!: number;
numberOfOlympics!: number;

  
  public olympics$: Observable<any> = of(null);

  constructor(private olympicService: OlympicService,private  http: HttpClient,private router: Router) {}

 ngOnInit(): void {
    // On récupère l'observable depuis le service
    this.olympics$ = this.olympicService.getOlympics();

    // On transforme l'observable en souscription pour mettre à jour multi et les compteurs
    this.olympics$.subscribe({
      next: (data) => {
        this.multi = data.map((country: CountryData) => {
          const totalMedals = country.participations.reduce(
            (sum, p) => sum + p.medalsCount,
            0
          );
          return { name: country.country, value: totalMedals };
        });

        this.numberOfCountries = data.length;
        this.numberOfOlympics = data.reduce(
          (total: number, country: CountryData) => total + (country.participations?.length || 0),
          0
        );
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données JSON:', error);
      },
    });
  }

  onSelect(event: any): void {
  console.log('Clicked slice:', event);
  const countryName = event.name;
  

  this.router.navigate(['/details', countryName]);
}
}

