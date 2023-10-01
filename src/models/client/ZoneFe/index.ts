import { UserFe } from "../UserFe";

export type IZoneFe = {
   _id?: string;
   // custom props
   name: string;
   address: string;
   latitude: string;
   longitude: string;
   users: UserFe[];
};

export class ZoneFe implements IZoneFe {
   _id?: string;
   // custom props
   name: string;
   address: string;
   latitude: string;
   longitude: string;
   users: UserFe[];
}
