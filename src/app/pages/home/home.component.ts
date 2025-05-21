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
  this.olympics$ = this.olympicService.getOlympics();

  this.http.get<CountryData[]>('../assets/mock/olympic.json').subscribe(
     
      (data) => {
        this.multi = data.map((country) => {
          console.log(JSON.stringify(data));
          const totalMedals = country.participations.reduce((sum: number, p: any) => sum + p.medalsCount,0);
          return {name: country.country, value: totalMedals};
        });
           this.numberOfCountries = data.length;
           this.numberOfOlympics = data.reduce((total, country) => {
  return total + (country.participations?.length || 0);
}, 0);
      },
      (error) => {
        console.error('Erreur lors du chargement des données JSON:', error);
      }
    );
  }

  onSelect(event: any): void {
  console.log('Clicked slice:', event);
  const countryName = event.name;
  
  // Par exemple : navigation vers /details
  this.router.navigate(['/details', countryName]);
}
}

