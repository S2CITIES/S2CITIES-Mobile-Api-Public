import {
   ErrorResponse,
   ResponseHandler,
   StatusCodes,
} from "@/lib/response-handler";
import { NextApiResponse } from "next";
import { GetAlertsApi } from "./interfaces";
import { Alert } from "@/models/server/Alert";
import { User } from "@/models/server/User";
import { ObjectId } from "mongodb";

export default async function handler(
   req: GetAlertsApi.Request,
   res: NextApiResponse<GetAlertsApi.EndpointResponse>,
) {
   try {
      // await sleep(5); for test purposes

      const { validationResult } = req;

      if (!validationResult.isValid) {
         return ResponseHandler.json<ErrorResponse>(
            res,
            { message: validationResult.message! },
            StatusCodes.BadRequest,
         );
      }

      let allAlerts = await Alert.getList(
         null, // no filter
         {
            limit: 1000,
            sort: [
               {
                  by: "timestamp",
                  asc: false,
               },
            ],
         },
      );

      // * filter just the alerts whose zone belongs to the user, or the ones without a zone *

      // TODO: substitute here the current user with the right one, once authentication is implemented
      const currentUserId = "648c310f5f701d23c4401efd"; // john doe

      const currentUser = await User.getById(new ObjectId(currentUserId));

      if (!currentUser) {
         return ResponseHandler.json<ErrorResponse>(
            res,
            { message: "Current user not found" },
            StatusCodes.InternalServerError,
         );
      }

      const currentUserZonesIds = currentUser.zones.map((zone) =>
         zone.toHexString(),
      );

      allAlerts = allAlerts.filter(
         (alert) =>
            !alert.zone_id ||
            currentUserZonesIds.includes(alert.zone_id.toHexString()),
      );

      return ResponseHandler.json<GetAlertsApi.SuccessResponse>(
         res,
         {
            alerts: allAlerts.map((alert) => alert.toClientVersion()),
         },
         StatusCodes.OK,
      );
   } catch (e) {
      console.error(e);

      return ResponseHandler.json<ErrorResponse>(
         res,
         { message: "Internal error" },
         StatusCodes.InternalServerError,
      );
   }
}
