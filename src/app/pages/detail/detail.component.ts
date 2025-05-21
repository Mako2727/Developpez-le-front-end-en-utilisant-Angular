import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute  } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';


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




  constructor(private olympicService: OlympicService,private  http: HttpClient,private route: ActivatedRoute ) {}
  

ngOnInit(): void {
 // Récupération de l'argument "country" passé dans l'URL
    this.countryName = this.route.snapshot.paramMap.get('country') || '';
    console.log('Pays sélectionné :', this.countryName);

 this.http.get<CountryData[]>('../assets/mock/olympic.json').subscribe(
  (data) => {
    const selectedCountry = data.find(c => c.country === this.countryName);

    if (selectedCountry) {
      this.lineData = [{
        name: selectedCountry.country,
        series: selectedCountry.participations.map(p => ({
          name: p.year.toString(),
          value: p.medalsCount
        }))
      }];

      this.totalMedalsCount = selectedCountry.participations.reduce((sum, p) => sum + p.medalsCount, 0);
      this.totalEntries = selectedCountry.participations.length;
      this.totalAthletes = selectedCountry.participations.reduce((sum, p) => sum + (p.athleteCount || 0), 0);
    } else {
      this.lineData = [];
      this.totalMedalsCount = 0;
      this.totalEntries = 0;
      this.totalAthletes = 0;
    }
  },
  (error) => {
    console.error('Erreur lors du chargement des données JSON:', error);
  }
);

}
}
