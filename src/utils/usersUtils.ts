import { IUserFe } from "@/models/client/UserFe";

export function usersNamesComparator(u1: IUserFe, u2: IUserFe): number {
   if (u1.first_name === "You") return -1;
   if (u2.first_name === "You") return 1;

   if (u1.first_name !== u2.first_name)
      return u1.first_name < u2.first_name ? -1 : 1;

   return u1.last_name < u2.last_name ? -1 : 1;
}
