import { Role } from './role';

export class User {
    id: number;
    firstName: string;
    lastName: string;
    parentName: string;
    birthDate: Date;
    JMB: string;
    gender: string;
    email: string;
    password: string;
    address: string;
    phone: string;
    profession: string;
    bloodType: string;
    active: boolean;
    roles: Role[];

}
