import { User } from './user';

export class Donation {
    id:number;
    dose: number;
    date: Date;
    location: string;
    systolic:number;
    diastolic:number;
    weigth:number;
    additional: string;
    tested: boolean;
    donor: User;
}
