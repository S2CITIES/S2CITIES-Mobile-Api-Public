import {
   ErrorResponse,
   ResponseHandler,
   StatusCodes,
} from "@/lib/response-handler";
import { NextApiResponse } from "next";
import { PostAlertsGenericApi } from "./interfaces";
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
   req: PostAlertsGenericApi.Request,
   res: NextApiResponse<PostAlertsGenericApi.EndpointResponse>,
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

      // check latitude and longitude, if present, they must be provided together
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

      const { alert_id, format, key } = req.payload;

      // check alert_id, format and key: if present, they must be provided together
      if ((alert_id || format || key) && (!alert_id || !format || !key)) {
         return ResponseHandler.json<ErrorResponse>(
            res,
            {
               message:
                  "Alert id, video format and key, if present, must be provided together to upload alert video",
            },
            StatusCodes.BadRequest,
         );
      }

      const { zone_id, address, info } = req.payload;

      if (zone_id) {
         // check if zone exists
         const zone = await Zone.getById(zone_id);

         if (!zone) {
            // zone not found
            return ResponseHandler.json<ErrorResponse>(
               res,
               { message: `Zone with id ${zone_id.toHexString()} not found` },
               StatusCodes.BadRequest,
            );
         }

         if (!latitude || !longitude) {
            // if not provided, insert zone's coordinates
            latitude = zone.latitude;
            longitude = zone.longitude;
         }
      }

      // create new Generic Alert
      const newAlert = await Alert.create(
         Alert.fromGenericInfo(
            address,
            alert_id, // might be undefined (if video is not provided)
            latitude,
            longitude,
            zone_id,
            info,
         ),
      );

      if (!newAlert) {
         // save error
         return ResponseHandler.json<ErrorResponse>(
            res,
            {
               message: "An unexpected error occurred saving the Generic alert",
            },
            StatusCodes.InternalServerError,
         );
      }

      // * alert successfully saved *

      if (alert_id) {
         // * save alert video *

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
                  message:
                     "An unexpected error occurred saving the alert video",
               },
               StatusCodes.InternalServerError,
            );
         }
      }

      // * Generic Alert successfully created here *

      // * Manage push notification *

      // retrieve push notification receivers
      let receivers: User[] = [];

      if (zone_id) {
         // send notification just to users of this zone

         // TODO: improve this query with proper MongoDb syntax
         const allUsers = await User.getList(null, { limit: 10000 });
         receivers = allUsers.filter((user) =>
            user.zones
               .map((zone) => zone.toHexString())
               .includes(zone_id.toHexString()),
         );
      } else {
         // send notification to all users
         const allUsers = await User.getList(null, { limit: 10000 });
         receivers = allUsers;
      }

      // create push notification
      const notification = new S2citiesPushNotification({
         type: NotificationType.GenericAlert,
         data: newAlert.toBasicInfo(),
      });

      // send push notification asynchronously
      sendPushNotificationTo(receivers, notification);

      return ResponseHandler.json<PostAlertsGenericApi.SuccessResponse>(
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
