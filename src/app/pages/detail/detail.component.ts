import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute  } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';


interface ChartSeries {
  name: string;
  value: number;
}

interface ChartData {
  name: string;
  series: ChartSeries[];
}
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
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
  standalone: false,
})

export class DetailComponent implements OnInit {
countryName: string = '';
lineData: { 
  name: string; 
  series: { name: string; value: number }[] 
}[] = [];
 totalMedalsCount!: number;
 totalEntries!: number;
 totalAthletes!: number;
scaleMin=0;
 public olympics$: Observable<any> = of(null);


  constructor(private olympicService: OlympicService,private  http: HttpClient,private route: ActivatedRoute,private router: Router ) {}
  

ngOnInit(): void {
  // On récupère le pays sélectionné depuis l'URL
  this.countryName = this.route.snapshot.paramMap.get('country') || '';
  console.log('Pays sélectionné :', this.countryName);

  // Étape 1 : charger les données
  this.olympicService.loadInitialData().subscribe({
    next: () => {
      // Étape 2 : une fois chargé, s'abonner à l'observable olympics$
      this.olympics$ = this.olympicService.getOlympics();

      this.olympics$.subscribe({
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
      });
    },
    error: (error: any) => {
      console.error('Erreur lors du chargement initial :', error);
    }
  });
}

  goHome(): void {
   this.router.navigate(['/']);
  }
}
