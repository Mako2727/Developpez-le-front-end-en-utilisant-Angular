import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
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


// Déclaration du composant HomeComponent
export class HomeComponent implements OnInit {
// Données du graphique : liste de pays avec leur nombre total de médailles
 multi: { name: string; value: number }[] = [];

//declaration de lengendPosition
public legendPosition!: LegendPosition ;
numberOfCountries!: number;
numberOfOlympics!: number;

  // Observables pour les données
  olympics$!: Observable<CountryData[]>;

  multi$!: Observable<{ name: string; value: number }[]>;
  numberOfCountries$!: Observable<number>;
  numberOfOlympics$!: Observable<number>;

  constructor(private olympicService: OlympicService,private router: Router) 
  {
 this.updateLegendPosition();
 // Met à jour dynamiquement la position de la légende lors du redimensionnement de la fenêtre
  window.addEventListener('resize', () => this.updateLegendPosition());

  }


ngOnInit(): void {
  // Récupère les données des JO depuis le service
  this.olympics$ = this.olympicService.getOlympics().pipe(
    map(data => data ?? []) 
  );

  // Transforme les données des JO en données adaptées au graphique (multi)
  this.multi$ = this.olympics$.pipe(
    map(data => data.map(country => ({
      name: country.country,
      value: country.participations.reduce((sum, p) => sum + p.medalsCount, 0)
    })))
  );

  // Calcule le nombre de pays à partir des données
  this.numberOfCountries$ = this.olympics$.pipe(
    map(data => data.length)
  );
   // Calcule le nombre total de participations (somme des participations de chaque pays)
  this.numberOfOlympics$ = this.olympics$.pipe(
    map(data =>
      data.reduce((total, c) => total + (c.participations?.length || 0), 0)
    )
  );
}

 // Méthode appelée lorsqu'un pays est sélectionné dans le graphique
  onSelect(event: { name: string; value: number }): void {
  console.log('Clicked slice:', event);
  const countryName = event.name;  
 // Redirige vers la page de détail du pays sélectionné
  this.router.navigate(['/details', countryName]);
}

  // Met à jour dynamiquement la position de la légende selon la taille de l'écran
updateLegendPosition() {
  this.legendPosition = window.innerWidth <= 1000 ? LegendPosition.Below :  LegendPosition.Right;
}


}

