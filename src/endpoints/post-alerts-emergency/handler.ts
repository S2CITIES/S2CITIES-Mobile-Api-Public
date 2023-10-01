import {
   ErrorResponse,
   ResponseHandler,
   StatusCodes,
} from "@/lib/response-handler";
import { NextApiResponse } from "next";
import { PostAlertsEmergencyApi } from "./interfaces";
import { Alert } from "@/models/server/Alert";
import { User } from "@/models/server/User";
import { sendPushNotificationTo } from "@/utils/pushNotifications";
import {
   NotificationType,
   S2citiesPushNotification,
} from "@/models/common/S2citiesPushNotification";

export default async function handler(
   req: PostAlertsEmergencyApi.Request,
   res: NextApiResponse<PostAlertsEmergencyApi.EndpointResponse>,
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

      const { address, latitude, longitude } = req.payload;

      if ((latitude && !longitude) || (!latitude && longitude)) {
         // not both coordinates have been sent
         return ResponseHandler.json<ErrorResponse>(
            res,
            { message: "Latitude and Longitude must be sent together" },
            StatusCodes.BadRequest,
         );
      }

      // create new Emergency Alert
      const newAlert = await Alert.create(
         Alert.fromEmergency(address, latitude, longitude),
      );

      // * Emergency alert created *

      // send push notification to all users
      const allUsers = await User.getList(
         null, // no filter
         {
            limit: 1000,
         },
      );

      // create proper notification object
      const notification = new S2citiesPushNotification({
         type: NotificationType.EmergencyAlert,
         data: newAlert.toBasicInfo(),
      });

      // send push notification asynchronously
      sendPushNotificationTo(allUsers, notification);

      return ResponseHandler.json<PostAlertsEmergencyApi.SuccessResponse>(
         res,
         { alert: newAlert.toClientVersion() },
         StatusCodes.Created,
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
