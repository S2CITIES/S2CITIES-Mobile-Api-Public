import {
   ErrorResponse,
   ResponseHandler,
   StatusCodes,
} from "@/lib/response-handler";
import { NextApiResponse } from "next";
import { GetZonesApi } from "./interfaces";
import { Zone } from "@/models/server/Zone";
import { User } from "@/models/server/User";
import { IZoneFe } from "@/models/client/ZoneFe";
import { IUserFe } from "@/models/client/UserFe";
import { usersNamesComparator } from "@/utils/usersUtils";

export default async function handler(
   req: GetZonesApi.Request,
   res: NextApiResponse<GetZonesApi.EndpointResponse>,
) {
   try {
      const { validationResult } = req;

      if (!validationResult.isValid) {
         return ResponseHandler.json<ErrorResponse>(
            res,
            { message: validationResult.message! },
            StatusCodes.BadRequest,
         );
      }

      const users = await User.getList(
         null, // no filter
         {
            limit: 100000,
         },
      );

      const userIds = users.map((user) => user._id.toHexString());

      let zones = await Zone.getList(
         null, // no filter
         {
            limit: 1000,
         },
      );

      // TODO: replace this code with current user, once authentication is implemented
      const currentUserId = "648c310f5f701d23c4401efd";

      // filter just the zones to which the user is assigned to
      zones = zones.filter((z) =>
         z.users.map((uId) => uId.toHexString()).includes(currentUserId),
      );

      const feZones: IZoneFe[] = zones.map((zone) => {
         const zoneFormattedUsers: IUserFe[] = zone.users
            .filter((userId) => userIds.includes(userId.toHexString())) // keep just the registered users at the moment
            .map((userId) => {
               const userIdStr = userId.toHexString();
               const user = users.find(
                  (user) => user._id.toHexString() === userIdStr,
               );

               return {
                  id: userIdStr,
                  first_name:
                     userIdStr === currentUserId ? "You" : user.first_name,
                  last_name: userIdStr === currentUserId ? "" : user.last_name,
               };
            })
            .sort(usersNamesComparator);

         return zone.toClientVersion(zoneFormattedUsers);
      });

      return ResponseHandler.json<GetZonesApi.SuccessResponse>(res, {
         zones: feZones,
      });
   } catch (e) {
      console.error(e);
      return ResponseHandler.json<ErrorResponse>(
         res,
         { message: "Internal error" },
         StatusCodes.InternalServerError,
      );
   }
}
