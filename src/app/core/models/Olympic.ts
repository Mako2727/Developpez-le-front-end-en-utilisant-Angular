// TODO: create here a typescript interface for an olympic country
import { Participation } from './Participation';
export class olympic{
constructor(public id:number,
            public country: string,
              public participations: Participation[] = []
            ){}
}

/*
example of an olympic country:
{
    id: 1,
    country: "Italy",
    participations: []
}
*/
