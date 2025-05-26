// TODO: create here a typescript interface for an olympic country
import { Participation } from './Participation';


export interface CountryData {
  id: number;
  country: string;
  participations: Participation[];
}
