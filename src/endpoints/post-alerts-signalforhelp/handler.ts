import {
   ErrorResponse,
   ResponseHandler,
   StatusCodes,
} from "@/lib/response-handler";
import { NextApiResponse } from "next";
import { PostAlertsSignalforhelpApi } from "./interfaces";
import { Zone } from "@/models/server/Zone";
import { Alert } from "@/models/server/Alert";
import { AlertVideo } from "@/models/server/AlertVideo";
import { User } from "@/models/server/User";
import {
   NotificationType,
   S2citiesPushNotification,
} from "@/models/common/S2citiesPushNotification";
import { sendPushNotificationTo } from "@/utils/pushNotifications";

export default async function handler(
   req: PostAlertsSignalforhelpApi.Request,
   res: NextApiResponse<PostAlertsSignalforhelpApi.EndpointResponse>,
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

      let { latitude, longitude } = req.payload;

      // check latitude and longitude, if present, are provided together
      if ((latitude && !longitude) || (!latitude && longitude)) {
         return ResponseHandler.json<ErrorResponse>(
            res,
            {
               message:
                  "Latitude and Longitude, if present, must be provided together",
            },
            StatusCodes.BadRequest,
         );
      }

      const { zone_id } = req.payload;

      let zone;

      if (zone_id) {
         // check if zone exists
         zone = await Zone.getById(zone_id);

         if (!zone) {
            // zone not found
            return ResponseHandler.json<ErrorResponse>(
               res,
               { message: `Zone with id ${zone_id.toHexString()} not found` },
               StatusCodes.BadRequest,
            );
         }
      }

      const { alert_id, cam, info, format, key } = req.payload;
      let { address } = req.payload;

      if (!address && zone) {
         // if the address was not provided by the cam, use the one of the zone (if any)
         address = zone.address;
      }

      if ((!latitude || !longitude) && zone) {
         // if latitude and longitude are not provided by the cam, use the ones of the zone (if any)
         latitude = zone.latitude;
         longitude = zone.longitude;
      }

      // create new Hand Signal Alert
      const newAlert = await Alert.create(
         Alert.fromHandSignal(
            alert_id,
            address,
            latitude,
            longitude,
            zone_id,
            cam,
            info,
         ),
      );

      if (!newAlert) {
         // save error
         return ResponseHandler.json<ErrorResponse>(
            res,
            {
               message:
                  "An unexpected error occurred saving the Hand Signal alert",
            },
            StatusCodes.InternalServerError,
         );
      }

      // * alert successfully saved *

      // create associated video object
      const newVideo = await AlertVideo.create({
         _id: alert_id,
         created: new Date(),
         v: 1,

         format: format,
         key: key,
      });

      if (!newVideo) {
         // save error
         return ResponseHandler.json<ErrorResponse>(
            res,
            {
               message: "An unexpected error occurred saving the alert video",
            },
            StatusCodes.InternalServerError,
         );
      }

      // * Hand Signal Alert successfully created *

      // * Manage push notification *

      // retrieve push notification receivers
      let receivers: User[] = [];

      if (zone_id) {
         // send notification just to users of this zone

         // TODO: improve this query with proper MongoDb syntax
         const allUsers = await User.getList(null, { limit: 10000 });
         receivers = allUsers.filter((user) =>
            user.zones
               .map((zoneId) => zoneId.toHexString())
               .includes(zone_id.toHexString()),
         );
      } else {
         // send notification to all users
         const allUsers = await User.getList(null, { limit: 10000 });
         receivers = allUsers;
      }

      // create push notification
      const notification = new S2citiesPushNotification({
         type: NotificationType.HandSignalAlert,
         data: newAlert.toBasicInfo(),
      });

      // send push notification asynchronously
      sendPushNotificationTo(receivers, notification);

      return ResponseHandler.json<PostAlertsSignalforhelpApi.SuccessResponse>(
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
