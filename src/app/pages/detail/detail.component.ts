import { Component,OnInit,OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute  } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import {  CountryData } from 'src/app/core/models/Olympic';
import {  Participation } from 'src/app/core/models/Participation';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
  standalone: false,
})


export class DetailComponent implements OnInit, OnDestroy  {
countryName: string = '';
  // Données du graphique en ligne pour ngx-charts
lineData: { 
  name: string; 
  series: { name: string; value: number }[] 
}[] = [];
 totalMedalsCount!: number;
 totalEntries!: number;
 totalAthletes!: number;
scaleMin=0;
private subscriptions:Subscription[]= [];
  // Observable des données olympiques
 public olympics$!: Observable<CountryData[]>;


  constructor(private olympicService: OlympicService,private  http: HttpClient,private route: ActivatedRoute,private router: Router ) {}
  

ngOnInit(): void {
  // Nom du pays sélectionné (extrait de l'URL)
  this.countryName = this.route.snapshot.paramMap.get('country') || '';
  console.log('Pays sélectionné :', this.countryName);
      
  // On appelle le service pour récupérer les données des JO
      this.olympics$ = this.olympicService.getOlympics();
// On souscrit à l'observable olympics$
      this.subscriptions.push(this.olympics$.subscribe({
        next: (data: CountryData[]) => {
          // On cherche le pays correspondant au nom dans les données
          const selectedCountry = data.find((c: CountryData) => c.country === this.countryName);
          if (selectedCountry) {
             // Construction des données pour le graphique (année vs nombre de médailles)
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
             // Si le pays n'est pas trouvé, on met tout à zéro
            this.lineData = [];
            this.totalMedalsCount = 0;
            this.totalEntries = 0;
            this.totalAthletes = 0;
          }
        },
        error: (error: HttpErrorResponse) => {
           // Gestion d’erreur si la souscription échoue
          console.error('Erreur lors de la souscription à olympics$ :', error);
        }
      }));

  };


  goHome(): void {
   this.router.navigate(['/']);
  }

   // Nettoyage des souscriptions lors de la destruction du composant
  ngOnDestroy(): void {
     this.subscriptions.forEach(subs=>subs.unsubscribe());
  }


}
