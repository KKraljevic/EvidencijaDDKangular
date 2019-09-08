import { Role } from './role';
import { Donation } from './donation';

export class User {
    id: number;
    firstName: string;
    lastName: string;
    parentName: string;
    birthDate: Date;
    jmb: string;
    gender: string;
    email: string;
    password: string;
    address: string;
    phone: string;
    profession: string;
    blood: string;
    active: boolean;
    roles: Role[];
    donations?: Donation[];

}
